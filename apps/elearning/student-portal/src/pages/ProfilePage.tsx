import { useState, useRef } from 'react';
import {
  Box,
  Container,
  Typography,
  Grid,
  Card,
  CardContent,
  Avatar,
  Button,
  TextField,
  Divider,
  Alert,
  Snackbar,
  alpha,
  useTheme,
  Chip,
} from '@mui/material';
import {
  PhotoCamera as CameraIcon,
  Save as SaveIcon,
  Person as PersonIcon,
  Verified as VerifiedIcon,
} from '@mui/icons-material';
import { useAuth } from '../App';

export default function ProfilePage() {
  const theme = useTheme();
  const { user } = useAuth();
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [editing, setEditing] = useState(false);
  const [saved, setSaved] = useState(false);
  const [avatarUrl, setAvatarUrl] = useState(user?.avatar || '');
  const [snackbarOpen, setSnackbarOpen] = useState(false);
  const [snackbarMessage, setSnackbarMessage] = useState('');
  const [formData, setFormData] = useState({
    firstName: user?.firstName || '',
    lastName: user?.lastName || '',
    email: user?.email || '',
    bio: user?.bio || '',
  });

  const handleUploadClick = () => {
    fileInputRef.current?.click();
  };

  const handleFileChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        setAvatarUrl(reader.result as string);
        setSnackbarMessage('Profile picture updated!');
        setSnackbarOpen(true);
      };
      reader.readAsDataURL(file);
    }
  };

  const handleChange = (field: string) => (e: React.ChangeEvent<HTMLInputElement>) => {
    setFormData(prev => ({ ...prev, [field]: e.target.value }));
  };

  const handleSave = () => {
    setSaved(true);
    setEditing(false);
    setTimeout(() => setSaved(false), 3000);
  };

  return (
    <Box sx={{ bgcolor: 'grey.50', minHeight: '100vh', py: { xs: 3, sm: 4, md: 5 } }}>
      <Container maxWidth="md" sx={{ px: { xs: 2, sm: 3, md: 4 } }}>
        <Box sx={{ display: 'flex', alignItems: 'center', gap: 1.5, mb: 1 }}>
          <PersonIcon sx={{ color: 'primary.main', fontSize: { xs: 28, sm: 32 } }} />
          <Typography 
            variant="h4" 
            fontWeight={800}
            sx={{ fontSize: { xs: '1.5rem', sm: '1.75rem', md: '2rem' } }}
          >
            My Profile
          </Typography>
        </Box>
        <Typography variant="body1" color="text.secondary" sx={{ mb: { xs: 3, sm: 4 } }}>
          Manage your personal information
        </Typography>

        {saved && (
          <Alert severity="success" sx={{ mb: 3, borderRadius: 2 }}>
            Profile updated successfully!
          </Alert>
        )}

        <Grid container spacing={{ xs: 2, sm: 3 }}>
          {/* Profile Picture */}
          <Grid size={{ xs: 12, md: 4 }}>
            <Card sx={{ borderRadius: 3 }}>
              <CardContent sx={{ textAlign: 'center', py: { xs: 4, sm: 5 } }}>
                <Box sx={{ position: 'relative', display: 'inline-block', mb: 3 }}>
                  <input
                    type="file"
                    ref={fileInputRef}
                    onChange={handleFileChange}
                    accept="image/*"
                    style={{ display: 'none' }}
                  />
                  <Avatar
                    src={avatarUrl || user?.avatar}
                    sx={{ 
                      width: { xs: 100, sm: 120 }, 
                      height: { xs: 100, sm: 120 }, 
                      mx: 'auto',
                      border: '4px solid',
                      borderColor: alpha(theme.palette.primary.main, 0.2),
                      fontSize: '2.5rem',
                    }}
                  >
                    {user?.firstName?.[0]}
                  </Avatar>
                  <Button
                    variant="contained"
                    size="small"
                    onClick={handleUploadClick}
                    sx={{
                      position: 'absolute',
                      bottom: 4,
                      right: 4,
                      minWidth: 36,
                      width: 36,
                      height: 36,
                      borderRadius: '50%',
                      p: 0,
                      boxShadow: 2,
                    }}
                  >
                    <CameraIcon fontSize="small" />
                  </Button>
                </Box>
                <Typography variant="h6" fontWeight={700}>
                  {user?.firstName} {user?.lastName}
                </Typography>
                <Chip
                  label="Student"
                  size="small"
                  sx={{ 
                    mt: 1,
                    bgcolor: alpha(theme.palette.primary.main, 0.1),
                    color: 'primary.main',
                    fontWeight: 600,
                  }}
                />
              </CardContent>
            </Card>
          </Grid>

          {/* Profile Form */}
          <Grid size={{ xs: 12, md: 8 }}>
            <Card sx={{ borderRadius: 3 }}>
              <CardContent sx={{ p: { xs: 2.5, sm: 3, md: 4 } }}>
                <Box 
                  sx={{ 
                    display: 'flex', 
                    justifyContent: 'space-between', 
                    alignItems: 'center', 
                    mb: 3,
                    flexWrap: 'wrap',
                    gap: 2,
                  }}
                >
                  <Typography variant="h6" fontWeight={700}>
                    Personal Information
                  </Typography>
                  {!editing ? (
                    <Button variant="outlined" onClick={() => setEditing(true)} sx={{ borderRadius: 2 }}>
                      Edit
                    </Button>
                  ) : (
                    <Box sx={{ display: 'flex', gap: 1 }}>
                      <Button variant="outlined" onClick={() => setEditing(false)} sx={{ borderRadius: 2 }}>
                        Cancel
                      </Button>
                      <Button variant="contained" onClick={handleSave} startIcon={<SaveIcon />} sx={{ borderRadius: 2 }}>
                        Save
                      </Button>
                    </Box>
                  )}
                </Box>

                <Grid container spacing={{ xs: 2, sm: 3 }}>
                  <Grid size={{ xs: 12, sm: 6 }}>
                    <TextField
                      fullWidth
                      label="First Name"
                      value={formData.firstName}
                      onChange={handleChange('firstName')}
                      disabled={!editing}
                    />
                  </Grid>
                  <Grid size={{ xs: 12, sm: 6 }}>
                    <TextField
                      fullWidth
                      label="Last Name"
                      value={formData.lastName}
                      onChange={handleChange('lastName')}
                      disabled={!editing}
                    />
                  </Grid>
                  <Grid size={12}>
                    <TextField
                      fullWidth
                      label="Email Address"
                      value={formData.email}
                      onChange={handleChange('email')}
                      disabled={!editing}
                      type="email"
                    />
                  </Grid>
                  <Grid size={12}>
                    <TextField
                      fullWidth
                      label="Bio"
                      value={formData.bio}
                      onChange={handleChange('bio')}
                      disabled={!editing}
                      multiline
                      rows={4}
                      placeholder="Tell us about yourself..."
                    />
                  </Grid>
                </Grid>

                <Divider sx={{ my: 4 }} />

                <Typography variant="h6" fontWeight={700} gutterBottom sx={{ mb: 2.5 }}>
                  Account Details
                </Typography>
                <Grid container spacing={2}>
                  <Grid size={{ xs: 12, sm: 6 }}>
                    <Box 
                      sx={{ 
                        p: 2, 
                        bgcolor: 'grey.50', 
                        borderRadius: 2,
                        border: '1px solid',
                        borderColor: 'grey.100',
                      }}
                    >
                      <Typography variant="body2" color="text.secondary" fontWeight={500} sx={{ mb: 0.5 }}>
                        Member Since
                      </Typography>
                      <Typography variant="body1" fontWeight={600}>
                        {new Date(user?.createdAt || '').toLocaleDateString('en-US', {
                          year: 'numeric',
                          month: 'long',
                          day: 'numeric',
                        })}
                      </Typography>
                    </Box>
                  </Grid>
                  <Grid size={{ xs: 12, sm: 6 }}>
                    <Box 
                      sx={{ 
                        p: 2, 
                        bgcolor: 'grey.50', 
                        borderRadius: 2,
                        border: '1px solid',
                        borderColor: 'grey.100',
                      }}
                    >
                      <Typography variant="body2" color="text.secondary" fontWeight={500} sx={{ mb: 0.5 }}>
                        Last Login
                      </Typography>
                      <Typography variant="body1" fontWeight={600}>
                        {new Date(user?.lastLogin || '').toLocaleDateString('en-US', {
                          year: 'numeric',
                          month: 'long',
                          day: 'numeric',
                        })}
                      </Typography>
                    </Box>
                  </Grid>
                  <Grid size={{ xs: 12, sm: 6 }}>
                    <Box 
                      sx={{ 
                        p: 2, 
                        bgcolor: user?.isVerified ? alpha(theme.palette.success.main, 0.08) : alpha(theme.palette.error.main, 0.08), 
                        borderRadius: 2,
                        border: '1px solid',
                        borderColor: user?.isVerified ? alpha(theme.palette.success.main, 0.2) : alpha(theme.palette.error.main, 0.2),
                      }}
                    >
                      <Typography variant="body2" color="text.secondary" fontWeight={500} sx={{ mb: 0.5 }}>
                        Email Status
                      </Typography>
                      <Box sx={{ display: 'flex', alignItems: 'center', gap: 0.5 }}>
                        {user?.isVerified && <VerifiedIcon sx={{ fontSize: 18, color: 'success.main' }} />}
                        <Typography variant="body1" fontWeight={600} color={user?.isVerified ? 'success.main' : 'error.main'}>
                          {user?.isVerified ? 'Verified' : 'Not Verified'}
                        </Typography>
                      </Box>
                    </Box>
                  </Grid>
                </Grid>
              </CardContent>
            </Card>
          </Grid>
        </Grid>

        <Snackbar
          open={snackbarOpen}
          autoHideDuration={3000}
          onClose={() => setSnackbarOpen(false)}
          anchorOrigin={{ vertical: 'bottom', horizontal: 'center' }}
        >
          <Alert onClose={() => setSnackbarOpen(false)} severity="success" sx={{ width: '100%', borderRadius: 2 }}>
            {snackbarMessage}
          </Alert>
        </Snackbar>
      </Container>
    </Box>
  );
}
