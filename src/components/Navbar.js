import React from 'react';
import { Link } from 'react-router-dom';

const Navbar = () => {
    return (
        <nav>
            <ul>
                <li><Link to="/">Tenant Dashboard</Link></li>
                <li><Link to="/staff">Staff Dashboard</Link></li>
                <li><Link to="/manager">Manager Dashboard</Link></li>
            </ul>
        </nav>
    );
};

export default Navbar;
