import React, { useState, useEffect, useCallback, useMemo } from 'react';
import { Sidebar } from './components/Sidebar';
import { Header } from './components/Header';
import { ChatWindow } from './components/ChatWindow';
import type { Chat, Message } from './types';
import { getChatResponse, getTitleForChat } from './services/geminiService';

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
  const [isSidebarVisible, setIsSidebarVisible] = useState(true); // For potential mobile toggle

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


  const handleNewChat = () => {
    const newChat: Chat = {
      id: Date.now().toString(),
      title: 'New Chat',
      messages: [],
    };
    setChats(prev => [newChat, ...prev]);
    setActiveChatId(newChat.id);
  };

  const handleSelectChat = (id: string) => {
    setActiveChatId(id);
  };

  const handleUpdateChatTitle = (chatId: string, newTitle: string) => {
    if (!newTitle.trim()) return; // Prevent empty titles
    setChats(prevChats =>
      prevChats.map(chat =>
        chat.id === chatId ? { ...chat, title: newTitle.trim() } : chat
      )
    );
  };

  const handleSendMessage = useCallback(async (messageContent: string) => {
    if (!activeChatId) {
        // If there's no active chat, create one first.
        const newChatId = Date.now().toString();
        const newUserMessage: Message = { role: 'user', content: messageContent };
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
        const userMessage: Message = { role: 'user', content: messageContent };
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

  const processMessage = async (chatId: string, messages: Message[], userMessageContent: string) => {
    setIsLoading(true);

    // Generate title for new chats
    if (messages.length === 1) {
        const title = await getTitleForChat(userMessageContent);
        setChats(prev => prev.map(c => c.id === chatId ? { ...c, title } : c));
    }

    try {
      const response = await getChatResponse(messages.slice(0, -1), userMessageContent, isGenZMode);
      const modelMessage: Message = { role: 'model', content: response.text };
      
      setChats(prev => prev.map(c => 
        c.id === chatId ? { ...c, messages: [...messages, modelMessage] } : c
      ));
    } catch (error) {
      console.error("Failed to get response from Gemini:", error);
      const errorMessage: Message = { role: 'model', content: "Oops! Something went wrong. Please try again." };
      setChats(prev => prev.map(c => 
        c.id === chatId ? { ...c, messages: [...messages, errorMessage] } : c
      ));
    } finally {
      setIsLoading(false);
    }
  };

  const handleEditMessage = async (messageIndex: number, newContent: string) => {
    if (!activeChatId || !newContent.trim()) return;

    const chatToUpdate = chats.find(c => c.id === activeChatId);
    if (!chatToUpdate || chatToUpdate.messages[messageIndex]?.role !== 'user') {
        console.error("Cannot edit message: not found or not a user message.");
        return;
    }

    // Truncate history and update the user message
    const historyBeforeEdit = chatToUpdate.messages.slice(0, messageIndex);
    const updatedUserMessage: Message = { role: 'user', content: newContent.trim() };
    const messagesForUiUpdate = [...historyBeforeEdit, updatedUserMessage];

    // Update state for immediate UI feedback (removes subsequent messages)
    setChats(prevChats =>
      prevChats.map(chat =>
        chat.id === activeChatId ? { ...chat, messages: messagesForUiUpdate } : chat
      )
    );

    // Resubmit to get a new model response
    setIsLoading(true);
    try {
        const response = await getChatResponse(historyBeforeEdit, newContent.trim(), isGenZMode);
        const modelMessage: Message = { role: 'model', content: response.text };
        
        // Add the new model response to the state
        setChats(prev => prev.map(c => 
            c.id === activeChatId ? { ...c, messages: [...messagesForUiUpdate, modelMessage] } : c
        ));
    } catch (error) {
        console.error("Failed to get response from Gemini after edit:", error);
        const errorMessage: Message = { role: 'model', content: "Oops! I had trouble responding to that edit. Please try again." };
        setChats(prev => prev.map(c => 
            c.id === activeChatId ? { ...c, messages: [...messagesForUiUpdate, errorMessage] } : c
        ));
    } finally {
        setIsLoading(false);
    }
  };


  const activeChat = chats.find(c => c.id === activeChatId) || null;

  const handleShareChat = async () => {
    if (!activeChat) return;

    const transcript = activeChat.messages
      .map(msg => `${msg.role === 'user' ? 'You' : 'ChatBae'}: ${msg.content}`)
      .join('\n\n');

    const shareData = {
      title: `ChatBae: ${activeChat.title}`,
      text: `Check out my conversation with ChatBae:\n\n---\n\n${transcript}`,
    };

    try {
      if (navigator.share) {
        await navigator.share(shareData);
      } else {
        await navigator.clipboard.writeText(shareData.text);
        alert('Chat transcript copied to clipboard!');
      }
    } catch (error) {
      console.error('Error sharing chat:', error);
      try {
        await navigator.clipboard.writeText(shareData.text);
        alert('Sharing failed. Chat transcript copied to clipboard instead.');
      } catch (copyError) {
        console.error('Error copying to clipboard:', copyError);
        alert('Could not share or copy the chat.');
      }
    }
  };
  
  const filteredAndSortedChats = useMemo(() => {
    if (!searchTerm.trim()) {
      return [...chats].sort((a, b) => b.id.localeCompare(a.id));
    }

    const searchTermLower = searchTerm.toLowerCase();
    const searchWords = searchTermLower.split(' ').filter(Boolean);

    const filtered = chats.filter(chat => {
      const titleLower = chat.title.toLowerCase();

      return searchWords.every(searchWord => {
        if (titleLower.includes(searchWord)) {
          return true;
        }

        const titleWords = titleLower.split(' ').filter(Boolean);
        return titleWords.some(titleWord => {
          const distance = levenshtein(searchWord, titleWord);
          const threshold = titleWord.length < 5 ? 1 : 2;
          return distance <= threshold;
        });
      });
    });

    const calculateRelevanceScore = (title: string, term: string): number => {
        const lowerTitle = title.toLowerCase();
        if (lowerTitle === term) {
            return 0; // Exact match
        }
        if (lowerTitle.startsWith(term)) {
            return 1; // Prefix match
        }
        if (lowerTitle.includes(term)) {
            return 2; // Substring match
        }
        // Fuzzy match on the whole string
        return 3 + levenshtein(lowerTitle, term);
    };

    return filtered.sort((a, b) => {
      const scoreA = calculateRelevanceScore(a.title, searchTermLower);
      const scoreB = calculateRelevanceScore(b.title, searchTermLower);

      if (scoreA !== scoreB) {
        return scoreA - scoreB; // Lower score is better
      }
      
      // If scores are equal, prioritize more recent chats
      return b.id.localeCompare(a.id);
    });
  }, [chats, searchTerm]);

  return (
    <div className="flex h-screen font-sans">
      <div className={`transition-all duration-300 ${isSidebarVisible ? 'w-full md:w-80' : 'w-0'} flex-shrink-0`}>
         <Sidebar
            chats={filteredAndSortedChats}
            activeChatId={activeChatId}
            onNewChat={handleNewChat}
            onSelectChat={handleSelectChat}
            onUpdateChatTitle={handleUpdateChatTitle}
        />
      </div>
     
      <main className="flex-1 flex flex-col h-screen overflow-hidden">
        <Header 
          isGenZMode={isGenZMode} 
          onToggleGenZMode={() => setIsGenZMode(!isGenZMode)}
          activeChatTitle={activeChat?.title || "Welcome"}
          searchTerm={searchTerm}
          onSearchChange={setSearchTerm}
          onShareChat={handleShareChat}
          activeChatId={activeChatId}
          onUpdateChatTitle={handleUpdateChatTitle}
        />
        <div className="flex-1 overflow-y-auto">
          <ChatWindow 
            chat={activeChat}
            isLoading={isLoading}
            onSendMessage={handleSendMessage}
            onEditMessage={handleEditMessage}
          />
        </div>
      </main>
    </div>
  );
};

export default App;
