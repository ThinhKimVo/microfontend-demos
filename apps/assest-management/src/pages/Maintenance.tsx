import React, { useEffect, useState, useMemo } from 'react';
import { useNavigate, useSearchParams } from 'react-router-dom';
import {
  Box,
  Button,
  Card,
  CardContent,
  TextField,
  InputAdornment,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  Chip,
  IconButton,
  Menu,
  ListItemIcon,
  ListItemText,
  Typography,
  Skeleton,
  Alert,
  Tabs,
  Tab,
} from '@mui/material';
import { DataGrid, GridColDef, GridRenderCellParams } from '@mui/x-data-grid';
import {
  Add as AddIcon,
  Search as SearchIcon,
  MoreVert as MoreIcon,
  Visibility as ViewIcon,
  Edit as EditIcon,
  Delete as DeleteIcon,
  CheckCircle as CompleteIcon,
  FilterList as FilterIcon,
} from '@mui/icons-material';
import { maintenanceService } from '../services/maintenanceService';
import { assetService } from '../services/assetService';
import {
  MaintenanceRecord,
  MaintenanceStatus,
  MaintenanceType,
  MAINTENANCE_STATUS_LABELS,
  MAINTENANCE_STATUS_COLORS,
  MAINTENANCE_TYPE_LABELS,
  Asset,
} from '../types';
import { Timestamp } from 'firebase/firestore';
import dayjs from 'dayjs';

