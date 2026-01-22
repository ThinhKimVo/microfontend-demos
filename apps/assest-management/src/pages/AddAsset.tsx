import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Box, Typography, Alert } from '@mui/material';
import AssetForm from '../components/assets/AssetForm';
import { assetService } from '../services/assetService';
import { AssetFormData } from '../types';

function AddAsset() {
  const navigate = useNavigate();
  const [error, setError] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(false);

  const handleSubmit = async (data: AssetFormData) => {
    try {
      setIsLoading(true);
      setError(null);
      const id = await assetService.create(data);
      navigate(`/assets/${id}`);
    } catch (err) {
      setError('Failed to create asset. Please try again.');
      console.error(err);
    } finally {
      setIsLoading(false);
    }
  };

  const handleCancel = () => {
    navigate('/assets');
  };

  return (
    <Box>
      <Typography variant="h5" fontWeight={600} sx={{ mb: 3 }}>
        Add New Asset
      </Typography>

      {error && (
        <Alert severity="error" sx={{ mb: 3 }} onClose={() => setError(null)}>
          {error}
        </Alert>
      )}

      <AssetForm
        onSubmit={handleSubmit}
        onCancel={handleCancel}
        isLoading={isLoading}
      />
    </Box>
  );
}

export default AddAsset;
