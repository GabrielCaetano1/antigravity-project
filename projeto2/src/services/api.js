import axios from 'axios';

// URL padrão do backend fornecida pelo usuário
export const API_BASE_URL = import.meta.env.VITE_API_URL || 'http://localhost:8000';

// Criação da instância simplificada do Axios
const api = axios.create({
  baseURL: API_BASE_URL,
  headers: {
    'Content-Type': 'application/json',
  },
  timeout: 10000, // Timeout de segurança de 10 segundos
});

// Interceptor de Requisição: Anexa o Bearer Token se ele existir no LocalStorage
api.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem('anaconda_token');
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

// Controle de modo simulado reativo (caso o laboratório local esteja offline)
let simulatedMode = false;

export const apiService = {
  isSimulated() {
    return simulatedMode;
  },
  setSimulated(value) {
    simulatedMode = value;
  },
  getToken() {
    return localStorage.getItem('anaconda_token');
  },
  setToken(token) {
    if (token) {
      localStorage.setItem('anaconda_token', token);
    } else {
      localStorage.removeItem('anaconda_token');
    }
  }
};

export default api;
