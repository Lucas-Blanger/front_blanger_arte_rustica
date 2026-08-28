import axios from "axios";

const baseURL = import.meta.env.VITE_API_URL;

const client = axios.create({ baseURL });

// Anexa o token JWT (se existir) em toda requisição
client.interceptors.request.use((config) => {
  const token = localStorage.getItem("blanger_token");
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

// Extrai uma mensagem de erro amigável de qualquer resposta da API
client.interceptors.response.use(
  (response) => response,
  (error) => {
    const message =
      error.response?.data?.message ||
      error.message ||
      "Não foi possível completar a solicitação";
    return Promise.reject({ ...error, message });
  },
);

export default client;
