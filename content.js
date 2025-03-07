async function startTranscription() {
    const audioContext = new AudioContext();
    const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
    const mediaRecorder = new MediaRecorder(stream);
    
    let chunks = [];
    mediaRecorder.ondataavailable = (event) => chunks.push(event.data);
    
    mediaRecorder.onstop = async () => {
        const blob = new Blob(chunks, { type: "audio/wav" });
        const file = new File([blob], "meeting_audio.wav", { type: "audio/wav" });
        
        const formData = new FormData();
        formData.append("audio", file);
        
        const response = await fetch("https://meet-ai.onrender.com/transcribe", {
            method: "POST",
            body: formData
        });

        const data = await response.json();
        console.log("Transcription:", data.transcript);
    };

    mediaRecorder.start();
    setTimeout(() => mediaRecorder.stop(), 30000); // Stops after 30 sec
}

startTranscription();
