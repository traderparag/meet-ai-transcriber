const express = require("express");
const cors = require("cors");

const app = express();
app.use(cors());
app.use(express.json());

app.get("/", (req, res) => {
    res.send("Server is running! Use /transcribe to send audio.");
});

app.post("/transcribe", async (req, res) => {
    try {
        // Example: Check if request has an audio URL
        if (!req.body.audio_url) {
            return res.status(400).json({ error: "Missing audio_url in request body." });
        }

        // Simulating response (replace with actual AI transcription logic)
        res.json({ transcription: "This is a sample transcription response." });

    } catch (error) {
        res.status(500).json({ error: "Something went wrong!" });
    }
});

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}`);
});
