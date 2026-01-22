import React from 'react'
import { useParams } from 'react-router-dom'
import {
  Box,
  Card,
  CardContent,
  Typography,
  Chip,
  Divider,
  Button,
  Avatar,
  List,
  ListItem,
  ListItemAvatar,
  ListItemText,
  Paper,
} from '@mui/material'
import Grid from '@mui/material/Grid2'
import {
  LocationOn as LocationIcon,
  CalendarToday as CalendarIcon,
  Assignment as WorkOrderIcon,
  CheckCircle as ApprovedIcon,
  Cancel as RejectedIcon,
  Schedule as PendingIcon,
  Email as EmailIcon,
  Phone as PhoneIcon,
} from '@mui/icons-material'
import { PageHeader, PriorityChip, MEPCategoryChip } from '../../components/common'
import { getRequestById, mockBuildings, mockFloors } from '../../data'
import { formatDate } from '../../utils/formatters'
import { REQUEST_STATUSES } from '../../utils/constants'

const RequestDetail: React.FC = () => {
  const { requestId } = useParams<{ requestId: string }>()
  const request = getRequestById(requestId || '')

  if (!request) {
    return (
      <Box sx={{ textAlign: 'center', py: 8 }}>
        <Typography variant="h6" color="text.secondary">Request not found</Typography>
      </Box>
    )
  }

  const statusConfig = REQUEST_STATUSES.find(s => s.value === request.status)
  const building = mockBuildings.find(b => b.id === request.buildingId)
  const floor = mockFloors.find(f => f.id === request.floorId)

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'Approved': return <ApprovedIcon />
      case 'Rejected': return <RejectedIcon />
      default: return <PendingIcon />
    }
  }

  const canConvertToWO = request.status === 'Approved' && !request.convertedToWorkOrderId

  return (
    <Box>
      <PageHeader
        title={request.title}
        subtitle={`Request #${request.id}`}
        breadcrumbs={[
          { label: 'Requests', path: '/requests' },
          { label: request.title },
        ]}
        action={canConvertToWO ? {
          label: 'Convert to Work Order',
          onClick: () => console.log('Convert to WO'),
        } : undefined}
      />

      <Grid container spacing={3}>
        {/* Main Info */}
        <Grid size={{ xs: 12, md: 8 }}>
          <Card sx={{ mb: 3 }}>
            <CardContent>
              <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', mb: 2 }}>
                <Box sx={{ display: 'flex', gap: 1 }}>
                  <MEPCategoryChip category={request.mepCategory} />
                  <PriorityChip priority={request.priority} />
                </Box>
                <Chip
                  icon={getStatusIcon(request.status)}
                  label={request.status}
                  sx={{
                    bgcolor: `${statusConfig?.color}15`,
                    color: statusConfig?.color,
                    fontWeight: 600,
                  }}
                />
              </Box>

              <Typography variant="h6" fontWeight={600} gutterBottom>Description</Typography>
              <Typography variant="body2" color="text.secondary" paragraph>
                {request.description}
              </Typography>

              <Divider sx={{ my: 2 }} />

              <Typography variant="h6" fontWeight={600} gutterBottom>Location</Typography>
              <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, mb: 1 }}>
                <LocationIcon sx={{ fontSize: 18, color: 'text.secondary' }} />
                <Typography variant="body2">
                  {building?.name || '-'}
                  {floor && ` > ${floor.name}`}
                  {request.roomNumber && ` > Room ${request.roomNumber}`}
                </Typography>
              </Box>

              {request.attachments && request.attachments.length > 0 && (
                <>
                  <Divider sx={{ my: 2 }} />
                  <Typography variant="h6" fontWeight={600} gutterBottom>Attachments</Typography>
                  <Box sx={{ display: 'flex', gap: 1, flexWrap: 'wrap' }}>
                    {request.attachments.map((attachment, idx) => (
                      <Chip
                        key={idx}
                        label={attachment}
                        variant="outlined"
                        size="small"
                        onClick={() => console.log('View attachment', attachment)}
                      />
                    ))}
                  </Box>
                </>
              )}
            </CardContent>
          </Card>

          {/* Status Actions */}
          {request.status === 'Pending Review' && (
            <Card>
              <CardContent>
                <Typography variant="h6" fontWeight={600} gutterBottom>Review Actions</Typography>
                <Divider sx={{ my: 2 }} />
                <Box sx={{ display: 'flex', gap: 2 }}>
                  <Button
                    variant="contained"
                    color="success"
                    startIcon={<ApprovedIcon />}
                    onClick={() => console.log('Approve')}
                  >
                    Approve Request
                  </Button>
                  <Button
                    variant="outlined"
                    color="error"
                    startIcon={<RejectedIcon />}
                    onClick={() => console.log('Reject')}
                  >
                    Reject Request
                  </Button>
                </Box>
              </CardContent>
            </Card>
          )}

          {request.convertedToWorkOrderId && (
            <Card>
              <CardContent>
                <Typography variant="h6" fontWeight={600} gutterBottom>Linked Work Order</Typography>
                <Divider sx={{ my: 2 }} />
                <Paper variant="outlined" sx={{ p: 2, display: 'flex', alignItems: 'center', gap: 2 }}>
                  <Avatar sx={{ bgcolor: 'primary.light' }}>
                    <WorkOrderIcon />
                  </Avatar>
                  <Box sx={{ flex: 1 }}>
                    <Typography variant="body2" fontWeight={500}>
                      Work Order #{request.convertedToWorkOrderId}
                    </Typography>
                    <Typography variant="caption" color="text.secondary">
                      Created from this request
                    </Typography>
                  </Box>
                  <Button
                    variant="outlined"
                    size="small"
                    onClick={() => console.log('View WO')}
                  >
                    View
                  </Button>
                </Paper>
              </CardContent>
            </Card>
          )}
        </Grid>

        {/* Sidebar */}
        <Grid size={{ xs: 12, md: 4 }}>
          <Card sx={{ mb: 3 }}>
            <CardContent>
              <Typography variant="h6" fontWeight={600} gutterBottom>Requester Information</Typography>
              <Divider sx={{ my: 2 }} />
              <Box sx={{ display: 'flex', alignItems: 'center', gap: 2, mb: 2 }}>
                <Avatar sx={{ width: 48, height: 48, bgcolor: 'primary.main' }}>
                  {request.submittedBy.charAt(0)}
                </Avatar>
                <Box>
                  <Typography variant="body2" fontWeight={500}>{request.submittedBy}</Typography>
                  <Typography variant="caption" color="text.secondary">
                    {request.submitterRole || 'Tenant'}
                  </Typography>
                </Box>
              </Box>
              {request.submitterEmail && (
                <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, mb: 1 }}>
                  <EmailIcon sx={{ fontSize: 16, color: 'text.secondary' }} />
                  <Typography variant="body2">{request.submitterEmail}</Typography>
                </Box>
              )}
              {request.submitterPhone && (
                <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                  <PhoneIcon sx={{ fontSize: 16, color: 'text.secondary' }} />
                  <Typography variant="body2">{request.submitterPhone}</Typography>
                </Box>
              )}
            </CardContent>
          </Card>

          <Card>
            <CardContent>
              <Typography variant="h6" fontWeight={600} gutterBottom>Timeline</Typography>
              <Divider sx={{ my: 2 }} />
              <List disablePadding>
                <ListItem sx={{ px: 0 }}>
                  <ListItemAvatar>
                    <Avatar sx={{ bgcolor: 'info.light', width: 32, height: 32 }}>
                      <CalendarIcon sx={{ fontSize: 16 }} />
                    </Avatar>
                  </ListItemAvatar>
                  <ListItemText
                    primary="Submitted"
                    secondary={formatDate(request.submittedDate)}
                  />
                </ListItem>
                {request.reviewedDate && (
                  <ListItem sx={{ px: 0 }}>
                    <ListItemAvatar>
                      <Avatar sx={{ bgcolor: statusConfig?.color + '30', width: 32, height: 32 }}>
                        {getStatusIcon(request.status)}
                      </Avatar>
                    </ListItemAvatar>
                    <ListItemText
                      primary={request.status}
                      secondary={
                        <>
                          {formatDate(request.reviewedDate)}
                          {request.reviewedBy && ` by ${request.reviewedBy}`}
                        </>
                      }
                    />
                  </ListItem>
                )}
                {request.convertedToWorkOrderId && (
                  <ListItem sx={{ px: 0 }}>
                    <ListItemAvatar>
                      <Avatar sx={{ bgcolor: 'success.light', width: 32, height: 32 }}>
                        <WorkOrderIcon sx={{ fontSize: 16 }} />
                      </Avatar>
                    </ListItemAvatar>
                    <ListItemText
                      primary="Converted to Work Order"
                      secondary={`WO #${request.convertedToWorkOrderId}`}
                    />
                  </ListItem>
                )}
              </List>
            </CardContent>
          </Card>
        </Grid>
      </Grid>
    </Box>
  )
}

export default RequestDetail
