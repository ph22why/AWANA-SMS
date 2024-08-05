import React, { useEffect, useState } from "react";
import { useParams, Link, useNavigate } from "react-router-dom";
import axios from "axios";
import "./DetailsPage.css";
import Footer from "./Footer";
import backendHost from "../config";

function DetailsPage() {
  const { id } = useParams();
  const [userData, setUserData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [isEditing, setIsEditing] = useState(false);
  const [formData, setFormData] = useState({
    image: "",
    koreanName: "",
    englishName: "",
    churchName: "",
    churchNumber: "",
    parentContact: "",
    gender: "",
    shirtSize: "",
    healthNotes: ""
  });
  const navigate = useNavigate();

  useEffect(() => {
    axios
      .get(`${backendHost}:8080/user/${id}`)
      .then((response) => {
        console.log("User Data:", response.data);
        if (response.data.length > 0) {
          setUserData(response.data[0]);
          setFormData(response.data[0]);
        } else {
          setUserData(null);
        }
        setLoading(false);
      })
      .catch((error) => {
        console.error("There was an error fetching the user data!", error);
        setLoading(false);
      });
  }, [id]);

  const handlePrint = async () => {
    try {
      const response = await axios.get(`${backendHost}:8080/user/${id}`);
      const userData = response.data.length > 0 ? response.data[0] : null;

      if (userData) {
        navigate(`/print/${id}`, { state: { userData } });
      } else {
        alert('No user data found');
      }
    } catch (error) {
      console.error('Error fetching user data:', error);
    }
  };

  const handleEditClick = () => {
    setIsEditing(!isEditing);
  };

  const handleFormChange = (e) => {
    const { name, value } = e.target;
    setFormData({
      ...formData,
      [name]: value,
    });
  };

  const handleImageUpload = (e) => {
    const file = e.target.files[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        setFormData({ ...formData, image: reader.result });
        setUserData({ ...userData, image: reader.result });
      };
      reader.readAsDataURL(file);
    }
  };

  const handleFormSubmit = (e) => {
    e.preventDefault();
    const updatedData = { ...formData };

    axios
      .put(`${backendHost}:8080/user/${id}`, updatedData)
      .then((response) => {
        alert("정보가 성공적으로 수정되었습니다.");
        setUserData({ ...userData, ...updatedData });
        setIsEditing(false);
      })
      .catch((error) => {
        console.error("Error updating user data:", error);
      });
  };

  if (loading) {
    return <div>Loading...</div>;
  }

  if (!userData) {
    return <div>No user data found</div>;
  }

  return (
    <div className="details-page">
      <Link to="/">
        <img src="/logo.png" alt="T&T Camp" className="register_logo" />
      </Link>
      <div className="info-card">
        <div className="infos" id="top_info">
          <img src={userData.image} alt="Uploaded" className="uploaded-image" />
          <div className="information">
            <p className="name" translate="no" lang="ko">{userData.koreanName}</p>
            <p className="name" translate="no" lang="en" id="engName">
              {userData.englishName}
            </p>
            <p className="church" translate="no" lang="ko">{userData.churchName}</p>
            <p className="contact">{userData.parentContact}</p>
          </div>
        </div>
        <div className="infos" id="bottom_info">
          <div className="qr-placeholder">
            <img src={userData.qrCode} alt="QR Code" className="qr-code" />
          </div>
        </div>
      </div>
      <div className="actions">
        <button
          className="submit_btn"
          id="editbtn"
          onClick={handleEditClick}
        >
          수정
        </button>
        <button className="submit_btn" id="printbtn" onClick={handlePrint}>
          이름표 프린트
        </button>
      </div>
      {isEditing && (
        <div className="edit-form">
          <form onSubmit={handleFormSubmit} className="form">
            <div className="image-upload">
              <label htmlFor="file-input">
                {formData.image && typeof formData.image === "string" ? (
                  <img
                    src={formData.image}
                    alt="Uploaded"
                    className="uploaded-image"
                  />
                ) : (
                  <div className="upload-placeholder">
                    <img
                      src={userData.image}
                      alt="Uploaded"
                      className="uploaded-image"
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
              name="koreanName"
              value={formData.koreanName}
              onChange={handleFormChange}
              required
              className="student_input"
            />
            <input
              type="text"
              placeholder="영어이름"
              name="englishName"
              value={formData.englishName}
              onChange={handleFormChange}
              required
              className="student_input"
            />
            <input
              type="text"
              placeholder="교회명"
              name="churchName"
              value={formData.churchName}
              onChange={handleFormChange}
              required
              className="student_input"
            />
            <input
              type="text"
              placeholder="교회 등록번호"
              name="churchNumber"
              value={formData.churchNumber}
              onChange={handleFormChange}
              required
              className="student_input"
              pattern="\d{3}"
              title="교회 등록번호는 반드시 3자리 숫자여야 합니다."
            />
            <input
              type="text"
              placeholder="부모 연락처 (숫자만입력)"
              name="parentContact"
              value={formData.parentContact}
              onChange={handleFormChange}
              required
              className="student_input"
            />
            <select
              name="gender"
              value={formData.gender}
              onChange={handleFormChange}
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
              name="shirtSize"
              value={formData.shirtSize}
              onChange={handleFormChange}
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

            <input
              className="student_input"
              type="text"
              id="healthNotes"
              name="healthNotes"
              placeholder="건강 특이사항"
              value={formData.healthNotes}
              onChange={handleFormChange}
            />
            <button className="main_btn" id="submit" type="submit">
              저장
            </button>
          </form>
        </div>
      )}
      <Footer />
    </div>
  );
}

export default DetailsPage;
