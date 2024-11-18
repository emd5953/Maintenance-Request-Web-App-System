import React, { useState, useEffect } from 'react';
import axios from 'axios';

const TenantManagement = () => {
  const [tenants, setTenants] = useState([]);
  const [selectedTenant, setSelectedTenant] = useState(null);
  const [newApartment, setNewApartment] = useState('');

  // Fetch tenants on component load
  useEffect(() => {
    const fetchTenants = async () => {
      try {
        const response = await axios.get('/api/tenants');
        setTenants(response.data);
      } catch (error) {
        console.error('Error fetching tenants:', error);
      }
    };
    fetchTenants();
  }, []);

  // Delete a tenant
  const deleteTenant = async (tenantId) => {
    try {
      await axios.delete(`/api/delete-tenant/${tenantId}`);
      alert('Tenant deleted successfully!');
      setTenants(tenants.filter((tenant) => tenant.id !== tenantId));
    } catch (error) {
      console.error('Error deleting tenant:', error);
    }
  };

  // Move tenant to a new apartment
  const moveTenant = async () => {
    if (!selectedTenant || !newApartment) {
      alert('Please select a tenant and provide a new apartment number.');
      return;
    }

    try {
      await axios.patch(`/api/move-tenant/${selectedTenant.id}`, {
        apartmentNumber: newApartment,
      });
      alert('Tenant moved successfully!');
      setTenants(
        tenants.map((tenant) =>
          tenant.id === selectedTenant.id
            ? { ...tenant, apartmentNumber: newApartment }
            : tenant
        )
      );
      setSelectedTenant(null);
      setNewApartment('');
    } catch (error) {
      console.error('Error moving tenant:', error);
    }
  };

  return (
    <div>
      <h2>Tenant Management</h2>

      <div>
        <h3>All Tenants</h3>
        <ul>
          {tenants.map((tenant) => (
            <li key={tenant.id}>
              {tenant.name} - Apartment {tenant.apartmentNumber}
              <button onClick={() => deleteTenant(tenant.id)}>Delete</button>
              <button onClick={() => setSelectedTenant(tenant)}>Move</button>
            </li>
          ))}
        </ul>
      </div>

      {selectedTenant && (
        <div>
          <h3>Move Tenant: {selectedTenant.name}</h3>
          <label>
            New Apartment Number:
            <input
              type="text"
              value={newApartment}
              onChange={(e) => setNewApartment(e.target.value)}
            />
          </label>
          <button onClick={moveTenant}>Confirm Move</button>
        </div>
      )}
    </div>
  );
};

export default TenantManagement;
