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
  IconButton,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  TextField,
  Snackbar,
  Alert,
} from '@mui/material';
import { Add as AddIcon, Edit as EditIcon, Delete as DeleteIcon, DragIndicator as DragIcon } from '@mui/icons-material';
import { categories as initialCategories } from '../../data/mockData';

export default function AdminCategories() {
  const [categories, setCategories] = useState(initialCategories);
  const [dialogOpen, setDialogOpen] = useState(false);
  const [editingCategory, setEditingCategory] = useState<typeof initialCategories[0] | null>(null);
  const [formData, setFormData] = useState({ name: '', description: '' });
  const [snackbarOpen, setSnackbarOpen] = useState(false);
  const [snackbarMessage, setSnackbarMessage] = useState('');

  const handleEdit = (cat: typeof initialCategories[0]) => {
    setEditingCategory(cat);
    setFormData({ name: cat.name, description: cat.description });
    setDialogOpen(true);
  };

  const handleAdd = () => {
    setEditingCategory(null);
    setFormData({ name: '', description: '' });
    setDialogOpen(true);
  };

  const handleDelete = (catId: string) => {
    const cat = categories.find(c => c.id === catId);
    setCategories(categories.filter(c => c.id !== catId));
    setSnackbarMessage(`Category "${cat?.name}" has been deleted`);
    setSnackbarOpen(true);
  };

  const handleSave = () => {
    if (editingCategory) {
      setSnackbarMessage(`Category "${formData.name}" has been updated`);
    } else {
      setSnackbarMessage(`Category "${formData.name}" has been created`);
    }
    setSnackbarOpen(true);
    setDialogOpen(false);
  };

  return (
    <Box>
      <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 3 }}>
        <Typography variant="h4" fontWeight={700}>Categories</Typography>
        <Button variant="contained" startIcon={<AddIcon />} onClick={handleAdd}>Add Category</Button>
      </Box>

      <Card>
        <TableContainer>
          <Table>
            <TableHead>
              <TableRow>
                <TableCell width={50}></TableCell>
                <TableCell>Name</TableCell>
                <TableCell>Slug</TableCell>
                <TableCell>Description</TableCell>
                <TableCell align="right">Courses</TableCell>
                <TableCell width={100}>Actions</TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {categories.map(cat => (
                <TableRow key={cat.id} hover>
                  <TableCell><DragIcon sx={{ color: 'grey.400', cursor: 'grab' }} /></TableCell>
                  <TableCell><Typography variant="body2" fontWeight={600}>{cat.name}</Typography></TableCell>
                  <TableCell><Typography variant="body2" color="text.secondary">{cat.slug}</Typography></TableCell>
                  <TableCell><Typography variant="body2" color="text.secondary">{cat.description}</Typography></TableCell>
                  <TableCell align="right">{cat.courseCount}</TableCell>
                  <TableCell>
                    <IconButton size="small" onClick={() => handleEdit(cat)}><EditIcon fontSize="small" /></IconButton>
                    <IconButton size="small" color="error" onClick={() => handleDelete(cat.id)}><DeleteIcon fontSize="small" /></IconButton>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </TableContainer>
      </Card>

      <Dialog open={dialogOpen} onClose={() => setDialogOpen(false)} maxWidth="sm" fullWidth>
        <DialogTitle>{editingCategory ? 'Edit Category' : 'Add Category'}</DialogTitle>
        <DialogContent>
          <TextField
            fullWidth
            label="Category Name"
            value={formData.name}
            onChange={(e) => setFormData({ ...formData, name: e.target.value })}
            sx={{ mt: 2, mb: 2 }}
          />
          <TextField
            fullWidth
            label="Description"
            value={formData.description}
            onChange={(e) => setFormData({ ...formData, description: e.target.value })}
            multiline
            rows={3}
          />
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setDialogOpen(false)}>Cancel</Button>
          <Button variant="contained" onClick={handleSave}>{editingCategory ? 'Save' : 'Create'}</Button>
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
