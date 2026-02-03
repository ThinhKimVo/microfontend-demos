import { useState, useRef, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Shield, Mail, Lock, ArrowRight } from 'lucide-react';
import { useAuthStore } from '../store/auth';

export default function Login() {
  const navigate = useNavigate();
  const { setAuth, set2FAVerified, is2FAEnabled, isAuthenticated, is2FAVerified } = useAuthStore();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [rememberMe, setRememberMe] = useState(false);
  const [error, setError] = useState('');
  const [isLoading, setIsLoading] = useState(false);

  // 2FA state
  const [showTwoFactor, setShowTwoFactor] = useState(false);
  const [twoFactorCode, setTwoFactorCode] = useState(['', '', '', '', '', '']);
  const inputRefs = useRef<(HTMLInputElement | null)[]>([]);

  // Redirect if already authenticated and 2FA verified
  useEffect(() => {
    if (isAuthenticated && is2FAVerified) {
      navigate('/');
    }
  }, [isAuthenticated, is2FAVerified, navigate]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setIsLoading(true);

    try {
      // Mock login validation
      if (email === 'admin@healthcare.com' && password === 'admin123') {
        setAuth(
          {
            id: '1',
            email: 'admin@healthcare.com',
            name: 'Admin User',
            role: 'ADMIN',
          },
          'mock-token',
          rememberMe
        );

        if (is2FAEnabled) {
          setShowTwoFactor(true);
        } else {
          set2FAVerified(true);
          navigate('/');
        }
      } else {
        setError('Invalid credentials');
      }
    } catch (err) {
      setError('Login failed. Please try again.');
    } finally {
      setIsLoading(false);
    }
  };

  const handleTwoFactorChange = (index: number, value: string) => {
    if (!/^\d*$/.test(value)) return;

    const newCode = [...twoFactorCode];
    newCode[index] = value.slice(-1);
    setTwoFactorCode(newCode);

    // Auto-focus next input
    if (value && index < 5) {
      inputRefs.current[index + 1]?.focus();
    }
  };

  const handleTwoFactorKeyDown = (index: number, e: React.KeyboardEvent) => {
    if (e.key === 'Backspace' && !twoFactorCode[index] && index > 0) {
      inputRefs.current[index - 1]?.focus();
    }
  };

  const handleTwoFactorSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setIsLoading(true);

    const code = twoFactorCode.join('');

    try {
      // Mock 2FA validation (accept any 6-digit code for demo)
      if (code.length === 6) {
        set2FAVerified(true);
        navigate('/');
      } else {
        setError('Please enter a valid 6-digit code');
      }
    } catch (err) {
      setError('Verification failed. Please try again.');
    } finally {
      setIsLoading(false);
    }
  };

  const handleForgotPassword = () => {
    // Mock forgot password - in real app would trigger email
    alert('Password reset link would be sent to your email.');
  };

  if (showTwoFactor) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50 py-12 px-4 sm:px-6 lg:px-8">
        <div className="max-w-md w-full space-y-8">
          <div className="text-center">
            <div className="mx-auto w-16 h-16 bg-primary-100 rounded-full flex items-center justify-center">
              <Shield className="h-8 w-8 text-primary-600" />
            </div>
            <h1 className="mt-6 text-2xl font-bold text-gray-900">
              Two-Factor Authentication
            </h1>
            <p className="mt-2 text-sm text-gray-600">
              Enter the 6-digit code from your Google Authenticator app
            </p>
          </div>

          <form className="mt-8 space-y-6" onSubmit={handleTwoFactorSubmit}>
            {error && (
              <div className="bg-red-50 border border-red-200 text-red-600 px-4 py-3 rounded-lg text-sm">
                {error}
              </div>
            )}

            <div className="flex justify-center gap-2">
              {twoFactorCode.map((digit, index) => (
                <input
                  key={index}
                  ref={(el) => (inputRefs.current[index] = el)}
                  type="text"
                  inputMode="numeric"
                  maxLength={1}
                  className="w-12 h-14 text-center text-xl font-bold border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-primary-500"
                  value={digit}
                  onChange={(e) => handleTwoFactorChange(index, e.target.value)}
                  onKeyDown={(e) => handleTwoFactorKeyDown(index, e)}
                  autoFocus={index === 0}
                />
              ))}
            </div>

            <button
              type="submit"
              disabled={isLoading || twoFactorCode.join('').length !== 6}
              className="btn btn-primary w-full py-3 flex items-center justify-center gap-2"
            >
              {isLoading ? 'Verifying...' : 'Verify Code'}
              <ArrowRight className="h-4 w-4" />
            </button>
          </form>

          <div className="text-center">
            <button
              onClick={() => {
                setShowTwoFactor(false);
                setTwoFactorCode(['', '', '', '', '', '']);
                useAuthStore.getState().logout();
              }}
              className="text-sm text-gray-600 hover:text-gray-900"
            >
              Back to login
            </button>
          </div>

          <p className="text-center text-xs text-gray-500">
            Demo: Enter any 6 digits to verify
          </p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50 py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-md w-full space-y-8">
        <div>
          <h1 className="text-center text-3xl font-bold text-primary-600">
            Healthcare
          </h1>
          <h2 className="mt-6 text-center text-2xl font-semibold text-gray-900">
            Admin Panel
          </h2>
          <p className="mt-2 text-center text-sm text-gray-600">
            Sign in to manage the platform
          </p>
        </div>

        <form className="mt-8 space-y-6" onSubmit={handleSubmit}>
          {error && (
            <div className="bg-red-50 border border-red-200 text-red-600 px-4 py-3 rounded-lg text-sm">
              {error}
            </div>
          )}

          <div className="space-y-4">
            <div>
              <label
                htmlFor="email"
                className="block text-sm font-medium text-gray-700"
              >
                Email address
              </label>
              <div className="mt-1 relative">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                  <Mail className="h-5 w-5 text-gray-400" />
                </div>
                <input
                  id="email"
                  name="email"
                  type="email"
                  autoComplete="email"
                  required
                  className="input pl-10"
                  placeholder="admin@healthcare.com"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                />
              </div>
            </div>

            <div>
              <label
                htmlFor="password"
                className="block text-sm font-medium text-gray-700"
              >
                Password
              </label>
              <div className="mt-1 relative">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                  <Lock className="h-5 w-5 text-gray-400" />
                </div>
                <input
                  id="password"
                  name="password"
                  type="password"
                  autoComplete="current-password"
                  required
                  className="input pl-10"
                  placeholder="Enter your password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                />
              </div>
            </div>
          </div>

          <div className="flex items-center justify-between">
            <label className="flex items-center">
              <input
                type="checkbox"
                className="h-4 w-4 text-primary-600 border-gray-300 rounded focus:ring-primary-500"
                checked={rememberMe}
                onChange={(e) => setRememberMe(e.target.checked)}
              />
              <span className="ml-2 text-sm text-gray-600">Remember me</span>
            </label>

            <button
              type="button"
              onClick={handleForgotPassword}
              className="text-sm font-medium text-primary-600 hover:text-primary-500"
            >
              Forgot password?
            </button>
          </div>

          <button
            type="submit"
            disabled={isLoading}
            className="btn btn-primary w-full py-3 flex items-center justify-center gap-2"
          >
            {isLoading ? 'Signing in...' : 'Sign in'}
            <ArrowRight className="h-4 w-4" />
          </button>
        </form>

        <div className="text-center space-y-2">
          <p className="text-xs text-gray-500">
            Demo credentials: admin@healthcare.com / admin123
          </p>
          <p className="text-xs text-gray-400">
            2FA enabled - use any 6 digits after login
          </p>
        </div>
      </div>
    </div>
  );
}
