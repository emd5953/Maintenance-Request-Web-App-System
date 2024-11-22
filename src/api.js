import axios from 'axios';

const API_BASE_URL = 'http://localhost:5000';

// Submit a maintenance request
const submitRequest = async (formData) => {
    return await axios.post(`${API_BASE_URL}/submit-request`, formData, {
        headers: {
            'Content-Type': 'multipart/form-data',
        },
    });
};

// Fetch all maintenance requests
const fetchRequests = async () => {
    return await axios.get(`${API_BASE_URL}/requests`);
};

// Update request status
const updateRequestStatus = async (id, status) => {
    return await axios.patch(`${API_BASE_URL}/update-status/${id}`, { status });
};

// Group functions into an API object
const api = {
    submitRequest,
    fetchRequests,
    updateRequestStatus,
};

// Export named and default exports
export { submitRequest, fetchRequests, updateRequestStatus };
export default api;
