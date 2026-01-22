# CMMS - Computerized Maintenance Management System
## For I-ON M&E Facilities Management

**Version:** 1.0
**Date:** January 2026
**Author:** I-ON M&E Development Team
**Status:** Draft

---

## Table of Contents

1. [Executive Summary](#1-executive-summary)
2. [Business Context](#2-business-context)
3. [System Overview](#3-system-overview)
4. [Functional Requirements](#4-functional-requirements)
5. [Non-Functional Requirements](#5-non-functional-requirements)
6. [User Roles & Permissions](#6-user-roles--permissions)
7. [Data Requirements](#7-data-requirements)
8. [Integration Requirements](#8-integration-requirements)
9. [Reporting & Analytics](#9-reporting--analytics)
10. [Compliance Requirements](#10-compliance-requirements)
11. [Appendix](#11-appendix)

---

## 1. Executive Summary

### 1.1 Purpose
This document defines the business and functional requirements for a Computerized Maintenance Management System (CMMS) designed specifically for I-ON M&E's SMART Facilities Maintenance services. The system will manage MEP (Mechanical, Electrical, Plumbing) assets across multi-floor buildings including hotels, factories, and commercial facilities.

### 1.2 Scope
The CMMS will serve as a unified platform for managing:
- Multi-building and multi-floor facility structures
- MEP asset inventory and lifecycle tracking (HVAC, Electrical, Plumbing, Fire Safety, Solar)
- Work order creation, assignment, and completion
- Preventive and predictive maintenance scheduling
- Spare parts and inventory management
- Technician resource and labor allocation
- Compliance documentation and audit trails
- Performance analytics and reporting

### 1.3 Business Objectives
| ID | Objective | Success Metric |
|----|-----------|----------------|
| BO-01 | Reduce unplanned equipment downtime | 30% reduction within 12 months |
| BO-02 | Extend MEP asset lifespan | 15% improvement in asset longevity |
| BO-03 | Optimize maintenance costs | 20% reduction in reactive maintenance |
| BO-04 | Improve regulatory compliance | 100% audit trail coverage |
| BO-05 | Increase technician productivity | 25% improvement in work order completion rate |
| BO-06 | Enable floor-level facility tracking | 100% asset location accuracy by floor |

---

## 2. Business Context

### 2.1 About I-ON M&E
I-ON M&E JSC is a leading MEP (Mechanical, Electrical, Plumbing) solutions provider in Vietnam with over 11 years of experience. The company provides:
- **MEP Retrofitting** - System design, equipment supply, and installation
- **Renewable Energy** - Solar power system installation
- **SMART Facilities Maintenance** - Using CMMS software for system upkeep

### 2.2 Problem Statement
Facilities management faces significant challenges:
- **Reactive Maintenance Culture:** 60% of maintenance activities are unplanned, resulting in costly emergency repairs
- **Complex Building Structures:** Multi-floor buildings require precise asset location tracking
- **MEP System Complexity:** HVAC, electrical, plumbing, and fire systems require specialized maintenance
- **Multi-Client Management:** Managing maintenance across multiple client facilities
- **Poor Visibility:** Lack of real-time insight into asset health and maintenance status per floor
- **Compliance Risks:** Difficulty demonstrating regulatory compliance for building systems

### 2.3 Target Facilities
| Facility Type | Examples | Key MEP Systems |
|---------------|----------|-----------------|
| Hospitality | Sheraton Saigon 5-star hotel | HVAC, Electrical, Plumbing, Fire Safety, Elevators |
| Manufacturing | TTI Block 3A Factory, Sao Dau Factory | Industrial HVAC, Electrical Distribution, Compressed Air |
| Commercial Buildings | Office towers, Shopping malls | Central HVAC, BMS Integration, Fire Systems |
| Industrial Facilities | Warehouses, Data centers | Cooling Systems, Power Distribution, UPS |

### 2.4 Stakeholders
| Stakeholder | Role | Interest |
|-------------|------|----------|
| Facility Manager | Primary User | Oversight of all building maintenance operations |
| MEP Technician | End User | Execute work orders, log activities |
| Building Owner/Client | Decision Maker | Minimize downtime, optimize costs |
| I-ON M&E Operations Manager | Reviewer | Multi-facility oversight, resource allocation |
| Compliance Officer | Auditor | Regulatory adherence, audit documentation |
| IT Administrator | Technical | System configuration, integrations |

---

## 3. System Overview

### 3.1 Core Modules

```
┌─────────────────────────────────────────────────────────────────┐
│                    I-ON M&E CMMS PLATFORM                       │
├─────────────────────────────────────────────────────────────────┤
│  ┌──────────────┐  ┌──────────────┐  ┌──────────────┐          │
│  │   FACILITY   │  │    ASSET     │  │  WORK ORDER  │          │
│  │  MANAGEMENT  │  │  MANAGEMENT  │  │  MANAGEMENT  │          │
│  │ (Buildings/  │  │  (MEP Focus) │  │              │          │
│  │   Floors)    │  │              │  │              │          │
│  └──────────────┘  └──────────────┘  └──────────────┘          │
│                                                                  │
│  ┌──────────────┐  ┌──────────────┐  ┌──────────────┐          │
│  │  PREVENTIVE  │  │  INVENTORY   │  │   RESOURCE   │          │
│  │ MAINTENANCE  │  │  MANAGEMENT  │  │  MANAGEMENT  │          │
│  └──────────────┘  └──────────────┘  └──────────────┘          │
│                                                                  │
│  ┌──────────────┐  ┌──────────────┐  ┌──────────────┐          │
│  │   MOBILE     │  │  REPORTING   │  │   VENDOR     │          │
│  │    ACCESS    │  │ & ANALYTICS  │  │  MANAGEMENT  │          │
│  └──────────────┘  └──────────────┘  └──────────────┘          │
└─────────────────────────────────────────────────────────────────┘
```

### 3.2 Facility Hierarchy Structure

```
Organization (I-ON M&E)
└── Client
    └── Facility / Building
        └── Floor / Level
            └── Zone / Area
                └── Room / Space
                    └── Asset (MEP Equipment)
                        └── Component
```

### 3.3 Module Interactions
| Source Module | Target Module | Interaction |
|---------------|---------------|-------------|
| Facility Management | Asset Management | Assets belong to specific floors/zones |
| Asset Management | Work Order | Asset failures trigger work orders |
| Preventive Maintenance | Work Order | PM schedules generate work orders automatically |
| Work Order | Inventory | Parts consumption updates inventory levels |
| Work Order | Resource | Technician assignment and scheduling |
| Inventory | Vendor | Low stock triggers purchase requisitions |
| All Modules | Reporting | Data aggregation for analytics |

---

## 4. Functional Requirements

### 4.1 Facility Management Module

#### 4.1.1 Building & Floor Registry
| ID | Requirement | Priority | MoSCoW |
|----|-------------|----------|--------|
| FAC-001 | System shall maintain a hierarchical structure of Clients > Buildings > Floors > Zones > Rooms | Critical | Must |
| FAC-002 | System shall support multiple buildings per client | Critical | Must |
| FAC-003 | System shall support unlimited floors per building (including basement levels B1, B2, etc.) | Critical | Must |
| FAC-004 | System shall allow floor numbering customization (Ground, Mezzanine, Penthouse, etc.) | High | Must |
| FAC-005 | System shall support floor plan image upload per floor | Medium | Should |
| FAC-006 | System shall display asset counts per floor | High | Must |
| FAC-007 | System shall show active work orders per floor | High | Must |
| FAC-008 | System shall support zone/area definitions within floors | High | Must |
| FAC-009 | System shall track total floor area (sqm) | Medium | Should |
| FAC-010 | System shall support building status (Active, Under Renovation, Inactive) | High | Must |

#### 4.1.2 Facility Data Model
```
Client
├── Client ID (auto-generated)
├── Client Name
├── Contact Person
├── Contact Email
├── Contact Phone
├── Address
├── Contract Information
│   ├── Contract Start Date
│   ├── Contract End Date
│   └── Service Level Agreement (SLA)
└── Buildings []

Building / Facility
├── Building ID (auto-generated)
├── Building Name
├── Building Code
├── Client ID (foreign key)
├── Address
│   ├── Street Address
│   ├── District
│   ├── City
│   └── GPS Coordinates
├── Building Type (Hotel, Factory, Office, Commercial, Residential)
├── Total Floors (above ground)
├── Basement Floors (below ground)
├── Total Area (sqm)
├── Year Built
├── Building Status (Active, Under Renovation, Inactive)
├── Primary Contact
│   ├── Name
│   ├── Phone
│   └── Email
└── Floors []

Floor
├── Floor ID (auto-generated)
├── Building ID (foreign key)
├── Floor Number (integer, supports negative for basements)
├── Floor Name (e.g., "Ground Floor", "Mezzanine", "Penthouse", "B1")
├── Floor Type
│   ├── Basement
│   ├── Ground
│   ├── Mezzanine
│   ├── Standard
│   ├── Technical/Mechanical
│   ├── Rooftop
│   └── Penthouse
├── Floor Area (sqm)
├── Floor Plan Image URL
├── Description
├── Status (Active, Under Renovation, Restricted)
└── Zones []

Zone / Area
├── Zone ID (auto-generated)
├── Floor ID (foreign key)
├── Zone Name (e.g., "East Wing", "Kitchen Area", "Server Room")
├── Zone Type (Common Area, Technical Room, Office, Guest Room, etc.)
├── Area (sqm)
└── Rooms []

Room / Space
├── Room ID (auto-generated)
├── Zone ID (foreign key)
├── Room Number
├── Room Name
├── Room Type (Guest Room, Meeting Room, Electrical Room, AHU Room, etc.)
├── Area (sqm)
└── Assets []
```

#### 4.1.3 Floor-Level Dashboard
| ID | Requirement | Priority | MoSCoW |
|----|-------------|----------|--------|
| FAC-011 | System shall provide building overview showing all floors | High | Must |
| FAC-012 | System shall display floor-by-floor asset summary | High | Must |
| FAC-013 | System shall show open work orders per floor with visual indicators | High | Must |
| FAC-014 | System shall highlight floors with critical/overdue maintenance | High | Must |
| FAC-015 | System shall support drill-down from building > floor > zone > room > asset | High | Must |
| FAC-016 | System shall provide interactive floor plan view (future) | Low | Could |

---

### 4.2 Asset Management Module

#### 4.2.1 MEP Asset Registry
| ID | Requirement | Priority | MoSCoW |
|----|-------------|----------|--------|
| AM-001 | System shall maintain a centralized database of all MEP assets | Critical | Must |
| AM-002 | System shall support hierarchical asset structure linked to facility hierarchy | Critical | Must |
| AM-003 | System shall categorize assets by MEP system type | Critical | Must |
| AM-004 | System shall store comprehensive asset details (specifications, purchase info, warranty) | High | Must |
| AM-005 | System shall support QR code/barcode generation and scanning for asset identification | Medium | Should |
| AM-006 | System shall track asset status (Active, In Maintenance, Standby, Retired, Disposed) | High | Must |
| AM-007 | System shall maintain complete asset maintenance history | Critical | Must |
| AM-008 | System shall link each asset to specific Building > Floor > Zone > Room | Critical | Must |

#### 4.2.2 MEP System Categories
```
MEP Asset Categories
├── HVAC (Heating, Ventilation, Air Conditioning)
│   ├── Chillers
│   ├── Cooling Towers
│   ├── Air Handling Units (AHU)
│   ├── Fan Coil Units (FCU)
│   ├── Variable Refrigerant Flow (VRF) Units
│   ├── Split AC Units
│   ├── Exhaust Fans
│   ├── Fresh Air Units
│   ├── Ductwork
│   └── HVAC Controls
│
├── Electrical Systems
│   ├── Transformers
│   ├── Main Distribution Boards (MDB)
│   ├── Sub Distribution Boards (SDB)
│   ├── Electrical Panels
│   ├── Generators
│   ├── UPS Systems
│   ├── Automatic Transfer Switches (ATS)
│   ├── Lighting Systems
│   ├── Cable Trays & Conduits
│   └── Grounding Systems
│
├── Plumbing Systems
│   ├── Water Pumps
│   ├── Water Tanks
│   ├── Water Heaters / Boilers
│   ├── Sewage Pumps
│   ├── Grease Traps
│   ├── Water Treatment Systems
│   ├── Piping Networks
│   └── Fixtures (Sinks, Toilets, etc.)
│
├── Fire Protection Systems
│   ├── Fire Pumps
│   ├── Sprinkler Systems
│   ├── Fire Alarm Panels
│   ├── Smoke Detectors
│   ├── Fire Extinguishers
│   ├── Fire Hydrants
│   ├── FM200 / Gas Suppression
│   └── Emergency Lighting
│
├── Vertical Transportation
│   ├── Elevators / Lifts
│   ├── Escalators
│   └── Dumbwaiters
│
├── Building Management Systems (BMS)
│   ├── BMS Controllers
│   ├── Sensors (Temperature, Humidity, CO2)
│   ├── Actuators
│   └── Control Panels
│
└── Renewable Energy (Solar)
    ├── Solar Panels
    ├── Inverters
    ├── Mounting Structures
    ├── DC Combiner Boxes
    └── Monitoring Systems
```

#### 4.2.3 Asset Data Model
```
Asset
├── General Information
│   ├── Asset ID (auto-generated, unique)
│   ├── Asset Tag / QR Code
│   ├── Asset Name
│   ├── Description
│   ├── MEP Category (HVAC, Electrical, Plumbing, Fire, etc.)
│   ├── Asset Type (specific equipment type)
│   ├── Criticality Level (Critical, High, Medium, Low)
│   └── Status (Active, In Maintenance, Standby, Retired, Disposed)
│
├── Location Information
│   ├── Client ID
│   ├── Building ID
│   ├── Floor ID
│   ├── Zone ID
│   ├── Room ID
│   ├── Specific Location Description
│   └── GPS Coordinates (optional)
│
├── Technical Specifications
│   ├── Manufacturer
│   ├── Model Number
│   ├── Serial Number
│   ├── Capacity / Rating
│   ├── Power Rating (kW/HP)
│   ├── Voltage
│   ├── Refrigerant Type (for HVAC)
│   └── Custom Specifications (key-value pairs)
│
├── Financial Information
│   ├── Purchase Date
│   ├── Purchase Cost
│   ├── Vendor / Supplier
│   ├── Warranty Start Date
│   ├── Warranty End Date
│   ├── Depreciation Method
│   ├── Depreciation Rate
│   ├── Current Book Value
│   └── Replacement Cost
│
├── Operational Information
│   ├── Installation Date
│   ├── Commission Date
│   ├── Expected Lifespan (years)
│   ├── Operating Hours (meter reading)
│   ├── Last Meter Reading Date
│   ├── Parent Asset ID (for hierarchy)
│   └── Child Assets []
│
└── Attachments
    ├── Images
    ├── Manuals
    ├── Schematics
    ├── Certificates
    ├── Warranty Documents
    └── Compliance Certificates
```

#### 4.2.4 Asset Lifecycle Management
| ID | Requirement | Priority | MoSCoW |
|----|-------------|----------|--------|
| AM-009 | System shall track asset through lifecycle stages (Acquisition > Installation > Operation > Maintenance > Disposal) | High | Must |
| AM-010 | System shall calculate and display asset depreciation | Medium | Should |
| AM-011 | System shall alert users when warranty is expiring (30/60/90 days) | Medium | Should |
| AM-012 | System shall track total cost of ownership (TCO) per asset | Medium | Should |
| AM-013 | System shall support asset transfer between floors/buildings | High | Must |
| AM-014 | System shall maintain disposal records with reason and method | Medium | Should |
| AM-015 | System shall track asset relocation history | High | Must |

---

### 4.3 Work Order Management Module

#### 4.3.1 Work Order Creation
| ID | Requirement | Priority | MoSCoW |
|----|-------------|----------|--------|
| WO-001 | System shall allow manual creation of work orders | Critical | Must |
| WO-002 | System shall auto-generate work orders from PM schedules | Critical | Must |
| WO-003 | System shall auto-generate work orders from BMS alarms (future integration) | Medium | Could |
| WO-004 | System shall allow work order requests from facility staff/clients | High | Should |
| WO-005 | System shall capture requester information and request timestamp | High | Must |
| WO-006 | System shall support work order templates for common MEP tasks | Medium | Should |
| WO-007 | System shall require floor/location selection when creating work orders | Critical | Must |

#### 4.3.2 Work Order Data Model
```
Work Order
├── Header Information
│   ├── Work Order Number (auto-generated)
│   ├── Title / Summary
│   ├── Description
│   ├── Work Order Type
│   │   ├── Corrective (Reactive/Breakdown)
│   │   ├── Preventive (Scheduled)
│   │   ├── Predictive (Condition-based)
│   │   ├── Emergency
│   │   ├── Inspection
│   │   └── Project
│   ├── MEP Category (HVAC, Electrical, Plumbing, Fire, etc.)
│   ├── Priority (Critical, High, Medium, Low)
│   ├── Status
│   │   ├── Draft
│   │   ├── Pending Approval
│   │   ├── Approved
│   │   ├── Assigned
│   │   ├── In Progress
│   │   ├── On Hold
│   │   ├── Completed
│   │   ├── Closed
│   │   └── Cancelled
│   └── Created Date/Time
│
├── Location Information
│   ├── Client ID
│   ├── Building ID
│   ├── Floor ID
│   ├── Zone ID
│   ├── Room ID
│   └── Specific Location Notes
│
├── Asset Information
│   ├── Asset ID
│   ├── Asset Name
│   ├── Asset Tag
│   └── Failure Code (if breakdown)
│
├── Assignment
│   ├── Assigned To (Technician/Team)
│   ├── Assigned By
│   ├── Assigned Date/Time
│   ├── Required Skills
│   └── Estimated Duration
│
├── Scheduling
│   ├── Target Start Date
│   ├── Target Completion Date
│   ├── Actual Start Date
│   ├── Actual Completion Date
│   └── Downtime (hours)
│
├── Resources
│   ├── Labor
│   │   ├── Technician ID
│   │   ├── Hours Worked
│   │   └── Labor Cost
│   ├── Parts Used
│   │   ├── Part ID
│   │   ├── Quantity
│   │   └── Part Cost
│   └── External Services
│       ├── Vendor
│       └── Service Cost
│
├── Completion Details
│   ├── Resolution Notes
│   ├── Root Cause
│   ├── Actions Taken
│   ├── Recommendations
│   └── Follow-up Required (yes/no)
│
└── Attachments
    ├── Photos (before/after)
    ├── Documents
    └── Signatures (Technician & Client)
```

#### 4.3.3 Work Order Workflow
| ID | Requirement | Priority | MoSCoW |
|----|-------------|----------|--------|
| WO-008 | System shall enforce configurable approval workflow | High | Should |
| WO-009 | System shall allow work order assignment to individual or team | High | Must |
| WO-010 | System shall notify assigned technician via push notification | High | Must |
| WO-011 | System shall allow technician to update status in real-time | Critical | Must |
| WO-012 | System shall track time spent on each work order | High | Must |
| WO-013 | System shall require completion notes and resolution details | High | Must |
| WO-014 | System shall support digital signature for work completion | Medium | Should |
| WO-015 | System shall notify client/facility manager on work order completion | High | Should |

#### 4.3.4 Work Order Dashboard
| ID | Requirement | Priority | MoSCoW |
|----|-------------|----------|--------|
| WO-016 | System shall display work order overview dashboard | Critical | Must |
| WO-017 | System shall show work orders by status (Kanban view) | High | Should |
| WO-018 | System shall filter work orders by building, floor, asset, technician, priority, date | Critical | Must |
| WO-019 | System shall highlight overdue work orders | High | Must |
| WO-020 | System shall display work order calendar view | Medium | Should |
| WO-021 | System shall show work orders grouped by floor/building | High | Must |

---

### 4.4 Preventive Maintenance Module

#### 4.4.1 PM Scheduling
| ID | Requirement | Priority | MoSCoW |
|----|-------------|----------|--------|
| PM-001 | System shall support time-based PM scheduling (daily, weekly, monthly, quarterly, yearly) | Critical | Must |
| PM-002 | System shall support meter-based PM scheduling (runtime hours, cycles) | High | Must |
| PM-003 | System shall support condition-based PM triggers (BMS integration - future) | Medium | Could |
| PM-004 | System shall support calendar-based scheduling with specific dates | High | Must |
| PM-005 | System shall allow recurring PM templates with checklists | High | Must |
| PM-006 | System shall auto-generate work orders X days before PM due date | High | Must |
| PM-007 | System shall reschedule next PM based on completion date or fixed schedule | Medium | Should |
| PM-008 | System shall support PM schedules by floor/building for batch maintenance | High | Must |

#### 4.4.2 MEP-Specific PM Templates
```
Common PM Templates by MEP Category:

HVAC Preventive Maintenance
├── Chiller PM (Monthly/Quarterly)
│   ├── Check refrigerant levels
│   ├── Inspect compressor operation
│   ├── Clean condenser tubes
│   ├── Check oil levels
│   └── Verify control settings
│
├── AHU PM (Monthly)
│   ├── Replace/clean air filters
│   ├── Check belt tension
│   ├── Lubricate bearings
│   ├── Clean coils
│   └── Check damper operation
│
└── FCU PM (Quarterly)
    ├── Clean filters
    ├── Check drain pan
    ├── Test thermostat
    └── Inspect fan motor

Electrical PM
├── Generator PM (Monthly)
│   ├── Check fuel level
│   ├── Test start sequence
│   ├── Check battery condition
│   ├── Inspect coolant level
│   └── Load test (quarterly)
│
├── Electrical Panel PM (Annual)
│   ├── Thermal imaging scan
│   ├── Tighten connections
│   ├── Clean panels
│   └── Test breakers
│
└── UPS PM (Quarterly)
    ├── Battery inspection
    ├── Load test
    ├── Check connections
    └── Firmware updates

Fire System PM
├── Fire Pump PM (Weekly/Monthly)
│   ├── Weekly churn test
│   ├── Flow test (annual)
│   └── Valve inspections
│
├── Fire Alarm PM (Monthly)
│   ├── Test detectors
│   ├── Test pull stations
│   └── Panel inspection
│
└── Sprinkler PM (Quarterly)
    ├── Visual inspection
    ├── Valve testing
    └── Flow switch test
```

#### 4.4.3 PM Data Model
```
Preventive Maintenance Schedule
├── Schedule Information
│   ├── PM ID (auto-generated)
│   ├── PM Name
│   ├── Description
│   ├── MEP Category
│   ├── Is Active (yes/no)
│   └── Created Date
│
├── Scope
│   ├── Scope Type (Single Asset, Multiple Assets, Floor, Building)
│   ├── Asset IDs [] (if applicable)
│   ├── Building ID (if building-wide)
│   ├── Floor IDs [] (if floor-specific)
│   └── Asset Filter (by type/category)
│
├── Frequency Settings
│   ├── Frequency Type
│   │   ├── Time-based
│   │   │   ├── Interval (number)
│   │   │   └── Unit (days/weeks/months/years)
│   │   ├── Meter-based
│   │   │   ├── Meter Type (hours/cycles)
│   │   │   └── Interval Value
│   │   └── Condition-based
│   │       ├── Trigger Type
│   │       └── Threshold Value
│   ├── Start Date
│   ├── End Date (optional)
│   └── Next Due Date
│
├── Task Details
│   ├── Estimated Duration
│   ├── Priority Level
│   ├── Assigned Team (default)
│   ├── Required Skills
│   └── Checklist
│       ├── Step Number
│       ├── Step Description
│       ├── Is Required (yes/no)
│       ├── Expected Outcome
│       └── Requires Photo (yes/no)
│
├── Resource Requirements
│   ├── Required Parts
│   │   ├── Part ID
│   │   └── Quantity
│   ├── Required Tools
│   └── Required Certifications
│
└── Work Order Generation
    ├── Lead Time (days before due)
    ├── Auto-assign (yes/no)
    └── Work Order Template ID
```

#### 4.4.4 PM Compliance
| ID | Requirement | Priority | MoSCoW |
|----|-------------|----------|--------|
| PM-009 | System shall track PM compliance rate (completed vs scheduled) | High | Must |
| PM-010 | System shall alert when PM is overdue | High | Must |
| PM-011 | System shall maintain PM history per asset | High | Must |
| PM-012 | System shall report on PM schedule adherence by building/floor | High | Must |
| PM-013 | System shall track PM compliance for regulatory requirements | High | Must |

---

### 4.5 Inventory Management Module

#### 4.5.1 Parts Inventory
| ID | Requirement | Priority | MoSCoW |
|----|-------------|----------|--------|
| INV-001 | System shall maintain centralized inventory of MEP spare parts and materials | Critical | Must |
| INV-002 | System shall track inventory across multiple storeroom locations | High | Should |
| INV-003 | System shall record real-time stock levels | Critical | Must |
| INV-004 | System shall support minimum/maximum stock level thresholds | High | Must |
| INV-005 | System shall alert when inventory falls below minimum level | High | Must |
| INV-006 | System shall track part usage history | High | Must |
| INV-007 | System shall support barcode/QR scanning for inventory transactions | Medium | Should |
| INV-008 | System shall link parts to applicable MEP assets | High | Must |
| INV-009 | System shall support inventory by building/site location | High | Should |

#### 4.5.2 MEP Parts Categories
```
MEP Parts Categories
├── HVAC Parts
│   ├── Filters (various sizes)
│   ├── Belts
│   ├── Bearings
│   ├── Refrigerant
│   ├── Compressor Oil
│   ├── Thermostats
│   ├── Capacitors
│   ├── Contactors
│   └── Fan Motors
│
├── Electrical Parts
│   ├── Circuit Breakers
│   ├── Fuses
│   ├── Contactors
│   ├── Relays
│   ├── Cables/Wires
│   ├── Light Bulbs/Tubes
│   ├── Ballasts
│   └── Batteries (UPS)
│
├── Plumbing Parts
│   ├── Pipe Fittings
│   ├── Valves
│   ├── Gaskets
│   ├── Pump Seals
│   ├── Impellers
│   ├── Float Switches
│   └── Water Filters
│
├── Fire System Parts
│   ├── Sprinkler Heads
│   ├── Smoke Detectors
│   ├── Fire Extinguisher Refills
│   ├── Emergency Lights
│   └── Batteries
│
└── General Consumables
    ├── Lubricants
    ├── Cleaning Supplies
    ├── Safety Equipment
    └── Tools
```

#### 4.5.3 Inventory Data Model
```
Inventory Item
├── Item Information
│   ├── Item ID (auto-generated)
│   ├── Item Name
│   ├── Description
│   ├── Part Number (manufacturer)
│   ├── MEP Category
│   ├── Unit of Measure (each, box, kg, liter)
│   └── Barcode / QR Code
│
├── Stock Information
│   ├── Current Quantity
│   ├── Reserved Quantity
│   ├── Available Quantity
│   ├── Minimum Level (reorder point)
│   ├── Maximum Level
│   ├── Reorder Quantity
│   └── Location
│       ├── Warehouse/Storeroom
│       ├── Building (if on-site)
│       ├── Bin/Shelf
│       └── Row/Column
│
├── Financial Information
│   ├── Unit Cost
│   ├── Last Purchase Price
│   ├── Average Cost
│   └── Total Value
│
├── Supplier Information
│   ├── Primary Vendor ID
│   ├── Vendor Part Number
│   ├── Lead Time (days)
│   └── Alternative Vendors
│
├── Asset Compatibility
│   ├── Compatible Asset Types []
│   └── Compatible Asset IDs []
│
└── Tracking
    ├── Lot Number (optional)
    ├── Expiry Date (optional)
    └── Last Restocked Date
```

#### 4.5.4 Inventory Transactions
| ID | Requirement | Priority | MoSCoW |
|----|-------------|----------|--------|
| INV-010 | System shall record all inventory movements (receipt, issue, return, adjust, transfer) | Critical | Must |
| INV-011 | System shall automatically deduct parts when used in work orders | High | Must |
| INV-012 | System shall support manual inventory adjustments with reason | High | Must |
| INV-013 | System shall track inventory transfers between locations/buildings | Medium | Should |
| INV-014 | System shall support stock returns to inventory | Medium | Should |
| INV-015 | System shall maintain transaction audit trail | High | Must |

---

### 4.6 Resource Management Module

#### 4.6.1 Technician Management
| ID | Requirement | Priority | MoSCoW |
|----|-------------|----------|--------|
| RES-001 | System shall maintain technician profiles with MEP skills and certifications | High | Must |
| RES-002 | System shall track certification expiry dates (electrical license, refrigerant handling, etc.) | High | Must |
| RES-003 | System shall alert when certifications are expiring | Medium | Should |
| RES-004 | System shall record technician availability and schedules | High | Should |
| RES-005 | System shall track technician workload (current assigned work orders) | High | Must |
| RES-006 | System shall assign technicians to specific buildings/clients | High | Must |
| RES-007 | System shall calculate technician utilization rate | Medium | Should |

#### 4.6.2 MEP Skills & Certifications
```
MEP Skills Categories
├── HVAC Skills
│   ├── Chiller Maintenance
│   ├── VRF/VRV Systems
│   ├── Air Handling Units
│   ├── Refrigerant Handling
│   ├── BMS/Controls
│   └── Ductwork
│
├── Electrical Skills
│   ├── High Voltage (HV)
│   ├── Low Voltage (LV)
│   ├── Generator Maintenance
│   ├── UPS Systems
│   ├── PLC Programming
│   └── Electrical Testing
│
├── Plumbing Skills
│   ├── Pump Maintenance
│   ├── Pipe Fitting
│   ├── Water Treatment
│   └── Drainage Systems
│
├── Fire System Skills
│   ├── Fire Alarm Systems
│   ├── Sprinkler Systems
│   ├── Fire Pump Testing
│   └── Fire Extinguisher Servicing
│
└── Certifications
    ├── Electrical License (Grade A/B/C)
    ├── Refrigerant Handling Certificate
    ├── Fire Safety Certificate
    ├── Working at Heights
    ├── Confined Space
    └── First Aid
```

#### 4.6.3 Technician Data Model
```
Technician
├── Personal Information
│   ├── Employee ID
│   ├── Name
│   ├── Contact Information
│   │   ├── Email
│   │   └── Phone
│   ├── Department
│   └── Assigned Buildings []
│
├── Skills & Certifications
│   ├── MEP Skills
│   │   ├── Skill Category
│   │   ├── Skill Name
│   │   └── Proficiency Level (Beginner, Intermediate, Expert)
│   └── Certifications
│       ├── Certification Name
│       ├── Certificate Number
│       ├── Issuing Authority
│       ├── Issue Date
│       └── Expiry Date
│
├── Availability
│   ├── Work Schedule
│   │   ├── Shift Pattern
│   │   └── Days Off
│   ├── Time Off / Leave
│   └── Current Status (Available, On Job, Off Duty, On Leave)
│
└── Performance Metrics
    ├── Work Orders Completed (this month/year)
    ├── Average Completion Time
    ├── First-Time Fix Rate
    └── Customer Satisfaction Rating
```

---

### 4.7 Mobile Access Module

#### 4.7.1 Mobile Capabilities
| ID | Requirement | Priority | MoSCoW |
|----|-------------|----------|--------|
| MOB-001 | System shall provide mobile application for iOS and Android | Critical | Must |
| MOB-002 | System shall support offline mode with data synchronization | High | Should |
| MOB-003 | Technicians shall view and update assigned work orders on mobile | Critical | Must |
| MOB-004 | Technicians shall scan asset QR codes to pull up asset details | High | Should |
| MOB-005 | Technicians shall capture photos and attach to work orders | Critical | Must |
| MOB-006 | Technicians shall record time spent on tasks via mobile | High | Must |
| MOB-007 | Technicians shall access asset manuals and documentation | Medium | Should |
| MOB-008 | System shall push notifications for new/updated work orders | Critical | Must |
| MOB-009 | Technicians shall complete PM checklists on mobile | High | Must |
| MOB-010 | Technicians shall check parts availability from mobile | Medium | Should |
| MOB-011 | Technicians shall capture digital signatures on mobile | Medium | Should |
| MOB-012 | System shall show building floor navigation | High | Should |

---

### 4.8 Vendor Management Module

#### 4.8.1 Vendor Registry
| ID | Requirement | Priority | MoSCoW |
|----|-------------|----------|--------|
| VEN-001 | System shall maintain vendor/supplier database | Medium | Should |
| VEN-002 | System shall store vendor contact information and contracts | Medium | Should |
| VEN-003 | System shall track vendor performance (delivery, quality) | Low | Could |
| VEN-004 | System shall link vendors to inventory items and assets | Medium | Should |
| VEN-005 | System shall track service contracts and agreements | Medium | Should |
| VEN-006 | System shall alert when service contracts are expiring | Low | Could |
| VEN-007 | System shall categorize vendors by MEP specialty | Medium | Should |

---

### 4.9 Request Management Module

#### 4.9.1 Service Requests
| ID | Requirement | Priority | MoSCoW |
|----|-------------|----------|--------|
| REQ-001 | System shall allow facility staff/clients to submit service requests | High | Should |
| REQ-002 | System shall provide simple request submission form (web/mobile) | High | Should |
| REQ-003 | System shall require floor/location selection in request form | High | Must |
| REQ-004 | System shall allow request categorization (repair, service, inquiry) | Medium | Should |
| REQ-005 | System shall enable photo upload with requests | Medium | Should |
| REQ-006 | System shall notify I-ON M&E team of new requests | High | Should |
| REQ-007 | System shall allow request conversion to work order | High | Should |
| REQ-008 | Requesters shall track status of their requests | Medium | Should |
| REQ-009 | System shall send notifications on request status changes | Medium | Should |

---

## 5. Non-Functional Requirements

### 5.1 Performance Requirements
| ID | Requirement | Target |
|----|-------------|--------|
| NFR-001 | Page load time | < 3 seconds |
| NFR-002 | Search response time | < 2 seconds |
| NFR-003 | Report generation time | < 10 seconds |
| NFR-004 | API response time | < 500ms |
| NFR-005 | Concurrent users supported | 200+ |
| NFR-006 | System uptime | 99.5% |
| NFR-007 | Mobile app response time | < 2 seconds |

### 5.2 Scalability Requirements
| ID | Requirement |
|----|-------------|
| NFR-008 | System shall support up to 50,000 assets |
| NFR-009 | System shall handle 20,000 work orders per year |
| NFR-010 | System shall support 100+ buildings |
| NFR-011 | System shall support up to 500 floors per building |
| NFR-012 | System shall scale horizontally for increased load |

### 5.3 Security Requirements
| ID | Requirement | Priority |
|----|-------------|----------|
| NFR-013 | System shall enforce role-based access control (RBAC) | Critical |
| NFR-014 | System shall encrypt data at rest and in transit (AES-256, TLS 1.3) | Critical |
| NFR-015 | System shall require strong password policies | High |
| NFR-016 | System shall support multi-factor authentication (MFA) | High |
| NFR-017 | System shall log all user activities for audit | Critical |
| NFR-018 | System shall implement session timeout (configurable) | High |
| NFR-019 | System shall prevent SQL injection and XSS attacks | Critical |
| NFR-020 | System shall isolate client data (multi-tenant security) | Critical |

### 5.4 Availability & Reliability
| ID | Requirement |
|----|-------------|
| NFR-021 | System shall support automated daily backups |
| NFR-022 | System shall have disaster recovery plan with RTO < 4 hours |
| NFR-023 | System shall have data recovery point objective (RPO) < 1 hour |
| NFR-024 | System shall support zero-downtime deployments |

### 5.5 Usability Requirements
| ID | Requirement |
|----|-------------|
| NFR-025 | System shall provide intuitive, user-friendly interface |
| NFR-026 | System shall be accessible on modern browsers (Chrome, Firefox, Safari, Edge) |
| NFR-027 | System shall be responsive (desktop, tablet, mobile) |
| NFR-028 | System shall support Vietnamese and English languages |
| NFR-029 | System shall provide in-app help and tooltips |

### 5.6 Deployment Requirements
| ID | Requirement |
|----|-------------|
| NFR-030 | System shall be cloud-native (SaaS deployment) |
| NFR-031 | System shall support containerized deployment (Docker/Kubernetes) |
| NFR-032 | System shall support CI/CD pipeline integration |
| NFR-033 | System shall provide API documentation (OpenAPI/Swagger) |

---

## 6. User Roles & Permissions

### 6.1 Role Definitions

| Role | Description | Access Level |
|------|-------------|--------------|
| **System Administrator** | Full system access, configuration, user management | Full |
| **I-ON Operations Manager** | Oversee all facilities, approvals, reporting | High |
| **Facility Manager** | Manage specific building(s), work orders, reports | Medium-High |
| **Maintenance Supervisor** | Manage team, assign work, monitor performance | Medium-High |
| **MEP Technician** | Execute work orders, update status, record activities | Medium |
| **Inventory Manager** | Manage parts inventory, procurement | Medium |
| **Client User** | Submit service requests, view own building status | Low |
| **Viewer/Auditor** | Read-only access for reporting and audits | Read-Only |

### 6.2 Permission Matrix

| Module/Feature | Admin | Ops Mgr | Facility Mgr | Supervisor | Technician | Inventory Mgr | Client | Viewer |
|----------------|:-----:|:-------:|:------------:|:----------:|:----------:|:-------------:|:------:|:------:|
| **Facilities** |
| View All Buildings | ✓ | ✓ | - | - | - | - | - | ✓ |
| View Assigned Buildings | ✓ | ✓ | ✓ | ✓ | ✓ | - | ✓ | - |
| Create/Edit Buildings | ✓ | ✓ | - | - | - | - | - | - |
| Manage Floors | ✓ | ✓ | ✓ | - | - | - | - | - |
| **Assets** |
| View Assets | ✓ | ✓ | ✓ | ✓ | ✓ | ✓ | - | ✓ |
| Create/Edit Assets | ✓ | ✓ | ✓ | ✓ | - | - | - | - |
| Delete Assets | ✓ | ✓ | - | - | - | - | - | - |
| Transfer Assets | ✓ | ✓ | ✓ | - | - | - | - | - |
| **Work Orders** |
| View All Work Orders | ✓ | ✓ | - | - | - | - | - | ✓ |
| View Building Work Orders | ✓ | ✓ | ✓ | ✓ | - | - | ✓ | - |
| View Assigned Work Orders | ✓ | ✓ | ✓ | ✓ | ✓ | - | - | - |
| Create Work Orders | ✓ | ✓ | ✓ | ✓ | - | - | - | - |
| Assign Work Orders | ✓ | ✓ | ✓ | ✓ | - | - | - | - |
| Update Work Order Status | ✓ | ✓ | ✓ | ✓ | ✓ | - | - | - |
| Close Work Orders | ✓ | ✓ | ✓ | ✓ | - | - | - | - |
| **Preventive Maintenance** |
| View PM Schedules | ✓ | ✓ | ✓ | ✓ | ✓ | - | - | ✓ |
| Create/Edit PM Schedules | ✓ | ✓ | ✓ | ✓ | - | - | - | - |
| **Inventory** |
| View Inventory | ✓ | ✓ | ✓ | ✓ | ✓ | ✓ | - | ✓ |
| Manage Inventory | ✓ | ✓ | - | - | - | ✓ | - | - |
| Issue/Return Parts | ✓ | ✓ | ✓ | ✓ | ✓ | ✓ | - | - |
| **Service Requests** |
| Submit Requests | ✓ | ✓ | ✓ | ✓ | ✓ | ✓ | ✓ | - |
| View Own Requests | ✓ | ✓ | ✓ | ✓ | ✓ | ✓ | ✓ | - |
| Manage All Requests | ✓ | ✓ | ✓ | ✓ | - | - | - | - |
| **Reports** |
| View Reports | ✓ | ✓ | ✓ | ✓ | - | ✓ | - | ✓ |
| Export Reports | ✓ | ✓ | ✓ | - | - | - | - | ✓ |
| **Administration** |
| User Management | ✓ | - | - | - | - | - | - | - |
| System Configuration | ✓ | - | - | - | - | - | - | - |
| Audit Logs | ✓ | ✓ | - | - | - | - | - | ✓ |

---

## 7. Data Requirements

### 7.1 Data Retention
| Data Type | Retention Period |
|-----------|------------------|
| Active Buildings/Floors | Indefinite |
| Active Assets | Indefinite |
| Disposed Assets | 7 years |
| Work Order History | 7 years |
| Maintenance Records | 10 years |
| Audit Logs | 5 years |
| User Activity Logs | 3 years |
| Inventory Transactions | 5 years |

### 7.2 Data Migration
| ID | Requirement |
|----|-------------|
| DM-001 | System shall support bulk import of buildings/floors via CSV/Excel |
| DM-002 | System shall support bulk import of assets via CSV/Excel |
| DM-003 | System shall support import of work order history |
| DM-004 | System shall validate imported data and report errors |
| DM-005 | System shall provide data import templates |

### 7.3 Data Backup
| ID | Requirement |
|----|-------------|
| DB-001 | System shall perform automated daily backups |
| DB-002 | System shall retain backups for 30 days |
| DB-003 | System shall support on-demand backup |
| DB-004 | System shall enable data export for archival |

---

## 8. Integration Requirements

### 8.1 Standard Integrations
| ID | System | Purpose | Priority |
|----|--------|---------|----------|
| INT-001 | Building Management System (BMS) | Alarm integration, sensor data | Medium |
| INT-002 | Accounting Software | Cost tracking, invoicing | Medium |
| INT-003 | Email Systems (SMTP) | Notifications | High |
| INT-004 | SMS Gateway | Mobile notifications | Medium |
| INT-005 | Single Sign-On (SSO) | OAuth 2.0, OIDC | Medium |
| INT-006 | IoT Platforms | Sensor data, condition monitoring | Low |
| INT-007 | Document Storage (S3, GCS) | File attachments | High |

### 8.2 API Requirements
| ID | Requirement |
|----|-------------|
| API-001 | System shall provide RESTful API for all core functions |
| API-002 | API shall support JSON request/response format |
| API-003 | API shall implement OAuth 2.0 / JWT authentication |
| API-004 | API shall support rate limiting |
| API-005 | API shall provide versioning |
| API-006 | API shall include comprehensive documentation (Swagger/OpenAPI) |
| API-007 | System shall support webhooks for event notifications |

---

## 9. Reporting & Analytics

### 9.1 Standard Reports

#### 9.1.1 Facility Reports
| Report | Description |
|--------|-------------|
| Building Overview | Summary of all buildings with asset counts, open WOs |
| Floor-by-Floor Status | Asset and WO status per floor |
| Building Comparison | Performance metrics across buildings |
| Floor Utilization | Maintenance activity by floor |

#### 9.1.2 Asset Reports
| Report | Description |
|--------|-------------|
| Asset Registry | Complete list of all assets with location details |
| Asset by Building/Floor | Assets grouped by location hierarchy |
| Asset by MEP Category | Assets grouped by HVAC, Electrical, Plumbing, etc. |
| Asset by Status | Assets grouped by operational status |
| Warranty Expiration | Assets with expiring warranties |
| Asset History | Maintenance history per asset |
| Asset Downtime | Downtime analysis per asset |

#### 9.1.3 Work Order Reports
| Report | Description |
|--------|-------------|
| Work Order Summary | Overview by status |
| Work Order by Building/Floor | Work orders grouped by location |
| Work Order Backlog | Open/pending work orders aging |
| Work Order by Technician | Work orders per technician |
| Completion Time Analysis | Average time to complete by type |
| Overdue Work Orders | Past-due work orders |
| Emergency vs Planned | Breakdown of emergency vs scheduled work |

#### 9.1.4 Maintenance Reports
| Report | Description |
|--------|-------------|
| PM Compliance | Scheduled vs completed PM percentage |
| PM Compliance by Building | PM adherence per building |
| Maintenance Cost | Cost breakdown by building/floor/asset |
| MTBF | Mean Time Between Failures per asset |
| MTTR | Mean Time To Repair per asset |
| Reactive vs Preventive | Maintenance type distribution |

### 9.2 Dashboard & KPIs

#### 9.2.1 Executive Dashboard
| KPI | Description | Target |
|-----|-------------|--------|
| PM Compliance Rate | Completed / Scheduled PM | > 95% |
| Mean Time To Repair (MTTR) | Average time to fix failures | Decreasing trend |
| Work Order Backlog | Number of open work orders | < 2 weeks |
| Emergency Work Order % | Emergency / Total work orders | < 10% |
| Maintenance Cost per Building | Total cost / Number of buildings | Tracked |
| First-Time Fix Rate | Issues resolved on first visit | > 80% |

#### 9.2.2 Operational Dashboard
| Widget | Description |
|--------|-------------|
| Work Orders by Status | Real-time status distribution |
| Work Orders by Building/Floor | Location-based view |
| Today's Schedule | Work orders scheduled for today |
| Overdue Work Orders | Count and list |
| Upcoming PM | PM due in next 7/30 days |
| Low Stock Alerts | Inventory items needing reorder |
| Technician Availability | Current availability status |
| Building Alerts | Critical issues by building |

---

## 10. Compliance Requirements

### 10.1 Regulatory Compliance
| Regulation | Applicability | Requirements |
|------------|---------------|--------------|
| **Vietnam Fire Safety Regulations** | All buildings | Fire system inspection records, testing documentation |
| **Vietnam Electrical Safety Standards** | All facilities | Electrical inspection records, certification tracking |
| **Building Code Compliance** | All buildings | Equipment maintenance records |
| **ISO 55000** | Asset Management | Asset lifecycle management documentation |
| **ISO 9001** | Quality Management | Documented procedures, records management |

### 10.2 Audit Trail Requirements
| ID | Requirement |
|----|-------------|
| AUD-001 | System shall log all data creation, modification, and deletion |
| AUD-002 | Audit log shall include timestamp, user ID, action, before/after values |
| AUD-003 | Audit logs shall be tamper-proof (read-only) |
| AUD-004 | System shall provide audit log search and filtering |
| AUD-005 | System shall support audit log export for compliance review |
| AUD-006 | System shall support electronic signatures with date/time stamp |

---

## 11. Appendix

### 11.1 Glossary

| Term | Definition |
|------|------------|
| **AHU** | Air Handling Unit - HVAC equipment that conditions and circulates air |
| **Asset** | Physical MEP equipment requiring maintenance |
| **BMS** | Building Management System - centralized control of building systems |
| **CMMS** | Computerized Maintenance Management System |
| **FCU** | Fan Coil Unit - smaller HVAC unit for individual zone control |
| **MEP** | Mechanical, Electrical, and Plumbing systems |
| **MTBF** | Mean Time Between Failures |
| **MTTR** | Mean Time To Repair |
| **PM** | Preventive Maintenance |
| **VRF/VRV** | Variable Refrigerant Flow/Volume - HVAC system type |
| **Work Order** | Document authorizing and tracking maintenance work |

### 11.2 Abbreviations

| Abbreviation | Full Form |
|--------------|-----------|
| API | Application Programming Interface |
| BMS | Building Management System |
| HVAC | Heating, Ventilation, and Air Conditioning |
| MEP | Mechanical, Electrical, Plumbing |
| MDB | Main Distribution Board |
| SDB | Sub Distribution Board |
| UPS | Uninterruptible Power Supply |
| ATS | Automatic Transfer Switch |
| PM | Preventive Maintenance |
| WO | Work Order |
| QR | Quick Response (code) |
| RBAC | Role-Based Access Control |
| SaaS | Software as a Service |
| TCO | Total Cost of Ownership |

### 11.3 I-ON M&E Reference Projects

| Project | Type | Key Systems |
|---------|------|-------------|
| Sheraton Saigon Hotel | 5-star Hospitality | Full MEP, BMS |
| TTI Block 3A Factory | Manufacturing | Industrial HVAC, Electrical |
| Sao Dau Factory | Manufacturing | Process cooling, Power distribution |

### 11.4 Document History

| Version | Date | Author | Changes |
|---------|------|--------|---------|
| 1.0 | January 2026 | I-ON M&E Dev Team | Initial document - Tailored for I-ON M&E facilities management |

---

**Document Status:** Draft - Pending Review

**Next Steps:**
1. Stakeholder review and feedback
2. Requirements prioritization workshop
3. Technical feasibility assessment
4. UI/UX design phase
5. Development sprint planning
