import React from 'react';
import { BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer, CartesianGrid } from 'recharts';
import { Category, Transaction } from '../modules/state/types';
import { formatCurrencyShort } from '../modules/utils/money';

interface Props {
    transactions: Transaction[];
    categories: Category[];
    currency: string;
}

export const CategoryBarChart: React.FC<Props> = ({ transactions, categories, currency }) => {
    const totals = new Map<string, number>();
    for (const t of transactions) {
        if (t.type !== 'expense') continue;
        const key = t.categoryId ?? 'uncat';
        totals.set(key, (totals.get(key) ?? 0) + t.amountCents);
    }
    const data = Array.from(totals.entries()).map(([id, value]) => ({
        category: categories.find((c) => c.id === id)?.name ?? 'Uncategorized',
        value
    }));

    return (
        <div className="h-80">
            <ResponsiveContainer width="100%" height="100%">
                <BarChart data={data} margin={{ top: 5, right: 30, left: 10, bottom: 5 }}>
                    <CartesianGrid strokeDasharray="3 3" stroke="#334155" opacity={0.3} />
                    <XAxis dataKey="category" stroke="#94a3b8" />
                    <YAxis stroke="#94a3b8" tickFormatter={(v) => formatCurrencyShort(v, currency)} width={80} />
                    <Tooltip formatter={(v: any) => formatCurrencyShort(Number(v), currency)} />
                    <Bar dataKey="value" fill="#60a5fa" />
                </BarChart>
            </ResponsiveContainer>
        </div>
    );
};
