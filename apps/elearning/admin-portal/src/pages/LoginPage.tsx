import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import {
  Box,
  Typography,
  TextField,
  Button,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  Alert,
} from '@mui/material';
import { useAuth } from '../App';
import { currentTeacher, currentAdmin } from '../data/mockData';

export default function LoginPage() {
  const navigate = useNavigate();
  const { login } = useAuth();

  const [email, setEmail] = useState('sarah.johnson@example.com');
  const [password, setPassword] = useState('password123');
  const [role, setRole] = useState<'teacher' | 'admin'>('teacher');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setLoading(true);

    try {
      await new Promise(resolve => setTimeout(resolve, 800));
      const user = role === 'teacher' ? currentTeacher : currentAdmin;
      login(user, role);
      navigate(role === 'teacher' ? '/teacher' : '/admin');
    } catch {
      setError('Invalid email or password');
    } finally {
      setLoading(false);
    }
  };

  return (
    <Box>
      <Typography variant="h5" fontWeight={700} textAlign="center" gutterBottom>
        Sign In
      </Typography>
      <Typography variant="body2" color="text.secondary" textAlign="center" sx={{ mb: 4 }}>
        Access your dashboard
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
          sx={{ mb: 2.5 }}
        />

        <TextField
          fullWidth
          label="Password"
          type="password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          required
          sx={{ mb: 2.5 }}
        />

        <FormControl fullWidth sx={{ mb: 3 }}>
          <InputLabel>Login As</InputLabel>
          <Select
            value={role}
            label="Login As"
            onChange={(e) => setRole(e.target.value as 'teacher' | 'admin')}
          >
            <MenuItem value="teacher">Teacher</MenuItem>
            <MenuItem value="admin">Administrator</MenuItem>
          </Select>
        </FormControl>

        <Button
          fullWidth
          type="submit"
          variant="contained"
          size="large"
          disabled={loading}
        >
          {loading ? 'Signing in...' : 'Sign In'}
        </Button>
      </Box>
    </Box>
  );
}
