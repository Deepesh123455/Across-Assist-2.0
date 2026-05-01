export * from './routes';

export const APP_NAME = import.meta.env.VITE_APP_NAME ?? 'Across Assist';

// Use environment variable if present, otherwise fallback to local dev default.
// In production, users should ALWAYS set VITE_API_BASE_URL in Vercel/Render settings.
export const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || 'http://localhost:5000/api/v1';

export const API_TIMEOUT = Number(import.meta.env.VITE_API_TIMEOUT ?? 10000);
