import { useState } from 'react';
import {
  Box,
  Typography,
  Card,
  CardContent,
  Grid,
  TextField,
  Button,
  Avatar,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  Alert,
} from '@mui/material';
import { PhotoCamera as CameraIcon, Save as SaveIcon } from '@mui/icons-material';
import { useAuth } from '../../App';
import { Teacher } from '../../data/types';

export default function TeacherSettings() {
  const { user } = useAuth();
  const teacher = user as Teacher;
  const [saved, setSaved] = useState(false);

  const handleSave = () => {
    setSaved(true);
    setTimeout(() => setSaved(false), 3000);
  };

  return (
    <Box>
      <Typography variant="h4" fontWeight={700} sx={{ mb: 3 }}>
        Settings
      </Typography>

      {saved && <Alert severity="success" sx={{ mb: 3 }}>Settings saved successfully!</Alert>}

      <Grid container spacing={3}>
        {/* Profile */}
        <Grid size={{ xs: 12, md: 8 }}>
          <Card>
            <CardContent>
              <Typography variant="h6" fontWeight={600} gutterBottom>
                Profile Information
              </Typography>
              <Box sx={{ display: 'flex', alignItems: 'center', gap: 3, mb: 3 }}>
                <Box sx={{ position: 'relative' }}>
                  <Avatar src={teacher?.avatar} sx={{ width: 80, height: 80 }} />
                  <Button
                    size="small"
                    sx={{
                      position: 'absolute',
                      bottom: -8,
                      right: -8,
                      minWidth: 32,
                      width: 32,
                      height: 32,
                      borderRadius: '50%',
                      p: 0,
                    }}
                    variant="contained"
                  >
                    <CameraIcon fontSize="small" />
                  </Button>
                </Box>
                <Box>
                  <Typography variant="subtitle1" fontWeight={600}>
                    {teacher?.firstName} {teacher?.lastName}
                  </Typography>
                  <Typography variant="body2" color="text.secondary">
                    {teacher?.email}
                  </Typography>
                </Box>
              </Box>

              <Grid container spacing={2}>
                <Grid size={{ xs: 12, sm: 6 }}>
                  <TextField fullWidth label="First Name" defaultValue={teacher?.firstName} />
                </Grid>
                <Grid size={{ xs: 12, sm: 6 }}>
                  <TextField fullWidth label="Last Name" defaultValue={teacher?.lastName} />
                </Grid>
                <Grid size={12}>
                  <TextField fullWidth label="Email" defaultValue={teacher?.email} type="email" />
                </Grid>
                <Grid size={12}>
                  <TextField
                    fullWidth
                    label="Bio"
                    defaultValue={teacher?.bio}
                    multiline
                    rows={4}
                  />
                </Grid>
                <Grid size={12}>
                  <TextField
                    fullWidth
                    label="Expertise (comma-separated)"
                    defaultValue={teacher?.expertise?.join(', ')}
                  />
                </Grid>
              </Grid>
            </CardContent>
          </Card>
        </Grid>

        {/* Payout Settings */}
        <Grid size={{ xs: 12, md: 4 }}>
          <Card sx={{ mb: 3 }}>
            <CardContent>
              <Typography variant="h6" fontWeight={600} gutterBottom>
                Payout Settings
              </Typography>
              <FormControl fullWidth sx={{ mb: 2 }}>
                <InputLabel>Payout Method</InputLabel>
                <Select defaultValue="bank" label="Payout Method">
                  <MenuItem value="bank">Bank Transfer</MenuItem>
                  <MenuItem value="paypal">PayPal</MenuItem>
                </Select>
              </FormControl>
              <TextField
                fullWidth
                label="Account Details"
                defaultValue={teacher?.payoutInfo?.accountDetails}
                sx={{ mb: 2 }}
              />
              <Box sx={{ p: 2, bgcolor: 'grey.50', borderRadius: 2 }}>
                <Typography variant="body2" color="text.secondary">
                  Commission Rate: <strong>{teacher?.commissionRate}%</strong>
                </Typography>
              </Box>
            </CardContent>
          </Card>

          <Card>
            <CardContent>
              <Typography variant="h6" fontWeight={600} gutterBottom>
                Notifications
              </Typography>
              <Typography variant="body2" color="text.secondary" sx={{ mb: 2 }}>
                Manage your notification preferences
              </Typography>
              <Button variant="outlined" fullWidth>
                Manage Notifications
              </Button>
            </CardContent>
          </Card>
        </Grid>

        <Grid size={12}>
          <Box sx={{ display: 'flex', justifyContent: 'flex-end' }}>
            <Button variant="contained" startIcon={<SaveIcon />} onClick={handleSave}>
              Save Changes
            </Button>
          </Box>
        </Grid>
      </Grid>
    </Box>
  );
}
