import React, { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import {
  Box,
  Card,
  CardContent,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  TablePagination,
  Chip,
  IconButton,
  FormControl,
  Select,
  MenuItem,
  InputLabel,
  Typography,
  Avatar,
  ToggleButtonGroup,
  ToggleButton,
} from '@mui/material'
import {
  Visibility as ViewIcon,
  Assignment as WorkOrderIcon,
  ViewKanban as KanbanIcon,
  ViewList as ListIcon,
} from '@mui/icons-material'
import { PageHeader, SearchBar, StatusChip, PriorityChip, MEPCategoryChip } from '../../components/common'
import { mockWorkOrders, getBuildingById, getTechnicianById } from '../../data'
import { WORK_ORDER_STATUSES, PRIORITIES, MEP_CATEGORIES, WORK_ORDER_TYPES } from '../../utils/constants'
import { formatDate, formatDateRelative } from '../../utils/formatters'

const WorkOrderList: React.FC = () => {
  const navigate = useNavigate()
  const [searchQuery, setSearchQuery] = useState('')
  const [statusFilter, setStatusFilter] = useState('')
  const [priorityFilter, setPriorityFilter] = useState('')
  const [categoryFilter, setCategoryFilter] = useState('')
  const [typeFilter, setTypeFilter] = useState('')
  const [page, setPage] = useState(0)
  const [rowsPerPage, setRowsPerPage] = useState(10)

  const filteredWorkOrders = mockWorkOrders.filter(wo => {
    const matchesSearch =
      wo.workOrderNumber.toLowerCase().includes(searchQuery.toLowerCase()) ||
      wo.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      wo.description.toLowerCase().includes(searchQuery.toLowerCase())
    const matchesStatus = !statusFilter || wo.status === statusFilter
    const matchesPriority = !priorityFilter || wo.priority === priorityFilter
    const matchesCategory = !categoryFilter || wo.mepCategory === categoryFilter
    const matchesType = !typeFilter || wo.workOrderType === typeFilter
    return matchesSearch && matchesStatus && matchesPriority && matchesCategory && matchesType
  })

  const paginatedWorkOrders = filteredWorkOrders.slice(
    page * rowsPerPage,
    page * rowsPerPage + rowsPerPage
  )

  const handleChangePage = (_: unknown, newPage: number) => {
    setPage(newPage)
  }

  const handleChangeRowsPerPage = (event: React.ChangeEvent<HTMLInputElement>) => {
    setRowsPerPage(parseInt(event.target.value, 10))
    setPage(0)
  }

  const clearFilters = () => {
    setSearchQuery('')
    setStatusFilter('')
    setPriorityFilter('')
    setCategoryFilter('')
    setTypeFilter('')
  }

  return (
    <Box>
      <PageHeader
        title="Work Orders"
        subtitle={`${mockWorkOrders.length} total work orders`}
        action={{
          label: 'Create Work Order',
          onClick: () => console.log('Create work order'),
        }}
      >
        <ToggleButtonGroup
          value="list"
          exclusive
          size="small"
          sx={{ mr: 2 }}
        >
          <ToggleButton value="list">
            <ListIcon />
          </ToggleButton>
          <ToggleButton value="kanban" onClick={() => navigate('/work-orders/kanban')}>
            <KanbanIcon />
          </ToggleButton>
        </ToggleButtonGroup>
      </PageHeader>

      <Card sx={{ mb: 3 }}>
        <CardContent sx={{ py: 2 }}>
          <Box sx={{ display: 'flex', gap: 2, flexWrap: 'wrap', alignItems: 'center' }}>
            <SearchBar
              value={searchQuery}
              onChange={setSearchQuery}
              placeholder="Search work orders..."
              sx={{ minWidth: 250 }}
            />

            <FormControl size="small" sx={{ minWidth: 130 }}>
              <InputLabel>Status</InputLabel>
              <Select
                value={statusFilter}
                label="Status"
                onChange={(e) => setStatusFilter(e.target.value)}
              >
                <MenuItem value="">All</MenuItem>
                {WORK_ORDER_STATUSES.map(status => (
                  <MenuItem key={status.value} value={status.value}>{status.label}</MenuItem>
                ))}
              </Select>
            </FormControl>

            <FormControl size="small" sx={{ minWidth: 130 }}>
              <InputLabel>Priority</InputLabel>
              <Select
                value={priorityFilter}
                label="Priority"
                onChange={(e) => setPriorityFilter(e.target.value)}
              >
                <MenuItem value="">All</MenuItem>
                {PRIORITIES.map(p => (
                  <MenuItem key={p.value} value={p.value}>{p.label}</MenuItem>
                ))}
              </Select>
            </FormControl>

            <FormControl size="small" sx={{ minWidth: 130 }}>
              <InputLabel>Category</InputLabel>
              <Select
                value={categoryFilter}
                label="Category"
                onChange={(e) => setCategoryFilter(e.target.value)}
              >
                <MenuItem value="">All</MenuItem>
                {MEP_CATEGORIES.map(cat => (
                  <MenuItem key={cat.value} value={cat.value}>{cat.label}</MenuItem>
                ))}
              </Select>
            </FormControl>

            <FormControl size="small" sx={{ minWidth: 130 }}>
              <InputLabel>Type</InputLabel>
              <Select
                value={typeFilter}
                label="Type"
                onChange={(e) => setTypeFilter(e.target.value)}
              >
                <MenuItem value="">All</MenuItem>
                {WORK_ORDER_TYPES.map(type => (
                  <MenuItem key={type.value} value={type.value}>{type.label}</MenuItem>
                ))}
              </Select>
            </FormControl>

            {(searchQuery || statusFilter || priorityFilter || categoryFilter || typeFilter) && (
              <Chip
                label="Clear filters"
                onDelete={clearFilters}
                size="small"
                variant="outlined"
              />
            )}
          </Box>
        </CardContent>
      </Card>

      <Card>
        <TableContainer>
          <Table>
            <TableHead>
              <TableRow>
                <TableCell>Work Order</TableCell>
                <TableCell>Type</TableCell>
                <TableCell>Location</TableCell>
                <TableCell>Assigned To</TableCell>
                <TableCell>Priority</TableCell>
                <TableCell>Status</TableCell>
                <TableCell>Created</TableCell>
                <TableCell align="right">Actions</TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {paginatedWorkOrders.map((wo) => {
                const building = getBuildingById(wo.buildingId)
                const technician = wo.assignedTo ? getTechnicianById(wo.assignedTo) : null
                return (
                  <TableRow
                    key={wo.id}
                    hover
                    sx={{ cursor: 'pointer' }}
                    onClick={() => navigate(`/work-orders/${wo.id}`)}
                  >
                    <TableCell>
                      <Box sx={{ display: 'flex', alignItems: 'center', gap: 1.5 }}>
                        <Avatar sx={{ bgcolor: 'primary.light', width: 36, height: 36 }}>
                          <WorkOrderIcon sx={{ fontSize: 18 }} />
                        </Avatar>
                        <Box>
                          <Typography variant="body2" fontWeight={500}>
                            {wo.workOrderNumber}
                          </Typography>
                          <Typography variant="caption" color="text.secondary" sx={{ display: 'block', maxWidth: 200 }} noWrap>
                            {wo.title}
                          </Typography>
                        </Box>
                      </Box>
                    </TableCell>
                    <TableCell>
                      <Box>
                        <Chip label={wo.workOrderType} size="small" variant="outlined" sx={{ mb: 0.5 }} />
                        <Box>
                          <MEPCategoryChip category={wo.mepCategory} size="small" />
                        </Box>
                      </Box>
                    </TableCell>
                    <TableCell>
                      <Typography variant="body2">{building?.name || '-'}</Typography>
                    </TableCell>
                    <TableCell>
                      {technician ? (
                        <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                          <Avatar sx={{ width: 24, height: 24, fontSize: 12 }}>
                            {technician.name.charAt(0)}
                          </Avatar>
                          <Typography variant="body2">{technician.name}</Typography>
                        </Box>
                      ) : (
                        <Typography variant="body2" color="text.secondary">Unassigned</Typography>
                      )}
                    </TableCell>
                    <TableCell>
                      <PriorityChip priority={wo.priority} />
                    </TableCell>
                    <TableCell>
                      <StatusChip status={wo.status} type="workOrder" />
                    </TableCell>
                    <TableCell>
                      <Typography variant="body2">{formatDate(wo.createdDate)}</Typography>
                      <Typography variant="caption" color="text.secondary">
                        {formatDateRelative(wo.createdDate)}
                      </Typography>
                    </TableCell>
                    <TableCell align="right">
                      <IconButton size="small">
                        <ViewIcon />
                      </IconButton>
                    </TableCell>
                  </TableRow>
                )
              })}
            </TableBody>
          </Table>
        </TableContainer>
        <TablePagination
          rowsPerPageOptions={[5, 10, 25]}
          component="div"
          count={filteredWorkOrders.length}
          rowsPerPage={rowsPerPage}
          page={page}
          onPageChange={handleChangePage}
          onRowsPerPageChange={handleChangeRowsPerPage}
        />
      </Card>
    </Box>
  )
}

export default WorkOrderList
