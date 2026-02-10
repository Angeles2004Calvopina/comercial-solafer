import { createContext, useState, useEffect, useCallback } from "react";
import api from "../services/api";

export const AuthContext = createContext();

export function AuthProvider({ children }) {
  const [user, setUser] = useState(null);
  const [message, setMessage] = useState("");
  const [attempts, setAttempts] = useState(0);

  // Definimos loadUser con useCallback para que sea estable y no cambie en cada render
  const loadUser = useCallback(async () => {
    try {
      const res = await api.get("auth/me/");
      setUser(res.data);
    } catch (error) {
      console.error("Error al cargar usuario:", error);
      if (error.response?.status === 401) {
        logout();
      }
    }
  }, []); // El array vacío aquí indica que la función no cambia

  const logout = () => {
    localStorage.removeItem("access");
    localStorage.removeItem("refresh");
    setUser(null);
    setMessage("");
  };

  useEffect(() => {
    const savedAttempts = localStorage.getItem("failed_attempts");
    if (savedAttempts) setAttempts(Number(savedAttempts));
    
    if (localStorage.getItem("access")) {
      loadUser();
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [loadUser]); // Ahora incluimos loadUser y el comentario para evitar quejas

  const login = async (email, password) => {
    setMessage("");
    try {
      const res = await api.post("auth/login/", { username: email, password });
      
      localStorage.setItem("access", res.data.access);
      localStorage.setItem("refresh", res.data.refresh);
      localStorage.removeItem("failed_attempts");
      
      setAttempts(0);
      await loadUser(); 
      return true;
    } catch (error) {
      console.error("Error en login:", error.response?.data);
      const newAttempts = attempts + 1;
      setAttempts(newAttempts);
      localStorage.setItem("failed_attempts", newAttempts);
      
      const errorDetail = error.response?.data?.detail || "Credenciales incorrectas";
      setMessage(newAttempts >= 5 
        ? "Cuenta bloqueada temporalmente por seguridad." 
        : `${errorDetail}. Intento ${newAttempts}/5`
      );
      return false;
    }
  };

  return (
    <AuthContext.Provider value={{ user, login, logout, message, attempts, setAttempts, setMessage }}>
      {children}
    </AuthContext.Provider>
  );
}