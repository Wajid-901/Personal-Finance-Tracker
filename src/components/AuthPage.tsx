import React, { useState } from 'react';
import { LogIn, UserPlus, Mail, Lock, User, AlertCircle, CheckCircle, ArrowLeft } from 'lucide-react';
import { loginUser, registerUser, setCurrentUser, forgotPassword } from '../modules/auth/authUtils';

interface AuthPageProps {
    onSuccess: () => void;
}

export const AuthPage: React.FC<AuthPageProps> = ({ onSuccess }) => {
    const [isLogin, setIsLogin] = useState(true);
    const [isForgotPassword, setIsForgotPassword] = useState(false);
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [name, setName] = useState('');
    const [error, setError] = useState('');
    const [loading, setLoading] = useState(false);
    const [success, setSuccess] = useState('');

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setError('');
        setSuccess('');
        setLoading(true);

        try {
            if (isForgotPassword) {
                // Forgot Password
                const result = await forgotPassword(email);
                if (result.success) {
                    setSuccess('Email sent! Check your inbox for reset instructions.');
                } else {
                    setError(result.error || 'Failed to send reset email');
                }
            } else if (isLogin) {
                // Login
                const result = await loginUser(email, password);
                if (result.success && result.user) {
                    setCurrentUser(result.user);
                    setSuccess('Login successful!');
                    setTimeout(() => onSuccess(), 500);
                } else {
                    setError(result.error || 'Login failed');
                }
            } else {
                // Register
                const result = await registerUser(email, password, name);
                if (result.success && result.user) {
                    setCurrentUser(result.user);
                    setSuccess('Account created successfully!');
                    setTimeout(() => onSuccess(), 500);
                } else {
                    setError(result.error || 'Registration failed');
                }
            }
        } catch (err) {
            setError('An unexpected error occurred');
        } finally {
            setLoading(false);
        }
    };

    const toggleMode = () => {
        setIsLogin(!isLogin);
        setError('');
        setSuccess('');
        setEmail('');
        setPassword('');
        setName('');
        setIsForgotPassword(false);
    };

    const getPasswordStrength = (pwd: string): { strength: number; label: string; color: string } => {
        if (pwd.length === 0) return { strength: 0, label: '', color: '' };
        if (pwd.length < 6) return { strength: 1, label: 'Weak', color: 'bg-rose-500' };
        if (pwd.length < 10) return { strength: 2, label: 'Medium', color: 'bg-amber-500' };
        return { strength: 3, label: 'Strong', color: 'bg-emerald-500' };
    };

    const passwordStrength = !isLogin && !isForgotPassword ? getPasswordStrength(password) : null;

    return (
        <div className="min-h-screen flex items-center justify-center bg-gradient-to-b from-slate-50 to-white dark:from-slate-950 dark:to-slate-900 p-4">
            <div className="w-full max-w-md">
                {/* Logo */}
                <div className="text-center mb-8 animate-fade-in-down">
                    <div className="inline-flex h-16 w-16 rounded-2xl bg-gradient-to-br from-brand-600 to-brand-500 items-center justify-center ring-4 ring-brand-400/30 shadow-lg shadow-brand-500/30 mb-4">
                        <span className="text-white font-bold text-2xl">$</span>
                    </div>
                    <h1 className="text-2xl font-bold text-slate-900 dark:text-white font-display">
                        Personal Finance Tracker
                    </h1>
                    <p className="text-slate-600 dark:text-slate-400 mt-2">
                        {isForgotPassword ? 'Reset your password' : (isLogin ? 'Welcome back!' : 'Create your account')}
                    </p>
                </div>

                {/* Auth Card */}
                <div className="card p-8 animate-fade-in-up">
                    {/* Toggle Tabs */}
                    {!isForgotPassword && (
                        <div className="flex gap-2 mb-6 p-1 bg-slate-100/80 dark:bg-slate-800/80 rounded-xl">
                            <button
                                onClick={() => setIsLogin(true)}
                                className={`flex-1 py-2.5 px-4 rounded-lg font-medium transition-all duration-200 ${
                                    isLogin
                                        ? 'bg-white dark:bg-slate-900 text-brand-600 shadow-md'
                                        : 'text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-slate-200'
                                }`}
                            >
                                <LogIn className="h-4 w-4 inline mr-2" />
                                Login
                            </button>
                            <button
                                onClick={() => setIsLogin(false)}
                                className={`flex-1 py-2.5 px-4 rounded-lg font-medium transition-all duration-200 ${
                                    !isLogin
                                        ? 'bg-white dark:bg-slate-900 text-brand-600 shadow-md'
                                        : 'text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-slate-200'
                                }`}
                            >
                                <UserPlus className="h-4 w-4 inline mr-2" />
                                Register
                            </button>
                        </div>
                    )}

                    {/* Error/Success Messages */}
                    {error && (
                        <div className="mb-4 p-3 rounded-lg bg-rose-50 dark:bg-rose-950/30 border border-rose-200 dark:border-rose-800 flex items-start gap-2 animate-fade-in">
                            <AlertCircle className="h-5 w-5 text-rose-600 dark:text-rose-400 flex-shrink-0 mt-0.5" />
                            <span className="text-sm text-rose-700 dark:text-rose-300">{error}</span>
                        </div>
                    )}
                    {success && (
                        <div className="mb-4 p-3 rounded-lg bg-emerald-50 dark:bg-emerald-950/30 border border-emerald-200 dark:border-emerald-800 flex items-start gap-2 animate-fade-in">
                            <CheckCircle className="h-5 w-5 text-emerald-600 dark:text-emerald-400 flex-shrink-0 mt-0.5" />
                            <span className="text-sm text-emerald-700 dark:text-emerald-300">{success}</span>
                        </div>
                    )}

                    {/* Form */}
                    <form onSubmit={handleSubmit} className="space-y-4">
                        {!isLogin && !isForgotPassword && (
                            <div className="space-y-2">
                                <label className="text-sm font-medium text-slate-700 dark:text-slate-300 flex items-center gap-2">
                                    <User className="h-4 w-4" />
                                    Full Name
                                </label>
                                <input
                                    type="text"
                                    value={name}
                                    onChange={(e) => setName(e.target.value)}
                                    className="input w-full"
                                    placeholder="John Doe"
                                    required
                                />
                            </div>
                        )}

                        <div className="space-y-2">
                            <label className="text-sm font-medium text-slate-700 dark:text-slate-300 flex items-center gap-2">
                                <Mail className="h-4 w-4" />
                                Email
                            </label>
                            <input
                                type="email"
                                value={email}
                                onChange={(e) => setEmail(e.target.value)}
                                className="input w-full"
                                placeholder="you@example.com"
                                required
                            />
                        </div>

                        {!isForgotPassword && (
                            <div className="space-y-2">
                                <div className="flex items-center justify-between">
                                    <label className="text-sm font-medium text-slate-700 dark:text-slate-300 flex items-center gap-2">
                                        <Lock className="h-4 w-4" />
                                        Password
                                    </label>
                                    {isLogin && (
                                        <button
                                            type="button"
                                            onClick={() => {
                                                setIsForgotPassword(true);
                                                setError('');
                                                setSuccess('');
                                            }}
                                            className="text-xs text-brand-600 dark:text-brand-400 hover:underline"
                                        >
                                            Forgot password?
                                        </button>
                                    )}
                                </div>
                                <input
                                    type="password"
                                    value={password}
                                    onChange={(e) => setPassword(e.target.value)}
                                    className="input w-full"
                                    placeholder="••••••••"
                                    required
                                    minLength={6}
                                />
                                {passwordStrength && password && (
                                    <div className="space-y-1">
                                        <div className="flex gap-1">
                                            {[1, 2, 3].map((level) => (
                                                <div
                                                    key={level}
                                                    className={`h-1 flex-1 rounded-full transition-all duration-300 ${
                                                        level <= passwordStrength.strength
                                                            ? passwordStrength.color
                                                            : 'bg-slate-200 dark:bg-slate-700'
                                                    }`}
                                                />
                                            ))}
                                        </div>
                                        <p className="text-xs text-slate-600 dark:text-slate-400">
                                            Password strength: <span className="font-medium">{passwordStrength.label}</span>
                                        </p>
                                    </div>
                                )}
                            </div>
                        )}

                        <button
                            type="submit"
                            disabled={loading}
                            className="btn-primary w-full text-base font-semibold py-3.5 mt-6 disabled:opacity-50 disabled:cursor-not-allowed"
                        >
                            {loading ? (
                                <span className="flex items-center justify-center gap-2">
                                    <div className="h-4 w-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                                    {isForgotPassword ? 'Sending Email...' : (isLogin ? 'Logging in...' : 'Creating account...')}
                                </span>
                            ) : (
                                <span>{isForgotPassword ? 'Send Reset Link' : (isLogin ? 'Login' : 'Create Account')}</span>
                            )}
                        </button>
                    </form>

                    {/* Footer */}
                    <div className="mt-6 text-center text-sm text-slate-600 dark:text-slate-400">
                        {isForgotPassword ? (
                            <button
                                onClick={() => {
                                    setIsForgotPassword(false);
                                    setError('');
                                    setSuccess('');
                                }}
                                className="flex items-center justify-center gap-2 text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white mx-auto"
                            >
                                <ArrowLeft className="h-4 w-4" />
                                Back to Login
                            </button>
                        ) : (
                            <>
                                {isLogin ? "Don't have an account? " : 'Already have an account? '}
                                <button
                                    onClick={toggleMode}
                                    className="text-brand-600 dark:text-brand-400 font-medium hover:underline"
                                >
                                    {isLogin ? 'Register' : 'Login'}
                                </button>
                            </>
                        )}
                    </div>

                    {/* <div className="mt-4 text-xs text-center text-slate-500 dark:text-slate-600">
                        🔒 Your data is securely stored and accessible from any device
                    </div> */}
                </div>
            </div>
        </div>
    );
};
