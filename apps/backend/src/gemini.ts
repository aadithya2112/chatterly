import { GoogleGenAI } from "@google/genai";

// Initialize the GoogleGenAI client with the API key
const ai = new GoogleGenAI({
  apiKey: process.env.GEMINI_API_KEY,
});

/**
 * Fetches a response from the Gemini AI model based on the given user input.
 * @param userInput - The input string from the user.
 * @returns A promise that resolves to the AI-generated response.
 */
export async function fetchGeminiResponse(userInput: string): Promise<string> {
  try {
    const response = await ai.models.generateContent({
      model: "gemini-2.0-flash", // Specify the Gemini model to use
      contents: userInput, // Pass the user's input to the model
    });

    // Return the AI-generated text
    return response.text ?? "No response received from Gemini.";
  } catch (error) {
    console.error("Error communicating with Gemini API:", error);
    throw new Error("Failed to fetch response from Gemini.");
  }
}

// * Test
// fetchGeminiResponse("Hello, how are you?")
//   .then((response) => {
//     console.log("Gemini response:", response);
//   })
//   .catch((error) => {
//     console.error("Error:", error);
//   });
