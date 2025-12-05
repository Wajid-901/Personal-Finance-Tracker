import React from 'react';
import { Routes, Route, Navigate, useLocation, useNavigate, useParams } from 'react-router-dom';
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
    const [hasAccess, setHasAccess] = React.useState<boolean>(() => isAuthenticated());
    const location = useLocation();
    const navigate = useNavigate();

    // Effect to handle basic auth redirection
    React.useEffect(() => {
        if (!hasAccess && !location.pathname.startsWith('/resetpassword')) {
             // Ideally we would redirect to a login route, but for now we render AuthPage conditionally 
             // or we could have a /login route.
             // Given the current structure, let's keep the AuthPage blocking if not authenticated
             // But to use Router properly, we should probably have a /login route.
             // For this refactor, I will keep it simple: if not authenticated and not on reset password, show AuthPage.
        }
    }, [hasAccess, location.pathname]);

    if (location.pathname.startsWith('/resetpassword/')) {
       // Allow access to reset password page without auth
    } else if (!hasAccess) {
        return <AuthPage onSuccess={() => setHasAccess(true)} />;
    }

    return (
        <AppProvider>
            <div className={clsx('min-h-screen bg-slate-50 text-slate-900 dark:bg-slate-950 dark:text-slate-50')}> 
                <Header />
                <main className="container-responsive py-6">
                    <Routes>
                        <Route path="/" element={<Dashboard />} />
                        <Route path="/dashboard" element={<Navigate to="/" replace />} />
                        <Route path="/transactions" element={<TransactionsPage />} />
                        <Route path="/categories" element={<CategoriesPage />} />
                        <Route path="/profile" element={<ProfilePage />} />
                         {/* Reset Password Route managed inside the main Routes if possible, 
                             but the original logic had it separate. 
                             Let's add it here for consistency if the user navigates to it directly 
                             or if we want to support deep linking properly.
                         */}
                        <Route path="/resetpassword/:token" element={<ResetPasswordWrapper />} />
                        <Route path="*" element={<Navigate to="/" replace />} />
                    </Routes>
                </main>
            </div>
        </AppProvider>
    );
};

const ResetPasswordWrapper: React.FC = () => {
    const { token } = useParams<{ token: string }>();
    if (!token) return <Navigate to="/" replace />;
    
    return (
        <ResetPasswordPage 
            token={token} 
            onSuccess={() => {
                window.location.href = '/';
            }} 
        />
    );
};
