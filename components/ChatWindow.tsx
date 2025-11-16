import React, { useState, useRef, useEffect } from 'react';
import type { Chat, UserProfile } from '../types';
import { ChatMessage } from './Message';
import { SendIcon, LogoIcon, BotIcon, MicrophoneIcon } from './Icons';

interface ChatWindowProps {
  chat: Chat | null;
  isLoading: boolean;
  onSendMessage: (message: string) => void;
  onEditMessage: (messageIndex: number, newContent: string) => void;
  onCopyMessage: (text: string) => void;
  isGenZMode: boolean;
  userProfile: UserProfile;
}

interface WelcomeScreenProps {
  onPromptClick: (prompt: string) => void;
  isGenZMode: boolean;
}

const WelcomeScreen: React.FC<WelcomeScreenProps> = ({ onPromptClick, isGenZMode }) => {
  const categoryPrompts = [
    { 
        title: "Craft Your Profile", 
        prompt: "Help me write a dating profile bio that stands out.",
        description: "Get help writing a bio and choosing photos that show off the real you."
    },
    { 
        title: "Break the Ice", 
        prompt: "Give me a unique opening line based on my match's profile.",
        description: "Move beyond 'hey' with creative conversation starters that get replies."
    },
    { 
        title: "Build Your Confidence", 
        prompt: "How can I overcome my dating anxiety?",
        description: "Get actionable tips to boost your self-esteem and feel great on dates."
    },
    { 
        title: "Navigate Awkward Stuff", 
        prompt: "How do I bring up the 'what are we?' conversation?",
        description: "Get scripts and advice for handling those tricky dating talks with ease."
    }
  ];

  const genZCategoryPrompts = [
    {
      title: "Profile Glow Up",
      prompt: "Help me make a bio that's giving main character energy.",
      description: "Craft a fire bio and pick pics that absolutely ate. No crumbs left."
    },
    {
      title: "Slide into DMs",
      prompt: "My match is a whole vibe. Cook up an opener with mad rizz.",
      description: "Ditch the 'hey' and slide in with something that'll get you a reply, no cap."
    },
    {
      title: "Shoot Your Shot",
      prompt: "I'm in my delulu era over this person. How do I not fumble?",
      description: "Get the confidence to make a move without getting the ick. Bet."
    },
    {
      title: "Decode the Situationship",
      prompt: "This situationship is sending me. Is it real or should I dip?",
      description: "Figure out where you stand and how to talk about it without being cringe."
    }
  ];

  const prompts = isGenZMode ? genZCategoryPrompts : categoryPrompts;

  return (
    <div className="flex flex-col items-center justify-center h-full text-center p-4">
        <LogoIcon className="w-24 h-24 mb-4"/>
        <h2 className="text-3xl font-bold text-white mb-2">ChatBae</h2>
        <p className="text-gray-400 mb-8">Your new-age AI dating coach. <br /> Ask me anything, or start with a topic below.</p>
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 w-full max-w-3xl">
            {prompts.map(({ title, prompt, description }) => (
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

export const ChatWindow: React.FC<ChatWindowProps> = ({ chat, isLoading, onSendMessage, onEditMessage, onCopyMessage, isGenZMode, userProfile }) => {
  const [input, setInput] = useState('');
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const [isRecording, setIsRecording] = useState(false);
  const recognitionRef = useRef<any>(null);
  const textBeforeRecordingRef = useRef('');
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

    recognition.onresult = (event: any) => {
      const transcript = Array.from(event.results)
        .map((result: any) => result[0])
        .map((result) => result.transcript)
        .join('');
      
      const baseText = textBeforeRecordingRef.current;
      const separator = baseText.trim().length > 0 && transcript.length > 0 ? ' ' : '';
      setInput(baseText + separator + transcript);
    };

    recognitionRef.current = recognition;

    return () => {
      if (recognitionRef.current) {
        recognitionRef.current.stop();
      }
    };
  }, []);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };
  
  useEffect(() => {
    scrollToBottom();
  }, [chat?.messages, isLoading]);

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
      textBeforeRecordingRef.current = input;
      recognitionRef.current.start();
    }
  };

  const lastUserMessageIndex = chat ? chat.messages.map(m => m.role).lastIndexOf('user') : -1;

  return (
    <div className="flex flex-col h-full bg-gray-900">
      <div className="flex-grow overflow-y-auto p-6 space-y-6 chat-scroll-container">
        {chat ? (
          <>
            {chat.messages.map((msg, index) => (
              <ChatMessage 
                key={msg.timestamp || index} 
                message={msg}
                messageIndex={index}
                isEditing={editingMessageIndex === index}
                onStartEditing={setEditingMessageIndex}
                onCancelEditing={() => setEditingMessageIndex(null)}
                onSaveEdit={(newContent) => {
                  onEditMessage(index, newContent);
                  setEditingMessageIndex(null);
                }}
                isLoading={isLoading && index === chat.messages.length - 1}
                userProfile={userProfile}
                isLastUserMessage={index === lastUserMessageIndex}
                onRegenerate={() => onEditMessage(index, msg.content)}
                onCopyMessage={() => onCopyMessage(msg.content)}
              />
            ))}
            <div ref={messagesEndRef} />
          </>
        ) : (
          <WelcomeScreen onPromptClick={handlePromptClick} isGenZMode={isGenZMode} />
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
            placeholder={isRecording ? "Listening..." : (chat ? "Ask for dating advice..." : "Start a new chat to begin...")}
            rows={1}
            className="w-full bg-gray-800 border border-gray-600 rounded-lg pr-28 pl-4 py-3 text-white placeholder-gray-400 resize-none focus:outline-none focus:ring-2 focus:ring-pink-500"
            disabled={isLoading || editingMessageIndex !== null}
          />
          <button
            type="button"
            onClick={handleToggleRecording}
            disabled={isLoading || editingMessageIndex !== null}
            className={`absolute right-16 top-1/2 -translate-y-1/2 p-2 rounded-full hover:bg-gray-700 disabled:opacity-50 disabled:cursor-not-allowed transition-all ${isRecording ? 'bg-pink-600/50' : ''}`}
            aria-label={isRecording ? 'Stop recording' : 'Start recording'}
            title={isRecording ? 'Stop recording' : 'Start recording'}
          >
            <MicrophoneIcon className={`w-5 h-5 transition-colors ${isRecording ? 'text-pink-400' : 'text-gray-400'}`} />
          </button>
          <button
            type="submit"
            disabled={!input.trim() || isLoading || editingMessageIndex !== null}
            className="absolute right-3 top-1/2 -translate-y-1/2 p-2 bg-pink-600 rounded-full text-white hover:bg-pink-700 disabled:bg-gray-600 disabled:cursor-not-allowed transition-colors"
          >
            <SendIcon className="w-5 h-5 transform -rotate-45" />
          </button>
        </form>
      </div>
    </div>
  );
};