import { News } from '../types';

const OPENROUTER_API_KEY = import.meta.env.VITE_OPENROUTER_API_KEY;

export async function analyzeNewsWithAI(news: News[]) {
  if (!OPENROUTER_API_KEY) {
    console.warn('OpenRouter API key not found. Skipping sentiment analysis.');
    return news.map(article => ({
      headline: article.title,
      sentiment: 'neutral'
    }));
  }

  const newsHeadlines = news.map(article => article.title);
  const prompt = `Analyze the following news headlines for sentiment (positive, negative, neutral) and return a JSON array with "headline" and "sentiment":\n${
    newsHeadlines.map((h, i) => `${i + 1}. ${h}`).join('\n')
  }`;

  try {
    const response = await fetch('https://openrouter.ai/api/v1/chat/completions', {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${OPENROUTER_API_KEY}`,
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({
        model: "openai/gpt-4",
        messages: [
          {
            role: "user",
            content: prompt
          }
        ]
      })
    });

    if (!response.ok) {
      throw new Error(`OpenRouter API error: ${response.statusText}`);
    }

    const data = await response.json();
    const aiText = data.choices[0].message.content;
    
    try {
      const jsonStart = aiText.indexOf('[');
      const jsonEnd = aiText.lastIndexOf(']');
      if (jsonStart !== -1 && jsonEnd !== -1) {
        return JSON.parse(aiText.substring(jsonStart, jsonEnd + 1));
      }
      return aiText;
    } catch (e) {
      console.error('Error parsing AI response:', e);
      return aiText;
    }
  } catch (error) {
    console.error('Error analyzing news with AI:', error);
    // Return neutral sentiment as fallback
    return news.map(article => ({
      headline: article.title,
      sentiment: 'neutral'
    }));
  }
}