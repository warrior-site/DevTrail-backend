// config/gemini.js
import { GoogleGenerativeAI } from "@google/generative-ai";
import dotenv from "dotenv"
dotenv.config(); 

// Initialize Gemini
const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY);

// Use Gemini 2.0 Flash model
const model = genAI.getGenerativeModel({ model: "gemini-2.0-flash" });

/**
 * Generate polished resume data using Gemini
 * @param {Object} formattedData - Resume fields we pass in (projects, repos, summary, etc.)
 * @param {String} instruction - Extra instruction like "polish this", "autogenerate", etc.
 * @returns {Object} JSON response with polished/filled fields
 */
export async function generateResumeWithAI(formattedData, instruction) {
  try {
    const prompt = `
You are an expert resume builder.  
Task: ${instruction}  
Input data (JSON):  
${JSON.stringify(formattedData, null, 2)}

Rules:
- Output valid JSON only.
- Improve fields like summary, achievements, role descriptions.
- Keep it ATS-friendly.
    `;

    const result = await model.generateContent(prompt);

    // Gemini sometimes wraps JSON in code blocks -> clean it
    let text = result.response.text();
    text = text.replace(/```json|```/g, "").trim();

    return JSON.parse(text);
  } catch (error) {
    console.error("Gemini Resume Builder Error:", error);
    return { error: "Failed to generate resume data" };
  }
}
