const express = require('express');
const bodyParser = require('body-parser');
const cors = require('cors');
const db = require('./firebaseConfig2'); // Import your Firebase configuration

const app = express();
const PORT = 5000; // Change this if needed

// Middleware
app.use(cors());
app.use(bodyParser.json());

// --- Routes ---
// Fetch all maintenance requests
app.get('/api/requests', async (req, res) => {
    try {
        const snapshot = await db.collection('maintenance_requests').get();
        const requests = snapshot.docs.map((doc) => ({ id: doc.id, ...doc.data() }));
        res.status(200).json(requests);
    } catch (error) {
        console.error('Error fetching requests:', error);
        res.status(500).json({ error: 'Failed to fetch requests' });
    }
});

// Submit a maintenance request
app.post('/api/submit-request', async (req, res) => {
  try {
      const newRequest = {
          apartmentNumber: req.body.apartmentNumber,
          problemArea: req.body.problemArea,
          description: req.body.description,
          status: 'pending',
          timestamp: new Date().toISOString(),
      };
      await db.collection('maintenance_requests').add(newRequest);
      res.status(201).json({ message: 'Request submitted successfully' });
  } catch (error) {
      console.error('Error adding document:', error);
      res.status(500).json({ error: 'Failed to submit request' });
  }
});
// Update request status
app.patch('/api/update-status/:id', async (req, res) => {
  try {
      const { id } = req.params; // Extract request ID from URL
      const { status } = req.body; // Extract status from the request body

      // Log received parameters
      console.log('Received ID:', id);
      console.log('Received Status:', status);

      // Validate status
      if (!['pending', 'completed'].includes(status)) {
          console.log('Invalid status');
          return res.status(400).json({ error: 'Invalid status' });
      }

      // Check if document exists
      const requestRef = db.collection('maintenance_requests').doc(id);
      const doc = await requestRef.get();
      if (!doc.exists) {
          console.log('Document not found');
          return res.status(404).json({ error: 'Request not found' });
      }

      // Update status
      console.log('Updating document...');
      await requestRef.update({ status });
      res.status(200).json({ message: 'Status updated successfully' });
      console.log('Status updated successfully');
  } catch (error) {
      console.error('Error updating status:', error); // Log the error
      res.status(500).json({ error: 'Failed to update status' });
  }
});


// Delete a tenant
app.delete('/api/delete-tenant/:tenantId', async (req, res) => {
    try {
        const { tenantId } = req.params;
        await db.collection('tenants').doc(tenantId).delete();
        res.status(200).json({ message: 'Tenant deleted successfully' });
    } catch (error) {
        console.error('Error deleting tenant:', error);
        res.status(500).json({ error: 'Failed to delete tenant' });
    }
});

// --- Conditional Start of Server ---
// Only start the server if this file is run directly
if (require.main === module) {
    app.listen(PORT, () => {
        console.log(`Server is running on http://localhost:${PORT}`);
    });
}

// Export the app for testing
module.exports = app;
