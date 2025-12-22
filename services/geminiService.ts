
import { GoogleGenAI } from "@google/genai";

const getAIClient = () => {
  // Always use process.env.API_KEY string directly for client initialization.
  return new GoogleGenAI({ apiKey: process.env.API_KEY });
};

export const refineNoteContent = async (content: string, subject: string): Promise<string> => {
  const ai = getAIClient();
  const response = await ai.models.generateContent({
    model: 'gemini-3-flash-preview',
    contents: `As an administrative assistant at Gondwana University, refine the following note sheet content to be more formal, professional, and grammatically correct. Maintain the official university tone.
    Subject: ${subject}
    Original Content: ${content}`,
  });
  return response.text || content;
};

export const suggestRemark = async (noteContent: string, actionType: 'forward' | 'return'): Promise<string> => {
  const ai = getAIClient();
  const prompt = actionType === 'forward' 
    ? "Suggest a brief, professional administrative remark for forwarding this note sheet for further approval."
    : "Suggest a constructive and professional remark for returning this note sheet for review/corrections.";
    
  const response = await ai.models.generateContent({
    model: 'gemini-3-flash-preview',
    contents: `${prompt}
    Context: ${noteContent.substring(0, 500)}`,
  });
  return response.text || "";
};

export interface ChatMessage {
  role: 'user' | 'ai';
  text: string;
  image?: string; // Base64 data
}

export const getAIAssistantResponse = async (userQuery: string, chatHistory: ChatMessage[], userImage?: string): Promise<string> => {
  const ai = getAIClient();
  
  // Format history for context
  const historyString = chatHistory.map(h => `${h.role === 'user' ? 'Staff' : 'Assistant'}: ${h.text}`).join('\n');
  
  const systemInstruction = `You are the Gondwana NotePro Digital Assistant, an elite AI support system developed by Dr. Krishna Karoo (Assistant Professor, CS) for Gondwana University, Gadchiroli. 
    
    PERSONA:
    You speak with the authority and helpfulness of the Computer Science Department. You represent the expertise of Dr. Krishna Karoo.
    
    GOAL:
    Your goal is to help university staff with the NotePro system, explain the "Green Sheet" administrative workflows, and assist in drafting official dispatches.
    If the user provides an image, analyze it for statutory relevance or provide feedback on administrative forms/drafts visible in the image.
    
    Current Chat History:
    ${historyString}
    
    Rules:
    1. Be extremely professional, formal, and scholarly.
    2. If asked about the system developer, clearly state you were engineered by Dr. Krishna Karoo, Assistant Professor at the PG Teaching Dept. of Computer Science.
    3. Provide clear instructions on how to use the Admin Panel, create notes, and handle dispatches.
    4. Maintain the dignity of Gondwana University.`;

  const parts: any[] = [{ text: `${systemInstruction}\n\nStaff Query: ${userQuery}` }];
  
  if (userImage) {
    // Extract base64 data and mime type
    const mimeType = userImage.split(';')[0].split(':')[1];
    const base64Data = userImage.split(',')[1];
    parts.push({
      inlineData: {
        data: base64Data,
        mimeType: mimeType,
      },
    });
  }

  const response = await ai.models.generateContent({
    model: 'gemini-3-flash-preview',
    contents: { parts },
  });
  
  return response.text || "I apologize, I am unable to process that request at the moment. Please ensure your connectivity is stable.";
};
