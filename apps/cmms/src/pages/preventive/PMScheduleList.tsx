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
  LinearProgress,
  Typography,
  Avatar,
} from '@mui/material'
import {
  Visibility as ViewIcon,
  Event as PMIcon,
  CheckCircle as ActiveIcon,
} from '@mui/icons-material'
import { PageHeader, SearchBar, MEPCategoryChip } from '../../components/common'
import { mockPMSchedules, getBuildingById } from '../../data'
import { formatDate } from '../../utils/formatters'

const PMScheduleList: React.FC = () => {
  const navigate = useNavigate()
  const [searchQuery, setSearchQuery] = useState('')
  const [page, setPage] = useState(0)
  const [rowsPerPage, setRowsPerPage] = useState(10)

  const filteredSchedules = mockPMSchedules.filter(pm =>
    pm.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
    pm.description.toLowerCase().includes(searchQuery.toLowerCase())
  )

  const paginatedSchedules = filteredSchedules.slice(
    page * rowsPerPage,
    page * rowsPerPage + rowsPerPage
  )

  return (
    <Box>
      <PageHeader
        title="Preventive Maintenance"
        subtitle={`${mockPMSchedules.length} PM schedules configured`}
        action={{
          label: 'Create PM Schedule',
          onClick: () => console.log('Create PM schedule'),
        }}
      >
        <SearchBar
          value={searchQuery}
          onChange={setSearchQuery}
          placeholder="Search schedules..."
        />
      </PageHeader>

      <Card>
        <TableContainer>
          <Table>
            <TableHead>
              <TableRow>
                <TableCell>Schedule</TableCell>
                <TableCell>Category</TableCell>
                <TableCell>Frequency</TableCell>
                <TableCell>Next Due</TableCell>
                <TableCell>Compliance</TableCell>
                <TableCell>Status</TableCell>
                <TableCell align="right">Actions</TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {paginatedSchedules.map((pm) => {
                const building = pm.buildingId ? getBuildingById(pm.buildingId) : null
                return (
                  <TableRow
                    key={pm.id}
                    hover
                    sx={{ cursor: 'pointer' }}
                    onClick={() => navigate(`/preventive-maintenance/${pm.id}`)}
                  >
                    <TableCell>
                      <Box sx={{ display: 'flex', alignItems: 'center', gap: 1.5 }}>
                        <Avatar sx={{ bgcolor: 'success.light', width: 36, height: 36 }}>
                          <PMIcon sx={{ fontSize: 18 }} />
                        </Avatar>
                        <Box>
                          <Typography variant="body2" fontWeight={500}>
                            {pm.name}
                          </Typography>
                          <Typography variant="caption" color="text.secondary">
                            {building?.name || `${pm.assetIds?.length || 0} assets`}
                          </Typography>
                        </Box>
                      </Box>
                    </TableCell>
                    <TableCell>
                      <MEPCategoryChip category={pm.mepCategory} />
                    </TableCell>
                    <TableCell>
                      <Typography variant="body2">
                        Every {pm.interval} {pm.intervalUnit}
                      </Typography>
                      <Typography variant="caption" color="text.secondary">
                        {pm.frequencyType}
                      </Typography>
                    </TableCell>
                    <TableCell>
                      <Typography variant="body2">{formatDate(pm.nextDueDate)}</Typography>
                    </TableCell>
                    <TableCell>
                      <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                        <LinearProgress
                          variant="determinate"
                          value={pm.complianceRate || 0}
                          sx={{ flex: 1, height: 8, borderRadius: 4, maxWidth: 100 }}
                          color={pm.complianceRate && pm.complianceRate >= 90 ? 'success' : pm.complianceRate && pm.complianceRate >= 70 ? 'warning' : 'error'}
                        />
                        <Typography variant="body2" fontWeight={500}>
                          {pm.complianceRate}%
                        </Typography>
                      </Box>
                    </TableCell>
                    <TableCell>
                      <Chip
                        icon={pm.isActive ? <ActiveIcon sx={{ fontSize: 14 }} /> : undefined}
                        label={pm.isActive ? 'Active' : 'Inactive'}
                        size="small"
                        color={pm.isActive ? 'success' : 'default'}
                        variant={pm.isActive ? 'filled' : 'outlined'}
                      />
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
          count={filteredSchedules.length}
          rowsPerPage={rowsPerPage}
          page={page}
          onPageChange={(_, newPage) => setPage(newPage)}
          onRowsPerPageChange={(e) => { setRowsPerPage(parseInt(e.target.value, 10)); setPage(0) }}
        />
      </Card>
    </Box>
  )
}

export default PMScheduleList
