import { createContext, useState, useEffect } from "react";
import api from "../services/api";

export const AuthContext = createContext();

export function AuthProvider({ children }) {
  const [user, setUser] = useState(null);
  const [message, setMessage] = useState("");
  const [attempts, setAttempts] = useState(0);

  useEffect(() => {
    const savedAttempts = localStorage.getItem("failed_attempts");
    if (savedAttempts) setAttempts(Number(savedAttempts));
    
    if (localStorage.getItem("access")) {
      loadUser();
    }
  }, []);

  const loadUser = async () => {
    try {
      const res = await api.get("auth/me/");
      setUser(res.data);
    } catch (error) {
      console.error("Error al cargar usuario:", error);
      // Si el token es inválido, limpiamos la sesión
      if (error.response?.status === 401) {
        logout();
      }
    }
  };

  const login = async (email, password) => {
    setMessage("");
    try {
      // CAMBIO IMPORTANTE: Enviamos 'username' porque tu Django usa TokenObtainPairView
      const res = await api.post("auth/login/", { username: email, password });
      
      localStorage.setItem("access", res.data.access);
      localStorage.setItem("refresh", res.data.refresh);
      localStorage.removeItem("failed_attempts");
      
      setAttempts(0);
      await loadUser(); // Carga el perfil tras obtener el token
      return true;
    } catch (error) {
      console.error("Error en login:", error.response?.data);
      const newAttempts = attempts + 1;
      setAttempts(newAttempts);
      localStorage.setItem("failed_attempts", newAttempts);
      
      // Manejo de mensajes de error
      const errorDetail = error.response?.data?.detail || "Credenciales incorrectas";
      setMessage(newAttempts >= 5 
        ? "Cuenta bloqueada temporalmente por seguridad." 
        : `${errorDetail}. Intento ${newAttempts}/5`
      );
      return false;
    }
  };

  const logout = () => {
    localStorage.removeItem("access");
    localStorage.removeItem("refresh");
    setUser(null);
    setMessage("");
  };

  return (
    <AuthContext.Provider value={{ user, login, logout, message, attempts, setAttempts, setMessage }}>
      {children}
    </AuthContext.Provider>
  );
}