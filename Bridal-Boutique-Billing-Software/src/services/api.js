// import axios from "axios";

// const API_BASE_URL = "http://localhost/smart-ledger-backend/api/";

// // Axios instance
// const api = axios.create({
//   baseURL: API_BASE_URL,
//   headers: {
//     "Content-Type": "application/json",
//   },
// });

// export default api;

import axios from "axios";

export const API_BASE_URL = "http://localhost/smart-ledger-backend/api/";

// Axios instance
const api = axios.create({
  baseURL: API_BASE_URL,
  headers: {
    "Content-Type": "application/json",
  },
});

export default api;