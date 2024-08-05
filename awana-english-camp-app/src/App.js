import React from 'react';
import { Routes, Route } from 'react-router-dom';
import DetailsPage from './components/DetailsPage';
import MainPage from './components/MainPage';
import RegisterPage from './components/RegisterPage';
import SelectRolePage from './components/SelectRolePage';
import ChurchPage from './components/ChruchPage';
import StaffPage from './components/StaffPage';
import YMPage from './components/YMPage';
import VideoPage from './components/VideoPage';
import PrintPage from './components/PrintPage';   
import PrintStaffPage from './components/PrintStaffPage';   
import QRPinPage from './components/QRPinPage';
import QRDetailsPage from './components/QRDetailsPage';
import ChurchDetailsPage from './components/ChurchDetailsPage';
import StaffDetailsPage from './components/StaffDetailsPage';
import EngDetails from './components/engTeacher';


function App() {
  return (
    <Routes>
      {/* <Route path="/main" element={<MainPage />} /> */}
      <Route path="/register/church" element={<ChurchPage />} />
      <Route path="/register/student" element={<RegisterPage />} />
      <Route path="/register/ym" element={<YMPage />} />
      <Route path="/register/staff" element={<StaffPage />} />
      <Route path="/select-role" element={<SelectRolePage />} />
      <Route path="/video" element={<VideoPage />} />
      <Route path="/details/:id" element={<DetailsPage />} />
      <Route path="/staffdetails/:id" element={<StaffDetailsPage />} />
      <Route path='churchdetails/:id' element={<ChurchDetailsPage />} />
      <Route path="/print/:id" element={<PrintPage />} />
      <Route path="/printstaff/:id" element={<PrintStaffPage />} />
      <Route path="/" element={<MainPage />} />
      <Route path="/qr-pin" element={<QRPinPage />} />
      <Route path="/qr-details" element={<QRDetailsPage />} />
      <Route path="/engdetails" element={<EngDetails />} />
    </Routes>
  );
}

export default App;