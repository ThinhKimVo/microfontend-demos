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
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
} from '@mui/material'
import Grid from '@mui/material/Grid2'
import { PageHeader, StatusChip, PriorityChip, MEPCategoryChip } from '../../components/common'
import { getWorkOrderById, getBuildingById, getFloorById, getAssetById, getTechnicianById } from '../../data'
import { formatDateTime, formatCurrency } from '../../utils/formatters'

const WorkOrderDetail: React.FC = () => {
  const { workOrderId } = useParams<{ workOrderId: string }>()

  const workOrder = getWorkOrderById(workOrderId || '')
  const building = workOrder ? getBuildingById(workOrder.buildingId) : null
  const floor = workOrder ? getFloorById(workOrder.floorId) : null
  const asset = workOrder?.assetId ? getAssetById(workOrder.assetId) : null
  const technician = workOrder?.assignedTo ? getTechnicianById(workOrder.assignedTo) : null

  if (!workOrder) {
    return (
      <Box sx={{ textAlign: 'center', py: 8 }}>
        <Typography variant="h6" color="text.secondary">
          Work Order not found
        </Typography>
      </Box>
    )
  }

  const InfoRow = ({ label, value }: { label: string; value: React.ReactNode }) => (
    <Box sx={{ display: 'flex', py: 1.5, borderBottom: '1px solid', borderColor: 'divider' }}>
      <Typography variant="body2" color="text.secondary" sx={{ width: 140, flexShrink: 0 }}>
        {label}
      </Typography>
      <Typography variant="body2" fontWeight={500}>
        {value || '-'}
      </Typography>
    </Box>
  )

  const totalLaborCost = workOrder.labor?.reduce((sum, l) => sum + l.laborCost, 0) || 0
  const totalPartsCost = workOrder.partsUsed?.reduce((sum, p) => sum + p.partCost, 0) || 0
  const totalCost = totalLaborCost + totalPartsCost

  return (
    <Box>
      <PageHeader
        title={workOrder.workOrderNumber}
        subtitle={workOrder.title}
        breadcrumbs={[
          { label: 'Work Orders', path: '/work-orders' },
          { label: workOrder.workOrderNumber },
        ]}
        action={{
          label: 'Edit Work Order',
          onClick: () => console.log('Edit work order'),
        }}
      />

      {/* Header Card */}
      <Card sx={{ mb: 3 }}>
        <CardContent>
          <Box sx={{ display: 'flex', gap: 2, flexWrap: 'wrap', alignItems: 'center', mb: 2 }}>
            <StatusChip status={workOrder.status} type="workOrder" />
            <PriorityChip priority={workOrder.priority} />
            <Chip label={workOrder.workOrderType} variant="outlined" size="small" />
            <MEPCategoryChip category={workOrder.mepCategory} />
          </Box>
          <Typography variant="body1" color="text.secondary">
            {workOrder.description}
          </Typography>
        </CardContent>
      </Card>

      <Grid container spacing={3}>
        {/* Left Column */}
        <Grid size={{ xs: 12, md: 8 }}>
          {/* Details Card */}
          <Card sx={{ mb: 3 }}>
            <CardContent>
              <Typography variant="h6" fontWeight={600} gutterBottom>
                Work Order Details
              </Typography>
              <Divider sx={{ my: 2 }} />

              <Grid container spacing={3}>
                <Grid size={{ xs: 12, md: 6 }}>
                  <Typography variant="subtitle2" color="text.secondary" gutterBottom>
                    Location
                  </Typography>
                  <InfoRow label="Building" value={building?.name} />
                  <InfoRow label="Floor" value={floor?.floorName} />
                  {workOrder.locationNotes && (
                    <InfoRow label="Notes" value={workOrder.locationNotes} />
                  )}
                </Grid>
                <Grid size={{ xs: 12, md: 6 }}>
                  <Typography variant="subtitle2" color="text.secondary" gutterBottom>
                    Asset
                  </Typography>
                  {asset ? (
                    <>
                      <InfoRow label="Asset Name" value={asset.name} />
                      <InfoRow label="Asset Tag" value={asset.assetTag} />
                      <InfoRow label="Type" value={asset.assetType} />
                    </>
                  ) : (
                    <Typography variant="body2" color="text.secondary">
                      No asset linked
                    </Typography>
                  )}
                </Grid>
              </Grid>

              <Divider sx={{ my: 2 }} />

              <Grid container spacing={3}>
                <Grid size={{ xs: 12, md: 6 }}>
                  <Typography variant="subtitle2" color="text.secondary" gutterBottom>
                    Scheduling
                  </Typography>
                  <InfoRow label="Created" value={formatDateTime(workOrder.createdDate)} />
                  <InfoRow label="Target Start" value={formatDateTime(workOrder.targetStartDate)} />
                  <InfoRow label="Target End" value={formatDateTime(workOrder.targetCompletionDate)} />
                  {workOrder.actualStartDate && (
                    <InfoRow label="Actual Start" value={formatDateTime(workOrder.actualStartDate)} />
                  )}
                  {workOrder.actualCompletionDate && (
                    <InfoRow label="Actual End" value={formatDateTime(workOrder.actualCompletionDate)} />
                  )}
                </Grid>
                <Grid size={{ xs: 12, md: 6 }}>
                  <Typography variant="subtitle2" color="text.secondary" gutterBottom>
                    Assignment
                  </Typography>
                  {technician ? (
                    <Box sx={{ display: 'flex', alignItems: 'center', gap: 1.5, py: 1 }}>
                      <Avatar sx={{ bgcolor: 'primary.main' }}>
                        {technician.name.charAt(0)}
                      </Avatar>
                      <Box>
                        <Typography variant="body2" fontWeight={500}>
                          {technician.name}
                        </Typography>
                        <Typography variant="caption" color="text.secondary">
                          {technician.department}
                        </Typography>
                      </Box>
                    </Box>
                  ) : (
                    <Typography variant="body2" color="text.secondary" py={1}>
                      Not assigned
                    </Typography>
                  )}
                  {workOrder.estimatedDuration && (
                    <InfoRow label="Est. Duration" value={`${workOrder.estimatedDuration} hours`} />
                  )}
                </Grid>
              </Grid>
            </CardContent>
          </Card>

          {/* Resolution Card */}
          {(workOrder.resolutionNotes || workOrder.rootCause || workOrder.actionsTaken) && (
            <Card sx={{ mb: 3 }}>
              <CardContent>
                <Typography variant="h6" fontWeight={600} gutterBottom>
                  Resolution
                </Typography>
                <Divider sx={{ my: 2 }} />

                {workOrder.rootCause && (
                  <Box sx={{ mb: 2 }}>
                    <Typography variant="subtitle2" color="text.secondary" gutterBottom>
                      Root Cause
                    </Typography>
                    <Typography variant="body2">{workOrder.rootCause}</Typography>
                  </Box>
                )}

                {workOrder.actionsTaken && (
                  <Box sx={{ mb: 2 }}>
                    <Typography variant="subtitle2" color="text.secondary" gutterBottom>
                      Actions Taken
                    </Typography>
                    <Typography variant="body2">{workOrder.actionsTaken}</Typography>
                  </Box>
                )}

                {workOrder.resolutionNotes && (
                  <Box>
                    <Typography variant="subtitle2" color="text.secondary" gutterBottom>
                      Resolution Notes
                    </Typography>
                    <Typography variant="body2">{workOrder.resolutionNotes}</Typography>
                  </Box>
                )}
              </CardContent>
            </Card>
          )}

          {/* Parts Used */}
          {workOrder.partsUsed && workOrder.partsUsed.length > 0 && (
            <Card>
              <CardContent>
                <Typography variant="h6" fontWeight={600} gutterBottom>
                  Parts Used
                </Typography>
                <Divider sx={{ my: 2 }} />

                <TableContainer>
                  <Table size="small">
                    <TableHead>
                      <TableRow>
                        <TableCell>Part</TableCell>
                        <TableCell align="center">Quantity</TableCell>
                        <TableCell align="right">Cost</TableCell>
                      </TableRow>
                    </TableHead>
                    <TableBody>
                      {workOrder.partsUsed.map((part, index) => (
                        <TableRow key={index}>
                          <TableCell>{part.partName}</TableCell>
                          <TableCell align="center">{part.quantity}</TableCell>
                          <TableCell align="right">{formatCurrency(part.partCost)}</TableCell>
                        </TableRow>
                      ))}
                    </TableBody>
                  </Table>
                </TableContainer>
              </CardContent>
            </Card>
          )}
        </Grid>

        {/* Right Column */}
        <Grid size={{ xs: 12, md: 4 }}>
          {/* Cost Summary */}
          <Card sx={{ mb: 3 }}>
            <CardContent>
              <Typography variant="h6" fontWeight={600} gutterBottom>
                Cost Summary
              </Typography>
              <Divider sx={{ my: 2 }} />

              <Box sx={{ display: 'flex', justifyContent: 'space-between', py: 1 }}>
                <Typography variant="body2" color="text.secondary">Labor</Typography>
                <Typography variant="body2" fontWeight={500}>{formatCurrency(totalLaborCost)}</Typography>
              </Box>
              <Box sx={{ display: 'flex', justifyContent: 'space-between', py: 1 }}>
                <Typography variant="body2" color="text.secondary">Parts</Typography>
                <Typography variant="body2" fontWeight={500}>{formatCurrency(totalPartsCost)}</Typography>
              </Box>
              <Divider sx={{ my: 1 }} />
              <Box sx={{ display: 'flex', justifyContent: 'space-between', py: 1 }}>
                <Typography variant="body2" fontWeight={600}>Total</Typography>
                <Typography variant="body2" fontWeight={700} color="primary.main">
                  {formatCurrency(totalCost)}
                </Typography>
              </Box>
            </CardContent>
          </Card>

          {/* Labor */}
          {workOrder.labor && workOrder.labor.length > 0 && (
            <Card>
              <CardContent>
                <Typography variant="h6" fontWeight={600} gutterBottom>
                  Labor
                </Typography>
                <Divider sx={{ my: 2 }} />

                {workOrder.labor.map((labor, index) => {
                  const tech = getTechnicianById(labor.technicianId)
                  return (
                    <Box key={index} sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', py: 1 }}>
                      <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                        <Avatar sx={{ width: 28, height: 28, fontSize: 12 }}>
                          {tech?.name.charAt(0) || '?'}
                        </Avatar>
                        <Box>
                          <Typography variant="body2">{tech?.name || 'Unknown'}</Typography>
                          <Typography variant="caption" color="text.secondary">
                            {labor.hoursWorked} hours
                          </Typography>
                        </Box>
                      </Box>
                      <Typography variant="body2" fontWeight={500}>
                        {formatCurrency(labor.laborCost)}
                      </Typography>
                    </Box>
                  )
                })}
              </CardContent>
            </Card>
          )}
        </Grid>
      </Grid>
    </Box>
  )
}

export default WorkOrderDetail
