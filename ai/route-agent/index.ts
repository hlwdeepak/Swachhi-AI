/**
 * SWACHHAI AI — Route Optimization Agent
 * Generates optimized collection routes from complaint locations.
 */

import { RouteOptimizationResult, RouteStop, Priority } from '../../lib/types';

interface OptimizationInput {
  ward?: string;
  complaints: Array<{
    id: string;
    lat: number;
    lng: number;
    address: string;
    priority: Priority;
    category: string;
  }>;
  team?: string;
  vehicle?: string;
  depotLat?: number;
  depotLng?: number;
}

// Haversine distance in km
function haversine(lat1: number, lng1: number, lat2: number, lng2: number): number {
  const R = 6371;
  const dLat = ((lat2 - lat1) * Math.PI) / 180;
  const dLng = ((lng2 - lng1) * Math.PI) / 180;
  const a =
    Math.sin(dLat / 2) ** 2 +
    Math.cos((lat1 * Math.PI) / 180) *
      Math.cos((lat2 * Math.PI) / 180) *
      Math.sin(dLng / 2) ** 2;
  return R * 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
}

function totalDistance(stops: RouteStop[]): number {
  let dist = 0;
  for (let i = 1; i < stops.length; i++) {
    dist += haversine(stops[i - 1].lat, stops[i - 1].lng, stops[i].lat, stops[i].lng);
  }
  return Math.round(dist * 10) / 10;
}

// Nearest-neighbor greedy TSP
function nearestNeighborRoute(
  start: { lat: number; lng: number },
  points: RouteStop[]
): RouteStop[] {
  const unvisited = [...points];
  const route: RouteStop[] = [];
  let current = start;

  while (unvisited.length > 0) {
    let nearest = 0;
    let minDist = Infinity;
    for (let i = 0; i < unvisited.length; i++) {
      const d = haversine(current.lat, current.lng, unvisited[i].lat, unvisited[i].lng);
      if (d < minDist) {
        minDist = d;
        nearest = i;
      }
    }
    route.push(unvisited[nearest]);
    current = unvisited[nearest];
    unvisited.splice(nearest, 1);
  }
  return route;
}

export function optimizeRoute(input: OptimizationInput): RouteOptimizationResult {
  const depotLat = input.depotLat ?? 23.0225;
  const depotLng = input.depotLng ?? 72.5714;
  const vehicle = input.vehicle || 'Sanitation Vehicle SV-04';
  const team = input.team || 'Collection Team Alpha';

  const depot: RouteStop = {
    order: 0,
    type: 'depot',
    label: 'Municipal Depot',
    address: 'AMC Main Depot, Ahmedabad',
    lat: depotLat,
    lng: depotLng,
  };

  const transferStation: RouteStop = {
    order: 999,
    type: 'transfer',
    label: 'Transfer Station',
    address: 'City Waste Transfer Station',
    lat: depotLat + 0.05,
    lng: depotLng + 0.05,
  };

  // Sort original stops by priority (critical > high > medium > low), then order of submission
  const priorityOrder: Record<Priority, number> = {
    critical: 0,
    high: 1,
    medium: 2,
    low: 3,
  };

  const stops: RouteStop[] = input.complaints.map((c, idx) => ({
    order: idx + 1,
    type: 'complaint' as const,
    label: `${c.category} — ${c.address}`,
    address: c.address,
    lat: c.lat,
    lng: c.lng,
    priority: c.priority,
    complaint_id: c.id,
  }));

  // Original route: order as submitted
  const originalStops: RouteStop[] = [
    depot,
    ...stops.map((s, i) => ({ ...s, order: i + 1 })),
    { ...transferStation, order: stops.length + 1 },
  ];

  // Optimized route: prioritize critical/high, then nearest-neighbor
  const highPriority = stops.filter(
    (s) => s.priority === 'critical' || s.priority === 'high'
  );
  const lowPriority = stops.filter(
    (s) => s.priority !== 'critical' && s.priority !== 'high'
  );

  const prioritySorted = [
    ...highPriority.sort(
      (a, b) => priorityOrder[a.priority!] - priorityOrder[b.priority!]
    ),
  ];
  const optimizedMiddle = [
    ...prioritySorted,
    ...nearestNeighborRoute(
      prioritySorted.length > 0
        ? prioritySorted[prioritySorted.length - 1]
        : depot,
      lowPriority
    ),
  ];

  const optimizedStops: RouteStop[] = [
    depot,
    ...optimizedMiddle.map((s, i) => ({ ...s, order: i + 1 })),
    { ...transferStation, order: optimizedMiddle.length + 1 },
  ];

  const origDist = totalDistance(originalStops);
  const optDist = totalDistance(optimizedStops);
  const improvement = origDist > 0 ? Math.round(((origDist - optDist) / origDist) * 100) : 0;

  return {
    original_stops: originalStops,
    optimized_stops: optimizedStops,
    original_distance: origDist,
    optimized_distance: optDist,
    original_time: Math.round(origDist * 4),   // ~4 min/km in urban traffic
    optimized_time: Math.round(optDist * 4),
    improvement_pct: Math.max(0, improvement),
    vehicle,
    team,
    is_demo: true,
  };
}
