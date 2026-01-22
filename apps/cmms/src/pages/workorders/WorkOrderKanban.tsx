import React from 'react'
import { useNavigate } from 'react-router-dom'
import {
  Box,
  Card,
  CardContent,
  Typography,
  Chip,
  Avatar,
  ToggleButtonGroup,
  ToggleButton,
  Paper,
} from '@mui/material'
import {
  ViewKanban as KanbanIcon,
  ViewList as ListIcon,
} from '@mui/icons-material'
import { PageHeader, PriorityChip, MEPCategoryChip } from '../../components/common'
import { mockWorkOrders, getBuildingById, getTechnicianById } from '../../data'
import { KANBAN_COLUMNS, WORK_ORDER_STATUSES } from '../../utils/constants'
import { formatDateRelative } from '../../utils/formatters'
import { WorkOrder, WorkOrderStatus } from '../../types'

const WorkOrderKanban: React.FC = () => {
  const navigate = useNavigate()

  const getWorkOrdersByStatus = (status: WorkOrderStatus): WorkOrder[] => {
    return mockWorkOrders.filter(wo => wo.status === status)
  }

  const getStatusColor = (status: WorkOrderStatus): string => {
    const statusConfig = WORK_ORDER_STATUSES.find(s => s.value === status)
    return statusConfig?.color || '#757575'
  }

  const WorkOrderCard = ({ workOrder }: { workOrder: WorkOrder }) => {
    const building = getBuildingById(workOrder.buildingId)
    const technician = workOrder.assignedTo ? getTechnicianById(workOrder.assignedTo) : null

    return (
      <Card
        sx={{
          mb: 1.5,
          cursor: 'pointer',
          transition: 'all 0.2s',
          '&:hover': {
            transform: 'translateY(-2px)',
            boxShadow: 3,
          },
        }}
        onClick={() => navigate(`/work-orders/${workOrder.id}`)}
      >
        <CardContent sx={{ p: 2, '&:last-child': { pb: 2 } }}>
          {/* Header */}
          <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', mb: 1 }}>
            <Typography variant="caption" fontWeight={600} color="primary.main">
              {workOrder.workOrderNumber}
            </Typography>
            <PriorityChip priority={workOrder.priority} size="small" showIcon={false} />
          </Box>

          {/* Title */}
          <Typography
            variant="body2"
            fontWeight={500}
            sx={{
              mb: 1,
              display: '-webkit-box',
              WebkitLineClamp: 2,
              WebkitBoxOrient: 'vertical',
              overflow: 'hidden',
            }}
          >
            {workOrder.title}
          </Typography>

          {/* Tags */}
          <Box sx={{ display: 'flex', gap: 0.5, flexWrap: 'wrap', mb: 1.5 }}>
            <MEPCategoryChip category={workOrder.mepCategory} size="small" showIcon={false} />
            <Chip
              label={workOrder.workOrderType}
              size="small"
              variant="outlined"
              sx={{ fontSize: '0.7rem', height: 20 }}
            />
          </Box>

          {/* Location */}
          <Typography variant="caption" color="text.secondary" display="block" sx={{ mb: 1 }}>
            {building?.name || '-'}
          </Typography>

          {/* Footer */}
          <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
            {technician ? (
              <Box sx={{ display: 'flex', alignItems: 'center', gap: 0.5 }}>
                <Avatar sx={{ width: 20, height: 20, fontSize: 10 }}>
                  {technician.name.charAt(0)}
                </Avatar>
                <Typography variant="caption" color="text.secondary">
                  {technician.name.split(' ').slice(-1)[0]}
                </Typography>
              </Box>
            ) : (
              <Chip
                label="Unassigned"
                size="small"
                sx={{ fontSize: '0.65rem', height: 18 }}
              />
            )}
            <Typography variant="caption" color="text.secondary">
              {formatDateRelative(workOrder.createdDate)}
            </Typography>
          </Box>
        </CardContent>
      </Card>
    )
  }

  return (
    <Box>
      <PageHeader
        title="Work Orders - Kanban"
        subtitle="Drag and drop to update status"
        action={{
          label: 'Create Work Order',
          onClick: () => console.log('Create work order'),
        }}
      >
        <ToggleButtonGroup
          value="kanban"
          exclusive
          size="small"
          sx={{ mr: 2 }}
        >
          <ToggleButton value="list" onClick={() => navigate('/work-orders')}>
            <ListIcon />
          </ToggleButton>
          <ToggleButton value="kanban">
            <KanbanIcon />
          </ToggleButton>
        </ToggleButtonGroup>
      </PageHeader>

      {/* Kanban Board */}
      <Box
        sx={{
          display: 'flex',
          gap: 2,
          overflowX: 'auto',
          pb: 2,
          minHeight: 'calc(100vh - 250px)',
        }}
      >
        {KANBAN_COLUMNS.map((status) => {
          const workOrders = getWorkOrdersByStatus(status)
          const statusColor = getStatusColor(status)

          return (
            <Paper
              key={status}
              elevation={0}
              sx={{
                minWidth: 300,
                maxWidth: 300,
                bgcolor: 'background.default',
                borderRadius: 2,
                display: 'flex',
                flexDirection: 'column',
              }}
            >
              {/* Column Header */}
              <Box
                sx={{
                  p: 2,
                  borderBottom: '3px solid',
                  borderColor: statusColor,
                  bgcolor: 'background.paper',
                  borderTopLeftRadius: 8,
                  borderTopRightRadius: 8,
                }}
              >
                <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                  <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                    <Box
                      sx={{
                        width: 8,
                        height: 8,
                        borderRadius: '50%',
                        bgcolor: statusColor,
                      }}
                    />
                    <Typography variant="subtitle2" fontWeight={600}>
                      {status}
                    </Typography>
                  </Box>
                  <Chip
                    label={workOrders.length}
                    size="small"
                    sx={{
                      bgcolor: `${statusColor}15`,
                      color: statusColor,
                      fontWeight: 600,
                      minWidth: 28,
                    }}
                  />
                </Box>
              </Box>

              {/* Cards Container */}
              <Box
                sx={{
                  p: 1.5,
                  flex: 1,
                  overflowY: 'auto',
                  minHeight: 200,
                }}
              >
                {workOrders.length === 0 ? (
                  <Box
                    sx={{
                      height: '100%',
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      border: '2px dashed',
                      borderColor: 'divider',
                      borderRadius: 2,
                      minHeight: 150,
                    }}
                  >
                    <Typography variant="body2" color="text.secondary">
                      No work orders
                    </Typography>
                  </Box>
                ) : (
                  workOrders.map(wo => (
                    <WorkOrderCard key={wo.id} workOrder={wo} />
                  ))
                )}
              </Box>
            </Paper>
          )
        })}
      </Box>
    </Box>
  )
}

export default WorkOrderKanban
