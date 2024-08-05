import React from 'react';
import { useNavigate, Link } from 'react-router-dom';
import Footer from './Footer';
import './SelectRolePage.css';

function SelectRolePage() {
  const navigate = useNavigate();

  return (
    <div className="select-role-page">
      <Link to="/">
        <img src="/logo.png" alt="T&T Camp" className="main_logo" />
      </Link>
      <h3 className='main_tcamp'>해당 버튼을 선택하세요</h3>
      <button className='select_btn' id="register" onClick={() => navigate('/register/student')}>T&T 클럽원</button>
      <button className='select_btn' id="submit" onClick={() => navigate('/register/ym')}>YM</button>
      <button className='select_btn' id="submit" onClick={() => navigate('/register/staff')}>인솔교사 / 스탭</button>
      <button className='select_btn' id="submit" onClick={() => navigate('/register/church')}>교회 담당자</button>
      <Footer />
    </div>
  );
}

export default SelectRolePage;
