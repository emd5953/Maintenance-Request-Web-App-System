import React from 'react';
import SubmitRequest from '../components/Tenant/SubmitRequest';
import RequestHistory from '../components/Tenant/RequestHistory';

const TenantPage = () => {
    return (
        <div style={{ padding: '20px' }}>
            <h1>Tenant Dashboard</h1>
            <div>
                <h2>Submit Maintenance Request</h2>
                <SubmitRequest />
            </div>
            <div style={{ marginTop: '40px' }}>
                <h2>Request History</h2>
                <RequestHistory />
            </div>
        </div>
    );
};

export default TenantPage;
