import React, { useEffect, useState } from 'react';
import { useForm, Controller } from 'react-hook-form';
import { yupResolver } from '@hookform/resolvers/yup';
import * as yup from 'yup';
import {
  Box,
  Grid,
  TextField,
  Button,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  Card,
  CardContent,
  CardHeader,
  InputAdornment,
  FormHelperText,
  Divider,
  Autocomplete,
  CircularProgress,
} from '@mui/material';
import { DatePicker } from '@mui/x-date-pickers/DatePicker';
import { LocalizationProvider } from '@mui/x-date-pickers/LocalizationProvider';
import { AdapterDayjs } from '@mui/x-date-pickers/AdapterDayjs';
import { Save as SaveIcon } from '@mui/icons-material';
import dayjs, { Dayjs } from 'dayjs';
import {
  MaintenanceFormData,
  MaintenanceType,
  MaintenanceStatus,
  MAINTENANCE_TYPE_LABELS,
  MAINTENANCE_STATUS_LABELS,
  Asset,
} from '../../types';
import { assetService } from '../../services/assetService';

const schema = yup.object({
  assetId: yup.string().required('Asset is required'),
  type: yup.string().required('Type is required'),
  status: yup.string().required('Status is required'),
  scheduledDate: yup.date().required('Scheduled date is required').nullable(),
  completedDate: yup.date().nullable(),
  description: yup.string().required('Description is required'),
  cost: yup.number().typeError('Cost must be a number').min(0, 'Cost must be positive'),
  technician: yup.string().required('Technician is required'),
  notes: yup.string(),
});

interface MaintenanceFormProps {
  initialData?: Partial<MaintenanceFormData>;
  preselectedAssetId?: string;
  onSubmit: (data: MaintenanceFormData) => Promise<void>;
  onCancel: () => void;
  isLoading?: boolean;
}