function Maintenance() {
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const [records, setRecords] = useState<MaintenanceRecord[]>([]);
  const [assets, setAssets] = useState<Record<string, Asset>>({});
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [search, setSearch] = useState('');
  const [typeFilter, setTypeFilter] = useState<MaintenanceType | ''>('');
  const [statusFilter, setStatusFilter] = useState<MaintenanceStatus | ''>(
    (searchParams.get('status') as MaintenanceStatus) || ''
  );
  const [tabValue, setTabValue] = useState(0);
  const [anchorEl, setAnchorEl] = useState<null | HTMLElement>(null);
  const [selectedRecordId, setSelectedRecordId] = useState<string | null>(null);

  useEffect(() => {
    loadData();
  }, []);

  const loadData = async () => {
    try {
      setLoading(true);
      setError(null);

      const [recordsData, assetsData] = await Promise.all([
        maintenanceService.getAllRecords(),
        assetService.getAll(),
      ]);

      // Create asset lookup map
      const assetMap = assetsData.reduce(
        (acc, asset) => {
          acc[asset.id] = asset;
          return acc;
        },
        {} as Record<string, Asset>
      );

      // Add asset names to records
      const recordsWithAssetNames = recordsData.map((record) => ({
        ...record,
        assetName: assetMap[record.assetId]?.name || 'Unknown Asset',
      }));

      setRecords(recordsWithAssetNames);
      setAssets(assetMap);
    } catch (err) {
      setError('Failed to load maintenance records. Please try again.');
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const handleMenuOpen = (event: React.MouseEvent<HTMLElement>, recordId: string) => {
    event.stopPropagation();
    setAnchorEl(event.currentTarget);
    setSelectedRecordId(recordId);
  };

  const handleMenuClose = () => {
    setAnchorEl(null);
    setSelectedRecordId(null);
  };

  const handleComplete = async () => {
    if (!selectedRecordId) return;

    try {
      await maintenanceService.completeRecord(selectedRecordId);
      loadData();
    } catch (err) {
      console.error(err);
      alert('Failed to complete record');
    }
    handleMenuClose();
  };

  const handleDelete = async () => {
    if (!selectedRecordId) return;

    if (window.confirm('Are you sure you want to delete this maintenance record?')) {
      try {
        await maintenanceService.deleteRecord(selectedRecordId);
        setRecords(records.filter((r) => r.id !== selectedRecordId));
      } catch (err) {
        console.error(err);
        alert('Failed to delete record');
      }
    }
    handleMenuClose();
  };

  const filteredRecords = useMemo(() => {
    let filtered = records;

    // Filter by tab
    if (tabValue === 1) {
      filtered = filtered.filter((r) => r.status === 'pending' || r.status === 'in_progress');
    } else if (tabValue === 2) {
      filtered = filtered.filter((r) => r.status === 'completed');
    } else if (tabValue === 3) {
      filtered = filtered.filter((r) => r.status === 'overdue');
    }

    // Apply other filters
    return filtered.filter((record) => {
      const matchesSearch =
        !search ||
        record.description.toLowerCase().includes(search.toLowerCase()) ||
        record.technician.toLowerCase().includes(search.toLowerCase()) ||
        record.assetName?.toLowerCase().includes(search.toLowerCase());

      const matchesType = !typeFilter || record.type === typeFilter;
      const matchesStatus = !statusFilter || record.status === statusFilter;

      return matchesSearch && matchesType && matchesStatus;
    });
  }, [records, search, typeFilter, statusFilter, tabValue]);

  const columns: GridColDef[] = [
    {
      field: 'assetName',
      headerName: 'Asset',
      flex: 1,
      minWidth: 150,
      renderCell: (params: GridRenderCellParams) => (
        <Typography variant="body2" fontWeight={500}>
          {params.row.assetName}
        </Typography>
      ),
    },
    {
      field: 'description',
      headerName: 'Description',
      flex: 1.5,
      minWidth: 200,
    },
    {
      field: 'type',
      headerName: 'Type',
      width: 140,
      renderCell: (params: GridRenderCellParams) => (
        <Typography variant="body2">
          {MAINTENANCE_TYPE_LABELS[params.row.type as MaintenanceType]}
        </Typography>
      ),
    },
    {
      field: 'status',
      headerName: 'Status',
      width: 130,
      renderCell: (params: GridRenderCellParams) => (
        <Chip
          label={MAINTENANCE_STATUS_LABELS[params.row.status as MaintenanceStatus]}
          color={MAINTENANCE_STATUS_COLORS[params.row.status as MaintenanceStatus]}
          size="small"
        />
      ),
    },
    {
      field: 'scheduledDate',
      headerName: 'Scheduled',
      width: 120,
      renderCell: (params: GridRenderCellParams) => (
        <Typography variant="body2">
          {dayjs((params.row.scheduledDate as Timestamp).toDate()).format('MMM D, YYYY')}
        </Typography>
      ),
    },
    {
      field: 'technician',
      headerName: 'Technician',
      width: 130,
    },
    {
      field: 'cost',
      headerName: 'Cost',
      width: 100,
      renderCell: (params: GridRenderCellParams) => (
        <Typography variant="body2">
          {params.row.cost > 0 ? `$${params.row.cost.toLocaleString()}` : '-'}
        </Typography>
      ),
    },
    {
      field: 'actions',
      headerName: '',
      width: 60,
      sortable: false,
      renderCell: (params: GridRenderCellParams) => (
        <IconButton
          size="small"
          onClick={(e) => handleMenuOpen(e, params.row.id)}
        >
          <MoreIcon />
        </IconButton>
      ),
    },
  ];

  const getTabCounts = () => {
    return {
      all: records.length,
      active: records.filter((r) => r.status === 'pending' || r.status === 'in_progress').length,
      completed: records.filter((r) => r.status === 'completed').length,
      overdue: records.filter((r) => r.status === 'overdue').length,
    };
  };

  const counts = getTabCounts();

  if (loading) {
    return (
      <Box>
        <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 3 }}>
          <Skeleton variant="rounded" width={300} height={40} />
          <Skeleton variant="rounded" width={160} height={40} />
        </Box>
        <Skeleton variant="rounded" height={400} />
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
          alignItems: 'center',
          mb: 3,
          flexWrap: 'wrap',
          gap: 2,
        }}
      >
        <Box sx={{ display: 'flex', gap: 2, flexWrap: 'wrap', flex: 1 }}>
          <TextField
            placeholder="Search maintenance..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            size="small"
            sx={{ minWidth: 250 }}
            InputProps={{
              startAdornment: (
                <InputAdornment position="start">
                  <SearchIcon color="action" />
                </InputAdornment>
              ),
            }}
          />

          <FormControl size="small" sx={{ minWidth: 150 }}>
            <InputLabel>Type</InputLabel>
            <Select
              value={typeFilter}
              label="Type"
              onChange={(e) => setTypeFilter(e.target.value as MaintenanceType | '')}
            >
              <MenuItem value="">All Types</MenuItem>
              {Object.entries(MAINTENANCE_TYPE_LABELS).map(([value, label]) => (
                <MenuItem key={value} value={value}>
                  {label}
                </MenuItem>
              ))}
            </Select>
          </FormControl>

          {(typeFilter || statusFilter) && (
            <Button
              variant="text"
              size="small"
              startIcon={<FilterIcon />}
              onClick={() => {
                setTypeFilter('');
                setStatusFilter('');
              }}
            >
              Clear
            </Button>
          )}
        </Box>

        <Button
          variant="contained"
          startIcon={<AddIcon />}
          onClick={() => navigate('/maintenance/new')}
        >
          Log Maintenance
        </Button>
      </Box>

      {error && (
        <Alert severity="error" sx={{ mb: 3 }} onClose={() => setError(null)}>
          {error}
        </Alert>
      )}

      {/* Tabs and Data Grid */}
      <Card>
        <Box sx={{ borderBottom: 1, borderColor: 'divider' }}>
          <Tabs value={tabValue} onChange={(_, v) => setTabValue(v)}>
            <Tab label={`All (${counts.all})`} />
            <Tab label={`Active (${counts.active})`} />
            <Tab label={`Completed (${counts.completed})`} />
            <Tab
              label={
                <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                  Overdue
                  {counts.overdue > 0 && (
                    <Chip label={counts.overdue} color="error" size="small" />
                  )}
                </Box>
              }
            />
          </Tabs>
        </Box>
        <CardContent sx={{ p: 0 }}>
          <DataGrid
            rows={filteredRecords}
            columns={columns}
            initialState={{
              pagination: {
                paginationModel: { pageSize: 10 },
              },
            }}
            pageSizeOptions={[10, 25, 50]}
            disableRowSelectionOnClick
            onRowClick={(params) => navigate(`/assets/${params.row.assetId}`)}
            sx={{
              border: 'none',
              '& .MuiDataGrid-row': {
                cursor: 'pointer',
              },
              '& .MuiDataGrid-cell:focus': {
                outline: 'none',
              },
            }}
            autoHeight
          />
        </CardContent>
      </Card>

      {/* Actions Menu */}
      <Menu
        anchorEl={anchorEl}
        open={Boolean(anchorEl)}
        onClose={handleMenuClose}
        anchorOrigin={{ vertical: 'bottom', horizontal: 'right' }}
        transformOrigin={{ vertical: 'top', horizontal: 'right' }}
      >
        <MenuItem
          onClick={() => {
            const record = records.find((r) => r.id === selectedRecordId);
            if (record) {
              navigate(`/assets/${record.assetId}`);
            }
            handleMenuClose();
          }}
        >
          <ListItemIcon>
            <ViewIcon fontSize="small" />
          </ListItemIcon>
          <ListItemText>View Asset</ListItemText>
        </MenuItem>
        {records.find((r) => r.id === selectedRecordId)?.status !== 'completed' && (
          <MenuItem onClick={handleComplete}>
            <ListItemIcon>
              <CompleteIcon fontSize="small" color="success" />
            </ListItemIcon>
            <ListItemText>Mark Complete</ListItemText>
          </MenuItem>
        )}
        <MenuItem onClick={handleDelete} sx={{ color: 'error.main' }}>
          <ListItemIcon>
            <DeleteIcon fontSize="small" color="error" />
          </ListItemIcon>
          <ListItemText>Delete</ListItemText>
        </MenuItem>
      </Menu>

      {/* Empty State */}
      {!loading && records.length === 0 && (
        <Box
          sx={{
            mt: 4,
            p: 4,
            textAlign: 'center',
            bgcolor: 'background.paper',
            borderRadius: 2,
            border: '1px dashed',
            borderColor: 'divider',
          }}
        >
          <Typography variant="h6" gutterBottom>
            No Maintenance Records
          </Typography>
          <Typography variant="body2" color="text.secondary" sx={{ mb: 3 }}>
            Start by logging your first maintenance activity.
          </Typography>
          <Button
            variant="contained"
            startIcon={<AddIcon />}
            onClick={() => navigate('/maintenance/new')}
          >
            Log Maintenance
          </Button>
        </Box>
      )}
    </Box>
  );
}

export default Maintenance;
