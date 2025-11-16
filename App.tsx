import React, { useState, useEffect, useCallback, useMemo } from 'react';
import { Sidebar } from './components/Sidebar';
import { Header, Toast } from './components/Header';
import { ChatWindow } from './components/ChatWindow';
import { ProfileModal } from './components/ProfileModal';
import type { Chat, Message, UserProfile } from './types';
import { getChatResponseStream, getTitleForChat, getChatSummary } from './services/geminiService';

// Levenshtein distance function for fuzzy search
const levenshtein = (a: string, b: string): number => {
  const an = a.length;
  const bn = b.length;
  if (an === 0) return bn;
  if (bn === 0) return an;
  const matrix = Array(an + 1).fill(null).map(() => Array(bn + 1).fill(null));
  for (let i = 0; i <= an; i++) matrix[i][0] = i;
  for (let j = 0; j <= bn; j++) matrix[0][j] = j;
  for (let i = 1; i <= an; i++) {
    for (let j = 1; j <= bn; j++) {
      const cost = a[i - 1] === b[j - 1] ? 0 : 1;
      matrix[i][j] = Math.min(
        matrix[i - 1][j] + 1,      // deletion
        matrix[i][j - 1] + 1,      // insertion
        matrix[i - 1][j - 1] + cost // substitution
      );
    }
  }
  return matrix[an][bn];
};

