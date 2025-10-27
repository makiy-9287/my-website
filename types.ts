export enum Sender {
  User = 'user',
  Bot = 'bot',
}

export interface Message {
  id: string;
  text?: string;
  image?: string; // base64 data URL
  audio?: string; // base64 data URL
  sender: Sender;
  timestamp: string;
}