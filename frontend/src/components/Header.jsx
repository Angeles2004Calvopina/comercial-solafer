// frontend/src/components/Header.jsx

import { useContext, useEffect, useState, useRef } from "react";
import { CartContext } from "../context/CartContext";
import { Link, useNavigate } from "react-router-dom";
import {
  FaShoppingCart,
  FaUser,
  FaBars,
  FaHome,
  FaThLarge,
  FaInfoCircle,
  FaSearch
} from "react-icons/fa";
import Cart from "./Cart";
import logo from "../assets/images/logo.png";

import "../styles/Header.css";

function Header() {
  const [showCart, setShowCart] = useState(false);
  const [search, setSearch] = useState("");
  const [mobileNavOpen, setMobileNavOpen] = useState(false);
  const [mobileSearchOpen, setMobileSearchOpen] = useState(false);

  const { cart } = useContext(CartContext);
  const navigate = useNavigate();

  const cartRef = useRef(null);
  const cartButtonRef = useRef(null);
  const mobileNavRef = useRef(null);
  const mobileNavButtonRef = useRef(null);

  const totalItems = cart.reduce((sum, item) => sum + (item.quantity || 1), 0);

  // LISTENER GLOBAL 
  useEffect(() => {
    function handleGlobalClick(e) {
      if (
        cartRef.current?.contains(e.target) ||
        cartButtonRef.current?.contains(e.target) ||
        mobileNavRef.current?.contains(e.target) ||
        mobileNavButtonRef.current?.contains(e.target)
      ) {
        return;
      }

      setShowCart(false);
      setMobileNavOpen(false);
    }

    document.addEventListener("mousedown", handleGlobalClick);
    return () => document.removeEventListener("mousedown", handleGlobalClick);
  }, []);

  return (
    <>
      {(showCart || mobileNavOpen) && <div className="screen-overlay" />}

      <header className="main-header-solafer">
        <div className="header-container">

          {/* HAMBURGUESA IZQUIERDA */}
          <button
            ref={mobileNavButtonRef}
            className="mobile-nav-toggle"
            onClick={() => {
              setMobileNavOpen(!mobileNavOpen);
              setShowCart(false);
            }}
          >
            <FaBars />
          </button>

          {/* LOGO */}
          <Link to="/" className="nav-logo">
            <img src={logo} alt="Comercial Solafer" className="logo-img" />
            <span className="logo-text">Comercial Solafer</span>
          </Link>

          {/* LINKS DESKTOP */}
          <nav className="nav-links-desktop">
            <Link to="/" className="nav-link"><FaHome /> Inicio</Link>
            <Link to="/catalogo" className="nav-link"><FaThLarge /> Catálogo</Link>
            <Link to="/nosotros" className="nav-link"><FaInfoCircle /> Nosotros</Link>
          </nav>

          {/* BUSCADOR DESKTOP */}
          <form
            className="search-box-modern"
            onSubmit={(e) => {
              e.preventDefault();
              if (search.trim()) {
                navigate(`/catalogo?search=${search}`);
                setSearch("");
              }
            }}
          >
            <FaSearch className="search-icon" />
            <input
              type="text"
              placeholder="¿Qué buscas?"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
            />
          </form>

          {/* ACCIONES DERECHA */}
          <div className="header-actions">

            {/* LUPA SOLO MOBILE */}
            <button
              className="action-btn mobile-search-btn"
              onClick={() => setMobileSearchOpen(!mobileSearchOpen)}
            >
              <FaSearch />
            </button>

            {/* CARRITO */}
            <div className="cart-wrapper">
              <button
                ref={cartButtonRef}
                className="action-btn"
                onClick={() => {
                  setShowCart(!showCart);
                }}
              >
                <FaShoppingCart />
                {totalItems > 0 && (
                  <span className="cart-badge-new">{totalItems}</span>
                )}
              </button>

              {showCart && (
                <div ref={cartRef} className="mini-cart-dropdown">
                  <Cart variant="mini" onClose={() => setShowCart(false)} />
                </div>
              )}
            </div>

            {/* CUENTA */}
            <Link to="/cuenta" className="action-btn account-btn">
              <FaUser />
            </Link>

          </div>
        </div>
      </header>

      {/* BUSCADOR MOBILE */}
      {mobileSearchOpen && (
        <div className="mobile-search-bar">
          <form
            onSubmit={(e) => {
              e.preventDefault();
              if (search.trim()) {
                navigate(`/catalogo?search=${search}`);
                setMobileSearchOpen(false);
                setSearch("");
              }
            }}
          >
            <input
              type="text"
              placeholder="¿Qué buscas?"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
            />
          </form>
        </div>
      )}

      {/* NAV IZQUIERDA */}
      {mobileNavOpen && (
        <div className="mobile-nav-menu" ref={mobileNavRef}>
          <Link to="/" onClick={() => setMobileNavOpen(false)}><FaHome /> Inicio</Link>
          <Link to="/catalogo" onClick={() => setMobileNavOpen(false)}><FaThLarge /> Catálogo</Link>
          <Link to="/nosotros" onClick={() => setMobileNavOpen(false)}><FaInfoCircle /> Nosotros</Link>
          <Link to="/cuenta" onClick={() => setMobileNavOpen(false)}><FaUser /> Cuenta</Link>
        </div>
      )}
    </>
  );
}

export default Header;