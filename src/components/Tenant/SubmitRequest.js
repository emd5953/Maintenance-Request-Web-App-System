import React, { useState } from 'react';
import api from '../../api';

const SubmitRequest = () => {
    const [formData, setFormData] = useState({
        apartmentNumber: '',
        problemArea: '',
        description: '',
        photo: '',
    });

    const handleChange = (e) => {
        const { name, value } = e.target;
        setFormData({ ...formData, [name]: value });
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        try {
            await api.post('/submit-request', formData);
            alert('Request submitted successfully!');
            setFormData({
                apartmentNumber: '',
                problemArea: '',
                description: '',
                photo: '',
            });
        } catch (error) {
            console.error('Error submitting request:', error);
            alert('Failed to submit request.');
        }
    };

    return (
        <form onSubmit={handleSubmit}>
            <label>
                Apartment Number:
                <input type="text" name="apartmentNumber" value={formData.apartmentNumber} onChange={handleChange} required />
            </label>
            <label>
                Problem Area:
                <input type="text" name="problemArea" value={formData.problemArea} onChange={handleChange} required />
            </label>
            <label>
                Description:
                <textarea name="description" value={formData.description} onChange={handleChange} required />
            </label>
            <label>
                Photo URL (Optional):
                <input type="text" name="photo" value={formData.photo} onChange={handleChange} />
            </label>
            <button type="submit">Submit Request</button>
        </form>
    );
};

export default SubmitRequest;
