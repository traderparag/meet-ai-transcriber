const express = require('express');
const cors = require('cors');

const app = express();
const PORT = process.env.PORT || 3000;

app.use(cors());
app.use(express.json());

app.get("/", (req, res) => {
    res.send("AI Transcriber API is Running!");
});

// Placeholder for Transcription API
app.post("/transcribe", (req, res) => {
    const { audioData } = req.body;

    // Mock response for testing
    res.json({ transcript: "This is a sample transcription." });
});

// Start server
app.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`);
});
