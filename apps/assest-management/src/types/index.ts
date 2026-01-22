import { Timestamp } from 'firebase/firestore';

// Asset Types
export type AssetType =
  | 'air_conditioner'
  | 'pump'
  | 'sensor'
  | 'lighting'
  | 'smoke_detector'
  | 'furniture'
  | 'other';

export const ASSET_TYPE_LABELS: Record<AssetType, string> = {
  air_conditioner: 'Air Conditioner',
  pump: 'Pump',
  sensor: 'Sensor',
  lighting: 'Lighting',
  smoke_detector: 'Smoke Detector',
  furniture: 'Office Furniture',
  other: 'Other',
};

// Asset Status
export type AssetStatus = 'active' | 'in_maintenance' | 'retired' | 'disposed';

export const ASSET_STATUS_LABELS: Record<AssetStatus, string> = {
  active: 'Active',
  in_maintenance: 'In Maintenance',
  retired: 'Retired',
  disposed: 'Disposed',
};

export const ASSET_STATUS_COLORS: Record<AssetStatus, 'success' | 'warning' | 'default' | 'error'> = {
  active: 'success',
  in_maintenance: 'warning',
  retired: 'default',
  disposed: 'error',
};

// Document Reference
export interface DocumentRef {
  id: string;
  name: string;
  url: string;
  type: string;
  uploadedAt: Timestamp;
}

// Asset Interface
export interface Asset {
  id: string;
  name: string;
  type: AssetType;
  status: AssetStatus;
  location: string;
  purchaseDate: Timestamp;
  purchaseCost: number;
  warrantyExpiry: Timestamp | null;
  manufacturer: string;
  model: string;
  serialNumber: string;
  specifications: Record<string, string>;
  depreciationRate: number;
  documents: DocumentRef[];
  images: string[];
  createdAt: Timestamp;
  updatedAt: Timestamp;
}

// Asset Form Data (for React Hook Form)
export interface AssetFormData {
  name: string;
  type: AssetType;
  status: AssetStatus;
  location: string;
  purchaseDate: Date;
  purchaseCost: number;
  warrantyExpiry: Date | null;
  manufacturer: string;
  model: string;
  serialNumber: string;
  specifications: { key: string; value: string }[];
  depreciationRate: number;
}

// Maintenance Types
export type MaintenanceType = 'scheduled' | 'repair' | 'inspection';

export const MAINTENANCE_TYPE_LABELS: Record<MaintenanceType, string> = {
  scheduled: 'Scheduled Maintenance',
  repair: 'Repair',
  inspection: 'Inspection',
};

// Maintenance Status
export type MaintenanceStatus = 'pending' | 'in_progress' | 'completed' | 'overdue';

export const MAINTENANCE_STATUS_LABELS: Record<MaintenanceStatus, string> = {
  pending: 'Pending',
  in_progress: 'In Progress',
  completed: 'Completed',
  overdue: 'Overdue',
};

export const MAINTENANCE_STATUS_COLORS: Record<MaintenanceStatus, 'info' | 'warning' | 'success' | 'error'> = {
  pending: 'info',
  in_progress: 'warning',
  completed: 'success',
  overdue: 'error',
};

// Maintenance Record
export interface MaintenanceRecord {
  id: string;
  assetId: string;
  assetName?: string;
  type: MaintenanceType;
  status: MaintenanceStatus;
  scheduledDate: Timestamp;
  completedDate: Timestamp | null;
  description: string;
  cost: number;
  technician: string;
  notes: string;
  createdAt: Timestamp;
  updatedAt: Timestamp;
}

// Maintenance Form Data
export interface MaintenanceFormData {
  assetId: string;
  type: MaintenanceType;
  status: MaintenanceStatus;
  scheduledDate: Date;
  completedDate: Date | null;
  description: string;
  cost: number;
  technician: string;
  notes: string;
}

// Maintenance Schedule Frequency
export type ScheduleFrequency = 'daily' | 'weekly' | 'monthly' | 'quarterly' | 'yearly';

export const SCHEDULE_FREQUENCY_LABELS: Record<ScheduleFrequency, string> = {
  daily: 'Daily',
  weekly: 'Weekly',
  monthly: 'Monthly',
  quarterly: 'Quarterly',
  yearly: 'Yearly',
};

// Maintenance Schedule
export interface MaintenanceSchedule {
  id: string;
  assetId: string;
  assetName?: string;
  title: string;
  frequency: ScheduleFrequency;
  lastPerformed: Timestamp | null;
  nextDue: Timestamp;
  description: string;
  isActive: boolean;
  createdAt: Timestamp;
  updatedAt: Timestamp;
}

// Schedule Form Data
export interface ScheduleFormData {
  assetId: string;
  title: string;
  frequency: ScheduleFrequency;
  nextDue: Date;
  description: string;
  isActive: boolean;
}

// User
export interface User {
  uid: string;
  email: string;
  displayName: string | null;
  photoURL: string | null;
}

// Dashboard Stats
export interface DashboardStats {
  totalAssets: number;
  activeAssets: number;
  inMaintenanceAssets: number;
  upcomingMaintenance: number;
  overdueMaintenance: number;
}

// Alert Item
export interface AlertItem {
  id: string;
  type: 'maintenance_due' | 'maintenance_overdue' | 'warranty_expiring';
  title: string;
  description: string;
  assetId: string;
  assetName: string;
  dueDate: Date;
  severity: 'low' | 'medium' | 'high';
}
