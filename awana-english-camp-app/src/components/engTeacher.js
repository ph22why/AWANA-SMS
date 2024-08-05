import React from "react";
import { Link, useNavigate } from "react-router-dom";
import Footer from "./Footer";
import "./DetailsPage.css";

const staffImage = `${process.env.PUBLIC_URL}/staffImg.png`;

function EngDetails() {
  const userData = {
    name: "HOPE",
    englishName: "호프"
  };

  const navigate = useNavigate();
  const id = 1; // id를 직접 정의합니다. 필요에 따라 수정하세요.
  const table = "staff"; // table도 직접 정의합니다. 필요에 따라 수정하세요.

  const handlePrint = () => {
    if (userData) {
      navigate(`/printstaff/${id}`, { state: { userData, table } });
    } else {
      alert("No user data found");
    }
  };

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
          </div>
        </div>
        <div className="infos" id="bottom_info">
        </div>
        <div className="actions">
          <button className="submit_btn" id="printbtn" onClick={handlePrint}>
            이름표 프린트
          </button>
        </div>
      </div>
      <Footer />
    </div>
  );
}

export default EngDetails;
