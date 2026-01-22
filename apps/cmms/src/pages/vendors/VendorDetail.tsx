import React from 'react'
import { useParams } from 'react-router-dom'
import { Box, Card, CardContent, Typography, Divider, Rating, Avatar } from '@mui/material'
import Grid from '@mui/material/Grid2'
import { Phone as PhoneIcon, Email as EmailIcon, LocationOn as LocationIcon } from '@mui/icons-material'
import { PageHeader, MEPCategoryChip } from '../../components/common'
import { getVendorById } from '../../data'
import { formatDate } from '../../utils/formatters'

const VendorDetail: React.FC = () => {
  const { vendorId } = useParams<{ vendorId: string }>()
  const vendor = getVendorById(vendorId || '')

  if (!vendor) {
    return (
      <Box sx={{ textAlign: 'center', py: 8 }}>
        <Typography variant="h6" color="text.secondary">Vendor not found</Typography>
      </Box>
    )
  }

  return (
    <Box>
      <PageHeader
        title={vendor.name}
        breadcrumbs={[
          { label: 'Vendors', path: '/vendors' },
          { label: vendor.name },
        ]}
      />

      <Grid container spacing={3}>
        <Grid size={{ xs: 12, md: 6 }}>
          <Card>
            <CardContent>
              <Typography variant="h6" fontWeight={600} gutterBottom>Vendor Information</Typography>
              <Divider sx={{ my: 2 }} />

              <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 1, mb: 3 }}>
                {vendor.mepSpecialties.map(spec => (
                  <MEPCategoryChip key={spec} category={spec} />
                ))}
              </Box>

              <Box sx={{ display: 'flex', flexDirection: 'column', gap: 1.5 }}>
                <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                  <Avatar sx={{ width: 28, height: 28, bgcolor: 'primary.light', fontSize: 12 }}>
                    {vendor.contactPerson.charAt(0)}
                  </Avatar>
                  <Typography variant="body2">{vendor.contactPerson}</Typography>
                </Box>
                <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                  <PhoneIcon sx={{ fontSize: 18, color: 'text.secondary' }} />
                  <Typography variant="body2">{vendor.phone}</Typography>
                </Box>
                <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                  <EmailIcon sx={{ fontSize: 18, color: 'text.secondary' }} />
                  <Typography variant="body2">{vendor.email}</Typography>
                </Box>
                <Box sx={{ display: 'flex', alignItems: 'flex-start', gap: 1 }}>
                  <LocationIcon sx={{ fontSize: 18, color: 'text.secondary' }} />
                  <Typography variant="body2">{vendor.address}</Typography>
                </Box>
              </Box>
            </CardContent>
          </Card>
        </Grid>

        <Grid size={{ xs: 12, md: 6 }}>
          <Card sx={{ mb: 3 }}>
            <CardContent>
              <Typography variant="h6" fontWeight={600} gutterBottom>Contract Details</Typography>
              <Divider sx={{ my: 2 }} />
              {vendor.contractNumber ? (
                <Box sx={{ display: 'flex', flexDirection: 'column', gap: 1 }}>
                  <Box>
                    <Typography variant="caption" color="text.secondary">Contract Number</Typography>
                    <Typography variant="body2">{vendor.contractNumber}</Typography>
                  </Box>
                  <Box>
                    <Typography variant="caption" color="text.secondary">Service Level</Typography>
                    <Typography variant="body2">{vendor.serviceLevel}</Typography>
                  </Box>
                  <Box>
                    <Typography variant="caption" color="text.secondary">Contract Period</Typography>
                    <Typography variant="body2">
                      {formatDate(vendor.contractStartDate!)} - {formatDate(vendor.contractEndDate!)}
                    </Typography>
                  </Box>
                </Box>
              ) : (
                <Typography variant="body2" color="text.secondary">No active contract</Typography>
              )}
            </CardContent>
          </Card>

          <Card>
            <CardContent>
              <Typography variant="h6" fontWeight={600} gutterBottom>Performance</Typography>
              <Divider sx={{ my: 2 }} />
              <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2 }}>
                <Box>
                  <Typography variant="body2" color="text.secondary" gutterBottom>Delivery Rating</Typography>
                  <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                    <Rating value={vendor.deliveryRating || 0} precision={0.1} readOnly />
                    <Typography variant="body2">{vendor.deliveryRating || '-'}</Typography>
                  </Box>
                </Box>
                <Box>
                  <Typography variant="body2" color="text.secondary" gutterBottom>Quality Rating</Typography>
                  <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                    <Rating value={vendor.qualityRating || 0} precision={0.1} readOnly />
                    <Typography variant="body2">{vendor.qualityRating || '-'}</Typography>
                  </Box>
                </Box>
              </Box>
            </CardContent>
          </Card>
        </Grid>
      </Grid>
    </Box>
  )
}

export default VendorDetail
