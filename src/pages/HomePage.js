import React from 'react';

const HomePage = () => {
    return (
        <div style={{ textAlign: 'center', padding: '20px' }}>
            <h1>Welcome to the Maintenance Request System</h1>
            <p>Select a role to continue:</p>
            <ul style={{ listStyle: 'none', padding: 0 }}>
                <li>
                    <a href="/manager" style={{ margin: '10px', fontSize: '18px' }}>Manager Dashboard</a>
                </li>
                <li>
                    <a href="/staff" style={{ margin: '10px', fontSize: '18px' }}>Staff Dashboard</a>
                </li>
                <li>
                    <a href="/tenant" style={{ margin: '10px', fontSize: '18px' }}>Tenant Dashboard</a>
                </li>
            </ul>
        </div>
    );
};

export default HomePage;
