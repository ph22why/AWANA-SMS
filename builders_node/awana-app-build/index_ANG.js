require('dotenv').config();
const express = require('express');
const mysql = require('mysql');
const bodyParser = require('body-parser');
const cors = require('cors');
const QRCode = require('qrcode');
const path = require('path');
const os = require('os');
const fs = require('fs');
const https = require('https');
const networkInterfaces = os.networkInterfaces();
const app = express();
const PORT = process.env.PORT || 8003;

// SSL 인증서 경로 가져오기
const httpsKeyPath = process.env.HTTPS_KEY_PATH || '/path/to/your/localhost-key.pem';
const httpsCertPath = process.env.HTTPS_CERT_PATH || '/path/to/your/localhost.pem';

// SSL 인증서 파일 읽기
const options = {
  key: fs.readFileSync(httpsKeyPath),
  cert: fs.readFileSync(httpsCertPath)
};

const backendHost = process.env.BACKEND_HOST || 'https://your-domain-name';

app.use(cors({
  origin: '*',
  methods: 'GET,HEAD,PUT,PATCH,POST,DELETE',
  credentials: true,
  preflightContinue: true,
  optionsSuccessStatus: 204
}));

app.use(bodyParser.json({ limit: '50mb' }));
app.use(bodyParser.urlencoded({ limit: '50mb', extended: true }));
app.use(express.static(path.join(__dirname, 'build')));

const dbConfig = {
  host: process.env.DB_HOST || '10.0.0.1',
  user: process.env.DB_USER || 'awanam',
  password: process.env.DB_PASSWORD || 'awana6533!!',
  database: process.env.DB_NAME || 'awanam',
};

let db;
function handleDisconnect() {
  db = mysql.createPool(dbConfig);

  db.on('connection', (connection) => {
    console.log('MySQL Connected');
    connection.on('error', (err) => {
      console.error('MySQL error', err);
      if (err.code === 'PROTOCOL_CONNECTION_LOST') {
        handleDisconnect();
      } else {
        throw err;
      }
    });

    connection.on('close', (err) => {
      console.error('MySQL close', err);
      if (err.code === 'PROTOCOL_CONNECTION_LOST') {
        handleDisconnect();
      } else {
        throw err;
      }
    });
  });
}

handleDisconnect();

app.get("/", (req, res) => {
  res.sendFile(path.join(__dirname, "/build/index.html"));
});

app.post(`${backendHost}/register/student`, (req, res) => {
  console.log('Received request to register student:', req.body);
  const { koreanName, englishName, churchName, churchNumber, parentContact, healthNotes, shirtSize, gender, image } = req.body;

  const sql = `INSERT INTO students (koreanName, englishName, churchName, churchNumber, parentContact, healthNotes, shirtSize, gender, image)
               VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?)`;

  db.query(sql, [koreanName, englishName, churchName, churchNumber, parentContact, healthNotes, shirtSize, gender, image], (err, result) => {
    if (err) {
      console.error('Error inserting data:', err);
      res.status(500).send('Error inserting data');
      return;
    }

    const userId = result.insertId;
    console.log('Data inserted with ID:', userId);

    QRCode.toDataURL(`https://your-domain-name/qr-pin?userId=${userId}`, (err, url) => {
      if (err) {
        console.error('Error generating QR code:', err);
        return res.status(500).send('Error generating QR code');
      }
      console.log('QR code generated:', url);
    
      let updateSql = 'UPDATE students SET qrCode = ? WHERE id = ?';
      db.query(updateSql, [url, userId], (err, updateResult) => {
        if (err) {
          console.error('Error updating user with QR code:', err);
          return res.status(500).send('Error updating user with QR code');
        }
        res.status(200).json({ id: userId });
      });
    });       
  });
});


app.post(`${backendHost}/register/ym`, (req, res) => {
  const { churchName, gender, awanaRole, position, contact, shirtSize } = req.body;

  const sql = `INSERT INTO ym (churchName, gender, awanaRole, position, contact, shirtSize)
               VALUES (?, ?, ?, ?, ?, ?)`;

  db.query(sql, [churchName, gender, awanaRole, position, contact, shirtSize], (err, result) => {
    if (err) {
      console.error('Error inserting data:', err);
      res.status(500).send('Error inserting data');
    } else {
      res.status(200).json({ id: result.insertId });
    }
  });
});

app.post(`${backendHost}/register/staff`, (req, res) => {
  const { churchName, gender, awanaRole, position, contact, shirtSize } = req.body;

  const sql = `INSERT INTO staff (churchName, gender, awanaRole, position, contact, shirtSize)
               VALUES (?, ?, ?, ?, ?, ?)`;

  db.query(sql, [churchName, gender, awanaRole, position, contact, shirtSize], (err, result) => {
    if (err) {
      console.error('Error inserting data:', err);
      res.status(500).send('Error inserting data');
    } else {
      res.status(200).json({ id: result.insertId });
    }
  });
});

