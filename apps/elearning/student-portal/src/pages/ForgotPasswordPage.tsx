import { useState } from 'react';
import { Link } from 'react-router-dom';
import { Box, Typography, TextField, Button, Alert } from '@mui/material';
import { ArrowBack as ArrowBackIcon, CheckCircle as CheckCircleIcon } from '@mui/icons-material';

export default function ForgotPasswordPage() {
  const [email, setEmail] = useState('');
  const [loading, setLoading] = useState(false);
  const [submitted, setSubmitted] = useState(false);
  const [error, setError] = useState('');

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setLoading(true);

    try {
      await new Promise(resolve => setTimeout(resolve, 1000));
      setSubmitted(true);
    } catch {
      setError('Something went wrong. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  if (submitted) {
    return (
      <Box textAlign="center">
        <Box
          sx={{
            width: 64,
            height: 64,
            borderRadius: '50%',
            bgcolor: 'success.light',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            mx: 'auto',
            mb: 3,
          }}
        >
          <CheckCircleIcon sx={{ fontSize: 36, color: 'success.main' }} />
        </Box>
        <Typography variant="h5" fontWeight={700} gutterBottom>
          Check Your Email
        </Typography>
        <Typography variant="body1" color="text.secondary" sx={{ mb: 4 }}>
          We've sent a password reset link to <strong>{email}</strong>.
          Please check your inbox and follow the instructions.
        </Typography>
        <Button
          component={Link}
          to="/login"
          variant="contained"
          size="large"
          sx={{ px: 4 }}
        >
          Back to Login
        </Button>
        <Typography variant="body2" color="text.secondary" sx={{ mt: 3 }}>
          Didn't receive the email?{' '}
          <Button
            variant="text"
            size="small"
            onClick={() => setSubmitted(false)}
            sx={{ textTransform: 'none' }}
          >
            Try again
          </Button>
        </Typography>
      </Box>
    );
  }

  return (
    <Box>
      <Button
        component={Link}
        to="/login"
        startIcon={<ArrowBackIcon />}
        sx={{ mb: 3, ml: -1, color: 'text.secondary' }}
      >
        Back to Login
      </Button>

      <Typography variant="h4" fontWeight={700} gutterBottom>
        Forgot Password?
      </Typography>
      <Typography variant="body1" color="text.secondary" sx={{ mb: 4 }}>
        No worries, we'll send you reset instructions.
      </Typography>

      {error && (
        <Alert severity="error" sx={{ mb: 3 }}>
          {error}
        </Alert>
      )}

      <Box component="form" onSubmit={handleSubmit}>
        <TextField
          fullWidth
          label="Email Address"
          type="email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          required
          placeholder="Enter your email address"
          sx={{ mb: 3 }}
        />

        <Button
          fullWidth
          type="submit"
          variant="contained"
          size="large"
          disabled={loading}
          sx={{ py: 1.5 }}
        >
          {loading ? 'Sending...' : 'Reset Password'}
        </Button>
      </Box>

      <Typography variant="body2" textAlign="center" color="text.secondary" sx={{ mt: 4 }}>
        Remember your password?{' '}
        <Link
          to="/login"
          style={{ color: '#2563EB', textDecoration: 'none', fontWeight: 600 }}
        >
          Sign in
        </Link>
      </Typography>
    </Box>
  );
}
