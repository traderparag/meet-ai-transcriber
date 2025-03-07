import fetch from 'node-fetch';  // Required to make HTTP requests (you might need to install it later)

export default async function handler(req, res) {
    if (req.method === 'POST') {
        try {
            // Get the audio file from the request body
            const { audioFile } = req.body;  // This expects the audio file or file URL to be passed in the POST request

            if (!audioFile) {
                return res.status(400).json({ message: 'Audio file is required.' });
            }

            // Now, we need to send this audio file to OpenAI Whisper for transcription.
            // This is where you’ll integrate Whisper API (example below).
            const transcription = await transcribeAudioWithWhisper(audioFile);

            // If transcription is successful, return the result
            return res.status(200).json({ transcription });
        } catch (error) {
            console.error(error);
            return res.status(500).json({ message: 'Error transcribing audio.', error: error.message });
        }
    } else {
        // If the request method is not POST, return method not allowed
        res.status(405).json({ message: 'Method Not Allowed' });
    }
}

// Function to transcribe audio using OpenAI Whisper
async function transcribeAudioWithWhisper(audioFile) {
    const apiKey = process.env.OPENAI_API_KEY;  // Use the API key from the .env file
    const apiEndpoint = 'https://api.openai.com/v1/audio/transcriptions';  // Whisper API endpoint

    const formData = new FormData();
    formData.append('file', audioFile);  // Add the audio file to the form data
    formData.append('model', 'whisper-1');  // Specify the model (Whisper)

    const response = await fetch(apiEndpoint, {
        method: 'POST',
        headers: {
            'Authorization': `Bearer ${apiKey}`,  // Pass the API key for authorization
        },
        body: formData,  // The audio file is sent in the body
    });

    const data = await response.json();  // Parse the response from the API

    if (response.ok) {
        return data.text;  // Return the transcribed text
    } else {
        throw new Error(data.error?.message || 'Error in transcription');
    }
}
