import React, { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import {
  Box,
  Grid,
  Card,
  CardContent,
  CardHeader,
  Typography,
  Chip,
  Button,
  Skeleton,
  Alert,
  Table,
  TableBody,
  TableRow,
  TableCell,
  Divider,
  Tabs,
  Tab,
  IconButton,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
} from '@mui/material';
import {
  Edit as EditIcon,
  Delete as DeleteIcon,
  ArrowBack as BackIcon,
  Build as MaintenanceIcon,
} from '@mui/icons-material';
import { assetService } from '../services/assetService';
import { maintenanceService } from '../services/maintenanceService';
import {
  Asset,
  MaintenanceRecord,
  ASSET_TYPE_LABELS,
  ASSET_STATUS_LABELS,
  ASSET_STATUS_COLORS,
  MAINTENANCE_STATUS_LABELS,
  MAINTENANCE_STATUS_COLORS,
  AssetType,
  AssetStatus,
  MaintenanceStatus,
} from '../types';
import { Timestamp } from 'firebase/firestore';
import dayjs from 'dayjs';

interface TabPanelProps {
  children?: React.ReactNode;
  index: number;
  value: number;
}

function TabPanel({ children, value, index }: TabPanelProps) {
  return (
    <Box hidden={value !== index} sx={{ pt: 2 }}>
      {value === index && children}
    </Box>
  );
}

function AssetDetail() {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const [asset, setAsset] = useState<Asset | null>(null);
  const [maintenanceRecords, setMaintenanceRecords] = useState<MaintenanceRecord[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [tabValue, setTabValue] = useState(0);
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);

  useEffect(() => {
    if (id) {
      loadAsset();
    }
  }, [id]);

  const loadAsset = async () => {
    try {
      setLoading(true);
      setError(null);

      // Load asset first
      const assetData = await assetService.getById(id!);

      if (!assetData) {
        setError('Asset not found');
        return;
      }

      setAsset(assetData);

      // Try to load maintenance records separately (may fail if index is missing)
      try {
        const records = await maintenanceService.getAllRecords({ assetId: id });
        setMaintenanceRecords(records);
      } catch (maintenanceErr) {
        // Log the error but don't fail the whole page
        console.error('Failed to load maintenance records:', maintenanceErr);
        setMaintenanceRecords([]);
      }
    } catch (err) {
      setError('Failed to load asset details');
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async () => {
    try {
      await assetService.delete(id!);
      navigate('/assets');
    } catch (err) {
      setError('Failed to delete asset');
      console.error(err);
    }
    setDeleteDialogOpen(false);
  };

  const calculateCurrentValue = () => {
    if (!asset) return 0;

    const purchaseDate = (asset.purchaseDate as Timestamp).toDate();
    const yearsOwned = dayjs().diff(dayjs(purchaseDate), 'year', true);
    const depreciation = 1 - asset.depreciationRate / 100;
    const currentValue = asset.purchaseCost * Math.pow(depreciation, yearsOwned);

    return Math.max(0, currentValue);
  };

  if (loading) {
    return (
      <Box>
        <Skeleton variant="text" width={200} height={40} sx={{ mb: 2 }} />
        <Grid container spacing={3}>
          <Grid size={{ xs: 12, lg: 8 }}>
            <Skeleton variant="rounded" height={300} />
          </Grid>
          <Grid size={{ xs: 12, lg: 4 }}>
            <Skeleton variant="rounded" height={200} />
          </Grid>
        </Grid>
      </Box>
    );
  }

  if (error || !asset) {
    return (
      <Box>
        <Alert severity="error" sx={{ mb: 2 }}>
          {error || 'Asset not found'}
        </Alert>
        <Button startIcon={<BackIcon />} onClick={() => navigate('/assets')}>
          Back to Assets
        </Button>
      </Box>
    );
  }

  return (
    <Box>
      {/* Header */}
      <Box
        sx={{
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'flex-start',
          mb: 3,
          flexWrap: 'wrap',
          gap: 2,
        }}
      >
        <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
          <IconButton onClick={() => navigate('/assets')}>
            <BackIcon />
          </IconButton>
          <Box>
            <Typography variant="h5" fontWeight={600}>
              {asset.name}
            </Typography>
            <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, mt: 0.5 }}>
              <Typography variant="body2" color="text.secondary">
                {asset.serialNumber}
              </Typography>
              <Chip
                label={ASSET_STATUS_LABELS[asset.status as AssetStatus]}
                color={ASSET_STATUS_COLORS[asset.status as AssetStatus]}
                size="small"
              />
            </Box>
          </Box>
        </Box>

        <Box sx={{ display: 'flex', gap: 1 }}>
          <Button
            variant="outlined"
            startIcon={<MaintenanceIcon />}
            onClick={() => navigate(`/maintenance/new?assetId=${id}`)}
          >
            Log Maintenance
          </Button>
          <Button
            variant="outlined"
            startIcon={<EditIcon />}
            onClick={() => navigate(`/assets/${id}/edit`)}
          >
            Edit
          </Button>
          <Button
            variant="outlined"
            color="error"
            startIcon={<DeleteIcon />}
            onClick={() => setDeleteDialogOpen(true)}
          >
            Delete
          </Button>
        </Box>
      </Box>

      <Grid container spacing={3}>
        {/* Main Content */}
        <Grid size={{ xs: 12, lg: 8 }}>
          <Card>
            <CardContent sx={{ p: 0 }}>
              <Tabs
                value={tabValue}
                onChange={(_, v) => setTabValue(v)}
                sx={{ borderBottom: 1, borderColor: 'divider', px: 2 }}
              >
                <Tab label="Overview" />
                <Tab label="Specifications" />
                <Tab label="Maintenance History" />
              </Tabs>

              <Box sx={{ p: 3 }}>
                <TabPanel value={tabValue} index={0}>
                  <Grid container spacing={3}>
                    <Grid size={{ xs: 12, md: 6 }}>
                      <Typography
                        variant="overline"
                        color="text.secondary"
                        display="block"
                      >
                        Basic Information
                      </Typography>
                      <Table size="small">
                        <TableBody>
                          <TableRow>
                            <TableCell sx={{ border: 0, pl: 0, py: 1 }}>
                              Type
                            </TableCell>
                            <TableCell sx={{ border: 0, py: 1 }}>
                              {ASSET_TYPE_LABELS[asset.type as AssetType]}
                            </TableCell>
                          </TableRow>
                          <TableRow>
                            <TableCell sx={{ border: 0, pl: 0, py: 1 }}>
                              Location
                            </TableCell>
                            <TableCell sx={{ border: 0, py: 1 }}>
                              {asset.location}
                            </TableCell>
                          </TableRow>
                          <TableRow>
                            <TableCell sx={{ border: 0, pl: 0, py: 1 }}>
                              Manufacturer
                            </TableCell>
                            <TableCell sx={{ border: 0, py: 1 }}>
                              {asset.manufacturer}
                            </TableCell>
                          </TableRow>
                          <TableRow>
                            <TableCell sx={{ border: 0, pl: 0, py: 1 }}>
                              Model
                            </TableCell>
                            <TableCell sx={{ border: 0, py: 1 }}>
                              {asset.model}
                            </TableCell>
                          </TableRow>
                        </TableBody>
                      </Table>
                    </Grid>

                    <Grid size={{ xs: 12, md: 6 }}>
                      <Typography
                        variant="overline"
                        color="text.secondary"
                        display="block"
                      >
                        Purchase Information
                      </Typography>
                      <Table size="small">
                        <TableBody>
                          <TableRow>
                            <TableCell sx={{ border: 0, pl: 0, py: 1 }}>
                              Purchase Date
                            </TableCell>
                            <TableCell sx={{ border: 0, py: 1 }}>
                              {dayjs(
                                (asset.purchaseDate as Timestamp).toDate()
                              ).format('MMMM D, YYYY')}
                            </TableCell>
                          </TableRow>
                          <TableRow>
                            <TableCell sx={{ border: 0, pl: 0, py: 1 }}>
                              Purchase Cost
                            </TableCell>
                            <TableCell sx={{ border: 0, py: 1 }}>
                              ${asset.purchaseCost.toLocaleString()}
                            </TableCell>
                          </TableRow>
                          <TableRow>
                            <TableCell sx={{ border: 0, pl: 0, py: 1 }}>
                              Warranty Expiry
                            </TableCell>
                            <TableCell sx={{ border: 0, py: 1 }}>
                              {asset.warrantyExpiry
                                ? dayjs(
                                    (asset.warrantyExpiry as Timestamp).toDate()
                                  ).format('MMMM D, YYYY')
                                : 'N/A'}
                            </TableCell>
                          </TableRow>
                        </TableBody>
                      </Table>
                    </Grid>
                  </Grid>
                </TabPanel>

                <TabPanel value={tabValue} index={1}>
                  {Object.keys(asset.specifications).length === 0 ? (
                    <Typography color="text.secondary">
                      No specifications recorded
                    </Typography>
                  ) : (
                    <Table size="small">
                      <TableBody>
                        {Object.entries(asset.specifications).map(
                          ([key, value]) => (
                            <TableRow key={key}>
                              <TableCell
                                sx={{ border: 0, pl: 0, py: 1, fontWeight: 500 }}
                              >
                                {key}
                              </TableCell>
                              <TableCell sx={{ border: 0, py: 1 }}>
                                {value}
                              </TableCell>
                            </TableRow>
                          )
                        )}
                      </TableBody>
                    </Table>
                  )}
                </TabPanel>

                <TabPanel value={tabValue} index={2}>
                  {maintenanceRecords.length === 0 ? (
                    <Box sx={{ textAlign: 'center', py: 4 }}>
                      <MaintenanceIcon
                        sx={{ fontSize: 48, color: 'text.secondary', mb: 1 }}
                      />
                      <Typography color="text.secondary">
                        No maintenance records yet
                      </Typography>
                      <Button
                        variant="contained"
                        startIcon={<MaintenanceIcon />}
                        sx={{ mt: 2 }}
                        onClick={() => navigate(`/maintenance/new?assetId=${id}`)}
                      >
                        Log First Maintenance
                      </Button>
                    </Box>
                  ) : (
                    <Box>
                      {maintenanceRecords.map((record) => (
                        <Box
                          key={record.id}
                          sx={{
                            p: 2,
                            mb: 2,
                            border: '1px solid',
                            borderColor: 'divider',
                            borderRadius: 2,
                          }}
                        >
                          <Box
                            sx={{
                              display: 'flex',
                              justifyContent: 'space-between',
                              alignItems: 'flex-start',
                              mb: 1,
                            }}
                          >
                            <Typography variant="subtitle2">
                              {record.description}
                            </Typography>
                            <Chip
                              label={
                                MAINTENANCE_STATUS_LABELS[
                                  record.status as MaintenanceStatus
                                ]
                              }
                              color={
                                MAINTENANCE_STATUS_COLORS[
                                  record.status as MaintenanceStatus
                                ]
                              }
                              size="small"
                            />
                          </Box>
                          <Typography variant="body2" color="text.secondary">
                            {dayjs(
                              (record.scheduledDate as Timestamp).toDate()
                            ).format('MMM D, YYYY')}{' '}
                            • {record.technician}
                            {record.cost > 0 && ` • $${record.cost.toLocaleString()}`}
                          </Typography>
                          {record.notes && (
                            <Typography
                              variant="body2"
                              sx={{ mt: 1, fontStyle: 'italic' }}
                            >
                              {record.notes}
                            </Typography>
                          )}
                        </Box>
                      ))}
                    </Box>
                  )}
                </TabPanel>
              </Box>
            </CardContent>
          </Card>
        </Grid>

        {/* Sidebar */}
        <Grid size={{ xs: 12, lg: 4 }}>
          {/* Value Card */}
          <Card sx={{ mb: 3 }}>
            <CardHeader title="Asset Value" />
            <CardContent>
              <Box sx={{ mb: 2 }}>
                <Typography variant="overline" color="text.secondary">
                  Purchase Value
                </Typography>
                <Typography variant="h5" fontWeight={600}>
                  ${asset.purchaseCost.toLocaleString()}
                </Typography>
              </Box>
              <Divider sx={{ my: 2 }} />
              <Box>
                <Typography variant="overline" color="text.secondary">
                  Current Value
                </Typography>
                <Typography variant="h5" fontWeight={600} color="primary.main">
                  ${calculateCurrentValue().toLocaleString(undefined, {
                    minimumFractionDigits: 0,
                    maximumFractionDigits: 0,
                  })}
                </Typography>
                <Typography variant="caption" color="text.secondary">
                  Based on {asset.depreciationRate}% annual depreciation
                </Typography>
              </Box>
            </CardContent>
          </Card>

          {/* Quick Info */}
          <Card>
            <CardHeader title="Quick Info" />
            <CardContent>
              <Box sx={{ display: 'flex', flexDirection: 'column', gap: 1.5 }}>
                <Box>
                  <Typography variant="caption" color="text.secondary">
                    Created
                  </Typography>
                  <Typography variant="body2">
                    {dayjs((asset.createdAt as Timestamp).toDate()).format(
                      'MMMM D, YYYY'
                    )}
                  </Typography>
                </Box>
                <Box>
                  <Typography variant="caption" color="text.secondary">
                    Last Updated
                  </Typography>
                  <Typography variant="body2">
                    {dayjs((asset.updatedAt as Timestamp).toDate()).format(
                      'MMMM D, YYYY'
                    )}
                  </Typography>
                </Box>
                <Box>
                  <Typography variant="caption" color="text.secondary">
                    Maintenance Records
                  </Typography>
                  <Typography variant="body2">
                    {maintenanceRecords.length} total
                  </Typography>
                </Box>
              </Box>
            </CardContent>
          </Card>
        </Grid>
      </Grid>

      {/* Delete Confirmation Dialog */}
      <Dialog open={deleteDialogOpen} onClose={() => setDeleteDialogOpen(false)}>
        <DialogTitle>Delete Asset</DialogTitle>
        <DialogContent>
          <Typography>
            Are you sure you want to delete "{asset.name}"? This action cannot be
            undone.
          </Typography>
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setDeleteDialogOpen(false)}>Cancel</Button>
          <Button onClick={handleDelete} color="error" variant="contained">
            Delete
          </Button>
        </DialogActions>
      </Dialog>
    </Box>
  );
}

export default AssetDetail;