const App: React.FC = () => {
  const [chats, setChats] = useState<Chat[]>(() => {
    try {
      const savedChats = localStorage.getItem('chatbae-chats');
      if (savedChats) {
        return JSON.parse(savedChats);
      }
      return [];
    } catch (error) {
      console.error("Failed to load chats from local storage:", error);
      return [];
    }
  });

  const [activeChatId, setActiveChatId] = useState<string | null>(() => {
    const savedActiveId = localStorage.getItem('chatbae-active-id');
    // Ensure the active chat actually exists
    if (savedActiveId) {
      const parsedId = JSON.parse(savedActiveId);
      const allChats = chats || JSON.parse(localStorage.getItem('chatbae-chats') || '[]');
      if (allChats.some((chat: Chat) => chat.id === parsedId)) {
        return parsedId;
      }
    }
    return chats.length > 0 ? chats[0].id : null;
  });
  
  const [isGenZMode, setIsGenZMode] = useState<boolean>(false);
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [searchTerm, setSearchTerm] = useState<string>('');
  const [isSidebarVisible, setIsSidebarVisible] = useState(false);
  const [toastMessage, setToastMessage] = useState<string | null>(null);
  const [chatSummary, setChatSummary] = useState<{ text: string | null; isLoading: boolean }>({ text: null, isLoading: false });
  const [isProfileModalOpen, setIsProfileModalOpen] = useState(false);

  const [userProfile, setUserProfile] = useState<UserProfile>(() => {
    try {
      const savedProfile = localStorage.getItem('chatbae-profile');
      if (savedProfile) {
        return JSON.parse(savedProfile);
      }
    } catch (error) {
      console.error("Failed to load profile from local storage:", error);
    }
    return { name: 'You', iconId: 'user1' };
  });

  useEffect(() => {
    try {
        localStorage.setItem('chatbae-profile', JSON.stringify(userProfile));
    } catch (error) {
        console.error("Failed to save profile to local storage:", error);
    }
  }, [userProfile]);


  useEffect(() => {
    const mediaQuery = window.matchMedia('(min-width: 768px)');
    const handleResize = () => setIsSidebarVisible(mediaQuery.matches);
    handleResize(); // Set initial state based on screen size
    mediaQuery.addEventListener('change', handleResize);
    return () => mediaQuery.removeEventListener('change', handleResize);
  }, []);

  useEffect(() => {
    // Save chats and active ID to local storage whenever they change
    try {
      if(chats.length > 0){
        localStorage.setItem('chatbae-chats', JSON.stringify(chats));
        if (activeChatId) {
            localStorage.setItem('chatbae-active-id', JSON.stringify(activeChatId));
        } else if (chats.length > 0) {
            // If active chat is null but chats exist, set first one as active
            setActiveChatId(chats[0].id);
        }
      } else {
        localStorage.removeItem('chatbae-chats');
        localStorage.removeItem('chatbae-active-id');
      }
    } catch (error) {
      console.error("Failed to save state to local storage:", error);
    }
  }, [chats, activeChatId]);

  useEffect(() => {
    if (toastMessage) {
      const timer = setTimeout(() => {
        setToastMessage(null);
      }, 3000);
      return () => clearTimeout(timer);
    }
  }, [toastMessage]);

  useEffect(() => {
    // Clear summary when active chat changes
    setChatSummary({ text: null, isLoading: false });
  }, [activeChatId]);

  const handleUpdateProfile = (profile: UserProfile) => {
    setUserProfile(profile);
    setIsProfileModalOpen(false);
  };

  const handleNewChat = () => {
    const newChatId = Date.now().toString();
    const newChat: Chat = {
      id: newChatId,
      title: 'New Chat',
      messages: [],
    };
    setChats(prev => [newChat, ...prev]);
    setActiveChatId(newChatId);
    if (window.innerWidth < 768) {
      setIsSidebarVisible(false);
    }
  };

  const handleSelectChat = (id: string) => {
    setActiveChatId(id);
    if (window.innerWidth < 768) {
      setIsSidebarVisible(false);
    }
  };

  const handleUpdateChatTitle = (chatId: string, newTitle: string) => {
    if (!newTitle.trim()) return; // Prevent empty titles
    setChats(prevChats =>
      prevChats.map(chat =>
        chat.id === chatId ? { ...chat, title: newTitle.trim() } : chat
      )
    );
  };

  const handleDeleteChat = (chatId: string) => {
    if (window.confirm("Are you sure you want to delete this chat? This action cannot be undone.")) {
      setChats(prevChats => {
        const newChats = prevChats.filter(chat => chat.id !== chatId);
        if (activeChatId === chatId) {
          // If the active chat is deleted, set the new active chat
          if (newChats.length > 0) {
            // Try to find a pinned chat first, then default to the first chat
            const firstPinned = newChats.find(c => c.isPinned);
            setActiveChatId(firstPinned ? firstPinned.id : newChats[0].id);
          } else {
            setActiveChatId(null);
          }
        }
        return newChats;
      });
    }
  };

  const handleTogglePinChat = (chatId: string) => {
    setChats(prevChats =>
      prevChats.map(chat =>
        chat.id === chatId ? { ...chat, isPinned: !chat.isPinned } : chat
      )
    );
  };

  const streamAndSetResponse = async (chatId: string, history: Message[], newMessage: string) => {
    try {
        const stream = await getChatResponseStream(history, newMessage, isGenZMode);
        for await (const chunk of stream) {
            const chunkText = chunk.text;
            if (chunkText) {
                setChats(prev => prev.map(c => {
                    if (c.id === chatId) {
                        const newMessages = [...c.messages];
                        const lastMessage = newMessages[newMessages.length - 1];
                        if (lastMessage && lastMessage.role === 'model') {
                            lastMessage.content += chunkText;
                        }
                        return { ...c, messages: newMessages };
                    }
                    return c;
                }));
            }
        }
    } catch (error) {
        console.error("Failed to get response from Gemini:", error);
        const errorMessageContent = "Oops! Something went wrong. Please try again.";
        setChats(prev => prev.map(c => {
            if (c.id === chatId) {
                const newMessages = [...c.messages];
                const lastMessage = newMessages[newMessages.length - 1];
                if (lastMessage && lastMessage.role === 'model') {
                    lastMessage.content = errorMessageContent;
                }
                return { ...c, messages: newMessages };
            }
            return c;
        }));
    } finally {
        setIsLoading(false);
    }
  };

  const processMessage = async (chatId: string, messages: Message[], userMessageContent: string) => {
    setIsLoading(true);

    const modelMessagePlaceholder: Message = { role: 'model', content: '', timestamp: Date.now() };
    setChats(prev => prev.map(c => 
      c.id === chatId ? { ...c, messages: [...messages, modelMessagePlaceholder] } : c
    ));

    const historyForApi = messages.slice(0, -1);
    await streamAndSetResponse(chatId, historyForApi, userMessageContent);

    // After response is streamed, update title based on conversation.
    setChats(prevChats => {
        const chatToUpdate = prevChats.find(c => c.id === chatId);
        // Only generate a new title if it's a new chat, or a very short one.
        // This avoids changing titles on long-running conversations.
        if (chatToUpdate && (chatToUpdate.title === 'New Chat' || chatToUpdate.messages.length <= 4)) {
            getTitleForChat(chatToUpdate.messages).then(title => {
                if (title && title !== chatToUpdate.title) {
                    setChats(prev => prev.map(c => (c.id === chatId ? { ...c, title } : c)));
                }
            });
        }
        return prevChats;
    });
  };

  const handleSendMessage = useCallback(async (messageContent: string) => {
    if (!activeChatId) {
        // If there's no active chat, create one first.
        const newChatId = Date.now().toString();
        const newUserMessage: Message = { role: 'user', content: messageContent, timestamp: Date.now() };
        const newChat: Chat = {
            id: newChatId,
            title: 'New Chat',
            messages: [newUserMessage]
        };
        setChats(prev => [newChat, ...prev]);
        setActiveChatId(newChatId);
        // Continue execution with the new chat context
        processMessage(newChatId, [newUserMessage], messageContent);
    } else {
        const userMessage: Message = { role: 'user', content: messageContent, timestamp: Date.now() };
        const updatedChats = chats.map(c => 
            c.id === activeChatId ? { ...c, messages: [...c.messages, userMessage] } : c
        );
        setChats(updatedChats);
        const currentChat = updatedChats.find(c => c.id === activeChatId);
        if (currentChat) {
            processMessage(activeChatId, currentChat.messages, messageContent);
        }
    }
  }, [activeChatId, chats, isGenZMode]);

  const handleEditMessage = async (messageIndex: number, newContent: string) => {
    if (!activeChatId || !newContent.trim()) return;

    const chatToUpdate = chats.find(c => c.id === activeChatId);
    if (!chatToUpdate || chatToUpdate.messages[messageIndex]?.role !== 'user') {
        console.error("Cannot edit message: not found or not a user message.");
        return;
    }

    setIsLoading(true);

    // Truncate history and update the user message
    const historyBeforeEdit = chatToUpdate.messages.slice(0, messageIndex);
    const updatedUserMessage: Message = { role: 'user', content: newContent.trim(), timestamp: Date.now() };
    const modelMessagePlaceholder: Message = { role: 'model', content: '', timestamp: Date.now() };
    const messagesForUiUpdate = [...historyBeforeEdit, updatedUserMessage, modelMessagePlaceholder];

    // Update state for immediate UI feedback (removes subsequent messages)
    setChats(prevChats =>
      prevChats.map(chat =>
        chat.id === activeChatId ? { ...chat, messages: messagesForUiUpdate } : chat
      )
    );

    // Resubmit to get a new model response
    await streamAndSetResponse(activeChatId, historyBeforeEdit, newContent.trim());

    // After response is streamed, update title based on conversation.
    setChats(prevChats => {
        const chatToUpdate = prevChats.find(c => c.id === activeChatId);
        if (chatToUpdate && (chatToUpdate.title === 'New Chat' || chatToUpdate.messages.length <= 4)) {
            getTitleForChat(chatToUpdate.messages).then(title => {
                if (title && title !== chatToUpdate.title) {
                    // FIX: Replaced undefined `chatId` with `activeChatId`.
                    setChats(prev => prev.map(c => (c.id === activeChatId ? { ...c, title } : c)));
                }
            });
        }
        return prevChats;
    });
  };

  const handleGenerateSummary = async () => {
    if (!activeChatId) return;
    const currentChat = chats.find(c => c.id === activeChatId);
    if (!currentChat || currentChat.messages.length === 0) {
      setToastMessage("Not enough messages to generate a summary.");
      return;
    }

    setChatSummary({ text: null, isLoading: true });
    try {
      const summaryText = await getChatSummary(currentChat.messages);
      setChatSummary({ text: summaryText, isLoading: false });
    } catch (error) {
      console.error("Summary generation failed:", error);
      setChatSummary({ text: "Failed to generate summary.", isLoading: false });
    }
  };

  const getChatTranscript = useCallback(() => {
    const activeChat = chats.find(c => c.id === activeChatId);
    if (!activeChat) return { transcript: '', title: '' };

    const transcript = activeChat.messages
      .map(msg => `${msg.role === 'user' ? userProfile.name : 'ChatBae'}: ${msg.content}`)
      .join('\n\n');
    
    return { transcript, title: activeChat.title };
  }, [chats, activeChatId, userProfile]);

  const handleCopyToClipboard = useCallback(async () => {
    const { transcript } = getChatTranscript();
    if (!transcript) return;
    try {
      await navigator.clipboard.writeText(transcript);
      setToastMessage('Copied to clipboard!');
    } catch (error) {
      console.error('Error copying to clipboard:', error);
      setToastMessage('Failed to copy.');
    }
  }, [getChatTranscript]);
  
  const handleDownloadAsTxt = useCallback(() => {
    // FIX: Corrected function name from get_chat_transcript to getChatTranscript.
    const { transcript, title } = getChatTranscript();
    if (!transcript) return;
    const blob = new Blob([transcript], { type: 'text/plain;charset=utf-8' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `${title.replace(/ /g, '_') || 'chat'}.txt`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
    setToastMessage('Download started!');
  }, [getChatTranscript]);

  const handleShareNative = useCallback(async () => {
    const { transcript, title } = getChatTranscript();
    if (!transcript) return;

    const shareData = {
      title: `ChatBae: ${title}`,
      text: `Check out my conversation with ChatBae:\n\n---\n\n${transcript}`,
    };

    try {
      if (navigator.share) {
        await navigator.share(shareData);
      } else {
        await navigator.clipboard.writeText(shareData.text);
        setToastMessage('Sharing not supported, copied to clipboard!');
      }
    } catch (error) {
      console.error('Error sharing chat:', error);
      // Don't show an error if the user cancelled the share dialog
      if ((error as DOMException).name !== 'AbortError') {
        try {
            await navigator.clipboard.writeText(shareData.text);
            setToastMessage('Sharing failed. Copied to clipboard instead.');
        } catch (copyError) {
            console.error('Error copying to clipboard:', copyError);
            setToastMessage('Could not share or copy the chat.');
        }
      }
    }
  }, [getChatTranscript]);

  const activeChat = chats.find(c => c.id === activeChatId) || null;
  
  const filteredAndSortedChats = useMemo(() => {
    const sortByRecency = (a: Chat, b: Chat) => b.id.localeCompare(a.id);
  
    const term = searchTerm.trim().toLowerCase();
    if (!term) {
      const pinnedChats = chats.filter(chat => chat.isPinned).sort(sortByRecency);
      const unpinnedChats = chats.filter(chat => !chat.isPinned).sort(sortByRecency);
      return [...pinnedChats, ...unpinnedChats];
    }
    
    const fuzzyFilter = (chat: Chat) => {
      const title = chat.title.toLowerCase();
      if (title.includes(term)) {
        return true;
      }
      const distance = levenshtein(title, term);
      return distance <= 3 || distance < title.length / 2;
    };

    const filtered = chats.filter(fuzzyFilter);

    return filtered.sort((a, b) => {
      if (a.isPinned && !b.isPinned) return -1;
      if (!a.isPinned && b.isPinned) return 1;
      return b.id.localeCompare(a.id);
    });
  }, [chats, searchTerm]);

  return (
    <>
        <div className="flex h-screen w-screen overflow-hidden">
        {isSidebarVisible && (
            <div 
                onClick={() => setIsSidebarVisible(false)} 
                className="fixed inset-0 bg-black/30 z-20 md:hidden"
                aria-hidden="true"
            ></div>
        )}

        <aside className={`fixed top-0 left-0 h-full z-30 transition-transform duration-300 ease-in-out md:relative md:translate-x-0 ${isSidebarVisible ? 'translate-x-0' : '-translate-x-full'}`}>
            <Sidebar
            chats={filteredAndSortedChats}
            activeChatId={activeChatId}
            onNewChat={handleNewChat}
            onSelectChat={handleSelectChat}
            onUpdateChatTitle={handleUpdateChatTitle}
            onDeleteChat={handleDeleteChat}
            onTogglePinChat={handleTogglePinChat}
            isNewChatDisabled={chats.length === 0}
            userProfile={userProfile}
            onOpenProfile={() => setIsProfileModalOpen(true)}
            />
        </aside>

        <main className="flex-1 flex flex-col h-screen overflow-hidden">
            <Header
            isGenZMode={isGenZMode}
            onToggleGenZMode={() => setIsGenZMode(prev => !prev)}
            activeChatTitle={activeChat?.title || ''}
            searchTerm={searchTerm}
            onSearchChange={setSearchTerm}
            activeChatId={activeChatId}
            onUpdateChatTitle={handleUpdateChatTitle}
            onShareNative={handleShareNative}
            onCopyToClipboard={handleCopyToClipboard}
            onDownloadAsTxt={handleDownloadAsTxt}
            onToggleSidebar={() => setIsSidebarVisible(prev => !prev)}
            chatSummary={chatSummary}
            onGenerateSummary={handleGenerateSummary}
            />
            <div className="flex-1 overflow-y-auto">
                <ChatWindow 
                    chat={activeChat}
                    isLoading={isLoading}
                    onSendMessage={handleSendMessage}
                    onEditMessage={handleEditMessage}
                    isGenZMode={isGenZMode}
                    userProfile={userProfile}
                />
            </div>
        </main>

        {toastMessage && <Toast message={toastMessage} />}
        </div>
        
        {isProfileModalOpen && (
            <ProfileModal
                isOpen={isProfileModalOpen}
                onClose={() => setIsProfileModalOpen(false)}
                currentUserProfile={userProfile}
                onSave={handleUpdateProfile}
            />
        )}
    </>
  );
};

export default App;