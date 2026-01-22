import React from 'react';
import {
  Box,
  Card,
  CardContent,
  CardHeader,
  Typography,
  Divider,
  List,
  ListItem,
  ListItemText,
  Switch,
  TextField,
  Button,
  Grid,
  Alert,
} from '@mui/material';
import { useAuth } from '../contexts/AuthContext';

function Settings() {
  const { user } = useAuth();

  return (
    <Box>
      <Grid container spacing={3}>
        {/* Profile Section */}
        <Grid size={{ xs: 12, md: 6 }}>
          <Card>
            <CardHeader title="Profile" />
            <CardContent>
              <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2 }}>
                <TextField
                  label="Display Name"
                  value={user?.displayName || ''}
                  disabled
                  fullWidth
                />
                <TextField
                  label="Email"
                  value={user?.email || ''}
                  disabled
                  fullWidth
                />
                <Alert severity="info" sx={{ mt: 1 }}>
                  Contact your administrator to update profile information.
                </Alert>
              </Box>
            </CardContent>
          </Card>
        </Grid>

        {/* Notification Settings */}
        <Grid size={{ xs: 12, md: 6 }}>
          <Card>
            <CardHeader title="Notifications" />
            <CardContent>
              <List disablePadding>
                <ListItem sx={{ px: 0 }}>
                  <ListItemText
                    primary="Maintenance Reminders"
                    secondary="Show alerts for upcoming maintenance"
                  />
                  <Switch defaultChecked />
                </ListItem>
                <Divider />
                <ListItem sx={{ px: 0 }}>
                  <ListItemText
                    primary="Overdue Alerts"
                    secondary="Highlight overdue maintenance tasks"
                  />
                  <Switch defaultChecked />
                </ListItem>
                <Divider />
                <ListItem sx={{ px: 0 }}>
                  <ListItemText
                    primary="Warranty Expiration"
                    secondary="Alert when warranties are expiring"
                  />
                  <Switch defaultChecked />
                </ListItem>
              </List>
            </CardContent>
          </Card>
        </Grid>

        {/* System Info */}
        <Grid size={12}>
          <Card>
            <CardHeader title="System Information" />
            <CardContent>
              <Grid container spacing={2}>
                <Grid size={{ xs: 12, sm: 6, md: 3 }}>
                  <Typography variant="overline" color="text.secondary">
                    Version
                  </Typography>
                  <Typography variant="body1">1.0.0</Typography>
                </Grid>
                <Grid size={{ xs: 12, sm: 6, md: 3 }}>
                  <Typography variant="overline" color="text.secondary">
                    Database
                  </Typography>
                  <Typography variant="body1">Firebase Firestore</Typography>
                </Grid>
                <Grid size={{ xs: 12, sm: 6, md: 3 }}>
                  <Typography variant="overline" color="text.secondary">
                    Authentication
                  </Typography>
                  <Typography variant="body1">Firebase Auth</Typography>
                </Grid>
                <Grid size={{ xs: 12, sm: 6, md: 3 }}>
                  <Typography variant="overline" color="text.secondary">
                    UI Framework
                  </Typography>
                  <Typography variant="body1">MUI v7</Typography>
                </Grid>
              </Grid>
            </CardContent>
          </Card>
        </Grid>
      </Grid>
    </Box>
  );
}

export default Settings;
