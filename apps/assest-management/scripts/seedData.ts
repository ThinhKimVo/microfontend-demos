import { initializeApp } from 'firebase/app';
import { getFirestore, collection, addDoc, Timestamp } from 'firebase/firestore';

const firebaseConfig = {
  apiKey: 'AIzaSyDbqMu_bPHyvFJ8Ck8hhRJcnZouVeufaVc',
  authDomain: 'saigon-technology-solutions.firebaseapp.com',
  projectId: 'saigon-technology-solutions',
  storageBucket: 'saigon-technology-solutions.firebasestorage.app',
  messagingSenderId: '33155109053',
  appId: '1:33155109053:web:087ebc65fe55cff116a7d4',
};

const app = initializeApp(firebaseConfig);
const db = getFirestore(app);

function createTimestamp(daysFromNow: number): Timestamp {
  const date = new Date();
  date.setDate(date.getDate() + daysFromNow);
  return Timestamp.fromDate(date);
}

const assetIds: string[] = [];

const mockAssets = [
  { name: 'Central AC Unit - Building A', type: 'air_conditioner', status: 'active', location: 'Building A - Floor 1', purchaseDate: createTimestamp(-365), purchaseCost: 15000, warrantyExpiry: createTimestamp(365), manufacturer: 'Daikin', model: 'VRV IV', serialNumber: 'DK-2024-001', specifications: { capacity: '10 tons', voltage: '380V' }, depreciationRate: 10, documents: [], images: [], createdAt: Timestamp.now(), updatedAt: Timestamp.now() },
  { name: 'Split AC - Conference Room', type: 'air_conditioner', status: 'active', location: 'Building A - Floor 2', purchaseDate: createTimestamp(-180), purchaseCost: 2500, warrantyExpiry: createTimestamp(545), manufacturer: 'LG', model: 'Dual Inverter', serialNumber: 'LG-2024-015', specifications: { capacity: '2 tons', voltage: '220V' }, depreciationRate: 15, documents: [], images: [], createdAt: Timestamp.now(), updatedAt: Timestamp.now() },
  { name: 'Water Pump Station 1', type: 'pump', status: 'active', location: 'Basement - Pump Room', purchaseDate: createTimestamp(-730), purchaseCost: 8500, warrantyExpiry: null, manufacturer: 'Grundfos', model: 'CR 32-2', serialNumber: 'GF-2022-088', specifications: { flowRate: '32 m3/h', power: '5.5kW' }, depreciationRate: 8, documents: [], images: [], createdAt: Timestamp.now(), updatedAt: Timestamp.now() },
  { name: 'Fire Pump', type: 'pump', status: 'in_maintenance', location: 'Basement - Fire Safety Room', purchaseDate: createTimestamp(-500), purchaseCost: 12000, warrantyExpiry: createTimestamp(230), manufacturer: 'Wilo', model: 'FPN 40-250', serialNumber: 'WL-2023-042', specifications: { flowRate: '40 m3/h', pressure: '10 bar' }, depreciationRate: 7, documents: [], images: [], createdAt: Timestamp.now(), updatedAt: Timestamp.now() },
  { name: 'Temperature Sensor - Server Room', type: 'sensor', status: 'active', location: 'Building B - Server Room', purchaseDate: createTimestamp(-90), purchaseCost: 1200, warrantyExpiry: createTimestamp(640), manufacturer: 'Honeywell', model: 'T6 Pro', serialNumber: 'HW-2024-201', specifications: { range: '-10 to 50°C', accuracy: '±0.5°C' }, depreciationRate: 20, documents: [], images: [], createdAt: Timestamp.now(), updatedAt: Timestamp.now() },
  { name: 'LED Panel Lights - Office', type: 'lighting', status: 'active', location: 'Building A - Floor 3', purchaseDate: createTimestamp(-200), purchaseCost: 4500, warrantyExpiry: createTimestamp(530), manufacturer: 'Philips', model: 'CoreLine Panel', serialNumber: 'PH-2024-L001', specifications: { wattage: '40W', quantity: '30 units' }, depreciationRate: 12, documents: [], images: [], createdAt: Timestamp.now(), updatedAt: Timestamp.now() },
  { name: 'Emergency Exit Lights', type: 'lighting', status: 'active', location: 'All Buildings - Stairways', purchaseDate: createTimestamp(-400), purchaseCost: 2800, warrantyExpiry: createTimestamp(330), manufacturer: 'Legrand', model: 'Exit Sign LED', serialNumber: 'LG-2023-E045', specifications: { battery: '3hr backup', quantity: '20 units' }, depreciationRate: 10, documents: [], images: [], createdAt: Timestamp.now(), updatedAt: Timestamp.now() },
  { name: 'Smoke Detector Network', type: 'smoke_detector', status: 'active', location: 'Building A - All Floors', purchaseDate: createTimestamp(-300), purchaseCost: 6500, warrantyExpiry: createTimestamp(430), manufacturer: 'Kidde', model: 'PI2010', serialNumber: 'KD-2023-SD100', specifications: { type: 'Photoelectric', quantity: '50 units' }, depreciationRate: 8, documents: [], images: [], createdAt: Timestamp.now(), updatedAt: Timestamp.now() },
  { name: 'Executive Office Furniture', type: 'furniture', status: 'active', location: 'Building A - Floor 5', purchaseDate: createTimestamp(-450), purchaseCost: 8000, warrantyExpiry: createTimestamp(280), manufacturer: 'Herman Miller', model: 'Aeron Collection', serialNumber: 'HM-2023-F001', specifications: { items: 'Desk, Chair, Cabinet' }, depreciationRate: 5, documents: [], images: [], createdAt: Timestamp.now(), updatedAt: Timestamp.now() },
  { name: 'Backup Generator', type: 'other', status: 'active', location: 'Building A - Rooftop', purchaseDate: createTimestamp(-600), purchaseCost: 45000, warrantyExpiry: createTimestamp(130), manufacturer: 'Caterpillar', model: 'C9.3', serialNumber: 'CAT-2023-G001', specifications: { power: '250kVA', fuel: 'Diesel' }, depreciationRate: 5, documents: [], images: [], createdAt: Timestamp.now(), updatedAt: Timestamp.now() },
  { name: 'CCTV System', type: 'other', status: 'active', location: 'All Buildings', purchaseDate: createTimestamp(-180), purchaseCost: 18000, warrantyExpiry: createTimestamp(550), manufacturer: 'Hikvision', model: 'DS-2CD2143G2-IS', serialNumber: 'HK-2024-CC01', specifications: { cameras: '32 units', storage: '8TB' }, depreciationRate: 15, documents: [], images: [], createdAt: Timestamp.now(), updatedAt: Timestamp.now() },
  { name: 'Old Elevator - Building A', type: 'other', status: 'retired', location: 'Building A', purchaseDate: createTimestamp(-3650), purchaseCost: 120000, warrantyExpiry: null, manufacturer: 'Otis', model: 'Gen2', serialNumber: 'OT-2016-EL01', specifications: { capacity: '1000kg', floors: '6' }, depreciationRate: 3, documents: [], images: [], createdAt: Timestamp.now(), updatedAt: Timestamp.now() },
];