app.post(`${backendHost}/register/church`, (req, res) => {
  const { churchName, name, contact, churchNumber } = req.body;

  const sql = `INSERT INTO church (churchName, name, contact, churchNumber)
               VALUES (?, ?, ?, ?, ?, ?)`;

  db.query(sql, [churchName, name, contact, churchNumber], (err, result) => {
    if (err) {
      console.error('Error inserting data:', err);
      res.status(500).send('Error inserting data');
    } else {
      res.status(200).json({ id: result.insertId });
    }
  });
});

app.post(`${backendHost}/checkUser`, (req, res) => {
  const { name, parentContact } = req.body;
  let sql = 'SELECT id FROM students WHERE koreanName = ? AND parentContact = ?';
  let values = [name, parentContact];
  db.query(sql, values, (err, result) => {
    if (err) {
      console.error('Error checking user data:', err);
      res.status(500).send('Error checking user data');
    } else if (result.length > 0) {
      res.status(200).json(result[0]);
    } else {
      res.status(200).json({});
    }
  });
});

app.get(`${backendHost}/user/:id`, (req, res) => {
  let sql = 'SELECT * FROM students WHERE id = ?';
  let values = [req.params.id];
  db.query(sql, values, (err, result) => {
    if (err) {
      console.error('Error fetching data:', err);
      res.status(500).send('Error fetching data');
    } else {
      res.status(200).json(result);
    }
  });
});

app.get(`${backendHost}/user`, (req, res) => {
  const { name, parentContact } = req.query;
  let sql = 'SELECT * FROM students WHERE koreanName = ? AND parentContact = ?';
  let values = [name, parentContact];
  db.query(sql, values, (err, result) => {
    if (err) {
      res.status(500).send('Error fetching data');
    } else {
      res.status(200).json(result);
    }
  });
});

app.post(`${backendHost}/update-level`, (req, res) => {
  const { userId, level } = req.body;

  const sql = 'UPDATE students SET level = ? WHERE id = ?';

  db.query(sql, [level, userId], (err, result) => {
    if (err) {
      console.error('Error updating level:', err);
      res.status(500).send('Error updating level');
      return;
    }

    res.status(200).send('Level updated successfully');
  });
});

app.get(`${backendHost}/admin/:type`, (req, res) => {
  const type = req.params.type;
  const search = req.query.search;
  let sql = `SELECT * FROM ${type}`;

  if (search) {
    sql += ` WHERE koreanName LIKE '%${search}%' OR englishName LIKE '%${search}%' OR churchName LIKE '%${search}%'`;
  }

  db.query(sql, (err, results) => {
    if (err) {
      res.status(500).json({ error: err });
    } else {
      res.status(200).json(results);
    }
  });
});

app.delete(`${backendHost}/admin/:type/:id`, (req, res) => {
  const type = req.params.type;
  const id = req.params.id;
  const sql = `DELETE FROM ${type} WHERE id = ?`;

  db.query(sql, [id], (err, result) => {
    if (err) {
      res.status(500).json({ error: err });
    } else {
      res.status(200).json(result);
    }
  });
});

app.post(`${backendHost}/attendance`, (req, res) => {
  const { qrCode } = req.body;

  const studentId = qrCode.split('id=')[1]; // qrCode로부터 studentId 추출

  const sqlInsertAttendance = 'INSERT INTO attendance (studentId) VALUES (?)';
  db.query(sqlInsertAttendance, [studentId], (err, result) => {
    if (err) {
      console.error('Error recording attendance:', err);
      res.status(500).send('Error recording attendance');
      return;
    }

    const sqlGetStudent = 'SELECT koreanName, englishName FROM students WHERE id = ?';
    db.query(sqlGetStudent, [studentId], (err, studentResult) => {
      if (err) {
        console.error('Error fetching student data:', err);
        res.status(500).send('Error fetching student data');
        return;
      }

      const studentData = studentResult[0];
      res.status(200).json({
        name: `${studentData.koreanName} / ${studentData.englishName}`,
        id: studentId,
      });
    });
  });
});

const startServer = () => {
  const server = https.createServer(options, app).listen(PORT, '0.0.0.0', () => {
    const interfaces = networkInterfaces;
    let addresses = [];
    for (let k in interfaces) {
      for (let k2 in interfaces[k]) {
        let address = interfaces[k][k2];
        if (address.family === 'IPv4' && !address.internal) {
          addresses.push(address.address);
        }
      }
    }
    console.log(`HTTPS Server running on https://${addresses.length ? addresses[0] : 'localhost'}:${PORT}`);
    console.log('MySQL Connected...');
  });

  server.on('error', (err) => {
    if (err.code === 'EADDRINUSE') {
      console.error(`Port ${PORT} is already in use. Retrying...`);
      setTimeout(() => {
        server.close();
        startServer();
      }, 1000); // 1초 후 다시 시도
    } else {
      console.error(err);
    }
  });
};

startServer();