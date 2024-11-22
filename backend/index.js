const express = require('express');
const bodyParser = require('body-parser');
const cors = require('cors');
const db = require('./firebaseConfig2'); // Import your Firebase configuration
const { unlink } = require('fs/promises'); // For deleting temporary files after upload

const app = express();
const PORT = 5000; // Change this if needed

const multer = require('multer');

const upload = multer({ dest: 'uploads/' }); // Configure file upload


// Middleware
app.use(cors());
app.use(bodyParser.json());

// --- Routes ---
app.get('/', (req, res) => {
  res.send(`
    <h1>Welcome to the Maintenance Request API</h1>
    <><p>Use the following endpoints:</p>
    <ul>
      <li><strong>GET /requests</strong> - Fetch all maintenance requests</li>
      <li><strong>POST /submit-request</strong> - Submit a new maintenance request</li>
      <li><strong>PATCH /update-status</strong> - Update a request status</li>
      <li><strong>DELETE /delete-tenant/:tenantId</strong> - Delete a tenant</li>
    </ul>
  `);
});

// Fetch all maintenance requests
app.get('/requests', async (req, res) => {
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
app.post('/submit-request', upload.single('photo'), async (req, res) => {
  try {
    const { apartmentNumber, problemArea, description } = req.body;
    const file = req.file;

    // Validate input
    if (!apartmentNumber || !problemArea || !description) {
      return res.status(400).json({ error: 'Missing required fields' });
    }


   // Upload photo to Imgur (if provided)
    let photoUrl = null;
    if (file) {
      const imgurResponse = await axios.post(
        'https://api.imgur.com/3/image',
        { image: file.path, type: 'file' },
        { headers: { Authorization: `e90c56180adc64d` } }
      );
      photoUrl = imgurResponse.data.data.link;
    }

    const newRequest = {
      apartmentNumber,
      problemArea,
      description,
      photo: photoUrl, // Add photo URL to the document
      status: 'pending',
      timestamp: new Date().toISOString(),
    };

    const docRef = await db.collection('maintenance_requests').add(newRequest);
    res.status(201).json({ message: 'Request submitted successfully', id: docRef.id, photo: photoUrl });
  } catch (error) {
    console.error('Error submitting request:', error);
    res.status(500).json({ error: 'Failed to submit request' });
  }
});

// Update request status
app.patch('/update-status/:id', async (req, res) => {
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
app.delete('/delete-tenant/:tenantId', async (req, res) => {
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
