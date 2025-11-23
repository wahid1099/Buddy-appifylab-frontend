/**
 * Get the full image URL
 * Handles both full URLs (from ImgBB) and relative paths (legacy)
 * @param {string} imagePath - Image path or URL
 * @returns {string} - Full image URL
 */
export const getImageUrl = (imagePath) => {
  if (!imagePath) return '/images/profile.png'; // Default image
  
  // If it's already a full URL (from ImgBB or other CDN), return as is
  if (imagePath.startsWith('http://') || imagePath.startsWith('https://')) {
    return imagePath;
  }
  
  // If it's a relative path, prepend the API base URL
  const apiUrl = import.meta.env.VITE_API_URL?.replace('/api', '') || 'https://buddy-appifylab-backend.vercel.app';
  return `${apiUrl}${imagePath}`;
};
