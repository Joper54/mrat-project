import { News, NewsAnalysis } from '../types';

const DEEPSEEK_API_KEY = 'sk-25db6ab5fbbf4c62819e20659bd032d2';
const OPENROUTER_API_KEY = import.meta.env.VITE_OPENROUTER_API_KEY;

const DEEPSEEK_BASE_URL = 'https://api.deepseek.com';
const OPENROUTER_BASE_URL = 'https://openrouter.ai/api/v1';

export const analyzeNewsWithAI = async (news: News[]): Promise<NewsAnalysis> => {
  let analysis: NewsAnalysis | null = null;

  try {
    // Try DeepSeek first
    const deepseekUrl = `${DEEPSEEK_BASE_URL}/v1/chat/completions`;
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
      ],
      "sources": [
        {
          "title": "Source title",
          "url": "Source URL",
          "reliability": "high/medium/low"
        }
      ]
    }

    Articles to analyze:
    ${JSON.stringify(news, null, 2)}`;

    const response = await fetch(deepseekUrl, {
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
        max_tokens: 2500
      })
    });

    if (response.ok) {
      const data = await response.json();
      analysis = JSON.parse(data.choices[0].message.content);
    }
  } catch (error) {
    console.error('DeepSeek analysis error:', error);
  }

  // If DeepSeek fails, try OpenRouter
  if (!analysis && OPENROUTER_API_KEY) {
    try {
      const openrouterUrl = `${OPENROUTER_BASE_URL}/chat/completions`;
      const response = await fetch(openrouterUrl, {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${OPENROUTER_API_KEY}`,
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({
          model: 'anthropic/claude-3-opus-20240229',
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
          max_tokens: 2500
        })
      });

      if (response.ok) {
        const data = await response.json();
        analysis = JSON.parse(data.choices[0].message.content);
      }
    } catch (error) {
      console.error('OpenRouter analysis error:', error);
    }
  }

  return analysis || {
    summary: 'Analysis not available',
    sentiment: 'neutral',
    keyPoints: [],
    implications: [],
    recommendations: [],
    sources: [],
    timestamp: new Date().toISOString()
  };
};