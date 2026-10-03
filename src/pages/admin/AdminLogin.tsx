import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { ShieldCheck, Lock, AlertCircle, Sparkles, Check, Mail, Key } from 'lucide-react';
import { useAuth } from '../../context/AuthContext';
import { SEO } from '../../components/SEO';

export const AdminLogin: React.FC = () => {
  const { loginWithEmail, resetPassword, loginWithGoogle, loginWithDemoAdmin, isAdmin } = useAuth();
  const navigate = useNavigate();

  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string>('');
  const [resetSuccess, setResetSuccess] = useState<string>('');
  const [showForgotPassword, setShowForgotPassword] = useState(false);
  const [resetEmail, setResetEmail] = useState('');

  // If already authenticated admin, redirect
  React.useEffect(() => {
    if (isAdmin) {
      navigate('/admin');
    }
  }, [isAdmin, navigate]);

  const handleSignIn = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setResetSuccess('');
    if (!email.trim() || !password.trim()) {
      setError('Please provide both email and password.');
      return;
    }

    setLoading(true);
    try {
      await loginWithEmail(email.trim(), password);
      navigate('/admin');
    } catch (err: any) {
      console.error("Sign in error:", err);
      if (err.code === 'auth/wrong-password' || err.code === 'auth/invalid-credential') {
        setError('Invalid email or password.');
      } else if (err.code === 'auth/too-many-requests') {
        setError('Too many failed attempts. Please try again later or reset password.');
      } else if (err.code === 'auth/operation-not-allowed') {
        setError('Email/Password provider is not yet enabled in Firebase Console. You can use Google Sign-in or Demo mode below.');
      } else {
        setError(err.message || 'Authentication failed. Please verify credentials.');
      }
    } finally {
      setLoading(false);
    }
  };

  const handleResetPassword = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!resetEmail.trim()) {
      setError('Please enter your email to receive password reset link.');
      return;
    }
    setLoading(true);
    setError('');
    try {
      await resetPassword(resetEmail.trim());
      setResetSuccess('Password reset link sent to your email.');
      setShowForgotPassword(false);
    } catch (err: any) {
      console.error(err);
      setError(err.message || 'Failed to send reset link.');
    } finally {
      setLoading(false);
    }
  };

  const handleGoogleSignIn = async () => {
    setError('');
    setLoading(true);
    try {
      await loginWithGoogle();
      navigate('/admin');
    } catch (err: any) {
      console.error(err);
      setError(err?.message || 'Google authentication failed.');
    } finally {
      setLoading(false);
    }
  };

  const handleDemoSignIn = () => {
    loginWithDemoAdmin();
    navigate('/admin');
  };

  return (
    <div className="min-h-screen bg-[#1C1A18] flex items-center justify-center p-6 text-[#FBF9F5]">
      <SEO
        title="MOZAIK ADMIN | Product & Content Management"
        description="MOZAIK Natural Stone Collection management console."
        noIndex={true}
      />

      <div className="max-w-md w-full bg-[#2C2926] border border-[#4A4036] p-8 sm:p-10 shadow-2xl space-y-6">
        {/* Header */}
        <div className="text-center">
          <span className="font-serif text-3xl tracking-[0.22em] text-white font-medium block">
            MOZAIK ADMIN
          </span>
          <span className="text-[11px] tracking-[0.25em] text-[#D4CCB8] uppercase block mt-1 font-mono">
            Product & Content Management
          </span>
        </div>

        {/* Notices */}
        {error && (
          <div className="p-3.5 bg-red-950/80 border border-red-800 text-red-200 text-xs flex items-center gap-2">
            <AlertCircle className="w-4 h-4 shrink-0" />
            <span>{error}</span>
          </div>
        )}

        {resetSuccess && (
          <div className="p-3.5 bg-green-950/80 border border-green-800 text-green-200 text-xs flex items-center gap-2">
            <Check className="w-4 h-4 shrink-0" />
            <span>{resetSuccess}</span>
          </div>
        )}

        {!showForgotPassword ? (
          /* Email / Password Form */
          <form onSubmit={handleSignIn} className="space-y-4">
            <div>
              <label className="block text-[11px] uppercase tracking-wider text-[#D4CCB8] font-mono mb-1.5">
                Email Address
              </label>
              <div className="relative">
                <Mail className="w-4 h-4 absolute left-3.5 top-1/2 -translate-y-1/2 text-[#7B756C]" />
                <input
                  type="email"
                  required
                  placeholder="admin@mozaikstone.com"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="w-full bg-[#1C1A18] border border-[#4A4036] pl-10 pr-4 py-2.5 text-xs text-white placeholder-[#7B756C] focus:outline-hidden focus:border-[#D4CCB8]"
                />
              </div>
            </div>

            <div>
              <div className="flex items-center justify-between mb-1.5">
                <label className="text-[11px] uppercase tracking-wider text-[#D4CCB8] font-mono">
                  Password
                </label>
                <button
                  type="button"
                  onClick={() => {
                    setResetEmail(email);
                    setShowForgotPassword(true);
                  }}
                  className="text-[10px] text-[#A89F8D] hover:text-white uppercase tracking-wider underline cursor-pointer"
                >
                  Forgot Password?
                </button>
              </div>
              <div className="relative">
                <Key className="w-4 h-4 absolute left-3.5 top-1/2 -translate-y-1/2 text-[#7B756C]" />
                <input
                  type="password"
                  required
                  placeholder="••••••••••••"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className="w-full bg-[#1C1A18] border border-[#4A4036] pl-10 pr-4 py-2.5 text-xs text-white placeholder-[#7B756C] focus:outline-hidden focus:border-[#D4CCB8]"
                />
              </div>
            </div>

            <button
              type="submit"
              disabled={loading}
              className="w-full py-3 px-4 bg-[#FBF9F5] text-[#1C1A18] hover:bg-[#D4CCB8] text-xs uppercase tracking-[0.2em] font-semibold transition-all cursor-pointer disabled:opacity-50 mt-2"
            >
              {loading ? 'Authenticating...' : 'Sign In'}
            </button>
          </form>
        ) : (
          /* Forgot Password View */
          <form onSubmit={handleResetPassword} className="space-y-4">
            <div className="p-3 bg-[#1C1A18] border border-[#4A4036] text-xs text-[#D4CCB8]">
              Enter your admin email address and Firebase will email a secure password reset link.
            </div>

            <div>
              <label className="block text-[11px] uppercase tracking-wider text-[#D4CCB8] font-mono mb-1.5">
                Admin Email
              </label>
              <input
                type="email"
                required
                placeholder="admin@mozaikstone.com"
                value={resetEmail}
                onChange={(e) => setResetEmail(e.target.value)}
                className="w-full bg-[#1C1A18] border border-[#4A4036] px-4 py-2.5 text-xs text-white placeholder-[#7B756C] focus:outline-hidden focus:border-[#D4CCB8]"
              />
            </div>

            <div className="flex gap-2">
              <button
                type="button"
                onClick={() => setShowForgotPassword(false)}
                className="w-1/2 py-2.5 px-3 border border-[#4A4036] text-xs text-[#D4CCB8] hover:text-white"
              >
                Back
              </button>
              <button
                type="submit"
                disabled={loading}
                className="w-1/2 py-2.5 px-3 bg-[#FBF9F5] text-[#1C1A18] hover:bg-[#D4CCB8] text-xs uppercase tracking-wider font-semibold"
              >
                Send Reset
              </button>
            </div>
          </form>
        )}

        {/* Alternative fast logins */}
        <div className="relative flex py-2 items-center">
          <div className="grow border-t border-[#4A4036]"></div>
          <span className="shrink mx-4 text-[9px] uppercase tracking-widest text-[#7B756C]">or instant admin access</span>
          <div className="grow border-t border-[#4A4036]"></div>
        </div>

        <div className="space-y-2">
          <button
            type="button"
            onClick={handleGoogleSignIn}
            disabled={loading}
            className="w-full flex items-center justify-center gap-2.5 py-2.5 px-4 bg-[#1C1A18] hover:bg-[#38332E] border border-[#4A4036] text-xs text-white uppercase tracking-[0.14em] font-medium transition-all cursor-pointer"
          >
            <svg className="w-3.5 h-3.5" viewBox="0 0 24 24">
              <path
                fill="#4285F4"
                d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"
              />
              <path
                fill="#34A853"
                d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"
              />
              <path
                fill="#FBBC05"
                d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.06H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.94l2.85-2.22.81-.63z"
              />
              <path
                fill="#EA4335"
                d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.06l3.66 2.84c.87-2.6 3.3-4.52 6.16-4.52z"
              />
            </svg>
            <span>Sign In with Google</span>
          </button>

          <button
            type="button"
            onClick={handleDemoSignIn}
            className="w-full flex items-center justify-center gap-2 py-2.5 px-4 bg-[#1C1A18] hover:bg-[#38332E] border border-[#4A4036] text-[#D4CCB8] text-xs uppercase tracking-[0.14em] font-medium transition-all cursor-pointer"
          >
            <Sparkles className="w-3.5 h-3.5 text-[#D4CCB8]" />
            <span>Developer / Studio Demo Login</span>
          </button>
        </div>

        <div className="pt-4 border-t border-[#4A4036] text-center text-xs text-[#7B756C]">
          <button
            onClick={() => navigate('/')}
            className="text-[#D4CCB8] hover:underline text-[11px]"
          >
            ← Return to MOZAIK Website
          </button>
        </div>
      </div>
    </div>
  );
};
