export type TransactionType = 'income' | 'expense';

export interface Transaction {
	id: string;
	type: TransactionType;
	amountCents: number;
	categoryId?: string;
	note?: string;
	dateIso: string;
}

export interface Category {
	id: string;
	name: string;
	color: string;
	icon: string;
}

export interface Preferences {
	darkMode: boolean;
	currency: string;
}

export interface AppState {
	transactions: Transaction[];
	categories: Category[];
	preferences: Preferences;
}

export interface AppActions {
	addTransaction: (t: Omit<Transaction, 'id'>) => void;
	updateTransaction: (t: Transaction) => void;
	deleteTransaction: (id: string) => void;

	addCategory: (c: Omit<Category, 'id'>) => void;
	updateCategory: (c: Category) => void;
	deleteCategory: (id: string) => void;

	setDarkMode: (dark: boolean) => void;
	setCurrency: (code: string) => void;
	resetSampleData: () => void;
}

export type AppContextValue = AppState & AppActions;
