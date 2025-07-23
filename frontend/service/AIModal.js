import { GoogleGenAI } from "@google/genai";
export async function streamAIResponse(prompt) {
  const genAI = new GoogleGenAI({
    apiKey: import.meta.env.VITE_GEMINI_API_KEY,
  });

  const model = 'gemini-2.0-flash';

  const contents = [
    {
      role: 'user',
      parts: [{ text: prompt }],
    },
  ];

  const config = {
    responseMimeType: 'text/plain',
  };

  const response = await genAI.models.generateContentStream({
    contents,
    model,
    config,
  });

  let fullText = '';

  for await (const chunk of response) {
    const text = chunk.candidates[0].content.parts[0].text;
    fullText += text;
  }

  // Try to find JSON block first
  const jsonMatch = fullText.match(/```json([\s\S]*?)```/i);
  const htmlMatch = fullText.match(/```html([\s\S]*?)```/i);

  let result = null;

  if (jsonMatch) {
    try {
      const jsonString = jsonMatch[1].trim();
      result = JSON.parse(jsonString);
    } catch (err) {
      console.error('Failed to parse JSON:', err);
    }
  } else if (htmlMatch) {
    result = htmlMatch[1].trim();
  } else {
    console.warn('No JSON or HTML block found in AI response.');
  }

  return result;
}
