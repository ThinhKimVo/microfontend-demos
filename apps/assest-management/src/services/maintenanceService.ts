import {
  collection,
  doc,
  getDocs,
  getDoc,
  addDoc,
  updateDoc,
  deleteDoc,
  query,
  where,
  orderBy,
  Timestamp,
  QueryConstraint,
} from 'firebase/firestore';
import { db } from '../config/firebase';
import {
  MaintenanceRecord,
  MaintenanceFormData,
  MaintenanceSchedule,
  ScheduleFormData,
  MaintenanceStatus,
  MaintenanceType,
  ScheduleFrequency,
} from '../types';

const RECORDS_COLLECTION = 'maintenance_records';
const SCHEDULES_COLLECTION = 'maintenance_schedules';

export interface MaintenanceFilters {
  assetId?: string;
  status?: MaintenanceStatus;
  type?: MaintenanceType;
}

// Helper to calculate next due date based on frequency
function calculateNextDue(lastDate: Date, frequency: ScheduleFrequency): Date {
  const next = new Date(lastDate);
  switch (frequency) {
    case 'daily':
      next.setDate(next.getDate() + 1);
      break;
    case 'weekly':
      next.setDate(next.getDate() + 7);
      break;
    case 'monthly':
      next.setMonth(next.getMonth() + 1);
      break;
    case 'quarterly':
      next.setMonth(next.getMonth() + 3);
      break;
    case 'yearly':
      next.setFullYear(next.getFullYear() + 1);
      break;
  }
  return next;
}

