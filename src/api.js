import axios from 'axios';

const API_BASE_URL = 'http://localhost:5000';

// Submit a maintenance request
export const submitRequest = async (formData) => {
    return await axios.post(API_URL, formData, {
        headers: {
            'Content-Type': 'multipart/form-data',
        },
    });
};
// Fetch all maintenance requests
export const fetchRequests = async () => {
    return await axios.get(`${API_BASE_URL}/requests`);
};

// Update request status
export const updateRequestStatus = async (id, status) => {
    return await axios.patch(`${API_BASE_URL}/update-status/${id}`, { status });
};
