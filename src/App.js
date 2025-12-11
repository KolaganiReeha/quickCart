import React, { useState, lazy, Suspense, useContext, useEffect } from "react";
import {
  BrowserRouter as Router,
  Routes,
  Route,
  Navigate,
  useNavigate,
} from "react-router-dom";

import Header from "./components/Header";
import Footer from "./components/Footer";
import { AuthContext } from "./AuthContext";
import Login from "./pages/Login";
import Register from "./pages/Register";

import {
  getProducts,
  createProduct,
  updateProduct,
  deleteProduct,
} from "./api";

const Home = lazy(() => import("./pages/Home"));
const Cart = lazy(() => import("./pages/Cart"));
const Checkout = lazy(() => import("./pages/Checkout"));
const ProductDetail = lazy(() => import("./pages/ProductDetail"));
const ThankYou = lazy(() => import("./pages/ThankYou"));

function RequireAuth({ children }) {
  const { token } = useContext(AuthContext);
  if (!token) {
    return <Navigate to="/login" replace />;
  }
  return children;
}

function AuthHeader() {
  const { token, user, logout } = useContext(AuthContext);
  const navigate = useNavigate();

  if (!token) return null;

  function handleLogout() {
    logout();
    navigate("/login");
  }

  return (
    <div style={authHeaderStyle}>
      <div>
      </div>

      <div style={{ display: "flex", gap: 12, alignItems: "center" }}>
        <div style={{ fontSize: 14 }}>Signed in as {user?.email}</div>
        <button onClick={handleLogout} style={authButtonStyle}>
          Logout
        </button>
      </div>
    </div>
  );
}

