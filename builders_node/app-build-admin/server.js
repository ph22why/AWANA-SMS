require('dotenv').config();
const express = require('express');
const path = require('path');

const app = express();
const PORT = process.env.PORT || 8080;
const BACKEND_HOST = process.env.BACKEND_HOST || 'http://localhost:5000';

// JSON 요청을 처리하기 위해 추가
app.use(express.json());

// 정적 파일 제공
app.use(express.static(path.join(__dirname, 'build')));

// 기본 경로 설정 - 모든 요청에 대해 index.html 파일을 제공
app.get('*', (req, res) => {
  res.sendFile(path.join(__dirname, 'build', 'index.html'));
});

// 서버 시작
app.listen(PORT, () => {
  console.log(`HTTP Server running on http://${BACKEND_HOST}:${PORT}`);
});
