import React from 'react';
import { LineChart, Line, XAxis, YAxis, Tooltip, ResponsiveContainer, CartesianGrid, Legend } from 'recharts';
import { formatCurrencyShort } from '../modules/utils/money';

interface Props {
    data: Array<{ month: string; income: number; expense: number }>;
    currency: string;
}

export const IncomeExpenseChart: React.FC<Props> = ({ data, currency }) => {
    return (
        <div className="h-72">
            <ResponsiveContainer width="100%" height="100%">
                <LineChart data={data} margin={{ top: 5, right: 30, left: 10, bottom: 5 }}>
                    <CartesianGrid strokeDasharray="3 3" stroke="#334155" opacity={0.3} />
                    <XAxis dataKey="month" stroke="#94a3b8" />
                    <YAxis stroke="#94a3b8" tickFormatter={(v) => formatCurrencyShort(v, currency)} width={80} />
                    <Tooltip formatter={(v: any) => formatCurrencyShort(Number(v), currency)} />
                    <Legend />
                    <Line type="monotone" dataKey="income" stroke="#10b981" strokeWidth={2} dot={false} />
                    <Line type="monotone" dataKey="expense" stroke="#ef4444" strokeWidth={2} dot={false} />
                </LineChart>
            </ResponsiveContainer>
        </div>
    );
};


