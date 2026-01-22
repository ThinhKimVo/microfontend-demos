import React from 'react'
import { useParams } from 'react-router-dom'
import { Box, Card, CardContent, Typography, Chip, Divider, LinearProgress } from '@mui/material'
import Grid from '@mui/material/Grid2'
import { PageHeader, MEPCategoryChip, StatCard } from '../../components/common'
import { getInventoryItemById, getVendorById } from '../../data'
import { formatCurrency } from '../../utils/formatters'

const PartDetail: React.FC = () => {
  const { partId } = useParams<{ partId: string }>()
  const part = getInventoryItemById(partId || '')
  const vendor = part?.primaryVendorId ? getVendorById(part.primaryVendorId) : null

  if (!part) {
    return (
      <Box sx={{ textAlign: 'center', py: 8 }}>
        <Typography variant="h6" color="text.secondary">Part not found</Typography>
      </Box>
    )
  }

  const isLowStock = part.currentQuantity <= part.minimumLevel
  const stockPercentage = (part.currentQuantity / part.maximumLevel) * 100

  return (
    <Box>
      <PageHeader
        title={part.name}
        subtitle={part.partNumber}
        breadcrumbs={[
          { label: 'Inventory', path: '/inventory' },
          { label: part.name },
        ]}
      />

      <Grid container spacing={3} sx={{ mb: 3 }}>
        <Grid size={{ xs: 6, md: 3 }}>
          <StatCard title="Current Stock" value={`${part.currentQuantity} ${part.unitOfMeasure}`} color={isLowStock ? '#d32f2f' : '#4caf50'} />
        </Grid>
        <Grid size={{ xs: 6, md: 3 }}>
          <StatCard title="Reserved" value={`${part.reservedQuantity} ${part.unitOfMeasure}`} color="#ff9800" />
        </Grid>
        <Grid size={{ xs: 6, md: 3 }}>
          <StatCard title="Unit Cost" value={formatCurrency(part.unitCost)} color="#2196f3" />
        </Grid>
        <Grid size={{ xs: 6, md: 3 }}>
          <StatCard title="Total Value" value={formatCurrency(part.totalValue)} color="#9c27b0" />
        </Grid>
      </Grid>

      <Grid container spacing={3}>
        <Grid size={{ xs: 12, md: 6 }}>
          <Card>
            <CardContent>
              <Typography variant="h6" fontWeight={600} gutterBottom>Part Information</Typography>
              <Divider sx={{ my: 2 }} />
              <Box sx={{ display: 'flex', gap: 1, mb: 2 }}>
                <MEPCategoryChip category={part.mepCategory} />
                {isLowStock && <Chip label="Low Stock" color="error" size="small" />}
              </Box>
              <Typography variant="body2" color="text.secondary" paragraph>{part.description}</Typography>
              <Box sx={{ mb: 2 }}>
                <Typography variant="caption" color="text.secondary">Stock Level</Typography>
                <LinearProgress
                  variant="determinate"
                  value={Math.min(stockPercentage, 100)}
                  color={isLowStock ? 'error' : stockPercentage < 50 ? 'warning' : 'success'}
                  sx={{ height: 8, borderRadius: 4, my: 1 }}
                />
                <Box sx={{ display: 'flex', justifyContent: 'space-between' }}>
                  <Typography variant="caption">Min: {part.minimumLevel}</Typography>
                  <Typography variant="caption">Max: {part.maximumLevel}</Typography>
                </Box>
              </Box>
              <Typography variant="caption" color="text.secondary">Location</Typography>
              <Typography variant="body2" sx={{ mb: 1 }}>{part.location.warehouse} - {part.location.bin}</Typography>
              <Typography variant="caption" color="text.secondary">Reorder Quantity</Typography>
              <Typography variant="body2">{part.reorderQuantity} {part.unitOfMeasure}</Typography>
            </CardContent>
          </Card>
        </Grid>
        <Grid size={{ xs: 12, md: 6 }}>
          <Card>
            <CardContent>
              <Typography variant="h6" fontWeight={600} gutterBottom>Supplier Information</Typography>
              <Divider sx={{ my: 2 }} />
              {vendor ? (
                <>
                  <Typography variant="subtitle2">{vendor.name}</Typography>
                  <Typography variant="body2" color="text.secondary" sx={{ mb: 1 }}>{vendor.email}</Typography>
                  <Typography variant="caption" color="text.secondary">Vendor Part Number</Typography>
                  <Typography variant="body2" sx={{ mb: 1 }}>{part.vendorPartNumber || '-'}</Typography>
                  <Typography variant="caption" color="text.secondary">Lead Time</Typography>
                  <Typography variant="body2">{part.leadTimeDays} days</Typography>
                </>
              ) : (
                <Typography variant="body2" color="text.secondary">No supplier assigned</Typography>
              )}
            </CardContent>
          </Card>
        </Grid>
      </Grid>
    </Box>
  )
}

export default PartDetail
