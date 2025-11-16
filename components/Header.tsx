import React, { useState, useEffect, useRef } from 'react';
import { 
    SearchIcon, 
    LogoIcon, 
    ShareIcon, 
    EditIcon, 
    CloseIcon, 
    QuestionMarkCircleIcon,
    NewChatIcon,
    PinIcon,
    TrashIcon,
    MicrophoneIcon,
    CopyIcon,
    DownloadIcon,
    MenuIcon,
    SparklesIcon,
} from './Icons';

// --- How to Use Modal Component ---

interface HowToUseModalProps {
  onClose: () => void;
}

const Feature: React.FC<{ icon: React.ReactNode; title: string; description: string }> = ({ icon, title, description }) => (
    <div className="flex items-start gap-4">
        <div className="flex-shrink-0 w-8 h-8 rounded-full bg-gray-700 flex items-center justify-center text-pink-400">
            {icon}
        </div>
        <div>
            <h4 className="font-semibold text-white">{title}</h4>
            <p className="text-gray-400 text-sm">{description}</p>
        </div>
    </div>
);

const HowToUseModal: React.FC<HowToUseModalProps> = ({ onClose }) => {
  return (
    <div 
        className="fixed inset-0 bg-black/60 z-50 flex items-center justify-center p-4 backdrop-blur-sm"
        onClick={onClose}
        aria-modal="true"
        role="dialog"
    >
      <div 
        className="bg-gray-800 rounded-2xl w-full max-w-2xl max-h-[90vh] shadow-xl border border-gray-700 flex flex-col"
        onClick={(e) => e.stopPropagation()}
      >
        <header className="flex items-center justify-between p-4 border-b border-gray-700 flex-shrink-0">
          <h3 className="text-xl font-bold text-white">How to Use ChatBae</h3>
          <button
            onClick={onClose}
            className="p-1 rounded-full text-gray-400 hover:bg-gray-700 hover:text-white transition-colors"
            aria-label="Close"
          >
            <CloseIcon className="w-6 h-6" />
          </button>
        </header>
        <main className="p-6 overflow-y-auto space-y-6">
            <Feature 
                icon={<NewChatIcon className="w-5 h-5" />}
                title="Start a Conversation"
                description="Click 'New Chat' to start a fresh conversation. You can ask for dating advice, help with writing a bio, or just chat about your love life."
            />
            <Feature 
                icon={<div className="text-sm font-bold">Z</div>}
                title="Toggle Gen Z Mode"
                description="Feeling ✨ spicy ✨? Flip the 'Gen Z Mode' switch to get advice in a more... contemporary slang. It's giving main character energy."
            />
             <Feature 
                icon={<MicrophoneIcon className="w-5 h-5" />}
                title="Use Your Voice"
                description="Don't feel like typing? Click the microphone icon in the input bar to speak your message directly."
            />
            <Feature 
                icon={<EditIcon className="w-5 h-5" />}
                title="Edit Your Messages"
                description="Made a typo or want to rephrase your last message? Hover over your message and click the edit icon to make changes and get a new response."
            />
            <Feature 
                icon={<SparklesIcon className="w-5 h-5" />}
                title="Get a Quick Summary"
                description="Click the sparkles icon next to the chat title to generate a concise, one-sentence summary of your current conversation."
            />
             <Feature 
                icon={<SearchIcon className="w-5 h-5" />}
                title="Search Your History"
                description="Looking for a specific chat? Use the search bar in the header to quickly find past conversations by their title."
            />
            <Feature 
                icon={<PinIcon className="w-5 h-5" />}
                title="Pin Important Chats"
                description="Hover over a chat in the sidebar, click the three dots, and select 'Pin' to keep it at the top of your list for easy access."
            />
            <Feature 
                icon={<ShareIcon className="w-5 h-5" />}
                title="Share & Export Chats"
                description="Got some great advice you want to share? Click the share icon in the header to copy, download, or share the conversation."
            />
             <Feature 
                icon={<TrashIcon className="w-5 h-5" />}
                title="Manage Your Chats"
                description="Use the three-dots menu on any chat to rename or delete it. Keep your conversation history organized."
            />
        </main>
      </div>
    </div>
  );
};

// --- Toast Component ---
export const Toast: React.FC<{ message: string }> = ({ message }) => (
    <div 
      className="fixed bottom-5 right-5 bg-gray-800 border border-gray-700 text-white py-2 px-4 rounded-lg shadow-lg z-50"
      role="alert"
    >
      {message}
    </div>
);

// --- Header Component ---
interface HeaderProps {
  isGenZMode: boolean;
  onToggleGenZMode: () => void;
  searchTerm: string;
  onSearchChange: (term: string) => void;
  activeChatId: string | null;
  onShareNative: () => void;
  onCopyToClipboard: () => void;
  onDownloadAsTxt: () => void;
  onToggleSidebar: () => void;
  chatSummary: { text: string | null; isLoading: boolean };
  onGenerateSummary: () => void;
}

