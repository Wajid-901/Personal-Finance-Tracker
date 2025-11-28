import React from 'react';
import { PieChart, Pie, Cell, ResponsiveContainer, Tooltip, Legend } from 'recharts';
import { Transaction, Category } from '../../modules/api/dataApi';

interface CategoryPieChartProps {
    transactions: Transaction[];
    categories: Category[];
    type: 'income' | 'expense';
}

const COLORS = ['#6366f1', '#8b5cf6', '#ec4899', '#f43f5e', '#f97316', '#eab308', '#10b981', '#06b6d4', '#3b82f6'];

export const CategoryPieChart: React.FC<CategoryPieChartProps> = ({ transactions, categories, type }) => {
    // Filter transactions by type
    const filteredTransactions = transactions.filter(t => t.type === type);

    // Group by category
    const data = filteredTransactions.reduce((acc, t) => {
        const category = categories.find(c => c.id === t.categoryId);
        const categoryName = category ? category.name : 'Uncategorized';
        
        const existing = acc.find((item: { name: string; value: number }) => item.name === categoryName);
        if (existing) {
            existing.value += t.amountCents / 100;
        } else {
            acc.push({ name: categoryName, value: t.amountCents / 100 });
        }
        return acc;
    }, [] as { name: string; value: number }[]);

    // Sort by value descending
    data.sort((a: { value: number }, b: { value: number }) => b.value - a.value);

    if (data.length === 0) {
        return (
            <div className="h-[300px] w-full flex items-center justify-center text-slate-400">
                No {type} data available
            </div>
        );
    }

    return (
        <div className="h-[300px] w-full">
            <ResponsiveContainer width="100%" height="100%">
                <PieChart>
                    <Pie
                        data={data}
                        cx="50%"
                        cy="50%"
                        innerRadius={60}
                        outerRadius={80}
                        paddingAngle={5}
                        dataKey="value"
                    >
                        {data.map((entry: { name: string; value: number }, index: number) => (
                            <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                        ))}
                    </Pie>
                    <Tooltip 
                        formatter={(value: number) => [`$${value.toFixed(2)}`, 'Amount']}
                        contentStyle={{ 
                            backgroundColor: '#fff', 
                            borderRadius: '8px', 
                            border: '1px solid #e2e8f0',
                            boxShadow: '0 4px 6px -1px rgb(0 0 0 / 0.1)'
                        }}
                    />
                    <Legend 
                        layout="vertical" 
                        verticalAlign="middle" 
                        align="right"
                        wrapperStyle={{ fontSize: '12px' }}
                    />
                </PieChart>
            </ResponsiveContainer>
        </div>
    );
};
