// frontend/src/components/Header.jsx

import { useContext, useEffect, useState, useRef } from "react";
import { CartContext } from "../context/CartContext";
import { Link, useNavigate } from "react-router-dom";
import {
  FaShoppingCart,
  FaUser,
  FaBars,
  FaEllipsisV,
  FaHome,
  FaThLarge,
  FaInfoCircle,
  FaSearch,
  FaChevronDown,
  FaChevronUp
} from "react-icons/fa";
import api from "../services/api";
import Cart from "./Cart";
import logo from "../assets/images/logo.png";

import "../styles/Header.css";

function Header() {
  const [menuOpen, setMenuOpen] = useState(false);
  const [categories, setCategories] = useState([]);
  const [openCategoryId, setOpenCategoryId] = useState(null);
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
  const megaMenuRef = useRef(null); 

  const totalItems = cart.reduce((sum, item) => sum + (item.quantity || 1), 0);

  // Cargar categorías
  useEffect(() => {
    api.get("products/categories/")
      .then(res => setCategories(res.data.results || []))
      .catch(() => setCategories([]));
  }, []);

  // LISTENER GLOBAL 
  useEffect(() => {
    function handleGlobalClick(e) {
      if (
        cartRef.current?.contains(e.target) ||
        cartButtonRef.current?.contains(e.target) ||
        mobileNavRef.current?.contains(e.target) ||
        mobileNavButtonRef.current?.contains(e.target) ||
        megaMenuRef.current?.contains(e.target)
      ) {
        return;
      }

      setMenuOpen(false);
      setShowCart(false);
      setMobileNavOpen(false);
    }

    document.addEventListener("mousedown", handleGlobalClick);
    return () => document.removeEventListener("mousedown", handleGlobalClick);
  }, []);

  const goToCategory = (slug) => {
    setMenuOpen(false);
    setMobileNavOpen(false);
    setOpenCategoryId(null);
    navigate(`/catalogo?category=${slug}`);
  };

  const toggleSubmenu = (id) => {
    setOpenCategoryId(prev => (prev === id ? null : id));
  };

  return (
    <>
      {(menuOpen || showCart || mobileNavOpen) && <div className="screen-overlay" />}

      <header className="main-header-solafer">
        <div className="header-container">

          {/* HAMBURGUESA IZQUIERDA */}
          <button
            ref={mobileNavButtonRef}
            className="mobile-nav-toggle"
            onClick={() => {
              setMobileNavOpen(!mobileNavOpen);
              setMenuOpen(false);
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
                  setMenuOpen(false);
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

            {/* MENÚ CATEGORÍAS */}
            <button
              className="action-btn menu-toggle"
              onClick={() => {
                setMenuOpen(!menuOpen);
                setShowCart(false);
                setMobileNavOpen(false);
              }}
            >
              <FaEllipsisV />
            </button>

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

      {/* 🔥 MEGA MENÚ PROTEGIDO */}
      {menuOpen && (
        <div className="mega-menu" ref={megaMenuRef}>
          {categories.map(category => {
            const isOpen = openCategoryId === category.id;
            const hasSubs = category.subcategories?.length > 0;

            return (
              <div className="menu-item" key={category.id}>
                <div
                  className="menu-item-title"
                  onClick={() =>
                    hasSubs
                      ? toggleSubmenu(category.id)
                      : goToCategory(category.slug)
                  }
                >
                  <span>{category.name}</span>
                  {hasSubs && (isOpen ? <FaChevronUp /> : <FaChevronDown />)}
                </div>

                {isOpen && hasSubs && (
                  <div className="submenu">
                    {category.subcategories.map(sub => (
                      <div
                        key={sub.id}
                        className="submenu-item"
                        onClick={() => goToCategory(sub.slug)}
                      >
                        {sub.name}
                      </div>
                    ))}
                  </div>
                )}
              </div>
            );
          })}
        </div>
      )}
    </>
  );
}

export default Header;