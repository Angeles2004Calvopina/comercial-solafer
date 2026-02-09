// frontend/src/components/Cart.jsx
import { useContext } from "react";
import { CartContext } from "../context/CartContext";
import { useNavigate } from "react-router-dom";
import { FaPlus, FaMinus, FaTrash } from "react-icons/fa";

function Cart({ variant = "page", onClose }) {
  const { cart, addToCart, removeFromCart, total } = useContext(CartContext);
  const navigate = useNavigate();
  const isMini = variant === "mini";

  if (cart.length === 0) {
    return (
      <div className={`cart-container ${variant}-variant text-center py-4`}>
        <p className="text-muted">Tu carrito está vacío 🛒</p>
      </div>
    );
  }

  return (
    <div className={`cart-container ${variant}-variant`}>
      <div className="cart-items-list">
        {cart.map((item) => (
          <div key={item.id} className="cart-item d-flex align-items-center gap-3 py-3 border-bottom">
            <div className="cart-product-info flex-grow-1">
              <span className="product-name fw-bold d-block">{item.name}</span>
              <span className="product-price text-muted small">${item.unit_price.toFixed(2)}</span>
            </div>

            <div className="cart-controls d-flex align-items-center gap-2">
              <div className="qty-pill d-flex align-items-center bg-light rounded-pill px-2">
                <button className="btn btn-sm text-danger" onClick={() => removeFromCart(item.id)}>
                  <FaMinus size={10} />
                </button>
                <span className="qty-num px-2 fw-bold">{item.quantity}</span>
                <button className="btn btn-sm text-success" onClick={() => addToCart(item)}>
                  <FaPlus size={10} />
                </button>
              </div>
              
              <div className="item-subtotal fw-bold px-2" style={{ minWidth: '70px', textAlign: 'right' }}>
                ${(item.unit_price * item.quantity).toFixed(2)}
              </div>

              <button className="btn btn-sm text-muted hover-danger" onClick={() => removeFromCart(item.id, true)}>
                <FaTrash />
              </button>
            </div>
          </div>
        ))}
      </div>

      {/* Solo mostramos este pie si es la versión MINI (el desplegable lateral) */}
      {isMini && (
        <div className="cart-footer mt-3 p-3 bg-light rounded-3">
          <div className="total-row d-flex justify-content-between mb-3">
            <span className="fw-bold">Total:</span>
            <strong className="fs-5 text-primary">${total.toFixed(2)}</strong>
          </div>
          <div className="cart-actions d-grid gap-2">
            <button className="btn btn-primary fw-bold" onClick={() => { navigate("/checkout"); onClose?.(); }}>
              Pagar ahora
            </button>
            <button className="btn btn-outline-secondary btn-sm" onClick={() => { navigate("/carrito"); onClose?.(); }}>
              Ver detalles del carrito
            </button>
          </div>
        </div>
      )}
    </div>
  );
}

export default Cart;