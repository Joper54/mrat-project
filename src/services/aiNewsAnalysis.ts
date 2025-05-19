import { News } from '../types';

const OPENROUTER_API_KEY = import.meta.env.VITE_OPENROUTER_API_KEY;
const NEWSAPI_KEY = '6bc821b5eda24b81b83bb021781cff1d';

export async function analyzeNewsWithAI(news: News[]) {
  if (!NEWSAPI_KEY) {
    console.warn('NewsAPI key not found. Skipping news analysis.');
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
    const response = await fetch('https://newsapi.org/v2/top-headlines?q=news&apiKey=' + NEWSAPI_KEY);
    if (!response.ok) throw new Error('Failed to fetch news for analysis');
    const data = await response.json();
    // Use the fetched news for analysis
    const articles = data.articles || [];
    return articles.map((article: any) => ({
      headline: article.title,
      sentiment: 'neutral' // Default sentiment, can be updated with AI analysis if needed
    }));
  } catch (error) {
    console.error('Error analyzing news with NewsAPI:', error);
    return news.map(article => ({
      headline: article.title,
      sentiment: 'neutral'
    }));
  }
}