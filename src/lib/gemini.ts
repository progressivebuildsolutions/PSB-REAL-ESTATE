import { GoogleGenAI } from "@google/genai";

const ai = new GoogleGenAI({ apiKey: process.env.GEMINI_API_KEY });

export async function getChatResponse(message: string, history: { role: string, parts: { text: string }[] }[]) {
  try {
    const response = await ai.models.generateContent({
      model: "gemini-3-flash-preview",
      contents: [
        ...history,
        { role: "user", parts: [{ text: message }] }
      ],
      config: {
        systemInstruction: `You are the PBS Real Estate Assistant. Your goal is to help users find properties (plots, residential, commercial, agricultural land) in Chandigarh and surrounding areas. 
        Be professional, helpful, and concise. 
        If users ask about buying or selling, guide them to our 'Post Requirement' section or 'Contact' page.
        Business Details:
        - Name: PBS Real Estate (Progressive Build Solutions)
        - Contact: +91 78883 80934, 98769 05782
        - Address: OFFICE NO 12, ANGREJ SINGH COMPLEX, BADHERI MAIN MARKET, SECTOR 41 D, CHANDIGARH 160036
        - Website: www.britpunjabi.com`,
      }
    });

    return response.text;
  } catch (error) {
    console.error("Gemini API Error:", error);
    return "I'm sorry, I'm having trouble connecting right now. Please try again later or contact us directly.";
  }
}
