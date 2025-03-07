require("dotenv").config();
const express = require("express");
const multer = require("multer");
const axios = require("axios");
const { google } = require("googleapis");
const nodemailer = require("nodemailer");

const app = express();
app.use(express.json());
const upload = multer();

const OPENAI_API_KEY = process.env.OPENAI_API_KEY;

// 🟢 Transcription API
app.post("/transcribe", upload.single("audio"), async (req, res) => {
    const response = await axios.post("https://api.openai.com/v1/audio/transcriptions", {
        audio: req.file.buffer.toString("base64"),
        model: "whisper-1",
    }, {
        headers: { Authorization: `Bearer ${OPENAI_API_KEY}` }
    });

    res.json({ transcript: response.data.text });
});

// 🟢 Summarization API
app.post("/summarize", async (req, res) => {
    const { transcript } = req.body;
    const response = await axios.post("https://api.openai.com/v1/chat/completions", {
        model: "gpt-4o-mini",
        messages: [{ role: "user", content: `Summarize this:\n${transcript}` }]
    }, {
        headers: { Authorization: `Bearer ${OPENAI_API_KEY}` }
    });

    res.json({ summary: response.data.choices[0].message.content });
});

// 🟢 Email Summary API
app.post("/send-email", async (req, res) => {
    // Gmail API setup (OAuth)
    const { recipient, summary } = req.body;
    // (OAuth setup code here)

    res.json({ message: "Email sent!" });
});

// Start Server
app.listen(5000, () => console.log("Server running on port 5000"));
