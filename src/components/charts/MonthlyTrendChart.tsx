import React from 'react';
import { AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';
import { Transaction } from '../../modules/api/dataApi';

interface MonthlyTrendChartProps {
    transactions: Transaction[];
}

export const MonthlyTrendChart: React.FC<MonthlyTrendChartProps> = ({ transactions }) => {
    // Process data to get monthly net balance
    const processData = () => {
        const last6Months = new Array(6).fill(0).map((_, i) => {
            const d = new Date();
            d.setMonth(d.getMonth() - i);
            return {
                month: d.toLocaleString('default', { month: 'short' }),
                year: d.getFullYear(),
                date: d,
                income: 0,
                expense: 0
            };
        }).reverse();

        transactions.forEach(t => {
            const tDate = new Date(t.dateIso);
            const monthData = last6Months.find(m => 
                m.date.getMonth() === tDate.getMonth() && 
                m.date.getFullYear() === tDate.getFullYear()
            );

            if (monthData) {
                if (t.type === 'income') {
                    monthData.income += t.amountCents / 100;
                } else {
                    monthData.expense += t.amountCents / 100;
                }
            }
        });

        return last6Months.map(m => ({
            name: m.month,
            net: m.income - m.expense,
            income: m.income,
            expense: m.expense
        }));
    };

    const data = processData();

    return (
        <div className="h-[300px] w-full">
            <ResponsiveContainer width="100%" height="100%">
                <AreaChart
                    data={data}
                    margin={{ top: 10, right: 30, left: 10, bottom: 0 }}
                >
                    <defs>
                        <linearGradient id="colorNet" x1="0" y1="0" x2="0" y2="1">
                            <stop offset="5%" stopColor="#6366f1" stopOpacity={0.8}/>
                            <stop offset="95%" stopColor="#6366f1" stopOpacity={0}/>
                        </linearGradient>
                    </defs>
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
                        width={70}
                    />
                    <Tooltip 
                        contentStyle={{ 
                            backgroundColor: '#fff', 
                            borderRadius: '8px', 
                            border: '1px solid #e2e8f0',
                            boxShadow: '0 4px 6px -1px rgb(0 0 0 / 0.1)'
                        }}
                        formatter={(value: number) => [`$${value.toFixed(2)}`, 'Net Balance']}
                    />
                    <Area 
                        type="monotone" 
                        dataKey="net" 
                        stroke="#6366f1" 
                        fillOpacity={1} 
                        fill="url(#colorNet)" 
                        strokeWidth={2}
                    />
                </AreaChart>
            </ResponsiveContainer>
        </div>
    );
};
