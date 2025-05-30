import { News } from '../types';

const DEEPSEEK_API_KEY = 'sk-25db6ab5fbbf4c62819e20659bd032d2';
const DEEPSEEK_BASE_URL = 'https://api.deepseek.com';

export const analyzeNewsWithAI = async (news: News[]): Promise<NewsAnalysis> => {
  if (!DEEPSEEK_API_KEY) throw new Error('DeepSeek API key not set');

  const prompt = `Analyze these news articles about ${news[0]?.country || 'the country'} and provide a detailed analysis in this JSON format:
  {
    "summary": "A comprehensive summary of the main developments",
    "sentiment": "positive/negative/neutral",
    "keyPoints": [
      "Key point 1",
      "Key point 2",
      "Key point 3"
    ],
    "implications": [
      "Implication 1",
      "Implication 2"
    ],
    "recommendations": [
      "Recommendation 1",
      "Recommendation 2"
    ]
  }

  Articles to analyze:
  ${JSON.stringify(news, null, 2)}`;

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
          content: 'You are an expert analyst specializing in African development and current affairs. Provide detailed, accurate analysis with specific examples and data points when available.'
        },
        {
          role: 'user',
          content: prompt
        }
      ],
      temperature: 0.7,
      max_tokens: 1500
    })
  });

  if (!response.ok) {
    throw new Error('Failed to analyze news with DeepSeek AI');
  }

  const data = await response.json();
  try {
    const analysis = JSON.parse(data.choices[0].message.content);
    return {
      summary: analysis.summary,
      sentiment: analysis.sentiment,
      keyPoints: analysis.keyPoints,
      implications: analysis.implications,
      recommendations: analysis.recommendations,
      timestamp: new Date().toISOString()
    };
  } catch (error) {
    console.error('Error parsing news analysis:', error);
    return {
      summary: data.choices[0].message.content,
      sentiment: 'neutral',
      keyPoints: [],
      implications: [],
      recommendations: [],
      timestamp: new Date().toISOString()
    };
  }
};