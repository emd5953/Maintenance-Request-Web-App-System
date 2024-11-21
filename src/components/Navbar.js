import React from 'react';
import { Link } from 'react-router-dom';

const Navbar = () => {
    return (
        <nav style={{ padding: '10px', background: '#f8f8f8' }}>
            <Link to="/manager" style={{ margin: '0 10px' }}>Manager</Link>
            <Link to="/staff" style={{ margin: '0 10px' }}>Staff</Link>
            <Link to="/tenant" style={{ margin: '0 10px' }}>Tenant</Link>
        </nav>
    );
};

export default Navbar;
