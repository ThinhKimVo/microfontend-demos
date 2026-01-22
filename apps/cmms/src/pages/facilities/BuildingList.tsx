import React, { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import {
  Box,
  Card,
  CardContent,
  CardActionArea,
  Typography,
  Chip,
  Avatar,
} from '@mui/material'
import Grid from '@mui/material/Grid2'
import {
  Business as BuildingIcon,
  Layers as FloorIcon,
  Inventory2 as AssetIcon,
  Assignment as WorkOrderIcon,
  LocationOn as LocationIcon,
} from '@mui/icons-material'
import { PageHeader, StatusChip, SearchBar } from '../../components/common'
import { mockBuildings, getClientById } from '../../data'
import { formatArea } from '../../utils/formatters'

const BuildingList: React.FC = () => {
  const navigate = useNavigate()
  const [searchQuery, setSearchQuery] = useState('')

  const filteredBuildings = mockBuildings.filter(building =>
    building.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
    building.code.toLowerCase().includes(searchQuery.toLowerCase()) ||
    building.address.city.toLowerCase().includes(searchQuery.toLowerCase())
  )

  const getBuildingTypeColor = (type: string) => {
    const colors: Record<string, string> = {
      Hotel: '#9c27b0',
      Factory: '#ff9800',
      Office: '#2196f3',
      Commercial: '#4caf50',
      Residential: '#e91e63',
      Industrial: '#795548',
    }
    return colors[type] || '#757575'
  }

  return (
    <Box>
      <PageHeader
        title="Facilities"
        subtitle={`Managing ${mockBuildings.length} buildings across all clients`}
        action={{
          label: 'Add Building',
          onClick: () => console.log('Add building'),
        }}
      >
        <SearchBar
          value={searchQuery}
          onChange={setSearchQuery}
          placeholder="Search buildings..."
        />
      </PageHeader>

      <Grid container spacing={3}>
        {filteredBuildings.map((building) => {
          const client = getClientById(building.clientId)
          return (
            <Grid size={{ xs: 12, sm: 6, lg: 4 }} key={building.id}>
              <Card
                sx={{
                  height: '100%',
                  transition: 'all 0.2s',
                  '&:hover': {
                    transform: 'translateY(-4px)',
                    boxShadow: 4,
                  },
                }}
              >
                <CardActionArea
                  onClick={() => navigate(`/facilities/${building.id}`)}
                  sx={{ height: '100%' }}
                >
                  <CardContent sx={{ p: 2.5 }}>
                    {/* Header */}
                    <Box sx={{ display: 'flex', alignItems: 'flex-start', mb: 2 }}>
                      <Avatar
                        sx={{
                          width: 48,
                          height: 48,
                          bgcolor: getBuildingTypeColor(building.buildingType),
                          mr: 1.5,
                        }}
                      >
                        <BuildingIcon />
                      </Avatar>
                      <Box sx={{ flex: 1, minWidth: 0 }}>
                        <Typography variant="subtitle1" fontWeight={600} noWrap>
                          {building.name}
                        </Typography>
                        <Typography variant="caption" color="text.secondary">
                          {building.code}
                        </Typography>
                      </Box>
                      <StatusChip status={building.status} type="building" size="small" />
                    </Box>

                    {/* Client */}
                    {client && (
                      <Typography variant="body2" color="text.secondary" sx={{ mb: 1.5 }}>
                        {client.name}
                      </Typography>
                    )}

                    {/* Location */}
                    <Box sx={{ display: 'flex', alignItems: 'center', gap: 0.5, mb: 2 }}>
                      <LocationIcon sx={{ fontSize: 16, color: 'text.secondary' }} />
                      <Typography variant="body2" color="text.secondary" noWrap>
                        {building.address.district}, {building.address.city}
                      </Typography>
                    </Box>

                    {/* Type & Area */}
                    <Box sx={{ display: 'flex', gap: 1, mb: 2 }}>
                      <Chip
                        label={building.buildingType}
                        size="small"
                        sx={{
                          bgcolor: `${getBuildingTypeColor(building.buildingType)}15`,
                          color: getBuildingTypeColor(building.buildingType),
                        }}
                      />
                      <Chip
                        label={formatArea(building.totalArea)}
                        size="small"
                        variant="outlined"
                      />
                    </Box>

                    {/* Stats */}
                    <Box
                      sx={{
                        display: 'grid',
                        gridTemplateColumns: 'repeat(3, 1fr)',
                        gap: 1.5,
                        pt: 2,
                        borderTop: '1px solid',
                        borderColor: 'divider',
                      }}
                    >
                      <Box sx={{ textAlign: 'center' }}>
                        <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 0.5 }}>
                          <FloorIcon sx={{ fontSize: 16, color: 'text.secondary' }} />
                          <Typography variant="h6" fontWeight={600}>
                            {building.totalFloors + building.basementFloors}
                          </Typography>
                        </Box>
                        <Typography variant="caption" color="text.secondary">
                          Floors
                        </Typography>
                      </Box>
                      <Box sx={{ textAlign: 'center' }}>
                        <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 0.5 }}>
                          <AssetIcon sx={{ fontSize: 16, color: 'text.secondary' }} />
                          <Typography variant="h6" fontWeight={600}>
                            {building.totalAssets}
                          </Typography>
                        </Box>
                        <Typography variant="caption" color="text.secondary">
                          Assets
                        </Typography>
                      </Box>
                      <Box sx={{ textAlign: 'center' }}>
                        <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 0.5 }}>
                          <WorkOrderIcon sx={{ fontSize: 16, color: building.openWorkOrders && building.openWorkOrders > 0 ? 'primary.main' : 'text.secondary' }} />
                          <Typography
                            variant="h6"
                            fontWeight={600}
                            color={building.openWorkOrders && building.openWorkOrders > 0 ? 'primary.main' : 'text.primary'}
                          >
                            {building.openWorkOrders}
                          </Typography>
                        </Box>
                        <Typography variant="caption" color="text.secondary">
                          Open WOs
                        </Typography>
                      </Box>
                    </Box>
                  </CardContent>
                </CardActionArea>
              </Card>
            </Grid>
          )
        })}
      </Grid>

      {filteredBuildings.length === 0 && (
        <Box sx={{ textAlign: 'center', py: 8 }}>
          <BuildingIcon sx={{ fontSize: 64, color: 'text.disabled', mb: 2 }} />
          <Typography variant="h6" color="text.secondary">
            No buildings found
          </Typography>
          <Typography variant="body2" color="text.secondary">
            Try adjusting your search query
          </Typography>
        </Box>
      )}
    </Box>
  )
}

export default BuildingList
