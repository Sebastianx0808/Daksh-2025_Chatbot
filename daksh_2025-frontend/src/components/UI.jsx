import { useRef, useState } from "react";
import { useChat } from "../hooks/useChat";
import { Mic, MicOff, Keyboard } from 'lucide-react';

export const UI = ({ hidden, ...props }) => {
  const inputRef = useRef();
  const { chat, loading, message } = useChat();
  const [isRecording, setIsRecording] = useState(false);
  const [transcription, setTranscription] = useState("");
  const [isVoiceInput, setIsVoiceInput] = useState(true);
  const [typedInput, setTypedInput] = useState("");
  const mediaRecorderRef = useRef(null);
  const chunksRef = useRef([]);

  const startRecording = async () => {
    try {
      const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
      mediaRecorderRef.current = new MediaRecorder(stream);
      chunksRef.current = [];

      mediaRecorderRef.current.ondataavailable = (event) => {
        if (event.data.size > 0) {
          chunksRef.current.push(event.data);
        }
      };

      mediaRecorderRef.current.onstop = async () => {
        const audioBlob = new Blob(chunksRef.current, { type: 'audio/webm;codecs=opus' });
        try {
          const response = await fetch('http://localhost:3000/transcribe', {
            method: 'POST',
            body: audioBlob,
            headers: {
              'Content-Type': 'audio/webm;codecs=opus'
            }
          });

          if (!response.ok) {
            throw new Error('Transcription failed');
          }

          const data = await response.json();
          setTranscription(data.transcription);
        } catch (error) {
          console.error('Error sending audio to server:', error);
          setTranscription("Failed to transcribe audio");
        }

        // Clean up the media stream
        stream.getTracks().forEach(track => track.stop());
      };

      mediaRecorderRef.current.start();
      setIsRecording(true);
    } catch (error) {
      console.error("Error accessing microphone:", error);
    }
  };

  const stopRecording = () => {
    if (mediaRecorderRef.current && isRecording) {
      mediaRecorderRef.current.stop();
      setIsRecording(false);
    }
  };

  const toggleInputMode = () => {
    if (!isVoiceInput) {
      setTypedInput("");
    } else {
      setTranscription("");
      if (isRecording) {
        stopRecording();
      }
    }
    setIsVoiceInput(!isVoiceInput);
  };

  const handleSend = () => {
    const messageToSend = isVoiceInput ? transcription : typedInput;
    if (messageToSend.trim() && !loading) {
      chat(messageToSend);
      if (isVoiceInput) {
        setTranscription("");
      } else {
        setTypedInput("");
      }
    }
  };

  const handleInputChange = (e) => {
    setTypedInput(e.target.value);
  };

  if (hidden) {
    return null;
  }

  return (
    <>
      <div
        style={{
          backgroundImage: `url('/bg-3.jpg')`,
          backgroundSize: "cover",
          backgroundPosition: "center",
          backgroundRepeat: "no-repeat",
          zIndex: -1,
          position: "absolute",
          top: 0,
          left: 0,
          right: 0,
          bottom: 0,
        }}
      ></div>

      <div className="fixed top-0 left-0 right-0 bottom-0 z-10 flex flex-col justify-between p-4 pointer-events-none">
        {/* Header */}
        <div className="self-start backdrop-blur-md bg-white bg-opacity-50 p-4 rounded-lg">
          <h1 className="font-black text-xl">Daksh 2025 Chatbot</h1>
          <p>Let's ponder the question "what if?"</p>
        </div>

        {/* Input Section */}
        <div className="flex flex-col items-center gap-4 justify-center w-full mx-auto pointer-events-auto">
          {/* Toggle Button */}
          <button
            onClick={toggleInputMode}
            className="self-end mb-2 bg-blue-500 hover:bg-blue-600 text-white p-2 rounded-md flex items-center gap-2"
          >
            {isVoiceInput ? <Keyboard size={20} /> : <Mic size={20} />}
            {isVoiceInput ? "Switch to Text" : "Switch to Voice"}
          </button>

          {/* Input and Controls */}
          <div className="flex items-center gap-4 justify-center w-full mx-auto">
            {isVoiceInput && (
              <button
                onClick={stopRecording}
                disabled={!isRecording}
                className={`pointer-events-auto bg-zinc-900 hover:bg-neutral-600 text-white p-4 rounded-md ${
                  !isRecording ? "opacity-50 cursor-not-allowed" : ""
                }`}
              >
                <MicOff size={24} />
              </button>
            )}
            <input
              className="w-96 placeholder:text-gray-800 placeholder:italic p-4 rounded-md bg-opacity-50 bg-white backdrop-blur-md"
              placeholder={isVoiceInput ? (isRecording ? "Recording..." : "Click mic to start") : "Type your message here..."}
              ref={inputRef}
              value={isVoiceInput ? transcription : typedInput}
              onChange={isVoiceInput ? undefined : handleInputChange}
              readOnly={isVoiceInput}
            />
            {isVoiceInput && (
              <button
                onClick={startRecording}
                disabled={isRecording}
                className={`pointer-events-auto bg-stone-900 hover:bg-neutral-600 text-white p-4 rounded-md ${
                  isRecording ? "opacity-50 cursor-not-allowed" : ""
                }`}
              >
                <Mic size={24} />
              </button>
            )}
          </div>

          {/* Send Button */}
          <button
            onClick={handleSend}
            disabled={loading || (!typedInput.trim() && !transcription.trim())}
            className={`mt-4 bg-green-500 hover:bg-green-600 text-white px-6 py-2 rounded-md ${
              loading || (!typedInput.trim() && !transcription.trim()) ? "opacity-50 cursor-not-allowed" : ""
            }`}
          >
            {loading ? "Sending..." : "Send"}
          </button>
        </div>
      </div>
    </>
  );
};