async function seed() {
  console.log('Seeding assets...');
  for (const asset of mockAssets) {
    const docRef = await addDoc(collection(db, 'assets'), asset);
    assetIds.push(docRef.id);
    console.log(`Created: ${asset.name}`);
  }

  console.log('\nSeeding maintenance records...');
  const records = [
    { assetId: assetIds[0], type: 'scheduled', status: 'completed', scheduledDate: createTimestamp(-30), completedDate: createTimestamp(-28), description: 'Quarterly filter replacement', cost: 450, technician: 'John Smith', notes: 'All filters replaced', createdAt: Timestamp.now(), updatedAt: Timestamp.now() },
    { assetId: assetIds[0], type: 'inspection', status: 'pending', scheduledDate: createTimestamp(7), completedDate: null, description: 'Monthly inspection', cost: 150, technician: 'John Smith', notes: '', createdAt: Timestamp.now(), updatedAt: Timestamp.now() },
    { assetId: assetIds[2], type: 'repair', status: 'completed', scheduledDate: createTimestamp(-14), completedDate: createTimestamp(-12), description: 'Replace impeller and seal', cost: 1200, technician: 'Mike Johnson', notes: 'Parts replaced', createdAt: Timestamp.now(), updatedAt: Timestamp.now() },
    { assetId: assetIds[3], type: 'scheduled', status: 'in_progress', scheduledDate: createTimestamp(-2), completedDate: null, description: 'Annual certification test', cost: 800, technician: 'Fire Safety Team', notes: 'Waiting for inspector', createdAt: Timestamp.now(), updatedAt: Timestamp.now() },
    { assetId: assetIds[9], type: 'scheduled', status: 'overdue', scheduledDate: createTimestamp(-5), completedDate: null, description: 'Generator load test', cost: 300, technician: 'Mike Johnson', notes: 'Delayed', createdAt: Timestamp.now(), updatedAt: Timestamp.now() },
    { assetId: assetIds[7], type: 'inspection', status: 'completed', scheduledDate: createTimestamp(-60), completedDate: createTimestamp(-58), description: 'Smoke detector testing', cost: 400, technician: 'Fire Safety Team', notes: 'All units tested', createdAt: Timestamp.now(), updatedAt: Timestamp.now() },
  ];
  for (const rec of records) {
    await addDoc(collection(db, 'maintenance_records'), rec);
    console.log(`Created record: ${rec.description}`);
  }

  console.log('\nSeeding schedules...');
  const schedules = [
    { assetId: assetIds[0], title: 'AC Filter Replacement', frequency: 'quarterly', lastPerformed: createTimestamp(-30), nextDue: createTimestamp(60), description: 'Replace air filters', isActive: true, createdAt: Timestamp.now(), updatedAt: Timestamp.now() },
    { assetId: assetIds[2], title: 'Pump Lubrication', frequency: 'monthly', lastPerformed: createTimestamp(-28), nextDue: createTimestamp(2), description: 'Lubricate bearings', isActive: true, createdAt: Timestamp.now(), updatedAt: Timestamp.now() },
    { assetId: assetIds[3], title: 'Fire Pump Weekly Test', frequency: 'weekly', lastPerformed: createTimestamp(-5), nextDue: createTimestamp(2), description: 'Run pump test', isActive: true, createdAt: Timestamp.now(), updatedAt: Timestamp.now() },
    { assetId: assetIds[7], title: 'Smoke Detector Testing', frequency: 'quarterly', lastPerformed: createTimestamp(-60), nextDue: createTimestamp(30), description: 'Test all detectors', isActive: true, createdAt: Timestamp.now(), updatedAt: Timestamp.now() },
    { assetId: assetIds[9], title: 'Generator Load Test', frequency: 'monthly', lastPerformed: createTimestamp(-35), nextDue: createTimestamp(-5), description: 'Monthly load test', isActive: true, createdAt: Timestamp.now(), updatedAt: Timestamp.now() },
    { assetId: assetIds[10], title: 'CCTV System Check', frequency: 'monthly', lastPerformed: createTimestamp(-20), nextDue: createTimestamp(10), description: 'Verify cameras', isActive: true, createdAt: Timestamp.now(), updatedAt: Timestamp.now() },
  ];
  for (const sch of schedules) {
    await addDoc(collection(db, 'maintenance_schedules'), sch);
    console.log(`Created schedule: ${sch.title}`);
  }

  console.log('\n✅ Done! Created 12 assets, 6 records, 6 schedules');
  process.exit(0);
}

seed().catch(console.error);
