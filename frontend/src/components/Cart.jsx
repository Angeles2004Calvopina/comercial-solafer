// frontend/src/components/Cart.jsx

import { useContext } from "react";
import { CartContext } from "../context/CartContext";
import { useNavigate } from "react-router-dom";
import { FaPlus, FaMinus, FaTrash, FaShoppingBag } from "react-icons/fa";

function Cart({ variant = "page", onClose }) {
  const { cart, addToCart, removeFromCart, total } = useContext(CartContext);
  const navigate = useNavigate();
  const isMini = variant === "mini";


  const formatName = (text) => {
    if (!text) return "";
    return text.charAt(0).toUpperCase() + text.slice(1).toLowerCase();
  };

  if (cart.length === 0) {
    return (
      <div className="text-center p-5">
        <FaShoppingBag size={isMini ? 30 : 50} className="text-muted mb-3" style={{ opacity: 0.2 }} />
        <p className="text-muted small fw-bold">Tu carrito está vacío</p>
      </div>
    );
  }

  return (
    <div className={`cart-content ${isMini ? "mini-style" : "container py-4"}`}>
      
      {isMini && (
        <div className="mini-cart-header">
          <div className="title-group">
            <FaShoppingBag className="title-icon" />
            <span className="cart-title-text">MINI CARRITO</span>
          </div>
          <span className="badge-items">{cart.reduce((s, i) => s + i.quantity, 0)} Items</span>
        </div>
      )}

      <div className="cart-items-scroll" style={{ maxHeight: isMini ? '320px' : 'none', overflowY: 'auto' }}>
        {cart.map((item) => (
          <div key={item.id} className="cart-item-row">
            <div className="item-img-wrapper">
                {item.image ? (
                  <img 
                    src={item.image} 
                    alt={item.name}
                    className="cart-img-fixed shadow-sm"
                  />
                ) : (
                  <div className="solafer-placeholder">
                    <span>SOLAFER</span>
                  </div>
                )}
            </div>
            
            <div className="item-details">
              <span className="item-name">{formatName(item.name)}</span>
              <div className="item-price-info">
                <span className="unit-info">{item.quantity} x ${parseFloat(item.unit_price).toFixed(2)}</span>
                <span className="subtotal-item">${(item.quantity * parseFloat(item.unit_price || 0)).toFixed(2)}</span>
              </div>
              
              <div className="item-actions">
                <div className="qty-controls">
                  <button onClick={() => removeFromCart(item.id)}><FaMinus /></button>
                  <span>{item.quantity}</span>
                  <button onClick={() => addToCart(item)}><FaPlus /></button>
                </div>
                <button className="delete-btn" onClick={() => removeFromCart(item.id, true)}>
                  <FaTrash />
                </button>
              </div>
            </div>
          </div>
        ))}
      </div>

      <div className={`cart-footer ${isMini ? "mini-footer" : "card p-4 shadow-sm mt-4"}`}>
        <div className="d-flex justify-content-between align-items-center mb-3">
          <span className="total-label">TOTAL</span>
          <span className="total-amount">${parseFloat(total).toFixed(2)}</span>
        </div>

        <div className="cart-actions-container">
          {isMini ? (
            <button 
              className="btn-checkout-now" 
              onClick={() => { navigate("/checkout"); onClose?.(); }}
            >
              Finalizar Compra
            </button>
          ) : (
            <button 
              className="btn-checkout-now" 
              onClick={() => navigate("/catalogo")}
            >
              Seguir comprando
            </button>
          )}

          {isMini && (
            <button 
              className="btn-view-cart-modern" 
              onClick={() => { navigate("/carrito"); onClose?.(); }}
            >
              Ver carrito completo
            </button>
          )}
        </div>
      </div>
    </div>
  );
}

export default Cart;