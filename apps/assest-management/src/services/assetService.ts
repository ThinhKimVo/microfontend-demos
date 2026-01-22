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
import { Asset, AssetFormData, AssetStatus, AssetType } from '../types';

const COLLECTION_NAME = 'assets';

export interface AssetFilters {
  type?: AssetType;
  status?: AssetStatus;
  location?: string;
}

export const assetService = {
  async getAll(filters?: AssetFilters): Promise<Asset[]> {
    const constraints: QueryConstraint[] = [orderBy('createdAt', 'desc')];

    if (filters?.type) {
      constraints.unshift(where('type', '==', filters.type));
    }
    if (filters?.status) {
      constraints.unshift(where('status', '==', filters.status));
    }

    const q = query(collection(db, COLLECTION_NAME), ...constraints);
    const snapshot = await getDocs(q);

    return snapshot.docs.map((doc) => ({
      id: doc.id,
      ...doc.data(),
    })) as Asset[];
  },

  async getById(id: string): Promise<Asset | null> {
    const docRef = doc(db, COLLECTION_NAME, id);
    const snapshot = await getDoc(docRef);

    if (!snapshot.exists()) {
      return null;
    }

    return {
      id: snapshot.id,
      ...snapshot.data(),
    } as Asset;
  },

  async create(data: AssetFormData): Promise<string> {
    const now = Timestamp.now();

    const assetData = {
      name: data.name,
      type: data.type,
      status: data.status,
      location: data.location,
      purchaseDate: Timestamp.fromDate(data.purchaseDate),
      purchaseCost: data.purchaseCost,
      warrantyExpiry: data.warrantyExpiry ? Timestamp.fromDate(data.warrantyExpiry) : null,
      manufacturer: data.manufacturer,
      model: data.model,
      serialNumber: data.serialNumber,
      specifications: data.specifications.reduce(
        (acc, { key, value }) => {
          if (key && value) {
            acc[key] = value;
          }
          return acc;
        },
        {} as Record<string, string>
      ),
      depreciationRate: data.depreciationRate,
      documents: [],
      images: [],
      createdAt: now,
      updatedAt: now,
    };

    const docRef = await addDoc(collection(db, COLLECTION_NAME), assetData);
    return docRef.id;
  },

  async update(id: string, data: Partial<AssetFormData>): Promise<void> {
    const docRef = doc(db, COLLECTION_NAME, id);

    const updateData: Record<string, unknown> = {
      updatedAt: Timestamp.now(),
    };

    if (data.name !== undefined) updateData.name = data.name;
    if (data.type !== undefined) updateData.type = data.type;
    if (data.status !== undefined) updateData.status = data.status;
    if (data.location !== undefined) updateData.location = data.location;
    if (data.purchaseDate !== undefined) {
      updateData.purchaseDate = Timestamp.fromDate(data.purchaseDate);
    }
    if (data.purchaseCost !== undefined) updateData.purchaseCost = data.purchaseCost;
    if (data.warrantyExpiry !== undefined) {
      updateData.warrantyExpiry = data.warrantyExpiry
        ? Timestamp.fromDate(data.warrantyExpiry)
        : null;
    }
    if (data.manufacturer !== undefined) updateData.manufacturer = data.manufacturer;
    if (data.model !== undefined) updateData.model = data.model;
    if (data.serialNumber !== undefined) updateData.serialNumber = data.serialNumber;
    if (data.specifications !== undefined) {
      updateData.specifications = data.specifications.reduce(
        (acc, { key, value }) => {
          if (key && value) {
            acc[key] = value;
          }
          return acc;
        },
        {} as Record<string, string>
      );
    }
    if (data.depreciationRate !== undefined) updateData.depreciationRate = data.depreciationRate;

    await updateDoc(docRef, updateData);
  },

  async delete(id: string): Promise<void> {
    const docRef = doc(db, COLLECTION_NAME, id);
    await deleteDoc(docRef);
  },

  async updateImages(id: string, images: string[]): Promise<void> {
    const docRef = doc(db, COLLECTION_NAME, id);
    await updateDoc(docRef, {
      images,
      updatedAt: Timestamp.now(),
    });
  },

  async getStats(): Promise<{
    total: number;
    byStatus: Record<AssetStatus, number>;
    byType: Record<AssetType, number>;
  }> {
    const assets = await this.getAll();

    const byStatus = assets.reduce(
      (acc, asset) => {
        acc[asset.status] = (acc[asset.status] || 0) + 1;
        return acc;
      },
      {} as Record<AssetStatus, number>
    );

    const byType = assets.reduce(
      (acc, asset) => {
        acc[asset.type] = (acc[asset.type] || 0) + 1;
        return acc;
      },
      {} as Record<AssetType, number>
    );

    return {
      total: assets.length,
      byStatus,
      byType,
    };
  },
};

export default assetService;
