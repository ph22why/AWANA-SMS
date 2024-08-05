import React, { useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import axios from "axios";
import Footer from "./Footer";
import "./RegisterPage.css";
import "./ChurchPage.css";
import backendHost from "../config";

function ChurchPage() {
  const [name, setName] = useState("");
  const [churchName, setChurchName] = useState("");
  const [churchNumber, setChurchNumber] = useState("");
  const [contact, setContact] = useState("");
  const navigate = useNavigate();

  const handleInputChange = (e) => {
    // 입력값에서 숫자만 추출
    const numericValue = e.target.value.replace(/\D/g, '');
    setContact(numericValue);
  };

  const handleSubmit = (e) => {
    e.preventDefault();

    if (
      !name ||
      !churchName ||
      !contact ||
      !churchNumber
    ) {
      alert("모든 필수 입력 필드를 입력해주세요.");
      return;
    }

    const userData = {
      name,
      churchName,
      contact,
      churchNumber,
    };

    console.log("Submitting user data:", userData);
    axios
      .post(`${backendHost}:8080/register/church`, userData)
      .then((response) => {
        console.log("Registration successful:", response.data);
        alert("등록이 완료되었습니다.");
        navigate("/");
      })
      .catch((error) => {
        console.error("There was an error registering the user!", error);
      });
  };

  return (
    <div className="Church-page">
      <Link to="/">
        <img src="/logo.png" alt="T&T Camp" className="register_logo" />
      </Link>
      <h2 className="main_tcamp">교회 등록 페이지</h2>
      <form onSubmit={handleSubmit} className="form">
          <input
            type="text"
            placeholder="교회명"
            value={churchName}
            onChange={(e) => setChurchName(e.target.value)}
            required
            className="student_input"
          />
          <input
            type="text"
            placeholder="교회 등록번호"
            value={churchNumber}
            onChange={(e) => setChurchNumber(e.target.value)}
            required
            className="student_input"
          />
        <input
          type="text"
          placeholder="이름"
          value={name}
          onChange={(e) => setName(e.target.value)}
          required
          className="student_input"
        />
        <input
          type="text"
          placeholder="연락처 (숫자만입력)"
          value={contact}
          onChange={handleInputChange}
          required
          className="student_input"
        />
        <button id='submit' className='main_btn' type="submit">등록</button>
      </form>
      <Footer />
    </div>
  );
}

export default ChurchPage;
