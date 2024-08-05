import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import './QRPinPage.css';

const QRPinPage = () => {
    const [pin, setPin] = useState('');
    const correctPin = '2024';
    const navigate = useNavigate();

    const handleSubmit = (e) => {
        e.preventDefault();

        if (pin !== correctPin) {
            alert('Wrong Pin Number.');
            return;
        }

        const urlParams = new URLSearchParams(window.location.search);
        const userId = urlParams.get('userId');

        if (!userId) {
            alert('There is no User.');
            return;
        }

        navigate(`/qr-details?userId=${userId}`);
    };

    return (
        <div className="qr-pin-page">
            <img src="/logo.png" alt="T&T Camp" className="logo" />
            <h2>공지 발급 중입니다</h2>
            {/* <form onSubmit={handleSubmit}>
                <input
                    type="number"
                    placeholder="Insert pin"
                    value={pin}
                    onChange={(e) => setPin(e.target.value)}
                    required
                />
                <button type="submit">confirm</button>
            </form> */}
        </div>
    );
};

export default QRPinPage;
