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
  Phone as PhoneIcon,
  Star as StarIcon,
} from '@mui/icons-material'
import { PageHeader, SearchBar } from '../../components/common'
import { mockTechnicians } from '../../data'
import { TECHNICIAN_STATUSES } from '../../utils/constants'
import { getInitials } from '../../utils/formatters'

const TechnicianList: React.FC = () => {
  const navigate = useNavigate()
  const [searchQuery, setSearchQuery] = useState('')

  const filteredTechnicians = mockTechnicians.filter(tech =>
    tech.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
    tech.department.toLowerCase().includes(searchQuery.toLowerCase())
  )

  const getStatusColor = (status: string) => {
    const statusConfig = TECHNICIAN_STATUSES.find(s => s.value === status)
    return statusConfig?.color || '#757575'
  }

  return (
    <Box>
      <PageHeader
        title="Technicians"
        subtitle={`${mockTechnicians.length} technicians in team`}
        action={{
          label: 'Add Technician',
          onClick: () => console.log('Add technician'),
        }}
      >
        <SearchBar
          value={searchQuery}
          onChange={setSearchQuery}
          placeholder="Search technicians..."
        />
      </PageHeader>

      <Grid container spacing={3}>
        {filteredTechnicians.map((tech) => (
          <Grid size={{ xs: 12, sm: 6, lg: 4 }} key={tech.id}>
            <Card
              sx={{
                height: '100%',
                transition: 'all 0.2s',
                '&:hover': { transform: 'translateY(-4px)', boxShadow: 4 },
              }}
            >
              <CardActionArea onClick={() => navigate(`/technicians/${tech.id}`)} sx={{ height: '100%' }}>
                <CardContent>
                  <Box sx={{ display: 'flex', alignItems: 'center', gap: 2, mb: 2 }}>
                    <Avatar
                      sx={{
                        width: 56,
                        height: 56,
                        bgcolor: 'primary.main',
                        fontSize: '1.25rem',
                      }}
                    >
                      {getInitials(tech.name)}
                    </Avatar>
                    <Box sx={{ flex: 1 }}>
                      <Typography variant="subtitle1" fontWeight={600}>
                        {tech.name}
                      </Typography>
                      <Typography variant="body2" color="text.secondary">
                        {tech.department}
                      </Typography>
                      <Chip
                        label={tech.currentStatus}
                        size="small"
                        sx={{
                          mt: 0.5,
                          bgcolor: `${getStatusColor(tech.currentStatus)}15`,
                          color: getStatusColor(tech.currentStatus),
                          fontWeight: 500,
                        }}
                      />
                    </Box>
                  </Box>

                  <Box sx={{ display: 'flex', gap: 3, mb: 2 }}>
                    <Box sx={{ display: 'flex', alignItems: 'center', gap: 0.5 }}>
                      <PhoneIcon sx={{ fontSize: 14, color: 'text.secondary' }} />
                      <Typography variant="caption" color="text.secondary">
                        {tech.phone}
                      </Typography>
                    </Box>
                  </Box>

                  <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 0.5, mb: 2 }}>
                    {tech.skills.slice(0, 3).map((skill, idx) => (
                      <Chip
                        key={idx}
                        label={skill.skillName}
                        size="small"
                        variant="outlined"
                        sx={{ fontSize: '0.7rem', height: 22 }}
                      />
                    ))}
                    {tech.skills.length > 3 && (
                      <Chip
                        label={`+${tech.skills.length - 3}`}
                        size="small"
                        sx={{ fontSize: '0.7rem', height: 22 }}
                      />
                    )}
                  </Box>

                  <Box sx={{ borderTop: '1px solid', borderColor: 'divider', pt: 2 }}>
                    <Grid container spacing={2}>
                      <Grid size={4}>
                        <Typography variant="h6" fontWeight={600} textAlign="center">
                          {tech.workOrdersCompletedMonth}
                        </Typography>
                        <Typography variant="caption" color="text.secondary" display="block" textAlign="center">
                          WOs/Month
                        </Typography>
                      </Grid>
                      <Grid size={4}>
                        <Typography variant="h6" fontWeight={600} textAlign="center">
                          {tech.firstTimeFixRate}%
                        </Typography>
                        <Typography variant="caption" color="text.secondary" display="block" textAlign="center">
                          Fix Rate
                        </Typography>
                      </Grid>
                      <Grid size={4}>
                        <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 0.5 }}>
                          <StarIcon sx={{ fontSize: 16, color: '#ffc107' }} />
                          <Typography variant="h6" fontWeight={600}>
                            {tech.customerSatisfactionRating}
                          </Typography>
                        </Box>
                        <Typography variant="caption" color="text.secondary" display="block" textAlign="center">
                          Rating
                        </Typography>
                      </Grid>
                    </Grid>
                  </Box>
                </CardContent>
              </CardActionArea>
            </Card>
          </Grid>
        ))}
      </Grid>
    </Box>
  )
}

export default TechnicianList
