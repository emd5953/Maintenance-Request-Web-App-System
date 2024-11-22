import React, { useState, useEffect } from 'react';
import { submitRequest, fetchRequests, updateRequestStatus } from '../../api';


const TenantManagement = () => {
    const [tenants, setTenants] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    useEffect(() => {
        const fetchTenants = async () => {
            try {
                const response = await api.get('/tenants');
                setTenants(response.data);
                setLoading(false);
            } catch (error) {
                console.error('Error fetching tenants:', error);
                setError('Failed to fetch tenants');
                setLoading(false);
            }
        };

        fetchTenants();
    }, []);

    const deleteTenant = async (tenantId) => {
        try {
            await api.delete(`/delete-tenant/${tenantId}`);
            alert('Tenant deleted successfully!');
            setTenants(tenants.filter((tenant) => tenant.id !== tenantId));
        } catch (error) {
            console.error('Error deleting tenant:', error);
            alert('Failed to delete tenant.');
        }
    };

    const moveTenant = async (tenantId, newApartmentNumber) => {
        try {
            await api.patch(`/move-tenant/${tenantId}`, { apartmentNumber: newApartmentNumber });
            alert('Tenant moved successfully!');
            setTenants(
                tenants.map((tenant) =>
                    tenant.id === tenantId
                        ? { ...tenant, apartmentNumber: newApartmentNumber }
                        : tenant
                )
            );
        } catch (error) {
            console.error('Error moving tenant:', error);
            alert('Failed to move tenant.');
        }
    };

    if (loading) return <p>Loading tenants...</p>;
    if (error) return <p>{error}</p>;

    return (
        <div>
            <h2>Tenant Management</h2>
            {tenants.length > 0 ? (
                <table>
                    <thead>
                        <tr>
                            <th>Name</th>
                            <th>Phone</th>
                            <th>Email</th>
                            <th>Apartment</th>
                            <th>Actions</th>
                        </tr>
                    </thead>
                    <tbody>
                        {tenants.map((tenant) => (
                            <tr key={tenant.id}>
                                <td>{tenant.name}</td>
                                <td>{tenant.phone}</td>
                                <td>{tenant.email}</td>
                                <td>{tenant.apartmentNumber}</td>
                                <td>
                                    <button
                                        onClick={() => {
                                            const newApartment = prompt(
                                                'Enter new apartment number:',
                                                tenant.apartmentNumber
                                            );
                                            if (newApartment) moveTenant(tenant.id, newApartment);
                                        }}
                                    >
                                        Move
                                    </button>
                                    <button onClick={() => deleteTenant(tenant.id)}>Delete</button>
                                </td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            ) : (
                <p>No tenants found.</p>
            )}
        </div>
    );
};

export default TenantManagement;
