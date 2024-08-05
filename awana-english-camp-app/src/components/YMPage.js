import React, { useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import axios from "axios";
import Footer from "./Footer";
import "./RegisterPage.css";
import "./YMPage.css";
import backendHost from "../config";

function YMPage() {
  const [name, setName] = useState("");
  const [englishName, setEnglishName] = useState("");
  const [churchName, setChurchName] = useState("");
  const [gender, setGender] = useState("");
  const [churchNumber, setChurchNumber] = useState("");
  const [awanaRole, setAwanaRole] = useState("");
  const [position, setPosition] = useState("");
  const [contact, setContact] = useState("");
  const [shirtSize, setShirtSize] = useState("");
  const navigate = useNavigate();
  const [showImage, setShowImage] = useState(false);

  const handleToggle = () => {
    setShowImage(!showImage);
  };

  const handleInputChange = (e) => {
    // 입력값에서 숫자만 추출
    const numericValue = e.target.value.replace(/\D/g, '');
    setContact(numericValue);
  };

  const handleSubmit = (e) => {
    e.preventDefault();

    if (
      !name ||
      !englishName ||
      !churchName ||
      !gender ||
      !churchNumber ||
      !awanaRole ||
      !position ||
      !contact ||
      !shirtSize
    ) {
      alert("모든 필수 입력 필드를 입력해주세요.");
      return;
    }

    const userData = {
      name,
      englishName,
      churchName,
      churchNumber,
      gender,
      awanaRole,
      position,
      contact,
      shirtSize,
    };

    console.log("Submitting user data:", userData);
    axios
      .post(`${backendHost}:8080/register/ym`, userData)
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
    <div className="YM-page">
      <Link to="/">
        <img src="/logo.png" alt="T&T Camp" className="register_logo" style={{marginTop: "40px"}}/>
      </Link>
      <h2 className="main_tcamp">YM 등록 페이지</h2>
      <form onSubmit={handleSubmit} className="form">
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
          placeholder="영어이름"
          value={englishName}
          onChange={(e) => setEnglishName(e.target.value)}
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
          pattern="\d{3}"
          title="교회 등록번호는 반드시 3자리 숫자여야 합니다."
        />
        <select
          value={gender}
          onChange={(e) => setGender(e.target.value)}
          required
          className="register_select"
        >
          <option value="" disabled hidden>
            성별
          </option>
          <option className="option" value="남자">
            남자
          </option>
          <option className="option" value="여자">
            여자
          </option>
        </select>
        <select
          value={awanaRole}
          onChange={(e) => setAwanaRole(e.target.value)}
          required
          className="register_select"
        >
          <option value="" disabled hidden>
            클럽
          </option>
          <option className="option" value="TREK">
            TREK
          </option>
          <option className="option" value="JOURNEY">
            JOURNEY
          </option>
        </select>
        <select
          value={position}
          onChange={(e) => setPosition(e.target.value)}
          required
          className="register_select"
        >
          <option value="" disabled hidden>
            학년
          </option>
          <option className="option" value="1학년">
            1학년
          </option>
          <option className="option" value="2학년">
            2학년
          </option>
          <option className="option" value="3학년">
            3학년
          </option>
        </select>
        <select
          value={shirtSize}
          onChange={(e) => setShirtSize(e.target.value)}
          required
          className="register_select"
        >
          <option value="" disabled hidden>
            단복 사이즈
          </option>
          <option className="option" value="XS">
            XS
          </option>
          <option className="option" value="S">
            S
          </option>
          <option className="option" value="M">
            M
          </option>
          <option className="option" value="L">
            L
          </option>
          <option className="option" value="XL">
            XL
          </option>
          <option className="option" value="2XL">
            2XL
          </option>
          <option className="option" value="3XL">
            3XL
          </option>
        </select>
        <div>
          <h5
            onClick={handleToggle}
            style={{ cursor: "pointer", color: "white", textAlign: "center" }}
          >
            {showImage ? "단복 사이즈 표 ▲" : "단복 사이즈 표 ▼"}
          </h5>
          {showImage && (
            <div className="image-container">
              <img
                src="/staffsize.jpg"
                alt="T&T Camp"
                className="toggle_image"
              />
            </div>
          )}
        </div>
        <button id="submit" className="main_btn" type="submit" style={{marginBottom: "90px"}}>
          등록
        </button>
      </form>
      <Footer />
    </div>
  );
}

export default YMPage;
