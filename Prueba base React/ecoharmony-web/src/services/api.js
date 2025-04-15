// src/services/api.js
import axios from "axios";

const API_BASE = "http://localhost:3000/api"; // ajustá si usás otro puerto

export const comprarEntradas = (datos) => {
  return axios.post(`${API_BASE}/comprar`, datos);
};
