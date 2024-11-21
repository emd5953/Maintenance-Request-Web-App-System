import React, { useState, useEffect } from 'react';
import api from '../../api';

const RequestHistory = () => {
    const [requests, setRequests] = useState([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchRequests = async () => {
            try {
                const response = await api.get('/requests');
                setRequests(response.data);
                setLoading(false);
            } catch (error) {
                console.error('Error fetching requests:', error);
                setLoading(false);
            }
        };

        fetchRequests();
    }, []);

    if (loading) {
        return <p>Loading...</p>;
    }

    return (
        <div>
            <h2>Maintenance Request History</h2>
            {requests.length > 0 ? (
                <ul>
                    {requests.map((request) => (
                        <li key={request.id}>
                            <strong>Apartment:</strong> {request.apartmentNumber} <br />
                            <strong>Problem:</strong> {request.problemArea} <br />
                            <strong>Description:</strong> {request.description} <br />
                            <strong>Status:</strong> {request.status} <br />
                            {request.photo && (
                                <>
                                    <strong>Photo:</strong> <a href={request.photo} target="_blank" rel="noopener noreferrer">View</a>
                                </>
                            )}
                        </li>
                    ))}
                </ul>
            ) : (
                <p>No requests found.</p>
            )}
        </div>
    );
};

export default RequestHistory;
