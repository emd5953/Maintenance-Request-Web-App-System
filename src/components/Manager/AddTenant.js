import React, { useState } from 'react';
import api from '../../api';

const AddTenant = () => {
    const [tenantData, setTenantData] = useState({
        name: '',
        phone: '',
        email: '',
        apartmentNumber: '',
        checkIn: '',
        checkOut: '',
    });

    const handleChange = (e) => {
        const { name, value } = e.target;
        setTenantData({ ...tenantData, [name]: value });
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        try {
            await api.post('/add-tenant', tenantData);
            alert('Tenant added successfully!');
            setTenantData({
                name: '',
                phone: '',
                email: '',
                apartmentNumber: '',
                checkIn: '',
                checkOut: '',
            });
        } catch (error) {
            console.error('Error adding tenant:', error);
            alert('Failed to add tenant.');
        }
    };

    return (
        <form onSubmit={handleSubmit}>
            <label>
                Name:
                <input type="text" name="name" value={tenantData.name} onChange={handleChange} required />
            </label>
            <label>
                Phone:
                <input type="text" name="phone" value={tenantData.phone} onChange={handleChange} required />
            </label>
            <label>
                Email:
                <input type="email" name="email" value={tenantData.email} onChange={handleChange} required />
            </label>
            <label>
                Apartment Number:
                <input type="text" name="apartmentNumber" value={tenantData.apartmentNumber} onChange={handleChange} required />
            </label>
            <label>
                Check-In Date:
                <input type="date" name="checkIn" value={tenantData.checkIn} onChange={handleChange} required />
            </label>
            <label>
                Check-Out Date:
                <input type="date" name="checkOut" value={tenantData.checkOut} onChange={handleChange} />
            </label>
            <button type="submit">Add Tenant</button>
        </form>
    );
};

export default AddTenant;
