

import axios from "axios";

export const API_BASE_URL = "http://localhost/bridal-boutique/Bridal-Boutique-backend/api/";

// Axios instance
const api = axios.create({
  baseURL: API_BASE_URL,
  headers: {
    "Content-Type": "application/json",
  },
});

export default api;