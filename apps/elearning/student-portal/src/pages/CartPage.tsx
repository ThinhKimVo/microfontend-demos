import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import {
  Box,
  Container,
  Typography,
  Grid,
  Card,
  CardContent,
  CardMedia,
  Button,
  IconButton,
  TextField,
  Divider,
  Alert,
  Snackbar,
} from '@mui/material';
import {
  Delete as DeleteIcon,
  LocalOffer as CouponIcon,
} from '@mui/icons-material';
import { cartItems as initialCartItems } from '../data/mockData';

export default function CartPage() {
  const navigate = useNavigate();
  const [cartItems, setCartItems] = useState(initialCartItems);
  const [couponCode, setCouponCode] = useState('');
  const [couponApplied, setCouponApplied] = useState(false);
  const [discount, setDiscount] = useState(0);
  const [snackbarOpen, setSnackbarOpen] = useState(false);

  const handleRemoveItem = (courseId: string) => {
    setCartItems(items => items.filter(item => item.courseId !== courseId));
    setSnackbarOpen(true);
  };

  const formatPrice = (price: number, currency: string) => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency,
    }).format(price);
  };

  const subtotal = cartItems.reduce((sum, item) => sum + item.course.price, 0);
  const originalTotal = cartItems.reduce((sum, item) => sum + (item.course.originalPrice || item.course.price), 0);
  const discountAmount = (subtotal * discount) / 100;
  const total = subtotal - discountAmount;

  const handleApplyCoupon = () => {
    if (couponCode.toLowerCase() === 'save20') {
      setDiscount(20);
      setCouponApplied(true);
    }
  };

  return (
    <Box sx={{ bgcolor: 'grey.50', minHeight: '100vh', py: 4 }}>
      <Container maxWidth="lg">
        <Typography variant="h4" fontWeight={700} gutterBottom>
          Shopping Cart
        </Typography>
        <Typography variant="body1" color="text.secondary" sx={{ mb: 4 }}>
          {cartItems.length} course{cartItems.length !== 1 ? 's' : ''} in cart
        </Typography>

        {cartItems.length > 0 ? (
          <Grid container spacing={4}>
            {/* Cart Items */}
            <Grid size={{ xs: 12, md: 8 }}>
              {cartItems.map((item) => (
                <Card key={item.courseId} sx={{ display: 'flex', mb: 2 }}>
                  <CardMedia
                    component={Link}
                    to={`/course/${item.course.slug}`}
                    sx={{ width: 160, height: 100, flexShrink: 0 }}
                    image={item.course.thumbnail}
                  />
                  <CardContent sx={{ flex: 1, display: 'flex', py: 1.5 }}>
                    <Box sx={{ flex: 1 }}>
                      <Typography
                        component={Link}
                        to={`/course/${item.course.slug}`}
                        variant="subtitle1"
                        fontWeight={600}
                        sx={{ textDecoration: 'none', color: 'inherit', '&:hover': { color: 'primary.main' } }}
                      >
                        {item.course.title}
                      </Typography>
                      <Typography variant="body2" color="text.secondary">
                        {item.course.teacher.name}
                      </Typography>
                      <Box sx={{ display: 'flex', alignItems: 'center', gap: 0.5, mt: 0.5 }}>
                        <Typography variant="body2" fontWeight={600} color="warning.dark">
                          {item.course.rating}
                        </Typography>
                        <Typography variant="caption" color="text.secondary">
                          ({item.course.totalRatings.toLocaleString()} ratings)
                        </Typography>
                      </Box>
                    </Box>
                    <Box sx={{ textAlign: 'right' }}>
                      <Typography variant="h6" fontWeight={700} color="primary.main">
                        {formatPrice(item.course.price, item.course.currency)}
                      </Typography>
                      {item.course.originalPrice && (
                        <Typography variant="body2" color="text.secondary" sx={{ textDecoration: 'line-through' }}>
                          {formatPrice(item.course.originalPrice, item.course.currency)}
                        </Typography>
                      )}
                      <IconButton
                        size="small"
                        color="error"
                        sx={{ mt: 1 }}
                        onClick={() => handleRemoveItem(item.courseId)}
                      >
                        <DeleteIcon />
                      </IconButton>
                    </Box>
                  </CardContent>
                </Card>
              ))}
            </Grid>

            {/* Order Summary */}
            <Grid size={{ xs: 12, md: 4 }}>
              <Card sx={{ position: 'sticky', top: 80 }}>
                <CardContent>
                  <Typography variant="h6" fontWeight={600} gutterBottom>
                    Order Summary
                  </Typography>

                  <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 1 }}>
                    <Typography variant="body2" color="text.secondary">
                      Original Price
                    </Typography>
                    <Typography variant="body2" sx={{ textDecoration: 'line-through' }}>
                      {formatPrice(originalTotal, 'USD')}
                    </Typography>
                  </Box>

                  <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 1 }}>
                    <Typography variant="body2" color="text.secondary">
                      Discounts
                    </Typography>
                    <Typography variant="body2" color="success.main">
                      -{formatPrice(originalTotal - subtotal, 'USD')}
                    </Typography>
                  </Box>

                  {discount > 0 && (
                    <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 1 }}>
                      <Typography variant="body2" color="text.secondary">
                        Coupon ({discount}%)
                      </Typography>
                      <Typography variant="body2" color="success.main">
                        -{formatPrice(discountAmount, 'USD')}
                      </Typography>
                    </Box>
                  )}

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
                    onClick={() => navigate('/checkout')}
                    sx={{ mb: 2 }}
                  >
                    Proceed to Checkout
                  </Button>

                  {/* Coupon Code */}
                  <Divider sx={{ my: 2 }} />
                  <Typography variant="subtitle2" fontWeight={600} gutterBottom>
                    Have a coupon?
                  </Typography>

                  {couponApplied ? (
                    <Alert severity="success" sx={{ mb: 2 }}>
                      Coupon SAVE20 applied! You saved {discount}%
                    </Alert>
                  ) : (
                    <Box sx={{ display: 'flex', gap: 1 }}>
                      <TextField
                        size="small"
                        placeholder="Enter coupon code"
                        value={couponCode}
                        onChange={(e) => setCouponCode(e.target.value)}
                        sx={{ flex: 1 }}
                      />
                      <Button
                        variant="outlined"
                        onClick={handleApplyCoupon}
                        startIcon={<CouponIcon />}
                      >
                        Apply
                      </Button>
                    </Box>
                  )}
                </CardContent>
              </Card>
            </Grid>
          </Grid>
        ) : (
          <Card sx={{ textAlign: 'center', py: 8 }}>
            <CardContent>
              <Typography variant="h6" gutterBottom>
                Your cart is empty
              </Typography>
              <Typography variant="body2" color="text.secondary" sx={{ mb: 3 }}>
                Browse our courses and add them to your cart
              </Typography>
              <Button component={Link} to="/explore" variant="contained">
                Explore Courses
              </Button>
            </CardContent>
          </Card>
        )}

        <Snackbar
          open={snackbarOpen}
          autoHideDuration={3000}
          onClose={() => setSnackbarOpen(false)}
          anchorOrigin={{ vertical: 'bottom', horizontal: 'center' }}
        >
          <Alert onClose={() => setSnackbarOpen(false)} severity="info" sx={{ width: '100%' }}>
            Item removed from cart
          </Alert>
        </Snackbar>
      </Container>
    </Box>
  );
}
