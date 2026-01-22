import { MEPCategory, Priority, WorkOrderStatus, AssetStatus, BuildingStatus, RequestStatus, TechnicianStatus } from '../types'

export const MEP_CATEGORIES: { value: MEPCategory; label: string; color: string }[] = [
  { value: 'HVAC', label: 'HVAC', color: '#2196f3' },
  { value: 'Electrical', label: 'Electrical', color: '#ff9800' },
  { value: 'Plumbing', label: 'Plumbing', color: '#00bcd4' },
  { value: 'Fire', label: 'Fire Safety', color: '#f44336' },
  { value: 'Elevator', label: 'Elevator', color: '#9c27b0' },
  { value: 'BMS', label: 'BMS', color: '#4caf50' },
  { value: 'Solar', label: 'Solar', color: '#ffeb3b' },
]

export const PRIORITIES: { value: Priority; label: string; color: string }[] = [
  { value: 'Critical', label: 'Critical', color: '#d32f2f' },
  { value: 'High', label: 'High', color: '#ed6c02' },
  { value: 'Medium', label: 'Medium', color: '#1976d2' },
  { value: 'Low', label: 'Low', color: '#757575' },
]

export const WORK_ORDER_STATUSES: { value: WorkOrderStatus; label: string; color: string }[] = [
  { value: 'Draft', label: 'Draft', color: '#9e9e9e' },
  { value: 'Pending Approval', label: 'Pending Approval', color: '#ff9800' },
  { value: 'Approved', label: 'Approved', color: '#2196f3' },
  { value: 'Assigned', label: 'Assigned', color: '#00bcd4' },
  { value: 'In Progress', label: 'In Progress', color: '#1976d2' },
  { value: 'On Hold', label: 'On Hold', color: '#ff5722' },
  { value: 'Completed', label: 'Completed', color: '#4caf50' },
  { value: 'Closed', label: 'Closed', color: '#607d8b' },
  { value: 'Cancelled', label: 'Cancelled', color: '#f44336' },
]

export const ASSET_STATUSES: { value: AssetStatus; label: string; color: string }[] = [
  { value: 'Operational', label: 'Operational', color: '#4caf50' },
  { value: 'Active', label: 'Active', color: '#4caf50' },
  { value: 'In Maintenance', label: 'In Maintenance', color: '#ff9800' },
  { value: 'Standby', label: 'Standby', color: '#2196f3' },
  { value: 'Retired', label: 'Retired', color: '#9e9e9e' },
  { value: 'Disposed', label: 'Disposed', color: '#f44336' },
]

export const BUILDING_STATUSES: { value: BuildingStatus; label: string; color: string }[] = [
  { value: 'Active', label: 'Active', color: '#4caf50' },
  { value: 'Under Renovation', label: 'Under Renovation', color: '#ff9800' },
  { value: 'Inactive', label: 'Inactive', color: '#9e9e9e' },
]

export const REQUEST_STATUSES: { value: RequestStatus; label: string; color: string }[] = [
  { value: 'New', label: 'New', color: '#2196f3' },
  { value: 'Pending Review', label: 'Pending Review', color: '#ff9800' },
  { value: 'Acknowledged', label: 'Acknowledged', color: '#00bcd4' },
  { value: 'Approved', label: 'Approved', color: '#4caf50' },
  { value: 'Rejected', label: 'Rejected', color: '#f44336' },
  { value: 'In Progress', label: 'In Progress', color: '#1976d2' },
  { value: 'Resolved', label: 'Resolved', color: '#4caf50' },
  { value: 'Closed', label: 'Closed', color: '#607d8b' },
  { value: 'Cancelled', label: 'Cancelled', color: '#9e9e9e' },
]

export const TECHNICIAN_STATUSES: { value: TechnicianStatus; label: string; color: string }[] = [
  { value: 'Available', label: 'Available', color: '#4caf50' },
  { value: 'On Job', label: 'On Job', color: '#ff9800' },
  { value: 'Off Duty', label: 'Off Duty', color: '#9e9e9e' },
  { value: 'On Leave', label: 'On Leave', color: '#2196f3' },
]

export const WORK_ORDER_TYPES = [
  { value: 'Corrective', label: 'Corrective (Reactive)' },
  { value: 'Preventive', label: 'Preventive (Scheduled)' },
  { value: 'Predictive', label: 'Predictive (Condition-based)' },
  { value: 'Emergency', label: 'Emergency' },
  { value: 'Inspection', label: 'Inspection' },
  { value: 'Project', label: 'Project' },
]

export const BUILDING_TYPES = [
  { value: 'Hotel', label: 'Hotel' },
  { value: 'Factory', label: 'Factory' },
  { value: 'Office', label: 'Office' },
  { value: 'Commercial', label: 'Commercial' },
  { value: 'Residential', label: 'Residential' },
  { value: 'Industrial', label: 'Industrial' },
]

export const FLOOR_TYPES = [
  { value: 'Basement', label: 'Basement' },
  { value: 'Ground', label: 'Ground' },
  { value: 'Mezzanine', label: 'Mezzanine' },
  { value: 'Standard', label: 'Standard' },
  { value: 'Technical', label: 'Technical/Mechanical' },
  { value: 'Rooftop', label: 'Rooftop' },
  { value: 'Penthouse', label: 'Penthouse' },
]

export const CRITICALITY_LEVELS = [
  { value: 'Critical', label: 'Critical', color: '#d32f2f' },
  { value: 'High', label: 'High', color: '#ed6c02' },
  { value: 'Medium', label: 'Medium', color: '#1976d2' },
  { value: 'Low', label: 'Low', color: '#757575' },
]

export const KANBAN_COLUMNS: WorkOrderStatus[] = [
  'Draft',
  'Approved',
  'Assigned',
  'In Progress',
  'Completed',
]

// Responsive drawer widths
export const DRAWER_WIDTH = 280
export const DRAWER_WIDTH_FULL = 280
export const DRAWER_WIDTH_MINI = 72

// Responsive breakpoints (matching MUI defaults)
export const BREAKPOINTS = {
  xs: 0,      // Mobile small
  sm: 600,    // Mobile large / Tablet portrait
  md: 900,    // Tablet landscape
  lg: 1200,   // Desktop
  xl: 1536,   // Large desktop
}

export const APP_NAME = 'CMMS'
