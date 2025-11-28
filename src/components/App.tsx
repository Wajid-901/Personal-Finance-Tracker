import React from 'react';
import { AppProvider } from '../modules/state/AppProvider';
import { Header } from './Header';
import { Dashboard } from './Dashboard';
import { TransactionsPage } from './TransactionsPage';
import { CategoriesPage } from './CategoriesPage';
import { ProfilePage } from './ProfilePage';
import { AuthPage } from './AuthPage';
import { ResetPasswordPage } from './ResetPasswordPage';
import { isAuthenticated } from '../modules/auth/authUtils';
import { clsx } from 'clsx';

export const App: React.FC = () => {
    const [route, setRoute] = React.useState<'dashboard' | 'transactions' | 'categories' | 'profile'>(
        'dashboard'
    );
    const [hasAccess, setHasAccess] = React.useState<boolean>(() => isAuthenticated());

    // Check for reset password route
    const path = window.location.pathname;
    if (path.startsWith('/resetpassword/')) {
        const token = path.split('/')[2];
        return (
            <ResetPasswordPage 
                token={token} 
                onSuccess={() => {
                    window.location.href = '/';
                }} 
            />
        );
    }

    if (!hasAccess) {
        return (
            <AuthPage onSuccess={() => setHasAccess(true)} />
        );
    }

    return (
        <AppProvider>
            <div className={clsx('min-h-screen bg-slate-50 text-slate-900 dark:bg-slate-950 dark:text-slate-50')}> 
                <Header route={route} onNavigate={setRoute} />
                <main className="container-responsive py-6">
                    {route === 'dashboard' && <Dashboard />}
                    {route === 'transactions' && <TransactionsPage />}
                    {route === 'categories' && <CategoriesPage />}
                    {route === 'profile' && <ProfilePage />}
                </main>
            </div>
        </AppProvider>
    );
};
