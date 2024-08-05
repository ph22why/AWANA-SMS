import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import backendHost from '../config';
import './QRDetailsPage.css';

const QRDetailsPage = () => {
  const [userDetails, setUserDetails] = useState(null);
  const [level, setLevel] = useState('');
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const navigate = useNavigate();

  useEffect(() => {
    const urlParams = new URLSearchParams(window.location.search);
    const userId = urlParams.get('userId');

    if (userId) {
      axios.get(`${backendHost}:8080/user/${userId}`)
        .then((response) => {
          if (response.data.length > 0) {
            setUserDetails(response.data[0]);
          } else {
            setError('사용자 정보를 찾을 수 없습니다.');
          }
          setLoading(false);
        })
        .catch((error) => {
          console.error('사용자 정보를 가져오는 중 오류가 발생했습니다!', error);
          setError('사용자 정보를 가져오는 중 오류가 발생했습니다!');
          setLoading(false);
        });
    } else {
      setError('사용자 ID가 제공되지 않았습니다.');
      setLoading(false);
    }
  }, []);

  const handleLevelSubmit = () => {
    const urlParams = new URLSearchParams(window.location.search);
    const userId = urlParams.get('userId');

    axios.post(`${backendHost}:8080/update-level`, { userId, level })
      .then((response) => {
        alert('Level Updated Succesfully');
        navigate('/qr-pin'); // 레벨 업데이트 후 핀 입력 페이지로 리디렉션
      })
      .catch((error) => {
        console.error('Got Error during Update Level!', error);
      });
  };

  if (loading) {
    return <div>Loading...</div>;
  }

  if (error) {
    return <div>{error}</div>;
  }

  if (!userDetails) {
    return <div>We got Error during get User ID</div>;
  }

  return (
    <div className="qr-details-page">
      <img src="/logo.png" alt="T&T Camp" className="logo" />
      <img src={userDetails.image} alt={userDetails.koreanName} className='qr_userimage' />
      <h2>{userDetails.koreanName} / {userDetails.englishName}</h2>
      <p>{userDetails.churchName}</p>
      <p>{userDetails.parentContact}</p>
      <select
        value={level}
        onChange={(e) => setLevel(e.target.value)}
        required
      >
        <option value="" disabled hidden>Select Level</option>
        <option value="1">1</option>
        <option value="2">2</option>
        <option value="3">3</option>
        <option value="4">4</option>
        <option value="5">5</option>
      </select>
      <button onClick={handleLevelSubmit}>Update Level</button>
    </div>
  );
};

export default QRDetailsPage;
