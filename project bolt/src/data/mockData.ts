import { Country, NewsItem, FactorWeight, ApiSource } from '../types';
import { format, subDays, subHours } from 'date-fns';

export const COUNTRY_DATA: Country[] = [
  {
    id: '1',
    name: 'Nigeria',
    code: 'NG',
    flagUrl: 'https://flagcdn.com/ng.svg',
    scores: {
      infrastructure: 6.2,
      regulation: 5.8,
      marketDemand: 8.5,
      stability: 5.4,
      partnerships: 7.2
    },
    lastUpdated: format(subHours(new Date(), 23), 'yyyy-MM-dd HH:mm:ss')
  },
  {
    id: '2',
    name: 'Ghana',
    code: 'GH',
    flagUrl: 'https://flagcdn.com/gh.svg',
    scores: {
      infrastructure: 6.8,
      regulation: 7.2,
      marketDemand: 6.5,
      stability: 7.8,
      partnerships: 6.7
    },
    lastUpdated: format(subHours(new Date(), 22), 'yyyy-MM-dd HH:mm:ss')
  },
  {
    id: '3',
    name: 'South Africa',
    code: 'ZA',
    flagUrl: 'https://flagcdn.com/za.svg',
    scores: {
      infrastructure: 8.5,
      regulation: 7.5,
      marketDemand: 7.2,
      stability: 6.2,
      partnerships: 8.3
    },
    lastUpdated: format(subHours(new Date(), 21), 'yyyy-MM-dd HH:mm:ss')
  },
  {
    id: '4',
    name: 'Kenya',
    code: 'KE',
    flagUrl: 'https://flagcdn.com/ke.svg',
    scores: {
      infrastructure: 6.5,
      regulation: 6.8,
      marketDemand: 7.4,
      stability: 6.6,
      partnerships: 7.5
    },
    lastUpdated: format(subHours(new Date(), 20), 'yyyy-MM-dd HH:mm:ss')
  },
  {
    id: '5',
    name: 'Egypt',
    code: 'EG',
    flagUrl: 'https://flagcdn.com/eg.svg',
    scores: {
      infrastructure: 7.4,
      regulation: 5.5,
      marketDemand: 7.8,
      stability: 5.2,
      partnerships: 6.9
    },
    lastUpdated: format(subHours(new Date(), 19), 'yyyy-MM-dd HH:mm:ss')
  },
  {
    id: '6',
    name: 'Morocco',
    code: 'MA',
    flagUrl: 'https://flagcdn.com/ma.svg',
    scores: {
      infrastructure: 7.8,
      regulation: 6.9,
      marketDemand: 6.7,
      stability: 7.5,
      partnerships: 7.2
    },
    lastUpdated: format(subHours(new Date(), 18), 'yyyy-MM-dd HH:mm:ss')
  }
];

export const FACTOR_WEIGHTS: FactorWeight[] = [
  {
    factor: 'infrastructure',
    weight: 0.25,
    displayName: 'Infrastructure',
    description: 'Quality and availability of physical infrastructure including power, transport, and telecommunications'
  },
  {
    factor: 'regulation',
    weight: 0.2,
    displayName: 'Regulation',
    description: 'Regulatory environment, ease of doing business, and legal frameworks'
  },
  {
    factor: 'marketDemand',
    weight: 0.25,
    displayName: 'Market Demand',
    description: 'Size of market, growth potential, and consumer purchasing power'
  },
  {
    factor: 'stability',
    weight: 0.15,
    displayName: 'Stability',
    description: 'Political stability, economic stability, and security situation'
  },
  {
    factor: 'partnerships',
    weight: 0.15,
    displayName: 'Partnerships',
    description: 'Availability of local partners, trade agreements, and international relations'
  }
];

export const NEWS_ITEMS: NewsItem[] = [
  {
    id: '1',
    title: 'Nigeria approves $3B infrastructure investment plan for power grid expansion',
    source: 'African Business Review',
    date: format(subDays(new Date(), 2), 'yyyy-MM-dd'),
    url: '#',
    countryCode: 'NG',
    relevantFactor: 'infrastructure'
  },
  {
    id: '2',
    title: 'South Africa eases regulations for foreign investors in manufacturing sector',
    source: 'Global Trade Magazine',
    date: format(subDays(new Date(), 3), 'yyyy-MM-dd'),
    url: '#',
    countryCode: 'ZA',
    relevantFactor: 'regulation'
  },
  {
    id: '3',
    title: 'Kenya\'s consumer spending reaches 5-year high, boosting market confidence',
    source: 'East African Economic Review',
    date: format(subDays(new Date(), 1), 'yyyy-MM-dd'),
    url: '#',
    countryCode: 'KE',
    relevantFactor: 'marketDemand'
  },
  {
    id: '4',
    title: 'Ghana maintains political stability following peaceful elections',
    source: 'West Africa Today',
    date: format(subDays(new Date(), 5), 'yyyy-MM-dd'),
    url: '#',
    countryCode: 'GH',
    relevantFactor: 'stability'
  },
  {
    id: '5',
    title: 'Morocco signs new trade partnership with European Union',
    source: 'Mediterranean Business Journal',
    date: format(subDays(new Date(), 4), 'yyyy-MM-dd'),
    url: '#',
    countryCode: 'MA',
    relevantFactor: 'partnerships'
  },
  {
    id: '6',
    title: 'Egypt launches major port expansion to boost international trade',
    source: 'North African Commerce',
    date: format(subDays(new Date(), 2), 'yyyy-MM-dd'),
    url: '#',
    countryCode: 'EG',
    relevantFactor: 'infrastructure'
  }
];

export const API_SOURCES: ApiSource[] = [
  {
    id: '1',
    name: 'World Bank',
    description: 'Development indicators and economic data',
    url: 'https://data.worldbank.org/country',
    dataPoints: ['GDP growth', 'Ease of Doing Business', 'Infrastructure Quality Index']
  },
  {
    id: '2',
    name: 'IMF',
    description: 'Macroeconomic stability metrics',
    url: 'https://www.imf.org/en/Data',
    dataPoints: ['Inflation Rate', 'Current Account Balance', 'Fiscal Stability']
  },
  {
    id: '3',
    name: 'African Development Bank',
    description: 'African economic outlooks and development indicators',
    url: 'https://www.afdb.org/en/knowledge/statistics',
    dataPoints: ['Regional Integration Index', 'Industrial Growth', 'Development Funding']
  },
  {
    id: '4',
    name: 'Trading Economics',
    description: 'Economic indicators and market data',
    url: 'https://tradingeconomics.com/countries',
    dataPoints: ['Business Confidence', 'Industrial Production', 'Unemployment Rate']
  },
  {
    id: '5',
    name: 'Eurostat',
    description: 'European trade data with African nations',
    url: 'https://ec.europa.eu/eurostat/data/database',
    dataPoints: ['Import/Export Volumes', 'Trade Balance', 'Investment Flows']
  }
];