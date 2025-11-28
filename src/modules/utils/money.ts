import { Transaction } from '../state/types';

export function centsToCurrency(cents: number, currency: string): string {
	return new Intl.NumberFormat(undefined, { style: 'currency', currency }).format(cents / 100);
}

export function formatCurrencyShort(cents: number, currency: string): string {
	const value = cents / 100;
	if (Math.abs(value) >= 1_000_000) return new Intl.NumberFormat(undefined, { style: 'currency', currency, notation: 'compact' }).format(value);
	if (Math.abs(value) >= 10_000) return new Intl.NumberFormat(undefined, { style: 'currency', currency, maximumFractionDigits: 0 }).format(value);
	return new Intl.NumberFormat(undefined, { style: 'currency', currency }).format(value);
}

export function useCurrencyFormatter(currency: string) {
	return (cents: number) => centsToCurrency(cents, currency);
}

export function sumBy<T>(arr: T[], sel: (t: T) => number): number {
	return arr.reduce((acc, x) => acc + sel(x), 0);
}

export function monthKey(d: Date): string { return d.toISOString().slice(0, 7); }
export function currentMonthKey(): string { return monthKey(new Date()); }

export function groupByMonth(transactions: Transaction[]) {
	const map = new Map<string, { month: string; income: number; expense: number }>();
	for (const t of transactions) {
		const key = t.dateIso.slice(0, 7);
		if (!map.has(key)) map.set(key, { month: key, income: 0, expense: 0 });
		const item = map.get(key)!;
		if (t.type === 'income') item.income += t.amountCents; else item.expense += t.amountCents;
	}
	return Array.from(map.values()).sort((a, b) => a.month.localeCompare(b.month));
}
