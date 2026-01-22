import React, { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import {
  Box,
  Card,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  TablePagination,
  Chip,
  IconButton,
  Typography,
  Avatar,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
} from '@mui/material'
import {
  Visibility as ViewIcon,
  Assignment as RequestIcon,
  CheckCircle as ApprovedIcon,
  Cancel as RejectedIcon,
  Schedule as PendingIcon,
} from '@mui/icons-material'
import { PageHeader, SearchBar, PriorityChip, MEPCategoryChip } from '../../components/common'
import { mockRequests, mockBuildings } from '../../data'
import { formatDate } from '../../utils/formatters'
import { REQUEST_STATUSES } from '../../utils/constants'

const RequestList: React.FC = () => {
  const navigate = useNavigate()
  const [searchQuery, setSearchQuery] = useState('')
  const [statusFilter, setStatusFilter] = useState<string>('')
  const [page, setPage] = useState(0)
  const [rowsPerPage, setRowsPerPage] = useState(10)

  const filteredRequests = mockRequests.filter(request => {
    const matchesSearch = request.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      request.description.toLowerCase().includes(searchQuery.toLowerCase())
    const matchesStatus = !statusFilter || request.status === statusFilter
    return matchesSearch && matchesStatus
  })

  const paginatedRequests = filteredRequests.slice(
    page * rowsPerPage,
    page * rowsPerPage + rowsPerPage
  )

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'Approved': return <ApprovedIcon sx={{ fontSize: 16 }} />
      case 'Rejected': return <RejectedIcon sx={{ fontSize: 16 }} />
      default: return <PendingIcon sx={{ fontSize: 16 }} />
    }
  }

  const getStatusColor = (status: string) => {
    const statusConfig = REQUEST_STATUSES.find(s => s.value === status)
    return statusConfig?.color || '#757575'
  }

  const getBuildingName = (buildingId: string) => {
    const building = mockBuildings.find(b => b.id === buildingId)
    return building?.name || '-'
  }

  return (
    <Box>
      <PageHeader
        title="Service Requests"
        subtitle={`${mockRequests.length} requests total`}
        action={{
          label: 'New Request',
          onClick: () => console.log('New request'),
        }}
      >
        <Box sx={{ display: 'flex', gap: 2, alignItems: 'center' }}>
          <SearchBar
            value={searchQuery}
            onChange={setSearchQuery}
            placeholder="Search requests..."
          />
          <FormControl size="small" sx={{ minWidth: 150 }}>
            <InputLabel>Status</InputLabel>
            <Select
              value={statusFilter}
              label="Status"
              onChange={(e) => setStatusFilter(e.target.value)}
            >
              <MenuItem value="">All</MenuItem>
              {REQUEST_STATUSES.map(status => (
                <MenuItem key={status.value} value={status.value}>{status.label}</MenuItem>
              ))}
            </Select>
          </FormControl>
        </Box>
      </PageHeader>

      <Card>
        <TableContainer>
          <Table>
            <TableHead>
              <TableRow>
                <TableCell>Request</TableCell>
                <TableCell>Location</TableCell>
                <TableCell>Category</TableCell>
                <TableCell>Priority</TableCell>
                <TableCell>Status</TableCell>
                <TableCell>Submitted</TableCell>
                <TableCell align="right">Actions</TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {paginatedRequests.map((request) => (
                <TableRow
                  key={request.id}
                  hover
                  sx={{ cursor: 'pointer' }}
                  onClick={() => navigate(`/requests/${request.id}`)}
                >
                  <TableCell>
                    <Box sx={{ display: 'flex', alignItems: 'center', gap: 1.5 }}>
                      <Avatar sx={{ bgcolor: 'info.light', width: 40, height: 40 }}>
                        <RequestIcon />
                      </Avatar>
                      <Box>
                        <Typography variant="body2" fontWeight={500}>{request.title}</Typography>
                        <Typography variant="caption" color="text.secondary" sx={{
                          display: '-webkit-box',
                          WebkitLineClamp: 1,
                          WebkitBoxOrient: 'vertical',
                          overflow: 'hidden',
                          maxWidth: 300,
                        }}>
                          {request.description}
                        </Typography>
                      </Box>
                    </Box>
                  </TableCell>
                  <TableCell>
                    <Typography variant="body2">{getBuildingName(request.buildingId)}</Typography>
                    {request.floorId && (
                      <Typography variant="caption" color="text.secondary">
                        Floor {request.floorId.split('-').pop()}
                      </Typography>
                    )}
                  </TableCell>
                  <TableCell>
                    <MEPCategoryChip category={request.mepCategory} size="small" />
                  </TableCell>
                  <TableCell>
                    <PriorityChip priority={request.priority} size="small" />
                  </TableCell>
                  <TableCell>
                    <Chip
                      icon={getStatusIcon(request.status)}
                      label={request.status}
                      size="small"
                      sx={{
                        bgcolor: `${getStatusColor(request.status)}15`,
                        color: getStatusColor(request.status),
                        fontWeight: 500,
                      }}
                    />
                  </TableCell>
                  <TableCell>
                    <Typography variant="body2">{formatDate(request.submittedDate)}</Typography>
                    <Typography variant="caption" color="text.secondary">
                      by {request.submittedBy}
                    </Typography>
                  </TableCell>
                  <TableCell align="right">
                    <IconButton size="small"><ViewIcon /></IconButton>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </TableContainer>
        <TablePagination
          rowsPerPageOptions={[5, 10, 25]}
          component="div"
          count={filteredRequests.length}
          rowsPerPage={rowsPerPage}
          page={page}
          onPageChange={(_, newPage) => setPage(newPage)}
          onRowsPerPageChange={(e) => { setRowsPerPage(parseInt(e.target.value, 10)); setPage(0) }}
        />
      </Card>
    </Box>
  )
}

export default RequestList
