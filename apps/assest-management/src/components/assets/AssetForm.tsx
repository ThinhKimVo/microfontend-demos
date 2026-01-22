import React, { useEffect } from 'react';
import { useForm, useFieldArray, Controller } from 'react-hook-form';
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
  IconButton,
  InputAdornment,
  FormHelperText,
  Divider,
  Typography,
} from '@mui/material';
import { DatePicker } from '@mui/x-date-pickers/DatePicker';
import { LocalizationProvider } from '@mui/x-date-pickers/LocalizationProvider';
import { AdapterDayjs } from '@mui/x-date-pickers/AdapterDayjs';
import {
  Add as AddIcon,
  Delete as DeleteIcon,
  Save as SaveIcon,
} from '@mui/icons-material';
import dayjs, { Dayjs } from 'dayjs';
import {
  AssetFormData,
  AssetType,
  AssetStatus,
  ASSET_TYPE_LABELS,
  ASSET_STATUS_LABELS,
} from '../../types';

const schema = yup.object({
  name: yup.string().required('Name is required'),
  type: yup.string().required('Type is required'),
  status: yup.string().required('Status is required'),
  location: yup.string().required('Location is required'),
  purchaseDate: yup.date().required('Purchase date is required').nullable(),
  purchaseCost: yup
    .number()
    .typeError('Cost must be a number')
    .required('Cost is required')
    .min(0, 'Cost must be positive'),
  warrantyExpiry: yup.date().nullable(),
  manufacturer: yup.string().required('Manufacturer is required'),
  model: yup.string().required('Model is required'),
  serialNumber: yup.string().required('Serial number is required'),
  depreciationRate: yup
    .number()
    .typeError('Rate must be a number')
    .min(0, 'Rate must be between 0 and 100')
    .max(100, 'Rate must be between 0 and 100'),
  specifications: yup.array().of(
    yup.object({
      key: yup.string(),
      value: yup.string(),
    })
  ),
});

interface AssetFormProps {
  initialData?: Partial<AssetFormData>;
  onSubmit: (data: AssetFormData) => Promise<void>;
  onCancel: () => void;
  isLoading?: boolean;
}

