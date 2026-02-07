import { BrowserRouter, Routes, Route } from "react-router-dom";
import { CartProvider } from "./context/CartContext"; // Importas el proveedor
import Home from "./pages/Home";
import Catalog from "./pages/Catalog";

function App() {
  return (
    <CartProvider>
      <BrowserRouter>
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/catalogo" element={<Catalog />} />
          <Route path="/nosotros" element={<div>Nosotros</div>} />
          <Route path="/cuenta" element={<div>Cuenta</div>} />
        </Routes>
      </BrowserRouter>
    </CartProvider>
  );
}

export default App;