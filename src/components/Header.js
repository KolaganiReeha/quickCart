import { Link } from "react-router-dom";

const Header = ({ cartCount }) => {
  return (
    <>
      <div className="main-header py-3 px-4 d-flex justify-content-between align-items-center">
        <h2 className="logo">QuickCart</h2>
        <nav className="nav-menu d-flex gap-4">
          <Link to="">Home</Link>
          <a href="#foot">Contact</a>
        </nav>
        <div>
           <Link to="/cart" className="text-dark position-relative">
            <i className="fas fa-shopping-cart"></i>
            {cartCount > 0 && (
              <span className="cart-badge">{cartCount}</span>
            )}
          </Link>
        </div>
      </div>
    </>
  );
};

export default Header;
