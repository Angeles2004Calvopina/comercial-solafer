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

import "../styles/Header.css";

function Header() {
    const [menuOpen, setMenuOpen] = useState(false); // categorías
    const [categories, setCategories] = useState([]);
    const [openCategoryId, setOpenCategoryId] = useState(null);
    const [showCart, setShowCart] = useState(false);
    const [search, setSearch] = useState("");
    const [mobileNavOpen, setMobileNavOpen] = useState(false); // navegación general

    const { cart } = useContext(CartContext);
    const navigate = useNavigate();
    const cartRef = useRef(null);
    const cartButtonRef = useRef(null);
    const mobileNavRef = useRef(null);
    const mobileNavButtonRef = useRef(null);

  // FUTURO: cuando el carrito tenga quantity real
  // const totalItems = cart.reduce((sum, item) => sum + item.quantity, 0);
    const totalItems = cart.reduce((sum, item) => sum + (item.quantity || 1), 0);

    useEffect(() => {
        api.get("products/categories/")
        .then(res => setCategories(res.data))
        // FUTURO: cuando el backend esté completo
        // .catch(err => console.error("Error cargando categorías:", err));
        .catch(() => {
            setCategories([]);
        });
    }, []);

    useEffect(() => {
        function handleClickOutside(event) {
        if (
            cartRef.current &&
            !cartRef.current.contains(event.target) &&
            !cartButtonRef.current.contains(event.target)
        ) {
            setShowCart(false);
        }
        }
        document.addEventListener("mousedown", handleClickOutside);
        return () =>
        document.removeEventListener("mousedown", handleClickOutside);
    }, []);

    useEffect(() => {
        function handleOutsideMobileNav(event) {
            if (
                mobileNavRef.current &&
                !mobileNavRef.current.contains(event.target) &&
                mobileNavButtonRef.current &&
                !mobileNavButtonRef.current.contains(event.target)
            ) {
                setMobileNavOpen(false);
            }
            }

        if (mobileNavOpen) {
            document.addEventListener("mousedown", handleOutsideMobileNav);
        }

        return () => {
            document.removeEventListener("mousedown", handleOutsideMobileNav);
        };
    }, [mobileNavOpen]);

    const goToCategory = (slug) => {
        setMenuOpen(false);
        setOpenCategoryId(null);
        navigate(`/catalogo/${slug}`);
    };

    const toggleSubmenu = (id) => {
        setOpenCategoryId(prev => (prev === id ? null : id));
    };

    return (
        <>
        <header className="main-header-solafer">
            <div className="header-container">

            {/* BOTÓN HAMBURGUESA IZQUIERDA (solo mobile) */}
            <button
                ref={mobileNavButtonRef}
                className="mobile-nav-toggle"
                onClick={() => {setMobileNavOpen(!mobileNavOpen); setMenuOpen(false);}}
            >
                <FaBars />
            </button>

            {/* LOGO */}
            <Link to="/" className="nav-logo">
                <span className="emoji-icon">🏪</span>
                <span className="logo-text">Comercial Solafer</span>
            </Link>

            {/* LINKS DESKTOP */}
            <nav className="nav-links-desktop">
                <Link to="/" className="nav-link"><FaHome /> Inicio</Link>
                <Link to="/catalogo" className="nav-link"><FaThLarge /> Catálogo</Link>
                <Link to="/nosotros" className="nav-link"><FaInfoCircle /> Nosotros</Link>
            </nav>

            {/* BUSCADOR */}
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
                <div className="cart-wrapper" style={{ position: "relative" }}>
                <button
                    ref={cartButtonRef}
                    className="action-btn"
                    onClick={() => setShowCart(!showCart)}
                >
                    <FaShoppingCart size={20} />
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

                <Link to="/cuenta" className="action-btn">
                <FaUser size={18} />
                </Link>

                {/* HAMBURGUESA DERECHA → CATEGORÍAS */}
                <button
                className="action-btn menu-toggle"
                onClick={() => {setMenuOpen(!menuOpen); setMobileNavOpen(false);}}
                >
                <FaEllipsisV size={18} />
                </button>
            </div>
            </div>
        </header>

        {/* MENÚ MÓVIL GENERAL */}
        {mobileNavOpen && (
            <div className="mobile-nav-menu" ref={mobileNavRef}>
            <Link to="/" onClick={() => setMobileNavOpen(false)}>Inicio</Link>
            <Link to="/catalogo" onClick={() => setMobileNavOpen(false)}>Catálogo</Link>
            <Link to="/nosotros" onClick={() => setMobileNavOpen(false)}>Nosotros</Link>
            <Link to="/cuenta" onClick={() => setMobileNavOpen(false)}>Cuenta</Link>
            </div>
        )}

        {/* MEGA MENU CATEGORÍAS */}
        {menuOpen && (
            <div className="mega-menu">
            {categories.map(category => {
                const isOpen = openCategoryId === category.id;
                const hasSubs =
                category.subcategories &&
                category.subcategories.length > 0;

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
                    {hasSubs && (
                        isOpen ? <FaChevronUp /> : <FaChevronDown />
                    )}
                    </div>

                    {isOpen && hasSubs && (
                    <div className="submenu">
                        {category.subcategories.map(sub => (
                        <div
                            key={sub.id}
                            className="submenu-item"
                            onClick={(e) => {
                            e.stopPropagation();
                            goToCategory(sub.slug);
                            }}
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