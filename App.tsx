
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

type SortOrder = 'recent' | 'alphabetical';

const App: React.FC = () => {
  const [chats, setChats] = useState<Chat[]>(() => {
    try {
      const savedChats = localStorage.getItem('chatbae-chats');
      return savedChats ? JSON.parse(savedChats) : [];
    } catch (error) {
      console.error("Failed to load chats from local storage:", error);
      return [];
    }
  });

  const [activeChatId, setActiveChatId] = useState<string | null>(null);
  
  const [isGenZMode, setIsGenZMode] = useState<boolean>(() => {
    const savedMode = localStorage.getItem('chatbae-genz-mode');
    return savedMode ? JSON.parse(savedMode) : false;
  });

  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [searchTerm, setSearchTerm] = useState<string>('');
  const [isSidebarVisible, setIsSidebarVisible] = useState(false);
  const [toastMessage, setToastMessage] = useState<string | null>(null);
  const [chatSummary, setChatSummary] = useState<{ text: string | null; isLoading: boolean }>({ text: null, isLoading: false });
  const [isProfileModalOpen, setIsProfileModalOpen] = useState(false);
  const [userProfile, setUserProfile] = useState<UserProfile>(() => {
    try {
      const savedProfile = localStorage.getItem('chatbae-user-profile');
      return savedProfile ? JSON.parse(savedProfile) : { name: 'You', iconId: 'winking_heart' };
    } catch (error) {
      console.error("Failed to load user profile:", error);
      return { name: 'You', iconId: 'winking_heart' };
    }
  });
  const [sortOrder, setSortOrder] = useState<SortOrder>(() => {
    const savedSortOrder = localStorage.getItem('chatbae-sort-order');
    return (savedSortOrder === 'alphabetical' || savedSortOrder === 'recent') ? savedSortOrder : 'recent';
  });

  useEffect(() => {
    const savedActiveId = localStorage.getItem('chatbae-active-id');
    if (savedActiveId && chats.some(c => c.id === JSON.parse(savedActiveId))) {
      setActiveChatId(JSON.parse(savedActiveId));
    } else if (chats.length > 0) {
      // Find the most recent chat to set as active
      const sortedChats = [...chats].sort((a, b) => {
        const lastMsgA = a.messages[a.messages.length - 1]?.timestamp || 0;
        const lastMsgB = b.messages[b.messages.length - 1]?.timestamp || 0;
        return lastMsgB - lastMsgA;
      });
      setActiveChatId(sortedChats[0].id);
    } else {
      setActiveChatId(null);
    }
  }, []); // Run only once on initial load

  useEffect(() => {
    localStorage.setItem('chatbae-chats', JSON.stringify(chats));
  }, [chats]);

  useEffect(() => {
    if (activeChatId) {
      localStorage.setItem('chatbae-active-id', JSON.stringify(activeChatId));
    } else {
        localStorage.removeItem('chatbae-active-id');
    }
  }, [activeChatId]);

  useEffect(() => {
    localStorage.setItem('chatbae-genz-mode', JSON.stringify(isGenZMode));
  }, [isGenZMode]);

  useEffect(() => {
    localStorage.setItem('chatbae-user-profile', JSON.stringify(userProfile));
  }, [userProfile]);

  useEffect(() => {
    localStorage.setItem('chatbae-sort-order', sortOrder);
  }, [sortOrder]);

  const activeChat = useMemo(() => chats.find(chat => chat.id === activeChatId), [chats, activeChatId]);

  const showToast = useCallback((message: string) => {
    setToastMessage(message);
    setTimeout(() => setToastMessage(null), 3000);
  }, []);

  const handleNewChat = () => {
    setActiveChatId(null);
    setChatSummary({ text: null, isLoading: false });
  };

  const handleSelectChat = (id: string) => {
    setActiveChatId(id);
    setChatSummary({ text: null, isLoading: false });
  };

  const handleUpdateChatTitle = (id: string, newTitle: string) => {
    setChats(prev => prev.map(chat => chat.id === id ? { ...chat, title: newTitle } : chat));
    showToast("Chat renamed successfully!");
  };

  const handleDeleteChat = (id: string) => {
    setChats(prev => {
      const newChats = prev.filter(chat => chat.id !== id);
      if (activeChatId === id) {
        setActiveChatId(newChats.length > 0 ? newChats[0].id : null);
      }
      return newChats;
    });
    showToast("Chat deleted.");
  };

  const handleTogglePinChat = (id: string) => {
    setChats(prev => prev.map(chat => chat.id === id ? { ...chat, isPinned: !chat.isPinned } : chat));
    const chat = chats.find(c => c.id === id);
    showToast(chat?.isPinned ? "Chat unpinned." : "Chat pinned.");
  };
  
  const handleSendMessage = async (messageContent: string) => {
      if (isLoading) return;

      const userMessage: Message = { role: 'user', content: messageContent, timestamp: Date.now() };
      let currentChatId = activeChatId;
      let newChatCreated = false;

      // Create a new chat if there's no active one
      if (!currentChatId) {
          const newChat: Chat = {
              id: `chat-${Date.now()}`,
              title: "New Chat",
              messages: [userMessage],
          };
          setChats(prev => [newChat, ...prev]);
          setActiveChatId(newChat.id);
          currentChatId = newChat.id;
          newChatCreated = true;
      } else {
          setChats(prev => prev.map(c => c.id === currentChatId ? { ...c, messages: [...c.messages, userMessage] } : c));
      }
      
      setIsLoading(true);

      try {
          const chatHistory = chats.find(c => c.id === currentChatId)?.messages.slice(0, -1) || [];
          const stream = await getChatResponseStream(chatHistory, messageContent, isGenZMode);
          
          let fullResponse = '';
          const modelMessage: Message = { role: 'model', content: '', timestamp: Date.now() };
          
          // Add the empty model message to start
          setChats(prev => prev.map(c => c.id === currentChatId ? { ...c, messages: [...c.messages, modelMessage] } : c));

          for await (const chunk of stream) {
              fullResponse += chunk.text;
              setChats(prev => prev.map(c => {
                  if (c.id === currentChatId) {
                      const updatedMessages = c.messages.slice();
                      updatedMessages[updatedMessages.length - 1] = { ...modelMessage, content: fullResponse };
                      return { ...c, messages: updatedMessages };
                  }
                  return c;
              }));
          }
          
          if (newChatCreated) {
            const finalMessages = [userMessage, { ...modelMessage, content: fullResponse }];
            const newTitle = await getTitleForChat(finalMessages);
            setChats(prev => prev.map(c => c.id === currentChatId ? { ...c, title: newTitle } : c));
          }

      } catch (error) {
          console.error("Error sending message:", error);
          const errorMessage: Message = { role: 'model', content: 'Sorry, I encountered an error. Please try again.', timestamp: Date.now() };
          setChats(prev => prev.map(c => c.id === currentChatId ? { ...c, messages: [...c.messages, errorMessage] } : c));
      } finally {
          setIsLoading(false);
      }
  };

  const handleEditMessage = async (messageIndex: number, newContent: string) => {
    if (!activeChatId) return;

    // We resend the conversation up to the point of the edit
    const truncatedMessages = activeChat?.messages.slice(0, messageIndex) || [];
    const editedUserMessage: Message = { role: 'user', content: newContent, timestamp: Date.now() };

    setChats(prev => prev.map(c => c.id === activeChatId ? { ...c, messages: [...truncatedMessages, editedUserMessage] } : c));
    setIsLoading(true);

    try {
        const stream = await getChatResponseStream(truncatedMessages, newContent, isGenZMode);
        
        let fullResponse = '';
        const modelMessage: Message = { role: 'model', content: '', timestamp: Date.now() };
        
        setChats(prev => prev.map(c => c.id === activeChatId ? { ...c, messages: [...c.messages, modelMessage] } : c));

        for await (const chunk of stream) {
            fullResponse += chunk.text;
            setChats(prev => prev.map(c => {
                if (c.id === activeChatId) {
                    const updatedMessages = c.messages.slice();
                    updatedMessages[updatedMessages.length - 1] = { ...modelMessage, content: fullResponse };
                    return { ...c, messages: updatedMessages };
                }
                return c;
            }));
        }

    } catch (error) {
        console.error("Error editing message:", error);
        const errorMessage: Message = { role: 'model', content: 'Sorry, I encountered an error processing your edit. Please try again.', timestamp: Date.now() };
        setChats(prev => prev.map(c => c.id === activeChatId ? { ...c, messages: [...c.messages, errorMessage] } : c));
    } finally {
        setIsLoading(false);
    }
  };

  const filteredChats = useMemo(() => {
    if (!searchTerm.trim()) return chats;

    const lowercasedSearchTerm = searchTerm.toLowerCase();
    
    // Exact match filter
    const exactMatches = chats.filter(chat =>
      chat.title.toLowerCase().includes(lowercasedSearchTerm)
    );

    // Fuzzy search for remaining items if few exact matches are found
    if (exactMatches.length > 5) return exactMatches;

    const otherChats = chats.filter(chat => !exactMatches.includes(chat));
    const fuzzyMatches = otherChats
      .map(chat => ({
        chat,
        distance: levenshtein(chat.title.toLowerCase(), lowercasedSearchTerm),
      }))
      .filter(item => item.distance < 4) // Adjust threshold for desired fuzziness
      .sort((a, b) => a.distance - b.distance)
      .map(item => item.chat);
      
    return [...exactMatches, ...fuzzyMatches];
  }, [chats, searchTerm]);

  const sortedChats = useMemo(() => {
    const pinned = filteredChats.filter(c => c.isPinned);
    const unpinned = filteredChats.filter(c => !c.isPinned);

    const sortFunction = (a: Chat, b: Chat) => {
      if (sortOrder === 'alphabetical') {
        return a.title.localeCompare(b.title, undefined, { numeric: true, sensitivity: 'base' });
      }
      // Default to 'recent'
      const lastMsgA = a.messages[a.messages.length - 1]?.timestamp || 0;
      const lastMsgB = b.messages[b.messages.length - 1]?.timestamp || 0;
      return lastMsgB - lastMsgA;
    };

    pinned.sort(sortFunction);
    unpinned.sort(sortFunction);

    return [...pinned, ...unpinned];
  }, [filteredChats, sortOrder]);

  const handleShareNative = async () => {
    if (!activeChat || !navigator.share) return;
    const text = activeChat.messages.map(m => `${m.role === 'user' ? userProfile.name : 'ChatBae'}: ${m.content}`).join('\n\n');
    try {
      await navigator.share({
        title: activeChat.title,
        text: `A conversation with ChatBae:\n\n${text}`,
      });
      showToast('Shared successfully!');
    } catch (error) {
      console.error('Error sharing:', error);
      showToast('Could not share conversation.');
    }
  };

  const handleCopyToClipboard = () => {
    if (!activeChat) return;
    const text = activeChat.messages.map(m => `${m.role === 'user' ? userProfile.name : 'ChatBae'}: ${m.content}`).join('\n\n');
    navigator.clipboard.writeText(text);
    showToast('Copied to clipboard!');
  };

  const handleDownloadAsTxt = () => {
    if (!activeChat) return;
    const text = activeChat.messages.map(m => `${m.role === 'user' ? userProfile.name : 'ChatBae'}: ${m.content}`).join('\n\n');
    const blob = new Blob([text], { type: 'text/plain' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `${activeChat.title.replace(/ /g, '_')}.txt`;
    a.click();
    URL.revokeObjectURL(url);
    showToast('Download started!');
  };

  const handleGenerateSummary = async () => {
    if (!activeChat || activeChat.messages.length < 2) {
      showToast("Not enough messages to generate a summary.");
      return;
    }
    setChatSummary({ text: null, isLoading: true });
    try {
      const summary = await getChatSummary(activeChat.messages);
      setChatSummary({ text: summary, isLoading: false });
    } catch (error) {
      setChatSummary({ text: "Error generating summary.", isLoading: false });
    }
  };

  const handleSaveProfile = (newProfile: UserProfile) => {
    setUserProfile(newProfile);
    setIsProfileModalOpen(false);
    showToast("Profile saved!");
  };

  return (
    <div className="flex h-screen overflow-hidden">
        <div className={`
            fixed top-0 left-0 h-full z-30 transition-transform transform 
            ${isSidebarVisible ? 'translate-x-0' : '-translate-x-full'}
            md:relative md:translate-x-0 md:z-auto
        `}>
            <Sidebar
                chats={sortedChats}
                activeChatId={activeChatId}
                onNewChat={handleNewChat}
                onSelectChat={handleSelectChat}
                onUpdateChatTitle={handleUpdateChatTitle}
                onDeleteChat={handleDeleteChat}
                onTogglePinChat={handleTogglePinChat}
                isNewChatDisabled={isLoading && !activeChatId}
                userProfile={userProfile}
                onOpenProfile={() => setIsProfileModalOpen(true)}
                sortOrder={sortOrder}
                onSortOrderChange={setSortOrder}
            />
        </div>
        {isSidebarVisible && <div onClick={() => setIsSidebarVisible(false)} className="fixed inset-0 bg-black/50 z-20 md:hidden" />}

        <div className="flex-1 flex flex-col min-w-0">
            <Header
                isGenZMode={isGenZMode}
                onToggleGenZMode={() => setIsGenZMode(prev => !prev)}
                activeChatTitle={activeChat?.title || 'ChatBae'}
                searchTerm={searchTerm}
                onSearchChange={setSearchTerm}
                activeChatId={activeChatId}
                onShareNative={handleShareNative}
                onCopyToClipboard={handleCopyToClipboard}
                onDownloadAsTxt={handleDownloadAsTxt}
                onToggleSidebar={() => setIsSidebarVisible(prev => !prev)}
                chatSummary={chatSummary}
                onGenerateSummary={handleGenerateSummary}
            />
            <main className="flex-1 overflow-y-auto">
                <ChatWindow
                    chat={activeChat || null}
                    isLoading={isLoading}
                    onSendMessage={handleSendMessage}
                    onEditMessage={handleEditMessage}
                    isGenZMode={isGenZMode}
                    userProfile={userProfile}
                />
            </main>
        </div>
        
        <ProfileModal 
          isOpen={isProfileModalOpen}
          currentUserProfile={userProfile}
          onSave={handleSaveProfile}
        />

        {toastMessage && <Toast message={toastMessage} />}
    </div>
  );
};

export default App;
