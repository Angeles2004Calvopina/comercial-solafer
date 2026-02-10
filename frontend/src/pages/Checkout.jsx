// frontend/src/pages/Checkout.jsx

import React, { useState, useContext } from "react";
import { CartContext } from "../context/CartContext";
import { useNavigate } from "react-router-dom";
import api from "../services/api";
import Payment from "../components/Payment";
import Swal from "sweetalert2"; 
import { FaWhatsapp, FaArrowLeft, FaRegAddressCard, FaCalendarAlt, FaCheckCircle, FaPhone, FaMapMarkerAlt, FaEdit } from "react-icons/fa";
import "../styles/Checkout.css";

function Checkout() {
  const cartContext = useContext(CartContext);
  const navigate = useNavigate();

  const [loading, setLoading] = useState(false);
  const [orderCompleted, setOrderCompleted] = useState(false);
  const [paymentApproved, setPaymentApproved] = useState(false);
  const [selectedMethod, setSelectedMethod] = useState(""); 
  const [saveData, setSaveData] = useState(false);

  const [form, setForm] = useState({
    cedula: "",
    nombres: "",
    apellidos: "",
    email: "",
    phone: "",
    address: "",
    reference: "",
    observations: "",
    delivery_date: ""
  });

  if (!cartContext) {
    return <div className="container mt-5">Cargando contexto...</div>;
  }

  const { cart, total, clearCart } = cartContext;

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const isFormValid = () => {
    const requiredFields = ["cedula", "nombres", "apellidos", "email", "phone", "address", "reference", "delivery_date"];
    return requiredFields.every(field => form[field] && form[field].trim() !== "");
  };

  const handlePaymentApproval = (method) => {
    if (!isFormValid()) {
      Swal.fire("Datos Faltantes", "Primero completa tus datos de envío antes de procesar el pago.", "warning");
      return;
    }
    setPaymentApproved(true);
    setSelectedMethod(method);
  };

  // Función de guardado simplificada (Sin PDF)
  const handlePlaceOrder = async () => {
    setLoading(true);
    Swal.fire({
      title: 'Procesando pedido...',
      text: 'Guardando tu orden en el sistema',
      allowOutsideClick: false,
      didOpen: () => { Swal.showLoading(); }
    });

    try {
      const orderData = {
        customer: { ...form },
        items: cart.map(item => ({
          product: item.id,
          quantity: Number(item.quantity),
          price: Number(item.unit_price || item.price) 
        })),
        payment_method: selectedMethod, 
        total: Number(total),
        create_account: saveData 
      };

      // 1. Guardamos en Django
      await api.post("orders/create/", orderData);
      
      Swal.close();
      
      // 2. Éxito visual
      await Swal.fire({
        title: '¡Compra Exitosa!',
        text: saveData ? 'Tu cuenta ha sido creada. Tu contraseña es tu número de cédula.' : 'Tu pedido ha sido registrado correctamente.',
        icon: 'success',
        confirmButtonText: 'Genial'
      });

      // 3. Limpieza de estado
      clearCart();
      setOrderCompleted(true);
    } catch (error) {
      console.error("Error al crear pedido:", error);
      Swal.fire("Error", "No pudimos registrar tu pedido en la base de datos. Intenta de nuevo.", "error");
    } finally {
      setLoading(false);
    }
  };

  const handleWhatsAppHelp = () => {
    window.open("https://wa.me/593958835287?text=Hola! Necesito ayuda con mi compra.", "_blank");
  };

  if (orderCompleted) {
    return (
      <div className="container py-5 text-center animate__animated animate__fadeIn">
        <div className="checkout-card p-5">
          <FaCheckCircle size={80} color="#27ae60" className="mb-4" />
          <h2 className="fw-bold">¡Todo listo!</h2>
          <p className="text-muted">Tu pedido ha sido recibido y estamos procesándolo.</p>
          <button className="btn-main mt-4" onClick={() => navigate("/")}>Volver a la tienda</button>
        </div>
      </div>
    );
  }

  return (
    <div className="checkout-page bg-light py-5">
      <div className="container">
        <div className="d-flex justify-content-between align-items-center mb-4">
          <button className="btn-back-shopping" onClick={() => navigate("/carrito")}>
            <FaArrowLeft className="me-2" /> Volver al Carrito
          </button>
          <button className="btn-whatsapp-minimal" onClick={handleWhatsAppHelp}>
            ¿Ayuda? <FaWhatsapp className="ms-1" />
          </button>
        </div>

        <div className="row g-4">
          <div className="col-lg-7">
            <div className="checkout-card p-4">
              <h5 className="fw-bold mb-4"><FaRegAddressCard className="me-2 text-coral" /> Datos de Entrega</h5>
              <div className="row g-3">
                <div className="col-md-6">
                  <input name="cedula" placeholder="Cédula / RUC *" className="form-control custom-input" onChange={handleChange} />
                </div>
                <div className="col-md-6">
                  <input name="email" type="email" placeholder="Email *" className="form-control custom-input" onChange={handleChange} />
                </div>
                <div className="col-md-6">
                  <input name="nombres" placeholder="Nombres *" className="form-control custom-input" onChange={handleChange} />
                </div>
                <div className="col-md-6">
                  <input name="apellidos" placeholder="Apellidos *" className="form-control custom-input" onChange={handleChange} />
                </div>
                <div className="col-md-6">
                  <div className="input-group">
                    <span className="input-group-text bg-white border-end-0"><FaPhone size={12} className="text-muted"/></span>
                    <input name="phone" placeholder="Teléfono *" className="form-control custom-input border-start-0" onChange={handleChange} />
                  </div>
                </div>
                <div className="col-md-6">
                  <label className="small fw-bold text-coral d-block mb-1"><FaCalendarAlt /> Fecha de Entrega Requerida *</label>
                  <input type="date" name="delivery_date" className="form-control custom-input" onChange={handleChange} />
                </div>
                <div className="col-md-12">
                  <input name="address" placeholder="Dirección Exacta (Calle y Número) *" className="form-control custom-input" onChange={handleChange} />
                </div>
                <div className="col-md-12">
                  <div className="input-group">
                    <span className="input-group-text bg-white border-end-0"><FaMapMarkerAlt size={12} className="text-muted"/></span>
                    <input name="reference" placeholder="Referencia *" className="form-control custom-input border-start-0" onChange={handleChange} />
                  </div>
                </div>
                <div className="col-md-12">
                  <div className="input-group">
                    <span className="input-group-text bg-white border-end-0"><FaEdit size={12} className="text-muted"/></span>
                    <textarea name="observations" placeholder="Observaciones" className="form-control custom-input border-start-0" rows="2" onChange={handleChange}></textarea>
                  </div>
                </div>

                <div className="col-12 mt-3">
                  <div className="form-check p-3 border rounded bg-white shadow-sm">
                    <input 
                      className="form-check-input ms-0 me-2" 
                      type="checkbox" 
                      id="saveDataCheck" 
                      checked={saveData}
                      onChange={(e) => setSaveData(e.target.checked)}
                    />
                    <label className="form-check-label fw-bold text-dark" htmlFor="saveDataCheck" style={{ cursor: 'pointer' }}>
                      Guardar mis datos y crear una cuenta.
                    </label>
                  </div>
                </div>
              </div>
            </div>
          </div>

          <div className="col-lg-5">
            <div className="summary-sticky-card p-4">
              <h5 className="fw-bold mb-3">Resumen de Pago</h5>
              <div className="total-display mb-4 text-center border-bottom pb-3">
                <span className="text-muted">Total a Pagar</span>
                <h2 className="fw-bold text-dark">${Number(total).toFixed(2)}</h2>
              </div>
              
              {!paymentApproved ? (
                <div className="payment-section">
                  <p className="small text-center text-muted mb-3 italic">
                    {!isFormValid() ? "⚠️ Completa tus datos de envío para pagar" : "Selecciona un método para continuar"}
                  </p>
                  <Payment 
                    total={total} 
                    onApprove={handlePaymentApproval} 
                  />
                </div>
              ) : (
                <div className="animate__animated animate__pulse">
                  <div className="alert alert-success text-center py-2 mb-3">
                    <FaCheckCircle className="me-2"/> Pago Verificado ({selectedMethod})
                  </div>
                  <button className="btn-confirm-final w-100 py-3 shadow-sm" onClick={handlePlaceOrder} disabled={loading}>
                    {loading ? "PROCESANDO..." : "CONFIRMAR Y FINALIZAR COMPRA"}
                  </button>
                  <button className="btn btn-link btn-sm w-100 text-muted mt-2" onClick={() => setPaymentApproved(false)}>
                    Cambiar método de pago / datos
                  </button>
                </div>
              )}
              <p className="text-center text-danger small mt-4 fw-bold">
                * Todos los campos de entrega son obligatorios.
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default Checkout;