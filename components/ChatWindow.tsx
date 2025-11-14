import React, { useState, useRef, useEffect } from 'react';
import type { Chat } from '../types';
import { ChatMessage } from './Message';
import { SendIcon, LogoIcon, BotIcon, MicrophoneIcon } from './Icons';

interface ChatWindowProps {
  chat: Chat | null;
  isLoading: boolean;
  onSendMessage: (message: string) => void;
  onEditMessage: (messageIndex: number, newContent: string) => void;
}

const WelcomeScreen: React.FC<{ onPromptClick: (prompt: string) => void }> = ({ onPromptClick }) => {
  const categoryPrompts = [
    { 
        title: "First Dates", 
        prompt: "What are some good first date ideas?",
        description: "Get ideas and tips for a memorable first impression."
    },
    { 
        title: "Communication", 
        prompt: "How do I communicate my feelings without being awkward?",
        description: "Learn to express yourself clearly and confidently."
    },
    { 
        title: "Breakups", 
        prompt: "I just went through a breakup, what should I do?",
        description: "Find support and guidance on how to move forward."
    },
    { 
        title: "Online Dating", 
        prompt: "Help me improve my online dating profile.",
        description: "Craft a bio and choose photos that get you noticed."
    }
  ];

  return (
    <div className="flex flex-col items-center justify-center h-full text-center p-4">
        <LogoIcon className="w-24 h-24 mb-4"/>
        <h2 className="text-3xl font-bold text-white mb-2">ChatBae</h2>
        <p className="text-gray-400 mb-8">Your new-age AI dating coach. <br /> Ask me anything, or start with a topic below.</p>
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 w-full max-w-3xl">
            {categoryPrompts.map(({ title, prompt, description }) => (
                <button 
                    key={title}
                    onClick={() => onPromptClick(prompt)}
                    className="bg-gray-800 hover:bg-gray-700/50 text-gray-200 text-left p-4 rounded-lg transition-colors ring-1 ring-gray-700/50"
                >
                    <p className="font-semibold text-white mb-1">{title}</p>
                    <p className="text-sm text-gray-400">{description}</p>
                </button>
            ))}
        </div>
    </div>
  );
}

export const ChatWindow: React.FC<ChatWindowProps> = ({ chat, isLoading, onSendMessage, onEditMessage }) => {
  const [input, setInput] = useState('');
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const [isRecording, setIsRecording] = useState(false);
  const recognitionRef = useRef<any>(null);
  const [editingMessageIndex, setEditingMessageIndex] = useState<number | null>(null);

  useEffect(() => {
    // @ts-ignore
    const SpeechRecognition = window.SpeechRecognition || window.webkitSpeechRecognition;
    if (!SpeechRecognition) {
      console.warn("Speech Recognition API is not supported in this browser.");
      return;
    }

    const recognition = new SpeechRecognition();
    recognition.continuous = false;
    recognition.interimResults = true;
    recognition.lang = 'en-US';

    recognition.onstart = () => setIsRecording(true);
    recognition.onend = () => setIsRecording(false);
    recognition.onerror = (event: any) => {
      console.error("Speech recognition error:", event.error);
      setIsRecording(false);
    };

    recognitionRef.current = recognition;

    return () => {
      if (recognitionRef.current) {
        recognitionRef.current.stop();
      }
    };
  }, []);

  useEffect(() => {
    scrollToBottom();
  }, [chat?.messages, isLoading]);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (input.trim() && !isLoading) {
      onSendMessage(input.trim());
      setInput('');
    }
  };
  
  const handlePromptClick = (prompt: string) => {
    onSendMessage(prompt);
  };

  const handleToggleRecording = () => {
    if (!recognitionRef.current) {
      alert("Sorry, your browser doesn't support voice input.");
      return;
    }
    
    if (isRecording) {
      recognitionRef.current.stop();
    } else {
      const textBeforeRecording = input;
      recognitionRef.current.onresult = (event: any) => {
        const transcript = Array.from(event.results)
          .map((result: any) => result[0])
          .map((result) => result.transcript)
          .join('');
        
        const separator = textBeforeRecording.trim().length > 0 && transcript.length > 0 ? ' ' : '';
        setInput(textBeforeRecording + separator + transcript);
      };
      recognitionRef.current.start();
    }
  };

  return (
    <div className="flex flex-col h-full bg-gray-900">
      <div className="flex-grow overflow-y-auto p-6 space-y-6">
        {chat ? (
          <>
            {chat.messages.map((msg, index) => (
              <ChatMessage 
                key={index} 
                message={msg}
                messageIndex={index}
                isEditing={editingMessageIndex === index}
                onStartEditing={setEditingMessageIndex}
                onCancelEditing={() => setEditingMessageIndex(null)}
                onSaveEdit={(newContent) => {
                  onEditMessage(index, newContent);
                  setEditingMessageIndex(null);
                }}
              />
            ))}
            {isLoading && (
              <div className="flex items-start gap-4 p-4">
                 <div className="flex-shrink-0 w-8 h-8 rounded-full flex items-center justify-center bg-pink-600">
                    <BotIcon className="w-5 h-5 text-white" />
                 </div>
                 <div className="flex items-center space-x-2 pt-2">
                    <div className="w-2 h-2 bg-pink-400 rounded-full animate-pulse"></div>
                    <div className="w-2 h-2 bg-pink-400 rounded-full animate-pulse [animation-delay:0.2s]"></div>
                    <div className="w-2 h-2 bg-pink-400 rounded-full animate-pulse [animation-delay:0.4s]"></div>
                 </div>
              </div>
            )}
            <div ref={messagesEndRef} />
          </>
        ) : (
          <WelcomeScreen onPromptClick={handlePromptClick} />
        )}
      </div>
      <div className="p-6 bg-gray-900 border-t border-gray-700">
        <form onSubmit={handleSubmit} className="relative">
          <textarea
            value={input}
            onChange={(e) => setInput(e.target.value)}
            onKeyDown={(e) => {
                if(e.key === 'Enter' && !e.shiftKey) {
                    e.preventDefault();
                    handleSubmit(e);
                }
            }}
            placeholder={chat ? "Ask for dating advice..." : "Start a new chat to begin..."}
            rows={1}
            className="w-full bg-gray-800 border border-gray-600 rounded-lg pr-28 pl-4 py-3 text-white placeholder-gray-400 resize-none focus:outline-none focus:ring-2 focus:ring-pink-500"
            disabled={!chat || isLoading || editingMessageIndex !== null}
          />
          <button
            type="button"
            onClick={handleToggleRecording}
            disabled={!chat || isLoading || editingMessageIndex !== null}
            className={`absolute right-16 top-1/2 -translate-y-1/2 p-2 rounded-full hover:bg-gray-700 disabled:opacity-50 disabled:cursor-not-allowed transition-all ${isRecording ? 'bg-pink-600/50' : ''}`}
            aria-label={isRecording ? 'Stop recording' : 'Start recording'}
            title={isRecording ? 'Stop recording' : 'Start recording'}
          >
            <MicrophoneIcon className={`w-5 h-5 transition-colors ${isRecording ? 'text-pink-400' : 'text-gray-400'}`} />
          </button>
          <button
            type="submit"
            disabled={!input.trim() || isLoading || !chat || editingMessageIndex !== null}
            className="absolute right-3 top-1/2 -translate-y-1/2 p-2 bg-pink-600 rounded-full text-white hover:bg-pink-700 disabled:bg-gray-600 disabled:cursor-not-allowed transition-colors"
          >
            <SendIcon className="w-5 h-5 transform -rotate-45" />
          </button>
        </form>
      </div>
    </div>
  );
};