export const maintenanceService = {
  // Maintenance Records
  async getAllRecords(filters?: MaintenanceFilters): Promise<MaintenanceRecord[]> {
    const constraints: QueryConstraint[] = [orderBy('scheduledDate', 'desc')];

    if (filters?.assetId) {
      constraints.unshift(where('assetId', '==', filters.assetId));
    }
    if (filters?.status) {
      constraints.unshift(where('status', '==', filters.status));
    }
    if (filters?.type) {
      constraints.unshift(where('type', '==', filters.type));
    }

    const q = query(collection(db, RECORDS_COLLECTION), ...constraints);
    const snapshot = await getDocs(q);

    return snapshot.docs.map((doc) => ({
      id: doc.id,
      ...doc.data(),
    })) as MaintenanceRecord[];
  },

  async getRecordById(id: string): Promise<MaintenanceRecord | null> {
    const docRef = doc(db, RECORDS_COLLECTION, id);
    const snapshot = await getDoc(docRef);

    if (!snapshot.exists()) {
      return null;
    }

    return {
      id: snapshot.id,
      ...snapshot.data(),
    } as MaintenanceRecord;
  },

  async createRecord(data: MaintenanceFormData): Promise<string> {
    const now = Timestamp.now();

    const recordData = {
      assetId: data.assetId,
      type: data.type,
      status: data.status,
      scheduledDate: Timestamp.fromDate(data.scheduledDate),
      completedDate: data.completedDate ? Timestamp.fromDate(data.completedDate) : null,
      description: data.description,
      cost: data.cost,
      technician: data.technician,
      notes: data.notes,
      createdAt: now,
      updatedAt: now,
    };

    const docRef = await addDoc(collection(db, RECORDS_COLLECTION), recordData);
    return docRef.id;
  },

  async updateRecord(id: string, data: Partial<MaintenanceFormData>): Promise<void> {
    const docRef = doc(db, RECORDS_COLLECTION, id);

    const updateData: Record<string, unknown> = {
      updatedAt: Timestamp.now(),
    };

    if (data.assetId !== undefined) updateData.assetId = data.assetId;
    if (data.type !== undefined) updateData.type = data.type;
    if (data.status !== undefined) updateData.status = data.status;
    if (data.scheduledDate !== undefined) {
      updateData.scheduledDate = Timestamp.fromDate(data.scheduledDate);
    }
    if (data.completedDate !== undefined) {
      updateData.completedDate = data.completedDate
        ? Timestamp.fromDate(data.completedDate)
        : null;
    }
    if (data.description !== undefined) updateData.description = data.description;
    if (data.cost !== undefined) updateData.cost = data.cost;
    if (data.technician !== undefined) updateData.technician = data.technician;
    if (data.notes !== undefined) updateData.notes = data.notes;

    await updateDoc(docRef, updateData);
  },

  async deleteRecord(id: string): Promise<void> {
    const docRef = doc(db, RECORDS_COLLECTION, id);
    await deleteDoc(docRef);
  },

  async completeRecord(id: string, notes?: string): Promise<void> {
    const docRef = doc(db, RECORDS_COLLECTION, id);
    await updateDoc(docRef, {
      status: 'completed',
      completedDate: Timestamp.now(),
      notes: notes || '',
      updatedAt: Timestamp.now(),
    });
  },

  // Maintenance Schedules
  async getAllSchedules(assetId?: string): Promise<MaintenanceSchedule[]> {
    const constraints: QueryConstraint[] = [orderBy('nextDue', 'asc')];

    if (assetId) {
      constraints.unshift(where('assetId', '==', assetId));
    }

    const q = query(collection(db, SCHEDULES_COLLECTION), ...constraints);
    const snapshot = await getDocs(q);

    return snapshot.docs.map((doc) => ({
      id: doc.id,
      ...doc.data(),
    })) as MaintenanceSchedule[];
  },

  async getScheduleById(id: string): Promise<MaintenanceSchedule | null> {
    const docRef = doc(db, SCHEDULES_COLLECTION, id);
    const snapshot = await getDoc(docRef);

    if (!snapshot.exists()) {
      return null;
    }

    return {
      id: snapshot.id,
      ...snapshot.data(),
    } as MaintenanceSchedule;
  },

  async createSchedule(data: ScheduleFormData): Promise<string> {
    const now = Timestamp.now();

    const scheduleData = {
      assetId: data.assetId,
      title: data.title,
      frequency: data.frequency,
      lastPerformed: null,
      nextDue: Timestamp.fromDate(data.nextDue),
      description: data.description,
      isActive: data.isActive,
      createdAt: now,
      updatedAt: now,
    };

    const docRef = await addDoc(collection(db, SCHEDULES_COLLECTION), scheduleData);
    return docRef.id;
  },

  async updateSchedule(id: string, data: Partial<ScheduleFormData>): Promise<void> {
    const docRef = doc(db, SCHEDULES_COLLECTION, id);

    const updateData: Record<string, unknown> = {
      updatedAt: Timestamp.now(),
    };

    if (data.assetId !== undefined) updateData.assetId = data.assetId;
    if (data.title !== undefined) updateData.title = data.title;
    if (data.frequency !== undefined) updateData.frequency = data.frequency;
    if (data.nextDue !== undefined) {
      updateData.nextDue = Timestamp.fromDate(data.nextDue);
    }
    if (data.description !== undefined) updateData.description = data.description;
    if (data.isActive !== undefined) updateData.isActive = data.isActive;

    await updateDoc(docRef, updateData);
  },

  async deleteSchedule(id: string): Promise<void> {
    const docRef = doc(db, SCHEDULES_COLLECTION, id);
    await deleteDoc(docRef);
  },

  async markSchedulePerformed(id: string): Promise<void> {
    const schedule = await this.getScheduleById(id);
    if (!schedule) return;

    const now = new Date();
    const nextDue = calculateNextDue(now, schedule.frequency);

    const docRef = doc(db, SCHEDULES_COLLECTION, id);
    await updateDoc(docRef, {
      lastPerformed: Timestamp.now(),
      nextDue: Timestamp.fromDate(nextDue),
      updatedAt: Timestamp.now(),
    });
  },

  // Stats and Alerts
  async getUpcomingMaintenance(days: number = 7): Promise<MaintenanceSchedule[]> {
    const now = new Date();
    const futureDate = new Date();
    futureDate.setDate(futureDate.getDate() + days);

    const q = query(
      collection(db, SCHEDULES_COLLECTION),
      where('isActive', '==', true),
      where('nextDue', '>=', Timestamp.fromDate(now)),
      where('nextDue', '<=', Timestamp.fromDate(futureDate)),
      orderBy('nextDue', 'asc')
    );

    const snapshot = await getDocs(q);

    return snapshot.docs.map((doc) => ({
      id: doc.id,
      ...doc.data(),
    })) as MaintenanceSchedule[];
  },

  async getOverdueMaintenance(): Promise<MaintenanceSchedule[]> {
    const now = new Date();

    const q = query(
      collection(db, SCHEDULES_COLLECTION),
      where('isActive', '==', true),
      where('nextDue', '<', Timestamp.fromDate(now)),
      orderBy('nextDue', 'asc')
    );

    const snapshot = await getDocs(q);

    return snapshot.docs.map((doc) => ({
      id: doc.id,
      ...doc.data(),
    })) as MaintenanceSchedule[];
  },

  async getStats(): Promise<{
    pending: number;
    inProgress: number;
    completed: number;
    overdue: number;
  }> {
    const records = await this.getAllRecords();

    return {
      pending: records.filter((r) => r.status === 'pending').length,
      inProgress: records.filter((r) => r.status === 'in_progress').length,
      completed: records.filter((r) => r.status === 'completed').length,
      overdue: records.filter((r) => r.status === 'overdue').length,
    };
  },
};

export default maintenanceService;
