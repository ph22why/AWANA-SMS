import React, { useEffect, useState } from "react";
import { useParams, Link } from "react-router-dom";
import axios from "axios";
import "./DetailsPage.css";
import "./ChurchDetailsPage.css";
import Footer from "./Footer";
import backendHost from "../config";

function ChurchDetailsPage() {
  const { id } = useParams();
  const [students, setStudents] = useState([]);
  const [ym, setYm] = useState([]);
  const [staff, setStaff] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [activeTab, setActiveTab] = useState("students");

  useEffect(() => {
    axios
      .post(`${backendHost}:8080/checkchurch`, { churchNumber: id })
      .then((response) => {
        setStudents(response.data.students || []);
        setYm(response.data.ym || []);
        setStaff(response.data.staff || []);
        setLoading(false);
      })
      .catch((error) => {
        console.error("There was an error fetching the data!", error);
        setError("There was an error fetching the data!");
        setLoading(false);
      });
  }, [id]);

  if (loading) {
    return <div>Loading...</div>;
  }

  if (error) {
    return <div>{error}</div>;
  }

  return (
    <div className="details-page">
      <Link to="/">
        <img src="/logo.png" alt="T&T Camp" className="register_logo" />
      </Link>
      <h2 className="main_tcamp">교회별 등록 현황</h2>
      <div className="tabs">
        <button onClick={() => setActiveTab("students")}>Students</button>
        <button onClick={() => setActiveTab("ym")}>YM</button>
        <button onClick={() => setActiveTab("staff")}>Staff</button>
      </div>
      <div id="lists">
        {activeTab === "students" && students.length > 0 && students.map((student, index) => (
          <div className="info-card" key={index}>
            <div className="infos" id="top_info">
              <div className="information" id="infos">
                <p id="index">
                  {index + 1}. {student.koreanName} {student.englishName}
                </p>
                <p className="name" id="index">
                  {student.parentContact}
                </p>
                <p className="name" id="studentlists">
                  옷 사이즈: {student.shirtSize}
                </p>
              </div>
            </div>
          </div>
        ))}
        {activeTab === "students" && students.length === 0 && (
          <div>No students data found</div>
        )}

        {activeTab === "ym" && ym.length > 0 && ym.map((item, index) => (
          <div className="info-card" key={index}>
            <div className="infos" id="top_info">
              <div className="information" id="infos">
                <p id="index">
                  {index + 1}. {item.name}
                </p>
                <p className="name" id="index">
                  {item.contact}
                </p>
                <p className="name" id="studentlists">
                  옷 사이즈: {item.shirtSize}
                </p>
              </div>
            </div>
          </div>
        ))}
        {activeTab === "ym" && ym.length === 0 && (
          <div>No ym data found</div>
        )}

        {activeTab === "staff" && staff.length > 0 && staff.map((item, index) => (
          <div className="info-card" key={index}>
            <div className="infos" id="top_info">
              <div className="information" id="infos">
                <p id="index">
                  {index + 1}. {item.name}
                </p>
                <p className="name" id="index">
                  {item.contact}
                </p>
                <p className="name" id="studentlists">
                  옷 사이즈: {item.shirtSize}
                </p>
              </div>
            </div>
          </div>
        ))}
        {activeTab === "staff" && staff.length === 0 && (
          <div>No staff data found</div>
        )}
      </div>
      <Footer />
    </div>
  );
}

export default ChurchDetailsPage;
