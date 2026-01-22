import React, { useEffect, useState, useMemo } from 'react';
import { useNavigate } from 'react-router-dom';
import {
  Box,
  Button,
  Card,
  CardContent,
  CardHeader,
  TextField,
  InputAdornment,
  Typography,
  Skeleton,
  Alert,
  List,
  ListItem,
  ListItemText,
  ListItemSecondaryAction,
  IconButton,
  Chip,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Grid,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  Autocomplete,
  CircularProgress,
} from '@mui/material';
import { useForm, Controller } from 'react-hook-form';
import { DatePicker } from '@mui/x-date-pickers/DatePicker';
import { LocalizationProvider } from '@mui/x-date-pickers/LocalizationProvider';
import { AdapterDayjs } from '@mui/x-date-pickers/AdapterDayjs';
import {
  Add as AddIcon,
  Search as SearchIcon,
  Delete as DeleteIcon,
  CheckCircle as PerformIcon,
  Schedule as ScheduleIcon,
} from '@mui/icons-material';
import { maintenanceService } from '../services/maintenanceService';
import { assetService } from '../services/assetService';
import {
  MaintenanceSchedule,
  ScheduleFormData,
  ScheduleFrequency,
  SCHEDULE_FREQUENCY_LABELS,
  Asset,
} from '../types';
import { Timestamp } from 'firebase/firestore';
import dayjs, { Dayjs } from 'dayjs';
import relativeTime from 'dayjs/plugin/relativeTime';

dayjs.extend(relativeTime);

