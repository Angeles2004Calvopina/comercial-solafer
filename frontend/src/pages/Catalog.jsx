import { useEffect, useState, useContext } from "react";
import { useParams, useSearchParams, useNavigate } from "react-router-dom";
import api from "../services/api";
import { CartContext } from "../context/CartContext";
import "../styles/Catalog.css";

function Catalog() {
  const { slug } = useParams();
  const navigate = useNavigate();
  const { addToCart } = useContext(CartContext);

  const [products, setProducts] = useState([]);
  const [categories, setCategories] = useState([]);
  const [promotions, setPromotions] = useState([]);
  const [currentCategory, setCurrentCategory] = useState(null);
  const [activeSubcategory, setActiveSubcategory] = useState(null);
  const [showToast, setShowToast] = useState(false);

  const [loadingProducts, setLoadingProducts] = useState(false);

  const [page, setPage] = useState(1);

  const [searchParams, setSearchParams] = useSearchParams();
  const searchQuery = searchParams.get("search") || "";
  const pageFromUrl = Number(searchParams.get("page")) || 1;

  useEffect(() => {
    setPage(pageFromUrl);
  }, [pageFromUrl]);

  /* =========================
     CATEGORÍAS + PROMOS
  ========================= */

  useEffect(() => {
    setLoadingCategories(true);

    api.get("products/categories/")
      .then(res => {
        const data = Array.isArray(res.data)
          ? res.data
          : res.data.results || [];
        setCategories(data);
      })
      .finally(() => setLoadingCategories(false));

    api.get("promotions/active/")
      .then(res => {
        setPromotions(res.data.results ?? res.data);
      });
  }, []);

  /* =========================
     PRODUCTOS
  ========================= */

  useEffect(() => {
    const params = {};
    if (searchQuery) params.search = searchQuery;
    if (slug) params.category_slug = slug;

    setLoadingProducts(true);

    api.get("products/", { params })
      .then(res => {
        const data = res.data.results ?? res.data ?? [];
        setProducts(data);
        setCount(data.length);
      })
      .finally(() => setLoadingProducts(false));
  }, [searchQuery, slug]);

  /* =========================
     CATEGORÍA ACTIVA
  ========================= */

  useEffect(() => {
    if (!categories.length) return;

    if (!slug) {
      setCurrentCategory(null);
      setActiveSubcategory(null);
      return;
    }

    const mainCat = categories.find(c => c.slug === slug);
    if (mainCat) {
      setCurrentCategory(mainCat);
      setActiveSubcategory(null);
      return;
    }

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
  }, [slug, categories]);

  /* =========================
     FILTRADO 
  ========================= */

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
      if (currentCategory.subcategories?.length > 0) {
        return p.subcategory?.category?.id === currentCategory.id;
      }

      return (
        p.category?.id === currentCategory.id ||
        p.subcategory?.category?.id === currentCategory.id
      );
    }

    return true;
  });

  /* =========================
     PAGINACIÓN
  ========================= */

  const ITEMS_PER_PAGE = 20;
  const totalPages = Math.ceil(filteredProducts.length / ITEMS_PER_PAGE);

  const displayedProducts = filteredProducts.slice(
    (page - 1) * ITEMS_PER_PAGE,
    page * ITEMS_PER_PAGE
  );

  /* =========================
     PROMOS
  ========================= */

  const getPromoData = (product) => {
    const promo = promotions.find(p => p.products.includes(product.id));
    if (!promo) return null;

    const base = Number(product.price);
    const discounted = base * (100 - promo.discount_percentage) / 100;

    return {
      price: discounted.toFixed(2),
      old: base.toFixed(2),
      final: discounted,
      percentage: promo.discount_percentage
    };
  };

  /* =========================
     UI
  ========================= */

  const Pagination = () => (
    !loadingProducts && totalPages > 1 && (
      <div className="pagination-bar">
        <button
          disabled={page === 1}
          onClick={() => setSearchParams({ ...(searchQuery && { search: searchQuery }), page: page - 1 })}
        >
          ⬅ Anterior
        </button>
        <span>Página {page} de {totalPages}</span>
        <button
          disabled={page === totalPages}
          onClick={() => setSearchParams({ ...(searchQuery && { search: searchQuery }), page: page + 1 })}
        >
          Siguiente ➡
        </button>
      </div>
    )
  );

  return (
    <div className="catalog-container">

      {/* BOTONES SUPERIORES */}
      <div className="catalog-top-actions">
        <button onClick={() => navigate("/")}>⬅ Regresar al inicio</button>
        {searchQuery && (
          <button onClick={() => navigate("/catalogo")}> ⬅ Regresar al catálogo</button>
        )}

        <button onClick={() => navigate("/carrito")}>
          Ver mi carrito completo ➡
        </button>
      </div>

      <div className="catalog-header">
        <h1 className="catalog-title">
          {searchQuery
            ? `Resultados para "${searchQuery}"`
            : activeSubcategory
            ? activeSubcategory.name
            : currentCategory
            ? currentCategory.name
            : "Nuestro Catálogo"}
        </h1>
      </div>

      {/* FILTROS PRINCIPALES */}
      {!searchQuery && (
        <div className="category-filter-bar">
          <button
            className={`filter-pill ${!currentCategory ? "active" : ""}`}
            onClick={() => {
              setCurrentCategory(null);
              setActiveSubcategory(null);
              setSearchParams({ page: 1 });
            }}
          >
            Todos
          </button>
          {categories.map(cat => (
            <button
              key={cat.id}
              className={`filter-pill ${currentCategory?.id === cat.id ? "active" : ""}`}
              onClick={() => {
                setCurrentCategory(cat);
                setActiveSubcategory(null);
                setSearchParams({ page: 1 });
              }}
            >
              {cat.name}
            </button>
          ))}
        </div>
      )}

      {/* SUBCATEGORÍAS */}
      {!searchQuery && currentCategory?.subcategories?.length > 0 && (
        <div className="subcategory-nav">
          <button
            className={`sub-pill ${!activeSubcategory ? "active" : ""}`}
            onClick={() => {
              setActiveSubcategory(null);
              setSearchParams({ page: 1 });
            }}
          >
            Ver todo
          </button>
          {currentCategory.subcategories.map(sub => (
            <button
              key={sub.id}
              className={`sub-pill ${activeSubcategory?.id === sub.id ? "active" : ""}`}
              onClick={() => {
                setActiveSubcategory(sub);
                setSearchParams({ page: 1 });
              }}
            >
              {sub.name}
            </button>
          ))}
        </div>
      )}

      <Pagination />

      {/* GRID */}
      <div className="products-grid-formal">
        {loadingProducts ? (
          <div className="no-results">Cargando productos...</div>
        ) : displayedProducts.length > 0 ? (
          displayedProducts.map(product => {
            const promo = getPromoData(product);
            const isOut = product.stock <= 0;

            return (
              <div key={product.id} className="product-card-formal">
                {isOut && <div className="out-of-stock-badge">Sin stock</div>}
                {promo && !isOut && <div className="promo-tag-mini">-{promo.percentage}% OFF</div>}

                <div className="product-img-wrapper">
                  {product.image ? (
                    <img src={product.image} alt={product.name} />
                  ) : (
                    <div className="no-image-box">
                      <span className="no-image-text">SOLAFER</span>
                    </div>
                  )}
                </div>

                <div className="product-details">
                  <h4 className="product-name-formal">{product.name}</h4>

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
                    className={`add-to-cart-formal ${isOut ? "btn-disabled" : ""}`}
                    disabled={isOut}
                    onClick={() => {
                      if (isOut) return;
                      addToCart({
                        id: product.id,
                        name: product.name,
                        unit_price: promo ? promo.final : Number(product.price),
                        image: product.image,
                        stock: product.stock
                      });
                      setShowToast(true);
                      setTimeout(() => setShowToast(false), 2000);
                    }}
                  >
                    {isOut ? "Agotado" : "Añadir"}
                  </button>
                </div>
              </div>
            );
          })
        ) : (
          <div className="no-results">No hay productos</div>
        )}
      </div>

      <Pagination />

      {showToast && <div className="toast-cart">🛒 ¡Añadido con éxito!</div>}
    </div>
  );
}

export default Catalog;