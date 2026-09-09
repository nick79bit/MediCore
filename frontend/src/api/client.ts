/**
 * MediCore API Client
 * Wraps all fetch() calls to the backend REST API.
 * The base URL is empty in development (Vite proxy handles /api → backend).
 * In production, set VITE_API_URL to the deployed backend URL.
 */

const BASE_URL = import.meta.env.VITE_API_URL
  ? `${import.meta.env.VITE_API_URL}/api`
  : '/api';

async function request<T>(path: string, options?: RequestInit): Promise<T> {
  const res = await fetch(`${BASE_URL}${path}`, {
    headers: { 'Content-Type': 'application/json', ...options?.headers },
    ...options,
  });
  if (!res.ok) {
    const text = await res.text();
    throw new Error(`API ${options?.method || 'GET'} ${path} failed [${res.status}]: ${text}`);
  }
  return res.json() as Promise<T>;
}

// ── Seed ──────────────────────────────────────────────────────────────────────
// Fetches all initial data in one request for fast app bootstrap
export const fetchSeed = () => request<{
  medicines: unknown[];
  pharmacies: unknown[];
  inventory: unknown[];
  orders: unknown[];
  feedbacks: unknown[];
  auditLogs: unknown[];
  verificationApps: unknown[];
  customerProfile: unknown;
  pharmacyStaff: unknown[];
}>('/seed');

// ── Medicines ─────────────────────────────────────────────────────────────────
export const fetchMedicines = () => request<unknown[]>('/medicines');

// ── Pharmacies ────────────────────────────────────────────────────────────────
export const fetchPharmacies = () => request<unknown[]>('/pharmacies');

// ── Inventory ─────────────────────────────────────────────────────────────────
export const fetchInventory = () => request<unknown[]>('/inventory');

// ── Orders ────────────────────────────────────────────────────────────────────
export const fetchOrders = () => request<unknown[]>('/orders');
