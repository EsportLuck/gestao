import axios from "axios";

export const axiosInstance = axios.create({
  baseURL: process.env.APP_URL, // URL base para todas as solicitações
  timeout: 10000, // Tempo limite padrão de 10 segundos para todas as solicitações
  headers: {
    "Content-Type": "application/json", // Configuração do cabeçalho padrão
  },
});
