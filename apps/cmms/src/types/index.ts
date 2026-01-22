// Client
export interface Client {
  id: string
  name: string
  contactPerson: string
  contactEmail: string
  contactPhone: string
  address: string
  contractStartDate: string
  contractEndDate: string
  sla: string
  buildingIds: string[]
}

// Building / Facility
export interface Building {
  id: string
  name: string
  code: string
  clientId: string
  address: {
    street: string
    district: string
    city: string
    gpsCoordinates?: { lat: number; lng: number }
  }
  buildingType: BuildingType
  totalFloors: number
  basementFloors: number
  totalArea: number
  yearBuilt: number
  status: BuildingStatus
  primaryContact: {
    name: string
    phone: string
    email: string
  }
  floorIds: string[]
  totalAssets?: number
  openWorkOrders?: number
}

export type BuildingType = 'Hotel' | 'Factory' | 'Office' | 'Commercial' | 'Residential' | 'Industrial'
export type BuildingStatus = 'Active' | 'Under Renovation' | 'Inactive'

// Floor
export interface Floor {
  id: string
  name: string
  buildingId: string
  floorNumber: number
  floorName: string
  floorType: FloorType
  floorArea: number
  floorPlanImageUrl?: string
  description: string
  status: FloorStatus
  zoneIds: string[]
  assetCount?: number
  openWorkOrders?: number
}

export type FloorType = 'Basement' | 'Ground' | 'Mezzanine' | 'Standard' | 'Technical' | 'Rooftop' | 'Penthouse'
export type FloorStatus = 'Active' | 'Under Renovation' | 'Restricted'

// Zone / Area
export interface Zone {
  id: string
  floorId: string
  zoneName: string
  zoneType: string
  area: number
  roomIds: string[]
}

// Room / Space
export interface Room {
  id: string
  zoneId: string
  roomNumber: string
  roomName: string
  roomType: string
  area: number
  assetIds: string[]
}

// Asset
export interface Asset {
  id: string
  assetTag: string
  name: string
  description: string
  mepCategory: MEPCategory
  assetType: string
  criticality: CriticalityLevel
  status: AssetStatus
  // Location
  clientId: string
  buildingId: string
  floorId: string
  zoneId?: string
  roomId?: string
  locationDescription: string
  // Technical specs
  manufacturer: string
  modelNumber: string
  serialNumber: string
  capacity?: string
  powerRating?: string
  voltage?: string
  refrigerantType?: string
  customSpecs?: Record<string, string>
  // Financial
  purchaseDate: string
  purchaseCost: number
  vendorId?: string
  warrantyStartDate: string
  warrantyEndDate: string
  replacementCost?: number
  // Operational
  installationDate: string
  commissionDate: string
  expectedLifespan: number
  operatingHours?: number
  lastMeterReadingDate?: string
  parentAssetId?: string
  childAssetIds?: string[]
  // Attachments
  images?: string[]
  manuals?: string[]
  certificates?: string[]
}

export type MEPCategory = 'HVAC' | 'Electrical' | 'Plumbing' | 'Fire' | 'Elevator' | 'BMS' | 'Solar'
export type CriticalityLevel = 'Critical' | 'High' | 'Medium' | 'Low'
export type AssetStatus = 'Operational' | 'Active' | 'In Maintenance' | 'Standby' | 'Retired' | 'Disposed'

// Work Order
export interface WorkOrder {
  id: string
  workOrderNumber: string
  title: string
  description: string
  workOrderType: WorkOrderType
  mepCategory: MEPCategory
  priority: Priority
  status: WorkOrderStatus
  createdDate: string
  // Location
  clientId: string
  buildingId: string
  floorId: string
  zoneId?: string
  roomId?: string
  locationNotes?: string
  // Asset
  assetId?: string
  assetName?: string
  assetTag?: string
  failureCode?: string
  // Assignment
  assignedTo?: string
  assignedBy?: string
  assignedDate?: string
  requiredSkills?: string[]
  estimatedDuration?: number
  // Scheduling
  targetStartDate: string
  targetCompletionDate: string
  actualStartDate?: string
  actualCompletionDate?: string
  downtime?: number
  // Resources
  labor?: {
    technicianId: string
    hoursWorked: number
    laborCost: number
  }[]
  partsUsed?: {
    partId: string
    partName: string
    quantity: number
    partCost: number
  }[]
  externalServices?: {
    vendor: string
    serviceCost: number
  }[]
  // Completion
  resolutionNotes?: string
  rootCause?: string
  actionsTaken?: string
  recommendations?: string
  followUpRequired?: boolean
  // Attachments
  photosBefore?: string[]
  photosAfter?: string[]
  technicianSignature?: string
  clientSignature?: string
}

export type WorkOrderType = 'Corrective' | 'Preventive' | 'Predictive' | 'Emergency' | 'Inspection' | 'Project'
export type Priority = 'Critical' | 'High' | 'Medium' | 'Low'
export type WorkOrderStatus = 'Draft' | 'Pending Approval' | 'Approved' | 'Assigned' | 'In Progress' | 'On Hold' | 'Completed' | 'Closed' | 'Cancelled'

