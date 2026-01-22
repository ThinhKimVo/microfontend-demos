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
  Avatar,
  IconButton,
  Divider,
} from '@mui/material'
import Grid from '@mui/material/Grid2'
import {
  Layers as FloorIcon,
  Inventory2 as AssetIcon,
  Assignment as WorkOrderIcon,
  Person as PersonIcon,
  Phone as PhoneIcon,
  Email as EmailIcon,
  LocationOn as LocationIcon,
  CalendarToday as CalendarIcon,
  ArrowForward as ArrowIcon,
} from '@mui/icons-material'
import { PageHeader, StatCard, StatusChip } from '../../components/common'
import { getBuildingById, getClientById, getFloorsByBuilding, getWorkOrdersByBuilding, getAssetsByBuilding } from '../../data'
import { formatArea } from '../../utils/formatters'

const BuildingDetail: React.FC = () => {
  const { buildingId } = useParams<{ buildingId: string }>()
  const navigate = useNavigate()

  const building = getBuildingById(buildingId || '')
  const client = building ? getClientById(building.clientId) : null
  const floors = building ? getFloorsByBuilding(building.id) : []
  const workOrders = building ? getWorkOrdersByBuilding(building.id) : []
  const assets = building ? getAssetsByBuilding(building.id) : []

  if (!building) {
    return (
      <Box sx={{ textAlign: 'center', py: 8 }}>
        <Typography variant="h6" color="text.secondary">
          Building not found
        </Typography>
      </Box>
    )
  }

  const openWorkOrders = workOrders.filter(wo =>
    !['Completed', 'Closed', 'Cancelled'].includes(wo.status)
  ).length

  // Sort floors by floor number
  const sortedFloors = [...floors].sort((a, b) => a.floorNumber - b.floorNumber)

  return (
    <Box>
      <PageHeader
        title={building.name}
        subtitle={building.code}
        breadcrumbs={[
          { label: 'Facilities', path: '/facilities' },
          { label: building.name },
        ]}
        action={{
          label: 'Edit Building',
          onClick: () => console.log('Edit building'),
        }}
      />

      {/* Stats */}
      <Grid container spacing={3} sx={{ mb: 3 }}>
        <Grid size={{ xs: 6, md: 3 }}>
          <StatCard
            title="Total Floors"
            value={building.totalFloors + building.basementFloors}
            icon={<FloorIcon />}
            color="#2196f3"
          />
        </Grid>
        <Grid size={{ xs: 6, md: 3 }}>
          <StatCard
            title="Total Assets"
            value={assets.length}
            icon={<AssetIcon />}
            color="#9c27b0"
            onClick={() => navigate(`/assets?building=${buildingId}`)}
          />
        </Grid>
        <Grid size={{ xs: 6, md: 3 }}>
          <StatCard
            title="Open Work Orders"
            value={openWorkOrders}
            icon={<WorkOrderIcon />}
            color="#1976d2"
            onClick={() => navigate(`/work-orders?building=${buildingId}`)}
          />
        </Grid>
        <Grid size={{ xs: 6, md: 3 }}>
          <StatCard
            title="Total Area"
            value={formatArea(building.totalArea)}
            icon={<LocationIcon />}
            color="#4caf50"
          />
        </Grid>
      </Grid>

      <Grid container spacing={3}>
        {/* Building Info */}
        <Grid size={{ xs: 12, md: 4 }}>
          <Card>
            <CardContent>
              <Typography variant="h6" fontWeight={600} gutterBottom>
                Building Information
              </Typography>
              <Divider sx={{ my: 2 }} />

              <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2 }}>
                <Box>
                  <Typography variant="caption" color="text.secondary">
                    Status
                  </Typography>
                  <Box sx={{ mt: 0.5 }}>
                    <StatusChip status={building.status} type="building" />
                  </Box>
                </Box>

                <Box>
                  <Typography variant="caption" color="text.secondary">
                    Building Type
                  </Typography>
                  <Typography variant="body2">{building.buildingType}</Typography>
                </Box>

                <Box>
                  <Typography variant="caption" color="text.secondary">
                    Client
                  </Typography>
                  <Typography variant="body2">{client?.name || '-'}</Typography>
                </Box>

                <Box>
                  <Typography variant="caption" color="text.secondary">
                    Address
                  </Typography>
                  <Box sx={{ display: 'flex', alignItems: 'flex-start', gap: 0.5, mt: 0.5 }}>
                    <LocationIcon sx={{ fontSize: 16, color: 'text.secondary', mt: 0.25 }} />
                    <Typography variant="body2">
                      {building.address.street}, {building.address.district}, {building.address.city}
                    </Typography>
                  </Box>
                </Box>

                <Box>
                  <Typography variant="caption" color="text.secondary">
                    Year Built
                  </Typography>
                  <Box sx={{ display: 'flex', alignItems: 'center', gap: 0.5, mt: 0.5 }}>
                    <CalendarIcon sx={{ fontSize: 16, color: 'text.secondary' }} />
                    <Typography variant="body2">{building.yearBuilt}</Typography>
                  </Box>
                </Box>

                <Divider />

                <Box>
                  <Typography variant="subtitle2" gutterBottom>
                    Primary Contact
                  </Typography>
                  <Box sx={{ display: 'flex', flexDirection: 'column', gap: 1 }}>
                    <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                      <Avatar sx={{ width: 32, height: 32, bgcolor: 'primary.light' }}>
                        <PersonIcon sx={{ fontSize: 18 }} />
                      </Avatar>
                      <Typography variant="body2">{building.primaryContact.name}</Typography>
                    </Box>
                    <Box sx={{ display: 'flex', alignItems: 'center', gap: 0.5, pl: 5 }}>
                      <PhoneIcon sx={{ fontSize: 14, color: 'text.secondary' }} />
                      <Typography variant="body2" color="text.secondary">
                        {building.primaryContact.phone}
                      </Typography>
                    </Box>
                    <Box sx={{ display: 'flex', alignItems: 'center', gap: 0.5, pl: 5 }}>
                      <EmailIcon sx={{ fontSize: 14, color: 'text.secondary' }} />
                      <Typography variant="body2" color="text.secondary">
                        {building.primaryContact.email}
                      </Typography>
                    </Box>
                  </Box>
                </Box>
              </Box>
            </CardContent>
          </Card>
        </Grid>

        {/* Floors List */}
        <Grid size={{ xs: 12, md: 8 }}>
          <Card>
            <CardContent>
              <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 2 }}>
                <Typography variant="h6" fontWeight={600}>
                  Floors ({floors.length})
                </Typography>
              </Box>
              <Divider sx={{ mb: 2 }} />

              <TableContainer>
                <Table>
                  <TableHead>
                    <TableRow>
                      <TableCell>Floor</TableCell>
                      <TableCell>Type</TableCell>
                      <TableCell align="center">Assets</TableCell>
                      <TableCell align="center">Open WOs</TableCell>
                      <TableCell>Status</TableCell>
                      <TableCell align="right">Actions</TableCell>
                    </TableRow>
                  </TableHead>
                  <TableBody>
                    {sortedFloors.map((floor) => (
                      <TableRow
                        key={floor.id}
                        hover
                        sx={{ cursor: 'pointer' }}
                        onClick={() => navigate(`/facilities/${buildingId}/floors/${floor.id}`)}
                      >
                        <TableCell>
                          <Box>
                            <Typography variant="body2" fontWeight={500}>
                              {floor.floorName}
                            </Typography>
                            <Typography variant="caption" color="text.secondary">
                              {formatArea(floor.floorArea)}
                            </Typography>
                          </Box>
                        </TableCell>
                        <TableCell>
                          <Chip
                            label={floor.floorType}
                            size="small"
                            variant="outlined"
                          />
                        </TableCell>
                        <TableCell align="center">
                          <Typography variant="body2" fontWeight={500}>
                            {floor.assetCount || 0}
                          </Typography>
                        </TableCell>
                        <TableCell align="center">
                          <Typography
                            variant="body2"
                            fontWeight={500}
                            color={floor.openWorkOrders && floor.openWorkOrders > 0 ? 'primary.main' : 'text.primary'}
                          >
                            {floor.openWorkOrders || 0}
                          </Typography>
                        </TableCell>
                        <TableCell>
                          <StatusChip status={floor.status} type="building" size="small" />
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

              {floors.length === 0 && (
                <Box sx={{ textAlign: 'center', py: 4 }}>
                  <Typography variant="body2" color="text.secondary">
                    No floors registered for this building
                  </Typography>
                </Box>
              )}
            </CardContent>
          </Card>
        </Grid>
      </Grid>
    </Box>
  )
}

export default BuildingDetail
