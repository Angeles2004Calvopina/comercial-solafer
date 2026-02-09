// frontend/src/pages/Carrito.jsx
import { useNavigate } from "react-router-dom";
import { useContext } from "react";
import { CartContext } from "../context/CartContext";
import Cart from "../components/Cart";
import "../styles/Carrito.css";

function Carrito() {
  const navigate = useNavigate();
  const { total, cart } = useContext(CartContext);

  return (
    <div className="page-cart container py-5"> 
      <h3 className="fw-bold mb-4">🛒 Revisión de tu pedido</h3>
      
      {cart.length === 0 ? (
        <div className="text-center py-5 shadow-sm rounded-4 bg-white">
          <h4 className="text-muted">No tienes productos aún</h4>
          <button className="btn btn-primary mt-3 px-4" onClick={() => navigate("/catalogo")}>
            Ir al Catálogo
          </button>
        </div>
      ) : (
        <div className="row g-4">
          {/* LADO IZQUIERDO: Lista de productos */}
          <div className="col-lg-8">
            <div className="card border-0 shadow-sm p-4 rounded-4">
              <Cart variant="page" />
              <button 
                className="btn btn-link text-decoration-none mt-4 p-0 text-start" 
                onClick={() => navigate("/catalogo")}
              >
                ← Seguir agregando productos
              </button>
            </div>
          </div>

          {/* LADO DERECHO: Resumen de cobro */}
          <aside className="col-lg-4">
            <div className="card border-0 shadow-sm p-4 rounded-4 sticky-top" style={{ top: '20px' }}>
              <h5 className="fw-bold mb-4">Resumen de Compra</h5>
              <div className="d-flex justify-content-between mb-2">
                <span className="text-muted">Subtotal</span>
                <span>${(total / 1.15).toFixed(2)}</span>
              </div>
              <div className="d-flex justify-content-between mb-3">
                <span className="text-muted">IVA (15%)</span>
                <span>${(total - (total / 1.15)).toFixed(2)}</span>
              </div>
              <hr />
              <div className="d-flex justify-content-between mb-4">
                <span className="fw-bold fs-5">Total</span>
                <span className="fw-bold fs-4 text-primary">${total.toFixed(2)}</span>
              </div>
              
              <button 
                className="btn btn-primary btn-lg w-100 py-3 fw-bold shadow" 
                onClick={() => navigate("/checkout")}
              >
                Ir a los datos de envío →
              </button>
              <p className="text-center text-muted small mt-3">
                🔒 Compra segura y protegida
              </p>
            </div>
          </aside>
        </div>
      )}
    </div>
  );
}

export default Carrito;