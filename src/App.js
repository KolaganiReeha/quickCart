import React, { useState, lazy, Suspense } from "react";
import { HashRouter as Router, Routes, Route, Navigate } from "react-router-dom";
import Header from "./components/Header";
import Footer from "./components/Footer";

// Lazy load pages
const Home = lazy(() => import("./pages/Home"));
const Cart = lazy(() => import("./pages/Cart"));
const Checkout = lazy(() => import("./pages/Checkout"));
const ProductDetail = lazy(() => import("./pages/ProductDetail"));
const ThankYou = lazy(() => import("./pages/ThankYou"));

function App() {
  const [cart, setCart] = useState([]); 

  const increaseQty = (product) => {
    const exists = cart.find((item) => item.id === product.id);
    if (exists) {
      setCart(cart.map(item =>
        item.id === product.id ? { ...item, quantity: item.quantity + 1 } : item
      ));
    } else {
      setCart([...cart, { ...product, quantity: 1 }]);
    }
  };

  const decreaseQty = (product) => {
    const exists = cart.find((item) => item.id === product.id);
    if (exists && exists.quantity > 1) {
      setCart(cart.map(item =>
        item.id === product.id ? { ...item, quantity: item.quantity - 1 } : item
      ));
    } else {
      setCart(cart.filter(item => item.id !== product.id));
    }
  };

  return (
    <Router>
      <Header cartCount={cart.reduce((sum, item) => sum + item.quantity, 0)} />
      <main>
        <Suspense fallback={<div className="text-center p-5">Loading...</div>}>
          <Routes>
            <Route
              path="/"
              element={<Home cart={cart} increaseQty={increaseQty} decreaseQty={decreaseQty} />}
            />
            <Route
              path="/cart"
              element={<Cart cart={cart} increaseQty={increaseQty} decreaseQty={decreaseQty} />}
            />
            <Route path="/checkout" element={<Checkout cart={cart} />} />
            <Route path="/thank-you" element={<ThankYou />} />
            <Route
              path="/product/:id"
              element={<ProductDetail cart={cart} increaseQty={increaseQty} decreaseQty={decreaseQty} />}
            />
            <Route path="*" element={<Navigate to="/" replace />} />
          </Routes>
        </Suspense>
      </main>
      <Footer />
    </Router>
  );
}

export default App;
