import React, { useState } from 'react'
import { useParams, useNavigate } from 'react-router-dom'
import {
  Box,
  Card,
  CardContent,
  Typography,
  Tabs,
  Tab,
  Chip,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
} from '@mui/material'
import Grid from '@mui/material/Grid2'
import {
  LocationOn as LocationIcon,
  Business as ManufacturerIcon,
  Timer as HoursIcon,
} from '@mui/icons-material'
import { PageHeader, StatusChip, MEPCategoryChip } from '../../components/common'
import { getAssetById, getBuildingById, getFloorById, getWorkOrdersByBuilding } from '../../data'
import { formatDate, formatCurrency } from '../../utils/formatters'

interface TabPanelProps {
  children?: React.ReactNode
  index: number
  value: number
}

const TabPanel: React.FC<TabPanelProps> = ({ children, value, index }) => (
  <div hidden={value !== index}>
    {value === index && <Box sx={{ py: 3 }}>{children}</Box>}
  </div>
)

const AssetDetail: React.FC = () => {
  const { assetId } = useParams<{ assetId: string }>()
  const navigate = useNavigate()
  const [tabValue, setTabValue] = useState(0)

  const asset = getAssetById(assetId || '')
  const building = asset ? getBuildingById(asset.buildingId) : null
  const floor = asset ? getFloorById(asset.floorId) : null

  // Get work orders for this asset
  const allWorkOrders = building ? getWorkOrdersByBuilding(building.id) : []
  const assetWorkOrders = allWorkOrders.filter(wo => wo.assetId === asset?.id)

  if (!asset) {
    return (
      <Box sx={{ textAlign: 'center', py: 8 }}>
        <Typography variant="h6" color="text.secondary">
          Asset not found
        </Typography>
      </Box>
    )
  }

  const InfoRow = ({ label, value }: { label: string; value: React.ReactNode }) => (
    <Box sx={{ display: 'flex', py: 1.5, borderBottom: '1px solid', borderColor: 'divider' }}>
      <Typography variant="body2" color="text.secondary" sx={{ width: 180, flexShrink: 0 }}>
        {label}
      </Typography>
      <Typography variant="body2" fontWeight={500}>
        {value || '-'}
      </Typography>
    </Box>
  )

  return (
    <Box>
      <PageHeader
        title={asset.name}
        subtitle={asset.assetTag}
        breadcrumbs={[
          { label: 'Assets', path: '/assets' },
          { label: asset.name },
        ]}
        action={{
          label: 'Edit Asset',
          onClick: () => console.log('Edit asset'),
        }}
      />

      {/* Header Card */}
      <Card sx={{ mb: 3 }}>
        <CardContent>
          <Grid container spacing={3} alignItems="center">
            <Grid size={{ xs: 12, md: 8 }}>
              <Box sx={{ display: 'flex', alignItems: 'center', gap: 2, mb: 2 }}>
                <MEPCategoryChip category={asset.mepCategory} />
                <Chip label={asset.assetType} variant="outlined" size="small" />
                <StatusChip status={asset.status} type="asset" />
                <Chip
                  label={asset.criticality}
                  size="small"
                  sx={{
                    bgcolor: asset.criticality === 'Critical' ? '#d32f2f15' :
                             asset.criticality === 'High' ? '#ed6c0215' :
                             asset.criticality === 'Medium' ? '#1976d215' : '#75757515',
                    color: asset.criticality === 'Critical' ? '#d32f2f' :
                           asset.criticality === 'High' ? '#ed6c02' :
                           asset.criticality === 'Medium' ? '#1976d2' : '#757575',
                  }}
                />
              </Box>
              <Typography variant="body2" color="text.secondary" sx={{ mb: 1 }}>
                {asset.description}
              </Typography>
              <Box sx={{ display: 'flex', gap: 3, flexWrap: 'wrap' }}>
                <Box sx={{ display: 'flex', alignItems: 'center', gap: 0.5 }}>
                  <LocationIcon sx={{ fontSize: 16, color: 'text.secondary' }} />
                  <Typography variant="body2" color="text.secondary">
                    {building?.name} / {floor?.floorName}
                  </Typography>
                </Box>
                <Box sx={{ display: 'flex', alignItems: 'center', gap: 0.5 }}>
                  <ManufacturerIcon sx={{ fontSize: 16, color: 'text.secondary' }} />
                  <Typography variant="body2" color="text.secondary">
                    {asset.manufacturer} - {asset.modelNumber}
                  </Typography>
                </Box>
                {asset.operatingHours && (
                  <Box sx={{ display: 'flex', alignItems: 'center', gap: 0.5 }}>
                    <HoursIcon sx={{ fontSize: 16, color: 'text.secondary' }} />
                    <Typography variant="body2" color="text.secondary">
                      {asset.operatingHours.toLocaleString()} hours
                    </Typography>
                  </Box>
                )}
              </Box>
            </Grid>
            <Grid size={{ xs: 12, md: 4 }}>
              <Box sx={{ display: 'flex', gap: 2, justifyContent: { xs: 'flex-start', md: 'flex-end' } }}>
                <Box sx={{ textAlign: 'center', p: 2, bgcolor: 'background.default', borderRadius: 2 }}>
                  <Typography variant="h4" fontWeight={700} color="primary.main">
                    {assetWorkOrders.length}
                  </Typography>
                  <Typography variant="caption" color="text.secondary">
                    Work Orders
                  </Typography>
                </Box>
              </Box>
            </Grid>
          </Grid>
        </CardContent>
      </Card>

      {/* Tabs */}
      <Card>
        <Tabs
          value={tabValue}
          onChange={(_, newValue) => setTabValue(newValue)}
          sx={{ borderBottom: 1, borderColor: 'divider', px: 2 }}
        >
          <Tab label="Overview" />
          <Tab label="Specifications" />
          <Tab label="Maintenance History" />
          <Tab label="Documents" />
        </Tabs>

        <CardContent>
          {/* Overview Tab */}
          <TabPanel value={tabValue} index={0}>
            <Grid container spacing={3}>
              <Grid size={{ xs: 12, md: 6 }}>
                <Typography variant="subtitle2" color="text.secondary" gutterBottom>
                  General Information
                </Typography>
                <InfoRow label="Asset ID" value={asset.id} />
                <InfoRow label="Asset Tag" value={asset.assetTag} />
                <InfoRow label="Serial Number" value={asset.serialNumber} />
                <InfoRow label="Manufacturer" value={asset.manufacturer} />
                <InfoRow label="Model" value={asset.modelNumber} />
              </Grid>
              <Grid size={{ xs: 12, md: 6 }}>
                <Typography variant="subtitle2" color="text.secondary" gutterBottom>
                  Location
                </Typography>
                <InfoRow label="Building" value={building?.name} />
                <InfoRow label="Floor" value={floor?.floorName} />
                <InfoRow label="Location Description" value={asset.locationDescription} />
              </Grid>
              <Grid size={{ xs: 12, md: 6 }}>
                <Typography variant="subtitle2" color="text.secondary" gutterBottom>
                  Financial Information
                </Typography>
                <InfoRow label="Purchase Date" value={formatDate(asset.purchaseDate)} />
                <InfoRow label="Purchase Cost" value={formatCurrency(asset.purchaseCost)} />
                <InfoRow label="Warranty Start" value={formatDate(asset.warrantyStartDate)} />
                <InfoRow label="Warranty End" value={formatDate(asset.warrantyEndDate)} />
              </Grid>
              <Grid size={{ xs: 12, md: 6 }}>
                <Typography variant="subtitle2" color="text.secondary" gutterBottom>
                  Operational Information
                </Typography>
                <InfoRow label="Installation Date" value={formatDate(asset.installationDate)} />
                <InfoRow label="Commission Date" value={formatDate(asset.commissionDate)} />
                <InfoRow label="Expected Lifespan" value={`${asset.expectedLifespan} years`} />
                <InfoRow label="Operating Hours" value={asset.operatingHours?.toLocaleString()} />
              </Grid>
            </Grid>
          </TabPanel>

          {/* Specifications Tab */}
          <TabPanel value={tabValue} index={1}>
            <Grid container spacing={3}>
              <Grid size={{ xs: 12, md: 6 }}>
                <Typography variant="subtitle2" color="text.secondary" gutterBottom>
                  Technical Specifications
                </Typography>
                {asset.capacity && <InfoRow label="Capacity" value={asset.capacity} />}
                {asset.powerRating && <InfoRow label="Power Rating" value={asset.powerRating} />}
                {asset.voltage && <InfoRow label="Voltage" value={asset.voltage} />}
                {asset.refrigerantType && <InfoRow label="Refrigerant Type" value={asset.refrigerantType} />}
              </Grid>
            </Grid>
          </TabPanel>

          {/* Maintenance History Tab */}
          <TabPanel value={tabValue} index={2}>
            <TableContainer>
              <Table>
                <TableHead>
                  <TableRow>
                    <TableCell>Work Order</TableCell>
                    <TableCell>Type</TableCell>
                    <TableCell>Description</TableCell>
                    <TableCell>Date</TableCell>
                    <TableCell>Status</TableCell>
                  </TableRow>
                </TableHead>
                <TableBody>
                  {assetWorkOrders.map((wo) => (
                    <TableRow
                      key={wo.id}
                      hover
                      sx={{ cursor: 'pointer' }}
                      onClick={() => navigate(`/work-orders/${wo.id}`)}
                    >
                      <TableCell>
                        <Typography variant="body2" fontWeight={500}>
                          {wo.workOrderNumber}
                        </Typography>
                      </TableCell>
                      <TableCell>
                        <Chip label={wo.workOrderType} size="small" variant="outlined" />
                      </TableCell>
                      <TableCell>{wo.title}</TableCell>
                      <TableCell>{formatDate(wo.createdDate)}</TableCell>
                      <TableCell>
                        <StatusChip status={wo.status} type="workOrder" size="small" />
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </TableContainer>
            {assetWorkOrders.length === 0 && (
              <Box sx={{ textAlign: 'center', py: 4 }}>
                <Typography variant="body2" color="text.secondary">
                  No maintenance history available
                </Typography>
              </Box>
            )}
          </TabPanel>

          {/* Documents Tab */}
          <TabPanel value={tabValue} index={3}>
            <Box sx={{ textAlign: 'center', py: 4 }}>
              <Typography variant="body2" color="text.secondary">
                No documents uploaded
              </Typography>
            </Box>
          </TabPanel>
        </CardContent>
      </Card>
    </Box>
  )
}

export default AssetDetail
