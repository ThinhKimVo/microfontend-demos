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
  LinearProgress,
} from '@mui/material'
import {
  Visibility as ViewIcon,
  Inventory as InventoryIcon,
  Warning as WarningIcon,
} from '@mui/icons-material'
import { PageHeader, SearchBar, MEPCategoryChip } from '../../components/common'
import { mockInventory } from '../../data'
import { formatCurrency } from '../../utils/formatters'

const InventoryList: React.FC = () => {
  const navigate = useNavigate()
  const [searchQuery, setSearchQuery] = useState('')
  const [page, setPage] = useState(0)
  const [rowsPerPage, setRowsPerPage] = useState(10)

  const filteredItems = mockInventory.filter(item =>
    item.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
    item.partNumber.toLowerCase().includes(searchQuery.toLowerCase())
  )

  const paginatedItems = filteredItems.slice(
    page * rowsPerPage,
    page * rowsPerPage + rowsPerPage
  )

  const getStockLevel = (item: typeof mockInventory[0]) => {
    const percentage = (item.currentQuantity / item.maximumLevel) * 100
    if (item.currentQuantity <= item.minimumLevel) return { color: 'error', label: 'Low Stock' }
    if (percentage < 50) return { color: 'warning', label: 'Medium' }
    return { color: 'success', label: 'Good' }
  }

  return (
    <Box>
      <PageHeader
        title="Inventory"
        subtitle={`${mockInventory.length} parts in inventory`}
        action={{
          label: 'Add Part',
          onClick: () => console.log('Add part'),
        }}
      >
        <SearchBar
          value={searchQuery}
          onChange={setSearchQuery}
          placeholder="Search parts..."
        />
      </PageHeader>

      <Card>
        <TableContainer>
          <Table>
            <TableHead>
              <TableRow>
                <TableCell>Part</TableCell>
                <TableCell>Category</TableCell>
                <TableCell>Stock Level</TableCell>
                <TableCell>Location</TableCell>
                <TableCell align="right">Unit Cost</TableCell>
                <TableCell align="right">Total Value</TableCell>
                <TableCell align="right">Actions</TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {paginatedItems.map((item) => {
                const stockStatus = getStockLevel(item)
                const isLowStock = item.currentQuantity <= item.minimumLevel
                return (
                  <TableRow
                    key={item.id}
                    hover
                    sx={{ cursor: 'pointer' }}
                    onClick={() => navigate(`/inventory/${item.id}`)}
                  >
                    <TableCell>
                      <Box sx={{ display: 'flex', alignItems: 'center', gap: 1.5 }}>
                        <Avatar sx={{ bgcolor: isLowStock ? 'error.light' : 'primary.light', width: 36, height: 36 }}>
                          {isLowStock ? <WarningIcon sx={{ fontSize: 18 }} /> : <InventoryIcon sx={{ fontSize: 18 }} />}
                        </Avatar>
                        <Box>
                          <Typography variant="body2" fontWeight={500}>
                            {item.name}
                          </Typography>
                          <Typography variant="caption" color="text.secondary">
                            {item.partNumber}
                          </Typography>
                        </Box>
                      </Box>
                    </TableCell>
                    <TableCell>
                      <MEPCategoryChip category={item.mepCategory} />
                    </TableCell>
                    <TableCell>
                      <Box sx={{ minWidth: 150 }}>
                        <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 0.5 }}>
                          <Typography variant="caption" color="text.secondary">
                            {item.currentQuantity} / {item.maximumLevel} {item.unitOfMeasure}
                          </Typography>
                          <Chip
                            label={stockStatus.label}
                            size="small"
                            color={stockStatus.color as any}
                            sx={{ height: 18, fontSize: '0.65rem' }}
                          />
                        </Box>
                        <LinearProgress
                          variant="determinate"
                          value={Math.min((item.currentQuantity / item.maximumLevel) * 100, 100)}
                          color={stockStatus.color as any}
                          sx={{ height: 6, borderRadius: 3 }}
                        />
                        <Typography variant="caption" color="text.secondary">
                          Min: {item.minimumLevel}
                        </Typography>
                      </Box>
                    </TableCell>
                    <TableCell>
                      <Typography variant="body2">{item.location.warehouse}</Typography>
                      <Typography variant="caption" color="text.secondary">
                        {item.location.bin}
                      </Typography>
                    </TableCell>
                    <TableCell align="right">
                      <Typography variant="body2">{formatCurrency(item.unitCost)}</Typography>
                    </TableCell>
                    <TableCell align="right">
                      <Typography variant="body2" fontWeight={500}>
                        {formatCurrency(item.totalValue)}
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
          count={filteredItems.length}
          rowsPerPage={rowsPerPage}
          page={page}
          onPageChange={(_, newPage) => setPage(newPage)}
          onRowsPerPageChange={(e) => { setRowsPerPage(parseInt(e.target.value, 10)); setPage(0) }}
        />
      </Card>
    </Box>
  )
}

export default InventoryList