// Preventive Maintenance Schedule
export interface PMSchedule {
  id: string
  name: string
  description: string
  mepCategory: MEPCategory
  isActive: boolean
  createdDate: string
  // Scope
  scopeType: 'Single Asset' | 'Multiple Assets' | 'Floor' | 'Building'
  assetIds?: string[]
  buildingId?: string
  floorIds?: string[]
  // Frequency
  frequencyType: 'Time-based' | 'Meter-based' | 'Condition-based'
  interval: number
  intervalUnit: 'days' | 'weeks' | 'months' | 'years' | 'hours' | 'cycles'
  startDate: string
  endDate?: string
  nextDueDate: string
  lastCompletedDate?: string
  // Task details
  estimatedDuration: number
  priorityLevel: Priority
  assignedTeam?: string
  requiredSkills?: string[]
  checklist: PMChecklistItem[]
  // Resources
  requiredParts?: { partId: string; quantity: number }[]
  requiredTools?: string[]
  // WO Generation
  leadTimeDays: number
  autoAssign: boolean
  // Compliance
  complianceRate?: number
  totalScheduled?: number
  totalCompleted?: number
}

export interface PMChecklistItem {
  stepNumber: number
  description: string
  isRequired: boolean
  expectedOutcome?: string
  requiresPhoto: boolean
}

// Inventory Item
export interface InventoryItem {
  id: string
  name: string
  description: string
  partNumber: string
  mepCategory: MEPCategory
  unitOfMeasure: string
  barcode?: string
  // Stock
  currentQuantity: number
  reservedQuantity: number
  minimumLevel: number
  maximumLevel: number
  reorderQuantity: number
  location: {
    warehouse: string
    building?: string
    bin?: string
    row?: string
  }
  // Financial
  unitCost: number
  lastPurchasePrice: number
  averageCost: number
  totalValue: number
  // Supplier
  primaryVendorId?: string
  vendorPartNumber?: string
  leadTimeDays: number
  alternativeVendorIds?: string[]
  // Compatibility
  compatibleAssetTypes?: string[]
  compatibleAssetIds?: string[]
  // Tracking
  lotNumber?: string
  expiryDate?: string
  lastRestockedDate?: string
}

export interface InventoryTransaction {
  id: string
  itemId: string
  transactionType: 'Receipt' | 'Issue' | 'Return' | 'Adjust' | 'Transfer'
  quantity: number
  previousQuantity: number
  newQuantity: number
  workOrderId?: string
  reason?: string
  performedBy: string
  performedDate: string
}

// Technician
export interface Technician {
  id: string
  employeeId: string
  name: string
  email: string
  phone: string
  department: string
  assignedBuildingIds: string[]
  // Skills
  skills: TechnicianSkill[]
  certifications: TechnicianCertification[]
  // Availability
  workSchedule: string
  daysOff: string[]
  currentStatus: TechnicianStatus
  // Performance
  workOrdersCompletedMonth: number
  workOrdersCompletedYear: number
  averageCompletionTime: number
  firstTimeFixRate: number
  customerSatisfactionRating: number
}

export interface TechnicianSkill {
  category: MEPCategory
  skillName: string
  proficiencyLevel: 'Beginner' | 'Intermediate' | 'Expert'
}

export interface TechnicianCertification {
  name: string
  certificateNumber: string
  issuingAuthority: string
  issueDate: string
  expiryDate: string
}

export type TechnicianStatus = 'Available' | 'On Job' | 'Off Duty' | 'On Leave'

// Vendor
export interface Vendor {
  id: string
  name: string
  contactPerson: string
  email: string
  phone: string
  address: string
  mepSpecialties: MEPCategory[]
  // Contract
  contractNumber?: string
  contractStartDate?: string
  contractEndDate?: string
  serviceLevel?: string
  // Performance
  deliveryRating?: number
  qualityRating?: number
  // Linked items
  linkedPartIds?: string[]
  linkedAssetIds?: string[]
}

// Service Request
export interface ServiceRequest {
  id: string
  requestNumber: string
  title: string
  requesterName: string
  requesterEmail: string
  requesterPhone: string
  requestDate: string
  submittedDate: string
  submittedBy: string
  submitterRole?: string
  submitterEmail?: string
  submitterPhone?: string
  // Location
  clientId: string
  buildingId: string
  floorId: string
  zoneId?: string
  roomId?: string
  roomNumber?: string
  locationDescription: string
  // Details
  category: 'Repair' | 'Service' | 'Inquiry' | 'Emergency'
  mepCategory: MEPCategory
  description: string
  priority: Priority
  status: RequestStatus
  // Processing
  assignedTo?: string
  workOrderId?: string
  convertedToWO: boolean
  convertedToWorkOrderId?: string
  // Review
  reviewedDate?: string
  reviewedBy?: string
  // Resolution
  resolutionNotes?: string
  resolvedDate?: string
  // Attachments
  photos?: string[]
  attachments?: string[]
}

export type RequestStatus = 'New' | 'Pending Review' | 'Acknowledged' | 'Approved' | 'Rejected' | 'In Progress' | 'Resolved' | 'Closed' | 'Cancelled'

// Dashboard Stats
export interface DashboardStats {
  openWorkOrders: number
  overdueWorkOrders: number
  pmComplianceRate: number
  totalAssets: number
  assetsNeedingAttention: number
  lowStockItems: number
  technicianUtilization: number
  mttr: number
}

// Report types
export interface Report {
  id: string
  name: string
  description: string
  category: 'Facility' | 'Asset' | 'WorkOrder' | 'Maintenance' | 'Inventory' | 'Resource'
  lastGenerated?: string
}
