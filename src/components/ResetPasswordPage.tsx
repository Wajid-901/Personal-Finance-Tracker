import React, { useState } from 'react';
import { Lock, AlertCircle, CheckCircle } from 'lucide-react';
import { resetPassword } from '../modules/auth/authUtils';

interface ResetPasswordPageProps {
    token: string;
    onSuccess: () => void;
}

export const ResetPasswordPage: React.FC<ResetPasswordPageProps> = ({ token, onSuccess }) => {
    const [password, setPassword] = useState('');
    const [confirmPassword, setConfirmPassword] = useState('');
    const [error, setError] = useState('');
    const [success, setSuccess] = useState('');
    const [loading, setLoading] = useState(false);

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setError('');
        setSuccess('');

        if (password !== confirmPassword) {
            setError('Passwords do not match');
            return;
        }

        if (password.length < 6) {
            setError('Password must be at least 6 characters');
            return;
        }

        setLoading(true);

        try {
            const result = await resetPassword(token, password);
            if (result.success) {
                setSuccess('Password reset successful! Redirecting...');
                setTimeout(() => onSuccess(), 2000);
            } else {
                setError(result.error || 'Failed to reset password');
            }
        } catch (err) {
            setError('An unexpected error occurred');
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="min-h-screen flex items-center justify-center bg-gradient-to-b from-slate-50 to-white dark:from-slate-950 dark:to-slate-900 p-4">
            <div className="w-full max-w-md">
                <div className="text-center mb-8 animate-fade-in-down">
                    <div className="inline-flex h-16 w-16 rounded-2xl bg-gradient-to-br from-brand-600 to-brand-500 items-center justify-center ring-4 ring-brand-400/30 shadow-lg shadow-brand-500/30 mb-4">
                        <Lock className="h-8 w-8 text-white" />
                    </div>
                    <h1 className="text-2xl font-bold text-slate-900 dark:text-white font-display">
                        Reset Password
                    </h1>
                    <p className="text-slate-600 dark:text-slate-400 mt-2">
                        Enter your new password below
                    </p>
                </div>

                <div className="card p-8 animate-fade-in-up">
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

                    <form onSubmit={handleSubmit} className="space-y-4">
                        <div className="space-y-2">
                            <label className="text-sm font-medium text-slate-700 dark:text-slate-300">
                                New Password
                            </label>
                            <input
                                type="password"
                                value={password}
                                onChange={(e) => setPassword(e.target.value)}
                                className="input w-full"
                                placeholder="••••••••"
                                required
                                minLength={6}
                            />
                        </div>

                        <div className="space-y-2">
                            <label className="text-sm font-medium text-slate-700 dark:text-slate-300">
                                Confirm New Password
                            </label>
                            <input
                                type="password"
                                value={confirmPassword}
                                onChange={(e) => setConfirmPassword(e.target.value)}
                                className="input w-full"
                                placeholder="••••••••"
                                required
                                minLength={6}
                            />
                        </div>

                        <button
                            type="submit"
                            disabled={loading}
                            className="btn-primary w-full text-base font-semibold py-3.5 mt-6 disabled:opacity-50 disabled:cursor-not-allowed"
                        >
                            {loading ? 'Resetting...' : 'Reset Password'}
                        </button>
                    </form>
                </div>
            </div>
        </div>
    );
};
