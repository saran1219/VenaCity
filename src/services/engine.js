/**
 * Professional Hydrology Engine: VenaCity Core
 * Calculates the "Readiness Score" (0-100) for a city ward.
 */

export function calculateReadinessScore(wardData, rainfallIntensity) {
  const { elevation, drainageHealth } = wardData;

  // 1. BASE SCORE
  let score = 100;

  // 2. RAINFALL IMPACT (The primary stressor)
  // Higher weight means the map reacts faster to rain.
  // 0.8 weight means 100mm of rain causes an 80-point drop.
  const rainImpact = rainfallIntensity * 0.8;

  // 3. ELEVATION FACTOR
  // Low-lying areas (lower elevation) are penalized more.
  // If elevation is 5m (low), penalty is higher than if it is 20m.
  const elevationFactor = (25 - elevation) * 1.2;

  // 4. DRAINAGE HEALTH PENALTY
  // We subtract points if drainage health is LESS than 100%.
  // If health is 100%, penalty is 0. If health is 50%, penalty is 25 points.
  const drainagePenalty = (100 - drainageHealth) * 0.5;

  // 5. FINAL CALCULATION
  // Score = 100 - (Rain) - (Elevation Risk) - (Clogged Drains)
  score = score - rainImpact - (elevationFactor * (rainfallIntensity / 50)) - drainagePenalty;

  // 6. NORMALIZE
  // Cap the score between 0 and 100
  const finalScore = Math.max(0, Math.min(100, score));

  return Math.round(finalScore);
}

/**
 * LOGISTICS ENGINE
 * Returns a list of recommended resources based on the readiness score.
 */
export function getRecommendedAction(score) {
  if (score < 30) {
    return [
      "🚨 Deploy 10 Portable Pumps", 
      "🚤 5 Rescue Boats (NDRF)", 
      "🏥 Mobile Medical Unit",
      "⚠️ Mandatory Evacuation Alert"
    ];
  } else if (score < 60) {
    return [
      "🟡 5 Portable Pumps", 
      "🛶 2 Rescue Boats", 
      "🧹 Clear Secondary Drains"
    ];
  } else if (score < 80) {
    return [
      "🟢 Monitor Water Levels", 
      "📢 Community Advisory"
    ];
  }
  return ["✅ System Optimal - No Action Required"];
}

/**
 * COLOR MAPPING UTILITY
 * Returns the hex color based on the calculated score.
 */
export function getScoreColor(score) {
  if (score < 40) return '#ef4444'; // Red (Critical)
  if (score < 70) return '#facc15'; // Yellow (Warning)
  return '#22c55e'; // Green (Safe)
}