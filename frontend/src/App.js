// frontend/src/App.js

import { BrowserRouter, Routes, Route } from "react-router-dom";
import { CartProvider } from "./context/CartContext";
import Home from "./pages/Home";
import Header from "./components/Header";
import Catalog from "./pages/Catalog";
import CategoryPage from "./pages/CategoryPage";
import Carrito from "./pages/Carrito";
import Checkout from "./pages/Checkout";
import Nosotros from "./pages/Nosotros";


function App() {
  return (
    <CartProvider>
      <BrowserRouter>
        <Header />
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/catalogo" element={<Catalog />} />
          <Route path="/nosotros" element={<Nosotros />} />
          <Route path="/cuenta" element={<div>Cuenta</div>} />
          <Route path="/:categorySlug" element={<CategoryPage />} />
          <Route path="/carrito" element={<Carrito />} />
          <Route path="/checkout" element={<Checkout />} />
        </Routes>
      </BrowserRouter>
    </CartProvider>
  );
}

export default App;