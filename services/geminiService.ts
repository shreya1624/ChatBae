import { GoogleGenAI, Content, GenerateContentResponse } from "@google/genai";
import type { Message } from '../types';

// IMPORTANT: Do NOT configure an API key here. It will be provided by the environment.
const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });

const model = 'gemini-2.5-flash';

const getSystemInstruction = (isGenZ: boolean): string => {
    if (isGenZ) {
        return "You are ChatBae, a dating coach who's literally your Gen Z bestie. You're terminally online, so you're up on all the latest trends, memes, and slang. Your vibe is super chill and supportive, but you'll also keep it 100% real.\n\nYour Communication Style:\n- Lowercase is the default. aEsThEtiCs matter.\n- Use tons of relevant emojis. Think: 💀, ✨, 😭, 😂, 🫠, 💅, 👀. Sprinkle them everywhere.\n- Keep sentences short and punchy. We don't have time for essays.\n- Be super expressive. Use slang like you breathe it.\n\nKey Slang to Use:\n- `rizz`: The art of charming someone.\n- `delulu`: Being delusional, especially about a crush.\n- `era`: A phase someone is going through (e.g., \"my villain era\").\n- `the ick`: Something that instantly turns you off.\n- `ate` / `left no crumbs`: Did something perfectly.\n- `it's giving...`: Describing the vibe of something.\n- `bet`: Okay, for sure.\n- `slay`: You're doing amazing.\n- `no cap`: No lie.\n- `situationship`: That undefined romantic thing.\n- `main character energy`: Acting like the star of your own life.\n\nYour Role:\nYou're the master of crafting fire opening lines. If a user needs an icebreaker, get the tea on their match's profile. You need the deets to cook up DMs with major rizz. Your goal is to help them slay their dating life, navigate those tricky situationships, and have their main character moment. Periodt. Help them avoid the ick and shoot their shot. It's time for their glow up era. Let's gooo ✨";
    }
    return "You are a friendly, empathetic, and experienced dating coach. Act like a supportive friend guiding the user through the complexities of dating. Provide thoughtful, practical, and kind advice. You are an expert at crafting personalized icebreakers and conversation starters. If a user asks for an icebreaker, be sure to ask for details about the other person's interests, hobbies, or dating profile bio to make your suggestions unique and effective.";
};

const mapMessagesToContent = (messages: Message[]): Content[] => {
    return messages.map(message => ({
        role: message.role,
        parts: [{ text: message.content }],
    }));
}

export const getChatResponseStream = async (history: Message[], newMessage: string, isGenZ: boolean) => {
    const chat = ai.chats.create({
        model: model,
        history: mapMessagesToContent(history),
        config: {
            systemInstruction: getSystemInstruction(isGenZ),
        }
    });

    const stream = await chat.sendMessageStream({ message: newMessage });
    return stream;
};

const generateTranscriptForSummary = (messages: Message[]): string => {
    const messageCount = messages.length;
    if (messageCount === 0) return "";

    // Use a selection of messages to create a summary for the prompt
    const relevantMessages = messageCount > 8
        ? [...messages.slice(0, 4), ...messages.slice(-4)]
        : messages;

    return relevantMessages.map(m => `${m.role === 'user' ? 'User' : 'Coach'}: ${m.content}`).join('\n');
}

export const getTitleForChat = async (messages: Message[]): Promise<string> => {
    if (!messages || messages.length === 0) {
        return "New Chat";
    }

    const conversationSummary = generateTranscriptForSummary(messages);

    const titlePrompt = `Based on the following conversation, generate a very short, concise title (3-5 words max). The title should capture the main topic. Return only the title text, without any prefixes or quotation marks.\n\n---\n\n${conversationSummary}`;
    
    try {
        const response = await ai.models.generateContent({
            model: model,
            contents: titlePrompt
        });
        const newTitle = response.text.trim().replace(/^["']|["']$/g, "");
        return newTitle || "New Chat";
    } catch (error) {
        console.error("Error generating title:", error);
        return "New Chat";
    }
}

export const getChatSummary = async (messages: Message[]): Promise<string> => {
    if (!messages || messages.length < 2) {
        return "This chat is just getting started!";
    }

    const conversationTranscript = generateTranscriptForSummary(messages);

    const summaryPrompt = `Analyze the following conversation and provide a very concise, one-sentence summary of what is being discussed. Return only the summary text.\n\n---\n\n${conversationTranscript}`;
    
    try {
        const response = await ai.models.generateContent({
            model: model,
            contents: summaryPrompt
        });
        const summary = response.text.trim().replace(/^["']|["']$/g, "");
        return summary || "Unable to generate summary.";
    } catch (error) {
        console.error("Error generating summary:", error);
        return "Unable to generate summary.";
    }
}