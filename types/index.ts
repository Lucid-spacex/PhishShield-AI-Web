// User types
export interface User {
  user_id: string;
  username: string;
  email: string;
  role: 'user' | 'admin';
  is_active: boolean;
  created_at: string;
}

export interface AuthResponse {
  access_token: string;
  message: string;
  user: User;
}

export interface LoginRequest {
  username: string;
  password: string;
}

export interface RegisterRequest {
  username: string;
  email: string;
  password: string;
}

// Scan types
export interface ScanRequest {
  url: string;
}

export interface ScanResult {
  scan_id: string;
  label: 'safe' | 'phishing' | 'suspicious';
  confidence_score: number;
  risk_indicators: string[];
  scan_time: string;
  url: string;
}

export interface ScanHistoryResponse {
  scans: ScanResult[];
  total: number;
  page: number;
  per_page: number;
  total_pages: number;
}

export interface ScanHistoryParams {
  page?: number;
  per_page?: number;
}

// Analytics types
export interface AnalyticsSummary {
  total_scans: number;
  phishing_detected: number;
  safe_urls: number;
  suspicious_urls: number;
  avg_confidence: number;
}

export interface AnalyticsTrend {
  date: string;
  safe: number;
  phishing: number;
  suspicious: number;
}

export interface AnalyticsTrendsResponse {
  trends: AnalyticsTrend[];
  period: string;
  days: number;
}

export interface AnalyticsTrendsParams {
  period?: 'daily' | 'weekly' | 'monthly';
  days?: number;
}

export interface RiskDistribution {
  label: string;
  count: number;
  percentage: number;
}

export interface RiskDistributionResponse {
  distribution: RiskDistribution[];
}

// Admin types
export interface AdminActivity {
  action: string;
  user_id: string;
  username: string;
  timestamp: string;
  details: string;
}

export interface AdminActivityResponse {
  activities: AdminActivity[];
  total: number;
}

export interface AdminScansResponse {
  scans: ScanResult[];
  total: number;
  page: number;
  per_page: number;
  total_pages: number;
}

export interface AdminUser {
  user_id: string;
  username: string;
  email: string;
  role: 'user' | 'admin';
  is_active: boolean;
  created_at: string;
  scan_count: number;
}

export interface AdminUsersResponse {
  users: AdminUser[];
  total: number;
  page: number;
  per_page: number;
  total_pages: number;
}

export interface UpdateUserRequest {
  is_active?: boolean;
  role?: 'user' | 'admin';
}

// API error types
export interface ApiError {
  message: string;
  status?: number;
  code?: string;
}