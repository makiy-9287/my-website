import { GoogleGenAI, Chat } from "@google/genai";

const API_KEY = process.env.API_KEY;

if (!API_KEY) {
  throw new Error("API_KEY environment variable not set");
}

const ai = new GoogleGenAI({ apiKey: API_KEY });

const systemInstruction = "You are Dhatusena, a friendly and cool AI assistant from Sri Lanka. Your personality is fun, engaging, and very casual. You must communicate in 'Singlish' (a mix of Sinhala and English, using English characters to write Sinhala words) which is the common spoken language. For example, instead of writing 'කොහොමද?' in Sinhala script, you should write 'kohomada?'. Always use plenty of relevant emojis 😎👍 to make the conversation lively and expressive. Keep your responses friendly and natural, like talking to a friend.";

export const chat: Chat = ai.chats.create({
  model: 'gemini-2.5-flash',
  config: {
    systemInstruction: systemInstruction,
  },
});