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
  IconButton,
  Typography,
  Avatar,
  Rating,
} from '@mui/material'
import {
  Visibility as ViewIcon,
  Store as VendorIcon,
} from '@mui/icons-material'
import { PageHeader, SearchBar, MEPCategoryChip } from '../../components/common'
import { mockVendors } from '../../data'
import { formatDate } from '../../utils/formatters'

const VendorList: React.FC = () => {
  const navigate = useNavigate()
  const [searchQuery, setSearchQuery] = useState('')
  const [page, setPage] = useState(0)
  const [rowsPerPage, setRowsPerPage] = useState(10)

  const filteredVendors = mockVendors.filter(vendor =>
    vendor.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
    vendor.contactPerson.toLowerCase().includes(searchQuery.toLowerCase())
  )

  const paginatedVendors = filteredVendors.slice(
    page * rowsPerPage,
    page * rowsPerPage + rowsPerPage
  )

  return (
    <Box>
      <PageHeader
        title="Vendors"
        subtitle={`${mockVendors.length} vendors registered`}
        action={{
          label: 'Add Vendor',
          onClick: () => console.log('Add vendor'),
        }}
      >
        <SearchBar
          value={searchQuery}
          onChange={setSearchQuery}
          placeholder="Search vendors..."
        />
      </PageHeader>

      <Card>
        <TableContainer>
          <Table>
            <TableHead>
              <TableRow>
                <TableCell>Vendor</TableCell>
                <TableCell>MEP Specialties</TableCell>
                <TableCell>Contract</TableCell>
                <TableCell>Rating</TableCell>
                <TableCell align="right">Actions</TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {paginatedVendors.map((vendor) => (
                <TableRow
                  key={vendor.id}
                  hover
                  sx={{ cursor: 'pointer' }}
                  onClick={() => navigate(`/vendors/${vendor.id}`)}
                >
                  <TableCell>
                    <Box sx={{ display: 'flex', alignItems: 'center', gap: 1.5 }}>
                      <Avatar sx={{ bgcolor: 'secondary.light', width: 40, height: 40 }}>
                        <VendorIcon />
                      </Avatar>
                      <Box>
                        <Typography variant="body2" fontWeight={500}>{vendor.name}</Typography>
                        <Typography variant="caption" color="text.secondary">
                          {vendor.contactPerson} - {vendor.phone}
                        </Typography>
                      </Box>
                    </Box>
                  </TableCell>
                  <TableCell>
                    <Box sx={{ display: 'flex', gap: 0.5, flexWrap: 'wrap' }}>
                      {vendor.mepSpecialties.map(spec => (
                        <MEPCategoryChip key={spec} category={spec} size="small" />
                      ))}
                    </Box>
                  </TableCell>
                  <TableCell>
                    {vendor.contractEndDate ? (
                      <>
                        <Typography variant="body2">{vendor.serviceLevel || 'Standard'}</Typography>
                        <Typography variant="caption" color="text.secondary">
                          Until {formatDate(vendor.contractEndDate)}
                        </Typography>
                      </>
                    ) : (
                      <Typography variant="body2" color="text.secondary">No contract</Typography>
                    )}
                  </TableCell>
                  <TableCell>
                    <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                      <Rating
                        value={((vendor.deliveryRating || 0) + (vendor.qualityRating || 0)) / 2}
                        precision={0.5}
                        size="small"
                        readOnly
                      />
                      <Typography variant="caption" color="text.secondary">
                        {(((vendor.deliveryRating || 0) + (vendor.qualityRating || 0)) / 2).toFixed(1)}
                      </Typography>
                    </Box>
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
          count={filteredVendors.length}
          rowsPerPage={rowsPerPage}
          page={page}
          onPageChange={(_, newPage) => setPage(newPage)}
          onRowsPerPageChange={(e) => { setRowsPerPage(parseInt(e.target.value, 10)); setPage(0) }}
        />
      </Card>
    </Box>
  )
}

export default VendorList
