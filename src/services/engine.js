/**
 * Calculates a Readiness Score (0-100) for each ward.
 * Higher score means the ward is safer. Lower score means the ward is flooded.
 */
export function calculateReadinessScore(wardData, rainfallIntensity) {
  const { elevation, drainageHealth, greenCover } = wardData;

  // Initial calculation weighting the ward properties
  const baseScore = (elevation * 0.3) + (drainageHealth * 0.4) + (greenCover * 0.3);

  // Rainfall acts as a severe penalty based on how intense the storm is (from slider)
  // Assuming 200mm is maximum severity
  const rainfallPenaltyMultiplier = (rainfallIntensity / 200); 
  
  // Vulnerability acts as an exponent for the penalty
  const vulnerabilityFactor = 1 - (baseScore / 100);

  // Total penalty deduction
  const penalty = baseScore * (rainfallPenaltyMultiplier * vulnerabilityFactor);

  let finalScore = Math.max(0, Math.min(100, baseScore - penalty));

  // If Rainfall > 100mm and Elevation is Low (<40), force critical state (<40)
  if (rainfallIntensity > 100 && elevation < 40) {
    if (finalScore >= 40) finalScore = 39;
  }

  return Math.round(finalScore);
}
