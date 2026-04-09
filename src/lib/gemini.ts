import { GoogleGenAI } from "@google/genai";

let aiInstance: any = null;

function getAI() {
  if (!aiInstance) {
    const apiKey = process.env.GEMINI_API_KEY;
    if (!apiKey) {
      throw new Error("GEMINI_API_KEY is not configured");
    }
    aiInstance = new GoogleGenAI({ apiKey });
  }
  return aiInstance;
}

export async function getChatResponse(message: string, history: { role: string, parts: { text: string }[] }[]) {
  try {
    const ai = getAI();
    const response = await ai.models.generateContent({
      model: "gemini-3-flash-preview",
      contents: [
        ...history.map(h => ({
          role: h.role,
          parts: h.parts
        })),
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

    return response.text || "I'm sorry, I couldn't generate a response.";
  } catch (error) {
    console.error("Gemini API Error:", error);
    if (error instanceof Error && error.message.includes("not configured")) {
      return "The AI assistant is currently not configured. Please contact support or try again later.";
    }
    return "I'm sorry, I'm having trouble connecting right now. Please try again later or contact us directly.";
  }
}
