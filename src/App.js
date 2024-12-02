import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import HomePage from './pages/HomePage';
import TenantPage from './pages/TenantPage';
import StaffPage from './pages/StaffPage';
import ManagerPage from './pages/ManagerPage';
import Navbar from './components/Navbar';

function App() {
    return (
        <Router>
            <Navbar />
            <Routes>
                <Route path="/" element={<HomePage />} />
                <Route path="/tenant" element={<TenantPage />} />
                <Route path="/staff" element={<StaffPage />} />
                <Route path="/manager" element={<ManagerPage />} />
            </Routes>
        </Router>
    );
}

export default App;
