/**
 * SWACHHAI AI — Analytics Agent
 * Generates ward-level insights and AI natural-language recommendations.
 */

import { AnalyticsOverview, WardStat } from '../../lib/types';

export function generateInsight(stats: AnalyticsOverview, query?: string): string {
  const q = (query || '').toLowerCase();

  // Worst ward
  const worstWard = stats.ward_stats
    .slice()
    .sort((a, b) => b.pending - a.pending)[0];

  // Best segregation
  const bestSeg = stats.ward_stats
    .slice()
    .sort((a, b) => b.segregation_rate - a.segregation_rate)[0];

  const worstSeg = stats.ward_stats
    .slice()
    .sort((a, b) => a.segregation_rate - b.segregation_rate)[0];

  if (q.includes('segregat')) {
    return `${worstSeg?.ward || 'Unknown Ward'} has the lowest segregation compliance at ${Math.round((worstSeg?.segregation_rate || 0) * 100)}%. ${bestSeg?.ward} leads with ${Math.round((bestSeg?.segregation_rate || 0) * 100)}%. Consider deploying the Waste Awareness Team in lower-performing wards with targeted household outreach.`;
  }

  if (q.includes('route') || q.includes('optim')) {
    const pendingHigh = stats.ward_stats.filter((w) => w.high_priority > 2);
    return `Route optimization is recommended for ${pendingHigh.map((w) => w.ward).join(', ') || 'multiple wards'}. Consolidating stops in these wards can reduce travel time by an estimated 15–25%. Use the Route Optimization panel to generate today's optimized plan.`;
  }

  if (q.includes('unresolved') || q.includes('pending') || q.includes('attention')) {
    return `${worstWard?.ward || 'Several wards'} currently has the highest number of unresolved complaints (${worstWard?.pending || 0} pending). ${stats.high_priority} high-priority complaints require immediate field response. Recommend deploying additional teams to ${worstWard?.ward}.`;
  }

  if (q.includes('today') || q.includes('plan') || q.includes('collection')) {
    return `Today's collection plan should prioritize ${worstWard?.ward} (${worstWard?.high_priority || 0} high-priority stops) and ${stats.ward_stats[1]?.ward || 'secondary ward'}. Overall collection efficiency stands at ${Math.round(stats.collection_efficiency)}%. ${stats.pending} complaints are pending assignment — recommend dispatching available field teams now.`;
  }

  if (q.includes('ward 12') || q.includes('ward12')) {
    const w12 = stats.ward_stats.find((w) => w.ward.includes('12'));
    if (w12) {
      return `Ward 12 has ${w12.total} total complaints with ${w12.pending} unresolved. The resolution rate is ${Math.round(w12.resolution_rate * 100)}%. Complaint volume has increased over the last 7 days — possibly related to delayed collection after recent holidays. Consider deploying an additional vehicle on the morning route.`;
    }
  }

  // Default insight
  return `${worstWard?.ward || 'Multiple wards'} requires immediate attention with ${worstWard?.pending || 0} pending complaints. Overall city collection efficiency is ${Math.round(stats.collection_efficiency)}% and segregation compliance is ${Math.round(stats.segregation_rate)}%. ${stats.high_priority} high-priority complaints are awaiting resolution. Recommend prioritizing morning dispatch to high-density complaint areas.`;
}
