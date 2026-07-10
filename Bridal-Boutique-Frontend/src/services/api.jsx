// api.js
import axios from "axios";

// ✅ Base URL – remove trailing slash for clean concatenation
export const API_BASE_URL = "http://localhost/bridal-boutique/Bridal-Boutique-backend/api";

// ✅ Fallback image (can be used for both image & video errors)
export const FALLBACK_IMAGE = "https://images.unsplash.com/photo-1617038260897-41a1f14a8ca0";

// Axios instance – uses the same base URL
const api = axios.create({
  baseURL: API_BASE_URL,
  headers: {
    "Content-Type": "application/json",
  },
});

// ✅ Media resolver – works for both images and videos
export const resolveMediaUrl = (src) => {
  if (!src) return "";
  return src.startsWith("http") ? src : `${API_BASE_URL}/${src}`;
};

// ✅ Keep old name as alias – to avoid breaking existing imports
export const resolveImageUrl = resolveMediaUrl;

export default api;




// import axios from "axios";

// export const API_BASE_URL = "http://localhost/bridal-boutique/Bridal-Boutique-backend/api/";

// // Axios instance
// const api = axios.create({
//   baseURL: API_BASE_URL,
//   headers: {
//     "Content-Type": "application/json",
//   },
// });

// export default api;