import { useState } from 'react';
import {
  Box,
  Typography,
  Card,
  CardContent,
  Grid,
  TextField,
  Button,
  Switch,
  FormControlLabel,
  Divider,
  Alert,
  Tabs,
  Tab,
} from '@mui/material';
import { Save as SaveIcon } from '@mui/icons-material';

export default function AdminSettings() {
  const [tabValue, setTabValue] = useState(0);
  const [saved, setSaved] = useState(false);

  const handleSave = () => {
    setSaved(true);
    setTimeout(() => setSaved(false), 3000);
  };

  return (
    <Box>
      <Typography variant="h4" fontWeight={700} sx={{ mb: 3 }}>Platform Settings</Typography>

      {saved && <Alert severity="success" sx={{ mb: 3 }}>Settings saved successfully!</Alert>}

      <Card>
        <Tabs value={tabValue} onChange={(_, v) => setTabValue(v)} sx={{ borderBottom: 1, borderColor: 'divider' }}>
          <Tab label="General" />
          <Tab label="Payment" />
          <Tab label="Email" />
          <Tab label="Security" />
        </Tabs>

        <CardContent>
          {tabValue === 0 && (
            <Grid container spacing={3}>
              <Grid size={12}><Typography variant="h6" fontWeight={600}>General Settings</Typography></Grid>
              <Grid size={{ xs: 12, md: 6 }}><TextField fullWidth label="Platform Name" defaultValue="EduLearn" /></Grid>
              <Grid size={{ xs: 12, md: 6 }}><TextField fullWidth label="Support Email" defaultValue="support@edulearn.com" /></Grid>
              <Grid size={12}><TextField fullWidth label="Platform Description" defaultValue="Online learning platform" multiline rows={3} /></Grid>
              <Grid size={{ xs: 12, md: 6 }}>
                <FormControlLabel control={<Switch defaultChecked />} label="Enable User Registration" />
              </Grid>
              <Grid size={{ xs: 12, md: 6 }}>
                <FormControlLabel control={<Switch defaultChecked />} label="Require Email Verification" />
              </Grid>
            </Grid>
          )}

          {tabValue === 1 && (
            <Grid container spacing={3}>
              <Grid size={12}><Typography variant="h6" fontWeight={600}>Payment Settings</Typography></Grid>
              <Grid size={{ xs: 12, md: 6 }}><TextField fullWidth label="Platform Commission (%)" type="number" defaultValue="30" /></Grid>
              <Grid size={{ xs: 12, md: 6 }}><TextField fullWidth label="Minimum Payout Amount ($)" type="number" defaultValue="50" /></Grid>
              <Grid size={{ xs: 12, md: 6 }}><TextField fullWidth label="Stripe Public Key" type="password" defaultValue="pk_live_xxx" /></Grid>
              <Grid size={{ xs: 12, md: 6 }}><TextField fullWidth label="Stripe Secret Key" type="password" defaultValue="sk_live_xxx" /></Grid>
              <Grid size={{ xs: 12, md: 6 }}><TextField fullWidth label="PayPal Client ID" type="password" defaultValue="xxx" /></Grid>
              <Grid size={{ xs: 12, md: 6 }}><TextField fullWidth label="PayPal Secret" type="password" defaultValue="xxx" /></Grid>
            </Grid>
          )}

          {tabValue === 2 && (
            <Grid container spacing={3}>
              <Grid size={12}><Typography variant="h6" fontWeight={600}>Email Settings</Typography></Grid>
              <Grid size={{ xs: 12, md: 6 }}><TextField fullWidth label="SMTP Host" defaultValue="smtp.sendgrid.net" /></Grid>
              <Grid size={{ xs: 12, md: 6 }}><TextField fullWidth label="SMTP Port" defaultValue="587" /></Grid>
              <Grid size={{ xs: 12, md: 6 }}><TextField fullWidth label="SMTP Username" defaultValue="apikey" /></Grid>
              <Grid size={{ xs: 12, md: 6 }}><TextField fullWidth label="SMTP Password" type="password" /></Grid>
              <Grid size={12}><TextField fullWidth label="From Email" defaultValue="noreply@edulearn.com" /></Grid>
              <Grid size={12}><TextField fullWidth label="From Name" defaultValue="EduLearn" /></Grid>
            </Grid>
          )}

          {tabValue === 3 && (
            <Grid container spacing={3}>
              <Grid size={12}><Typography variant="h6" fontWeight={600}>Security Settings</Typography></Grid>
              <Grid size={{ xs: 12, md: 6 }}>
                <FormControlLabel control={<Switch defaultChecked />} label="Enable Two-Factor Authentication" />
              </Grid>
              <Grid size={{ xs: 12, md: 6 }}>
                <FormControlLabel control={<Switch defaultChecked />} label="Account Lockout on Failed Logins" />
              </Grid>
              <Grid size={{ xs: 12, md: 6 }}><TextField fullWidth label="Failed Login Attempts" type="number" defaultValue="5" /></Grid>
              <Grid size={{ xs: 12, md: 6 }}><TextField fullWidth label="Session Timeout (minutes)" type="number" defaultValue="30" /></Grid>
            </Grid>
          )}

          <Divider sx={{ my: 3 }} />

          <Box sx={{ display: 'flex', justifyContent: 'flex-end' }}>
            <Button variant="contained" startIcon={<SaveIcon />} onClick={handleSave}>Save Settings</Button>
          </Box>
        </CardContent>
      </Card>
    </Box>
  );
}
