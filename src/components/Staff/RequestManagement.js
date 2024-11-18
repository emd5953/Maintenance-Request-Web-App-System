import React, { useState, useEffect } from 'react';
import axios from 'axios';

const RequestManagement = () => {
    const [requests, setRequests] = useState([]);
    const [filters, setFilters] = useState({ apartment: '', area: '', status: '' });

    useEffect(() => {
        const fetchRequests = async () => {
            try {
                const response = await axios.get('/api/requests', { params: filters });
                setRequests(response.data);
            } catch (error) {
                console.error(error);
            }
        };
        fetchRequests();
    }, [filters]);

    const handleFilterChange = (e) => {
        const { name, value } = e.target;
        setFilters({ ...filters, [name]: value });
    };

    const handleStatusUpdate = async (id) => {
        try {
            await axios.patch(`/api/update-status/${id}`, { status: 'completed' });
            alert('Status updated!');
        } catch (error) {
            console.error(error);
        }
    };

    return (
        <div>
            <h2>Request Management</h2>
            <div>
                <label>
                    Apartment:
                    <input type="text" name="apartment" onChange={handleFilterChange} />
                </label>
                <label>
                    Area:
                    <select name="area" onChange={handleFilterChange}>
                        <option value="">All</option>
                        <option value="kitchen">Kitchen</option>
                        <option value="bathroom">Bathroom</option>
                    </select>
                </label>
                <label>
                    Status:
                    <select name="status" onChange={handleFilterChange}>
                        <option value="">All</option>
                        <option value="pending">Pending</option>
                        <option value="completed">Completed</option>
                    </select>
                </label>
            </div>
            <ul>
                {requests.map((req) => (
                    <li key={req.id}>
                        {req.description} - {req.status}
                        {req.status === 'pending' && (
                            <button onClick={() => handleStatusUpdate(req.id)}>Mark as Completed</button>
                        )}
                    </li>
                ))}
            </ul>
        </div>
    );
};

export default RequestManagement;
