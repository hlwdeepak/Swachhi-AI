export type Role = 'citizen' | 'officer' | 'worker';
export type Language = 'en' | 'hi' | 'gu';
export type Priority = 'low' | 'medium' | 'high' | 'critical';
export type ComplaintStatus =
  | 'submitted'
  | 'ai_processing'
  | 'classified'
  | 'assigned'
  | 'in_progress'
  | 'resolved'
  | 'escalated';

export type WasteCategory =
  | 'wet'
  | 'dry'
  | 'recyclable'
  | 'hazardous'
  | 'mixed'
  | 'unknown';

export interface User {
  id: string;
  name: string;
  email: string;
  phone?: string;
  role: Role;
  language: Language;
  ward?: string;
  created_at: string;
}

export interface Ward {
  id: string;
  name: string;
  city: string;
  population: number;
  complaint_count: number;
  resolved_count: number;
  segregation_rate: number;
  collection_efficiency: number;
  latitude?: number;
  longitude?: number;
}

export interface Worker {
  id: string;
  name: string;
  team: string;
  phone?: string;
  ward?: string;
  current_lat?: number;
  current_lng?: number;
  availability: 'available' | 'on_duty' | 'off_duty';
  created_at: string;
}

export interface Complaint {
  id: string;
  ticket_id: string;
  user_id: string;
  category: string;
  subcategory?: string;
  description: string;
  original_language: Language;
  translated_description?: string;
  latitude?: number;
  longitude?: number;
  address?: string;
  ward?: string;
  priority: Priority;
  priority_reason?: string;
  status: ComplaintStatus;
  assigned_team?: string;
  assigned_worker_id?: string;
  ai_classification?: string;
  ai_routing_explanation?: string;
  image_url?: string;
  created_at: string;
  updated_at: string;
  resolved_at?: string;
}

export interface ComplaintTimeline {
  id: string;
  complaint_id: string;
  status: ComplaintStatus;
  note?: string;
  actor_id?: string;
  actor_role?: string;
  created_at: string;
}

export interface Route {
  id: string;
  worker_id?: string;
  team?: string;
  date: string;
  stops: RouteStop[];
  total_distance?: number;
  estimated_time?: number;
  actual_time?: number;
  status: 'planned' | 'active' | 'completed';
  optimized: boolean;
  improvement_pct?: number;
  created_at: string;
}

export interface RouteStop {
  order: number;
  type: 'depot' | 'collection' | 'complaint' | 'transfer';
  label: string;
  address: string;
  ward?: string;
  lat: number;
  lng: number;
  priority?: Priority;
  complaint_id?: string;
  estimated_arrival?: string;
}

export interface WasteReport {
  id: string;
  complaint_id?: string;
  image_url?: string;
  classification: WasteCategory;
  confidence: number;
  recommendation: string;
  segregation_tips: string;
  created_at: string;
}

export interface Notification {
  id: string;
  user_id: string;
  title: string;
  message: string;
  type: 'info' | 'warning' | 'success' | 'error';
  read: boolean;
  created_at: string;
}

export interface AIClassificationResult {
  language: Language;
  language_name: string;
  category: string;
  subcategory: string;
  priority: Priority;
  priority_reason: string;
  ward?: string;
  description_en: string;
  recommended_action: string;
  confidence: number;
  is_demo: boolean;
}

export interface AIRoutingResult {
  department: string;
  team: string;
  ward: string;
  priority: Priority;
  requires_escalation: boolean;
  explanation: string;
  estimated_response_hours: number;
  is_demo: boolean;
}

export interface RouteOptimizationResult {
  original_stops: RouteStop[];
  optimized_stops: RouteStop[];
  original_distance: number;
  optimized_distance: number;
  original_time: number;
  optimized_time: number;
  improvement_pct: number;
  vehicle: string;
  team: string;
  is_demo: boolean;
}

export interface AnalyticsOverview {
  total_complaints: number;
  pending: number;
  resolved_today: number;
  high_priority: number;
  collection_efficiency: number;
  segregation_rate: number;
  avg_resolution_hours: number;
  ward_stats: WardStat[];
  trend_data: TrendPoint[];
  hotspots: Hotspot[];
}

export interface WardStat {
  ward: string;
  total: number;
  resolved: number;
  pending: number;
  high_priority: number;
  segregation_rate: number;
  resolution_rate: number;
}

export interface TrendPoint {
  date: string;
  complaints: number;
  resolved: number;
}

export interface Hotspot {
  lat: number;
  lng: number;
  ward: string;
  intensity: number;
  category: string;
}

export interface JWTPayload {
  userId: string;
  email: string;
  role: Role;
  name: string;
}
