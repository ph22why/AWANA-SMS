import React from 'react';
import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';
import AdminPage from './components/AdminPage';
import MainPage from './components/MainPage';
import AttendancePage from './components/AttendancePage';

function App() {
  return (
    <Router>
      <Routes>
        <Route path="/admin" element={<AdminPage />} />
        <Route path="/" element={<MainPage />} />
        <Route path='/attendance' element={<AttendancePage />} />\
      </Routes>
    </Router>
  );
}

export default App;
