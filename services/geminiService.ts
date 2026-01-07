
import { GoogleGenAI } from "@google/genai";

// Initialize the Gemini API client using the environment variable.
// Guidelines: Always use a named parameter and obtain from process.env.API_KEY.
const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });

export const generateAuctionDescription = async (title: string): Promise<string> => {
  try {
    // Guidelines: Use 'gemini-3-flash-preview' for basic text tasks.
    const response = await ai.models.generateContent({
      model: 'gemini-3-flash-preview',
      contents: `Write a punchy, 2-sentence sales description for an auction item titled: "${title}". Focus on excitement and value.`,
    });
    // Guidelines: Access the .text property directly (not a method).
    return response.text || "No description generated.";
  } catch (error) {
    console.error("Gemini API Error:", error);
    return "Could not generate description at this time.";
  }
};
