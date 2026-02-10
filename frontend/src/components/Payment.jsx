import { useState } from "react";
import { FaSpinner, FaCheckCircle, FaUniversity, FaCreditCard, FaMoneyBillWave } from "react-icons/fa";
import QRCode from "react-qr-code"; 

function Payment({ total, onApprove }) {
  const [method, setMethod] = useState(null);
  const [status, setStatus] = useState("idle");
  const [cardData, setCardData] = useState({ number: "", date: "", cvv: "" });

  const handleProcess = async (success = true) => {
    // 1. Validaciones previas según el método
    if (method === "tarjeta") {
      const { number, date, cvv } = cardData;
      if (!number || !date || !cvv) {
        alert("Por favor, completa los datos de tu tarjeta.");
        return;
      }
    }

    // 2. Iniciamos estado de carga visual
    setStatus("loading");

    // 3. Simulamos el procesamiento del pago
    // No hacemos api.post aquí porque Checkout.jsx ya se encarga de eso
    setTimeout(() => {
      if (success) {
        setStatus("success");
        
        // Esperamos un momento para que el usuario vea el check de éxito
        // y llamamos a onApprove para que el Checkout finalice todo
        setTimeout(() => {
          onApprove?.(method);
        }, 1500); 
      } else {
        setStatus("idle");
        alert("El pago no pudo ser procesado.");
      }
    }, 2000); 
  };

  // Pantalla de Éxito Visual
  if (status === "success") {
    return (
      <div className="alert alert-success text-center py-4 rounded-4">
        <FaCheckCircle className="mb-2 text-success" size={40} />
        <h5 className="fw-bold">¡Pago Validado!</h5>
        <p className="mb-0 small text-muted">Finalizando tu orden...</p>
      </div>
    );
  }

  return (
    <div className="payment-section border-top pt-4 mt-4">
      {status === "loading" ? (
        <div className="text-center py-5">
          <FaSpinner className="fa-spin text-primary" size={40} />
          <p className="mt-3 fw-bold text-primary">Validando pago...</p>
        </div>
      ) : (
        <>
          <h6 className="fw-bold text-uppercase text-muted mb-4 text-center">Método de Pago</h6>
          
          {!method ? (
            <div className="row g-3">
              <div className="col-12">
                <button className="btn method-btn w-100 border p-3" onClick={() => setMethod("transferencia")}>
                  <FaUniversity className="me-2" /> Transferencia o Deuna!
                </button>
              </div>
              <div className="col-12">
                <button className="btn method-btn w-100 border p-3" onClick={() => setMethod("tarjeta")}>
                  <FaCreditCard className="me-2 text-danger" /> Tarjeta Crédito/Débito
                </button>
              </div>
              <div className="col-12">
                <button className="btn method-btn w-100 border p-3" onClick={() => setMethod("efectivo")}>
                  <FaMoneyBillWave className="me-2 text-success" /> Efectivo (Contra entrega)
                </button>
              </div>
            </div>
          ) : (
            <div className="method-detail bg-light p-4 rounded-4">
              {method === "transferencia" && (
                <div className="text-center">
                  <QRCode value="Tu-Enlace-Deuna-Aquí" size={150} className="mb-3" />
                  <div className="text-start small bg-white p-2 rounded border">
                    <p className="mb-1"><strong>Cuenta:</strong> 7701209777 (Ahorros)</p>
                    <p className="mb-0"><strong>Banco:</strong> Pichincha</p>
                  </div>
                </div>
              )}

              {method === "tarjeta" && (
                <div className="card-inputs">
                  <input type="text" className="form-control mb-2" placeholder="Número de Tarjeta" onChange={e => setCardData({...cardData, number: e.target.value})} />
                  <div className="row g-2">
                    <div className="col-6"><input type="text" className="form-control" placeholder="MM/YY" onChange={e => setCardData({...cardData, date: e.target.value})} /></div>
                    <div className="col-6"><input type="text" className="form-control" placeholder="CVV" onChange={e => setCardData({...cardData, cvv: e.target.value})} /></div>
                  </div>
                </div>
              )}

              {method === "efectivo" && (
                <p className="text-center fw-bold">Pagarás al recibir tu pedido.</p>
              )}

              <p className="text-center mt-3 fw-bold text-primary text-lg">Total a pagar: ${Number(total).toFixed(2)}</p>
              <button className="btn btn-primary w-100 mt-3" onClick={() => handleProcess(true)}>Confirmar Pago</button>
              <button className="btn btn-link btn-sm w-100 mt-2" onClick={() => setMethod(null)}>Cambiar método</button>
            </div>
          )}
        </>
      )}
    </div>
  );
}

export default Payment;