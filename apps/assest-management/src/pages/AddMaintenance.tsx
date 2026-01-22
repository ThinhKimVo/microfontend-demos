import React, { useState } from 'react';
import { useNavigate, useSearchParams } from 'react-router-dom';
import { Box, Typography, Alert } from '@mui/material';
import MaintenanceForm from '../components/maintenance/MaintenanceForm';
import { maintenanceService } from '../services/maintenanceService';
import { MaintenanceFormData } from '../types';

function AddMaintenance() {
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const preselectedAssetId = searchParams.get('assetId') || undefined;
  const [error, setError] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(false);

  const handleSubmit = async (data: MaintenanceFormData) => {
    try {
      setIsLoading(true);
      setError(null);
      await maintenanceService.createRecord(data);
      navigate('/maintenance');
    } catch (err) {
      setError('Failed to create maintenance record. Please try again.');
      console.error(err);
    } finally {
      setIsLoading(false);
    }
  };

  const handleCancel = () => {
    if (preselectedAssetId) {
      navigate(`/assets/${preselectedAssetId}`);
    } else {
      navigate('/maintenance');
    }
  };

  return (
    <Box>
      <Typography variant="h5" fontWeight={600} sx={{ mb: 3 }}>
        Log Maintenance
      </Typography>

      {error && (
        <Alert severity="error" sx={{ mb: 3 }} onClose={() => setError(null)}>
          {error}
        </Alert>
      )}

      <MaintenanceForm
        preselectedAssetId={preselectedAssetId}
        onSubmit={handleSubmit}
        onCancel={handleCancel}
        isLoading={isLoading}
      />
    </Box>
  );
}

export default AddMaintenance;