function AssetForm({ initialData, onSubmit, onCancel, isLoading }: AssetFormProps) {
  const {
    register,
    handleSubmit,
    control,
    formState: { errors },
    reset,
  } = useForm<AssetFormData>({
    resolver: yupResolver(schema) as any,
    defaultValues: {
      name: '',
      type: 'other',
      status: 'active',
      location: '',
      purchaseDate: new Date(),
      purchaseCost: 0,
      warrantyExpiry: null,
      manufacturer: '',
      model: '',
      serialNumber: '',
      depreciationRate: 10,
      specifications: [{ key: '', value: '' }],
      ...initialData,
    },
  });

  const { fields, append, remove } = useFieldArray({
    control,
    name: 'specifications',
  });

  useEffect(() => {
    if (initialData) {
      reset({
        name: '',
        type: 'other',
        status: 'active',
        location: '',
        purchaseDate: new Date(),
        purchaseCost: 0,
        warrantyExpiry: null,
        manufacturer: '',
        model: '',
        serialNumber: '',
        depreciationRate: 10,
        specifications: [{ key: '', value: '' }],
        ...initialData,
      });
    }
  }, [initialData, reset]);

  return (
    <LocalizationProvider dateAdapter={AdapterDayjs}>
      <form onSubmit={handleSubmit(onSubmit)}>
        <Grid container spacing={3}>
          {/* Basic Information */}
          <Grid size={12}>
            <Card>
              <CardHeader title="Basic Information" />
              <CardContent>
                <Grid container spacing={2}>
                  <Grid size={{ xs: 12, md: 6 }}>
                    <TextField
                      {...register('name')}
                      label="Asset Name"
                      fullWidth
                      error={!!errors.name}
                      helperText={errors.name?.message}
                    />
                  </Grid>

                  <Grid size={{ xs: 12, md: 6 }}>
                    <TextField
                      {...register('serialNumber')}
                      label="Serial Number"
                      fullWidth
                      error={!!errors.serialNumber}
                      helperText={errors.serialNumber?.message}
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
                            {Object.entries(ASSET_TYPE_LABELS).map(
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
                            {Object.entries(ASSET_STATUS_LABELS).map(
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
                      {...register('location')}
                      label="Location"
                      fullWidth
                      error={!!errors.location}
                      helperText={errors.location?.message}
                      placeholder="e.g., Building A, Floor 2, Room 201"
                    />
                  </Grid>
                </Grid>
              </CardContent>
            </Card>
          </Grid>

          {/* Manufacturer Details */}
          <Grid size={12}>
            <Card>
              <CardHeader title="Manufacturer Details" />
              <CardContent>
                <Grid container spacing={2}>
                  <Grid size={{ xs: 12, md: 6 }}>
                    <TextField
                      {...register('manufacturer')}
                      label="Manufacturer"
                      fullWidth
                      error={!!errors.manufacturer}
                      helperText={errors.manufacturer?.message}
                    />
                  </Grid>

                  <Grid size={{ xs: 12, md: 6 }}>
                    <TextField
                      {...register('model')}
                      label="Model"
                      fullWidth
                      error={!!errors.model}
                      helperText={errors.model?.message}
                    />
                  </Grid>
                </Grid>
              </CardContent>
            </Card>
          </Grid>

          {/* Purchase & Financial */}
          <Grid size={12}>
            <Card>
              <CardHeader title="Purchase & Financial Information" />
              <CardContent>
                <Grid container spacing={2}>
                  <Grid size={{ xs: 12, md: 6 }}>
                    <Controller
                      name="purchaseDate"
                      control={control}
                      render={({ field }) => (
                        <DatePicker
                          label="Purchase Date"
                          value={field.value ? dayjs(field.value) : null}
                          onChange={(date: Dayjs | null) =>
                            field.onChange(date?.toDate() || null)
                          }
                          slotProps={{
                            textField: {
                              fullWidth: true,
                              error: !!errors.purchaseDate,
                              helperText: errors.purchaseDate?.message,
                            },
                          }}
                        />
                      )}
                    />
                  </Grid>

                  <Grid size={{ xs: 12, md: 6 }}>
                    <TextField
                      {...register('purchaseCost')}
                      label="Purchase Cost"
                      type="number"
                      fullWidth
                      error={!!errors.purchaseCost}
                      helperText={errors.purchaseCost?.message}
                      InputProps={{
                        startAdornment: (
                          <InputAdornment position="start">$</InputAdornment>
                        ),
                      }}
                    />
                  </Grid>

                  <Grid size={{ xs: 12, md: 6 }}>
                    <Controller
                      name="warrantyExpiry"
                      control={control}
                      render={({ field }) => (
                        <DatePicker
                          label="Warranty Expiry"
                          value={field.value ? dayjs(field.value) : null}
                          onChange={(date: Dayjs | null) =>
                            field.onChange(date?.toDate() || null)
                          }
                          slotProps={{
                            textField: {
                              fullWidth: true,
                              error: !!errors.warrantyExpiry,
                              helperText: errors.warrantyExpiry?.message,
                            },
                          }}
                        />
                      )}
                    />
                  </Grid>

                  <Grid size={{ xs: 12, md: 6 }}>
                    <TextField
                      {...register('depreciationRate')}
                      label="Annual Depreciation Rate"
                      type="number"
                      fullWidth
                      error={!!errors.depreciationRate}
                      helperText={
                        errors.depreciationRate?.message ||
                        'Percentage of value lost per year'
                      }
                      InputProps={{
                        endAdornment: (
                          <InputAdornment position="end">%</InputAdornment>
                        ),
                      }}
                    />
                  </Grid>
                </Grid>
              </CardContent>
            </Card>
          </Grid>

          {/* Specifications */}
          <Grid size={12}>
            <Card>
              <CardHeader
                title="Specifications"
                action={
                  <Button
                    startIcon={<AddIcon />}
                    onClick={() => append({ key: '', value: '' })}
                    size="small"
                  >
                    Add Spec
                  </Button>
                }
              />
              <CardContent>
                {fields.length === 0 ? (
                  <Typography variant="body2" color="text.secondary">
                    No specifications added. Click "Add Spec" to add technical
                    specifications.
                  </Typography>
                ) : (
                  <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2 }}>
                    {fields.map((field, index) => (
                      <Box
                        key={field.id}
                        sx={{ display: 'flex', gap: 2, alignItems: 'flex-start' }}
                      >
                        <TextField
                          {...register(`specifications.${index}.key`)}
                          label="Property"
                          placeholder="e.g., Voltage, Power"
                          size="small"
                          sx={{ flex: 1 }}
                        />
                        <TextField
                          {...register(`specifications.${index}.value`)}
                          label="Value"
                          placeholder="e.g., 220V, 5000W"
                          size="small"
                          sx={{ flex: 1 }}
                        />
                        <IconButton
                          color="error"
                          onClick={() => remove(index)}
                          size="small"
                        >
                          <DeleteIcon />
                        </IconButton>
                      </Box>
                    ))}
                  </Box>
                )}
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
                {isLoading ? 'Saving...' : 'Save Asset'}
              </Button>
            </Box>
          </Grid>
        </Grid>
      </form>
    </LocalizationProvider>
  );
}

export default AssetForm;
