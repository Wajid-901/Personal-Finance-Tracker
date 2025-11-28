import React from 'react';
import { useApp } from '../modules/state/AppProvider';
import { Transaction, TransactionType } from '../modules/state/types';
import { useCurrencyFormatter } from '../modules/utils/money';
import { Pencil, Trash2, Plus } from 'lucide-react';

type SortKey = 'dateDesc' | 'dateAsc' | 'amountDesc' | 'amountAsc';

export const TransactionsPage: React.FC = () => {
    const { transactions, categories, preferences, addTransaction, updateTransaction, deleteTransaction } = useApp();
    const fmt = useCurrencyFormatter(preferences.currency);

    const [query, setQuery] = React.useState('');
    const [type, setType] = React.useState<'all' | TransactionType>('all');
    const [category, setCategory] = React.useState<string>('all');
    const [sort, setSort] = React.useState<SortKey>('dateDesc');

    const filtered = transactions
        .filter((t) => {
            if (type !== 'all' && t.type !== type) return false;
            if (category !== 'all' && t.categoryId !== category) return false;
            if (query && !(t.note ?? '').toLowerCase().includes(query.toLowerCase())) return false;
            return true;
        })
        .sort((a, b) => {
            if (sort === 'dateDesc') return b.dateIso.localeCompare(a.dateIso);
            if (sort === 'dateAsc') return a.dateIso.localeCompare(b.dateIso);
            if (sort === 'amountDesc') return b.amountCents - a.amountCents;
            return a.amountCents - b.amountCents;
        });

    const [editing, setEditing] = React.useState<Transaction | null>(null);

    return (
        <div className="space-y-4">
            <div className="flex flex-col sm:flex-row gap-2 sm:items-center sm:justify-between">
                <h2 className="text-lg font-semibold">Transactions</h2>
                <button onClick={() => setEditing({ id: '', type: 'expense', amountCents: 0, dateIso: new Date().toISOString() })} className="btn-primary rounded-xl">
                    <Plus className="h-4 w-4" /> New Transaction
                </button>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-5 gap-2">
                <input placeholder="Search notes..." className="input" value={query} onChange={(e)=>setQuery(e.target.value)} />
                <select className="select" value={type} onChange={(e)=>setType(e.target.value as any)}>
                    <option value="all">All Types</option>
                    <option value="income">Income</option>
                    <option value="expense">Expense</option>
                </select>
                <select className="select" value={category} onChange={(e)=>setCategory(e.target.value)}>
                    <option value="all">All Categories</option>
                    {categories.map(c=> <option key={c.id} value={c.id}>{c.name}</option>)}
                </select>
                <select className="select" value={sort} onChange={(e)=>setSort(e.target.value as SortKey)}>
                    <option value="dateDesc">Newest first</option>
                    <option value="dateAsc">Oldest first</option>
                    <option value="amountDesc">Amount high → low</option>
                    <option value="amountAsc">Amount low → high</option>
                </select>
            </div>

            <div className="card overflow-x-auto">
                <table className="table">
                    <thead>
                        <tr>
                            <th className="text-left">Date</th>
                            <th className="text-left">Type</th>
                            <th className="text-left">Category</th>
                            <th className="text-left">Note</th>
                            <th className="text-right">Amount</th>
                            <th className="text-right">Actions</th>
                        </tr>
                    </thead>
                    <tbody>
                        {filtered.map((t) => (
                            <tr key={t.id} className="border-t border-slate-200/20">
                                <td>{new Date(t.dateIso).toLocaleDateString()}</td>
                                <td className="capitalize">{t.type}</td>
                                <td>{categories.find(c=>c.id===t.categoryId)?.name ?? '-'}</td>
                                <td>{t.note ?? ''}</td>
                                <td className={`text-right font-medium ${t.type==='expense' ? 'text-rose-500' : 'text-emerald-500'}`}>{fmt(t.amountCents)}</td>
                                <td className="text-right">
                                    <button onClick={()=>setEditing(t)} className="btn-ghost rounded-lg mr-1"><Pencil className="h-4 w-4"/>Edit</button>
                                    <button onClick={()=>deleteTransaction(t.id)} className="btn-ghost rounded-lg text-rose-500 hover:bg-rose-500/10"><Trash2 className="h-4 w-4"/>Delete</button>
                                </td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            </div>

            {editing && (
                <TransactionModal
                    initial={editing.id ? editing : undefined}
                    onClose={() => setEditing(null)}
                    onSave={(input) => {
                        if (editing.id) updateTransaction({ ...editing, ...input });
                        else addTransaction(input as any);
                        setEditing(null);
                    }}
                />
            )}
        </div>
    );
};

const TransactionModal: React.FC<{
    initial?: Transaction;
    onSave: (input: Omit<Transaction, 'id'> | Transaction) => void;
    onClose: () => void;
}> = ({ initial, onSave, onClose }) => {
    const { categories, preferences, transactions } = useApp();
    const fmt =useCurrencyFormatter(preferences.currency);
    const [type, setType] = React.useState<TransactionType>(initial?.type ?? 'expense');
    const [amount, setAmount] = React.useState<string>(initial ? (initial.amountCents/100).toString() : '');
    const [categoryId, setCategoryId] = React.useState<string>(initial?.categoryId ?? '');
    const [note, setNote] = React.useState<string>(initial?.note ?? '');
    const [dateIso, setDateIso] = React.useState<string>(initial?.dateIso ?? new Date().toISOString());
    const [showWarning, setShowWarning] = React.useState(false);

    // Calculate current balance
    const currentBalance = React.useMemo(() => {
        const income = transactions
            .filter(t => t.type === 'income')
            .reduce((sum, t) => sum + t.amountCents, 0);
        const expenses = transactions
            .filter(t => t.type === 'expense' && t.id !== initial?.id) // Exclude current transaction if editing
            .reduce((sum, t) => sum + t.amountCents, 0);
        return income - expenses;
    }, [transactions, initial?.id]);

    const handleSave = () => {
        const amountCents = Math.round(parseFloat(amount||'0')*100);
        if (!amountCents) return;

        // Check if expense exceeds balance
        if (type === 'expense' && amountCents > currentBalance) {
            setShowWarning(true);
            return;
        }

        onSave({ id: initial?.id ?? undefined as any, type, amountCents, categoryId: type==='expense'? (categoryId||undefined): undefined, note: note||undefined, dateIso });
    };

    const handleConfirmNegativeBalance = () => {
        const amountCents = Math.round(parseFloat(amount||'0')*100);
        setShowWarning(false);
        onSave({ id: initial?.id ?? undefined as any, type, amountCents, categoryId: type==='expense'? (categoryId||undefined): undefined, note: note||undefined, dateIso });
    };

    const amountCents = Math.round(parseFloat(amount||'0')*100);
    const wouldBeNegative = type === 'expense' && amountCents > currentBalance;

    return (
        <div className="fixed inset-0 bg-black/40 backdrop-blur-sm flex items-center justify-center p-4 z-50">
            <div className="w-full max-w-md card p-5 space-y-3">
                <h3 className="font-semibold">{initial ? 'Edit' : 'Add'} Transaction</h3>
                
                {/* Balance Warning */}
                {type === 'expense' && currentBalance > 0 && (
                    <div className={`p-3 rounded-lg border ${wouldBeNegative ? 'bg-rose-50 dark:bg-rose-950/30 border-rose-200 dark:border-rose-800' : 'bg-blue-50 dark:bg-blue-950/30 border-blue-200 dark:border-blue-800'}`}>
                        <div className={`text-sm ${wouldBeNegative ? 'text-rose-700 dark:text-rose-300' : 'text-blue-700 dark:text-blue-300'}`}>
                            <div className="font-medium mb-1">
                                {wouldBeNegative ? '⚠️ Warning: Insufficient Balance' : '💰 Current Balance'}
                            </div>
                            <div>Available: {fmt(currentBalance)}</div>
                            {amountCents > 0 && type === 'expense' && (
                                <>
                                    <div>This expense: {fmt(amountCents)}</div>
                                    <div className={`font-semibold ${wouldBeNegative ? 'text-rose-600 dark:text-rose-400' : ''}`}>
                                        After: {fmt(currentBalance - amountCents)}
                                    </div>
                                </>
                            )}
                        </div>
                    </div>
                )}

                <div className="grid grid-cols-1 gap-2">
                    <select value={type} onChange={(e)=>setType(e.target.value as TransactionType)} className="select">
                        <option value="expense">Expense</option>
                        <option value="income">Income</option>
                    </select>
                    <input type="number" step="0.01" placeholder={`Amount (${preferences.currency})`} value={amount} onChange={(e)=>setAmount(e.target.value)} className="input"/>
                    <select value={categoryId} onChange={(e)=>setCategoryId(e.target.value)} className="select" disabled={type==='income'}>
                        <option value="">Uncategorized</option>
                        {categories.map(c=> <option key={c.id} value={c.id}>{c.name}</option>)}
                    </select>
                    <input placeholder="Note" value={note} onChange={(e)=>setNote(e.target.value)} className="input"/>
                    <input type="date" value={dateIso.slice(0,10)} onChange={(e)=>{
                        const d = new Date(e.target.value);
                        const iso = new Date(Date.UTC(d.getFullYear(), d.getMonth(), d.getDate())).toISOString();
                        setDateIso(iso);
                    }} className="input"/>
                </div>
                <div className="flex justify-end gap-2">
                    <button onClick={onClose} className="btn-ghost rounded-lg">Cancel</button>
                    <button onClick={handleSave} className="btn-primary rounded-lg">Save</button>
                </div>
            </div>

            {/* Confirmation Dialog for Negative Balance */}
            {showWarning && (
                <div className="fixed inset-0 bg-black/60 backdrop-blur-sm flex items-center justify-center p-4 z-[60]">
                    <div className="w-full max-w-sm card p-6 space-y-4">
                        <div className="text-center">
                            <div className="text-5xl mb-4">⚠️</div>
                            <h3 className="text-lg font-bold text-slate-900 dark:text-white mb-2">
                                Insufficient Balance
                            </h3>
                            <p className="text-sm text-slate-600 dark:text-slate-400 mb-4">
                                This expense ({fmt(amountCents)}) exceeds your current balance ({fmt(currentBalance)}).
                            </p>
                            <div className="p-3 bg-rose-50 dark:bg-rose-950/30 border border-rose-200 dark:border-rose-800 rounded-lg mb-4">
                                <div className="text-sm text-rose-700 dark:text-rose-300">
                                    <div className="font-semibold">Your balance would become:</div>
                                    <div className="text-2xl font-bold text-rose-600 dark:text-rose-400 mt-1">
                                        {fmt(currentBalance - amountCents)}
                                    </div>
                                </div>
                            </div>
                            <p className="text-xs text-slate-500 dark:text-slate-500">
                                Are you sure you want to proceed?
                            </p>
                        </div>
                        <div className="flex gap-2">
                            <button 
                                onClick={() => setShowWarning(false)} 
                                className="btn-outline flex-1 rounded-lg"
                            >
                                Cancel
                            </button>
                            <button 
                                onClick={handleConfirmNegativeBalance} 
                                className="btn-primary flex-1 rounded-lg bg-rose-600 hover:bg-rose-500"
                            >
                                Proceed Anyway
                            </button>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
};


