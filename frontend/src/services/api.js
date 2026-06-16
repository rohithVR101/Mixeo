/**
 * API service layer — centralises all fetch() calls to the backend.
 * In development the Vite proxy forwards /api/* to http://localhost:3000.
 * In production the Express server handles /api/* directly.
 */

const API_BASE = '/api';

/**
 * Upload a video file to Cloudinary via the backend.
 * @param {File} file - The video File object from the input element
 * @returns {Promise<{success, publicId, secureUrl, duration}>}
 */
export async function uploadVideo(file) {
  const formData = new FormData();
  formData.append('upload', file);

  const res = await fetch(`${API_BASE}/upload`, {
    method: 'POST',
    body: formData, // Do NOT set Content-Type; browser sets multipart boundary automatically
    credentials: 'include',
  });

  const data = await res.json();

  if (!res.ok || !data.success) {
    throw new Error(data.error || 'Upload failed');
  }

  return data;
}

/**
 * Generate a Cloudinary trimmed video URL via the backend.
 * @param {string} publicId - Cloudinary public_id of the original video
 * @param {number} start - Trim start time in seconds
 * @param {number} end - Trim end time in seconds
 * @returns {Promise<{success, trimmedUrl, publicId, start, end}>}
 */
export async function stageVideo(publicId, start, end) {
  const res = await fetch(`${API_BASE}/stage`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ publicId, start, end }),
    credentials: 'include',
  });

  const data = await res.json();

  if (!res.ok || !data.success) {
    throw new Error(data.error || 'Trim failed');
  }

  return data;
}

// ── Auth API ────────────────────────────────────────────────────────────────

/**
 * Sign up a new user.
 * @param {string} email
 * @param {string} displayName
 * @param {string} password
 * @returns {Promise<{success, user}>}
 */
export async function signup(email, displayName, password) {
  const res = await fetch(`${API_BASE}/auth/signup`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    credentials: 'include',   // send/receive session cookie
    body: JSON.stringify({ email, displayName, password }),
  });

  const data = await res.json();

  if (!res.ok || !data.success) {
    throw new Error(data.error || 'Signup failed');
  }

  return data;
}

/**
 * Log in with email and password.
 * @param {string} email
 * @param {string} password
 * @returns {Promise<{success, user}>}
 */
export async function login(email, password) {
  const res = await fetch(`${API_BASE}/auth/login`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    credentials: 'include',
    body: JSON.stringify({ email, password }),
  });

  const data = await res.json();

  if (!res.ok || !data.success) {
    throw new Error(data.error || 'Login failed');
  }

  return data;
}

/**
 * Log out the current user.
 * @returns {Promise<{success}>}
 */
export async function logout() {
  const res = await fetch(`${API_BASE}/auth/logout`, {
    method: 'POST',
    credentials: 'include',
  });

  const data = await res.json();

  if (!res.ok || !data.success) {
    throw new Error(data.error || 'Logout failed');
  }

  return data;
}

/**
 * Get the currently authenticated user (session check).
 * @returns {Promise<{success, user}>}
 */
export async function getMe() {
  const res = await fetch(`${API_BASE}/auth/me`, {
    credentials: 'include',
  });

  const data = await res.json();

  if (!res.ok || !data.success) {
    throw new Error(data.error || 'Not authenticated');
  }

  return data;
}
