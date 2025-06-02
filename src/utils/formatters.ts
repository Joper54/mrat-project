import { format, parseISO, formatDistanceToNow } from 'date-fns';

export const formatDate = (dateString: string): string => {
  try {
    return format(parseISO(dateString), 'MMM d, yyyy');
  } catch (error) {
    return 'Invalid date';
  }
};

export const formatTimeAgo = (dateString: string): string => {
  try {
    return formatDistanceToNow(parseISO(dateString), { addSuffix: true });
  } catch (error) {
    return '';
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

export function getCountryFlagEmoji(code: string): string {
  // Try to convert ISO country code to flag emoji
  const map: Record<string, string> = {
    NG: '🇳🇬', NGA: '🇳🇬',
    GH: '🇬🇭', GHA: '🇬🇭',
    ZA: '🇿🇦', ZAF: '🇿🇦',
    KE: '🇰🇪', KEN: '🇰🇪',
    EG: '🇪🇬', EGY: '🇪🇬',
    MA: '🇲🇦', MAR: '🇲🇦',
    DZ: '🇩🇿', DZA: '🇩🇿',
    CI: '🇨🇮', CIV: '🇨🇮',
    SN: '🇸🇳', SEN: '🇸🇳',
    ET: '🇪🇹', ETH: '🇪🇹',
    SD: '🇸🇩', SDN: '🇸🇩',
    TN: '🇹🇳', TUN: '🇹🇳',
    AO: '🇦🇴', AGO: '🇦🇴',
    MZ: '🇲🇿', MOZ: '🇲🇿',
    CM: '🇨🇲', CMR: '🇨🇲',
    UG: '🇺🇬', UGA: '🇺🇬',
    // Add more as needed
  };
  const upper = code.toUpperCase();
  if (map[upper]) return map[upper];
  // Try to convert 2-letter code to flag
  if (upper.length === 2) {
    return String.fromCodePoint(...[...upper].map(c => 0x1f1e6 - 65 + c.charCodeAt(0)));
  }
  return '🌍';
}