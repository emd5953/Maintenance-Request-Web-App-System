import React, { useState } from 'react';
import axios from 'axios';

const SubmitRequest = () => {
    const [formData, setFormData] = useState({
        apartmentNumber: '',
        problemArea: '',
        description: '',
        photo: null,
    });

    const handleChange = (e) => {
        const { name, value } = e.target;
        setFormData({ ...formData, [name]: value });
    };

    const handleFileChange = (e) => {
        setFormData({ ...formData, photo: e.target.files[0] });
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        const form = new FormData();
        Object.entries(formData).forEach(([key, value]) => form.append(key, value));

        try {
            const response = await axios.post('/api/submit-request', form);
            alert('Request submitted successfully!');
        } catch (error) {
            console.error(error);
            alert('Failed to submit request.');
        }
    };

    return (
        <form onSubmit={handleSubmit}>
            <label>
                Apartment Number:
                <input type="text" name="apartmentNumber" onChange={handleChange} required />
            </label>
            <label>
                Problem Area:
                <select name="problemArea" onChange={handleChange} required>
                    <option value="">Select</option>
                    <option value="kitchen">Kitchen</option>
                    <option value="bathroom">Bathroom</option>
                    <option value="bedroom">Bedroom</option>
                </select>
            </label>
            <label>
                Description:
                <textarea name="description" onChange={handleChange} required />
            </label>
            <label>
                Photo:
                <input type="file" name="photo" onChange={handleFileChange} />
            </label>
            <button type="submit">Submit Request</button>
        </form>
    );
};

export default SubmitRequest;
