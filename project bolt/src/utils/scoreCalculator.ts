import { Country, FactorWeight, FactorType } from '../types';

/**
 * Calculate the total weighted score for a country
 */
export function calculateTotalScore(country: Country, weights: FactorWeight[]): number {
  let totalScore = 0;
  let totalWeight = 0;
  
  weights.forEach(weight => {
    const factor = weight.factor;
    const score = country.scores[factor];
    totalScore += score * weight.weight;
    totalWeight += weight.weight;
  });
  
  // Normalize to ensure weights add up to 1
  if (totalWeight > 0 && totalWeight !== 1) {
    totalScore = totalScore / totalWeight;
  }
  
  return Number(totalScore.toFixed(2));
}

/**
 * Determine risk level based on total score
 */
export function determineRiskLevel(score: number): 'low' | 'medium' | 'high' {
  if (score >= 7.5) return 'low';
  if (score >= 6) return 'medium';
  return 'high';
}

/**
 * Process country data with scores and risk levels
 */
export function processCountryData(
  countries: Country[],
  weights: FactorWeight[]
): Country[] {
  return countries.map(country => {
    const totalScore = calculateTotalScore(country, weights);
    const riskLevel = determineRiskLevel(totalScore);
    
    return {
      ...country,
      totalScore,
      riskLevel
    };
  }).sort((a, b) => (b.totalScore || 0) - (a.totalScore || 0));
}

/**
 * Get color class based on score
 */
export function getScoreColorClass(score: number): string {
  if (score >= 7.5) return 'text-green-600';
  if (score >= 6) return 'text-warning-500';
  return 'text-danger-500';
}

/**
 * Get risk level display information
 */
export function getRiskLevelInfo(riskLevel: 'low' | 'medium' | 'high') {
  switch (riskLevel) {
    case 'low':
      return { 
        label: 'Low Risk', 
        class: 'traffic-light-green',
        textClass: 'text-green-600'
      };
    case 'medium':
      return { 
        label: 'Medium Risk', 
        class: 'traffic-light-amber',
        textClass: 'text-warning-500'
      };
    case 'high':
      return { 
        label: 'High Risk', 
        class: 'traffic-light-red',
        textClass: 'text-danger-500'
      };
  }
}

/**
 * Format a score for display
 */
export function formatScore(score: number): string {
  return score.toFixed(1);
}