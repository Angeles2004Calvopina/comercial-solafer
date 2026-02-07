import { useEffect, useState } from "react";
/*import { useNavigate, Link } from "react-router-dom";*/
import { useNavigate } from "react-router-dom";
import api from "../services/api";
import "../styles/Home.css";
import { FaArrowRight, FaTruck, FaShieldAlt, FaStar } from "react-icons/fa";

import logo from "../assets/images/logo.png";
import papeleria from "../assets/images/papeleria.png";
import bazar from "../assets/images/bazar.png";
import tecnologia from "../assets/images/tecnologia.png";
import celulares from "../assets/images/celulares.png";
import zapatillas from "../assets/images/zapatillas.png";
import interiores from "../assets/images/interiores.png";

import Promotions from "../components/Promotions";

function Home() {
  //const [categories, setCategories] = useState([]); // pendiente activación backend
  const [categories] = useState([]);
  const [featuredProducts, setFeaturedProducts] = useState([]);
  const navigate = useNavigate();

  const categoryImages = {
    papeleria: papeleria,
    bazar: bazar,
    tecnologia: tecnologia,
    celulares: celulares,
    zapatillas: zapatillas,
    "interiores-y-medias": interiores,
  };

  useEffect(() => {
    // Cargar Categorías
    /*api.get("products/categories/")
      .then(res => setCategories(res.data))
      .catch(err => console.error("Error cargando categorías:", err));*/

    // Cargar algunos productos para "Destacados"
    api.get("products/")
      .then(res => setFeaturedProducts(res.data.slice(0, 4))) // Tomamos los primeros 4
      .catch(err => console.error("Error cargando destacados:", err));
  }, []);

  return (
    <div className="home-wrapper">
      {/* HERO */}
      <section className="hero-modern">
        <div className="hero-container">
          <div className="hero-text-content">
            <span className="hero-subtitle">Bienvenido a Comercial Solafer</span>
            <h1>Calidad y variedad <br /><span>en cada detalle.</span></h1>
            <p>Encuentra lo mejor en tecnología, papelería y bazar con precios imbatibles y atención personalizada.</p>
            <div className="hero-actions">
              <button className="btn-main" onClick={() => navigate("/catalogo")}>
                Explorar Catálogo <FaArrowRight />
              </button>
            </div>
          </div>
          <div className="hero-image-box">
             <div className="floating-card">
                <FaStar className="star-icon" />
                <span>Calidad Garantizada</span>
             </div>
             <img 
                src={logo} 
                alt="Comercial Solafer Logo" 
                className="hero-logo-img"
                /*style={{ 
                  width: '100%', 
                  maxHeight: '400px', 
                  objectFit: 'contain',
                }} */
             />
          </div>
        </div>
      </section>

      {/* BARRA DE CONFIANZA */}
      <div className="trust-bar">
        <div className="trust-item"><FaTruck /> <span>Entrega rápida</span></div>
        <div className="trust-item"><FaShieldAlt /> <span>Compra 100% Segura</span></div>
        <div className="trust-item"><FaStar /> <span>Los mejores precios</span></div>
      </div>

      {/* CATEGORÍAS */}
      <section className="home-section">
        <div className="section-header">
          <h2>Nuestras Categorías</h2>
          <p>Explora por sector</p>
        </div>
        <div className="category-grid-modern">
          {categories.map(category => (
            <div
              key={category.id}
              className="cat-card-new"
              style={{ backgroundImage: `linear-gradient(rgba(0,0,0,0.3), rgba(0,0,0,0.6)), url(${categoryImages[category.slug]})` }}
              onClick={() => navigate(`/catalogo/${category.slug}`)}
            >
              <h3>{category.name}</h3>
              <span className="cat-link">Ver productos</span>
            </div>
          ))}
        </div>
      </section>

      {/* PRODUCTOS DESTACADOS */}
      <section className="home-section bg-light">
        <div className="section-header">
          <h2>Productos Destacados</h2>
          <p>Lo más buscado por nuestros clientes</p>
        </div>
        <div className="featured-simple-grid">
          {featuredProducts.map(prod => (
            <div key={prod.id} className="simple-prod-card no-click">
              <div className="simple-prod-img-box">
                {prod.image ? (
                  <img 
                    src={prod.image} 
                    alt={prod.name} 
                    style={{ width: '100%', height: '100%', objectFit: 'contain', padding: '15px' }} 
                  />
                ) : (
                  <div className="no-image-emoji">🏪</div>
                )}
              </div>
              
              <div className="simple-prod-info">
                <span className="prod-category-tag">
                  {prod.category?.name || "General"}
                </span>
                <h4>{prod.name}</h4>
                <span className="price-tag">${prod.price}</span>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* PROMOCIONES */}
      <section className="home-section">
        <div className="section-header">
          <h2>Ofertas Imperdibles</h2>
          <p>Aprovecha antes de que se agoten</p>
        </div>
        <div className="promo-wrapper-home">
          <Promotions />
        </div>
      </section>
    </div>
  );
}

export default Home;