import { Building } from '../types'

export const mockBuildings: Building[] = [
  {
    id: 'bld-001',
    name: 'Sheraton Saigon Hotel',
    code: 'SHR-SGN',
    clientId: 'client-001',
    address: {
      street: '88 Dong Khoi',
      district: 'District 1',
      city: 'Ho Chi Minh City',
      gpsCoordinates: { lat: 10.7769, lng: 106.7009 },
    },
    buildingType: 'Hotel',
    totalFloors: 23,
    basementFloors: 3,
    totalArea: 45000,
    yearBuilt: 2003,
    status: 'Active',
    primaryContact: {
      name: 'Minh Nguyen',
      phone: '0903 123 456',
      email: 'minh.nguyen@sheratonsaigon.com',
    },
    floorIds: ['flr-001', 'flr-002', 'flr-003', 'flr-004', 'flr-005', 'flr-006', 'flr-007', 'flr-008'],
    totalAssets: 458,
    openWorkOrders: 12,
  },
  {
    id: 'bld-002',
    name: 'TTI Factory Block 3A',
    code: 'TTI-3A',
    clientId: 'client-002',
    address: {
      street: 'Road No. 5, Vietnam-Singapore Industrial Park',
      district: 'Thuan An',
      city: 'Binh Duong',
      gpsCoordinates: { lat: 10.9573, lng: 106.6880 },
    },
    buildingType: 'Factory',
    totalFloors: 3,
    basementFloors: 0,
    totalArea: 28000,
    yearBuilt: 2018,
    status: 'Active',
    primaryContact: {
      name: 'Anh Tran',
      phone: '0912 345 678',
      email: 'anh.tran@ttivietnam.com',
    },
    floorIds: ['flr-009', 'flr-010', 'flr-011'],
    totalAssets: 186,
    openWorkOrders: 8,
  },
  {
    id: 'bld-003',
    name: 'Sao Dau Factory',
    code: 'SD-LT',
    clientId: 'client-003',
    address: {
      street: 'Lot C1-C2, Long Thanh Industrial Park',
      district: 'Long Thanh',
      city: 'Dong Nai',
      gpsCoordinates: { lat: 10.8231, lng: 106.9458 },
    },
    buildingType: 'Factory',
    totalFloors: 2,
    basementFloors: 0,
    totalArea: 15000,
    yearBuilt: 2020,
    status: 'Active',
    primaryContact: {
      name: 'Hong Vo',
      phone: '0987 654 321',
      email: 'hong.vo@saodau.vn',
    },
    floorIds: ['flr-012', 'flr-013'],
    totalAssets: 94,
    openWorkOrders: 3,
  },
  {
    id: 'bld-004',
    name: 'Saigon Centre Tower',
    code: 'SGC-T1',
    clientId: 'client-004',
    address: {
      street: '65 Le Loi',
      district: 'District 1',
      city: 'Ho Chi Minh City',
      gpsCoordinates: { lat: 10.7731, lng: 106.7012 },
    },
    buildingType: 'Office',
    totalFloors: 35,
    basementFloors: 4,
    totalArea: 65000,
    yearBuilt: 2017,
    status: 'Active',
    primaryContact: {
      name: 'Huy Le',
      phone: '0909 111 222',
      email: 'huy.le@saigoncentre.com',
    },
    floorIds: ['flr-014', 'flr-015', 'flr-016', 'flr-017', 'flr-018'],
    totalAssets: 312,
    openWorkOrders: 15,
  },
]

export const getBuildingById = (id: string): Building | undefined => {
  return mockBuildings.find(building => building.id === id)
}

export const getBuildingsByClient = (clientId: string): Building[] => {
  return mockBuildings.filter(building => building.clientId === clientId)
}
