import React, { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import axios from 'axios';
import './PrintPage.css';
import backendHost from '../config';

function PrintPage() {
  const { id } = useParams();
  const [userData, setUserData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [imageLoaded, setImageLoaded] = useState(false);
  const navigate = useNavigate();

  useEffect(() => {
    axios.get(`${backendHost}:8080/user/${id}`)
      .then(response => {
        console.log('User Data:', response.data);
        if (response.data.length > 0) {
          setUserData(response.data[0]);
        } else {
          setUserData(null);
        }
        setLoading(false);
      })
      .catch(error => {
        console.error('There was an error fetching the user data!', error);
        setLoading(false);
      });
  }, [id]);

  useEffect(() => {
    const handlePageLoad = () => {
      if (userData && imageLoaded) {
        setTimeout(() => {
          window.print();
          setTimeout(() => {
            navigate(`/details/${id}`);
          }, 500);
        }, 1000);
      }
    };
  
    if (document.readyState === 'complete') {
      handlePageLoad();
    } else {
      window.addEventListener('load', handlePageLoad);
      return () => window.removeEventListener('load', handlePageLoad);
    }
  }, [userData, imageLoaded, navigate, id]);

  const handleImageLoad = () => {
    setImageLoaded(true);
  };

  if (!userData) {
    return <div>No user data found</div>;
  }

  return (
    <div className="print-page">
      <div className="print-background">
        <img src='/printImg.jpg' alt='background' className='background-image' onLoad={handleImageLoad} />
        <div className="print-content">
          <div className="p_qr-code">
            <img src={userData.qrCode} alt="QR Code" className="p_qr-image" />
          </div>
          <div className="p_user-info">
            <div className="p_church">{userData.churchName}</div>
            <div className="p_name">{userData.koreanName}</div>
            <div className='p_engname'>{userData.englishName}</div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default PrintPage;
