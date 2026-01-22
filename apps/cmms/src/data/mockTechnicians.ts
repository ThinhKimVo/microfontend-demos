import { Technician } from '../types'

export const mockTechnicians: Technician[] = [
  {
    id: 'tech-001',
    employeeId: 'ION-2019-001',
    name: 'An Nguyen',
    email: 'an.nguyen@ionme.vn',
    phone: '0903 111 001',
    department: 'HVAC Team',
    assignedBuildingIds: ['bld-001', 'bld-004'],
    skills: [
      { category: 'HVAC', skillName: 'Chiller Maintenance', proficiencyLevel: 'Expert' },
      { category: 'HVAC', skillName: 'VRF/VRV Systems', proficiencyLevel: 'Expert' },
      { category: 'HVAC', skillName: 'Air Handling Units', proficiencyLevel: 'Intermediate' },
      { category: 'HVAC', skillName: 'Refrigerant Handling', proficiencyLevel: 'Expert' },
    ],
    certifications: [
      {
        name: 'Chiller Operation Certificate',
        certificateNumber: 'HVAC-CH-2020-001',
        issuingAuthority: 'Department of Industry and Trade',
        issueDate: '2020-03-15',
        expiryDate: '2025-03-14',
      },
      {
        name: 'Refrigerant Handling Certificate',
        certificateNumber: 'REF-2021-456',
        issuingAuthority: 'Vietnam Refrigeration Association',
        issueDate: '2021-06-01',
        expiryDate: '2026-05-31',
      },
    ],
    workSchedule: 'Day Shift: 8:00 - 17:00',
    daysOff: ['Sunday'],
    currentStatus: 'On Job',
    workOrdersCompletedMonth: 12,
    workOrdersCompletedYear: 145,
    averageCompletionTime: 3.2,
    firstTimeFixRate: 92,
    customerSatisfactionRating: 4.8,
  },
  {
    id: 'tech-002',
    employeeId: 'ION-2020-015',
    name: 'Duc Tran',
    email: 'duc.tran@ionme.vn',
    phone: '0903 111 002',
    department: 'HVAC Team',
    assignedBuildingIds: ['bld-001'],
    skills: [
      { category: 'HVAC', skillName: 'Fan Coil Units', proficiencyLevel: 'Expert' },
      { category: 'HVAC', skillName: 'Air Handling Units', proficiencyLevel: 'Expert' },
      { category: 'HVAC', skillName: 'VRF/VRV Systems', proficiencyLevel: 'Intermediate' },
      { category: 'HVAC', skillName: 'Ductwork', proficiencyLevel: 'Intermediate' },
    ],
    certifications: [
      {
        name: 'Occupational Safety Certificate',
        certificateNumber: 'ATLD-2022-789',
        issuingAuthority: 'Department of Labor',
        issueDate: '2022-01-15',
        expiryDate: '2027-01-14',
      },
    ],
    workSchedule: 'Day Shift: 8:00 - 17:00',
    daysOff: ['Sunday'],
    currentStatus: 'Available',
    workOrdersCompletedMonth: 15,
    workOrdersCompletedYear: 168,
    averageCompletionTime: 2.5,
    firstTimeFixRate: 88,
    customerSatisfactionRating: 4.6,
  },
  {
    id: 'tech-003',
    employeeId: 'ION-2018-008',
    name: 'Nam Le',
    email: 'nam.le@ionme.vn',
    phone: '0903 111 003',
    department: 'Electrical Team',
    assignedBuildingIds: ['bld-001', 'bld-004'],
    skills: [
      { category: 'Electrical', skillName: 'Generator Maintenance', proficiencyLevel: 'Expert' },
      { category: 'Electrical', skillName: 'UPS Systems', proficiencyLevel: 'Expert' },
      { category: 'Electrical', skillName: 'High Voltage', proficiencyLevel: 'Intermediate' },
      { category: 'Electrical', skillName: 'Electrical Testing', proficiencyLevel: 'Expert' },
    ],
    certifications: [
      {
        name: 'Electrical Safety Certificate Grade 4',
        certificateNumber: 'ATD-H4-2019-123',
        issuingAuthority: 'Department of Industry and Trade',
        issueDate: '2019-05-20',
        expiryDate: '2024-05-19',
      },
      {
        name: 'Generator Operation Certificate',
        certificateNumber: 'GEN-2020-456',
        issuingAuthority: 'Technical Inspection Center',
        issueDate: '2020-08-01',
        expiryDate: '2025-07-31',
      },
    ],
    workSchedule: 'Day Shift: 8:00 - 17:00',
    daysOff: ['Sunday'],
    currentStatus: 'Available',
    workOrdersCompletedMonth: 10,
    workOrdersCompletedYear: 125,
    averageCompletionTime: 2.8,
    firstTimeFixRate: 95,
    customerSatisfactionRating: 4.9,
  },
  {
    id: 'tech-004',
    employeeId: 'ION-2021-022',
    name: 'Huong Pham',
    email: 'huong.pham@ionme.vn',
    phone: '0903 111 004',
    department: 'Fire Safety Team',
    assignedBuildingIds: ['bld-001', 'bld-002'],
    skills: [
      { category: 'Fire', skillName: 'Fire Alarm Systems', proficiencyLevel: 'Expert' },
      { category: 'Fire', skillName: 'Fire Pump Testing', proficiencyLevel: 'Intermediate' },
      { category: 'Fire', skillName: 'Sprinkler Systems', proficiencyLevel: 'Intermediate' },
    ],
    certifications: [
      {
        name: 'Fire Prevention Certificate',
        certificateNumber: 'PCCC-2021-789',
        issuingAuthority: 'Fire Prevention Police',
        issueDate: '2021-09-15',
        expiryDate: '2026-09-14',
      },
    ],
    workSchedule: 'Day Shift: 8:00 - 17:00',
    daysOff: ['Saturday', 'Sunday'],
    currentStatus: 'On Job',
    workOrdersCompletedMonth: 8,
    workOrdersCompletedYear: 95,
    averageCompletionTime: 1.5,
    firstTimeFixRate: 98,
    customerSatisfactionRating: 4.7,
  },
  {
    id: 'tech-005',
    employeeId: 'ION-2019-012',
    name: 'Hai Vo',
    email: 'hai.vo@ionme.vn',
    phone: '0903 111 005',
    department: 'HVAC Team',
    assignedBuildingIds: ['bld-002', 'bld-003'],
    skills: [
      { category: 'HVAC', skillName: 'Air Handling Units', proficiencyLevel: 'Expert' },
      { category: 'HVAC', skillName: 'Chiller Maintenance', proficiencyLevel: 'Intermediate' },
      { category: 'HVAC', skillName: 'BMS/Controls', proficiencyLevel: 'Intermediate' },
    ],
    certifications: [
      {
        name: 'Occupational Safety Certificate',
        certificateNumber: 'ATLD-2020-321',
        issuingAuthority: 'Department of Labor Binh Duong',
        issueDate: '2020-04-10',
        expiryDate: '2025-04-09',
      },
    ],
    workSchedule: 'Day Shift: 7:30 - 16:30',
    daysOff: ['Sunday'],
    currentStatus: 'On Job',
    workOrdersCompletedMonth: 14,
    workOrdersCompletedYear: 156,
    averageCompletionTime: 2.9,
    firstTimeFixRate: 85,
    customerSatisfactionRating: 4.5,
  },
  {
    id: 'tech-006',
    employeeId: 'ION-2017-005',
    name: 'Tung Nguyen',
    email: 'tung.nguyen@ionme.vn',
    phone: '0903 111 006',
    department: 'HVAC Team',
    assignedBuildingIds: ['bld-004'],
    skills: [
      { category: 'HVAC', skillName: 'Chiller Maintenance', proficiencyLevel: 'Expert' },
      { category: 'HVAC', skillName: 'Cooling Towers', proficiencyLevel: 'Expert' },
      { category: 'HVAC', skillName: 'Air Handling Units', proficiencyLevel: 'Expert' },
      { category: 'HVAC', skillName: 'BMS/Controls', proficiencyLevel: 'Expert' },
    ],
    certifications: [
      {
        name: 'Chiller Operation Certificate',
        certificateNumber: 'HVAC-CH-2018-055',
        issuingAuthority: 'Department of Industry and Trade',
        issueDate: '2018-06-20',
        expiryDate: '2023-06-19',
      },
      {
        name: 'Refrigerant Handling Certificate',
        certificateNumber: 'REF-2019-123',
        issuingAuthority: 'Vietnam Refrigeration Association',
        issueDate: '2019-03-01',
        expiryDate: '2024-02-28',
      },
    ],
    workSchedule: 'Day Shift: 8:00 - 17:00',
    daysOff: ['Sunday'],
    currentStatus: 'Available',
    workOrdersCompletedMonth: 11,
    workOrdersCompletedYear: 132,
    averageCompletionTime: 4.1,
    firstTimeFixRate: 90,
    customerSatisfactionRating: 4.8,
  },
  {
    id: 'tech-007',
    employeeId: 'ION-2020-028',
    name: 'Binh Do',
    email: 'binh.do@ionme.vn',
    phone: '0903 111 007',
    department: 'BMS Team',
    assignedBuildingIds: ['bld-001', 'bld-004'],
    skills: [
      { category: 'BMS', skillName: 'BMS Controllers', proficiencyLevel: 'Expert' },
      { category: 'BMS', skillName: 'PLC Programming', proficiencyLevel: 'Intermediate' },
      { category: 'Electrical', skillName: 'Low Voltage', proficiencyLevel: 'Intermediate' },
    ],
    certifications: [
      {
        name: 'Honeywell EBI Certification',
        certificateNumber: 'HON-EBI-2021-VN-045',
        issuingAuthority: 'Honeywell Vietnam',
        issueDate: '2021-08-15',
        expiryDate: '2024-08-14',
      },
    ],
    workSchedule: 'Day Shift: 8:00 - 17:00',
    daysOff: ['Sunday'],
    currentStatus: 'On Job',
    workOrdersCompletedMonth: 9,
    workOrdersCompletedYear: 108,
    averageCompletionTime: 2.2,
    firstTimeFixRate: 94,
    customerSatisfactionRating: 4.7,
  },
]

export const getTechnicianById = (id: string): Technician | undefined => {
  return mockTechnicians.find(tech => tech.id === id)
}

export const getTechniciansByBuilding = (buildingId: string): Technician[] => {
  return mockTechnicians.filter(tech => tech.assignedBuildingIds.includes(buildingId))
}

export const getAvailableTechnicians = (): Technician[] => {
  return mockTechnicians.filter(tech => tech.currentStatus === 'Available')
}

export const getTechniciansBySkill = (skillCategory: string): Technician[] => {
  return mockTechnicians.filter(tech =>
    tech.skills.some(skill => skill.category === skillCategory)
  )
}

export const getTechniciansWithExpiringCerts = (daysThreshold: number = 90): Technician[] => {
  const today = new Date()
  const thresholdDate = new Date(today.getTime() + daysThreshold * 24 * 60 * 60 * 1000)

  return mockTechnicians.filter(tech =>
    tech.certifications.some(cert => {
      const expiryDate = new Date(cert.expiryDate)
      return expiryDate <= thresholdDate
    })
  )
}
