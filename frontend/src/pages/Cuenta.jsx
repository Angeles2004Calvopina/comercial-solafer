// frontend/src/pages/Cuenta.jsx

import { useContext, useState } from "react";
import { AuthContext } from "../context/AuthContext";
import api from "../services/api";
import RecuperarCuenta from "../components/RecuperarCuenta";
import '../styles/Cuenta.css';

function Cuenta() {
  const { user, login, logout, message } = useContext(AuthContext);
  const [isRegister, setIsRegister] = useState(false);
  const [isRecovering, setIsRecovering] = useState(false);
  const [loading, setLoading] = useState(false);

  const [form, setForm] = useState({
    username: "",
    email: "",
    password: "",
    confirmPassword: "",
    phone: ""
  });

  const handleChange = (e) =>
    setForm({ ...form, [e.target.name]: e.target.value });

  const handleAuth = async (e) => {
    e.preventDefault();
    setLoading(true);

    if (isRegister) {
      if (form.password !== form.confirmPassword) {
        alert("Las contraseñas no coinciden");
        setLoading(false);
        return;
      }

      try {
        await api.post("/auth/register/", {
          username: form.username,
          email: form.email,
          password: form.password,
          phone: form.phone
        });
        alert("¡Cuenta creada! Ya puedes entrar.");
        setIsRegister(false);
      } catch (err) {
        alert("Error al registrar: " + (err.response?.data?.error || "Datos inválidos"));
      }
    } else {
      await login(form.email, form.password);
    }
    setLoading(false);
  };

  const handleDeleteAccount = async () => {
    if (window.confirm("¿Estás seguro? Esta acción borrará permanentemente tu cuenta.")) {
      try {
        await api.delete("auth/delete-account/");
        logout();
      } catch (error) {
        alert("Error al eliminar la cuenta");
      }
    }
  };

  if (user) {
    return (
      <div className="cuenta-container">
        <header className="cuenta-header">
          <h2>Mi Cuenta</h2>
          <button onClick={logout} className="btn-secondary">Cerrar Sesión</button>
        </header>

        <div className="cuenta-grid">
          <section className="info-card">
            <h3>Mis Datos</h3>
            <p><strong>Usuario:</strong> {user.username}</p>
            <p><strong>Email:</strong> {user.email}</p>
            <p><strong>Teléfono:</strong> {user.profile?.phone || "No asignado"}</p>
            <button onClick={handleDeleteAccount} className="btn-delete-account">
              Eliminar mi cuenta definitivamente
            </button>
          </section>

          <section className="orders-card">
            <h3>Historial de Pedidos</h3>
            <p className="no-data">Aún no tienes pedidos registrados.</p>
          </section>
        </div>
      </div>
    );
  }

  return (
    <div className="auth-wrapper">
      {isRecovering ? (
        <div className="auth-card">
          <RecuperarCuenta />
          <button className="btn-back-link" onClick={() => setIsRecovering(false)}>← Volver</button>
        </div>
      ) : (
        <div className="auth-card">
          <h3>{isRegister ? "Registro" : "Inicia Sesión"}</h3>
          {message && <p className="error-msg">{message}</p>}
          <form onSubmit={handleAuth}>
            {isRegister && (
              <>
                <input name="username" placeholder="Nombre de Usuario" onChange={handleChange} required />
                <input name="phone" placeholder="Celular (Ej: 098...)" onChange={handleChange} required />
              </>
            )}
            <input name="email" placeholder="Email" onChange={handleChange} required />
            <input type="password" name="password" placeholder="Contraseña" onChange={handleChange} required />
            {isRegister && (
              <input type="password" name="confirmPassword" placeholder="Confirmar Contraseña" onChange={handleChange} required />
            )}
            <button className="btn-primary" disabled={loading}>
              {loading ? "Cargando..." : (isRegister ? "Crear Cuenta" : "Entrar")}
            </button>
          </form>
          <div className="auth-actions">
            <button onClick={() => setIsRegister(!isRegister)}>
              {isRegister ? "¿Ya tienes cuenta? Login" : "Crear cuenta"}
            </button>
            {!isRegister && <button onClick={() => setIsRecovering(true)}>¿Olvidaste tu clave?</button>}
          </div>
        </div>
      )}
    </div>
  );
}

export default Cuenta;