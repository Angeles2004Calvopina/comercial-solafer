// frontend/src/pages/Checkout.jsx

import React, { useState, useContext } from "react";
import { CartContext } from "../context/CartContext";
import { useNavigate } from "react-router-dom";
import api from "../services/api";
import Payment from "../components/Payment";
import jsPDF from "jspdf";
import autoTable from "jspdf-autotable";
import { FaWhatsapp, FaArrowLeft, FaRegAddressCard, FaCalendarAlt, FaCheckCircle, FaPhone, FaMapMarkerAlt, FaEdit } from "react-icons/fa";
import "../styles/Checkout.css";

function Checkout() {
  const cartContext = useContext(CartContext);
  const navigate = useNavigate();

  const [loading, setLoading] = useState(false);
  const [orderCompleted, setOrderCompleted] = useState(false);
  const [paymentApproved, setPaymentApproved] = useState(false);
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
    return requiredFields.every(field => form[field].trim() !== "");
  };

  const generarFacturaPDF = (orderId) => {
    const doc = new jsPDF();
    const date = new Date().toLocaleDateString();

    doc.setFillColor(240, 240, 240);
    doc.rect(0, 0, 210, 40, 'F');
    doc.setFont("helvetica", "bold");
    doc.setFontSize(22);
    doc.setTextColor(44, 62, 80);
    doc.text("COMERCIAL SOLAFER", 15, 25);
    
    doc.setFontSize(10);
    doc.setFont("helvetica", "normal");
    doc.text("RUC: 1790000000001", 15, 32);
    doc.text("Riobamba, Ecuador", 15, 37);

    doc.setFont("helvetica", "bold");
    doc.text(`FACTURA N°: ${orderId.toString().padStart(8, '0')}`, 140, 25);
    doc.setFont("helvetica", "normal");
    doc.text(`Fecha: ${date}`, 140, 32);

    doc.setDrawColor(200, 200, 200);
    doc.line(15, 45, 195, 45);
    doc.setFont("helvetica", "bold");
    doc.text("DATOS DEL CLIENTE", 15, 52);
    doc.setFont("helvetica", "normal");
    doc.text(`Cliente: ${form.nombres} ${form.apellidos}`, 15, 60);
    doc.text(`Cédula/RUC: ${form.cedula}`, 15, 65);
    doc.text(`Dirección: ${form.address}`, 15, 70);

    autoTable(doc, {
      startY: 80,
      head: [["Descripción", "Cant.", "P. Unitario", "Subtotal"]],
      body: cart.map(item => [
        item.name,
        item.quantity,
        `$${Number(item.unit_price).toFixed(2)}`,
        `$${(item.quantity * Number(item.unit_price)).toFixed(2)}`
      ]),
      theme: 'striped',
      headStyles: { fillColor: [44, 62, 80] },
      margin: { left: 15, right: 15 }
    });

    const finalY = doc.lastAutoTable.finalY + 10;
    doc.setFontSize(11);
    doc.setTextColor(44, 62, 80);

    doc.setFont("helvetica", "bold");
    doc.text("SUBTOTAL:", 130, finalY);
    doc.text("IVA (15%):", 130, finalY + 8);
    
    doc.setFont("helvetica", "normal");
    const subtotalBase = (total / 1.15).toFixed(2);
    const ivaCalculado = (total - subtotalBase).toFixed(2);
    
    doc.text(`$${subtotalBase}`, 195, finalY, { align: 'right' });
    doc.text(`$${ivaCalculado}`, 195, finalY + 8, { align: 'right' });

    doc.setDrawColor(231, 76, 60);
    doc.setLineWidth(0.5);
    doc.line(130, finalY + 12, 195, finalY + 12);

    doc.setFontSize(13);
    doc.setFont("helvetica", "bold");
    doc.setTextColor(231, 76, 60); 
    doc.text("TOTAL A PAGAR:", 130, finalY + 18);
    doc.text(`$${Number(total).toFixed(2)}`, 195, finalY + 18, { align: 'right' });

    doc.save(`Factura_Solafer_${orderId}.pdf`);
  };

  const handlePlaceOrder = async () => {
    if (!isFormValid()) {
      alert("Por favor, completa todos los campos obligatorios antes de finalizar.");
      return;
    }

    setLoading(true);
    try {
      const orderData = {
        customer: { ...form },
        items: cart.map(item => ({
          product: item.id,
          quantity: Number(item.quantity),
          unit_price: Number(item.unit_price)
        })),
        payment_method: "online",
        total: Number(total),
        create_account: saveData 
      };

      const response = await api.post("orders/create/", orderData);
      generarFacturaPDF(response.data.id);
      setOrderCompleted(true);
      clearCart();
    } catch (error) {
      alert("Error al procesar el pedido. Revisa tu conexión.");
    } finally {
      setLoading(false);
    }
  };

  const handleWhatsAppHelp = () => {
    window.open("https://wa.me/593958788729?text=Hola! Necesito ayuda con mi compra.", "_blank");
  };

  if (orderCompleted) {
    return (
      <div className="container py-5 text-center animate__animated animate__fadeIn">
        <div className="checkout-card p-5">
          <FaCheckCircle size={80} color="#27ae60" className="mb-4" />
          <h2 className="fw-bold">¡Pedido Confirmado!</h2>
          <p className="text-muted">Tu factura se ha descargado automáticamente.</p>
          <button className="btn-main mt-4" onClick={() => navigate("/")}>Volver al Inicio</button>
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
                  <input name="email" type="email" placeholder="Email (donde recibirá su factura) *" className="form-control custom-input" onChange={handleChange} />
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
                    <input name="phone" placeholder="Teléfono de contacto *" className="form-control custom-input border-start-0" onChange={handleChange} />
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
                    <input name="reference" placeholder="Referencia (Ej: Frente al parque, casa blanca) *" className="form-control custom-input border-start-0" onChange={handleChange} />
                  </div>
                </div>
                <div className="col-md-12">
                  <div className="input-group">
                    <span className="input-group-text bg-white border-end-0"><FaEdit size={12} className="text-muted"/></span>
                    <textarea name="observations" placeholder="Observaciones o notas adicionales" className="form-control custom-input border-start-0" rows="2" onChange={handleChange}></textarea>
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
                      Guardar mis datos y crear una cuenta para mi próxima compra.
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
                  <p className="small text-center text-muted mb-3 italic">Complete sus datos arriba para habilitar el pago</p>
                  <Payment total={total} onApprove={() => setPaymentApproved(true)} onReject={() => setPaymentApproved(false)} />
                </div>
              ) : (
                <div className="animate__animated animate__pulse">
                  <div className="alert alert-success text-center py-2 mb-3">
                    <FaCheckCircle className="me-2"/> Pago Verificado
                  </div>
                  <button className="btn-confirm-final w-100 py-3 shadow-sm" onClick={handlePlaceOrder} disabled={loading}>
                    {loading ? "PROCESANDO..." : "CONFIRMAR Y FINALIZAR COMPRA"}
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