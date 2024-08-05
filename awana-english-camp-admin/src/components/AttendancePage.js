import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios"; // axios 임포트 추가

const backendHost = "http://localhost"; // 또는 실제 백엔드 서버 주소로 변경

const AttendanceCheckAdminPage = () => {
  const [search, setSearch] = useState("");
  const [day, setDay] = useState("");
  const [session, setSession] = useState("");
  const [group, setGroup] = useState("");
  const [team, setTeam] = useState("");
  const [attendanceData, setAttendanceData] = useState([]);
  const [attendanceSummary, setAttendanceSummary] = useState({});
  const navigate = useNavigate();

  useEffect(() => {
    handleSearch();
  }, []);

  const handleSearch = async () => {
    try {
      const response = await axios.get(`${backendHost}:8080/attendance`, {
        params: { search, day, session, group, team },
      });
      setAttendanceData(response.data);
      calculateSummary(response.data);
    } catch (error) {
      console.error("Error fetching attendance data:", error);
    }
  };

  const calculateSummary = (data) => {
    const summary = {};
    data.forEach((row) => {
      Object.keys(row).forEach((key) => {
        if (key !== "id" && key !== "student_id" && key !== "koreanName" && key !== "englishName" && key !== "studentGroup" && key !== "team") {
          if (!summary[key]) summary[key] = { checked: 0, total: 0 };
          if (row[key]) summary[key].checked += 1;
          summary[key].total += 1;
        }
      });
    });
    setAttendanceSummary(summary);
  };

  const handleDayChange = (e) => {
    setDay(e.target.value);
    setSession("");
  };

  const handleSessionChange = (e) => {
    setSession(e.target.value);
  };

  const handleTitleClick = () => {
    navigate("/");
  };

  const downloadExcel = async () => {
    try {
      const response = await axios.get(`${backendHost}:8080/download`, {
        params: { search, day, session, group, team },
        responseType: 'blob' // 응답 데이터 형식 설정
      });
      const url = window.URL.createObjectURL(new Blob([response.data]));
      const link = document.createElement('a');
      link.href = url;
      link.setAttribute('download', 'attendance.xlsx'); // 다운로드할 파일 이름 설정
      document.body.appendChild(link);
      link.click();
    } catch (error) {
      console.error("Error downloading Excel file:", error);
    }
  };

  return (
    <div className="attendance-admin-page">
      <h1 onClick={handleTitleClick} style={{ cursor: "pointer" }}>
        Admin Page
      </h1>
      <div className="filters">
        <input
          type="text"
          placeholder="한글/영어 이름 검색"
          value={search}
          onChange={(e) => setSearch(e.target.value)}
        />
        <select
          className="AttendanceSearchList"
          value={group}
          onChange={(e) => setGroup(e.target.value)}
        >
          <option value="">그룹 선택</option>
          <option value="KNOW">KNOW</option>
          <option value="LOVE">LOVE</option>
          <option value="SERVE">SERVE</option>
          <option value="GLORY">GLORY</option>
          <option value="HOLY">HOLY</option>
          <option value="GRACE">GRACE</option>
        </select>
        <select
          className="AttendanceSearchList"
          value={team}
          onChange={(e) => setTeam(e.target.value)}
        >
          <option value="">조 선택</option>
          <option value="1">1</option>
          <option value="2">2</option>
          <option value="3">3</option>
          <option value="4">4</option>
          <option value="5">5</option>
        </select>
        <button onClick={handleSearch}>Search</button>
        <button onClick={handleSearch}>새로고침</button>
        <button onClick={downloadExcel}>Download Excel</button>
      </div>
      <table>
        <thead>
          <tr>
            <th>학생 ID</th>
            <th>한글 이름</th>
            <th>영어 이름</th>
            <th>그룹</th>
            <th>조</th>
            {Object.keys(attendanceSummary).map((key) => (
              <th key={key}>
                {key} <br /> {attendanceSummary[key].checked}/{attendanceSummary[key].total}
              </th>
            ))}
          </tr>
        </thead>
        <tbody>
          {attendanceData.map((row) => (
            <tr key={row.id}>
              <td>{row.student_id}</td>
              <td>{row.koreanName}</td>
              <td>{row.englishName}</td>
              <td>{row.studentGroup}</td>
              <td>{row.team}</td>
              {Object.keys(attendanceSummary).map((key) => (
                <td key={key}>{row[key] ? "✔" : ""}</td>
              ))}
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};

export default AttendanceCheckAdminPage;
