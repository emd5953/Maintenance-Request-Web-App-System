import React, { useState } from 'react';
import axios from 'axios';

const AddTenant = () => {
    const [tenantData, setTenantData] = useState({
        name: '',
        phone: '',
        email: '',
        apartmentNumber: '',
        checkIn: '',
        checkOut: '',
    });
    const [loading, setLoading] = useState(false); //loading state

    const handleChange = (e) => {
        const { name, value } = e.target;
        setTenantData({ ...tenantData, [name]: value });
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setLoading(true); //start Loading

        // Simple validation for empty fields
        if (!tenantData.name || !tenantData.phone || !tenantData.email || !tenantData.apartmentNumber || !tenantData.checkIn) {
            alert("Please fill in all required fields!");
            return;
        }

        try {
            await axios.post('/api/add-tenant', tenantData);
            alert('Tenant added successfully!');
            setTenantData({
                name: '',
                phone: '',
                email: '',
                apartmentNumber: '',
                checkIn: '',
                checkOut: '',
            }); // Reset the form
        } catch (error) {
            if (error.response) {
                // Handle backend validation errors
                alert(error.response.data.error || 'An error occurred. Please try again.');
            } else {
                console.error("Error adding tenant:", error);
                alert('Failed to add tenant. Please try again.');
            }
        } finally {
            setLoading(false);
        }
    
    };

    return (
        <form onSubmit={handleSubmit} style={{ display: "flex", flexDirection: "column", gap: "10px", maxWidth: "400px", margin: "auto" }}>
            <label>
                Name: <input type="text" name="name" onChange={handleChange} value={tenantData.name} required />
            </label>
            <label>
                Phone: <input type="text" name="phone" onChange={handleChange} value={tenantData.phone} required />
            </label>
            <label>
                Email: <input type="email" name="email" onChange={handleChange} value={tenantData.email} required />
            </label>
            <label>
                Apartment: <input type="text" name="apartmentNumber" onChange={handleChange} value={tenantData.apartmentNumber} required />
            </label>
            <label>
                Check-in: <input type="date" name="checkIn" onChange={handleChange} value={tenantData.checkIn} required />
            </label>
            <label>
                Check-out: <input type="date" name="checkOut" onChange={handleChange} value={tenantData.checkOut} />
            </label>
            <button type="submit" disabled={loading} style={{ padding: "10px 20px", background: "#007BFF", color: "white", border: "none", borderRadius: "5px" }}>
                {loading ? "Adding..." : "Add Tenant"}
            </button>
        </form>
    );
    
};

export default AddTenant;
