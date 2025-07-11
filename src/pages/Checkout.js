import { useNavigate } from "react-router-dom";

const Checkout = ({ cart }) => {
  const navigate = useNavigate();
  const total = cart.reduce((sum, item) => sum + item.quantity * item.price, 0);

  return (
    <div className="container mt-4">
      <h3 className="mb-3">💳 Checkout</h3>
      {cart.length === 0 ? (
        <p>No items in your cart.</p>
      ) : (
        <>
          <ul className="list-group mb-3">
            {cart.map(item => (
              <li
                key={item.id}
                className="list-group-item d-flex justify-content-between align-items-center"
              >
                <div>
                  <span
                    onClick={() => navigate(`/product/${item.id}`)}
                    style={{
                      cursor: "pointer",
                      color: "#007bff",
                      textDecoration: "none",
                      marginRight: "8px",
                    }}
                  >
                    {item.title}
                  </span>
                  <span className="text-muted">x {item.quantity}</span>
                </div>
                <span>${(item.price * item.quantity).toFixed(2)}</span>
              </li>
            ))}
          </ul>
          <h5 className="mb-3">Total: ${total.toFixed(2)}</h5>
          <button className="btn btn-success w-100" onClick={() => navigate("/thank-you")}>Complete Payment</button>
        </>
      )}
    </div>
  );
};

export default Checkout;
