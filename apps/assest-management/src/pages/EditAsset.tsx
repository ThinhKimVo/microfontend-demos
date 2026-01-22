import React, { useState, useEffect } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { Box, Typography, Alert, Skeleton } from '@mui/material';
import AssetForm from '../components/assets/AssetForm';
import { assetService } from '../services/assetService';
import { Asset, AssetFormData } from '../types';
import { Timestamp } from 'firebase/firestore';

function EditAsset() {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const [asset, setAsset] = useState<Asset | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [loadingAsset, setLoadingAsset] = useState(true);

  useEffect(() => {
    loadAsset();
  }, [id]);

  const loadAsset = async () => {
    if (!id) return;

    try {
      setLoadingAsset(true);
      const data = await assetService.getById(id);
      if (!data) {
        setError('Asset not found');
        return;
      }
      setAsset(data);
    } catch (err) {
      setError('Failed to load asset');
      console.error(err);
    } finally {
      setLoadingAsset(false);
    }
  };

  const handleSubmit = async (data: AssetFormData) => {
    if (!id) return;

    try {
      setIsLoading(true);
      setError(null);
      await assetService.update(id, data);
      navigate(`/assets/${id}`);
    } catch (err) {
      setError('Failed to update asset. Please try again.');
      console.error(err);
    } finally {
      setIsLoading(false);
    }
  };

  const handleCancel = () => {
    navigate(`/assets/${id}`);
  };

  if (loadingAsset) {
    return (
      <Box>
        <Skeleton variant="text" width={200} height={40} sx={{ mb: 3 }} />
        <Skeleton variant="rounded" height={400} />
      </Box>
    );
  }

  if (!asset) {
    return (
      <Alert severity="error">
        {error || 'Asset not found'}
      </Alert>
    );
  }

  // Convert asset data to form data
  const initialData: Partial<AssetFormData> = {
    name: asset.name,
    type: asset.type,
    status: asset.status,
    location: asset.location,
    purchaseDate: (asset.purchaseDate as Timestamp).toDate(),
    purchaseCost: asset.purchaseCost,
    warrantyExpiry: asset.warrantyExpiry
      ? (asset.warrantyExpiry as Timestamp).toDate()
      : null,
    manufacturer: asset.manufacturer,
    model: asset.model,
    serialNumber: asset.serialNumber,
    depreciationRate: asset.depreciationRate,
    specifications: Object.entries(asset.specifications).map(([key, value]) => ({
      key,
      value,
    })),
  };

  return (
    <Box>
      <Typography variant="h5" fontWeight={600} sx={{ mb: 3 }}>
        Edit Asset: {asset.name}
      </Typography>

      {error && (
        <Alert severity="error" sx={{ mb: 3 }} onClose={() => setError(null)}>
          {error}
        </Alert>
      )}

      <AssetForm
        initialData={initialData}
        onSubmit={handleSubmit}
        onCancel={handleCancel}
        isLoading={isLoading}
      />
    </Box>
  );
}

export default EditAsset;
