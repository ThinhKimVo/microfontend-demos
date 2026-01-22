import React from 'react'
import { useParams } from 'react-router-dom'
import {
  Box,
  Card,
  CardContent,
  Typography,
  Chip,
  Divider,
  Avatar,
  List,
  ListItem,
  ListItemText,
} from '@mui/material'
import Grid from '@mui/material/Grid2'
import {
  Phone as PhoneIcon,
  Email as EmailIcon,
  Star as StarIcon,
  Warning as WarningIcon,
} from '@mui/icons-material'
import { PageHeader, StatCard, MEPCategoryChip } from '../../components/common'
import { getTechnicianById, mockBuildings } from '../../data'
import { TECHNICIAN_STATUSES } from '../../utils/constants'
import { formatDate, getInitials } from '../../utils/formatters'

const TechnicianDetail: React.FC = () => {
  const { techId } = useParams<{ techId: string }>()
  const tech = getTechnicianById(techId || '')

  if (!tech) {
    return (
      <Box sx={{ textAlign: 'center', py: 8 }}>
        <Typography variant="h6" color="text.secondary">Technician not found</Typography>
      </Box>
    )
  }

  const statusConfig = TECHNICIAN_STATUSES.find(s => s.value === tech.currentStatus)
  const assignedBuildings = mockBuildings.filter(b => tech.assignedBuildingIds.includes(b.id))

  // Check for expiring certifications
  const today = new Date()
  const expiringCerts = tech.certifications.filter(cert => {
    const expiryDate = new Date(cert.expiryDate)
    const daysUntilExpiry = (expiryDate.getTime() - today.getTime()) / (1000 * 60 * 60 * 24)
    return daysUntilExpiry <= 90
  })

  return (
    <Box>
      <PageHeader
        title={tech.name}
        subtitle={`${tech.employeeId} - ${tech.department}`}
        breadcrumbs={[
          { label: 'Technicians', path: '/technicians' },
          { label: tech.name },
        ]}
      />

      {/* Stats */}
      <Grid container spacing={3} sx={{ mb: 3 }}>
        <Grid size={{ xs: 6, md: 3 }}>
          <StatCard
            title="WOs Completed (Month)"
            value={tech.workOrdersCompletedMonth}
            color="#2196f3"
          />
        </Grid>
        <Grid size={{ xs: 6, md: 3 }}>
          <StatCard
            title="First-Time Fix Rate"
            value={`${tech.firstTimeFixRate}%`}
            color="#4caf50"
          />
        </Grid>
        <Grid size={{ xs: 6, md: 3 }}>
          <StatCard
            title="Avg Completion Time"
            value={`${tech.averageCompletionTime}h`}
            color="#ff9800"
          />
        </Grid>
        <Grid size={{ xs: 6, md: 3 }}>
          <Card>
            <CardContent sx={{ p: 2, display: 'flex', alignItems: 'center', gap: 1 }}>
              <StarIcon sx={{ color: '#ffc107', fontSize: 32 }} />
              <Box>
                <Typography variant="h4" fontWeight={700}>{tech.customerSatisfactionRating}</Typography>
                <Typography variant="caption" color="text.secondary">Customer Rating</Typography>
              </Box>
            </CardContent>
          </Card>
        </Grid>
      </Grid>

      <Grid container spacing={3}>
        {/* Profile */}
        <Grid size={{ xs: 12, md: 4 }}>
          <Card>
            <CardContent>
              <Box sx={{ display: 'flex', alignItems: 'center', gap: 2, mb: 3 }}>
                <Avatar sx={{ width: 72, height: 72, bgcolor: 'primary.main', fontSize: '1.5rem' }}>
                  {getInitials(tech.name)}
                </Avatar>
                <Box>
                  <Typography variant="h6" fontWeight={600}>{tech.name}</Typography>
                  <Typography variant="body2" color="text.secondary">{tech.department}</Typography>
                  <Chip
                    label={tech.currentStatus}
                    size="small"
                    sx={{
                      mt: 0.5,
                      bgcolor: `${statusConfig?.color}15`,
                      color: statusConfig?.color,
                    }}
                  />
                </Box>
              </Box>

              <Divider sx={{ my: 2 }} />

              <Box sx={{ display: 'flex', flexDirection: 'column', gap: 1.5 }}>
                <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                  <EmailIcon sx={{ fontSize: 18, color: 'text.secondary' }} />
                  <Typography variant="body2">{tech.email}</Typography>
                </Box>
                <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                  <PhoneIcon sx={{ fontSize: 18, color: 'text.secondary' }} />
                  <Typography variant="body2">{tech.phone}</Typography>
                </Box>
              </Box>

              <Divider sx={{ my: 2 }} />

              <Typography variant="subtitle2" gutterBottom>Assigned Buildings</Typography>
              {assignedBuildings.map(building => (
                <Chip key={building.id} label={building.name} size="small" sx={{ mr: 0.5, mb: 0.5 }} />
              ))}
            </CardContent>
          </Card>
        </Grid>

        {/* Skills & Certifications */}
        <Grid size={{ xs: 12, md: 8 }}>
          <Card sx={{ mb: 3 }}>
            <CardContent>
              <Typography variant="h6" fontWeight={600} gutterBottom>Skills</Typography>
              <Divider sx={{ my: 2 }} />
              <Grid container spacing={2}>
                {tech.skills.map((skill, idx) => (
                  <Grid size={{ xs: 12, sm: 6 }} key={idx}>
                    <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 0.5 }}>
                      <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                        <MEPCategoryChip category={skill.category} size="small" />
                        <Typography variant="body2">{skill.skillName}</Typography>
                      </Box>
                      <Chip label={skill.proficiencyLevel} size="small" variant="outlined" />
                    </Box>
                  </Grid>
                ))}
              </Grid>
            </CardContent>
          </Card>

          <Card>
            <CardContent>
              <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 2 }}>
                <Typography variant="h6" fontWeight={600}>Certifications</Typography>
                {expiringCerts.length > 0 && (
                  <Chip
                    icon={<WarningIcon />}
                    label={`${expiringCerts.length} expiring soon`}
                    color="warning"
                    size="small"
                  />
                )}
              </Box>
              <Divider sx={{ my: 2 }} />
              <List>
                {tech.certifications.map((cert, idx) => {
                  const isExpiringSoon = new Date(cert.expiryDate) <= new Date(today.getTime() + 90 * 24 * 60 * 60 * 1000)
                  return (
                    <ListItem key={idx} sx={{ px: 0 }}>
                      <ListItemText
                        primary={cert.name}
                        secondary={
                          <Box sx={{ display: 'flex', gap: 2 }}>
                            <Typography variant="caption">#{cert.certificateNumber}</Typography>
                            <Typography variant="caption">Expires: {formatDate(cert.expiryDate)}</Typography>
                          </Box>
                        }
                      />
                      {isExpiringSoon && <Chip label="Expiring" color="warning" size="small" />}
                    </ListItem>
                  )
                })}
              </List>
            </CardContent>
          </Card>
        </Grid>
      </Grid>
    </Box>
  )
}

export default TechnicianDetail
