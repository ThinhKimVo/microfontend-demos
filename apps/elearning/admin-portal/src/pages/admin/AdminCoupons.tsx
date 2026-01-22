import { useState } from 'react';
import {
  Box,
  Typography,
  Card,
  Button,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Chip,
  IconButton,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  TextField,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  Grid,
  Snackbar,
  Alert,
} from '@mui/material';
import { Add as AddIcon, Edit as EditIcon, Delete as DeleteIcon } from '@mui/icons-material';
import { coupons as initialCoupons } from '../../data/mockData';

export default function AdminCoupons() {
  const [coupons, setCoupons] = useState(initialCoupons);
  const [dialogOpen, setDialogOpen] = useState(false);
  const [editingCoupon, setEditingCoupon] = useState<typeof initialCoupons[0] | null>(null);
  const [snackbarOpen, setSnackbarOpen] = useState(false);
  const [snackbarMessage, setSnackbarMessage] = useState('');

  const handleEdit = (coupon: typeof initialCoupons[0]) => {
    setEditingCoupon(coupon);
    setDialogOpen(true);
  };

  const handleCreate = () => {
    setEditingCoupon(null);
    setDialogOpen(true);
  };

  const handleDelete = (couponId: string) => {
    const coupon = coupons.find(c => c.id === couponId);
    setCoupons(coupons.filter(c => c.id !== couponId));
    setSnackbarMessage(`Coupon "${coupon?.code}" has been deleted`);
    setSnackbarOpen(true);
  };

  const handleSave = () => {
    if (editingCoupon) {
      setSnackbarMessage(`Coupon "${editingCoupon.code}" has been updated`);
    } else {
      setSnackbarMessage('New coupon created successfully!');
    }
    setSnackbarOpen(true);
    setDialogOpen(false);
  };

  return (
    <Box>
      <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 3 }}>
        <Typography variant="h4" fontWeight={700}>Coupons</Typography>
        <Button variant="contained" startIcon={<AddIcon />} onClick={handleCreate}>Create Coupon</Button>
      </Box>

      <Card>
        <TableContainer>
          <Table>
            <TableHead>
              <TableRow>
                <TableCell>Code</TableCell>
                <TableCell>Discount</TableCell>
                <TableCell>Usage</TableCell>
                <TableCell>Valid Until</TableCell>
                <TableCell>Applicable To</TableCell>
                <TableCell>Status</TableCell>
                <TableCell width={100}>Actions</TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {coupons.map(coupon => (
                <TableRow key={coupon.id} hover>
                  <TableCell><Typography variant="body2" fontWeight={600}>{coupon.code}</Typography></TableCell>
                  <TableCell>
                    {coupon.discountType === 'percentage'
                      ? `${coupon.discountValue}%`
                      : `$${coupon.discountValue}`}
                  </TableCell>
                  <TableCell>{coupon.usedCount} / {coupon.maxUses || '∞'}</TableCell>
                  <TableCell>{new Date(coupon.validUntil).toLocaleDateString()}</TableCell>
                  <TableCell>{coupon.applicableCourses === 'all' ? 'All Courses' : `${(coupon.applicableCourses as string[]).length} courses`}</TableCell>
                  <TableCell>
                    <Chip
                      label={coupon.status}
                      size="small"
                      color={coupon.status === 'active' ? 'success' : coupon.status === 'expired' ? 'error' : 'default'}
                    />
                  </TableCell>
                  <TableCell>
                    <IconButton size="small" onClick={() => handleEdit(coupon)}><EditIcon fontSize="small" /></IconButton>
                    <IconButton size="small" color="error" onClick={() => handleDelete(coupon.id)}><DeleteIcon fontSize="small" /></IconButton>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </TableContainer>
      </Card>

      <Dialog open={dialogOpen} onClose={() => setDialogOpen(false)} maxWidth="sm" fullWidth>
        <DialogTitle>{editingCoupon ? 'Edit Coupon' : 'Create Coupon'}</DialogTitle>
        <DialogContent>
          <Grid container spacing={2} sx={{ mt: 1 }}>
            <Grid size={12}><TextField fullWidth label="Coupon Code" placeholder="e.g., SAVE20" defaultValue={editingCoupon?.code || ''} /></Grid>
            <Grid size={6}>
              <FormControl fullWidth>
                <InputLabel>Discount Type</InputLabel>
                <Select defaultValue={editingCoupon?.discountType || 'percentage'} label="Discount Type">
                  <MenuItem value="percentage">Percentage</MenuItem>
                  <MenuItem value="fixed">Fixed Amount</MenuItem>
                </Select>
              </FormControl>
            </Grid>
            <Grid size={6}><TextField fullWidth label="Discount Value" type="number" defaultValue={editingCoupon?.discountValue || ''} /></Grid>
            <Grid size={6}><TextField fullWidth label="Max Uses" type="number" defaultValue={editingCoupon?.maxUses || ''} /></Grid>
            <Grid size={6}><TextField fullWidth label="Valid Until" type="date" slotProps={{ inputLabel: { shrink: true } }} /></Grid>
          </Grid>
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setDialogOpen(false)}>Cancel</Button>
          <Button variant="contained" onClick={handleSave}>{editingCoupon ? 'Save' : 'Create'}</Button>
        </DialogActions>
      </Dialog>

      <Snackbar
        open={snackbarOpen}
        autoHideDuration={3000}
        onClose={() => setSnackbarOpen(false)}
        anchorOrigin={{ vertical: 'bottom', horizontal: 'center' }}
      >
        <Alert onClose={() => setSnackbarOpen(false)} severity="success" sx={{ width: '100%' }}>
          {snackbarMessage}
        </Alert>
      </Snackbar>
    </Box>
  );
}
