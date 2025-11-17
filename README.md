# ChatBae: Your AI Dating Coach 💖

ChatBae is a modern, AI-powered dating coach designed to act like a supportive friend. It helps users navigate the complexities of modern dating, from crafting the perfect profile bio to breaking the ice and handling tricky conversations. With a special "Gen Z" mode, it offers relatable advice tailored to a younger audience.

![ChatBae Screenshot](https://i.imgur.com/example.png) 
*(Note: Replace with an actual screenshot of the application)*

---

## ✨ Key Features

*   **Dual-Personality Coach**: Switch between a friendly, standard coaching style and a fun, slang-filled "Gen Z" mode for advice that matches your vibe.
*   **Intelligent Conversation**: Powered by the Google Gemini API (`gemini-2.5-flash`) for natural, context-aware, and helpful responses.
*   **Full Chat History**: All conversations are automatically saved to your browser's local storage, so you never lose your progress.
*   **Comprehensive Chat Management**:
    *   **Pin Chats**: Keep important conversations at the top of your list.
    *   **Rename & Delete**: Easily organize your chat history.
    *   **Sort & Search**: Find past chats instantly with sorting (Most Recent, Alphabetical) and fuzzy search functionality.
*   **Interactive Experience**:
    *   **Voice Input**: Use your microphone to dictate messages instead of typing.
    *   **Edit Messages**: Modify your previous messages to get a new, regenerated response from the AI.
    *   **Quick Actions**: Hover over your last message to quickly copy it or regenerate the AI's response.
*   **AI-Powered Tools**:
    *   **Chat Summaries**: Generate a concise, one-sentence summary of any conversation with a single click.
    *   **Automatic Titling**: New chats are automatically titled based on the initial conversation context.
*   **Share & Export**:
    *   Share conversations using your device's native sharing options.
    *   Copy the entire chat transcript to your clipboard.
    *   Download conversations as a `.txt` file.
*   **Customizable User Profile**: Personalize your experience by setting your display name and choosing from a selection of stylish avatars.
*   **Responsive & Accessible**: A clean, modern UI that works seamlessly on both desktop and mobile devices, with thoughtful accessibility considerations.

---

## 🛠️ Tech Stack

*   **Frontend**: [React](https://reactjs.org/) with TypeScript
*   **Styling**: [Tailwind CSS](https://tailwindcss.com/)
*   **AI Model**: [Google Gemini API](https://ai.google.dev/) (`gemini-2.5-flash`)
*   **State Management**: React Hooks (`useState`, `useEffect`, `useMemo`, etc.)
*   **Persistence**: Browser Local Storage

---

## 🚀 Getting Started

This project is set up as a single-page application using `index.html` and a bundled `index.tsx` file.

**Prerequisites:**
*   A modern web browser.
*   An environment where the `process.env.API_KEY` variable is set with a valid Google Gemini API key.

**Running the Application:**
Simply open the `index.html` file in a web browser. The application is self-contained and will run directly.

---

## 📁 File Structure

The project is organized into a clear and modular structure:

```
.
├── index.html          # The main HTML entry point for the application
├── index.tsx           # The main React application logic
├── App.tsx             # Root component, handles state management and logic
├── metadata.json       # Application metadata and permissions
├── types.ts            # TypeScript type definitions for the app
├── README.md           # You are here!
│
├── components/
│   ├── ChatWindow.tsx  # Main chat interface, including the welcome screen
│   ├── Header.tsx      # Top header bar with controls, search, and modals
│   ├── Icons.tsx       # A library of all SVG icons used in the app
│   ├── Message.tsx     # Renders a single user or model message bubble
│   ├── ProfileModal.tsx# Modal for editing the user's name and avatar
│   └── Sidebar.tsx     # Left sidebar for chat list, profile, and sorting
│
└── services/
    └── geminiService.ts # Handles all API calls and interactions with the Gemini API
```

---

### Component Breakdown

*   **`App.tsx`**: The core of the application. It manages all major state, including the list of chats, the active chat, user profile, and global settings like Gen Z mode. It orchestrates interactions between the sidebar, header, and chat window.
*   **`Sidebar.tsx`**: Displays the list of all chats. It handles chat creation, selection, renaming, pinning, and deletion. It also contains the user profile button and sorting controls.
*   **`Header.tsx`**: Sits at the top of the app. It contains the Gen Z mode toggle, search bar, share/export options, and the AI summary button.
*   **`ChatWindow.tsx`**: The main view where users interact with the AI. It displays the message history for the active chat and includes the text input area with voice-to-text functionality.
*   **`Message.tsx`**: A presentational component responsible for rendering a single message bubble, including the user/bot avatar, content, timestamp, and hover actions (edit, copy, regenerate).
*   **`ProfileModal.tsx`**: A pop-up that allows users to change their display name and select a new avatar. It features auto-saving when the modal is closed.
*   **`geminiService.ts`**: A dedicated service file that abstracts all communication with the Google Gemini API. It handles sending messages, generating chat titles, and creating summaries.
