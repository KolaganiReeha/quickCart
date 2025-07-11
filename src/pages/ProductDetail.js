import React, { useEffect, useState } from "react";
import { useParams } from "react-router-dom";

const ProductDetail = ({ cart, increaseQty, decreaseQty }) => {
  const { id } = useParams();
  const [product, setProduct] = useState(null);

  useEffect(() => {
    fetch(`https://dummyjson.com/products/${id}`)
      .then((res) => res.json())
      .then((data) => setProduct(data));
  }, [id]);

  if (!product) return <p>Loading...</p>;

  const cartItem = cart.find((item) => item.id === product.id);
  const quantity = cartItem ? cartItem.quantity : 0;
  const originalPrice = (product.price / (1 - product.discountPercentage / 100)).toFixed(2);

  return (
    <div className="container my-4">
      <h3 className="mb-3"><i className="fas fa-shopping-bag me-2"></i> Product Details</h3>
      <div className="row">
        <div className="col-md-6">
          <img src={product.thumbnail} className="img-fluid mb-3" alt={product.title} />
        </div>

        {/* Product Info */}
        <div className="col-md-6">
          <h4>{product.title}</h4>
          <p>⭐ {product.rating} ({Math.floor(product.rating * 5)} reviews)</p>
          <p>
            <span className="text-primary fw-bold">${product.price}</span>
            <span className="text-muted text-decoration-line-through mx-2">${originalPrice}</span>
            <span className="text-danger">{Math.round(product.discountPercentage)}% off</span>
          </p>
          <p><strong>Stock:</strong> {product.stock > 0 ? product.stock : "Out of stock"}</p>
          <p className="text-muted">{product.description}</p>
          <p><strong>Category:</strong> {product.category}</p>

          {quantity === 0 ? (
            <button className="btn btn-success" onClick={() => increaseQty(product)}>
              Add to Cart
            </button>
          ) : (
            <div className="quantity-controls d-flex align-items-center justify-content">
              <button className="btn btn-outline-danger me-2" onClick={() => decreaseQty(product)}>-</button>
              <span className="fw-bold">{quantity}</span>
              <button className="btn btn-outline-success ms-2" onClick={() => increaseQty(product)}>+</button>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default ProductDetail;
