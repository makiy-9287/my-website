import React, { useState, useEffect, useRef } from 'react';
import { Message, Sender } from './types';
import { chat } from './services/geminiService';
import { Part } from "@google/genai";
import Header from './components/Header';
import ChatBubble from './components/ChatBubble';
import MessageInput from './components/MessageInput';
import DropdownMenu from './components/DropdownMenu';
import { XMarkIcon } from './components/icons';

// Helper function to convert File/Blob to a base64 string
const fileToGenerativePart = async (file: File | Blob, mimeType: string): Promise<Part> => {
  const base64EncodedData = await new Promise<string>((resolve) => {
    const reader = new FileReader();
    reader.onloadend = () => resolve((reader.result as string).split(',')[1]);
    reader.readAsDataURL(file);
  });
  return {
    inlineData: { data: base64EncodedData, mimeType },
  };
};

const App: React.FC = () => {
  const [messages, setMessages] = useState<Message[]>([
    {
      id: '1',
      text: 'Halow machan.. Mokada wenne ah 😼🙌. Mokak hari udawwak oneda ? Mama ධාතුසේන. Kohomada oyata udaw karanna puluwan? Oyata pictures or voice messages unath ewanna puluwan. 😊',
      sender: Sender.Bot,
      timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
    },
  ]);
  const [isLoading, setIsLoading] = useState(false);
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [showModal, setShowModal] = useState(false);
  const [modalContent, setModalContent] = useState({ title: '', body: '' });
  const [imagePreview, setImagePreview] = useState<{file: File, text: string} | null>(null);

  const chatEndRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    chatEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages, isLoading]);
  
  useEffect(() => {
    const closeMenu = () => setIsMenuOpen(false);
    if (isMenuOpen) {
      document.addEventListener('click', closeMenu);
    }
    return () => {
      document.removeEventListener('click', closeMenu);
    };
  }, [isMenuOpen]);

  const handleSendMessage = async (parts: { text?: string; image?: File; audio?: Blob }) => {
    if (!parts.text && !parts.image && !parts.audio) return;
    setIsLoading(true);

    const userMessage: Message = {
      id: Date.now().toString(),
      sender: Sender.User,
      timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
    };

    const modelParts: Part[] = [];

    if (parts.text) {
        userMessage.text = parts.text;
        modelParts.push({ text: parts.text });
    }
    if (parts.image) {
        userMessage.image = URL.createObjectURL(parts.image);
        // Show preview modal for image with caption
        setImagePreview({file: parts.image, text: parts.text || ''});
        setIsLoading(false); // We stop loading here until user confirms from modal
        return;
    }
    if(parts.audio) {
        userMessage.audio = URL.createObjectURL(parts.audio);
        const audioPart = await fileToGenerativePart(parts.audio, parts.audio.type);
        modelParts.push(audioPart);
    }

    setMessages((prev) => [...prev, userMessage]);
    await streamResponse(modelParts);
  };
  
  const handleImagePreviewSend = async () => {
    if (!imagePreview) return;
    setIsLoading(true);
    
    const { file, text } = imagePreview;

    const userMessage: Message = {
      id: Date.now().toString(),
      sender: Sender.User,
      timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
      image: URL.createObjectURL(file),
      text: text,
    };
    
    setMessages((prev) => [...prev, userMessage]);
    
    const modelParts: Part[] = [await fileToGenerativePart(file, file.type)];
    if (text) {
        modelParts.push({ text });
    }

    setImagePreview(null);
    await streamResponse(modelParts);
  };

  const streamResponse = async (modelParts: Part[]) => {
      const botMessageId = (Date.now() + 1).toString();
      const botMessagePlaceholder: Message = {
        id: botMessageId,
        text: '',
        sender: Sender.Bot,
        timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
      };
      setMessages((prev) => [...prev, botMessagePlaceholder]);
      
      try {
        const result = await chat.sendMessageStream({ message: modelParts });
        for await (const chunk of result) {
            setMessages(prev => prev.map(msg => 
                msg.id === botMessageId 
                ? { ...msg, text: (msg.text || '') + chunk.text } 
                : msg
            ));
        }
      } catch (error) {
          console.error("Error streaming response:", error);
           setMessages(prev => prev.map(msg => 
                msg.id === botMessageId 
                ? { ...msg, text: "Sorry machan, podi aulak una. 😕 Ayeth try karanna." } // Sorry man, something went wrong. Please try again.
                : msg
            ));
      } finally {
        setIsLoading(false);
      }
  };


  const handleMenuClick = (e: React.MouseEvent) => {
    e.stopPropagation();
    setIsMenuOpen(prev => !prev);
  }

  const handleContactClick = () => {
    const whatsappNumber = '94741907061';
    const url = `https://wa.me/${whatsappNumber}`;
    window.open(url, '_blank', 'noopener,noreferrer');
  }

  const handleAboutClick = () => {
    setModalContent({
        title: 'About Dhatusena',
        body: 'This is an AI Chatbot . Designed to simulate a friendly conversation and assist with your questions in Sinhala. ධාතුසේන උනාට මගෙ නම කරන්නෑ ධාතු වැඩ 😌.. අතීතේ ඒවා වගේම වර්තමානයේ වෙන දේවලුත් දන්නවා හොදට මම 🥳.'
    });
    setShowModal(true);
  }

  return (
    <div className="w-full max-w-lg mx-auto h-screen flex flex-col bg-black shadow-2xl font-sans">
        <div className="relative flex-shrink-0">
            <Header onMenuClick={handleMenuClick} />
            {isMenuOpen && <DropdownMenu onContactClick={handleContactClick} onAboutClick={handleAboutClick} onClose={() => setIsMenuOpen(false)} />}
        </div>

        <main 
            className="flex-grow p-4 overflow-y-auto relative bg-cover bg-fixed" 
            style={{ backgroundImage: "url('https://i.pinimg.com/originals/85/ec/df/85ecdf1c3642145b05578a494674a27B.jpg')" }}
        >
            <div className="absolute inset-0 bg-black opacity-75"></div>
            <div className="space-y-4 relative z-10">
                {messages.map((msg) => (
                    <ChatBubble key={msg.id} message={msg} />
                ))}
                {isLoading && (
                    <div className="flex justify-start">
                        <div className="bg-gray-700 text-gray-800 px-3 py-2 rounded-lg shadow rounded-bl-none">
                            <div className="flex items-center space-x-1">
                                <span className="w-2 h-2 bg-gray-400 rounded-full animate-pulse delay-75"></span>
                                <span className="w-2 h-2 bg-gray-400 rounded-full animate-pulse delay-150"></span>
                                <span className="w-2 h-2 bg-gray-400 rounded-full animate-pulse delay-300"></span>
                            </div>
                        </div>
                    </div>
                )}
                <div ref={chatEndRef} />
            </div>
        </main>
        
        <footer className="p-2 border-t border-gray-700 bg-gray-900 flex-shrink-0">
          <MessageInput onSendMessage={handleSendMessage} isLoading={isLoading} />
          <p className="text-center text-xs text-gray-400 pt-2">Powered by Malith Lakshan</p>
        </footer>

        {/* Generic Modal */}
        {showModal && (
            <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-30 p-4">
                <div className="bg-gray-800 rounded-lg p-6 max-w-sm w-full shadow-xl">
                    <h2 className="text-xl font-bold mb-4 text-white">{modalContent.title}</h2>
                    <p className="text-gray-300 mb-6">{modalContent.body}</p>
                    <button onClick={() => setShowModal(false)} className="bg-emerald-700 text-white px-4 py-2 rounded-md w-full hover:bg-emerald-600 transition-colors">
                        Close
                    </button>
                </div>
            </div>
        )}
        
        {/* Image Preview Modal */}
        {imagePreview && (
             <div className="fixed inset-0 bg-black bg-opacity-75 flex flex-col items-center justify-center z-40 p-4">
                <button onClick={() => setImagePreview(null)} className="absolute top-4 right-4 text-white hover:text-gray-300">
                    <XMarkIcon className="w-8 h-8"/>
                </button>
                <div className="bg-gray-900 rounded-lg p-4 max-w-lg w-full">
                    <img src={URL.createObjectURL(imagePreview.file)} alt="preview" className="max-h-[60vh] w-auto mx-auto rounded-md"/>
                </div>
                <div className="w-full max-w-lg mt-4">
                   <MessageInput 
                    onSendMessage={({text}) => {
                        setImagePreview(prev => prev ? {...prev, text: text || ''} : null);
                        handleImagePreviewSend();
                    }}
                    isLoading={isLoading} 
                    forceSendIcon={true}
                   />
                </div>
            </div>
        )}
    </div>
  );
};

export default App;
