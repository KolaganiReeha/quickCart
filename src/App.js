import React, { useState } from "react";
import { Routes, Route } from "react-router-dom";
import Header from "./components/Header";
import Home from "./pages/Home";
import Cart from "./pages/Cart";
import Checkout from "./pages/Checkout";
import Footer from "./components/Footer";
import ProductDetail from "./pages/ProductDetail";
import ThankYou from "./pages/ThankYou";

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
    <div className="App">
      <Header cartCount={cart.reduce((sum, item) => sum + item.quantity, 0)} />
      <main>
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
        <Route path="/product/:id" element={<ProductDetail cart={cart} increaseQty={increaseQty} decreaseQty={decreaseQty} />} />
      </Routes>
      </main>
      <Footer />
    </div>
  );
}

export default App;
