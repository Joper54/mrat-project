import { News } from '../types';

const DEEPSEEK_API_KEY = 'sk-25db6ab5fbbf4c62819e20659bd032d2';
const DEEPSEEK_BASE_URL = 'https://api.deepseek.com';

export const analyzeNewsWithAI = async (news: News[]): Promise<NewsAnalysis> => {
  if (!DEEPSEEK_API_KEY) throw new Error('DeepSeek API key not set');

  const prompt = `Analyze the following news articles and provide insights about the country's current situation:
    ${JSON.stringify(news, null, 2)}
    
    Please provide:
    1. A brief summary of the main developments
    2. Key trends and patterns
    3. Potential implications for the country's development
    4. Areas of concern or opportunity`;

  const response = await fetch(`${DEEPSEEK_BASE_URL}/v1/chat/completions`, {
    method: 'POST',
    headers: {
      'Authorization': `Bearer ${DEEPSEEK_API_KEY}`,
      'Content-Type': 'application/json'
    },
    body: JSON.stringify({
      model: 'deepseek-chat',
      messages: [
        {
          role: 'system',
          content: 'You are an expert analyst specializing in African development and current affairs.'
        },
        {
          role: 'user',
          content: prompt
        }
      ],
      temperature: 0.7,
      max_tokens: 1000
    })
  });

  if (!response.ok) {
    throw new Error('Failed to analyze news with DeepSeek AI');
  }

  const data = await response.json();
  return {
    summary: data.choices[0].message.content,
    sentiment: 'neutral', // DeepSeek can provide this if needed
    keyPoints: [], // DeepSeek can provide this if needed
    timestamp: new Date().toISOString()
  };
};