//frontend/src/pages/Catalog.jsx

import { useEffect, useState, useContext } from "react";
import { useParams, useSearchParams } from "react-router-dom";
import api from "../services/api";
import { CartContext } from "../context/CartContext";
import "../styles/Catalog.css";

function Catalog() {
  const { slug } = useParams(); 
  const { addToCart } = useContext(CartContext);

  const [products, setProducts] = useState([]);
  const [categories, setCategories] = useState([]);
  const [promotions, setPromotions] = useState([]);
  const [currentCategory, setCurrentCategory] = useState(null);
  const [activeSubcategory, setActiveSubcategory] = useState(null);
  const [showToast, setShowToast] = useState(false);

  const [page, setPage] = useState(1);
  const [count, setCount] = useState(0);

  const [searchParams, setSearchParams] = useSearchParams();
  const searchQuery = searchParams.get("search") || "";
  const pageFromUrl = Number(searchParams.get("page")) || 1;

  useEffect(() => {
    setPage(pageFromUrl);
  }, [pageFromUrl]);

  useEffect(() => {
    api.get("products/categories/").then(res => {
      const data = Array.isArray(res.data)
        ? res.data
        : Array.isArray(res.data.results)
          ? res.data.results
          : [];
      setCategories(data);
    });

    api.get("promotions/active/").then(res => {
      setPromotions(res.data.results ?? res.data);
    }); 
  }, []);

  useEffect(() => {
    const params = {};

    if (searchQuery) params.search = searchQuery;
    if (slug) params.category_slug = slug;

    api.get("products/", { params }).then(res => {
      const data = res.data.results ?? res.data ?? [];
      setProducts(data);
      setCount(data.length); 
    });
  }, [searchQuery, slug]);

  useEffect(() => {
    if (categories.length > 0) {
      if (slug) {
        const categoryFound = categories.find(c => c.slug === slug);
        
        if (categoryFound) {
          setCurrentCategory(categoryFound);
          setActiveSubcategory(null); 
        } else {
          let subFound = null;
          let parentFound = null;

          categories.forEach(cat => {
            const sub = cat.subcategories?.find(s => s.slug === slug);
            if (sub) {
              subFound = sub;
              parentFound = cat;
            }
          });

          if (subFound) {
            setCurrentCategory(parentFound);
            setActiveSubcategory(subFound);
          }
        }
      } else {
        setCurrentCategory(null);
        setActiveSubcategory(null);
      }
    }
  }, [slug, categories]); 

  const isMainCatalog = !slug && !searchQuery;

  const filteredProducts = products.filter(p => {
    if (searchQuery) {
      return (
        p.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
        p.subcategory?.name?.toLowerCase().includes(searchQuery.toLowerCase()) ||
        p.subcategory?.category?.name?.toLowerCase().includes(searchQuery.toLowerCase())
      );
    }

    if (activeSubcategory) {
      return p.subcategory?.id === activeSubcategory.id;
    }

    if (currentCategory) {
      // Categoría con subcategorías
      if (currentCategory.subcategories?.length > 0) {
        return p.subcategory?.category?.id === currentCategory.id;
      }

      // Categoría SIN subcategorías
      return p.category?.id === currentCategory.id
        || p.subcategory?.category?.id === currentCategory.id;
    }

    return true;
  });

  const ITEMS_PER_PAGE = 20;

  const displayedProducts = isMainCatalog
    ? filteredProducts.slice(
        (page - 1) * ITEMS_PER_PAGE,
        page * ITEMS_PER_PAGE
      )
    : filteredProducts;

  const getPromoData = (product) => {
    const promo = promotions.find(p =>
      p.products.includes(product.id)
    );
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

  /*const handleSearch = (query) => {
    setSearchParams({ search: query, page: 1 });
  };*/

  return (
    <div className="catalog-container">
      <div className="catalog-header">
        <h1 className="catalog-title">
          {searchQuery ? `Resultados para "${searchQuery}"` : 
           activeSubcategory ? activeSubcategory.name : 
           currentCategory ? currentCategory.name : "Nuestro Catálogo"}
        </h1>
      </div>

      {/* CATEGORÍAS PRINCIPALES */}
      {!slug && !searchQuery && (
        <div className="category-filter-bar">
          <button 
            className={`filter-pill ${!currentCategory ? 'active' : ''}`}
            onClick={() => {
              setCurrentCategory(null);
              setActiveSubcategory(null);
              setSearchParams({ page: 1 });
            }}
          > Todos </button>
          {categories.map(cat => (
            <button
              key={cat.id}
              className={`filter-pill ${currentCategory?.id === cat.id ? 'active' : ''}`}
              onClick={() => {setCurrentCategory(cat); setActiveSubcategory(null); setSearchParams({ page: 1 });}}
            > {cat.name} </button>
          ))}
        </div>
      )}

      {/* SUBCATEGORÍAS */}
      {!searchQuery && currentCategory?.subcategories?.length > 0 && (
        <div className="subcategory-nav">
          <span className="subcategory-label">Filtrar en {currentCategory.name}:</span>
          <button 
            className={`sub-pill ${!activeSubcategory ? 'active' : ''}`}
            onClick={() => {
              setActiveSubcategory(null);
              setSearchParams({ page: 1 });
            }}
          > Ver Todo </button>
          {currentCategory.subcategories.map(sub => (
            <button
              key={sub.id}
              className={`sub-pill ${activeSubcategory?.id === sub.id ? 'active' : ''}`}
              onClick={() => {setActiveSubcategory(sub); setSearchParams({ page: 1 });}}
            > {sub.name} </button>
          ))}
        </div>
      )}

      {/* GRID DE PRODUCTOS */}
      <div className="products-grid-formal">
        {filteredProducts.length > 0 ? (
          displayedProducts.map(product => {
            const promo = getPromoData(product);
            const isOutOfStock = product.stock <= 0; // Detectamos si no hay stock

            return (
              <div 
                key={product.id} 
                className={`product-card-formal ${promo ? 'on-sale' : ''} ${isOutOfStock ? 'is-out-of-stock' : ''}`}
              >
                {isOutOfStock && <div className="out-of-stock-badge">Sin stock</div>}
                {promo && !isOutOfStock && <div className="promo-tag-mini">-{promo.percentage}% OFF</div>}
                
                <div className="product-img-wrapper">
                  {product.image ? (
                    <img 
                      src={product.image} 
                      alt={product.name} 
                      style={{ filter: isOutOfStock ? "grayscale(100%) opacity(0.6)" : "none" }} 
                    />
                  ) : (
                    <div className="no-image-box">
                      <img
                        src="/logo-local.png"
                        alt="Solafer"
                        className="no-image-logo"
                      />
                    </div>
                  )}
                </div>

                <div className="product-details">
                  <span className="product-category-tag">
                    {product.subcategory?.category?.name}
                  </span>
                  <h4 className={`product-name-formal ${isOutOfStock ? 'text-strikethrough' : ''}`}>
                    {product.name}
                  </h4>
                  
                  <div className="price-stack">
                    {promo ? (
                      <>
                        <span className="price-old-formal">${promo.old}</span>
                        <span className="price-new-formal">${promo.price}</span>
                      </>
                    ) : (
                      <span className="price-main-formal">${product.price}</span>
                    )}
                  </div>

                  <button 
                    className={`add-to-cart-formal ${isOutOfStock ? 'btn-disabled' : ''}`} 
                    disabled={isOutOfStock} 
                    onClick={() => {
                      if (isOutOfStock) return;
                      const finalPrice = promo ? promo.final : Number(product.price);
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
          <div className="no-results">No hay productos disponibles en esta sección.</div>
        )}
      </div>

      {isMainCatalog && count > ITEMS_PER_PAGE && (
        <div className="pagination-bar">
          <button
            disabled={page === 1}
            onClick={() =>
              setSearchParams({
                ...(searchQuery && { search: searchQuery }),
                page: page - 1,
              })
            }
          >
            ⬅ Anterior
          </button>

          <span>
            Página {page} de {Math.ceil(count / ITEMS_PER_PAGE)}
          </span>

          <button
            disabled={page >= Math.ceil(count / ITEMS_PER_PAGE)}
            onClick={() =>
              setSearchParams({
                ...(searchQuery && { search: searchQuery }),
                page: page + 1,
              })
            }
          >
            Siguiente ➡
          </button>
        </div>
      )}

      {showToast && <div className="toast-cart">🛒 ¡Añadido con éxito!</div>}
    </div>
  );
}

export default Catalog;