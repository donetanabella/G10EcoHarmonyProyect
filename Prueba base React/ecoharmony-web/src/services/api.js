// src/services/api.js
import axios from "axios";

const API_BASE = "http://localhost:3000/api";

export const comprarEntradas = (datos) => {
  console.log("Datos enviados al servidor:", datos);
  try {
    return axios.post(`${API_BASE}/comprar`, datos);
  } catch (error) {
    console.error("Error detallado:", error.response?.data);
    throw error;
  }
};
