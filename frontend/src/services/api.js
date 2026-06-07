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
  });

  const data = await res.json();

  if (!res.ok || !data.success) {
    throw new Error(data.error || 'Trim failed');
  }

  return data;
}
