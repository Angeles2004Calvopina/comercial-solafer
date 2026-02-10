import { useNavigate } from "react-router-dom";
import { useContext } from "react";
import { CartContext } from "../context/CartContext";
import Cart from "../components/Cart";
import "../styles/Carrito.css";
import { ArrowLeft, CreditCard, ShieldCheck } from "lucide-react";

function Carrito() {
  const navigate = useNavigate();
  const { total, cart } = useContext(CartContext);

  const subtotal = total / 1.15;
  const iva = total - subtotal;

  return (
    <div className="cart-page-bg">
      <div className="container cart-container py-5">
        <h2 className="cart-main-title mb-4">🛒 Mi Carrito</h2>

        {cart.length === 0 ? (
          <div className="empty-cart-card shadow-sm text-center py-5">
            <h3 className="fw-bold">Tu carrito está vacío</h3>
            <button
              className="btn btn-primary mt-3"
              onClick={() => navigate("/catalogo")}
            >
              Explorar Productos
            </button>
          </div>
        ) : (
          <div className="cart-layout">

            {/* IZQUIERDA */}
            <div className="cart-left">
              <div className="cart-items-wrapper shadow-sm">
                <Cart variant="page" />

                <div className="cart-footer">
                  <button
                    className="btn-back-catalogo"
                    onClick={() => navigate("/")}
                  >
                    <ArrowLeft size={18} />
                    Regresar al Inicio
                  </button>
                </div>
              </div>
            </div>

            {/* DERECHA */}
            <aside className="cart-right">
              <div className="summary-card shadow-sm">
                <h5 className="summary-title">Resumen de Compra</h5>

                <div className="summary-list">
                  <div className="summary-item">
                    <span>Subtotal</span>
                    <span>${subtotal.toFixed(2)}</span>
                  </div>

                  <div className="summary-item">
                    <span>IVA (15%)</span>
                    <span>${iva.toFixed(2)}</span>
                  </div>

                  <div className="summary-item delivery-tag">
                    <span>Envío</span>
                    <span className="text-success fw-bold">Gratis</span>
                  </div>
                </div>

                <div className="total-divider"></div>

                <div className="total-section">
                  <span className="total-label">Total a pagar</span>
                  <span className="total-amount">
                    ${total.toFixed(2)}
                  </span>
                </div>

                <button
                  className="btn-checkout-final w-100 mt-4"
                  onClick={() => navigate("/checkout")}
                >
                  <CreditCard size={20} />
                  Proceder al Pago
                </button>

                <div className="security-info">
                  <ShieldCheck size={14} className="text-success" />
                  <span>Pago 100% seguro y encriptado</span>
                </div>
              </div>
            </aside>

          </div>
        )}
      </div>
    </div>
  );
}

export default Carrito;