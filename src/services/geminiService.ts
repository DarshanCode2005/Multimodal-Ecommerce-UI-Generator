'use client';

import { GoogleGenerativeAI } from '@google/generative-ai';

// Initialize the Google Generative AI with your API key
const API_KEY = 'AIzaSyA74zBrkTE-45wosV0xQz0GPjVucCD8eNg';
const genAI = new GoogleGenerativeAI(API_KEY);

type ElementData = {
  type: string;
  code: string;
};

type MultimodalData = {
  colorScheme?: string;
  images?: string[]; // Base64 encoded image strings
  brandGuidelines?: string;
};

export async function modifyElementWithAI(
  element: ElementData,
  instruction: string,
  multimodalData?: MultimodalData
): Promise<string> {
  try {
    // Use the same function for both text-only and multimodal prompts
    // We'll use a text-based description for images instead of actual image data
    return await handlePromptWithGeminiFlash(element, instruction, multimodalData);
  } catch (error) {
    console.error('Error in Gemini API:', error);
    // Return fallback response if API fails
    return generateFallbackResponse(element, instruction);
  }
}

async function handlePromptWithGeminiFlash(
  element: ElementData,
  instruction: string,
  multimodalData?: MultimodalData
): Promise<string> {
  // Get Gemini 2.0 Flash model
  const model = genAI.getGenerativeModel({ model: 'gemini-2.0-flash' });

  // Build prompt
  let promptText = `
I have a React component element of type "${element.type}". Here's the current JSX code:

\`\`\`jsx
${element.code}
\`\`\`

User's instruction: "${instruction}"
`;

  // Add color scheme information if provided
  if (multimodalData?.colorScheme) {
    promptText += `\n\nColor scheme: ${multimodalData.colorScheme}`;
  }

  // Add brand guidelines if provided
  if (multimodalData?.brandGuidelines) {
    promptText += `\n\nBrand guidelines: ${multimodalData.brandGuidelines}`;
  }

  // Add image descriptions if images are provided
  if (multimodalData?.images && multimodalData.images.length > 0) {
    promptText += `\n\nThe user has uploaded ${multimodalData.images.length} image(s). Since I cannot see the images directly, please incorporate visual elements that would generally go well with the component based on the user's instruction.`;
    
    // Add generic image description
    promptText += `\n\nAssume the images might contain design inspiration, color themes, layouts, or specific elements that the user wants incorporated into the component.`;
  }

  promptText += `\n\nPlease modify the JSX code according to the instruction and any other provided information. Return ONLY the complete, modified HTML that can be directly inserted into the page. Your response should contain no explanation, comments, or any text that is not part of the HTML/JSX code output.

IMPORTANT: 
1. Convert React JSX attributes to HTML-compatible attributes:
   - Change 'className' to 'class'
   - Convert style objects to inline style strings
   - Convert event handlers from JSX style to HTML style (onClick={handleClick} → onclick="handleClick()")
2. Keep all HTML tags properly nested and closed
3. Return ONLY the HTML with no markdown, no code blocks, and no explanations
`;

  // Create generation config for gemini-2.0-flash
  const generationConfig = {
    temperature: 0.2,
    topK: 32,
    topP: 1,
    maxOutputTokens: 8192,
  };

  // Generate content
  const result = await model.generateContent({
    contents: [{ role: 'user', parts: [{ text: promptText }] }],
    generationConfig,
  });
  
  const response = result.response;
  const text = response.text();
  
  // Clean the response
  return cleanCodeResponse(text);
}

function cleanCodeResponse(response: string): string {
  // If the response contains code blocks, extract the code
  if (response.includes('```jsx') || response.includes('```html') || response.includes('```xml')) {
    const codeMatch = response.match(/```(?:jsx|html|xml)\s*([\s\S]+?)\s*```/);
    if (codeMatch && codeMatch[1]) {
      return codeMatch[1].trim();
    }
  }
  
  if (response.includes('```')) {
    const codeMatch = response.match(/```\s*([\s\S]+?)\s*```/);
    if (codeMatch && codeMatch[1]) {
      return codeMatch[1].trim();
    }
  }
  
  // If response starts with an HTML tag, assume it's already clean HTML
  if (response.trim().startsWith('<') && response.trim().endsWith('>')) {
    return response.trim();
  }
  
  // If no code blocks are found, just return the trimmed response
  return response.trim();
}

// Fallback function that returns a simple modified version of the code
function generateFallbackResponse(element: ElementData, instruction: string): string {
  return `${element.code}
<!-- 
This is a fallback response. The Gemini API was not available.
The following modification was requested: "${instruction}"
-->`;
} 