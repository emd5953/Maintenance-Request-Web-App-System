const axios = require('axios');
require('dotenv').config();
const express = require('express');
const bodyParser = require('body-parser');
const cors = require('cors');
const multer = require('multer');
const { unlink } = require('fs/promises'); // For deleting temporary files after upload
const fs = require('fs');
const db = require('./firebaseConfig2'); // Import your Firebase configuration

const app = express();
const PORT = process.env.PORT || 5000; // Use PORT from environment or default to 5000

// Configure Multer for file uploads
const upload = multer({ dest: 'uploads/' });

// Middleware
app.use(cors());
app.use(bodyParser.json());

// --- Routes ---
app.get('/', (req, res) => {
  res.send(`
    <h1>Welcome to the Maintenance Request API</h1>
    <p>Use the following endpoints:</p>
    <ul>
      <li><strong>GET /requests</strong> - Fetch all maintenance requests</li>
      <li><strong>POST /submit-request</strong> - Submit a new maintenance request</li>
      <li><strong>PATCH /update-status/:id</strong> - Update a request status</li>
      <li><strong>DELETE /delete-tenant/:tenantId</strong> - Delete a tenant</li>
    </ul>
  `);
});

// Fetch all maintenance requests
app.get('/requests', async (req, res) => {
  try {
    const snapshot = await db.collection('maintenance_requests').get();
    const requests = snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
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

    // Validate file type if a file is uploaded
    if (file && !['image/jpeg', 'image/png'].includes(file.mimetype)) {
      await unlink(file.path); // Delete the invalid file
      return res.status(400).json({ error: 'Invalid file type. Only JPEG and PNG are allowed.' });
    }

    // Upload photo to Imgur (if provided)
    let photoUrl = null;
    if (file) {
      try {
        const clientId = process.env.IMGUR_CLIENT_ID;

        // Convert the image to base64
        const fileBuffer = fs.readFileSync(file.path);
        const base64Image = fileBuffer.toString('base64');

        // Upload to Imgur
        const imgurResponse = await axios.post(
          'https://api.imgur.com/3/image',
          { image: base64Image, type: 'base64' },
          { headers: { Authorization: `Client-ID ${clientId}` } }
        );

        photoUrl = imgurResponse.data.data.link;

        // Delete the temporary file
        await unlink(file.path);
      } catch (uploadError) {
        console.error('Error uploading photo:', uploadError);
        return res.status(500).json({ error: 'Failed to upload photo' });
      }
    }

    const newRequest = {
      apartmentNumber,
      problemArea,
      description,
      photo: photoUrl,
      status: 'pending',
      timestamp: new Date().toISOString(),
    };

    const docRef = await db.collection('maintenance_requests').add(newRequest);
    res.status(201).json({
      message: 'Request submitted successfully',
      id: docRef.id,
      photo: photoUrl,
    });
  } catch (error) {
    console.error('Error submitting request:', error);
    res.status(500).json({ error: 'Failed to submit request' });
  }
});

// Update request status
app.patch('/update-status/:id', async (req, res) => {
  try {
    const { id } = req.params;
    const { status } = req.body;

    if (!['pending', 'completed'].includes(status)) {
      return res.status(400).json({ error: 'Invalid status' });
    }

    const requestRef = db.collection('maintenance_requests').doc(id);
    const doc = await requestRef.get();
    if (!doc.exists) {
      return res.status(404).json({ error: 'Request not found' });
    }

    await requestRef.update({ status });
    res.status(200).json({ message: 'Status updated successfully' });
  } catch (error) {
    console.error('Error updating status:', error);
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

// Start the server
if (require.main === module) {
  app.listen(PORT, () => {
    console.log(`Server is running on http://localhost:${PORT}`);
  });
}

// Export the app for testing
module.exports = app;
