// frontend/src/pages/CategoryPage.jsx

import { useEffect, useState, useContext } from "react";
import { useParams, useNavigate } from "react-router-dom";
import api from "../services/api";
import { CartContext } from "../context/CartContext";
import "../styles/CategoryPage.css"; 


function CategoryPage() {
  const { categorySlug } = useParams();
  const navigate = useNavigate();
  const { addToCart } = useContext(CartContext);

  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    setLoading(true);

    api.get(`products/?category_slug=${categorySlug}`)
      .then(res => {
        const data = Array.isArray(res.data)
          ? res.data
          : res.data.results || [];
        setProducts(data);
      })
      .catch(err => {
        console.error("Error cargando productos:", err);
        setProducts([]);
      })
      .finally(() => setLoading(false));
  }, [categorySlug]);

  if (loading) {
    return <p style={{ padding: "40px" }}>Cargando productos...</p>;
  }

  return (
    <div className="catalog-wrapper">
      {/* HEADER DE CATEGORÍA */}
      <div className="catalog-header">
        <h2 style={{ textTransform: "capitalize" }}>
          {categorySlug.replace(/-/g, " ")}
        </h2>

        {/* BOTÓN REGRESAR */}
        <button
          className="btn-outline"
          onClick={() => navigate("/")}
        >
          ⬅ Regresar al inicio
        </button>
      </div>

      {/* GRID DE PRODUCTOS */}
      {products.length === 0 ? (
        <p>No hay productos en esta categoría.</p>
      ) : (
        <div className="catalog-grid">
          {products.map(product => (
            <div key={product.id} className="product-card">
              <div className="product-image-box">
                {product.image ? (
                  <img src={product.image} alt={product.name} />
                ) : (
                  <div className="no-image">
                    <img
                      src="/logo-local.png"
                      alt="Solafer"
                      className="no-image-logo"
                    />
                  </div>
                )}
              </div>

              <div className="product-info">
                <h4>{product.name}</h4>
                <p className="product-price">${product.price}</p>

                <button
                  className="add-cart-btn"
                  onClick={() => addToCart(product)}
                >
                  Añadir
                </button>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}

export default CategoryPage;