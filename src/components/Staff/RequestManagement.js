import React, { useState, useEffect } from 'react';
import { submitRequest, fetchRequests, updateRequestStatus } from '../../api';


const RequestManagement = () => {
    const [requests, setRequests] = useState([]);

    useEffect(() => {
        const fetchRequests = async () => {
            try {
                const response = await api.get('/requests');
                setRequests(response.data);
            } catch (error) {
                console.error('Error fetching requests:', error);
            }
        };

        fetchRequests();
    }, []);

    const updateStatus = async (id, status) => {
        try {
            await api.patch(`/update-status/${id}`, { status });
            alert('Status updated successfully!');
            // Refresh requests
            setRequests((prev) =>
                prev.map((request) =>
                    request.id === id ? { ...request, status } : request
                )
            );
        } catch (error) {
            console.error('Error updating status:', error);
            alert('Failed to update status.');
        }
    };

    return (
        <div>
            <h2>Manage Maintenance Requests</h2>
            <ul>
                {requests.map((request) => (
                    <li key={request.id}>
                        <strong>Apartment:</strong> {request.apartmentNumber} <br />
                        <strong>Problem:</strong> {request.problemArea} <br />
                        <strong>Status:</strong> {request.status} <br />
                        <button onClick={() => updateStatus(request.id, 'completed')}>Mark as Completed</button>
                        <button onClick={() => updateStatus(request.id, 'pending')}>Mark as Pending</button>
                    </li>
                ))}
            </ul>
        </div>
    );
};

export default RequestManagement;
