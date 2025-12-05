import React from 'react';
import { Moon, Sun, Wallet, LineChart, List, Grid2x2, User as UserIcon, Menu, X } from 'lucide-react';
import { useApp } from '../modules/state/AppProvider';
import { getCurrentUser } from '../modules/auth/authUtils';
import { useLocation, useNavigate } from 'react-router-dom';

export const Header: React.FC = () => {
    const { preferences, setDarkMode } = useApp();
    const currentUser = getCurrentUser();
    const [mobileMenuOpen, setMobileMenuOpen] = React.useState(false);
    const toggle = () => setDarkMode(!preferences.darkMode);
    
    const location = useLocation();
    const navigate = useNavigate();
    
    // Normalize path to match ids
    const currentPath = location.pathname === '/' ? 'dashboard' : location.pathname.substring(1);

    const NavBtn: React.FC<{ id: string; icon: React.ReactNode; label: string }> = ({ id, icon, label }) => {
        const active = currentPath === id || (id === 'dashboard' && location.pathname === '/');
        return (
            <button 
                onClick={() => {
                    navigate(id === 'dashboard' ? '/' : `/${id}`);
                    setMobileMenuOpen(false);
                }} 
                className={`btn-ghost rounded-xl transition-all duration-200 w-full sm:w-auto ${active ? 'bg-gradient-to-r from-brand-500/10 to-sky-500/10 ring-2 ring-brand-500/30 shadow-lg shadow-brand-500/10' : 'hover:bg-slate-100/80 dark:hover:bg-slate-800/80'}`} 
                aria-pressed={active}
            >
                <span className="h-4 w-4">{icon}</span>
                <span className="font-medium">{label}</span>
            </button>
        );
    };
    
    return (
        <header className="sticky top-0 z-40 backdrop-blur-xl bg-white/80 dark:bg-slate-950/80 border-b border-slate-200/50 dark:border-slate-800/50 shadow-sm">
            <div className="container-responsive py-4 flex items-center justify-between gap-3">
                <button 
                    onClick={() => navigate('/')} 
                    className="flex items-center gap-3 font-bold hover:opacity-80 transition-opacity cursor-pointer"
                    aria-label="Go to dashboard"
                >
                    <div className="h-10 w-10 rounded-xl bg-gradient-to-br from-brand-600 to-brand-500 flex items-center justify-center ring-2 ring-brand-400/30 shadow-lg shadow-brand-500/30">
                        <Wallet className="h-5 w-5 text-white" />
                    </div>
                    <span className="tracking-tight text-slate-900 dark:text-white font-display hidden sm:block">Personal Finance Tracker</span>
                    <span className="tracking-tight text-slate-900 dark:text-white font-display sm:hidden">PFT</span>
                </button>
                
                {/* Desktop Navigation */}
                <nav className="hidden md:flex items-center gap-2">
                    <NavBtn id="dashboard" icon={<LineChart className="h-4 w-4" />} label="Dashboard" />
                    <NavBtn id="transactions" icon={<List className="h-4 w-4" />} label="Transactions" />
                    <NavBtn id="categories" icon={<Grid2x2 className="h-4 w-4" />} label="Categories" />
                </nav>
                
                <div className="flex items-center gap-3">
                    {/* Profile Button - Desktop */}
                    {currentUser && (
                        <button
                            onClick={() => navigate('/profile')}
                            className="hidden md:flex items-center gap-2 px-3 py-2 rounded-lg bg-slate-100/80 dark:bg-slate-800/80 hover:bg-slate-200/80 dark:hover:bg-slate-700/80 transition-all duration-200"
                            aria-label="View profile"
                        >
                            {currentUser.avatar ? (
                                <img 
                                    src={currentUser.avatar} 
                                    alt={currentUser.name}
                                    className="h-7 w-7 rounded-full object-cover ring-2 ring-brand-400/30"
                                />
                            ) : (
                                <div className="h-7 w-7 rounded-full bg-gradient-to-br from-brand-600 to-brand-500 flex items-center justify-center ring-2 ring-brand-400/30">
                                    <UserIcon className="h-4 w-4 text-white" />
                                </div>
                            )}
                            <span className="text-sm font-medium text-slate-700 dark:text-slate-300">{currentUser.name}</span>
                        </button>
                    )}
                    
                    {/* Theme Toggle */}
                    <button 
                        onClick={toggle} 
                        aria-label="Toggle theme" 
                        className="btn-ghost rounded-xl hover:bg-slate-100/80 dark:hover:bg-slate-800/80 transition-all duration-200"
                    >
                        {preferences.darkMode ? <Sun className="h-4 w-4" /> : <Moon className="h-4 w-4" />}
                    </button>
                    
                    {/* Mobile Menu Toggle */}
                    <button 
                        onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
                        className="md:hidden btn-ghost rounded-xl hover:bg-slate-100/80 dark:hover:bg-slate-800/80 transition-all duration-200"
                        aria-label="Toggle menu"
                    >
                        {mobileMenuOpen ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
                    </button>
                </div>
            </div>
            
            {/* Mobile Menu */}
            {mobileMenuOpen && (
                <>
                    {/* Backdrop */}
                    <div 
                        className="md:hidden fixed inset-0 bg-black/50 backdrop-blur-sm z-40"
                        onClick={() => setMobileMenuOpen(false)}
                    />
                    
                    {/* Menu Panel */}
                    <div className="md:hidden fixed top-[73px] left-0 right-0 bg-white/95 dark:bg-slate-950/95 backdrop-blur-xl border-b border-slate-200/50 dark:border-slate-800/50 shadow-xl z-50 animate-slide-in-down">
                        <nav className="container-responsive py-4 flex flex-col gap-2">
                            <NavBtn id="dashboard" icon={<LineChart className="h-4 w-4" />} label="Dashboard" />
                            <NavBtn id="transactions" icon={<List className="h-4 w-4" />} label="Transactions" />
                            <NavBtn id="categories" icon={<Grid2x2 className="h-4 w-4" />} label="Categories" />
                            <NavBtn id="profile" icon={<UserIcon className="h-4 w-4" />} label="Profile" />
                        </nav>
                    </div>
                </>
            )}
        </header>
    );
};


