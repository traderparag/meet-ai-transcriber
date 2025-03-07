const express = require("express");
const cors = require("cors");
const multer = require("multer");
const fs = require("fs");
const axios = require("axios");
require("dotenv").config();

const app = express();
app.use(cors());
app.use(express.json());

// Configure Multer for file uploads
const upload = multer({ dest: "uploads/" });

app.get("/", (req, res) => {
    res.send("Server is running! Use /transcribe to send audio.");
});

// Updated /transcribe endpoint to handle file uploads
app.post("/transcribe", upload.single("file"), async (req, res) => {
    try {
        if (!req.file) {
            return res.status(400).json({ error: "Missing audio file." });
        }

        const audioFilePath = req.file.path;
        
        const formData = new FormData();
        formData.append("file", fs.createReadStream(audioFilePath));
        formData.append("model", "whisper-1"); // Whisper API model

        const response = await axios.post("https://api.openai.com/v1/audio/transcriptions", formData, {
            headers: {
                "Authorization": `Bearer ${process.env.OPENAI_API_KEY}`,
                ...formData.getHeaders()
            }
        });

        // Delete file after processing
        fs.unlinkSync(audioFilePath);

        res.json({ transcription: response.data.text });

    } catch (error) {
        console.error("Error transcribing:", error.response ? error.response.data : error.message);
        res.status(500).json({ error: "Something went wrong!" });
    }
});

const PORT = process.env.PORT || 10000; // Changed to match Render's port
app.listen(PORT, '0.0.0.0', () => {
    console.log(`Server is running on port ${PORT}`);
});
