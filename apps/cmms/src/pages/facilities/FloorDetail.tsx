import React from 'react'
import { useParams, useNavigate } from 'react-router-dom'
import {
  Box,
  Card,
  CardContent,
  Typography,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Chip,
  Divider,
  IconButton,
} from '@mui/material'
import Grid from '@mui/material/Grid2'
import {
  Inventory2 as AssetIcon,
  Assignment as WorkOrderIcon,
  SquareFoot as AreaIcon,
  ArrowForward as ArrowIcon,
} from '@mui/icons-material'
import { PageHeader, StatCard, StatusChip, MEPCategoryChip } from '../../components/common'
import { getFloorById, getBuildingById, getAssetsByFloor } from '../../data'
import { formatArea } from '../../utils/formatters'

const FloorDetail: React.FC = () => {
  const { buildingId, floorId } = useParams<{ buildingId: string; floorId: string }>()
  const navigate = useNavigate()

  const floor = getFloorById(floorId || '')
  const building = floor ? getBuildingById(floor.buildingId) : null
  const assets = floor ? getAssetsByFloor(floor.id) : []

  if (!floor || !building) {
    return (
      <Box sx={{ textAlign: 'center', py: 8 }}>
        <Typography variant="h6" color="text.secondary">
          Floor not found
        </Typography>
      </Box>
    )
  }

  return (
    <Box>
      <PageHeader
        title={floor.floorName}
        subtitle={`${building.name} - ${floor.description}`}
        breadcrumbs={[
          { label: 'Facilities', path: '/facilities' },
          { label: building.name, path: `/facilities/${buildingId}` },
          { label: floor.floorName },
        ]}
      />

      {/* Stats */}
      <Grid container spacing={3} sx={{ mb: 3 }}>
        <Grid size={{ xs: 6, md: 3 }}>
          <StatCard
            title="Total Assets"
            value={assets.length}
            icon={<AssetIcon />}
            color="#9c27b0"
          />
        </Grid>
        <Grid size={{ xs: 6, md: 3 }}>
          <StatCard
            title="Open Work Orders"
            value={floor.openWorkOrders || 0}
            icon={<WorkOrderIcon />}
            color="#1976d2"
          />
        </Grid>
        <Grid size={{ xs: 6, md: 3 }}>
          <StatCard
            title="Floor Area"
            value={formatArea(floor.floorArea)}
            icon={<AreaIcon />}
            color="#4caf50"
          />
        </Grid>
        <Grid size={{ xs: 6, md: 3 }}>
          <Card>
            <CardContent sx={{ p: 2, '&:last-child': { pb: 2 } }}>
              <Typography variant="body2" color="text.secondary" gutterBottom>
                Status
              </Typography>
              <StatusChip status={floor.status} type="building" />
              <Box sx={{ mt: 1 }}>
                <Chip label={floor.floorType} size="small" variant="outlined" />
              </Box>
            </CardContent>
          </Card>
        </Grid>
      </Grid>

      {/* Assets on this floor */}
      <Card>
        <CardContent>
          <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 2 }}>
            <Typography variant="h6" fontWeight={600}>
              Assets on this Floor ({assets.length})
            </Typography>
          </Box>
          <Divider sx={{ mb: 2 }} />

          <TableContainer>
            <Table>
              <TableHead>
                <TableRow>
                  <TableCell>Asset</TableCell>
                  <TableCell>Category</TableCell>
                  <TableCell>Type</TableCell>
                  <TableCell>Criticality</TableCell>
                  <TableCell>Status</TableCell>
                  <TableCell align="right">Actions</TableCell>
                </TableRow>
              </TableHead>
              <TableBody>
                {assets.map((asset) => (
                  <TableRow
                    key={asset.id}
                    hover
                    sx={{ cursor: 'pointer' }}
                    onClick={() => navigate(`/assets/${asset.id}`)}
                  >
                    <TableCell>
                      <Box>
                        <Typography variant="body2" fontWeight={500}>
                          {asset.name}
                        </Typography>
                        <Typography variant="caption" color="text.secondary">
                          {asset.assetTag}
                        </Typography>
                      </Box>
                    </TableCell>
                    <TableCell>
                      <MEPCategoryChip category={asset.mepCategory} />
                    </TableCell>
                    <TableCell>
                      <Typography variant="body2">{asset.assetType}</Typography>
                    </TableCell>
                    <TableCell>
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
                    </TableCell>
                    <TableCell>
                      <StatusChip status={asset.status} type="asset" size="small" />
                    </TableCell>
                    <TableCell align="right">
                      <IconButton size="small">
                        <ArrowIcon />
                      </IconButton>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </TableContainer>

          {assets.length === 0 && (
            <Box sx={{ textAlign: 'center', py: 4 }}>
              <Typography variant="body2" color="text.secondary">
                No assets registered on this floor
              </Typography>
            </Box>
          )}
        </CardContent>
      </Card>
    </Box>
  )
}

export default FloorDetail
