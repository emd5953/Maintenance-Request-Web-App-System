const express = require("express");
const bodyParser = require("body-parser");
const cors = require("cors");
const db = require("./firebaseConfig");

const app = express();
const PORT = 5000;

// Middleware
app.use(cors());
app.use(bodyParser.json());

// --- Routes ---

// Test API
app.get("/", (req, res) => {
  res.send("Backend is running!");
});

// Add a maintenance request
app.post("/api/submit-request", async (req, res) => {
  try {
    const data = req.body;
    const newRequest = {
      apartmentNumber: data.apartmentNumber,
      problemArea: data.problemArea,
      description: data.description,
      photo: data.photo || null, // Optional photo URL
      status: "pending",
      timestamp: new Date().toISOString(),
    };
    await db.collection("maintenance_requests").add(newRequest);
    res.status(201).json({ message: "Request submitted successfully" });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "Failed to submit request" });
  }
});

// Get all maintenance requests
app.get("/api/requests", async (req, res) => {
  try {
    const snapshot = await db.collection("maintenance_requests").get();
    const requests = snapshot.docs.map((doc) => ({ id: doc.id, ...doc.data() }));
    res.status(200).json(requests);
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "Failed to fetch requests" });
  }
});

// Start the server
app.listen(PORT, () => {
  console.log(`Server is running on http://localhost:${PORT}`);
});
