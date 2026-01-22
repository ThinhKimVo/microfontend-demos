import React from 'react'
import { useNavigate } from 'react-router-dom'
import {
  Box,
  Card,
  CardContent,
  CardHeader,
  Typography,
  List,
  ListItem,
  ListItemText,
  ListItemAvatar,
  Avatar,
  Divider,
  Chip,
  LinearProgress,
  IconButton,
} from '@mui/material'
import Grid from '@mui/material/Grid2'
import {
  Assignment as WorkOrderIcon,
  Warning as WarningIcon,
  CheckCircle as CheckIcon,
  Inventory2 as AssetIcon,
  Event as PMIcon,
  Inventory as InventoryIcon,
  Engineering as TechIcon,
  AccessTime as TimeIcon,
  ArrowForward as ArrowIcon,
} from '@mui/icons-material'
import { StatCard, PageHeader, StatusChip, PriorityChip, MEPCategoryChip } from '../components/common'
import { getDashboardStats, mockWorkOrders, mockPMSchedules, getLowStockItems, mockBuildings } from '../data'
import { formatDate, formatDateRelative } from '../utils/formatters'

const Dashboard: React.FC = () => {
  const navigate = useNavigate()
  const stats = getDashboardStats()
  const lowStockItems = getLowStockItems()

  // Get recent/upcoming work orders
  const recentWorkOrders = mockWorkOrders
    .filter(wo => !['Completed', 'Closed', 'Cancelled'].includes(wo.status))
    .slice(0, 5)

  // Get upcoming PM schedules
  const upcomingPM = mockPMSchedules
    .filter(pm => pm.isActive)
    .sort((a, b) => new Date(a.nextDueDate).getTime() - new Date(b.nextDueDate).getTime())
    .slice(0, 5)

  return (
    <Box>
      <PageHeader
        title="Dashboard"
        subtitle={`Welcome back! Here's what's happening with your facilities today.`}
      />

      {/* Stats Row */}
      <Grid container spacing={3} sx={{ mb: 3 }}>
        <Grid size={{ xs: 12, sm: 6, md: 3 }}>
          <StatCard
            title="Open Work Orders"
            value={stats.openWorkOrders}
            icon={<WorkOrderIcon />}
            color="#1976d2"
            onClick={() => navigate('/work-orders')}
          />
        </Grid>
        <Grid size={{ xs: 12, sm: 6, md: 3 }}>
          <StatCard
            title="Overdue Work Orders"
            value={stats.overdueWorkOrders}
            icon={<WarningIcon />}
            color="#d32f2f"
            onClick={() => navigate('/work-orders')}
          />
        </Grid>
        <Grid size={{ xs: 12, sm: 6, md: 3 }}>
          <StatCard
            title="PM Compliance"
            value={`${stats.pmComplianceRate}%`}
            icon={<CheckIcon />}
            color="#2e7d32"
            subtitle="Last 12 months"
            onClick={() => navigate('/preventive-maintenance')}
          />
        </Grid>
        <Grid size={{ xs: 12, sm: 6, md: 3 }}>
          <StatCard
            title="Total Assets"
            value={stats.totalAssets}
            icon={<AssetIcon />}
            color="#9c27b0"
            subtitle={`${stats.assetsNeedingAttention} need attention`}
            onClick={() => navigate('/assets')}
          />
        </Grid>
      </Grid>

      {/* Secondary Stats Row */}
      <Grid container spacing={3} sx={{ mb: 3 }}>
        <Grid size={{ xs: 12, sm: 6, md: 3 }}>
          <StatCard
            title="Low Stock Items"
            value={stats.lowStockItems}
            icon={<InventoryIcon />}
            color="#ed6c02"
            onClick={() => navigate('/inventory')}
          />
        </Grid>
        <Grid size={{ xs: 12, sm: 6, md: 3 }}>
          <StatCard
            title="Technician Utilization"
            value={`${stats.technicianUtilization}%`}
            icon={<TechIcon />}
            color="#0288d1"
            onClick={() => navigate('/technicians')}
          />
        </Grid>
        <Grid size={{ xs: 12, sm: 6, md: 3 }}>
          <StatCard
            title="Avg. MTTR"
            value={`${stats.mttr}h`}
            icon={<TimeIcon />}
            color="#00796b"
            subtitle="Mean Time To Repair"
          />
        </Grid>
        <Grid size={{ xs: 12, sm: 6, md: 3 }}>
          <StatCard
            title="Buildings Managed"
            value={mockBuildings.length}
            icon={<AssetIcon />}
            color="#5e35b1"
            onClick={() => navigate('/facilities')}
          />
        </Grid>
      </Grid>

      {/* Main Content Grid */}
      <Grid container spacing={3}>
        {/* Recent Work Orders */}
        <Grid size={{ xs: 12, lg: 6 }}>
          <Card>
            <CardHeader
              title="Recent Work Orders"
              action={
                <IconButton onClick={() => navigate('/work-orders')}>
                  <ArrowIcon />
                </IconButton>
              }
              titleTypographyProps={{ variant: 'h6', fontWeight: 600 }}
            />
            <Divider />
            <List sx={{ p: 0 }}>
              {recentWorkOrders.map((wo, index) => (
                <React.Fragment key={wo.id}>
                  <ListItem
                    sx={{
                      cursor: 'pointer',
                      '&:hover': { bgcolor: 'action.hover' },
                    }}
                    onClick={() => navigate(`/work-orders/${wo.id}`)}
                  >
                    <ListItemAvatar>
                      <Avatar sx={{ bgcolor: 'primary.light' }}>
                        <WorkOrderIcon />
                      </Avatar>
                    </ListItemAvatar>
                    <ListItemText
                      primary={
                        <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                          <Typography variant="body2" fontWeight={500}>
                            {wo.workOrderNumber}
                          </Typography>
                          <PriorityChip priority={wo.priority} size="small" />
                        </Box>
                      }
                      secondary={
                        <Box>
                          <Typography variant="body2" color="text.secondary" noWrap>
                            {wo.title}
                          </Typography>
                          <Typography variant="caption" color="text.secondary">
                            {formatDateRelative(wo.createdDate)}
                          </Typography>
                        </Box>
                      }
                    />
                    <StatusChip status={wo.status} type="workOrder" />
                  </ListItem>
                  {index < recentWorkOrders.length - 1 && <Divider component="li" />}
                </React.Fragment>
              ))}
            </List>
          </Card>
        </Grid>

        {/* Upcoming PM */}
        <Grid size={{ xs: 12, lg: 6 }}>
          <Card>
            <CardHeader
              title="Upcoming Preventive Maintenance"
              action={
                <IconButton onClick={() => navigate('/preventive-maintenance')}>
                  <ArrowIcon />
                </IconButton>
              }
              titleTypographyProps={{ variant: 'h6', fontWeight: 600 }}
            />
            <Divider />
            <List sx={{ p: 0 }}>
              {upcomingPM.map((pm, index) => (
                <React.Fragment key={pm.id}>
                  <ListItem
                    sx={{
                      cursor: 'pointer',
                      '&:hover': { bgcolor: 'action.hover' },
                    }}
                    onClick={() => navigate(`/preventive-maintenance/${pm.id}`)}
                  >
                    <ListItemAvatar>
                      <Avatar sx={{ bgcolor: 'success.light' }}>
                        <PMIcon />
                      </Avatar>
                    </ListItemAvatar>
                    <ListItemText
                      primary={
                        <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                          <Typography variant="body2" fontWeight={500}>
                            {pm.name}
                          </Typography>
                          <MEPCategoryChip category={pm.mepCategory} size="small" />
                        </Box>
                      }
                      secondary={
                        <Box>
                          <Typography variant="body2" color="text.secondary">
                            Due: {formatDate(pm.nextDueDate)}
                          </Typography>
                          <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, mt: 0.5 }}>
                            <Typography variant="caption" color="text.secondary">
                              Compliance:
                            </Typography>
                            <LinearProgress
                              variant="determinate"
                              value={pm.complianceRate || 0}
                              sx={{ flex: 1, maxWidth: 100, height: 6, borderRadius: 3 }}
                            />
                            <Typography variant="caption" fontWeight={500}>
                              {pm.complianceRate}%
                            </Typography>
                          </Box>
                        </Box>
                      }
                    />
                  </ListItem>
                  {index < upcomingPM.length - 1 && <Divider component="li" />}
                </React.Fragment>
              ))}
            </List>
          </Card>
        </Grid>

        {/* Low Stock Alerts */}
        <Grid size={{ xs: 12, md: 6 }}>
          <Card>
            <CardHeader
              title="Low Stock Alerts"
              action={
                <IconButton onClick={() => navigate('/inventory')}>
                  <ArrowIcon />
                </IconButton>
              }
              titleTypographyProps={{ variant: 'h6', fontWeight: 600 }}
            />
            <Divider />
            <CardContent>
              {lowStockItems.length === 0 ? (
                <Typography variant="body2" color="text.secondary" textAlign="center" py={2}>
                  All inventory levels are healthy
                </Typography>
              ) : (
                <List sx={{ p: 0 }}>
                  {lowStockItems.slice(0, 4).map((item, index) => (
                    <React.Fragment key={item.id}>
                      <ListItem
                        sx={{
                          px: 0,
                          cursor: 'pointer',
                          '&:hover': { bgcolor: 'action.hover' },
                        }}
                        onClick={() => navigate(`/inventory/${item.id}`)}
                      >
                        <ListItemAvatar>
                          <Avatar sx={{ bgcolor: 'warning.light' }}>
                            <InventoryIcon />
                          </Avatar>
                        </ListItemAvatar>
                        <ListItemText
                          primary={item.name}
                          secondary={
                            <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, mt: 0.5 }}>
                              <Typography variant="caption" color="error.main" fontWeight={500}>
                                {item.currentQuantity} / {item.minimumLevel} min
                              </Typography>
                              <MEPCategoryChip category={item.mepCategory} size="small" />
                            </Box>
                          }
                        />
                        <Chip
                          label="Low Stock"
                          size="small"
                          color="error"
                          variant="outlined"
                        />
                      </ListItem>
                      {index < Math.min(lowStockItems.length, 4) - 1 && <Divider component="li" />}
                    </React.Fragment>
                  ))}
                </List>
              )}
            </CardContent>
          </Card>
        </Grid>

        {/* Buildings Overview */}
        <Grid size={{ xs: 12, md: 6 }}>
          <Card>
            <CardHeader
              title="Buildings Overview"
              action={
                <IconButton onClick={() => navigate('/facilities')}>
                  <ArrowIcon />
                </IconButton>
              }
              titleTypographyProps={{ variant: 'h6', fontWeight: 600 }}
            />
            <Divider />
            <CardContent>
              <List sx={{ p: 0 }}>
                {mockBuildings.slice(0, 4).map((building, index) => (
                  <React.Fragment key={building.id}>
                    <ListItem
                      sx={{
                        px: 0,
                        cursor: 'pointer',
                        '&:hover': { bgcolor: 'action.hover' },
                      }}
                      onClick={() => navigate(`/facilities/${building.id}`)}
                    >
                      <ListItemText
                        primary={
                          <Typography variant="body2" fontWeight={500}>
                            {building.name}
                          </Typography>
                        }
                        secondary={
                          <Box sx={{ display: 'flex', gap: 2, mt: 0.5 }}>
                            <Typography variant="caption" color="text.secondary">
                              {building.totalFloors + building.basementFloors} floors
                            </Typography>
                            <Typography variant="caption" color="text.secondary">
                              {building.totalAssets} assets
                            </Typography>
                            <Typography variant="caption" color="primary.main" fontWeight={500}>
                              {building.openWorkOrders} open WOs
                            </Typography>
                          </Box>
                        }
                      />
                      <StatusChip status={building.status} type="building" />
                    </ListItem>
                    {index < Math.min(mockBuildings.length, 4) - 1 && <Divider component="li" />}
                  </React.Fragment>
                ))}
              </List>
            </CardContent>
          </Card>
        </Grid>
      </Grid>
    </Box>
  )
}

export default Dashboard
