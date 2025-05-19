import { format, parseISO } from 'date-fns';

export const formatDate = (dateString: string): string => {
  try {
    return format(parseISO(dateString), 'MMM d, yyyy');
  } catch (error) {
    return 'Invalid date';
  }
};

export const getScoreColor = (score: number): string => {
  if (score >= 9) return 'text-emerald-500';
  if (score >= 7) return 'text-green-500';
  if (score >= 5) return 'text-yellow-500';
  if (score >= 3) return 'text-orange-500';
  return 'text-red-500';
};

export const getScoreBgColor = (score: number): string => {
  if (score >= 9) return 'bg-emerald-100 dark:bg-emerald-900/30';
  if (score >= 7) return 'bg-green-100 dark:bg-green-900/30';
  if (score >= 5) return 'bg-yellow-100 dark:bg-yellow-900/30';
  if (score >= 3) return 'bg-orange-100 dark:bg-orange-900/30';
  return 'bg-red-100 dark:bg-red-900/30';
};

export const aspectNameMap: Record<string, string> = {
  infrastructure: 'Infrastructure',
  regulatory: 'Regulatory',
  market_demand: 'Market Demand',
  stability: 'Stability',
  partnership: 'Partnership'
};