function MaintenanceForm({
  initialData,
  preselectedAssetId,
  onSubmit,
  onCancel,
  isLoading,
}: MaintenanceFormProps) {
  const [assets, setAssets] = useState<Asset[]>([]);
  const [loadingAssets, setLoadingAssets] = useState(true);

  const {
    register,
    handleSubmit,
    control,
    formState: { errors },
    watch,
  } = useForm<MaintenanceFormData>({
    resolver: yupResolver(schema) as any,
    defaultValues: {
      assetId: preselectedAssetId || '',
      type: 'scheduled',
      status: 'pending',
      scheduledDate: new Date(),
      completedDate: null,
      description: '',
      cost: 0,
      technician: '',
      notes: '',
      ...initialData,
    },
  });

  const status = watch('status');

  useEffect(() => {
    loadAssets();
  }, []);

  const loadAssets = async () => {
    try {
      setLoadingAssets(true);
      const data = await assetService.getAll();
      setAssets(data);
    } catch (err) {
      console.error('Failed to load assets:', err);
    } finally {
      setLoadingAssets(false);
    }
  };

  return (
    <LocalizationProvider dateAdapter={AdapterDayjs}>
      <form onSubmit={handleSubmit(onSubmit)}>
        <Grid container spacing={3}>
          {/* Asset Selection */}
          <Grid size={12}>
            <Card>
              <CardHeader title="Maintenance Details" />
              <CardContent>
                <Grid container spacing={2}>
                  <Grid size={12}>
                    <Controller
                      name="assetId"
                      control={control}
                      render={({ field }) => (
                        <Autocomplete
                          options={assets}
                          getOptionLabel={(option) =>
                            typeof option === 'string'
                              ? assets.find((a) => a.id === option)?.name || ''
                              : option.name
                          }
                          value={assets.find((a) => a.id === field.value) || null}
                          onChange={(_, newValue) => {
                            field.onChange(newValue?.id || '');
                          }}
                          loading={loadingAssets}
                          renderInput={(params) => (
                            <TextField
                              {...params}
                              label="Select Asset"
                              error={!!errors.assetId}
                              helperText={errors.assetId?.message}
                              InputProps={{
                                ...params.InputProps,
                                endAdornment: (
                                  <>
                                    {loadingAssets && (
                                      <CircularProgress color="inherit" size={20} />
                                    )}
                                    {params.InputProps.endAdornment}
                                  </>
                                ),
                              }}
                            />
                          )}
                          renderOption={(props, option) => (
                            <li {...props} key={option.id}>
                              <Box>
                                <Box fontWeight={500}>{option.name}</Box>
                                <Box fontSize="0.75rem" color="text.secondary">
                                  {option.serialNumber} • {option.location}
                                </Box>
                              </Box>
                            </li>
                          )}
                        />
                      )}
                    />
                  </Grid>

                  <Grid size={{ xs: 12, md: 6 }}>
                    <FormControl fullWidth error={!!errors.type}>
                      <InputLabel>Type</InputLabel>
                      <Controller
                        name="type"
                        control={control}
                        render={({ field }) => (
                          <Select {...field} label="Type">
                            {Object.entries(MAINTENANCE_TYPE_LABELS).map(
                              ([value, label]) => (
                                <MenuItem key={value} value={value}>
                                  {label}
                                </MenuItem>
                              )
                            )}
                          </Select>
                        )}
                      />
                      {errors.type && (
                        <FormHelperText>{errors.type.message}</FormHelperText>
                      )}
                    </FormControl>
                  </Grid>

                  <Grid size={{ xs: 12, md: 6 }}>
                    <FormControl fullWidth error={!!errors.status}>
                      <InputLabel>Status</InputLabel>
                      <Controller
                        name="status"
                        control={control}
                        render={({ field }) => (
                          <Select {...field} label="Status">
                            {Object.entries(MAINTENANCE_STATUS_LABELS).map(
                              ([value, label]) => (
                                <MenuItem key={value} value={value}>
                                  {label}
                                </MenuItem>
                              )
                            )}
                          </Select>
                        )}
                      />
                      {errors.status && (
                        <FormHelperText>{errors.status.message}</FormHelperText>
                      )}
                    </FormControl>
                  </Grid>

                  <Grid size={12}>
                    <TextField
                      {...register('description')}
                      label="Description"
                      fullWidth
                      multiline
                      rows={2}
                      error={!!errors.description}
                      helperText={errors.description?.message}
                      placeholder="Describe the maintenance work..."
                    />
                  </Grid>
                </Grid>
              </CardContent>
            </Card>
          </Grid>

          {/* Schedule & Cost */}
          <Grid size={12}>
            <Card>
              <CardHeader title="Schedule & Cost" />
              <CardContent>
                <Grid container spacing={2}>
                  <Grid size={{ xs: 12, md: 6 }}>
                    <Controller
                      name="scheduledDate"
                      control={control}
                      render={({ field }) => (
                        <DatePicker
                          label="Scheduled Date"
                          value={field.value ? dayjs(field.value) : null}
                          onChange={(date: Dayjs | null) =>
                            field.onChange(date?.toDate() || null)
                          }
                          slotProps={{
                            textField: {
                              fullWidth: true,
                              error: !!errors.scheduledDate,
                              helperText: errors.scheduledDate?.message,
                            },
                          }}
                        />
                      )}
                    />
                  </Grid>

                  {status === 'completed' && (
                    <Grid size={{ xs: 12, md: 6 }}>
                      <Controller
                        name="completedDate"
                        control={control}
                        render={({ field }) => (
                          <DatePicker
                            label="Completed Date"
                            value={field.value ? dayjs(field.value) : null}
                            onChange={(date: Dayjs | null) =>
                              field.onChange(date?.toDate() || null)
                            }
                            slotProps={{
                              textField: {
                                fullWidth: true,
                              },
                            }}
                          />
                        )}
                      />
                    </Grid>
                  )}

                  <Grid size={{ xs: 12, md: 6 }}>
                    <TextField
                      {...register('technician')}
                      label="Technician"
                      fullWidth
                      error={!!errors.technician}
                      helperText={errors.technician?.message}
                      placeholder="Name of technician"
                    />
                  </Grid>

                  <Grid size={{ xs: 12, md: 6 }}>
                    <TextField
                      {...register('cost')}
                      label="Cost"
                      type="number"
                      fullWidth
                      error={!!errors.cost}
                      helperText={errors.cost?.message}
                      InputProps={{
                        startAdornment: (
                          <InputAdornment position="start">$</InputAdornment>
                        ),
                      }}
                    />
                  </Grid>

                  <Grid size={12}>
                    <TextField
                      {...register('notes')}
                      label="Notes"
                      fullWidth
                      multiline
                      rows={3}
                      placeholder="Additional notes or observations..."
                    />
                  </Grid>
                </Grid>
              </CardContent>
            </Card>
          </Grid>

          {/* Actions */}
          <Grid size={12}>
            <Divider sx={{ my: 2 }} />
            <Box sx={{ display: 'flex', gap: 2, justifyContent: 'flex-end' }}>
              <Button variant="outlined" onClick={onCancel} disabled={isLoading}>
                Cancel
              </Button>
              <Button
                type="submit"
                variant="contained"
                startIcon={<SaveIcon />}
                disabled={isLoading}
              >
                {isLoading ? 'Saving...' : 'Save Maintenance'}
              </Button>
            </Box>
          </Grid>
        </Grid>
      </form>
    </LocalizationProvider>
  );
}

export default MaintenanceForm;
