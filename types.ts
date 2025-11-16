
export interface Message {
  role: 'user' | 'model';
  content: string;
  timestamp: number;
}

export interface Chat {
  id: string;
  title: string;
  messages: Message[];
  isPinned?: boolean;
}

export interface UserProfile {
  name: string;
  iconId: string;
}
