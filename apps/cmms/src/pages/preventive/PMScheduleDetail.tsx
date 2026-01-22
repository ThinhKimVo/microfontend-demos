import React from 'react'
import { useParams } from 'react-router-dom'
import {
  Box,
  Card,
  CardContent,
  Typography,
  Chip,
  Divider,
  List,
  ListItem,
  ListItemIcon,
  ListItemText,
} from '@mui/material'
import Grid from '@mui/material/Grid2'
import {
  RadioButtonUnchecked as UncheckedIcon,
  CameraAlt as PhotoIcon,
} from '@mui/icons-material'
import { PageHeader, MEPCategoryChip, PriorityChip, StatCard } from '../../components/common'
import { getPMScheduleById, getBuildingById } from '../../data'
import { formatDate } from '../../utils/formatters'

const PMScheduleDetail: React.FC = () => {
  const { pmId } = useParams<{ pmId: string }>()
  const pm = getPMScheduleById(pmId || '')
  const building = pm?.buildingId ? getBuildingById(pm.buildingId) : null

  if (!pm) {
    return (
      <Box sx={{ textAlign: 'center', py: 8 }}>
        <Typography variant="h6" color="text.secondary">
          PM Schedule not found
        </Typography>
      </Box>
    )
  }

  return (
    <Box>
      <PageHeader
        title={pm.name}
        subtitle={pm.description}
        breadcrumbs={[
          { label: 'Preventive Maintenance', path: '/preventive-maintenance' },
          { label: pm.name },
        ]}
      />

      {/* Stats */}
      <Grid container spacing={3} sx={{ mb: 3 }}>
        <Grid size={{ xs: 6, md: 3 }}>
          <StatCard
            title="Compliance Rate"
            value={`${pm.complianceRate || 0}%`}
            color="#4caf50"
          />
        </Grid>
        <Grid size={{ xs: 6, md: 3 }}>
          <StatCard
            title="Completed"
            value={pm.totalCompleted || 0}
            subtitle={`of ${pm.totalScheduled || 0} scheduled`}
            color="#2196f3"
          />
        </Grid>
        <Grid size={{ xs: 6, md: 3 }}>
          <StatCard
            title="Frequency"
            value={`${pm.interval} ${pm.intervalUnit}`}
            color="#9c27b0"
          />
        </Grid>
        <Grid size={{ xs: 6, md: 3 }}>
          <StatCard
            title="Next Due"
            value={formatDate(pm.nextDueDate)}
            color="#ff9800"
          />
        </Grid>
      </Grid>

      <Grid container spacing={3}>
        {/* Details */}
        <Grid size={{ xs: 12, md: 6 }}>
          <Card>
            <CardContent>
              <Typography variant="h6" fontWeight={600} gutterBottom>
                Schedule Details
              </Typography>
              <Divider sx={{ my: 2 }} />

              <Box sx={{ display: 'flex', gap: 1, mb: 2 }}>
                <MEPCategoryChip category={pm.mepCategory} />
                <PriorityChip priority={pm.priorityLevel} />
                <Chip
                  label={pm.isActive ? 'Active' : 'Inactive'}
                  size="small"
                  color={pm.isActive ? 'success' : 'default'}
                />
              </Box>

              <Box sx={{ display: 'flex', flexDirection: 'column', gap: 1.5 }}>
                <Box>
                  <Typography variant="caption" color="text.secondary">Scope</Typography>
                  <Typography variant="body2">{pm.scopeType}</Typography>
                </Box>
                {building && (
                  <Box>
                    <Typography variant="caption" color="text.secondary">Building</Typography>
                    <Typography variant="body2">{building.name}</Typography>
                  </Box>
                )}
                <Box>
                  <Typography variant="caption" color="text.secondary">Frequency Type</Typography>
                  <Typography variant="body2">{pm.frequencyType}</Typography>
                </Box>
                <Box>
                  <Typography variant="caption" color="text.secondary">Estimated Duration</Typography>
                  <Typography variant="body2">{pm.estimatedDuration} hours</Typography>
                </Box>
                <Box>
                  <Typography variant="caption" color="text.secondary">Assigned Team</Typography>
                  <Typography variant="body2">{pm.assignedTeam || '-'}</Typography>
                </Box>
                <Box>
                  <Typography variant="caption" color="text.secondary">Lead Time</Typography>
                  <Typography variant="body2">{pm.leadTimeDays} days before due</Typography>
                </Box>
              </Box>
            </CardContent>
          </Card>
        </Grid>

        {/* Checklist */}
        <Grid size={{ xs: 12, md: 6 }}>
          <Card>
            <CardContent>
              <Typography variant="h6" fontWeight={600} gutterBottom>
                Checklist ({pm.checklist.length} items)
              </Typography>
              <Divider sx={{ my: 2 }} />

              <List>
                {pm.checklist.map((item) => (
                  <ListItem key={item.stepNumber} sx={{ px: 0 }}>
                    <ListItemIcon sx={{ minWidth: 36 }}>
                      <UncheckedIcon color="action" />
                    </ListItemIcon>
                    <ListItemText
                      primary={
                        <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                          <Typography variant="body2">
                            {item.stepNumber}. {item.description}
                          </Typography>
                          {item.isRequired && (
                            <Chip label="Required" size="small" color="error" variant="outlined" sx={{ height: 18, fontSize: '0.65rem' }} />
                          )}
                          {item.requiresPhoto && (
                            <PhotoIcon sx={{ fontSize: 16, color: 'text.secondary' }} />
                          )}
                        </Box>
                      }
                      secondary={item.expectedOutcome}
                    />
                  </ListItem>
                ))}
              </List>
            </CardContent>
          </Card>
        </Grid>
      </Grid>
    </Box>
  )
}

export default PMScheduleDetail
