import { AppState, Category, Transaction } from './types';

const categories: Category[] = [
	{ id: 'cat-food', name: 'Food', color: '#ef4444', icon: 'Utensils' },
	{ id: 'cat-rent', name: 'Rent', color: '#8b5cf6', icon: 'Home' },
	{ id: 'cat-ent', name: 'Entertainment', color: '#22c55e', icon: 'Gamepad2' },
	{ id: 'cat-travel', name: 'Travel', color: '#06b6d4', icon: 'Plane' },
	{ id: 'cat-other', name: 'Other', color: '#f59e0b', icon: 'Folder' }
];

const transactions: Transaction[] = [];

export const sampleState: AppState = {
	transactions,
	categories,
	preferences: {
		darkMode: true,
		currency: 'INR'
	}
};
