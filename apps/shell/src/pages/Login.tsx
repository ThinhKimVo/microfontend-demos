import { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';
import { ArrowIcon } from '../components/Icons';

export default function Login() {
  const navigate = useNavigate();
  const { login, register, isLoading: authLoading } = useAuth();
  const [isLogin, setIsLogin] = useState(true);
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [name, setName] = useState('');
  const [error, setError] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setIsSubmitting(true);

    try {
      let result;
      if (isLogin) {
        result = await login(email, password);
      } else {
        result = await register(email, password, name);
      }

      if (result.success) {
        navigate('/admin');
      } else {
        setError(result.error || 'Identity verification failed');
      }
    } finally {
      setIsSubmitting(false);
    }
  };

  if (authLoading) {
    return (
      <div className="min-h-screen bg-obsidian flex items-center justify-center">
        <div className="relative w-12 h-12">
          <div className="absolute inset-0 border-2 border-accent-cyan/20 rounded-full"></div>
          <div className="absolute inset-0 border-t-2 border-accent-cyan rounded-full animate-spin"></div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen flex flex-col items-center justify-center px-6 py-12">
      {/* Background Decor */}
      <div className="fixed top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[800px] h-[800px] bg-accent-cyan/5 rounded-full blur-[120px] -z-10 animate-glow-pulse"></div>

      <div className="w-full max-w-[420px] stagger-load">
        {/* Monolith Card */}
        <div className="glass-panel p-10 rounded-[2.5rem] border-white/10 relative overflow-hidden">
          <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-transparent via-accent-cyan to-transparent opacity-50"></div>

          <div className="text-center mb-10">
            <Link to="/" className="inline-flex mb-8 group">
              <img
                src="/logo-black.svg"
                alt="Saigon Technology"
                className="h-10 w-auto brightness-0 invert group-hover:drop-shadow-[0_0_12px_rgba(132,175,72,0.4)] transition-all duration-300"
              />
            </Link>

            <h1 className="text-3xl font-black tracking-tight text-white mb-2">
              {isLogin ? 'ACCESS_TERMINAL' : 'RECRUIT_INIT'}
            </h1>
            <p className="text-slate-500 font-mono text-[10px] uppercase tracking-widest">
              {isLogin ? 'Provide secure credentials' : 'Initialize new user profile'}
            </p>
          </div>

          {error && (
            <div className="mb-6 p-4 bg-red-500/10 border border-red-500/20 rounded-2xl text-red-500 text-xs font-mono uppercase tracking-wider text-center" role="alert">
              [ERROR]: {error}
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-6">
            {!isLogin && (
              <div className="group">
                <label htmlFor="name" className="block text-[10px] font-mono uppercase tracking-widest text-slate-500 mb-2 group-focus-within:text-accent-cyan transition-colors">
                  Identity Core Name
                </label>
                <input
                  id="name"
                  type="text"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  placeholder="DESIGNATOR"
                  required={!isLogin}
                  className="w-full px-5 py-4 bg-white/5 border border-white/10 rounded-2xl text-white placeholder-white/10 focus:outline-none focus:border-accent-cyan/50 transition-all font-mono text-sm"
                />
              </div>
            )}

            <div className="group">
              <label htmlFor="email" className="block text-[10px] font-mono uppercase tracking-widest text-slate-500 mb-2 group-focus-within:text-accent-cyan transition-colors">
                Communication Uplink
              </label>
              <input
                id="email"
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="EMAIL_ADDRESS"
                required
                autoComplete="email"
                className="w-full px-5 py-4 bg-white/5 border border-white/10 rounded-2xl text-white placeholder-white/10 focus:outline-none focus:border-accent-cyan/50 transition-all font-mono text-sm"
              />
            </div>

            <div className="group">
              <label htmlFor="password" className="block text-[10px] font-mono uppercase tracking-widest text-slate-500 mb-2 group-focus-within:text-accent-cyan transition-colors">
                Security Passcode
              </label>
              <input
                id="password"
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="********"
                required
                autoComplete={isLogin ? 'current-password' : 'new-password'}
                className="w-full px-5 py-4 bg-white/5 border border-white/10 rounded-2xl text-white placeholder-white/10 focus:outline-none focus:border-accent-cyan/50 transition-all font-mono text-sm"
              />
            </div>

            <button
              type="submit"
              disabled={isSubmitting}
              className="w-full py-5 px-6 bg-white text-obsidian font-black rounded-2xl hover:bg-accent-cyan transition-all duration-300 disabled:opacity-50 disabled:cursor-not-allowed uppercase tracking-[0.2em] text-xs flex items-center justify-center gap-3 shadow-[0_10px_30px_-10px_rgba(132,175,72,0.15)]"
            >
              {isSubmitting ? (
                <>
                  <div className="w-4 h-4 border-2 border-obsidian/20 border-t-obsidian rounded-full animate-spin" />
                  Processing...
                </>
              ) : (
                <>
                  {isLogin ? 'Authorize Access' : 'Create Profile'}
                  <ArrowIcon className="w-4 h-4" />
                </>
              )}
            </button>
          </form>

          <div className="mt-8 text-center pt-8 border-t border-white/5">
            <button
              type="button"
              onClick={() => {
                setIsLogin(!isLogin);
                setError('');
              }}
              className="text-[10px] font-mono uppercase tracking-widest text-slate-500 hover:text-accent-cyan transition-colors"
            >
              {isLogin ? "Join the network" : 'Return to terminal'}
            </button>
          </div>
        </div>

        {/* Outer Back Link */}
        <p className="text-center mt-10">
          <Link to="/" className="text-[10px] font-mono uppercase tracking-[0.3em] text-slate-600 hover:text-accent-cyan transition-all">
            [ ABORT_PROCESS ]
          </Link>
        </p>
      </div>
    </div>
  );
}
