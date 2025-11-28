import React from 'react';
import { LineChart, Shield, Download, Grid2x2, TrendingUp, Sparkles } from 'lucide-react';

interface LandingPageProps {
    onContinue: () => void;
}

export const LandingPage: React.FC<LandingPageProps> = ({ onContinue }) => {

    return (
        <div className="min-h-screen flex flex-col bg-gradient-to-b from-slate-50 to-white dark:from-slate-950 dark:to-slate-900">
            {/* HERO */}
            <section className="flex-1 py-12 md:py-16 lg:py-20">
                <div className="container-responsive">
                    <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
                    {/* Hero copy */}
                    <div className="animate-fade-in-up">
                        <div className="inline-flex items-center gap-2 rounded-full px-4 py-2 ring-1 ring-brand-500/30 bg-brand-500/10 text-slate-800 dark:text-brand-300 text-sm font-medium mb-6 animate-fade-in-down">
                            <Sparkles className="h-4 w-4 text-brand-500 animate-pulse-slow" />
                            <span>Track smarter</span>
                            <span className="h-1 w-1 rounded-full bg-brand-500/60" />
                            <span>Secure & Cloud Synced</span>
                        </div>
                        <h1 className="text-4xl sm:text-5xl lg:text-6xl font-extrabold tracking-tight text-slate-900 dark:text-white font-display">
                            <span className="block mb-2">Take Control of</span>
                            <span className="block text-gradient">Your Finances</span>
                        </h1>
                        <p className="mt-6 text-lg text-slate-600 dark:text-slate-300 max-w-2xl leading-relaxed">
                            Understand your spending, plan better, and stay in control. Visualize your income vs expenses, categorize transactions, and export your data — all securely stored and accessible from any device.
                        </p>
                        <ul className="mt-8 grid grid-cols-1 sm:grid-cols-2 gap-4 text-sm text-slate-700 dark:text-slate-300">
                            <li className="flex items-center gap-3 animate-slide-in-left" style={{animationDelay: '0.1s'}}>
                                <div className="h-8 w-8 rounded-lg bg-emerald-500/15 ring-1 ring-emerald-500/30 flex items-center justify-center">
                                    <TrendingUp className="h-4 w-4 text-emerald-600 dark:text-emerald-400" />
                                </div>
                                <span>Charts & insights</span>
                            </li>
                            <li className="flex items-center gap-3 animate-slide-in-left" style={{animationDelay: '0.2s'}}>
                                <div className="h-8 w-8 rounded-lg bg-sky-500/15 ring-1 ring-sky-500/30 flex items-center justify-center">
                                    <Grid2x2 className="h-4 w-4 text-sky-600 dark:text-sky-400" />
                                </div>
                                <span>Categories & filters</span>
                            </li>
                            <li className="flex items-center gap-3 animate-slide-in-left" style={{animationDelay: '0.3s'}}>
                                <div className="h-8 w-8 rounded-lg bg-violet-500/15 ring-1 ring-violet-500/30 flex items-center justify-center">
                                    <Shield className="h-4 w-4 text-violet-600 dark:text-violet-400" />
                                </div>
                                <span>Secure & Private</span>
                            </li>
                            <li className="flex items-center gap-3 animate-slide-in-left" style={{animationDelay: '0.4s'}}>
                                <div className="h-8 w-8 rounded-lg bg-rose-500/15 ring-1 ring-rose-500/30 flex items-center justify-center">
                                    <Download className="h-4 w-4 text-rose-600 dark:text-rose-400" />
                                </div>
                                <span>PDF export</span>
                            </li>
                        </ul>
                    </div>

                    </div>
                </div>
            </section>

            {/* FEATURES */}
            <section className="py-12 md:py-16 lg:py-20 bg-slate-50/50 dark:bg-slate-900/30">
                <div className="container-responsive">
                    <div className="text-center mb-12 animate-fade-in-up">
                        <h2 className="text-3xl sm:text-4xl font-bold text-slate-900 dark:text-white font-display mb-4">
                            Everything you need to manage your money
                        </h2>
                        <p className="text-lg text-slate-600 dark:text-slate-400 max-w-2xl mx-auto">
                            Powerful features designed to give you complete control over your finances
                        </p>
                    </div>
                    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
                        <div className="card-interactive p-6 group animate-fade-in-up" style={{animationDelay: '0.1s'}}>
                            <div className="h-12 w-12 rounded-xl bg-gradient-to-br from-emerald-500 to-emerald-600 ring-2 ring-emerald-500/30 text-white flex items-center justify-center mb-4 group-hover:scale-110 transition-transform shadow-lg shadow-emerald-500/30">
                                <LineChart className="h-6 w-6" />
                            </div>
                            <div className="font-bold text-lg text-slate-800 dark:text-slate-100 mb-2">Insights that matter</div>
                            <p className="text-sm text-slate-600 dark:text-slate-300 leading-relaxed">Visualize trends and category spend with responsive charts that update instantly.</p>
                        </div>
                        <div className="card-interactive p-6 group animate-fade-in-up" style={{animationDelay: '0.2s'}}>
                            <div className="h-12 w-12 rounded-xl bg-gradient-to-br from-sky-500 to-sky-600 ring-2 ring-sky-500/30 text-white flex items-center justify-center mb-4 group-hover:scale-110 transition-transform shadow-lg shadow-sky-500/30">
                                <Grid2x2 className="h-6 w-6" />
                            </div>
                            <div className="font-bold text-lg text-slate-800 dark:text-slate-100 mb-2">Smart organization</div>
                            <p className="text-sm text-slate-600 dark:text-slate-300 leading-relaxed">Manage categories with colors and icons to keep your ledger readable.</p>
                        </div>
                        <div className="card-interactive p-6 group animate-fade-in-up" style={{animationDelay: '0.3s'}}>
                            <div className="h-12 w-12 rounded-xl bg-gradient-to-br from-violet-500 to-violet-600 ring-2 ring-violet-500/30 text-white flex items-center justify-center mb-4 group-hover:scale-110 transition-transform shadow-lg shadow-violet-500/30">
                                <Shield className="h-6 w-6" />
                            </div>
                            <div className="font-bold text-lg text-slate-800 dark:text-slate-100 mb-2">Secure & Encrypted</div>
                            <p className="text-sm text-slate-600 dark:text-slate-300 leading-relaxed">Your data is encrypted and securely stored. Access from any device, anywhere. </p>
                        </div>
                        <div className="card-interactive p-6 group animate-fade-in-up" style={{animationDelay: '0.4s'}}>
                            <div className="h-12 w-12 rounded-xl bg-gradient-to-br from-rose-500 to-rose-600 ring-2 ring-rose-500/30 text-white flex items-center justify-center mb-4 group-hover:scale-110 transition-transform shadow-lg shadow-rose-500/30">
                                <Download className="h-6 w-6" />
                            </div>
                            <div className="font-bold text-lg text-slate-800 dark:text-slate-100 mb-2">PDF Reports</div>
                            <p className="text-sm text-slate-600 dark:text-slate-300 leading-relaxed">Generate professional PDF reports with all your transactions and financial summaries.</p>
                        </div>
                    </div>
                </div>
            </section>

            {/* FOOTER */}
            <footer className="py-8 text-center text-sm text-slate-600 dark:text-slate-500 border-t border-slate-200/50 dark:border-slate-800/50">
                    <div className="flex flex-col sm:flex-row items-center justify-center gap-2">
                        <span>© {new Date().getFullYear()} Personal Finance Tracker</span>
                        <span className="hidden sm:inline">•</span>
                        <span>Secure, private, and cloud-synced</span>
                    </div>
            </footer>
        </div>
    );
};


