import { getCurrentUser } from '../auth/authUtils';
import { Transaction, Category } from '../state/types';
export type { Transaction, Category };

const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:5000/api';

// Helper to get auth headers
function getAuthHeaders() {
    const user = getCurrentUser();
    if (!user?.token) {
        throw new Error('No authentication token found');
    }
    return {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${user.token}`
    };
}

// ===================== TRANSACTIONS =====================

export async function fetchTransactions(): Promise<Transaction[]> {
    try {
        const response = await fetch(`${API_URL}/transactions`, {
            headers: getAuthHeaders()
        });

        if (!response.ok) {
            throw new Error('Failed to fetch transactions');
        }

        const data = await response.json();

        // Map MongoDB _id to id for frontend
        return data.map((t: any) => ({
            id: t._id,
            type: t.type,
            amountCents: t.amountCents,
            categoryId: t.categoryId,
            note: t.note,
            dateIso: t.dateIso
        }));
    } catch (error) {
        console.error('Error fetching transactions:', error);
        return [];
    }
}

export async function createTransaction(transaction: Omit<Transaction, 'id'>): Promise<Transaction | null> {
    try {
        const response = await fetch(`${API_URL}/transactions`, {
            method: 'POST',
            headers: getAuthHeaders(),
            body: JSON.stringify(transaction)
        });

        if (!response.ok) {
            throw new Error('Failed to create transaction');
        }

        const data = await response.json();
        return {
            id: data._id,
            type: data.type,
            amountCents: data.amountCents,
            categoryId: data.categoryId,
            note: data.note,
            dateIso: data.dateIso
        };
    } catch (error) {
        console.error('Error creating transaction:', error);
        return null;
    }
}

export async function updateTransaction(transaction: Transaction): Promise<Transaction | null> {
    try {
        const response = await fetch(`${API_URL}/transactions/${transaction.id}`, {
            method: 'PUT',
            headers: getAuthHeaders(),
            body: JSON.stringify({
                type: transaction.type,
                amountCents: transaction.amountCents,
                categoryId: transaction.categoryId,
                note: transaction.note,
                dateIso: transaction.dateIso
            })
        });

        if (!response.ok) {
            throw new Error('Failed to update transaction');
        }

        const data = await response.json();
        return {
            id: data._id,
            type: data.type,
            amountCents: data.amountCents,
            categoryId: data.categoryId,
            note: data.note,
            dateIso: data.dateIso
        };
    } catch (error) {
        console.error('Error updating transaction:', error);
        return null;
    }
}

export async function deleteTransaction(id: string): Promise<boolean> {
    try {
        const response = await fetch(`${API_URL}/transactions/${id}`, {
            method: 'DELETE',
            headers: getAuthHeaders()
        });

        if (!response.ok) {
            throw new Error('Failed to delete transaction');
        }

        return true;
    } catch (error) {
        console.error('Error deleting transaction:', error);
        return false;
    }
}

// ===================== CATEGORIES =====================

export async function fetchCategories(): Promise<Category[]> {
    try {
        const response = await fetch(`${API_URL}/categories`, {
            headers: getAuthHeaders()
        });

        if (!response.ok) {
            throw new Error('Failed to fetch categories');
        }

        const data = await response.json();

        // Map MongoDB _id to id for frontend
        return data.map((c: any) => ({
            id: c._id,
            name: c.name,
            color: c.color,
            icon: c.icon
        }));
    } catch (error) {
        console.error('Error fetching categories:', error);
        return [];
    }
}

export async function createCategory(category: Omit<Category, 'id'>): Promise<Category | null> {
    try {
        const response = await fetch(`${API_URL}/categories`, {
            method: 'POST',
            headers: getAuthHeaders(),
            body: JSON.stringify(category)
        });

        if (!response.ok) {
            throw new Error('Failed to create category');
        }

        const data = await response.json();
        return {
            id: data._id,
            name: data.name,
            color: data.color,
            icon: data.icon
        };
    } catch (error) {
        console.error('Error creating category:', error);
        return null;
    }
}

export async function updateCategory(category: Category): Promise<Category | null> {
    try {
        const response = await fetch(`${API_URL}/categories/${category.id}`, {
            method: 'PUT',
            headers: getAuthHeaders(),
            body: JSON.stringify({
                name: category.name,
                color: category.color,
                icon: category.icon
            })
        });

        if (!response.ok) {
            throw new Error('Failed to update category');
        }

        const data = await response.json();
        return {
            id: data._id,
            name: data.name,
            color: data.color,
            icon: data.icon
        };
    } catch (error) {
        console.error('Error updating category:', error);
        return null;
    }
}

export async function deleteCategory(id: string): Promise<boolean> {
    try {
        const response = await fetch(`${API_URL}/categories/${id}`, {
            method: 'DELETE',
            headers: getAuthHeaders()
        });

        if (!response.ok) {
            throw new Error('Failed to delete category');
        }

        return true;
    } catch (error) {
        console.error('Error deleting category:', error);
        return false;
    }
}
