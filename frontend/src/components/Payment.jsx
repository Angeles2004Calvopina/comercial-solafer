// frontend/src/components/Payment.jsx
import { useState } from "react";
import { FaSpinner, FaCheckCircle, FaTimesCircle, FaUniversity, FaCreditCard, FaQrcode, FaMoneyBillWave } from "react-icons/fa";

function Payment({ total, onApprove, onReject }) {
  const [method, setMethod] = useState(null);
  const [status, setStatus] = useState("idle");
  const [cardData, setCardData] = useState({ number: "", date: "", cvv: "" });

  const handleProcess = (success = true) => {
    if (method === "card") {
      const { number, date, cvv } = cardData;
      if (!number || !date || !cvv) {
        alert("Por favor, completa los datos de tu tarjeta.");
        return;
      }
    }

    setStatus("loading");
    setTimeout(() => {
      if (success) {
        setStatus("success");
        onApprove?.(); // Esto le avisa al Checkout que el pago es válido
      } else {
        setStatus("error");
        onReject?.();
      }
    }, 2000);
  };

  if (status === "success") {
    return (
      <div className="alert alert-success border-0 shadow-sm text-center py-4 rounded-4">
        <FaCheckCircle className="mb-2 text-success" size={30} />
        <h5 className="fw-bold">¡Pago Verificado!</h5>
        <p className="mb-0 small text-muted">Estamos listos para procesar tu orden.</p>
      </div>
    );
  }

  return (
    <div className="payment-section border-top pt-4 mt-4">
      <h6 className="fw-bold text-uppercase text-muted mb-4 text-center">Selecciona tu método de pago</h6>

      {status === "loading" && (
        <div className="text-center py-5">
          <FaSpinner className="fa-spin text-primary" size={40} />
          <p className="mt-3 fw-bold text-primary">Validando transacción...</p>
        </div>
      )}

      {status === "idle" && !method && (
        <div className="row g-3">
          <div className="col-12">
            <button className="btn btn-outline-light border text-dark w-100 p-3 text-start d-flex align-items-center rounded-3 shadow-sm hover-shadow" onClick={() => setMethod("pichincha")}>
              <FaUniversity className="me-3 text-primary" size={20} />
              <div>
                <div className="fw-bold">Transferencia o Deuna!</div>
                <div className="small text-muted">Bco. Pichincha / Código QR</div>
              </div>
            </button>
          </div>
          <div className="col-12">
            <button className="btn btn-outline-light border text-dark w-100 p-3 text-start d-flex align-items-center rounded-3 shadow-sm hover-shadow" onClick={() => setMethod("card")}>
              <FaCreditCard className="me-3 text-danger" size={20} />
              <div>
                <div className="fw-bold">Tarjeta Crédito/Débito</div>
                <div className="small text-muted">Visa, Mastercard, Amex</div>
              </div>
            </button>
          </div>
          <div className="col-12">
            <button className="btn btn-outline-light border text-dark w-100 p-3 text-start d-flex align-items-center rounded-3 shadow-sm hover-shadow" onClick={() => setMethod("cash")}>
              <FaMoneyBillWave className="me-3 text-success" size={20} />
              <div>
                <div className="fw-bold">Efectivo</div>
                <div className="small text-muted">Pago contra entrega</div>
              </div>
            </button>
          </div>
        </div>
      )}

      {/* DETALLE SEGÚN MÉTODO ELEGIDO */}
      {method && status === "idle" && (
        <div className="method-detail bg-light p-4 rounded-4 animate__animated animate__fadeIn">
          {method === "pichincha" && (
            <div className="text-center">
              <FaQrcode size={120} className="mb-3 text-primary" />
              <p className="small mb-3">Transfiere a la cuenta de <strong>Solafer S.A.</strong><br/>Ahorros: 2204567890</p>
            </div>
          )}
          
          {method === "card" && (
            <div className="card-inputs">
              <input type="text" className="form-control mb-2" placeholder="Número de Tarjeta" onChange={e => setCardData({...cardData, number: e.target.value})} />
              <div className="row g-2">
                <div className="col-6"><input type="text" className="form-control" placeholder="MM/YY" onChange={e => setCardData({...cardData, date: e.target.value})} /></div>
                <div className="col-6"><input type="text" className="form-control" placeholder="CVV" onChange={e => setCardData({...cardData, cvv: e.target.value})} /></div>
              </div>
            </div>
          )}

          {method === "cash" && (
            <div className="text-center">
              <p>Confirmaremos tu dirección para el cobro en efectivo al entregar.</p>
            </div>
          )}

          <button className="btn btn-primary w-100 mt-4 py-2 fw-bold" onClick={() => handleProcess(true)}>
            {method === "card" ? "Pagar ahora" : "Confirmar Selección"}
          </button>
          <button className="btn btn-link btn-sm w-100 text-muted mt-2" onClick={() => setMethod(null)}>Cambiar método</button>
        </div>
      )}
    </div>
  );
}

export default Payment;