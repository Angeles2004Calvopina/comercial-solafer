import React, { useState, useEffect } from 'react';
import api from '../services/api';

const RecuperarCuenta = () => {
    const [step, setStep] = useState(1);
    const [email, setEmail] = useState("");
    const [pin, setPin] = useState("");
    const [password, setPassword] = useState("");
    const [confirmPassword, setConfirmPassword] = useState("");
    const [timer, setTimer] = useState(0);
    const [message, setMessage] = useState("");

    useEffect(() => {
        if (timer > 0) {
            const interval = setInterval(() => setTimer(timer - 1), 1000);
            return () => clearInterval(interval);
        }
    }, [timer]);

    const handleSendPin = async () => {
        if(!email) return alert("Ingresa tu correo o teléfono");
        try {
            const response = await api.post('/auth/recover-account/', { email });
            setStep(2);
            setTimer(60);
            // Capturamos el PIN del backend para la demo
            const pinSimulado = response.data.debug_pin;
            setMessage(`Simulación: El PIN enviado es ${pinSimulado}. (En producción llegaría al correo/SMS)`);
            
        } catch (err) {
            setMessage("Error: Usuario no encontrado.");
        }
    };

    const handleResetPassword = async () => {
        if (password !== confirmPassword) {
            alert("Las contraseñas no coinciden");
            return;
        }
        try {
            await api.post('/auth/reset-password/', { 
                email, 
                pin, 
                password 
            });
            alert("¡Éxito! Contraseña cambiada correctamente.");
            window.location.reload();
        } catch (err) {
            alert(err.response?.data?.error || "Error al actualizar.");
        }
    };

    return (
        <div className="recuperar-container">
            {step === 1 ? (
                <div className="step-card">
                    <h2>Recuperar Cuenta</h2>
                    <p className="instruccion-recuperar">
                        Ingrese su correo electrónico para recibir un PIN de seguridad.
                    </p>
                    <input 
                        type="email" 
                        placeholder="correo@ejemplo.com" 
                        value={email} 
                        onChange={(e)=>setEmail(e.target.value)} 
                    />
                    <button className="btn-primary" onClick={handleSendPin}>Enviar PIN</button>
                </div>
            ) : (
                <div className="step-card">
                    <h2>Restablecer Contraseña</h2>
                    <div className="info-envio">
                        <p>PIN enviado a: <strong>{email}</strong></p>
                        <button className="btn-edit" onClick={() => setStep(1)}>Editar correo</button>
                    </div>

                    <input type="text" placeholder="PIN de 6 dígitos" value={pin} onChange={(e)=>setPin(e.target.value)} />
                    <input type="password" placeholder="Nueva Contraseña" value={password} onChange={(e)=>setPassword(e.target.value)} />
                    <input type="password" placeholder="Confirmar Contraseña" value={confirmPassword} onChange={(e)=>setConfirmPassword(e.target.value)} />
                    
                    <button className="btn-primary" onClick={handleResetPassword}>Actualizar Contraseña</button>
                    
                    <button className="btn-resend" disabled={timer > 0} onClick={handleSendPin}>
                        {timer > 0 ? `Reenviar en ${timer}s` : "Reenviar PIN"}
                    </button>
                </div>
            )}
            {message && <div className="message-alert">{message}</div>}
        </div>
    );
};

export default RecuperarCuenta;