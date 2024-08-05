import React, { useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import axios from "axios";
import Footer from "./Footer";
import "./RegisterPage.css";
import backendHost from "../config";

function RegisterPage() {
  const [koreanName, setKoreanName] = useState("");
  const [englishName, setEnglishName] = useState("");
  const [churchName, setChurchName] = useState("");
  const [churchNumber, setChurchNumber] = useState("");
  const [parentContact, setParentContact] = useState("");
  const [healthNotes, setHealthNotes] = useState("");
  const [shirtSize, setShirtSize] = useState("");
  const [gender, setGender] = useState("");
  const [image, setImage] = useState(null);
  const [isImageUploaded, setIsImageUploaded] = useState(false);
  const [showImage, setShowImage] = useState(false);

  const navigate = useNavigate();

  const handleInputChange = (e) => {
    // 입력값에서 숫자만 추출
    const numericValue = e.target.value.replace(/\D/g, '');
    setParentContact(numericValue);
  };

  const handleToggle = () => {
    setShowImage(!showImage);
  };

  const handleImageUpload = (e) => {
    const file = e.target.files[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        setImage(reader.result);
      };
      reader.readAsDataURL(file);
      setIsImageUploaded(true);
    } else {
      setIsImageUploaded(false);
    }
  };

  const handleSubmit = (e) => {
    e.preventDefault();

    if (
      !koreanName ||
      !englishName ||
      !churchName ||
      !churchNumber ||
      !parentContact ||
      !image ||
      !shirtSize
    ) {
      alert("모든 필수 입력 필드를 입력해주세요.");
      return;
    }

    // Check if image is uploaded
    if (!isImageUploaded) {
      const imageInput = document.getElementById("file-input");
      imageInput.setCustomValidity("이미지를 업로드해주세요.");
      imageInput.reportValidity();
      return;
    } else {
      const imageInput = document.getElementById("file-input");
      imageInput.setCustomValidity("");
    }

    const userData = {
      koreanName,
      englishName,
      churchName,
      churchNumber,
      parentContact,
      healthNotes,
      shirtSize,
      gender,
      image,
    };

    console.log("Submitting user data:", userData);
    axios
      .post(`${backendHost}:8080/register/student`, userData)
      .then((response) => {
        console.log("Registration successful:", response.data);
        alert("등록이 완료되었습니다.");
        // navigate(`/details/${response.data.id}`);
        navigate(`/`);
      })
      .catch((error) => {
        console.error("There was an error registering the user!", error);
      });
  };

  return (
    <div className="register-page">
      <Link to="/">
        <img src="/logo.png" alt="T&T Camp" className="register_logo" id="logo_Reg" />
      </Link>
      <h2 className="main_tcamp" id="let_Reg">학생 등록 페이지</h2>
      <form onSubmit={handleSubmit} className="form">
        <div className="image-upload required">
          <label htmlFor="file-input">
            {image ? (
              <img src={image} alt="Uploaded" className="uploaded-image" />
            ) : (
              <div className="upload-placeholder">
                <img
                  src="/upload-icon.png"
                  alt="Upload"
                  className="upload-icon"
                />
              </div>
            )}
          </label>
          <input
            className="student_input"
            id="file-input"
            type="file"
            accept="image/*"
            onChange={handleImageUpload}
            required
            title="이미지를 업로드해주세요."
            style={{
              opacity: 0,
              position: "absolute",
              left: "0",
              top: "0",
              width: "100%",
              height: "100%",
              zIndex: "1",
              cursor: "pointer",
            }}
          />
        </div>
        <input
          type="text"
          placeholder="한글이름"
          value={koreanName}
          onChange={(e) => setKoreanName(e.target.value)}
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
        <input
          type="text"
          placeholder="부모 연락처 (숫자만입력)"
          value={parentContact}
          onChange={handleInputChange}
          required
          className="student_input"
        />
        <select
          value={gender}
          onChange={(e) => setGender(e.target.value)}
          required
          id="select_sex"
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
          value={shirtSize}
          onChange={(e) => setShirtSize(e.target.value)}
          required
          id="select_size"
          className="register_select"
        >
          <option value="" disabled hidden>
            T&T 단복 사이즈
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
          <option className="option" value="4XL">
            4XL (교사 L와 동일)
          </option>
          <option className="option" value="5XL">
            5XL (교사 XL와 동일)
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
              <img src="/tntsize.jpg" alt="T&T Camp" className="toggle_image" />
            </div>
          )}
        </div>
        <input
          className="student_input"
          type="text"
          id="healthNotes"
          placeholder="건강 특이사항"
          value={healthNotes}
          onChange={(e) => setHealthNotes(e.target.value)}
        />
        <button className="main_btn" id="submit" type="submit">
          등록
        </button>
      </form>
      <Footer />
    </div>
  );
}

export default RegisterPage;
