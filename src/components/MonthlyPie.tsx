import React from 'react';
import { PieChart, Pie, Cell, Tooltip, ResponsiveContainer, Legend } from 'recharts';
import { Category, Transaction } from '../modules/state/types';
import { currentMonthKey, formatCurrencyShort } from '../modules/utils/money';

interface Props {
    transactions: Transaction[];
    categories: Category[];
    currency: string;
}

export const MonthlyPie: React.FC<Props> = ({ transactions, categories, currency }) => {
    const month = currentMonthKey();
    const totals = new Map<string, number>();
    for (const t of transactions) {
        if (t.type !== 'expense') continue;
        if (t.dateIso.slice(0, 7) !== month) continue;
        const cid = t.categoryId ?? 'uncat';
        totals.set(cid, (totals.get(cid) ?? 0) + t.amountCents);
    }
    const data = Array.from(totals.entries()).map(([categoryId, value]) => ({
        categoryId,
        name: categories.find((c) => c.id === categoryId)?.name ?? 'Uncategorized',
        value
    }));
    const colorById = categories.reduce<Record<string, string>>((acc, c) => ({ ...acc, [c.id]: c.color }), {});

    return (
        <div className="h-72">
            <ResponsiveContainer width="100%" height="100%">
                <PieChart>
                    <Pie data={data} dataKey="value" nameKey="name" outerRadius={96} innerRadius={56}>
                        {data.map((entry) => (
                            <Cell key={entry.categoryId} fill={colorById[entry.categoryId] || '#64748b'} />
                        ))}
                    </Pie>
                    <Tooltip formatter={(v: any) => formatCurrencyShort(Number(v), currency)} />
                    <Legend />
                </PieChart>
            </ResponsiveContainer>
        </div>
    );
};