export const Header: React.FC<HeaderProps> = ({ 
    isGenZMode, 
    onToggleGenZMode, 
    searchTerm, 
    onSearchChange, 
    activeChatId, 
    onShareNative,
    onCopyToClipboard,
    onDownloadAsTxt,
    onToggleSidebar,
    chatSummary,
    onGenerateSummary,
}) => {
  const [isHelpModalOpen, setIsHelpModalOpen] = useState(false);
  const [isShareMenuOpen, setIsShareMenuOpen] = useState(false);
  const shareMenuRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (shareMenuRef.current && !shareMenuRef.current.contains(event.target as Node)) {
        setIsShareMenuOpen(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  const handleShareMenuAction = (action: () => void) => {
    action();
    setIsShareMenuOpen(false);
  };
  
  const summaryTooltip = chatSummary.isLoading
    ? "Generating summary..."
    : chatSummary.text
      ? `Summary: ${chatSummary.text}`
      : "Generate a one-sentence AI summary of this conversation";

  const summaryIconContent = chatSummary.isLoading ? (
    <div className="w-4 h-4 flex items-center justify-center">
        <div className="dot-bounce flex space-x-0.5">
            <div className="w-1 h-1 bg-pink-400 rounded-full dot-1"></div>
            <div className="w-1 h-1 bg-pink-400 rounded-full dot-2"></div>
            <div className="w-1 h-1 bg-pink-400 rounded-full dot-3"></div>
        </div>
    </div>
  ) : (
      <SparklesIcon className="w-4 h-4" />
  );

  return (
    <>
      <div className="border-b border-gray-700 bg-gray-900/80 backdrop-blur-sm sticky top-0 z-10">
        <div className="flex items-center justify-between p-4 gap-4">
            <div className="flex items-center gap-2 sm:gap-4 min-w-0">
            <button
                onClick={onToggleSidebar}
                className="p-2 rounded-full text-gray-400 hover:bg-gray-700 hover:text-white md:hidden"
                aria-label="Toggle sidebar"
            >
                <MenuIcon className="w-6 h-6" />
            </button>
            <button
                onClick={() => setIsHelpModalOpen(true)}
                className="p-2 rounded-full text-gray-400 hover:bg-gray-700 hover:text-white flex-shrink-0 transition-colors hidden sm:block"
                aria-label="How to use"
                title="How to use"
            >
                <QuestionMarkCircleIcon className="w-6 h-6" />
            </button>
            <div className="flex items-center gap-3 flex-shrink-0">
                <LogoIcon className="w-8 h-8" />
                <h1 className="text-xl font-bold text-white hidden sm:block">
                ChatBae
                </h1>
            </div>
            <div className="flex items-center gap-2 group min-w-0">
                {activeChatId && (
                    <button
                        onClick={onGenerateSummary}
                        disabled={chatSummary.isLoading}
                        className={`p-1 rounded-full hover:bg-gray-700 transition-colors flex-shrink-0 disabled:opacity-50 disabled:cursor-not-allowed ${
                          chatSummary.text ? 'text-pink-400 hover:text-pink-300' : 'text-gray-500 hover:text-white'
                        }`}
                        aria-label={summaryTooltip}
                        title={summaryTooltip}
                    >
                        {summaryIconContent}
                    </button>
                )}
            </div>
            </div>

            <div className="flex items-center gap-4 flex-shrink-0">
            <div className="relative w-full max-w-xs hidden md:block">
                <SearchIcon className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
                <input
                    type="text"
                    placeholder="Search history..."
                    value={searchTerm}
                    onChange={(e) => onSearchChange(e.target.value)}
                    className="w-full bg-gray-700 border border-gray-600 rounded-lg pl-10 pr-4 py-2 text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-pink-500"
                />
            </div>
            
            <div className="relative">
                <button
                    onClick={() => setIsShareMenuOpen(prev => !prev)}
                    disabled={!activeChatId}
                    className="p-2 rounded-full text-gray-400 hover:bg-gray-700 hover:text-white disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
                    aria-label="Export chat"
                    title="Export chat"
                    aria-haspopup="true"
                    aria-expanded={isShareMenuOpen}
                >
                    <ShareIcon className="w-5 h-5" />
                </button>
                {isShareMenuOpen && (
                    <div 
                        ref={shareMenuRef}
                        className="absolute right-0 top-full mt-2 w-56 bg-gray-900 border border-gray-700 rounded-lg shadow-xl py-1.5 z-20"
                    >
                        <button onClick={() => handleShareMenuAction(onShareNative)} className="w-full text-left flex items-center gap-3 px-3 py-2 text-sm text-gray-200 hover:bg-gray-800">
                            <ShareIcon className="w-4 h-4" />
                            Share Conversation
                        </button>
                        <button onClick={() => handleShareMenuAction(onCopyToClipboard)} className="w-full text-left flex items-center gap-3 px-3 py-2 text-sm text-gray-200 hover:bg-gray-800">
                            <CopyIcon className="w-4 h-4" />
                            Copy as Text
                        </button>
                        <button onClick={() => handleShareMenuAction(onDownloadAsTxt)} className="w-full text-left flex items-center gap-3 px-3 py-2 text-sm text-gray-200 hover:bg-gray-800">
                            <DownloadIcon className="w-4 h-4" />
                            Download as TXT
                        </button>
                    </div>
                )}
            </div>

            <div className="flex items-center gap-2 sm:gap-4">
                <span className={`font-semibold transition-colors whitespace-nowrap hidden sm:inline ${isGenZMode ? 'text-pink-400' : 'text-gray-400'}`}>
                Gen Z Mode
                </span>
                <button
                onClick={onToggleGenZMode}
                className={`relative inline-flex items-center h-6 rounded-full w-11 transition-colors focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-offset-gray-900 focus:ring-pink-500 ${
                    isGenZMode ? 'bg-pink-600' : 'bg-gray-600'
                }`}
                >
                <span
                    className={`inline-block w-4 h-4 transform bg-white rounded-full transition-transform ${
                    isGenZMode ? 'translate-x-6' : 'translate-x-1'
                    }`}
                />
                </button>
            </div>
            </div>
        </div>
      </div>
      {isHelpModalOpen && <HowToUseModal onClose={() => setIsHelpModalOpen(false)} />}
    </>
  );
};
