import { Client } from '../types'

export const mockClients: Client[] = [
  {
    id: 'client-001',
    name: 'Sheraton Saigon Hotel',
    contactPerson: 'Mai Nguyen',
    contactEmail: 'mai.nguyen@sheratonsaigon.com',
    contactPhone: '028 3827 2828',
    address: '88 Dong Khoi, District 1, Ho Chi Minh City',
    contractStartDate: '2024-01-01',
    contractEndDate: '2026-12-31',
    sla: 'Premium - 4h response time',
    buildingIds: ['bld-001'],
  },
  {
    id: 'client-002',
    name: 'TTI Vietnam Manufacturing',
    contactPerson: 'Hung Tran',
    contactEmail: 'hung.tran@ttivietnam.com',
    contactPhone: '0274 3825 825',
    address: 'Vietnam-Singapore Industrial Park, Binh Duong',
    contractStartDate: '2023-06-01',
    contractEndDate: '2026-05-31',
    sla: 'Standard - 8h response time',
    buildingIds: ['bld-002'],
  },
  {
    id: 'client-003',
    name: 'Sao Dau Industrial',
    contactPerson: 'Nam Le',
    contactEmail: 'nam.le@saodau.vn',
    contactPhone: '0254 3850 850',
    address: 'Sao Dau Industrial Park, Long Thanh, Dong Nai',
    contractStartDate: '2024-03-01',
    contractEndDate: '2027-02-28',
    sla: 'Standard - 8h response time',
    buildingIds: ['bld-003'],
  },
  {
    id: 'client-004',
    name: 'Saigon Centre Office Tower',
    contactPerson: 'Lan Pham',
    contactEmail: 'lan.pham@saigoncentre.com',
    contactPhone: '028 3821 9999',
    address: '65 Le Loi, District 1, Ho Chi Minh City',
    contractStartDate: '2025-01-01',
    contractEndDate: '2027-12-31',
    sla: 'Premium - 4h response time',
    buildingIds: ['bld-004'],
  },
]

export const getClientById = (id: string): Client | undefined => {
  return mockClients.find(client => client.id === id)
}
