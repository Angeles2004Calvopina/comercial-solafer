// frontend/src/pages/CategoryPage.jsx

import { useEffect, useState, useContext } from "react";
import { useParams, useNavigate, useSearchParams } from "react-router-dom";
import api from "../services/api";
import { CartContext } from "../context/CartContext";
import "../styles/CategoryPage.css"; 

function CategoryPage() {
  const { categorySlug } = useParams();
  const navigate = useNavigate();
  const { addToCart } = useContext(CartContext);

  const [products, setProducts] = useState([]);
  const [promotions, setPromotions] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showToast, setShowToast] = useState(false);

  const [searchParams, setSearchParams] = useSearchParams();
  const page = Number(searchParams.get("page")) || 1;
  const ITEMS_PER_PAGE = 12;

  useEffect(() => {
    setLoading(true);
    Promise.all([
      api.get(`products/?category_slug=${categorySlug}`),
      api.get("promotions/active/")
    ])
    .then(([resProducts, resPromos]) => {
      const prodData = resProducts.data.results ?? resProducts.data ?? [];
      setProducts(prodData);
      setPromotions(resPromos.data.results ?? resPromos.data ?? []);
    })
    .catch(err => console.error("Error:", err))
    .finally(() => setLoading(false));
  }, [categorySlug]);

  const getPromoData = (product) => {
    const promo = promotions.find(p => p.products.includes(product.id));
    if (!promo) return null;
    const basePrice = Number(product.price);
    const discounted = basePrice * (100 - promo.discount_percentage) / 100;
    return {
      price: discounted.toFixed(2),
      old: basePrice.toFixed(2),
      final: discounted,
      percentage: promo.discount_percentage
    };
  };

  const totalPages = Math.ceil(products.length / ITEMS_PER_PAGE);
  const displayedProducts = products.slice((page - 1) * ITEMS_PER_PAGE, page * ITEMS_PER_PAGE);

  const PaginationControls = () => (
    totalPages > 1 && (
      <div className="pagination-bar">
        <button
          disabled={page === 1}
          onClick={() => setSearchParams({ page: page - 1 })}
        >
          ⬅ Anterior
        </button>
        <span className="page-info">Página {page} de {totalPages}</span>
        <button
          disabled={page >= totalPages}
          onClick={() => setSearchParams({ page: page + 1 })}
        >
          Siguiente ➡
        </button>
      </div>
    )
  );

  if (loading) return <p className="loading-text">Cargando categoría...</p>;

  return (
    <div className="catalog-wrapper">
      <div className="catalog-header">
        <h2>{categorySlug.replace(/-/g, " ")}</h2>
        <button className="btn-outline" onClick={() => navigate("/")}>
          ⬅ Regresar al inicio
        </button>
      </div>

      <PaginationControls />

      <div className="catalog-grid">
        {products.length > 0 ? (
          displayedProducts.map(product => {
            const promo = getPromoData(product);
            const isOutOfStock = product.stock <= 0;

            return (
              <div key={product.id} className="product-card">
                {isOutOfStock && <div className="out-of-stock-tag">Sin stock</div>}
                {promo && !isOutOfStock && <div className="promo-tag-badge">-{promo.percentage}%</div>}
                
                <div className="product-image-box">
                  {product.image ? (
                    <img 
                      src={product.image} 
                      alt={product.name} 
                      className={isOutOfStock ? "grayscale" : ""}
                    />
                  ) : (
                    <div className="no-image">SOLAFER</div>
                  )}
                </div>

                <div className="product-info">
                  <h4>{product.name}</h4>
                  
                  <div className="product-price">
                    {promo ? (
                      <>
                        <span className="price-old">${promo.old}</span>
                        <span>${promo.price}</span>
                      </>
                    ) : (
                      <span>${product.price}</span>
                    )}
                  </div>

                  <button 
                    className="add-cart-btn" 
                    disabled={isOutOfStock} 
                    onClick={() => {
                      if (isOutOfStock) return;
                      
                      const promo = getPromoData(product);
                      const finalPrice = promo ? parseFloat(promo.final) : parseFloat(product.price);

                      addToCart({
                        id: product.id,
                        name: product.name,
                        unit_price: finalPrice, 
                        image: product.image,
                        stock: product.stock
                      });

                      setShowToast(true);
                      setTimeout(() => setShowToast(false), 2000);
                    }}
                  > 
                    {isOutOfStock ? "Agotado" : "Añadir"} 
                  </button>
                </div>
              </div>
            );
          })
        ) : (
          <div className="no-results">No hay productos en esta categoría.</div>
        )}
      </div>

      <PaginationControls />
      {showToast && <div className="toast-cart">🛒 ¡Añadido con éxito!</div>}
    </div>
  );
}

export default CategoryPage;