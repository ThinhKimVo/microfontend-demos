import React, { useState } from 'react'
import {
  Box,
  Card,
  CardContent,
  CardActionArea,
  Typography,
  Chip,
  Divider,
  Button,
  Select,
  MenuItem,
  FormControl,
  InputLabel,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  LinearProgress,
  Paper,
} from '@mui/material'
import Grid from '@mui/material/Grid2'
import {
  Assessment as ReportIcon,
  Download as DownloadIcon,
  Schedule as ScheduleIcon,
  Build as MaintenanceIcon,
  Inventory as InventoryIcon,
  Engineering as TechnicianIcon,
  TrendingUp as TrendingUpIcon,
  TrendingDown as TrendingDownIcon,
  Circle as CircleIcon,
} from '@mui/icons-material'
import { PageHeader, StatCard } from '../../components/common'
import { mockWorkOrders, mockAssets, mockBuildings, mockTechnicians, mockInventory } from '../../data'

const ReportsDashboard: React.FC = () => {
  const [selectedPeriod, setSelectedPeriod] = useState('month')

  // Calculate summary stats
  const totalWOs = mockWorkOrders.length
  const completedWOs = mockWorkOrders.filter(wo => wo.status === 'Completed').length
  const completionRate = Math.round((completedWOs / totalWOs) * 100)

  const overdueWOs = mockWorkOrders.filter(wo =>
    wo.status !== 'Completed' && new Date(wo.targetCompletionDate) < new Date()
  ).length

  const totalAssets = mockAssets.length
  const operationalAssets = mockAssets.filter(a => a.status === 'Operational' || a.status === 'Active').length
  const assetHealthRate = Math.round((operationalAssets / totalAssets) * 100)

  const lowStockItems = mockInventory.filter(item => item.currentQuantity <= item.minimumLevel).length

  // WO by category data
  const woByCategory = mockWorkOrders.reduce((acc, wo) => {
    acc[wo.mepCategory] = (acc[wo.mepCategory] || 0) + 1
    return acc
  }, {} as Record<string, number>)

  // WO by building data
  const woByBuilding = mockBuildings.map(building => {
    const count = mockWorkOrders.filter(wo => wo.buildingId === building.id).length
    return { name: building.name, count }
  }).sort((a, b) => b.count - a.count)

  // Technician performance
  const techPerformance = mockTechnicians
    .map(tech => ({
      name: tech.name,
      completed: tech.workOrdersCompletedMonth,
      fixRate: tech.firstTimeFixRate,
      rating: tech.customerSatisfactionRating,
    }))
    .sort((a, b) => b.completed - a.completed)
    .slice(0, 5)

  const reportCategories = [
    {
      title: 'Work Order Reports',
      icon: <MaintenanceIcon />,
      color: '#1976d2',
      reports: ['WO Summary', 'WO by Status', 'WO by Priority', 'Response Time Analysis'],
    },
    {
      title: 'Asset Reports',
      icon: <ReportIcon />,
      color: '#4caf50',
      reports: ['Asset Inventory', 'Asset Health', 'Maintenance History', 'Depreciation Report'],
    },
    {
      title: 'PM Reports',
      icon: <ScheduleIcon />,
      color: '#ff9800',
      reports: ['PM Compliance', 'PM Schedule', 'Overdue PMs', 'PM Cost Analysis'],
    },
    {
      title: 'Inventory Reports',
      icon: <InventoryIcon />,
      color: '#9c27b0',
      reports: ['Stock Levels', 'Usage Analysis', 'Reorder Report', 'Cost Summary'],
    },
    {
      title: 'Technician Reports',
      icon: <TechnicianIcon />,
      color: '#00bcd4',
      reports: ['Performance Summary', 'Workload Analysis', 'Certification Status', 'Training Needs'],
    },
  ]

  const categoryColors: Record<string, string> = {
    HVAC: '#2196f3',
    Electrical: '#ff9800',
    Plumbing: '#00bcd4',
    'Fire Safety': '#f44336',
    Elevator: '#9c27b0',
    BMS: '#4caf50',
    Solar: '#ffc107',
  }

  return (
    <Box>
      <PageHeader
        title="Reports & Analytics"
        subtitle="Comprehensive maintenance insights"
      >
        <FormControl size="small" sx={{ minWidth: 150 }}>
          <InputLabel>Period</InputLabel>
          <Select
            value={selectedPeriod}
            label="Period"
            onChange={(e) => setSelectedPeriod(e.target.value)}
          >
            <MenuItem value="week">This Week</MenuItem>
            <MenuItem value="month">This Month</MenuItem>
            <MenuItem value="quarter">This Quarter</MenuItem>
            <MenuItem value="year">This Year</MenuItem>
          </Select>
        </FormControl>
      </PageHeader>

      {/* KPI Cards */}
      <Grid container spacing={3} sx={{ mb: 3 }}>
        <Grid size={{ xs: 6, md: 3 }}>
          <StatCard
            title="WO Completion Rate"
            value={`${completionRate}%`}
            color="#4caf50"
            trend={{ value: 5, direction: 'up' }}
          />
        </Grid>
        <Grid size={{ xs: 6, md: 3 }}>
          <StatCard
            title="Overdue Work Orders"
            value={overdueWOs}
            color="#d32f2f"
            trend={{ value: 2, direction: 'down' }}
          />
        </Grid>
        <Grid size={{ xs: 6, md: 3 }}>
          <StatCard
            title="Asset Health Rate"
            value={`${assetHealthRate}%`}
            color="#2196f3"
            trend={{ value: 3, direction: 'up' }}
          />
        </Grid>
        <Grid size={{ xs: 6, md: 3 }}>
          <StatCard
            title="Low Stock Items"
            value={lowStockItems}
            color="#ff9800"
          />
        </Grid>
      </Grid>

      <Grid container spacing={3}>
        {/* WO by Category */}
        <Grid size={{ xs: 12, md: 6 }}>
          <Card>
            <CardContent>
              <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 2 }}>
                <Typography variant="h6" fontWeight={600}>Work Orders by Category</Typography>
                <Button size="small" startIcon={<DownloadIcon />}>Export</Button>
              </Box>
              <Divider sx={{ mb: 2 }} />
              <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2 }}>
                {Object.entries(woByCategory).map(([category, count]) => {
                  const percentage = Math.round((count / totalWOs) * 100)
                  return (
                    <Box key={category}>
                      <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 0.5 }}>
                        <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                          <CircleIcon sx={{ fontSize: 12, color: categoryColors[category] || '#757575' }} />
                          <Typography variant="body2">{category}</Typography>
                        </Box>
                        <Typography variant="body2" fontWeight={500}>{count} ({percentage}%)</Typography>
                      </Box>
                      <LinearProgress
                        variant="determinate"
                        value={percentage}
                        sx={{
                          height: 8,
                          borderRadius: 4,
                          bgcolor: 'grey.200',
                          '& .MuiLinearProgress-bar': {
                            bgcolor: categoryColors[category] || '#757575',
                          },
                        }}
                      />
                    </Box>
                  )
                })}
              </Box>
            </CardContent>
          </Card>
        </Grid>

        {/* WO by Building */}
        <Grid size={{ xs: 12, md: 6 }}>
          <Card>
            <CardContent>
              <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 2 }}>
                <Typography variant="h6" fontWeight={600}>Work Orders by Building</Typography>
                <Button size="small" startIcon={<DownloadIcon />}>Export</Button>
              </Box>
              <Divider sx={{ mb: 2 }} />
              <TableContainer>
                <Table size="small">
                  <TableHead>
                    <TableRow>
                      <TableCell>Building</TableCell>
                      <TableCell align="right">WO Count</TableCell>
                      <TableCell align="right">%</TableCell>
                    </TableRow>
                  </TableHead>
                  <TableBody>
                    {woByBuilding.map((row) => (
                      <TableRow key={row.name}>
                        <TableCell>
                          <Typography variant="body2" sx={{
                            maxWidth: 200,
                            overflow: 'hidden',
                            textOverflow: 'ellipsis',
                            whiteSpace: 'nowrap',
                          }}>
                            {row.name}
                          </Typography>
                        </TableCell>
                        <TableCell align="right">{row.count}</TableCell>
                        <TableCell align="right">{Math.round((row.count / totalWOs) * 100)}%</TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </TableContainer>
            </CardContent>
          </Card>
        </Grid>

        {/* Technician Performance */}
        <Grid size={{ xs: 12, md: 6 }}>
          <Card>
            <CardContent>
              <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 2 }}>
                <Typography variant="h6" fontWeight={600}>Top Technician Performance</Typography>
                <Button size="small" startIcon={<DownloadIcon />}>Export</Button>
              </Box>
              <Divider sx={{ mb: 2 }} />
              <TableContainer>
                <Table size="small">
                  <TableHead>
                    <TableRow>
                      <TableCell>Technician</TableCell>
                      <TableCell align="center">Completed</TableCell>
                      <TableCell align="center">Fix Rate</TableCell>
                      <TableCell align="center">Rating</TableCell>
                    </TableRow>
                  </TableHead>
                  <TableBody>
                    {techPerformance.map((tech, idx) => (
                      <TableRow key={tech.name}>
                        <TableCell>
                          <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                            <Chip
                              label={idx + 1}
                              size="small"
                              sx={{
                                width: 24,
                                height: 24,
                                bgcolor: idx === 0 ? '#ffc107' : idx === 1 ? '#bdbdbd' : idx === 2 ? '#cd7f32' : 'grey.300',
                                color: idx < 3 ? '#fff' : 'text.primary',
                                fontWeight: 600,
                              }}
                            />
                            <Typography variant="body2">{tech.name}</Typography>
                          </Box>
                        </TableCell>
                        <TableCell align="center">{tech.completed}</TableCell>
                        <TableCell align="center">
                          <Chip
                            label={`${tech.fixRate}%`}
                            size="small"
                            color={tech.fixRate >= 90 ? 'success' : tech.fixRate >= 80 ? 'warning' : 'error'}
                          />
                        </TableCell>
                        <TableCell align="center">{tech.rating}/5</TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </TableContainer>
            </CardContent>
          </Card>
        </Grid>

        {/* Monthly Trends */}
        <Grid size={{ xs: 12, md: 6 }}>
          <Card>
            <CardContent>
              <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 2 }}>
                <Typography variant="h6" fontWeight={600}>Monthly Trends</Typography>
                <Button size="small" startIcon={<DownloadIcon />}>Export</Button>
              </Box>
              <Divider sx={{ mb: 2 }} />
              <Grid container spacing={2}>
                <Grid size={6}>
                  <Paper variant="outlined" sx={{ p: 2, textAlign: 'center' }}>
                    <Typography variant="caption" color="text.secondary">New Work Orders</Typography>
                    <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 1 }}>
                      <Typography variant="h4" fontWeight={700}>42</Typography>
                      <Box sx={{ display: 'flex', alignItems: 'center', color: 'success.main' }}>
                        <TrendingUpIcon sx={{ fontSize: 16 }} />
                        <Typography variant="caption">+12%</Typography>
                      </Box>
                    </Box>
                  </Paper>
                </Grid>
                <Grid size={6}>
                  <Paper variant="outlined" sx={{ p: 2, textAlign: 'center' }}>
                    <Typography variant="caption" color="text.secondary">Avg Response Time</Typography>
                    <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 1 }}>
                      <Typography variant="h4" fontWeight={700}>2.4h</Typography>
                      <Box sx={{ display: 'flex', alignItems: 'center', color: 'success.main' }}>
                        <TrendingDownIcon sx={{ fontSize: 16 }} />
                        <Typography variant="caption">-8%</Typography>
                      </Box>
                    </Box>
                  </Paper>
                </Grid>
                <Grid size={6}>
                  <Paper variant="outlined" sx={{ p: 2, textAlign: 'center' }}>
                    <Typography variant="caption" color="text.secondary">PM Compliance</Typography>
                    <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 1 }}>
                      <Typography variant="h4" fontWeight={700}>94%</Typography>
                      <Box sx={{ display: 'flex', alignItems: 'center', color: 'success.main' }}>
                        <TrendingUpIcon sx={{ fontSize: 16 }} />
                        <Typography variant="caption">+3%</Typography>
                      </Box>
                    </Box>
                  </Paper>
                </Grid>
                <Grid size={6}>
                  <Paper variant="outlined" sx={{ p: 2, textAlign: 'center' }}>
                    <Typography variant="caption" color="text.secondary">Cost Savings</Typography>
                    <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 1 }}>
                      <Typography variant="h4" fontWeight={700}>$12K</Typography>
                      <Box sx={{ display: 'flex', alignItems: 'center', color: 'success.main' }}>
                        <TrendingUpIcon sx={{ fontSize: 16 }} />
                        <Typography variant="caption">+15%</Typography>
                      </Box>
                    </Box>
                  </Paper>
                </Grid>
              </Grid>
            </CardContent>
          </Card>
        </Grid>

        {/* Report Categories */}
        <Grid size={12}>
          <Typography variant="h6" fontWeight={600} sx={{ mb: 2 }}>Available Reports</Typography>
          <Grid container spacing={3}>
            {reportCategories.map((category) => (
              <Grid size={{ xs: 12, sm: 6, md: 4, lg: 2.4 }} key={category.title}>
                <Card sx={{ height: '100%' }}>
                  <CardActionArea sx={{ height: '100%' }} onClick={() => console.log('View', category.title)}>
                    <CardContent>
                      <Box
                        sx={{
                          width: 48,
                          height: 48,
                          borderRadius: 2,
                          bgcolor: `${category.color}15`,
                          color: category.color,
                          display: 'flex',
                          alignItems: 'center',
                          justifyContent: 'center',
                          mb: 2,
                        }}
                      >
                        {category.icon}
                      </Box>
                      <Typography variant="subtitle1" fontWeight={600} gutterBottom>
                        {category.title}
                      </Typography>
                      <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 0.5 }}>
                        {category.reports.map((report) => (
                          <Chip key={report} label={report} size="small" variant="outlined" sx={{ fontSize: '0.7rem' }} />
                        ))}
                      </Box>
                    </CardContent>
                  </CardActionArea>
                </Card>
              </Grid>
            ))}
          </Grid>
        </Grid>
      </Grid>
    </Box>
  )
}

export default ReportsDashboard
