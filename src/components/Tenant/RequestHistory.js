import React, { useState, useEffect } from 'react';
import axios from 'axios';

const RequestHistory = () => {
  const [requests, setRequests] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  // Fetch maintenance requests for the tenant
  useEffect(() => {
    const fetchRequests = async () => {
      try {
        const response = await axios.get('/api/requests'); // Replace with tenant-specific endpoint
        setRequests(response.data);
      } catch (error) {
        console.error('Error fetching request history:', error);
        setError('Failed to load request history.');
      } finally {
        setLoading(false);
      }
    };

    fetchRequests();
  }, []);

  if (loading) return <p>Loading request history...</p>;
  if (error) return <p>{error}</p>;

  return (
    <div>
      <h2>Request History</h2>
      {requests.length === 0 ? (
        <p>No maintenance requests found.</p>
      ) : (
        <ul>
          {requests.map((request) => (
            <li key={request.id}>
              <strong>{request.problemArea}</strong>: {request.description}
              <br />
              <em>Status:</em> {request.status} <br />
              <em>Date:</em> {new Date(request.timestamp).toLocaleString()}
              {request.photo && (
                <div>
                  <img
                    src={request.photo}
                    alt="Request"
                    style={{ maxWidth: '200px', marginTop: '5px' }}
                  />
                </div>
              )}
            </li>
          ))}
        </ul>
      )}
    </div>
  );
};

export default RequestHistory;

