import React from 'react';
import { useApp } from '../modules/state/AppProvider';
import { getCurrentUser, logoutUser } from '../modules/auth/authUtils';
import { User, Mail, Lock, Calendar, AlertCircle, CheckCircle, Trash2, LogOut } from 'lucide-react';
import { saveAs } from '../modules/settings/exportUtil';
import jsPDF from 'jspdf';
import { useCurrencyFormatter, sumBy } from '../modules/utils/money';

const API_URL = (import.meta.env.VITE_API_URL || 'http://localhost:5000/api').replace(/\/$/, '').replace(/\/api$/, '') + '/api';

export const ProfilePage: React.FC = () => {
    const { transactions, categories, preferences, setDarkMode, setCurrency, resetSampleData } = useApp();
    const currentUser = getCurrentUser();
    const fmt = useCurrencyFormatter(preferences.currency);
    const [isEditing, setIsEditing] = React.useState(false);
    const [isChangingPassword, setIsChangingPassword] = React.useState(false);
    
    // Edit profile state
    const [name, setName] = React.useState(currentUser?.name || '');
    const [email, setEmail] = React.useState(currentUser?.email || '');
    
    // Change password state
    const [currentPassword, setCurrentPassword] = React.useState('');
    const [newPassword, setNewPassword] = React.useState('');
    const [confirmPassword, setConfirmPassword] = React.useState('');
    
    // UI state
    const [loading, setLoading] = React.useState(false);
    const [uploadProgress, setUploadProgress] = React.useState(0);
    const [error, setError] = React.useState('');
    const [success, setSuccess] = React.useState('');

    const handleUpdateProfile = async (e: React.FormEvent) => {
        e.preventDefault();
        setError('');
        setSuccess('');
        setLoading(true);

        try {
            const response = await fetch(`${API_URL}/user/profile`, {
                method: 'PUT',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${currentUser?.token}`
                },
                body: JSON.stringify({ name, email })
            });

            const data = await response.json();

            if (!response.ok) {
                throw new Error(data.message || 'Failed to update profile');
            }

            // Update local storage with new user data
            const updatedUser = { ...currentUser, name: data.name, email: data.email };
            localStorage.setItem('pft_user', JSON.stringify(updatedUser));
            
            setSuccess('Profile updated successfully!');
            setIsEditing(false);
            
            // Refresh page to update UI
            setTimeout(() => window.location.reload(), 1500);
        } catch (err: any) {
            setError(err.message || 'Failed to update profile');
        } finally {
            setLoading(false);
        }
    };

    const handleChangePassword = async (e: React.FormEvent) => {
        e.preventDefault();
        setError('');
        setSuccess('');

        if (newPassword !== confirmPassword) {
            setError('Passwords do not match');
            return;
        }

        if (newPassword.length < 6) {
            setError('Password must be at least 6 characters');
            return;
        }

        setLoading(true);

        try {
            const response = await fetch(`${API_URL}/user/password`, {
                method: 'PUT',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${currentUser?.token}`
                },
                body: JSON.stringify({ currentPassword, newPassword })
            });

            const data = await response.json();

            if (!response.ok) {
                throw new Error(data.message || 'Failed to change password');
            }

            setSuccess('Password changed successfully!');
            setCurrentPassword('');
            setNewPassword('');
            setConfirmPassword('');
            setIsChangingPassword(false);
        } catch (err: any) {
            setError(err.message || 'Failed to change password');
        } finally {
            setLoading(false);
        }
    };

    const handleDeleteAccount = async () => {
        const confirmed = window.confirm(
            'Are you sure you want to delete your account? This action cannot be undone and all your data will be permanently deleted.'
        );

        if (!confirmed) return;

        const doubleConfirm = window.confirm(
            'This is your last chance. Are you absolutely sure you want to delete your account?'
        );

        if (!doubleConfirm) return;

        try {
            const response = await fetch(`${API_URL}/user/account`, {
                method: 'DELETE',
                headers: {
                    'Authorization': `Bearer ${currentUser?.token}`
                }
            });

            if (response.ok) {
                logoutUser();
                window.location.reload();
            } else {
                const data = await response.json();
                setError(data.message || 'Failed to delete account');
            }
        } catch (err: any) {
            setError('Failed to delete account');
        }
    };

    const exportToPDF = () => {
        const doc = new jsPDF();
        const pageWidth = doc.internal.pageSize.getWidth();
        
        // Title
        doc.setFontSize(20);
        doc.setFont('helvetica', 'bold');
        doc.text('Personal Finance Report', pageWidth / 2, 20, { align: 'center' });
        
        // Date
        doc.setFontSize(10);
        doc.setFont('helvetica', 'normal');
        doc.text(`Generated: ${new Date().toLocaleDateString()}`, pageWidth / 2, 28, { align: 'center' });
        
        let yPos = 40;
        
        // Summary Section
        doc.setFontSize(14);
        doc.setFont('helvetica', 'bold');
        doc.text('Financial Summary', 14, yPos);
        yPos += 10;
        
        const income = sumBy(transactions.filter((t) => t.type === 'income'), (t) => t.amountCents);
        const expense = sumBy(transactions.filter((t) => t.type === 'expense'), (t) => t.amountCents);
        const balance = income - expense;
        
        doc.setFontSize(11);
        doc.setFont('helvetica', 'normal');
        doc.text(`Total Income: ${fmt(income)}`, 14, yPos);
        yPos += 7;
        doc.text(`Total Expenses: ${fmt(expense)}`, 14, yPos);
        yPos += 7;
        doc.text(`Balance: ${fmt(balance)}`, 14, yPos);
        yPos += 7;
        doc.text(`Total Transactions: ${transactions.length}`, 14, yPos);
        yPos += 15;
        
        // Categories Section
        doc.setFontSize(14);
        doc.setFont('helvetica', 'bold');
        doc.text('Categories', 14, yPos);
        yPos += 10;
        
        doc.setFontSize(10);
        doc.setFont('helvetica', 'normal');
        categories.forEach((cat) => {
            if (yPos > 270) {
                doc.addPage();
                yPos = 20;
            }
            doc.text(`${cat.icon} ${cat.name}`, 14, yPos);
            yPos += 6;
        });
        
        yPos += 10;
        
        // Transactions Section
        doc.setFontSize(14);
        doc.setFont('helvetica', 'bold');
        doc.text('Recent Transactions', 14, yPos);
        yPos += 10;
        
        doc.setFontSize(9);
        doc.setFont('helvetica', 'normal');
        
        // Table headers
        doc.setFont('helvetica', 'bold');
        doc.text('Date', 14, yPos);
        doc.text('Type', 45, yPos);
        doc.text('Amount', 75, yPos);
        doc.text('Category', 110, yPos);
        doc.text('Note', 145, yPos);
        yPos += 6;
        doc.setFont('helvetica', 'normal');
        
        // Sort transactions by date (most recent first)
        const sortedTransactions = [...transactions].sort((a, b) => 
            new Date(b.dateIso).getTime() - new Date(a.dateIso).getTime()
        ).slice(0, 50); // Limit to 50 most recent
        
        sortedTransactions.forEach((t) => {
            if (yPos > 280) {
                doc.addPage();
                yPos = 20;
                // Repeat headers on new page
                doc.setFont('helvetica', 'bold');
                doc.text('Date', 14, yPos);
                doc.text('Type', 45, yPos);
                doc.text('Amount', 75, yPos);
                doc.text('Category', 110, yPos);
                doc.text('Note', 145, yPos);
                yPos += 6;
                doc.setFont('helvetica', 'normal');
            }
            
            const category = categories.find(c => c.id === t.categoryId);
            const date = new Date(t.dateIso).toLocaleDateString();
            const amount = fmt(t.amountCents);
            
            doc.text(date.substring(0, 10), 14, yPos);
            doc.text(t.type, 45, yPos);
            doc.text(amount, 75, yPos);
            doc.text(category?.name || 'N/A', 110, yPos);
            doc.text((t.note || '').substring(0, 20), 145, yPos);
            yPos += 6;
        });
        
        // Footer
        const totalPages = doc.internal.pages.length - 1;
        for (let i = 1; i <= totalPages; i++) {
            doc.setPage(i);
            doc.setFontSize(8);
            doc.setTextColor(128);
            doc.text(`Page ${i} of ${totalPages}`, pageWidth / 2, doc.internal.pageSize.getHeight() - 10, { align: 'center' });
        }
        
        // Save the PDF
        doc.save(`finance-report-${new Date().toISOString().split('T')[0]}.pdf`);
    };

    const handleLogout = () => {
        logoutUser();
        window.location.reload();
    };

    const handleAvatarUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
        const file = e.target.files?.[0];
        if (!file) return;

        // Validate file type
        if (!file.type.startsWith('image/')) {
            setError('Please upload an image file (JPG, PNG, GIF, WebP, etc.)');
            return;
        }

        // Validate file size (max 2MB)
        const maxSize = 2 * 1024 * 1024; // 2MB in bytes
        if (file.size > maxSize) {
            const fileSizeMB = (file.size / (1024 * 1024)).toFixed(2);
            setError(`Image size is ${fileSizeMB}MB. Maximum allowed size is 2MB. Please choose a smaller image.`);
            return;
        }

        setLoading(true);
        setError('');
        setUploadProgress(0);

        // Simulate progress for better UX
        const progressInterval = setInterval(() => {
            setUploadProgress(prev => {
                if (prev >= 90) {
                    clearInterval(progressInterval);
                    return 90;
                }
                return prev + 10;
            });
        }, 100);

        // Convert to base64
        const reader = new FileReader();
        reader.onloadend = async () => {
            try {
                const base64String = reader.result as string;

                const response = await fetch(`${API_URL}/user/avatar`, {
                    method: 'PUT',
                    headers: {
                        'Content-Type': 'application/json',
                        'Authorization': `Bearer ${currentUser?.token}`
                    },
                    body: JSON.stringify({ avatar: base64String })
                });

                const data = await response.json();

                if (!response.ok) {
                    throw new Error(data.message || 'Failed to upload avatar');
                }

                // Complete progress
                clearInterval(progressInterval);
                setUploadProgress(100);

                // Update local storage
                const updatedUser = { ...currentUser, avatar: data.avatar };
                localStorage.setItem('pft_user', JSON.stringify(updatedUser));

                setSuccess('Profile picture updated successfully!');
                
                // Refresh page to update avatar everywhere
                setTimeout(() => window.location.reload(), 1500);
            } catch (err: any) {
                clearInterval(progressInterval);
                setError(err.message || 'Failed to upload avatar');
                setLoading(false);
                setUploadProgress(0);
            }
        };

        reader.onerror = () => {
            clearInterval(progressInterval);
            setError('Failed to read image file');
            setLoading(false);
            setUploadProgress(0);
        };

        reader.readAsDataURL(file);
    };

    const accountStats = {
        totalTransactions: transactions.length,
        totalIncome: transactions.filter(t => t.type === 'income').length,
        totalExpenses: transactions.filter(t => t.type === 'expense').length,
        totalCategories: categories.length,
        memberSince: currentUser?.createdAt ? new Date(currentUser.createdAt).toLocaleDateString('en-US', { 
            month: 'long', 
            year: 'numeric' 
        }) : 'Unknown'
    };

    return (
        <div className="space-y-6 animate-fade-in">
            <div className="mb-6">
                <h1 className="text-3xl font-bold text-slate-900 dark:text-white font-display mb-2">My Profile</h1>
                <p className="text-slate-600 dark:text-slate-400">Manage your account settings and preferences</p>
            </div>

            {/* Error/Success Messages */}
            {error && (
                <div className="p-4 rounded-lg bg-rose-50 dark:bg-rose-950/30 border border-rose-200 dark:border-rose-800 flex items-start gap-2 animate-fade-in">
                    <AlertCircle className="h-5 w-5 text-rose-600 dark:text-rose-400 flex-shrink-0 mt-0.5" />
                    <span className="text-sm text-rose-700 dark:text-rose-300">{error}</span>
                </div>
            )}
            {success && (
                <div className="p-4 rounded-lg bg-emerald-50 dark:bg-emerald-950/30 border border-emerald-200 dark:border-emerald-800 flex items-start gap-2 animate-fade-in">
                    <CheckCircle className="h-5 w-5 text-emerald-600 dark:text-emerald-400 flex-shrink-0 mt-0.5" />
                    <span className="text-sm text-emerald-700 dark:text-emerald-300">{success}</span>
                </div>
            )}

            {/* Profile Header */}
            <div className="card p-6">
                <div className="flex flex-col sm:flex-row items-center gap-6">
                    <div className="relative group">
                        {currentUser?.avatar ? (
                            <img 
                                src={currentUser.avatar} 
                                alt={currentUser.name}
                                className="h-24 w-24 rounded-full object-cover ring-4 ring-brand-400/30 shadow-lg shadow-brand-500/30"
                            />
                        ) : (
                            <div className="h-24 w-24 rounded-full bg-gradient-to-br from-brand-600 to-brand-500 flex items-center justify-center ring-4 ring-brand-400/30 shadow-lg shadow-brand-500/30">
                                <span className="text-white font-bold text-4xl">{currentUser?.name?.charAt(0).toUpperCase() || 'U'}</span>
                            </div>
                        )}
                        
                        {/* Upload Button Overlay */}
                        <label className={`absolute inset-0 flex items-center justify-center bg-black/50 rounded-full opacity-0 group-hover:opacity-100 transition-opacity ${loading ? 'pointer-events-none' : 'cursor-pointer'}`}>
                            <User className="h-8 w-8 text-white" />
                            <input 
                                type="file" 
                                accept="image/*" 
                                className="hidden"
                                onChange={handleAvatarUpload}
                                disabled={loading}
                            />
                        </label>

                        {/* Upload Progress */}
                        {uploadProgress > 0 && uploadProgress < 100 && (
                            <div className="absolute -bottom-8 left-0 right-0">
                                <div className="w-24 bg-slate-200 dark:bg-slate-700 rounded-full h-2 overflow-hidden">
                                    <div 
                                        className="bg-gradient-to-r from-brand-600 to-brand-500 h-full transition-all duration-300"
                                        style={{ width: `${uploadProgress}%` }}
                                    />
                                </div>
                                <div className="text-xs text-center text-slate-600 dark:text-slate-400 mt-1">
                                    {uploadProgress}%
                                </div>
                            </div>
                        )}
                    </div>
                    <div className="flex-1 text-center sm:text-left">
                        <h2 className="text-2xl font-bold text-slate-900 dark:text-white mb-1">{currentUser?.name}</h2>
                        <p className="text-slate-600 dark:text-slate-400 mb-2">{currentUser?.email}</p>
                        <div className="flex items-center gap-2 text-sm text-slate-500 dark:text-slate-500 justify-center sm:justify-start">
                            <Calendar className="h-4 w-4" />
                            <span>Member since {accountStats.memberSince}</span>
                        </div>
                        <p className="text-xs text-slate-500 dark:text-slate-500 mt-2">
                            {loading ? 'Uploading...' : 'Click on avatar to change profile picture'}
                        </p>
                    </div>
                </div>
            </div>

            {/* Account Statistics */}
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                <div className="card p-4">
                    <div className="text-sm text-slate-600 dark:text-slate-400 mb-1">Total Transactions</div>
                    <div className="text-2xl font-bold text-slate-900 dark:text-white">{accountStats.totalTransactions}</div>
                </div>
                <div className="card p-4">
                    <div className="text-sm text-slate-600 dark:text-slate-400 mb-1">Income Entries</div>
                    <div className="text-2xl font-bold text-emerald-600 dark:text-emerald-400">{accountStats.totalIncome}</div>
                </div>
                <div className="card p-4">
                    <div className="text-sm text-slate-600 dark:text-slate-400 mb-1">Expense Entries</div>
                    <div className="text-2xl font-bold text-rose-600 dark:text-rose-400">{accountStats.totalExpenses}</div>
                </div>
                <div className="card p-4">
                    <div className="text-sm text-slate-600 dark:text-slate-400 mb-1">Categories</div>
                    <div className="text-2xl font-bold text-violet-600 dark:text-violet-400">{accountStats.totalCategories}</div>
                </div>
            </div>

            {/* Edit Profile */}
            <div className="card p-6">
                <div className="flex items-center justify-between mb-4">
                    <h3 className="text-lg font-bold text-slate-900 dark:text-white">Profile Information</h3>
                    {!isEditing && (
                        <button
                            onClick={() => setIsEditing(true)}
                            className="btn-ghost text-sm"
                        >
                            Edit Profile
                        </button>
                    )}
                </div>

                {isEditing ? (
                    <form onSubmit={handleUpdateProfile} className="space-y-4">
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
                                required
                            />
                        </div>

                        <div className="space-y-2">
                            <label className="text-sm font-medium text-slate-700 dark:text-slate-300 flex items-center gap-2">
                                <Mail className="h-4 w-4" />
                                Email Address
                            </label>
                            <input
                                type="email"
                                value={email}
                                onChange={(e) => setEmail(e.target.value)}
                                className="input w-full"
                                required
                            />
                        </div>

                        <div className="flex gap-3">
                            <button type="submit" className="btn-primary" disabled={loading}>
                                {loading ? 'Saving...' : 'Save Changes'}
                            </button>
                            <button
                                type="button"
                                onClick={() => {
                                    setIsEditing(false);
                                    setName(currentUser?.name || '');
                                    setEmail(currentUser?.email || '');
                                    setError('');
                                }}
                                className="btn-ghost"
                            >
                                Cancel
                            </button>
                        </div>
                    </form>
                ) : (
                    <div className="space-y-3">
                        <div className="flex items-center gap-3 text-slate-700 dark:text-slate-300">
                            <User className="h-5 w-5 text-slate-400" />
                            <span>{currentUser?.name}</span>
                        </div>
                        <div className="flex items-center gap-3 text-slate-700 dark:text-slate-300">
                            <Mail className="h-5 w-5 text-slate-400" />
                            <span>{currentUser?.email}</span>
                        </div>
                    </div>
                )}
            </div>

            {/* Change Password */}
            <div className="card p-6">
                <div className="flex items-center justify-between mb-4">
                    <h3 className="text-lg font-bold text-slate-900 dark:text-white">Password</h3>
                    {!isChangingPassword && (
                        <button
                            onClick={() => setIsChangingPassword(true)}
                            className="btn-ghost text-sm"
                        >
                            Change Password
                        </button>
                    )}
                </div>

                {isChangingPassword ? (
                    <form onSubmit={handleChangePassword} className="space-y-4">
                        <div className="space-y-2">
                            <label className="text-sm font-medium text-slate-700 dark:text-slate-300 flex items-center gap-2">
                                <Lock className="h-4 w-4" />
                                Current Password
                            </label>
                            <input
                                type="password"
                                value={currentPassword}
                                onChange={(e) => setCurrentPassword(e.target.value)}
                                className="input w-full"
                                required
                            />
                        </div>

                        <div className="space-y-2">
                            <label className="text-sm font-medium text-slate-700 dark:text-slate-300">
                                New Password
                            </label>
                            <input
                                type="password"
                                value={newPassword}
                                onChange={(e) => setNewPassword(e.target.value)}
                                className="input w-full"
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
                                required
                            />
                        </div>

                        <div className="flex gap-3">
                            <button type="submit" className="btn-primary" disabled={loading}>
                                {loading ? 'Changing...' : 'Change Password'}
                            </button>
                            <button
                                type="button"
                                onClick={() => {
                                    setIsChangingPassword(false);
                                    setCurrentPassword('');
                                    setNewPassword('');
                                    setConfirmPassword('');
                                    setError('');
                                }}
                                className="btn-ghost"
                            >
                                Cancel
                            </button>
                        </div>
                    </form>
                ) : (
                    <p className="text-sm text-slate-600 dark:text-slate-400">
                        ••••••••
                    </p>
                )}
            </div>

            {/* App Settings Section */}
            <div className="card p-6">
                <h3 className="text-lg font-bold text-slate-900 dark:text-white mb-4">App Settings</h3>
                
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mb-6">
                    <div className="space-y-3">
                        <div className="font-medium text-slate-900 dark:text-white">Appearance</div>
                        <label className="inline-flex items-center gap-3 cursor-pointer">
                            <input 
                                type="checkbox" 
                                checked={preferences.darkMode} 
                                onChange={(e) => setDarkMode(e.target.checked)}
                                className="w-5 h-5 rounded border-slate-300 dark:border-slate-600 text-brand-600 focus:ring-2 focus:ring-brand-500/50"
                            />
                            <span className="text-slate-700 dark:text-slate-300">Dark mode</span>
                        </label>
                    </div>
                    <div className="space-y-3">
                        <div className="font-medium text-slate-900 dark:text-white">Currency</div>
                        <select 
                            value={preferences.currency} 
                            onChange={(e) => setCurrency(e.target.value)} 
                            className="select w-full"
                        >
                            <option>USD</option>
                            <option>EUR</option>
                            <option>INR</option>
                        </select>
                    </div>
                </div>

                <div className="space-y-4">
                    <div className="font-medium text-slate-900 dark:text-white">Data Management</div>
                    <div className="flex flex-wrap gap-3">
                        <button 
                            onClick={exportToPDF} 
                            className="btn-primary"
                        >
                            📄 Export as PDF
                        </button>
                        <button 
                            onClick={resetSampleData} 
                            className="btn-outline text-rose-600 dark:text-rose-400 border-rose-300 dark:border-rose-700 hover:bg-rose-50 dark:hover:bg-rose-950/30"
                        >
                            Reset Sample Data
                        </button>
                    </div>
                    <p className="text-sm text-slate-600 dark:text-slate-400">
                        Export your financial data as a formatted PDF report with all transactions and summaries.
                    </p>
                </div>

                <div className="mt-6 pt-6 border-t border-slate-200 dark:border-slate-800">
                    <div className="font-medium text-slate-900 dark:text-white mb-3">Session</div>
                    <button
                        onClick={handleLogout}
                        className="btn-outline text-rose-600 dark:text-rose-400 border-rose-300 dark:border-rose-700 hover:bg-rose-50 dark:hover:bg-rose-950/30"
                    >
                        <LogOut className="h-4 w-4" />
                        Log out
                    </button>
                </div>
            </div>

            {/* Danger Zone */}
            <div className="card p-6 border-rose-200 dark:border-rose-800">
                <h3 className="text-lg font-bold text-rose-600 dark:text-rose-400 mb-4">Danger Zone</h3>
                <div className="flex items-start justify-between gap-4">
                    <div>
                        <p className="font-medium text-slate-900 dark:text-white mb-1">Delete Account</p>
                        <p className="text-sm text-slate-600 dark:text-slate-400">
                            Permanently delete your account and all associated data. This action cannot be undone.
                        </p>
                    </div>
                    <button
                        onClick={handleDeleteAccount}
                        className="btn-outline text-rose-600 dark:text-rose-400 border-rose-300 dark:border-rose-700 hover:bg-rose-50 dark:hover:bg-rose-950/30 flex-shrink-0"
                    >
                        <Trash2 className="h-4 w-4" />
                        Delete
                    </button>
                </div>
            </div>
        </div>
    );
};
