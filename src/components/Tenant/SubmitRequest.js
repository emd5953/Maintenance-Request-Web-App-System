import React, { useState } from 'react';
import api from '../../api';


const SubmitRequest = () => {
    const [formData, setFormData] = useState({
        apartmentNumber: '',
        problemArea: '',
        description: '',
    });

    const [photo, setPhoto] = useState(null); // State for the photo file
    const [isLoading, setIsLoading] = useState(false); // State for loading status

    // Handle input field changes
    const handleChange = (e) => {
        const { name, value } = e.target;
        setFormData({ ...formData, [name]: value });
    };

    // Handle photo file changes
    const handleFileChange = (e) => {
        setPhoto(e.target.files[0]); // Save the uploaded file
    };

    // Handle form submission
    const handleSubmit = async (e) => {
        e.preventDefault();

        const formDataToSend = new FormData();
        // Append text fields
        Object.entries(formData).forEach(([key, value]) => {
            formDataToSend.append(key, value);
        });

        // Append photo file if uploaded
        if (photo) {
            formDataToSend.append('photo', photo);
        }

        setIsLoading(true); // Start loading

        try {
            const response = await api.post('/submit-request', formDataToSend, {
                headers: { 'Content-Type': 'multipart/form-data' },
            });
            alert('Request submitted successfully!');
            console.log('Response:', response.data);
            // Reset the form
            setFormData({ apartmentNumber: '', problemArea: '', description: '' });
            setPhoto(null);
        } catch (error) {
            console.error('Error submitting request:', error.response?.data || error.message);
            alert('Failed to submit request.');
        }finally {
            setIsLoading(false);
        }
    };

    return (
        <form onSubmit={handleSubmit}>
            <div>
                <label>Apartment Number:</label>
                <input
                    type="text"
                    name="apartmentNumber"
                    value={formData.apartmentNumber}
                    onChange={handleChange}
                    required
                />
            </div>
            <div>
                <label>Problem Area:</label>
                <input
                    type="text"
                    name="problemArea"
                    value={formData.problemArea}
                    onChange={handleChange}
                    required
                />
            </div>
            <div>
                <label>Description:</label>
                <textarea
                    name="description"
                    value={formData.description}
                    onChange={handleChange}
                    required
                ></textarea>
            </div>
            <div>
                <label>Photo (Optional):</label>
                <input type="file" name="photo" onChange={handleFileChange} />
            </div>
            <button type="submit">Submit Request</button>
        </form>
    );
};

export default SubmitRequest;