export default function App() {
  const [cart, setCart] = useState([]);
  const { token, user } = useContext(AuthContext);

  function readGuestCart() {
    try {
      const raw = localStorage.getItem("cart_guest");
      return raw ? JSON.parse(raw) : [];
    } catch {
      return [];
    }
  }

  function writeGuestCart(items) {
    try {
      localStorage.setItem("cart_guest", JSON.stringify(items));
    } catch {}
  }

  function addToGuestCart(product) {
    setCart((prev) => {
      const exists = prev.find((c) => c.external_id == product.id || c.id === product.id);
      let next;
      if (exists) {
        next = prev.map((p) =>
          (p.external_id == product.id || p.id === product.id)
            ? { ...p, quantity: (p.quantity || 1) + (product.quantity || 1) }
            : p
        );
      } else {
        const newItem = {
          id: `guest_${product.id}_${Date.now()}`,
          external_id: product.id,
          title: product.title,
          price: product.price,
          image_url: product.thumbnail || product.image_url,
          quantity: product.quantity || 1,
        };
        next = [...prev, newItem];
      }
      writeGuestCart(next);
      return next;
    });
  }

  function changeGuestQuantityById(guestItemId, newQty) {
    setCart((prev) => {
      const next = prev.map((p) => (p.id === guestItemId ? { ...p, quantity: newQty } : p));
      writeGuestCart(next);
      return next;
    });
  }

  function removeFromGuestCartById(guestItemId) {
    setCart((prev) => {
      const next = prev.filter((p) => p.id !== guestItemId);
      writeGuestCart(next);
      return next;
    });
  }

  useEffect(() => {
    let mounted = true;

    async function loadCartFromServerAndMerge() {
      if (!token || !user) {
        const guest = readGuestCart();
        if (guest && guest.length) {
          setCart(guest);
        } else {
          setCart([]); 
        }
        return;
      }

      try {
        const serverProducts = await getProducts(token);
        if (!mounted) return;

        const normalized = serverProducts.map((p) => ({
          ...p,
          quantity: p.quantity ?? 1,
        }));

        const guest = readGuestCart();
        if (guest && guest.length) {
          for (const g of guest) {
            const match = normalized.find((s) => s.external_id == g.external_id);
            if (match) {
              const newQty = (match.quantity || 1) + (g.quantity || 1);
              try {
                await updateProduct(match.id, { quantity: newQty });
                match.quantity = newQty;
              } catch (e) {
                console.error("Failed to merge guest item (update):", e);
              }
            } else {
              try {
                const created = await createProduct({
                  title: g.title,
                  description: g.description || "",
                  price: g.price,
                  quantity: g.quantity || 1,
                  image_url: g.image_url,
                  external_id: g.external_id,
                });
                if (created.quantity == null) created.quantity = g.quantity || 1;
                normalized.push(created);
              } catch (e) {
                console.error("Failed to merge guest item (create):", e);
              }
            }
          }
          localStorage.removeItem("cart_guest");
        }

        setCart(normalized);

        const key = `cart_${user.email}`;
        localStorage.setItem(key, JSON.stringify(normalized));
      } catch (err) {
        console.error("Failed to load products for user:", err);
        setCart([]);
      }
    }

    loadCartFromServerAndMerge();
    return () => {
      mounted = false;
    };
  }, [token, user]);


useEffect(() => {
  if (token) return;

  try {
    if (!cart || cart.length === 0) return;
    const guestCopy = cart.map((item) => {
      if (String(item.id || "").startsWith("guest_")) {
        return item;
      }

      const external_id = item.external_id ?? item.id;

      return {
        id: `guest_${external_id}_${Date.now()}`, 
        external_id,
        title: item.title,
        price: item.price,
        image_url: item.image_url ?? item.thumbnail,
        quantity: item.quantity ?? 1,
      };
    });

    localStorage.setItem("cart_guest", JSON.stringify(guestCopy));
    setCart(guestCopy);
  } catch (e) {
    console.error("Failed to persist server cart to guest on logout:", e);
  }
}, [token]);


  function findCartItemForProduct(product) {
    return cart.find(
      (c) =>
        c.id === product.id ||
        c.external_id == product.id
    );
  }

  async function addToCartServer(product) {
    try {
      const created = await createProduct({
        title: product.title,
        description: product.description,
        price: product.price,
        quantity: product.quantity || 1,
        image_url: product.image_url || product.thumbnail || undefined,
        external_id: product.id,
      });

      if (!created.external_id) created.external_id = product.id;
      if (created.quantity == null) created.quantity = product.quantity || 1;

      setCart((prev) => {
        const next = [...prev, created];
        if (user?.email) localStorage.setItem(`cart_${user.email}`, JSON.stringify(next));
        return next;
      });
    } catch (err) {
      console.error("Failed to add item to cart (server):", err);
      alert(err.message || "Failed to add item");
    }
  }

  async function changeQuantity(productId, newQty) {
    try {
      const updatedFromServer = await updateProduct(productId, { quantity: newQty });

      setCart((prev) => {
        const next = prev.map((p) => {
          if (p.id !== productId) return p;
          const merged = { ...p, ...updatedFromServer };
          if (merged.quantity == null) merged.quantity = newQty;
          return merged;
        });
        if (user?.email) localStorage.setItem(`cart_${user.email}`, JSON.stringify(next));
        return next;
      });
    } catch (err) {
      console.error("Failed to update product quantity (server):", err);
      alert(err.message || "Update failed");
    }
  }

  async function removeFromCart(productId) {
    try {
      await deleteProduct(productId);
      setCart((prev) => {
        const next = prev.filter((p) => p.id !== productId);
        if (user?.email) localStorage.setItem(`cart_${user.email}`, JSON.stringify(next));
        return next;
      });
    } catch (err) {
      console.error("Failed to delete product (server):", err);
      alert(err.message || "Delete failed");
    }
  }

  function handleIncreaseForProduct(product) {
    if (!token) {
      addToGuestCart(product);
      return;
    }
    const exists = findCartItemForProduct(product);
    if (exists) {
      changeQuantity(exists.id, (exists.quantity || 1) + 1);
    } else {
      addToCartServer({ ...product, quantity: 1 });
    }
  }

  function handleDecreaseForProduct(product) {
    if (!token) {
      const guestItem = cart.find((c) => c.external_id == product.id || c.id === product.id);
      if (!guestItem) return;
      const newQty = (guestItem.quantity || 1) - 1;
      if (newQty > 0) changeGuestQuantityById(guestItem.id, newQty);
      else removeFromGuestCartById(guestItem.id);
      return;
    }
    const exists = findCartItemForProduct(product);
    if (!exists) return;
    if ((exists.quantity || 1) > 1) changeQuantity(exists.id, exists.quantity - 1);
    else removeFromCart(exists.id);
  }

  function handleIncreaseForCartItem(item) {
    if (!token) {
      changeGuestQuantityById(item.id, (item.quantity || 1) + 1);
      return;
    }
    changeQuantity(item.id, (item.quantity || 1) + 1);
  }

  function handleDecreaseForCartItem(item) {
    if (!token) {
      if ((item.quantity || 1) > 1) changeGuestQuantityById(item.id, item.quantity - 1);
      else removeFromGuestCartById(item.id);
      return;
    }
    if ((item.quantity || 1) > 1) changeQuantity(item.id, item.quantity - 1);
    else removeFromCart(item.id);
  }

  async function clearCart() {
    try {
      for (const item of cart) {
        if (item.id && !String(item.id).startsWith("guest_")) {
          await deleteProduct(item.id);
        }
      }
      setCart([]);
      if (user?.email) localStorage.removeItem(`cart_${user.email}`);
      localStorage.removeItem("cart_guest");
    } catch (err) {
      console.error("Failed to clear cart:", err);
    }
  }

  const cartCount = cart.reduce((sum, item) => sum + (item.quantity || 0), 0);

  return (
    <Router>
      <AuthHeader />
      <Header cartCount={cartCount} />

      <main style={{ minHeight: "70vh" }}>
        <Suspense fallback={<div className="text-center p-5">Loading...</div>}>
          <Routes>
            <Route
              path="/"
              element={
                <Home
                  cart={cart}
                  increaseQty={(p) => handleIncreaseForProduct(p)}
                  decreaseQty={(p) => handleDecreaseForProduct(p)}
                />
              }
            />

            <Route
              path="/product/:id"
              element={
                <ProductDetail
                  cart={cart}
                  increaseQty={(p) => handleIncreaseForProduct(p)}
                  decreaseQty={(p) => handleDecreaseForProduct(p)}
                />
              }
            />

            <Route path="/thank-you" element={<ThankYou />} />

            <Route path="/login" element={<Login />} />
            <Route path="/register" element={<Register />} />

            <Route
              path="/cart"
              element={
                <RequireAuth>
                  <Cart
                    cart={cart}
                    increaseQty={(p) => handleIncreaseForCartItem(p)}
                    decreaseQty={(p) => handleDecreaseForCartItem(p)}
                    removeFromCart={(id) => removeFromCart(id)}
                  />
                </RequireAuth>
              }
            />

            <Route
              path="/checkout"
              element={
                <RequireAuth>
                  <Checkout cart={cart} clearCart={clearCart} />
                </RequireAuth>
              }
            />

            <Route path="*" element={<Navigate to="/" replace />} />
          </Routes>
        </Suspense>
      </main>

      <Footer />
    </Router>
  );
}

const authHeaderStyle = {
  display: "flex",
  justifyContent: "space-between",
  alignItems: "center",
  padding: "8px 16px",
  background: "#f6f8fa",
  borderBottom: "1px solid #e6e6e6",
};

const authButtonStyle = {
  padding: "6px 10px",
  border: "none",
  background: "#007bff",
  color: "white",
  borderRadius: 4,
  cursor: "pointer",
  fontSize: 14,
};
