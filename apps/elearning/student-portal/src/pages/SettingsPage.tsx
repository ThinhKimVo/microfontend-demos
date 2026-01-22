import { useState } from 'react';
import {
  Box,
  Container,
  Typography,
  Card,
  CardContent,
  Switch,
  FormControlLabel,
  Divider,
  Button,
  TextField,
  IconButton,
  InputAdornment,
  Alert,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogContentText,
  DialogActions,
} from '@mui/material';
import {
  Visibility,
  VisibilityOff,
  Delete as DeleteIcon,
  Save as SaveIcon,
} from '@mui/icons-material';
import { useAuth } from '../App';

export default function SettingsPage() {
  const { user } = useAuth();
  const [notifications, setNotifications] = useState({
    email: user?.notificationPreferences.email ?? true,
    push: user?.notificationPreferences.push ?? true,
    courseUpdates: user?.notificationPreferences.courseUpdates ?? true,
    promotions: user?.notificationPreferences.promotions ?? false,
    reminders: user?.notificationPreferences.reminders ?? true,
  });

  const [showPassword, setShowPassword] = useState(false);
  const [passwordData, setPasswordData] = useState({
    current: '',
    new: '',
    confirm: '',
  });
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);
  const [saved, setSaved] = useState(false);

  const handleNotificationChange = (key: keyof typeof notifications) => {
    setNotifications(prev => ({ ...prev, [key]: !prev[key] }));
  };

  const handleSavePassword = () => {
    setSaved(true);
    setPasswordData({ current: '', new: '', confirm: '' });
    setTimeout(() => setSaved(false), 3000);
  };

  return (
    <Box sx={{ bgcolor: 'grey.50', minHeight: '100vh', py: 4 }}>
      <Container maxWidth="md">
        <Typography variant="h4" fontWeight={700} gutterBottom>
          Settings
        </Typography>
        <Typography variant="body1" color="text.secondary" sx={{ mb: 4 }}>
          Manage your account settings and preferences
        </Typography>

        {saved && (
          <Alert severity="success" sx={{ mb: 3 }}>
            Settings saved successfully!
          </Alert>
        )}

        {/* Notification Settings */}
        <Card sx={{ mb: 3 }}>
          <CardContent>
            <Typography variant="h6" fontWeight={600} gutterBottom>
              Notification Preferences
            </Typography>
            <Typography variant="body2" color="text.secondary" sx={{ mb: 3 }}>
              Choose how you want to receive notifications
            </Typography>

            <Box sx={{ display: 'flex', flexDirection: 'column', gap: 1 }}>
              <FormControlLabel
                control={
                  <Switch
                    checked={notifications.email}
                    onChange={() => handleNotificationChange('email')}
                  />
                }
                label={
                  <Box>
                    <Typography variant="body1">Email Notifications</Typography>
                    <Typography variant="body2" color="text.secondary">
                      Receive updates via email
                    </Typography>
                  </Box>
                }
                sx={{ ml: 0, py: 1 }}
              />

              <FormControlLabel
                control={
                  <Switch
                    checked={notifications.push}
                    onChange={() => handleNotificationChange('push')}
                  />
                }
                label={
                  <Box>
                    <Typography variant="body1">Push Notifications</Typography>
                    <Typography variant="body2" color="text.secondary">
                      Receive notifications on your device
                    </Typography>
                  </Box>
                }
                sx={{ ml: 0, py: 1 }}
              />

              <Divider sx={{ my: 2 }} />

              <FormControlLabel
                control={
                  <Switch
                    checked={notifications.courseUpdates}
                    onChange={() => handleNotificationChange('courseUpdates')}
                  />
                }
                label={
                  <Box>
                    <Typography variant="body1">Course Updates</Typography>
                    <Typography variant="body2" color="text.secondary">
                      New lessons, content updates
                    </Typography>
                  </Box>
                }
                sx={{ ml: 0, py: 1 }}
              />

              <FormControlLabel
                control={
                  <Switch
                    checked={notifications.reminders}
                    onChange={() => handleNotificationChange('reminders')}
                  />
                }
                label={
                  <Box>
                    <Typography variant="body1">Learning Reminders</Typography>
                    <Typography variant="body2" color="text.secondary">
                      Deadline reminders and study nudges
                    </Typography>
                  </Box>
                }
                sx={{ ml: 0, py: 1 }}
              />

              <FormControlLabel
                control={
                  <Switch
                    checked={notifications.promotions}
                    onChange={() => handleNotificationChange('promotions')}
                  />
                }
                label={
                  <Box>
                    <Typography variant="body1">Promotional Emails</Typography>
                    <Typography variant="body2" color="text.secondary">
                      Special offers, new courses
                    </Typography>
                  </Box>
                }
                sx={{ ml: 0, py: 1 }}
              />
            </Box>
          </CardContent>
        </Card>

        {/* Change Password */}
        <Card sx={{ mb: 3 }}>
          <CardContent>
            <Typography variant="h6" fontWeight={600} gutterBottom>
              Change Password
            </Typography>
            <Typography variant="body2" color="text.secondary" sx={{ mb: 3 }}>
              Update your password to keep your account secure
            </Typography>

            <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2, maxWidth: 400 }}>
              <TextField
                fullWidth
                label="Current Password"
                type={showPassword ? 'text' : 'password'}
                value={passwordData.current}
                onChange={(e) => setPasswordData({ ...passwordData, current: e.target.value })}
                slotProps={{
                  input: {
                    endAdornment: (
                      <InputAdornment position="end">
                        <IconButton onClick={() => setShowPassword(!showPassword)} edge="end">
                          {showPassword ? <VisibilityOff /> : <Visibility />}
                        </IconButton>
                      </InputAdornment>
                    ),
                  },
                }}
              />
              <TextField
                fullWidth
                label="New Password"
                type={showPassword ? 'text' : 'password'}
                value={passwordData.new}
                onChange={(e) => setPasswordData({ ...passwordData, new: e.target.value })}
              />
              <TextField
                fullWidth
                label="Confirm New Password"
                type={showPassword ? 'text' : 'password'}
                value={passwordData.confirm}
                onChange={(e) => setPasswordData({ ...passwordData, confirm: e.target.value })}
              />
              <Button
                variant="contained"
                onClick={handleSavePassword}
                startIcon={<SaveIcon />}
                sx={{ alignSelf: 'flex-start' }}
              >
                Update Password
              </Button>
            </Box>
          </CardContent>
        </Card>

        {/* Danger Zone */}
        <Card sx={{ borderColor: 'error.main', borderWidth: 1, borderStyle: 'solid' }}>
          <CardContent>
            <Typography variant="h6" fontWeight={600} color="error" gutterBottom>
              Danger Zone
            </Typography>
            <Typography variant="body2" color="text.secondary" sx={{ mb: 3 }}>
              Permanently delete your account and all associated data
            </Typography>
            <Button
              variant="outlined"
              color="error"
              startIcon={<DeleteIcon />}
              onClick={() => setDeleteDialogOpen(true)}
            >
              Delete Account
            </Button>
          </CardContent>
        </Card>

        {/* Delete Confirmation Dialog */}
        <Dialog open={deleteDialogOpen} onClose={() => setDeleteDialogOpen(false)}>
          <DialogTitle>Delete Account</DialogTitle>
          <DialogContent>
            <DialogContentText>
              Are you sure you want to delete your account? This action cannot be undone.
              All your data, including enrolled courses and certificates, will be permanently deleted.
            </DialogContentText>
          </DialogContent>
          <DialogActions>
            <Button onClick={() => setDeleteDialogOpen(false)}>Cancel</Button>
            <Button color="error" variant="contained">
              Delete Account
            </Button>
          </DialogActions>
        </Dialog>
      </Container>
    </Box>
  );
}
