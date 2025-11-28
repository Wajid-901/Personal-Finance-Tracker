import React from 'react';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer, Cell } from 'recharts';
import { Transaction } from '../../modules/api/dataApi';

interface IncomeVsExpenseChartProps {
    transactions: Transaction[];
}

export const IncomeVsExpenseChart: React.FC<IncomeVsExpenseChartProps> = ({ transactions }) => {
    // Calculate totals
    const income = transactions
        .filter(t => t.type === 'income')
        .reduce((sum, t) => sum + (t.amountCents / 100), 0);
    
    const expense = transactions
        .filter(t => t.type === 'expense')
        .reduce((sum, t) => sum + (t.amountCents / 100), 0);

    const data = [
        { name: 'Income', amount: income },
        { name: 'Expense', amount: expense }
    ];

    return (
        <div className="h-[300px] w-full">
            <ResponsiveContainer width="100%" height="100%">
                <BarChart data={data} margin={{ top: 20, right: 30, left: 10, bottom: 5 }}>
                    <CartesianGrid strokeDasharray="3 3" stroke="#e2e8f0" vertical={false} />
                    <XAxis 
                        dataKey="name" 
                        axisLine={false} 
                        tickLine={false} 
                        tick={{ fill: '#64748b' }} 
                    />
                    <YAxis 
                        axisLine={false} 
                        tickLine={false} 
                        tick={{ fill: '#64748b' }}
                        tickFormatter={(value) => `$${value}`}
                        width={80}
                    />
                    <Tooltip 
                        cursor={{ fill: 'transparent' }}
                        contentStyle={{ 
                            backgroundColor: '#fff', 
                            borderRadius: '8px', 
                            border: '1px solid #e2e8f0',
                            boxShadow: '0 4px 6px -1px rgb(0 0 0 / 0.1)'
                        }}
                        formatter={(value: number) => [`$${value.toFixed(2)}`, 'Amount']}
                    />
                    <Bar dataKey="amount" radius={[4, 4, 0, 0]} barSize={60}>
                        {data.map((entry, index) => (
                            <Cell key={`cell-${index}`} fill={entry.name === 'Income' ? '#10b981' : '#f43f5e'} />
                        ))}
                    </Bar>
                </BarChart>
            </ResponsiveContainer>
        </div>
    );
};
