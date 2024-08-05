import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import './MainPage.css';

const MainPage = () => {
  const [pin, setPin] = useState('');
  const [error, setError] = useState('');
  const navigate = useNavigate();

  const handlePinChange = (e) => {
    setPin(e.target.value);
  };

  const handlePinSubmit = (e) => {
    e.preventDefault();
    if (pin === '2024') {
      navigate('/admin');
    } else {
      setError('Invalid PIN');
    }
  };

  const handleAttendanceSubmit = (e) => {
    e.preventDefault();
    navigate('/attendance');
  };

  return (
    <div className="main-page">
      <h1>Enter PIN</h1>
      <form onSubmit={handlePinSubmit}>
        <input
          type="password"
          placeholder="Enter PIN"
          value={pin}
          onChange={handlePinChange}
          required
        />
        <button type="submit">Submit</button>
      </form>
      {error && <p className="error">{error}</p>}
      <h1>Attendance Check</h1>
      <form onSubmit={handleAttendanceSubmit}>
        <button type="submit">Go to Attendance</button>
      </form>
    </div>
  );
};

export default MainPage;