function Schedule() {
  const navigate = useNavigate();
  const [schedules, setSchedules] = useState<MaintenanceSchedule[]>([]);
  const [assets, setAssets] = useState<Asset[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [search, setSearch] = useState('');
  const [dialogOpen, setDialogOpen] = useState(false);
  const [submitting, setSubmitting] = useState(false);
  const [loadingAssets, setLoadingAssets] = useState(false);

  const { control, handleSubmit, reset, formState: { errors } } = useForm<ScheduleFormData>({
    defaultValues: {
      assetId: '',
      title: '',
      frequency: 'monthly',
      nextDue: new Date(),
      description: '',
      isActive: true,
    },
  });

  useEffect(() => {
    loadData();
  }, []);

  const loadData = async () => {
    try {
      setLoading(true);
      setError(null);

      const [schedulesData, assetsData] = await Promise.all([
        maintenanceService.getAllSchedules(),
        assetService.getAll(),
      ]);

      // Create asset lookup map
      const assetMap = assetsData.reduce(
        (acc, asset) => {
          acc[asset.id] = asset.name;
          return acc;
        },
        {} as Record<string, string>
      );

      // Add asset names to schedules
      const schedulesWithNames = schedulesData.map((schedule) => ({
        ...schedule,
        assetName: assetMap[schedule.assetId] || 'Unknown Asset',
      }));

      setSchedules(schedulesWithNames);
      setAssets(assetsData);
    } catch (err) {
      setError('Failed to load schedules. Please try again.');
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const filteredSchedules = useMemo(() => {
    return schedules.filter(
      (schedule) =>
        !search ||
        schedule.title.toLowerCase().includes(search.toLowerCase()) ||
        schedule.assetName?.toLowerCase().includes(search.toLowerCase())
    );
  }, [schedules, search]);

  const overdueSchedules = filteredSchedules.filter(
    (s) => s.isActive && (s.nextDue as Timestamp).toDate() < new Date()
  );
  const upcomingSchedules = filteredSchedules.filter(
    (s) => s.isActive && (s.nextDue as Timestamp).toDate() >= new Date()
  );
  const inactiveSchedules = filteredSchedules.filter((s) => !s.isActive);

  const handleOpenDialog = () => {
    reset({
      assetId: '',
      title: '',
      frequency: 'monthly',
      nextDue: new Date(),
      description: '',
      isActive: true,
    });
    setDialogOpen(true);
  };

  const handleCloseDialog = () => {
    setDialogOpen(false);
  };

  const onSubmit = async (data: ScheduleFormData) => {
    try {
      setSubmitting(true);
      await maintenanceService.createSchedule(data);
      handleCloseDialog();
      loadData();
    } catch (err) {
      console.error(err);
      setError('Failed to create schedule');
    } finally {
      setSubmitting(false);
    }
  };

  const handleMarkPerformed = async (id: string) => {
    try {
      await maintenanceService.markSchedulePerformed(id);
      loadData();
    } catch (err) {
      console.error(err);
      setError('Failed to update schedule');
    }
  };

  const handleDelete = async (id: string) => {
    if (window.confirm('Are you sure you want to delete this schedule?')) {
      try {
        await maintenanceService.deleteSchedule(id);
        setSchedules(schedules.filter((s) => s.id !== id));
      } catch (err) {
        console.error(err);
        setError('Failed to delete schedule');
      }
    }
  };

  const renderScheduleItem = (schedule: MaintenanceSchedule, isOverdue: boolean = false) => {
    const dueDate = (schedule.nextDue as Timestamp).toDate();
    const dueDateFormatted = dayjs(dueDate).format('MMM D, YYYY');
    const dueFromNow = dayjs(dueDate).fromNow();

    return (
      <ListItem
        key={schedule.id}
        sx={{
          border: '1px solid',
          borderColor: isOverdue ? 'error.light' : 'divider',
          borderRadius: 2,
          mb: 1,
          bgcolor: isOverdue ? 'error.50' : 'transparent',
        }}
      >
        <ListItemText
          primary={
            <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
              <Typography variant="subtitle2">{schedule.title}</Typography>
              <Chip
                label={SCHEDULE_FREQUENCY_LABELS[schedule.frequency]}
                size="small"
                sx={{ height: 20, fontSize: '0.7rem' }}
              />
              {isOverdue && (
                <Chip label="Overdue" color="error" size="small" sx={{ height: 20 }} />
              )}
            </Box>
          }
          secondary={
            <Box sx={{ mt: 0.5 }}>
              <Typography variant="body2" color="text.secondary">
                {schedule.assetName} • Due: {dueDateFormatted} ({dueFromNow})
              </Typography>
              {schedule.description && (
                <Typography
                  variant="caption"
                  color="text.secondary"
                  sx={{ display: 'block', mt: 0.5 }}
                >
                  {schedule.description}
                </Typography>
              )}
            </Box>
          }
        />
        <ListItemSecondaryAction>
          <IconButton
            edge="end"
            color="success"
            onClick={() => handleMarkPerformed(schedule.id)}
            title="Mark as performed"
            sx={{ mr: 1 }}
          >
            <PerformIcon />
          </IconButton>
          <IconButton
            edge="end"
            color="error"
            onClick={() => handleDelete(schedule.id)}
            title="Delete"
          >
            <DeleteIcon />
          </IconButton>
        </ListItemSecondaryAction>
      </ListItem>
    );
  };

  if (loading) {
    return (
      <Box>
        <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 3 }}>
          <Skeleton variant="rounded" width={300} height={40} />
          <Skeleton variant="rounded" width={150} height={40} />
        </Box>
        <Skeleton variant="rounded" height={300} />
      </Box>
    );
  }

  return (
    <LocalizationProvider dateAdapter={AdapterDayjs}>
      <Box>
        {/* Header */}
        <Box
          sx={{
            display: 'flex',
            justifyContent: 'space-between',
            alignItems: 'center',
            mb: 3,
            flexWrap: 'wrap',
            gap: 2,
          }}
        >
          <TextField
            placeholder="Search schedules..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            size="small"
            sx={{ minWidth: 300 }}
            InputProps={{
              startAdornment: (
                <InputAdornment position="start">
                  <SearchIcon color="action" />
                </InputAdornment>
              ),
            }}
          />

          <Button
            variant="contained"
            startIcon={<AddIcon />}
            onClick={handleOpenDialog}
          >
            Add Schedule
          </Button>
        </Box>

        {error && (
          <Alert severity="error" sx={{ mb: 3 }} onClose={() => setError(null)}>
            {error}
          </Alert>
        )}

        <Grid container spacing={3}>
          {/* Overdue Section */}
          {overdueSchedules.length > 0 && (
            <Grid size={12}>
              <Card sx={{ borderColor: 'error.main', borderWidth: 2 }}>
                <CardHeader
                  title={
                    <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                      <Typography variant="h6" color="error">
                        Overdue
                      </Typography>
                      <Chip
                        label={overdueSchedules.length}
                        color="error"
                        size="small"
                      />
                    </Box>
                  }
                />
                <CardContent>
                  <List disablePadding>
                    {overdueSchedules.map((schedule) =>
                      renderScheduleItem(schedule, true)
                    )}
                  </List>
                </CardContent>
              </Card>
            </Grid>
          )}

          {/* Upcoming Section */}
          <Grid size={{ xs: 12, md: inactiveSchedules.length > 0 ? 8 : 12 }}>
            <Card>
              <CardHeader
                title={
                  <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                    <Typography variant="h6">Upcoming Schedules</Typography>
                    <Chip label={upcomingSchedules.length} size="small" />
                  </Box>
                }
              />
              <CardContent>
                {upcomingSchedules.length === 0 ? (
                  <Box sx={{ textAlign: 'center', py: 4 }}>
                    <ScheduleIcon
                      sx={{ fontSize: 48, color: 'text.secondary', mb: 1 }}
                    />
                    <Typography color="text.secondary">
                      No upcoming schedules
                    </Typography>
                  </Box>
                ) : (
                  <List disablePadding>
                    {upcomingSchedules.map((schedule) =>
                      renderScheduleItem(schedule)
                    )}
                  </List>
                )}
              </CardContent>
            </Card>
          </Grid>

          {/* Inactive Section */}
          {inactiveSchedules.length > 0 && (
            <Grid size={{ xs: 12, md: 4 }}>
              <Card>
                <CardHeader
                  title={
                    <Typography variant="h6" color="text.secondary">
                      Inactive
                    </Typography>
                  }
                />
                <CardContent>
                  <List disablePadding>
                    {inactiveSchedules.map((schedule) => (
                      <ListItem
                        key={schedule.id}
                        sx={{
                          border: '1px solid',
                          borderColor: 'divider',
                          borderRadius: 2,
                          mb: 1,
                          opacity: 0.6,
                        }}
                      >
                        <ListItemText
                          primary={schedule.title}
                          secondary={schedule.assetName}
                        />
                        <ListItemSecondaryAction>
                          <IconButton
                            edge="end"
                            color="error"
                            onClick={() => handleDelete(schedule.id)}
                            size="small"
                          >
                            <DeleteIcon />
                          </IconButton>
                        </ListItemSecondaryAction>
                      </ListItem>
                    ))}
                  </List>
                </CardContent>
              </Card>
            </Grid>
          )}
        </Grid>

        {/* Add Schedule Dialog */}
        <Dialog open={dialogOpen} onClose={handleCloseDialog} maxWidth="sm" fullWidth>
          <form onSubmit={handleSubmit(onSubmit)}>
            <DialogTitle>Add Maintenance Schedule</DialogTitle>
            <DialogContent>
              <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2, mt: 1 }}>
                <Controller
                  name="assetId"
                  control={control}
                  rules={{ required: 'Asset is required' }}
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
                        />
                      )}
                    />
                  )}
                />

                <Controller
                  name="title"
                  control={control}
                  rules={{ required: 'Title is required' }}
                  render={({ field }) => (
                    <TextField
                      {...field}
                      label="Title"
                      error={!!errors.title}
                      helperText={errors.title?.message}
                      placeholder="e.g., Monthly Filter Cleaning"
                    />
                  )}
                />

                <Controller
                  name="frequency"
                  control={control}
                  render={({ field }) => (
                    <FormControl fullWidth>
                      <InputLabel>Frequency</InputLabel>
                      <Select {...field} label="Frequency">
                        {Object.entries(SCHEDULE_FREQUENCY_LABELS).map(
                          ([value, label]) => (
                            <MenuItem key={value} value={value}>
                              {label}
                            </MenuItem>
                          )
                        )}
                      </Select>
                    </FormControl>
                  )}
                />

                <Controller
                  name="nextDue"
                  control={control}
                  render={({ field }) => (
                    <DatePicker
                      label="First Due Date"
                      value={field.value ? dayjs(field.value) : null}
                      onChange={(date: Dayjs | null) =>
                        field.onChange(date?.toDate() || null)
                      }
                      slotProps={{
                        textField: { fullWidth: true },
                      }}
                    />
                  )}
                />

                <Controller
                  name="description"
                  control={control}
                  render={({ field }) => (
                    <TextField
                      {...field}
                      label="Description"
                      multiline
                      rows={2}
                      placeholder="Describe the maintenance task..."
                    />
                  )}
                />
              </Box>
            </DialogContent>
            <DialogActions>
              <Button onClick={handleCloseDialog}>Cancel</Button>
              <Button type="submit" variant="contained" disabled={submitting}>
                {submitting ? 'Creating...' : 'Create Schedule'}
              </Button>
            </DialogActions>
          </form>
        </Dialog>
      </Box>
    </LocalizationProvider>
  );
}

export default Schedule;
