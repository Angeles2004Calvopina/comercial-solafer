import axios from "axios";

const api = axios.create({
  baseURL: "https://comercial-solafer.onrender.com/api/",
});

export default api;