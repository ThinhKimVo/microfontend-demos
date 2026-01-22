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
  Rating,
  Snackbar,
  Alert,
} from '@mui/material';
import {
  Delete as DeleteIcon,
  ShoppingCart as CartIcon,
} from '@mui/icons-material';
import { wishlistItems as initialWishlistItems } from '../data/mockData';

export default function WishlistPage() {
  const navigate = useNavigate();
  const [wishlistItems, setWishlistItems] = useState(initialWishlistItems);
  const [snackbarOpen, setSnackbarOpen] = useState(false);
  const [snackbarMessage, setSnackbarMessage] = useState('');

  const handleAddToCart = (courseId: string, courseTitle: string) => {
    setSnackbarMessage(`${courseTitle} added to cart!`);
    setSnackbarOpen(true);
    // Remove from wishlist after adding to cart
    setWishlistItems(items => items.filter(item => item.courseId !== courseId));
    setTimeout(() => navigate('/cart'), 1500);
  };

  const handleRemoveFromWishlist = (courseId: string) => {
    setWishlistItems(items => items.filter(item => item.courseId !== courseId));
    setSnackbarMessage('Removed from wishlist');
    setSnackbarOpen(true);
  };
  const formatPrice = (price: number, currency: string) => {
    if (price === 0) return 'Free';
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency,
    }).format(price);
  };

  return (
    <Box sx={{ bgcolor: 'grey.50', minHeight: '100vh', py: 4 }}>
      <Container maxWidth="lg">
        <Typography variant="h4" fontWeight={700} gutterBottom>
          My Wishlist
        </Typography>
        <Typography variant="body1" color="text.secondary" sx={{ mb: 4 }}>
          {wishlistItems.length} courses saved for later
        </Typography>

        {wishlistItems.length > 0 ? (
          <Grid container spacing={3}>
            {wishlistItems.map((item) => (
              <Grid size={{ xs: 12 }} key={item.courseId}>
                <Card sx={{ display: 'flex', flexDirection: { xs: 'column', sm: 'row' } }}>
                  <CardMedia
                    component={Link}
                    to={`/course/${item.course.slug}`}
                    sx={{
                      width: { xs: '100%', sm: 200 },
                      height: { xs: 160, sm: 140 },
                      flexShrink: 0,
                    }}
                    image={item.course.thumbnail}
                  />
                  <CardContent sx={{ flex: 1, display: 'flex', alignItems: 'center' }}>
                    <Box sx={{ flex: 1 }}>
                      <Typography
                        component={Link}
                        to={`/course/${item.course.slug}`}
                        variant="h6"
                        fontWeight={600}
                        sx={{ textDecoration: 'none', color: 'inherit', '&:hover': { color: 'primary.main' } }}
                      >
                        {item.course.title}
                      </Typography>
                      <Typography variant="body2" color="text.secondary" sx={{ mb: 1 }}>
                        {item.course.teacher.name}
                      </Typography>
                      <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, mb: 1 }}>
                        <Typography variant="body2" fontWeight={600} color="warning.dark">
                          {item.course.rating}
                        </Typography>
                        <Rating value={item.course.rating} size="small" readOnly precision={0.1} />
                        <Typography variant="caption" color="text.secondary">
                          ({item.course.totalRatings.toLocaleString()})
                        </Typography>
                      </Box>
                    </Box>

                    <Box sx={{ textAlign: 'right', display: 'flex', flexDirection: 'column', alignItems: 'flex-end', gap: 1 }}>
                      <Box sx={{ display: 'flex', alignItems: 'baseline', gap: 1 }}>
                        <Typography variant="h6" fontWeight={700}>
                          {formatPrice(item.course.price, item.course.currency)}
                        </Typography>
                        {item.course.originalPrice && (
                          <Typography variant="body2" color="text.secondary" sx={{ textDecoration: 'line-through' }}>
                            {formatPrice(item.course.originalPrice, item.course.currency)}
                          </Typography>
                        )}
                      </Box>
                      <Box sx={{ display: 'flex', gap: 1 }}>
                        <Button
                          variant="contained"
                          size="small"
                          startIcon={<CartIcon />}
                          onClick={() => handleAddToCart(item.courseId, item.course.title)}
                        >
                          Add to Cart
                        </Button>
                        <IconButton
                          size="small"
                          color="error"
                          onClick={() => handleRemoveFromWishlist(item.courseId)}
                        >
                          <DeleteIcon />
                        </IconButton>
                      </Box>
                    </Box>
                  </CardContent>
                </Card>
              </Grid>
            ))}
          </Grid>
        ) : (
          <Card sx={{ textAlign: 'center', py: 8 }}>
            <CardContent>
              <Typography variant="h6" gutterBottom>
                Your wishlist is empty
              </Typography>
              <Typography variant="body2" color="text.secondary" sx={{ mb: 3 }}>
                Save courses you're interested in for later
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
          <Alert onClose={() => setSnackbarOpen(false)} severity="success" sx={{ width: '100%' }}>
            {snackbarMessage}
          </Alert>
        </Snackbar>
      </Container>
    </Box>
  );
}
