import React from 'react';
import { useApp } from '../modules/state/AppProvider';
import { centsToCurrency, groupByMonth, sumBy, useCurrencyFormatter } from '../modules/utils/money';
import { IncomeExpenseChart } from './IncomeExpenseChart';
import { CategoryBarChart } from './CategoryBarChart';
import { MonthlyPie } from './MonthlyPie';
import { TrendingUp, TrendingDown, Wallet, Receipt } from 'lucide-react';

export const Dashboard: React.FC = () => {
    const { transactions, categories, preferences } = useApp();
    const fmt = useCurrencyFormatter(preferences.currency);

    const income = sumBy(transactions.filter((t) => t.type === 'income'), (t) => t.amountCents);
    const expense = sumBy(transactions.filter((t) => t.type === 'expense'), (t) => t.amountCents);
    const balance = income - expense;

    const monthly = React.useMemo(() => groupByMonth(transactions), [transactions]);

    return (
        <div className="space-y-6 animate-fade-in">
            <div className="mb-6">
                <h1 className="text-3xl font-bold text-slate-900 dark:text-white font-display mb-2">Dashboard</h1>
                <p className="text-slate-600 dark:text-slate-400">Overview of your financial activity</p>
            </div>

            <section className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
                <StatCard 
                    title="Balance" 
                    value={fmt(balance)} 
                    accent="from-brand-500 to-sky-400" 
                    icon={<Wallet className="h-5 w-5" />}
                    delay="0s"
                />
                <StatCard 
                    title="Income" 
                    value={fmt(income)} 
                    accent="from-emerald-500 to-emerald-400" 
                    icon={<TrendingUp className="h-5 w-5" />}
                    delay="0.1s"
                />
                <StatCard 
                    title="Expenses" 
                    value={fmt(expense)} 
                    accent="from-rose-500 to-rose-400" 
                    icon={<TrendingDown className="h-5 w-5" />}
                    delay="0.2s"
                />
                <StatCard 
                    title="Transactions" 
                    value={String(transactions.length)} 
                    accent="from-violet-500 to-violet-400" 
                    icon={<Receipt className="h-5 w-5" />}
                    delay="0.3s"
                />
            </section>

            <section className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                <div className="card p-6 col-span-2 animate-fade-in-up" style={{animationDelay: '0.4s'}}>
                    <h2 className="text-lg font-bold text-slate-900 dark:text-white mb-4 flex items-center gap-2">
                        <div className="h-2 w-2 rounded-full bg-brand-500 animate-pulse-slow" />
                        Income vs Expense
                    </h2>
                    <IncomeExpenseChart data={monthly} currency={preferences.currency} />
                </div>
                <div className="card p-6 animate-fade-in-up" style={{animationDelay: '0.5s'}}>
                    <h2 className="text-lg font-bold text-slate-900 dark:text-white mb-4 flex items-center gap-2">
                        <div className="h-2 w-2 rounded-full bg-violet-500 animate-pulse-slow" />
                        This Month Breakdown
                    </h2>
                    <MonthlyPie transactions={transactions} categories={categories} currency={preferences.currency} />
                </div>
            </section>

            <section className="card p-6 animate-fade-in-up" style={{animationDelay: '0.6s'}}>
                <h2 className="text-lg font-bold text-slate-900 dark:text-white mb-4 flex items-center gap-2">
                    <div className="h-2 w-2 rounded-full bg-emerald-500 animate-pulse-slow" />
                    Category-wise Expenses
                </h2>
                <CategoryBarChart transactions={transactions} categories={categories} currency={preferences.currency} />
            </section>
        </div>
    );
};

const StatCard: React.FC<{ title: string; value: string; accent: string; icon: React.ReactNode; delay: string }> = ({ title, value, accent, icon, delay }) => (
    <div className="card-interactive p-6 group animate-fade-in-up" style={{animationDelay: delay}}>
        <div className="flex items-start justify-between mb-3">
            <div className="text-sm font-medium text-slate-600 dark:text-slate-400">{title}</div>
            <div className={`p-2 rounded-lg bg-gradient-to-br ${accent} text-white opacity-80 group-hover:opacity-100 transition-opacity`}>
                {icon}
            </div>
        </div>
        <div className={`text-3xl font-bold bg-gradient-to-r ${accent} bg-clip-text text-transparent`}>{value}</div>
    </div>
);


