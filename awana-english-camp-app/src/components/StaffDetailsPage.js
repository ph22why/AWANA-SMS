import React, { useEffect, useState } from "react";
import { useParams, Link, useLocation, useNavigate } from "react-router-dom";
import axios from "axios";
import Footer from "./Footer";
import "./DetailsPage.css";
import backendHost from "../config";

const staffImage = `${process.env.PUBLIC_URL}/staffImg.png`;

function StaffDetailsPage() {
  const { id } = useParams();
  const location = useLocation();
  const { table } = location.state || { table: "staff" };
  const [userData, setUserData] = useState(null);
  const [formData, setFormData] = useState({
    name: "",
    englishName: "",
    churchName: "",
    churchNumber: "",
    contact: "",
    position: "",
    awanaRole: "",
    gender: "",
    shirtSize: ""
  });
  const [loading, setLoading] = useState(true);
  const [isEditing, setIsEditing] = useState(false);

  const endpoint = table === "staff" ? "staff" : "ym";

  useEffect(() => {
    axios
      .get(`${backendHost}:8080/${endpoint}/${id}`)
      .then((response) => {
        console.log("User Data:", response.data);
        if (response.data) {
          setUserData(response.data);
          setFormData({
            name: response.data.name || "",
            englishName: response.data.englishName || "",
            churchName: response.data.churchName || "",
            churchNumber: response.data.churchNumber || "",
            contact: response.data.contact || "",
            position: response.data.position || "",
            awanaRole: response.data.awanaRole || "",
            gender: response.data.gender || "",
            shirtSize: response.data.shirtSize || ""
          });
        } else {
          setUserData(null);
        }
        setLoading(false);
      })
      .catch((error) => {
        console.error("There was an error fetching the user data!", error);
        setLoading(false);
      });
  }, [id, table, endpoint]);

  const navigate = useNavigate();

  const handlePrint = () => {
    if (userData) {
      navigate(`/printstaff/${id}`, { state: { userData, table } });
    } else {
      alert("No user data found");
    }
  };

  const handleEditClick = () => {
    setIsEditing(!isEditing);
  };

  const handleFormChange = (e) => {
    const { name, value } = e.target;
    setFormData({
      ...formData,
      [name]: value
    });
  };

  const handleFormSubmit = (e) => {
    e.preventDefault();
    axios
      .put(`${backendHost}:8080/${endpoint}/${id}`, formData)
      .then((response) => {
        console.log("Update successful:", response.data);
        setUserData(response.data);
        setIsEditing(false);
        alert("수정이 완료되었습니다.");
        window.location.reload();
      })
      .catch((error) => {
        console.error("There was an error updating the user data!", error);
        alert("수정 중 오류가 발생했습니다.");
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
          <img src={staffImage} alt="Uploaded" className="uploaded-image" />
          <div className="information">
            <p className="name" translate="no" lang="ko">
              {userData.name}
            </p>
            <p className="name" translate="no" lang="en" id="engName">
              {userData.englishName ? userData.englishName : "EngName"}
            </p>
            <p className="church" translate="no" lang="ko">
              {userData.churchName}
            </p>
            <p className="contact">{userData.contact}</p>
          </div>
        </div>
        <div className="infos" id="bottom_info">
          <div className="qr-placeholder">
            <img src={userData.qrCode} alt="QR Code" className="qr-code" />
          </div>
        </div>
        <div className="actions">
          <button className="submit_btn" id="editbtn" onClick={handleEditClick}>
            수정
          </button>
          <button className="submit_btn" id="printbtn" onClick={handlePrint}>
            이름표 프린트
          </button>
        </div>
        {isEditing && (
          <div className="edit-form">
            <form onSubmit={handleFormSubmit} className="form">
              <input
                type="text"
                placeholder="한글이름"
                name="name"
                value={formData.name}
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
                placeholder="연락처 (숫자만입력)"
                name="contact"
                value={formData.contact}
                onChange={(e) =>
                  setFormData({
                    ...formData,
                    contact: e.target.value.replace(/\D/g, "")
                  })
                }
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
              {table === "staff" ? (
                <>
                  <input
                    type="text"
                    placeholder="직분"
                    name="position"
                    value={formData.position}
                    onChange={handleFormChange}
                    required
                    className="student_input"
                  />
                  <input
                    type="text"
                    placeholder="어와나 역할"
                    name="awanaRole"
                    value={formData.awanaRole}
                    onChange={handleFormChange}
                    required
                    className="student_input"
                  />
                </>
              ) : (
                <>
                  <select
                    name="awanaRole"
                    value={formData.awanaRole}
                    onChange={handleFormChange}
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
                    name="position"
                    value={formData.position}
                    onChange={handleFormChange}
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
                </>
              )}
              <select
                name="gender"
                value={formData.gender}
                onChange={handleFormChange}
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
                name="shirtSize"
                value={formData.shirtSize}
                onChange={handleFormChange}
                required
                className="register_select"
              >
                <option value="" disabled hidden>
                  옷 사이즈
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
              <button className="main_btn" id="submit" type="submit">
                저장
              </button>
            </form>
          </div>
        )}
      </div>
      <Footer />
    </div>
  );
}

export default StaffDetailsPage;
