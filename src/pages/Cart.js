import { Link } from "react-router-dom";
import { useNavigate } from "react-router-dom";

const Cart = ({ cart, increaseQty, decreaseQty }) => {
  const navigate = useNavigate();
  const total = cart.reduce((sum, item) => sum + item.quantity * item.price, 0);

  return (
    <div className="container mt-4">
      <h3 className="mb-4">
        🛒 Your Cart
      </h3>

      {cart.length === 0 ? (
        <p>Your cart is empty.</p>
      ) : (
        <>
          {cart.map((item) => (
            <div
              key={item.id}
              className="row align-items-center mb-3"
            >
              <div className="col-md-6">
                <strong onClick={() => navigate(`/product/${item.id}`)}
                style={{ cursor: "pointer", color: "#007bff", textDecoration: "none" }}>
                  {item.title}</strong> <span className="text-muted">- ${item.price}</span>
              </div>

              <div className="col-md-3">
                <div className="d-flex align-items-center">
                  <button
                    className="btn btn-sm btn-outline-danger me-2"
                    onClick={() => decreaseQty(item)}
                  >
                    -
                  </button>
                  <span className="fw-bold">{item.quantity}</span>
                  <button
                    className="btn btn-sm btn-outline-success ms-2"
                    onClick={() => increaseQty(item)}
                  >
                    +
                  </button>
                </div>
              </div>

              <div className="col-md-3 fw-bold text-end">
                ${(item.quantity * item.price).toFixed(2)}
              </div>
            </div>
          ))}

          <hr />

          <div className="d-flex justify-content-between fw-bold fs-5">
            <span>Total:</span>
            <span>${total.toFixed(2)}</span>
          </div>

          <Link to="/checkout" className="btn btn-primary mt-3">
            Proceed to Checkout
          </Link>
        </>
      )}
    </div>
  );
};

export default Cart;
