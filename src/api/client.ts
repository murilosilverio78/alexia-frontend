import axios from "axios";

// Se encontrar erro de CORS em desenvolvimento, rode o backend com:
// uvicorn app.main:app --host 0.0.0.0 --port 8000
// e adicione origins=['http://localhost:5173'] no FastAPI CORSMiddleware.
export const apiClient = axios.create({
  baseURL: import.meta.env.VITE_API_BASE_URL,
  timeout: 300_000,
  headers: {
    "Content-Type": "application/json",
    "X-API-Key": import.meta.env.VITE_API_KEY,
  },
});
