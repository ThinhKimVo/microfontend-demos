import { useState } from 'react';
import { Link } from 'react-router-dom';
import {
  Box,
  Container,
  Typography,
  Grid,
  Card,
  CardContent,
  Button,
  TextField,
  Radio,
  RadioGroup,
  FormControlLabel,
  FormControl,
  Divider,
  Stepper,
  Step,
  StepLabel,
} from '@mui/material';
import {
  CreditCard as CreditCardIcon,
  AccountBalance as PayPalIcon,
  Lock as LockIcon,
} from '@mui/icons-material';
import { cartItems } from '../data/mockData';

const steps = ['Review', 'Payment', 'Confirm'];

export default function CheckoutPage() {
  const [activeStep, setActiveStep] = useState(1);
  const [paymentMethod, setPaymentMethod] = useState('card');
  const [cardDetails, setCardDetails] = useState({
    number: '',
    name: '',
    expiry: '',
    cvv: '',
  });
  const [loading, setLoading] = useState(false);

  const formatPrice = (price: number, currency: string) => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency,
    }).format(price);
  };

  const total = cartItems.reduce((sum, item) => sum + item.course.price, 0);

  const handlePayment = async () => {
    setLoading(true);
    await new Promise(resolve => setTimeout(resolve, 2000));
    setActiveStep(2);
    setLoading(false);
  };

  if (activeStep === 2) {
    return (
      <Box sx={{ bgcolor: 'grey.50', minHeight: '100vh', py: 8 }}>
        <Container maxWidth="sm">
          <Card sx={{ textAlign: 'center', py: 6 }}>
            <CardContent>
              <Box
                sx={{
                  width: 80,
                  height: 80,
                  borderRadius: '50%',
                  bgcolor: 'success.light',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  mx: 'auto',
                  mb: 3,
                }}
              >
                <LockIcon sx={{ fontSize: 40, color: 'success.main' }} />
              </Box>
              <Typography variant="h4" fontWeight={700} gutterBottom>
                Payment Successful!
              </Typography>
              <Typography variant="body1" color="text.secondary" sx={{ mb: 4 }}>
                Thank you for your purchase. You can now access your courses.
              </Typography>
              <Box sx={{ display: 'flex', gap: 2, justifyContent: 'center' }}>
                <Button
                  component={Link}
                  to="/my-courses"
                  variant="contained"
                  size="large"
                >
                  Go to My Courses
                </Button>
                <Button
                  component={Link}
                  to="/explore"
                  variant="outlined"
                  size="large"
                >
                  Continue Shopping
                </Button>
              </Box>
            </CardContent>
          </Card>
        </Container>
      </Box>
    );
  }

  return (
    <Box sx={{ bgcolor: 'grey.50', minHeight: '100vh', py: 4 }}>
      <Container maxWidth="lg">
        <Typography variant="h4" fontWeight={700} gutterBottom>
          Checkout
        </Typography>

        <Stepper activeStep={activeStep} sx={{ mb: 4 }}>
          {steps.map((label) => (
            <Step key={label}>
              <StepLabel>{label}</StepLabel>
            </Step>
          ))}
        </Stepper>

        <Grid container spacing={4}>
          {/* Payment Form */}
          <Grid size={{ xs: 12, md: 8 }}>
            <Card>
              <CardContent>
                <Typography variant="h6" fontWeight={600} gutterBottom>
                  Payment Method
                </Typography>

                <FormControl component="fieldset" sx={{ mb: 3, width: '100%' }}>
                  <RadioGroup
                    value={paymentMethod}
                    onChange={(e) => setPaymentMethod(e.target.value)}
                  >
                    <Card
                      variant="outlined"
                      sx={{
                        mb: 2,
                        borderColor: paymentMethod === 'card' ? 'primary.main' : 'grey.300',
                        borderWidth: paymentMethod === 'card' ? 2 : 1,
                      }}
                    >
                      <FormControlLabel
                        value="card"
                        control={<Radio />}
                        label={
                          <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, py: 1 }}>
                            <CreditCardIcon />
                            <Typography>Credit / Debit Card</Typography>
                          </Box>
                        }
                        sx={{ m: 0, p: 2, width: '100%' }}
                      />
                    </Card>

                    <Card
                      variant="outlined"
                      sx={{
                        borderColor: paymentMethod === 'paypal' ? 'primary.main' : 'grey.300',
                        borderWidth: paymentMethod === 'paypal' ? 2 : 1,
                      }}
                    >
                      <FormControlLabel
                        value="paypal"
                        control={<Radio />}
                        label={
                          <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, py: 1 }}>
                            <PayPalIcon />
                            <Typography>PayPal</Typography>
                          </Box>
                        }
                        sx={{ m: 0, p: 2, width: '100%' }}
                      />
                    </Card>
                  </RadioGroup>
                </FormControl>

                {paymentMethod === 'card' && (
                  <Box>
                    <Typography variant="subtitle2" fontWeight={600} gutterBottom>
                      Card Details
                    </Typography>
                    <Grid container spacing={2}>
                      <Grid size={12}>
                        <TextField
                          fullWidth
                          label="Card Number"
                          placeholder="1234 5678 9012 3456"
                          value={cardDetails.number}
                          onChange={(e) => setCardDetails({ ...cardDetails, number: e.target.value })}
                        />
                      </Grid>
                      <Grid size={12}>
                        <TextField
                          fullWidth
                          label="Cardholder Name"
                          placeholder="John Doe"
                          value={cardDetails.name}
                          onChange={(e) => setCardDetails({ ...cardDetails, name: e.target.value })}
                        />
                      </Grid>
                      <Grid size={6}>
                        <TextField
                          fullWidth
                          label="Expiry Date"
                          placeholder="MM/YY"
                          value={cardDetails.expiry}
                          onChange={(e) => setCardDetails({ ...cardDetails, expiry: e.target.value })}
                        />
                      </Grid>
                      <Grid size={6}>
                        <TextField
                          fullWidth
                          label="CVV"
                          placeholder="123"
                          type="password"
                          value={cardDetails.cvv}
                          onChange={(e) => setCardDetails({ ...cardDetails, cvv: e.target.value })}
                        />
                      </Grid>
                    </Grid>
                  </Box>
                )}

                {paymentMethod === 'paypal' && (
                  <Box sx={{ textAlign: 'center', py: 4, bgcolor: 'grey.50', borderRadius: 2 }}>
                    <Typography variant="body1" color="text.secondary">
                      You will be redirected to PayPal to complete your payment.
                    </Typography>
                  </Box>
                )}
              </CardContent>
            </Card>
          </Grid>

          {/* Order Summary */}
          <Grid size={{ xs: 12, md: 4 }}>
            <Card sx={{ position: 'sticky', top: 80 }}>
              <CardContent>
                <Typography variant="h6" fontWeight={600} gutterBottom>
                  Order Summary
                </Typography>

                {cartItems.map((item) => (
                  <Box key={item.courseId} sx={{ display: 'flex', gap: 2, mb: 2 }}>
                    <Box
                      component="img"
                      src={item.course.thumbnail}
                      sx={{ width: 60, height: 40, borderRadius: 1, objectFit: 'cover' }}
                    />
                    <Box sx={{ flex: 1 }}>
                      <Typography variant="body2" fontWeight={600} noWrap>
                        {item.course.title}
                      </Typography>
                      <Typography variant="body2" color="primary.main" fontWeight={600}>
                        {formatPrice(item.course.price, item.course.currency)}
                      </Typography>
                    </Box>
                  </Box>
                ))}

                <Divider sx={{ my: 2 }} />

                <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 3 }}>
                  <Typography variant="h6" fontWeight={600}>
                    Total
                  </Typography>
                  <Typography variant="h5" fontWeight={700}>
                    {formatPrice(total, 'USD')}
                  </Typography>
                </Box>

                <Button
                  variant="contained"
                  fullWidth
                  size="large"
                  onClick={handlePayment}
                  disabled={loading}
                  startIcon={<LockIcon />}
                >
                  {loading ? 'Processing...' : 'Complete Payment'}
                </Button>

                <Typography variant="caption" color="text.secondary" sx={{ display: 'block', textAlign: 'center', mt: 2 }}>
                  Your payment is secure and encrypted
                </Typography>
              </CardContent>
            </Card>
          </Grid>
        </Grid>
      </Container>
    </Box>
  );
}
