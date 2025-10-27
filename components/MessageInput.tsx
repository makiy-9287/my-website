import React, { useState, useRef } from 'react';
import { SendIcon, PaperclipIcon, MicrophoneIcon } from './icons';

interface MessageInputProps {
  onSendMessage: (parts: { text?: string; image?: File; audio?: Blob }) => void;
  isLoading: boolean;
  forceSendIcon?: boolean;
}

const MessageInput: React.FC<MessageInputProps> = ({ onSendMessage, isLoading, forceSendIcon = false }) => {
  const [input, setInput] = useState('');
  const [isRecording, setIsRecording] = useState(false);
  const mediaRecorderRef = useRef<MediaRecorder | null>(null);
  const audioChunksRef = useRef<Blob[]>([]);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const showSendIcon = forceSendIcon || !!input.trim();

  const handleSend = () => {
    if ((input.trim() || forceSendIcon) && !isLoading) {
      onSendMessage({ text: input.trim() });
      setInput('');
    }
  };

  const handleKeyPress = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSend();
    }
  };

  const handleAttachmentClick = () => {
    fileInputRef.current?.click();
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      onSendMessage({ image: file, text: input });
      setInput('');
    }
    // Reset file input
    if(fileInputRef.current) fileInputRef.current.value = "";
  };
  
  const startRecording = async () => {
    try {
        const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
        mediaRecorderRef.current = new MediaRecorder(stream);
        audioChunksRef.current = [];

        mediaRecorderRef.current.ondataavailable = (event) => {
            audioChunksRef.current.push(event.data);
        };

        mediaRecorderRef.current.onstop = () => {
            const audioBlob = new Blob(audioChunksRef.current, { type: 'audio/webm' });
            onSendMessage({ audio: audioBlob });
            // Stop all tracks to release microphone
            stream.getTracks().forEach(track => track.stop());
        };
        
        mediaRecorderRef.current.start();
        setIsRecording(true);
    } catch (err) {
        console.error("Error accessing microphone:", err);
        // You might want to show an error to the user
    }
  };

  const stopRecording = () => {
    if (mediaRecorderRef.current && mediaRecorderRef.current.state === 'recording') {
        mediaRecorderRef.current.stop();
        setIsRecording(false);
    }
  };

  return (
    <div className="bg-gray-900 p-2 flex items-center gap-2 sticky bottom-0">
      <div className="flex-grow p-3 rounded-full shadow-sm bg-gray-800 flex items-center">
        <input
            type="file"
            ref={fileInputRef}
            onChange={handleFileChange}
            accept="image/*"
            className="hidden"
        />
        <button onClick={handleAttachmentClick} className="text-gray-400 hover:text-gray-200 mr-2">
            <PaperclipIcon className="w-6 h-6" />
        </button>
        <input
            type="text"
            value={input}
            onChange={(e) => setInput(e.target.value)}
            onKeyPress={handleKeyPress}
            placeholder={isRecording ? "Recording..." : "Type a message..."}
            className="flex-grow bg-transparent focus:outline-none text-gray-200"
            disabled={isLoading || isRecording}
        />
      </div>
      <button
        onClick={showSendIcon ? handleSend : (isRecording ? stopRecording : startRecording)}
        disabled={isLoading}
        className="bg-emerald-700 text-white p-3 rounded-full hover:bg-emerald-600 disabled:bg-gray-400 disabled:cursor-not-allowed transition-all duration-200 flex items-center justify-center"
        style={{ width: '50px', height: '50px' }}
      >
        {isRecording && <div className="w-3 h-3 bg-red-500 rounded-full animate-pulse"></div>}
        {!isRecording && (showSendIcon ? <SendIcon className="w-6 h-6" /> : <MicrophoneIcon className="w-6 h-6" />)}
      </button>
    </div>
  );
};

export default MessageInput;