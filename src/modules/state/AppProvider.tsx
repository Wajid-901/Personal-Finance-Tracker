import React from 'react';
import { AppActions, AppContextValue, AppState, Category, Transaction } from './types';
import { sampleState } from './sampleData';
import { isAuthenticated } from '../auth/authUtils';
import * as dataApi from '../api/dataApi';

const AppContext = React.createContext<AppContextValue | undefined>(undefined);

export const AppProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
	const [state, setState] = React.useState<AppState>(sampleState);
	const [hydrated, setHydrated] = React.useState(false);

	// Load data from backend when component mounts
	React.useEffect(() => {
		(async () => {
			if (isAuthenticated()) {
				try {
					const [transactions, categories] = await Promise.all([
						dataApi.fetchTransactions(),
						dataApi.fetchCategories()
					]);
					
					// Load preferences from localStorage
					const darkMode = localStorage.getItem('pft-theme') === 'dark';
					const currency = localStorage.getItem('pft-currency') || 'USD';
					
					setState({
						transactions,
						categories: categories.length > 0 ? categories : sampleState.categories,
						preferences: { darkMode, currency }
					});
				} catch (error) {
					console.error('Error loading data from server:', error);
					// Fallback to sample state
					setState(sampleState);
				}
			}
			setHydrated(true);
		})();
	}, []);

	// Sync theme and currency to localStorage
	React.useEffect(() => {
		if (!hydrated) return;
		document.documentElement.classList.toggle('dark', state.preferences.darkMode);
		try {
			localStorage.setItem('pft-theme', state.preferences.darkMode ? 'dark' : 'light');
			localStorage.setItem('pft-currency', state.preferences.currency);
		} catch {}
	}, [state.preferences, hydrated]);

	const actions = React.useMemo<AppActions>(() => ({
		addTransaction: async (t) => {
			const newTransaction = await dataApi.createTransaction(t);
			if (newTransaction) {
				setState((s) => ({ ...s, transactions: [newTransaction, ...s.transactions] }));
			}
		},
		updateTransaction: async (t) => {
			const updated = await dataApi.updateTransaction(t);
			if (updated) {
				setState((s) => ({ ...s, transactions: s.transactions.map((x) => (x.id === t.id ? updated : x)) }));
			}
		},
		deleteTransaction: async (id) => {
			const success = await dataApi.deleteTransaction(id);
			if (success) {
				setState((s) => ({ ...s, transactions: s.transactions.filter((x) => x.id !== id) }));
			}
		},

		addCategory: async (c) => {
			const newCategory = await dataApi.createCategory(c);
			if (newCategory) {
				setState((s) => ({ ...s, categories: [...s.categories, newCategory] }));
			}
		},
		updateCategory: async (c) => {
			const updated = await dataApi.updateCategory(c);
			if (updated) {
				setState((s) => ({ ...s, categories: s.categories.map((x) => (x.id === c.id ? updated : x)) }));
			}
		},
		deleteCategory: async (id) => {
			const success = await dataApi.deleteCategory(id);
			if (success) {
				setState((s) => ({ ...s, categories: s.categories.filter((x) => x.id !== id) }));
			}
		},

		setDarkMode: (dark) => setState((s) => ({ ...s, preferences: { ...s.preferences, darkMode: dark } })),
		setCurrency: (code) => setState((s) => ({ ...s, preferences: { ...s.preferences, currency: code } })),
		resetSampleData: async () => {
			// Delete all transactions and categories, then add sample data
			try {
				await Promise.all([
					...state.transactions.map(t => dataApi.deleteTransaction(t.id)),
					...state.categories.map(c => dataApi.deleteCategory(c.id))
				]);
				
				const newCategories = await Promise.all(
					sampleState.categories.map(c => dataApi.createCategory(c))
				);
				const newTransactions = await Promise.all(
					sampleState.transactions.map(t => dataApi.createTransaction(t))
				);
				
				setState({
					transactions: newTransactions.filter(Boolean) as Transaction[],
					categories: newCategories.filter(Boolean) as Category[],
					preferences: { ...state.preferences }
				});
			} catch (error) {
				console.error('Error resetting sample data:', error);
			}
		}
	}), [state.transactions, state.categories, state.preferences]);

	const value: AppContextValue = { ...state, ...actions };
	return <AppContext.Provider value={value}>{children}</AppContext.Provider>;
};

export function useApp() {
	const ctx = React.useContext(AppContext);
	if (!ctx) throw new Error('useApp must be used within AppProvider');
	return ctx;
}
