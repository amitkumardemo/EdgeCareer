import { GoogleGenerativeAI } from "@google/generative-ai";

// Check if API key is available
const apiKey = process.env.GOOGLE_AI_API_KEY;
if (!apiKey) {
  console.error('GOOGLE_AI_API_KEY is not set in environment variables');
}

// Initialize the Google Generative AI with API key
const genAI = new GoogleGenerativeAI(apiKey);

async function parseAIResponse(content) {
  if (!content) throw new Error("No content received from AI");
  
  try {
    // Try to parse directly first
    return JSON.parse(content);
  } catch (e) {
    // If direct parse fails, try to extract JSON from markdown code blocks
    const match = content.match(/```(?:json)?\s*([\s\S]*?)\s*```/i);
    if (match && match[1]) {
      return JSON.parse(match[1].trim());
    }
    
    // Try to find a JSON array in the content
    const arrayMatch = content.match(/\[\s*\{[\s\S]*?\}\s*\]/);
    if (arrayMatch && arrayMatch[0]) {
      return JSON.parse(arrayMatch[0]);
    }
    
    throw new Error("Could not parse AI response as JSON");
  }
}

export async function POST(req) {
  try {
    const { topic } = await req.json();
    
    if (!topic) {
      return new Response(JSON.stringify({ error: 'Topic is required' }), {
        status: 400,
        headers: { 'Content-Type': 'application/json' },
      });
    }

    if (!apiKey) {
      throw new Error('Google AI API key is not configured. Please set GOOGLE_AI_API_KEY in your environment variables.');
    }

    // Using the free gemini-pro model
    const model = genAI.getGenerativeModel({ model: 'gemini-2.0-flash-exp' });

    const prompt = `You are an expert product strategist and professional roadmap architect with 15+ years of experience in tech project planning, stakeholder alignment, and Agile execution.
    
    Generate a detailed, practical, and actionable roadmap for: ${topic}.
    
    Format the response as a JSON array with the following structure for each item:
    {
      "title": "Step Title",
      "description": "Detailed description of this step",
      "id": "unique-id-number",
      "estimated_time": "X hours/days/weeks"
    }
    
    Important Notes:
    1. Return ONLY the JSON array, no other text or markdown formatting
    2. Include 5-10 key steps for a comprehensive roadmap
    3. Make the steps specific, measurable, and time-bound
    4. Focus on practical, actionable items
    5. Ensure the response is valid JSON that can be parsed with JSON.parse()`;

    const result = await model.generateContent(prompt);
    const response = await result.response;
    const text = response.text();

    console.log("AI Response:", text);

    try {
      const roadmap = await parseAIResponse(text);
      
      // Ensure we have a valid array with required fields
      if (!Array.isArray(roadmap)) {
        throw new Error('AI response is not an array');
      }

      // Validate each step has required fields
      const validatedRoadmap = roadmap.map((step, index) => ({
        id: step.id || index + 1,
        title: step.title || `Step ${index + 1}`,
        description: step.description || '',
        estimated_time: step.estimated_time || 'Not specified'
      }));

      return new Response(JSON.stringify(validatedRoadmap), {
        status: 200,
        headers: { 'Content-Type': 'application/json' },
      });
    } catch (parseError) {
      console.error('Error parsing AI response:', parseError);
      return new Response(JSON.stringify({
        error: 'Failed to parse AI response',
        details: parseError.message,
        rawResponse: text
      }), {
        status: 500,
        headers: { 'Content-Type': 'application/json' },
      });
    }
  } catch (error) {
    console.error('Error in generate-roadmap API:', error);
    return new Response(JSON.stringify({
      error: 'Failed to generate roadmap',
      details: error.message
    }), {
      status: 500,
      headers: { 'Content-Type': 'application/json' },
    });
  }
}
