const express = require("express");
const cors = require("cors");
const axios = require("axios"); // To send requests to OpenAI
require("dotenv").config(); // For environment variables

const app = express();
app.use(cors());
app.use(express.json());

app.get("/", (req, res) => {
    res.send("Server is running! Use /transcribe to send audio.");
});

app.post("/transcribe", async (req, res) => {
    try {
        const audioUrl = req.body.audio_url;
        if (!audioUrl) {
            return res.status(400).json({ error: "Missing audio_url in request body." });
        }

        // Send audio file to OpenAI Whisper API for transcription
        const response = await axios.post(
            "https://api.openai.com/v1/audio/transcriptions",
            {
                model: "whisper-1",
                file: audioUrl, // Send audio file
                response_format: "json"
            },
            {
                headers: {
                    "Authorization": `Bearer ${process.env.OPENAI_API_KEY}`,
                    "Content-Type": "application/json"
                }
            }
        );

        res.json({ transcription: response.data.text });

    } catch (error) {
        console.error("Error transcribing:", error.response ? error.response.data : error.message);
        res.status(500).json({ error: "Something went wrong!" });
    }
});

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}`);
});
