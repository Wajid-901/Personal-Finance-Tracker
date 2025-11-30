// Authentication utilities using Backend API

export interface User {
    _id: string;
    email: string;
    name: string;
    avatar?: string;
    token?: string;
    createdAt?: string;
}

const BASE_URL = import.meta.env.VITE_API_URL || 'http://localhost:5000/api';
const API_URL = `${BASE_URL}/auth`;
const USER_STORAGE_KEY = 'pft_user';

// Register a new user
export async function registerUser(email: string, password: string, name: string): Promise<{ success: boolean; error?: string; user?: User }> {
    try {
        const response = await fetch(`${API_URL}/register`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({ name, email, password }),
        });

        const data = await response.json();

        if (!response.ok) {
            return { success: false, error: data.message || 'Registration failed' };
        }

        if (data.token) {
            localStorage.setItem(USER_STORAGE_KEY, JSON.stringify(data));
        }

        return { success: true, user: data };
    } catch (error) {
        return { success: false, error: 'Network error. Please check your connection.' };
    }
}

// Login user
export async function loginUser(email: string, password: string): Promise<{ success: boolean; error?: string; user?: User }> {
    try {
        const response = await fetch(`${API_URL}/login`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({ email, password }),
        });

        const data = await response.json();

        if (!response.ok) {
            return { success: false, error: data.message || 'Login failed' };
        }

        if (data.token) {
            localStorage.setItem(USER_STORAGE_KEY, JSON.stringify(data));
        }

        return { success: true, user: data };
    } catch (error) {
        return { success: false, error: 'Network error. Please check your connection.' };
    }
}

// Get current logged-in user
export function getCurrentUser(): User | null {
    try {
        const data = localStorage.getItem(USER_STORAGE_KEY);
        return data ? JSON.parse(data) : null;
    } catch {
        return null;
    }
}

// Set current user (Internal helper, usually handled by login/register)
export function setCurrentUser(user: User | null): void {
    if (user) {
        localStorage.setItem(USER_STORAGE_KEY, JSON.stringify(user));
    } else {
        localStorage.removeItem(USER_STORAGE_KEY);
    }
}

// Logout
export function logoutUser(): void {
    localStorage.removeItem(USER_STORAGE_KEY);
}

// Check if user is authenticated
export function isAuthenticated(): boolean {
    return getCurrentUser() !== null;
}

// Forgot Password
export async function forgotPassword(email: string): Promise<{ success: boolean; error?: string; data?: string }> {
    try {
        const response = await fetch(`${API_URL}/forgotpassword`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({ email }),
        });

        const data = await response.json();

        if (!response.ok) {
            return { success: false, error: data.message || 'Email could not be sent' };
        }

        return { success: true, data: data.data };
    } catch (error) {
        return { success: false, error: 'Network error' };
    }
}

// Reset Password
export async function resetPassword(token: string, password: string): Promise<{ success: boolean; error?: string; token?: string }> {
    try {
        const response = await fetch(`${API_URL}/resetpassword/${token}`, {
            method: 'PUT',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({ password }),
        });

        const data = await response.json();

        if (!response.ok) {
            return { success: false, error: data.message || 'Password reset failed' };
        }

        if (data.token) {
            localStorage.setItem(USER_STORAGE_KEY, JSON.stringify(data));
        }

        return { success: true, token: data.token };
    } catch (error) {
        return { success: false, error: 'Network error' };
    }
}
