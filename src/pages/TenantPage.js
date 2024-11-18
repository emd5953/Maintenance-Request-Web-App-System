import React from 'react';
import SubmitRequest from '../components/Tenant/SubmitRequest';
import RequestHistory from '../components/Tenant/RequestHistory';

const TenantPage = () => {
  return (
    <div>
      <h1>Tenant Dashboard</h1>
      <SubmitRequest />
      <RequestHistory />
    </div>
  );
};

export default TenantPage;
