// frontend/src/components/Header.jsx

import { useContext, useEffect, useState, useRef } from "react";
import { Link, useNavigate } from "react-router-dom";
import {
  FaShoppingCart,
  FaUser,
  FaBars,
  FaHome,
  FaThLarge,
  FaInfoCircle,
  FaSearch,
  FaTimes 
} from "react-icons/fa";
import Cart from "./Cart";
import logo from "../assets/images/logo.png";
import { CartContext } from "../context/CartContext";
import "../styles/Header.css";

function Header() {
  const [showCart, setShowCart] = useState(false);
  const [search, setSearch] = useState("");
  const [mobileNavOpen, setMobileNavOpen] = useState(false);
  const [mobileSearchOpen, setMobileSearchOpen] = useState(false);

  const { cart, cartCount, total } = useContext(CartContext); 
  const navigate = useNavigate();

  const cartRef = useRef(null);
  const cartButtonRef = useRef(null);
  const mobileNavRef = useRef(null);
  const mobileNavButtonRef = useRef(null);
  const mobileInputRef = useRef(null); 

  const totalItems = cartCount || 0;

  useEffect(() => {
    if (mobileSearchOpen && mobileInputRef.current) {
      mobileInputRef.current.focus();
    }
  }, [mobileSearchOpen]);

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

  const handleSearchSubmit = (e) => {
    e.preventDefault();
    if (search.trim()) {
      navigate(`/catalogo?search=${encodeURIComponent(search.trim())}`);
      setSearch("");
      setMobileSearchOpen(false);
    }
  };

  return (
    <>
      {(showCart || mobileNavOpen) && <div className="screen-overlay" onClick={() => { setShowCart(false); setMobileNavOpen(false); }} />}

      <header className="main-header-solafer">
        <div className="header-container">

          {/* HAMBURGUESA IZQUIERDA (Visible solo en móvil) */}
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

          {/* LOGO ELEGANTE */}
          <Link to="/" className="nav-logo">
            <img src={logo} alt="Solafer" className="logo-img" />
            <span className="logo-text">Comercial <span className="text-highlight">Solafer</span></span>
          </Link>

          {/* LINKS DESKTOP */}
          <nav className="nav-links-desktop">
            <Link to="/" className="nav-link"><FaHome /> Inicio</Link>
            <Link to="/catalogo" className="nav-link"><FaThLarge /> Catálogo</Link>
            <Link to="/nosotros" className="nav-link"><FaInfoCircle /> Nosotros</Link>
          </nav>

          {/* BUSCADOR DESKTOP */}
          <form className="search-box-modern" onSubmit={handleSearchSubmit}>
            <FaSearch className="search-icon" />
            <input
              type="text"
              placeholder="¿Qué buscas hoy?"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
            />
            {search && (
              <FaTimes className="clear-search-icon" onClick={() => setSearch("")} />
            )}
          </form>

          {/* ACCIONES DERECHA */}
          <div className="header-actions">
            <button
              className="action-btn mobile-search-btn"
              onClick={() => setMobileSearchOpen(!mobileSearchOpen)}
            >
              <FaSearch />
            </button>

            <div className="cart-wrapper">
              <button
                ref={cartButtonRef}
                className="action-btn"
                onClick={() => setShowCart(!showCart)}
              >
                <FaShoppingCart />
                {totalItems > 0 && <span className="cart-badge-new">{totalItems}</span>}
              </button>

              {showCart && (
                <div ref={cartRef} className="mini-cart-dropdown">
                  <Cart variant="mini" onClose={() => setShowCart(false)} />
                </div>
              )}
            </div>

            <Link to="/cuenta" className="action-btn account-btn">
              <FaUser />
            </Link>
          </div>
        </div>

        {/* BUSCADOR MOBILE DESPLEGABLE */}
        {mobileSearchOpen && (
          <div className="mobile-search-bar">
            <form onSubmit={handleSearchSubmit}>
              <input
                ref={mobileInputRef}
                type="text"
                placeholder="¿Qué buscas?"
                value={search}
                onChange={(e) => setSearch(e.target.value)}
              />
              <button type="button" className="action-btn" onClick={() => setMobileSearchOpen(false)}>
                <FaTimes />
              </button>
            </form>
          </div>
        )}
      </header>

      {/* MENÚ MÓVIL LATERAL */}
      <div className={`mobile-nav-menu ${mobileNavOpen ? "open" : ""}`} ref={mobileNavRef}>
        <div className="mobile-nav-header">
            <img src={logo} alt="Solafer" className="logo-img-mini" />
            <span>Navegación</span>
        </div>
        <Link to="/" onClick={() => setMobileNavOpen(false)}><FaHome /> Inicio</Link>
        <Link to="/catalogo" onClick={() => setMobileNavOpen(false)}><FaThLarge /> Catálogo</Link>
        <Link to="/nosotros" onClick={() => setMobileNavOpen(false)}><FaInfoCircle /> Nosotros</Link>
        <Link to="/cuenta" onClick={() => setMobileNavOpen(false)}><FaUser /> Mi Cuenta</Link>
      </div>
    </>
  );
}

export default Header;