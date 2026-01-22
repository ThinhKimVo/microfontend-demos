import React, { useState } from 'react';
import {
  Box,
  Typography,
  Paper,
  Button,
  Grid,
  Divider,
  List,
  ListItem,
  ListItemIcon,
  ListItemText,
  Chip,
  Alert,
  TextField,
  Radio,
  RadioGroup,
  FormControlLabel,
} from '@mui/material';
import CheckCircleIcon from '@mui/icons-material/CheckCircle';
import CreditCardIcon from '@mui/icons-material/CreditCard';
import HistoryIcon from '@mui/icons-material/History';

const SubscriptionPage: React.FC = () => {
  const [selectedPlan] = useState('monthly');
  void selectedPlan; // Used for future plan selection
  const [paymentMethod, setPaymentMethod] = useState('stripe');

  const currentStatus = {
    status: 'trial' as const,
    daysRemaining: 45,
    trialEndDate: '2025-02-15',
  };

  const planFeatures = [
    'Unlimited event submissions',
    'AI-powered URL import',
    'Analytics dashboard',
    'Priority support',
    'Featured event placement',
    'Multi-language support',
  ];

  const billingHistory = [
    { date: '2024-12-15', description: 'Trial Started', amount: 'Free' },
  ];

  return (
    <Box>
      <Typography variant="h4" fontWeight={700} gutterBottom>
        Subscription
      </Typography>
      <Typography variant="body1" color="text.secondary" sx={{ mb: 4 }}>
        Manage your subscription and billing
      </Typography>

      <Grid container spacing={4}>
        {/* Current Plan */}
        <Grid size={{ xs: 12, md: 8 }}>
          <Paper sx={{ p: 4, mb: 4 }}>
            <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 3 }}>
              <Typography variant="h6" fontWeight={600}>
                Current Plan
              </Typography>
              <Chip
                label={currentStatus.status === 'trial' ? 'Free Trial' : 'Active'}
                color={currentStatus.status === 'trial' ? 'info' : 'success'}
              />
            </Box>

            <Alert severity="info" sx={{ mb: 3 }}>
              Your free trial ends on <strong>{currentStatus.trialEndDate}</strong>.
              Subscribe now to continue using all features.
            </Alert>

            <Divider sx={{ my: 3 }} />

            <Typography variant="h5" fontWeight={700} color="primary" gutterBottom>
              Professional Plan
            </Typography>

            <Box sx={{ display: 'flex', alignItems: 'baseline', gap: 1, mb: 3 }}>
              <Typography variant="h3" fontWeight={700}>
                HK$180
              </Typography>
              <Typography variant="body1" color="text.secondary">
                / month
              </Typography>
            </Box>

            <List>
              {planFeatures.map((feature) => (
                <ListItem key={feature} sx={{ px: 0 }}>
                  <ListItemIcon sx={{ minWidth: 36 }}>
                    <CheckCircleIcon color="success" />
                  </ListItemIcon>
                  <ListItemText primary={feature} />
                </ListItem>
              ))}
            </List>
          </Paper>

          {/* Payment Section */}
          <Paper sx={{ p: 4 }}>
            <Typography variant="h6" fontWeight={600} gutterBottom>
              Payment Method
            </Typography>

            <RadioGroup
              value={paymentMethod}
              onChange={(e) => setPaymentMethod(e.target.value)}
            >
              <Paper
                variant="outlined"
                sx={{
                  p: 2,
                  mb: 2,
                  cursor: 'pointer',
                  borderColor: paymentMethod === 'stripe' ? 'primary.main' : 'divider',
                  borderWidth: paymentMethod === 'stripe' ? 2 : 1,
                }}
                onClick={() => setPaymentMethod('stripe')}
              >
                <FormControlLabel
                  value="stripe"
                  control={<Radio />}
                  label={
                    <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
                      <CreditCardIcon />
                      <Box>
                        <Typography variant="body1" fontWeight={500}>
                          Credit / Debit Card
                        </Typography>
                        <Typography variant="body2" color="text.secondary">
                          Powered by Stripe
                        </Typography>
                      </Box>
                    </Box>
                  }
                  sx={{ width: '100%', m: 0 }}
                />
              </Paper>

              <Paper
                variant="outlined"
                sx={{
                  p: 2,
                  cursor: 'pointer',
                  borderColor: paymentMethod === 'paypal' ? 'primary.main' : 'divider',
                  borderWidth: paymentMethod === 'paypal' ? 2 : 1,
                }}
                onClick={() => setPaymentMethod('paypal')}
              >
                <FormControlLabel
                  value="paypal"
                  control={<Radio />}
                  label={
                    <Box>
                      <Typography variant="body1" fontWeight={500}>
                        PayPal
                      </Typography>
                      <Typography variant="body2" color="text.secondary">
                        Pay with your PayPal account
                      </Typography>
                    </Box>
                  }
                  sx={{ width: '100%', m: 0 }}
                />
              </Paper>
            </RadioGroup>

            {paymentMethod === 'stripe' && (
              <Box sx={{ mt: 3 }}>
                <Grid container spacing={2}>
                  <Grid size={{ xs: 12 }}>
                    <TextField
                      fullWidth
                      label="Card Number"
                      placeholder="1234 5678 9012 3456"
                    />
                  </Grid>
                  <Grid size={{ xs: 6 }}>
                    <TextField
                      fullWidth
                      label="Expiry Date"
                      placeholder="MM/YY"
                    />
                  </Grid>
                  <Grid size={{ xs: 6 }}>
                    <TextField
                      fullWidth
                      label="CVC"
                      placeholder="123"
                    />
                  </Grid>
                </Grid>
              </Box>
            )}

            <Button
              variant="contained"
              size="large"
              fullWidth
              sx={{ mt: 4 }}
            >
              Subscribe - HK$180/month
            </Button>

            <Typography variant="body2" color="text.secondary" textAlign="center" sx={{ mt: 2 }}>
              Cancel anytime. No long-term commitment.
            </Typography>
          </Paper>
        </Grid>

        {/* Billing History */}
        <Grid size={{ xs: 12, md: 4 }}>
          <Paper sx={{ p: 3 }}>
            <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, mb: 3 }}>
              <HistoryIcon color="action" />
              <Typography variant="h6" fontWeight={600}>
                Billing History
              </Typography>
            </Box>

            {billingHistory.length > 0 ? (
              <List disablePadding>
                {billingHistory.map((item, index) => (
                  <ListItem
                    key={index}
                    sx={{
                      px: 0,
                      borderBottom: index < billingHistory.length - 1 ? 1 : 0,
                      borderColor: 'divider',
                    }}
                  >
                    <ListItemText
                      primary={item.description}
                      secondary={item.date}
                    />
                    <Typography
                      variant="body2"
                      fontWeight={600}
                      color={item.amount === 'Free' ? 'text.secondary' : 'text.primary'}
                    >
                      {item.amount}
                    </Typography>
                  </ListItem>
                ))}
              </List>
            ) : (
              <Typography variant="body2" color="text.secondary">
                No billing history yet
              </Typography>
            )}
          </Paper>

          <Paper sx={{ p: 3, mt: 3 }}>
            <Typography variant="h6" fontWeight={600} gutterBottom>
              Need Help?
            </Typography>
            <Typography variant="body2" color="text.secondary" gutterBottom>
              Contact our support team for any billing questions.
            </Typography>
            <Button variant="outlined" size="small" sx={{ mt: 1 }}>
              Contact Support
            </Button>
          </Paper>
        </Grid>
      </Grid>
    </Box>
  );
};

export default SubscriptionPage;
