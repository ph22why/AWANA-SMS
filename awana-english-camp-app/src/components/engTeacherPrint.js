import React, { useEffect, useState } from 'react';
import { useParams, useLocation, useNavigate } from 'react-router-dom';
import axios from 'axios';
import './PrintPage.css';
import backendHost from '../config';

const staffImage = `${process.env.PUBLIC_URL}/staff.jpg`;

function PrintStaffPage() {
  const { id } = useParams();
  const location = useLocation();
  const navigate = useNavigate();
  const [userData, setUserData] = useState(location.state?.userData || null);
  const [loading, setLoading] = useState(true);
  const [imageLoaded, setImageLoaded] = useState(false);
  const table = location.state?.table || "staff";

  useEffect(() => {
    if (!userData) {
      const endpoint = table === "staff" ? "staff" : "ym";
      axios.get(`${backendHost}:8080/${endpoint}/${id}`)
        .then(response => {
          if (response.data) {
            setUserData(response.data);
          } else {
            setUserData(null);
          }
          setLoading(false);
        })
        .catch(error => {
          console.error('There was an error fetching the user data!', error);
          setLoading(false);
        });
    } else {
      setLoading(false);
    }
  }, [id, table, userData]);

  useEffect(() => {
    const handlePageLoad = () => {
      if (userData && imageLoaded) {
        setTimeout(() => {
          window.print();
        }, 1000);
      }
    };

    if (document.readyState === 'complete') {
      handlePageLoad();
    } else {
      window.addEventListener('load', handlePageLoad);
      return () => window.removeEventListener('load', handlePageLoad);
    }
  }, [userData, imageLoaded]);

  useEffect(() => {
    const handleAfterPrint = () => {
      navigate(`/staffdetails/${id}`, { replace: true, state: { table } });
    };

    window.addEventListener('afterprint', handleAfterPrint);

    return () => {
      window.removeEventListener('afterprint', handleAfterPrint);
    };
  }, [navigate, id, table]);

  const handleImageLoad = () => {
    setImageLoaded(true);
  };

  if (loading) {
    return <div>Loading...</div>;
  }

  if (!userData) {
    return <div>No user data found</div>;
  }

  return (
    <div className="print-page">
      <div className="print-background">
        <img src='/backimageqr.jpg' alt='background' className='background-image' onLoad={handleImageLoad} />
        <div className="print-content">
          <div className="p_user-info">
            <div className="p_church" translate="no" lang="ko">{userData.churchName}</div>
            <div className="p_name" translate="no" lang="ko">{userData.name}</div>
            <div className='p_engname' translate="no" lang="en">
              {userData.englishName || ""}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default PrintStaffPage;
