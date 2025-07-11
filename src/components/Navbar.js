import React from "react";
import { Link } from "react-router-dom";

const Navbar = ({ cart }) => {
  const totalCartItems = cart.reduce((sum, item) => sum + item.quantity, 0);

  return (
    <nav className="navbar navbar-dark bg-dark px-3">
      <Link to="/" className="navbar-brand fs-4 fw-bold">🛍 MyShop</Link>
      <div className="ms-auto d-flex align-items-center">
        <Link to="/cart" className="position-relative text-white me-3">
          <i className="fas fa-shopping-cart fa-2x"></i>
          <span className="cart-badge">{totalCartItems}</span>
        </Link>
      </div>
    </nav>
  );
};

export default Navbar;
