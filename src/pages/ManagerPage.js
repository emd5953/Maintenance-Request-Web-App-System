import React from 'react';
import AddTenant from '../components/Manager/AddTenant';
import TenantManagement from '../components/Manager/TenantManagement';

const ManagerPage = () => {
  return (
    <div>
      <h1>Manager Portal</h1>
      <AddTenant />
      <hr />
      <TenantManagement />
    </div>
  );
};

export default ManagerPage;
