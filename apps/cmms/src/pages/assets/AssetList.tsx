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
} from '@mui/material'
import {
  Visibility as ViewIcon,
  Inventory2 as AssetIcon,
} from '@mui/icons-material'
import { PageHeader, SearchBar, StatusChip, MEPCategoryChip } from '../../components/common'
import { mockAssets, getBuildingById, getFloorById } from '../../data'
import { MEP_CATEGORIES, ASSET_STATUSES, CRITICALITY_LEVELS } from '../../utils/constants'

const AssetList: React.FC = () => {
  const navigate = useNavigate()
  const [searchQuery, setSearchQuery] = useState('')
  const [categoryFilter, setCategoryFilter] = useState('')
  const [statusFilter, setStatusFilter] = useState('')
  const [criticalityFilter, setCriticalityFilter] = useState('')
  const [page, setPage] = useState(0)
  const [rowsPerPage, setRowsPerPage] = useState(10)

  const filteredAssets = mockAssets.filter(asset => {
    const matchesSearch =
      asset.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      asset.assetTag.toLowerCase().includes(searchQuery.toLowerCase()) ||
      asset.serialNumber.toLowerCase().includes(searchQuery.toLowerCase())
    const matchesCategory = !categoryFilter || asset.mepCategory === categoryFilter
    const matchesStatus = !statusFilter || asset.status === statusFilter
    const matchesCriticality = !criticalityFilter || asset.criticality === criticalityFilter
    return matchesSearch && matchesCategory && matchesStatus && matchesCriticality
  })

  const paginatedAssets = filteredAssets.slice(
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
    setCategoryFilter('')
    setStatusFilter('')
    setCriticalityFilter('')
  }

  return (
    <Box>
      <PageHeader
        title="Assets"
        subtitle={`Managing ${mockAssets.length} MEP assets across all facilities`}
        action={{
          label: 'Add Asset',
          onClick: () => console.log('Add asset'),
        }}
      />

      <Card sx={{ mb: 3 }}>
        <CardContent sx={{ py: 2 }}>
          <Box sx={{ display: 'flex', gap: 2, flexWrap: 'wrap', alignItems: 'center' }}>
            <SearchBar
              value={searchQuery}
              onChange={setSearchQuery}
              placeholder="Search assets..."
              sx={{ minWidth: 250 }}
            />

            <FormControl size="small" sx={{ minWidth: 140 }}>
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

            <FormControl size="small" sx={{ minWidth: 140 }}>
              <InputLabel>Status</InputLabel>
              <Select
                value={statusFilter}
                label="Status"
                onChange={(e) => setStatusFilter(e.target.value)}
              >
                <MenuItem value="">All</MenuItem>
                {ASSET_STATUSES.map(status => (
                  <MenuItem key={status.value} value={status.value}>{status.label}</MenuItem>
                ))}
              </Select>
            </FormControl>

            <FormControl size="small" sx={{ minWidth: 140 }}>
              <InputLabel>Criticality</InputLabel>
              <Select
                value={criticalityFilter}
                label="Criticality"
                onChange={(e) => setCriticalityFilter(e.target.value)}
              >
                <MenuItem value="">All</MenuItem>
                {CRITICALITY_LEVELS.map(level => (
                  <MenuItem key={level.value} value={level.value}>{level.label}</MenuItem>
                ))}
              </Select>
            </FormControl>

            {(searchQuery || categoryFilter || statusFilter || criticalityFilter) && (
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
                <TableCell>Asset</TableCell>
                <TableCell>Category</TableCell>
                <TableCell>Location</TableCell>
                <TableCell>Criticality</TableCell>
                <TableCell>Status</TableCell>
                <TableCell align="right">Actions</TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {paginatedAssets.map((asset) => {
                const building = getBuildingById(asset.buildingId)
                const floor = getFloorById(asset.floorId)
                return (
                  <TableRow
                    key={asset.id}
                    hover
                    sx={{ cursor: 'pointer' }}
                    onClick={() => navigate(`/assets/${asset.id}`)}
                  >
                    <TableCell>
                      <Box sx={{ display: 'flex', alignItems: 'center', gap: 1.5 }}>
                        <Avatar sx={{ bgcolor: 'primary.light' }}>
                          <AssetIcon />
                        </Avatar>
                        <Box>
                          <Typography variant="body2" fontWeight={500}>
                            {asset.name}
                          </Typography>
                          <Typography variant="caption" color="text.secondary">
                            {asset.assetTag}
                          </Typography>
                        </Box>
                      </Box>
                    </TableCell>
                    <TableCell>
                      <Box>
                        <MEPCategoryChip category={asset.mepCategory} />
                        <Typography variant="caption" color="text.secondary" display="block" sx={{ mt: 0.5 }}>
                          {asset.assetType}
                        </Typography>
                      </Box>
                    </TableCell>
                    <TableCell>
                      <Typography variant="body2">{building?.name || '-'}</Typography>
                      <Typography variant="caption" color="text.secondary">
                        {floor?.floorName || '-'}
                      </Typography>
                    </TableCell>
                    <TableCell>
                      <Chip
                        label={asset.criticality}
                        size="small"
                        sx={{
                          bgcolor: asset.criticality === 'Critical' ? '#d32f2f15' :
                                   asset.criticality === 'High' ? '#ed6c0215' :
                                   asset.criticality === 'Medium' ? '#1976d215' : '#75757515',
                          color: asset.criticality === 'Critical' ? '#d32f2f' :
                                 asset.criticality === 'High' ? '#ed6c02' :
                                 asset.criticality === 'Medium' ? '#1976d2' : '#757575',
                        }}
                      />
                    </TableCell>
                    <TableCell>
                      <StatusChip status={asset.status} type="asset" />
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
          count={filteredAssets.length}
          rowsPerPage={rowsPerPage}
          page={page}
          onPageChange={handleChangePage}
          onRowsPerPageChange={handleChangeRowsPerPage}
        />
      </Card>
    </Box>
  )
}

export default AssetList
