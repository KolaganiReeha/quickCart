import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";

const Home = ({ cart, increaseQty, decreaseQty }) => {
  const [allProducts, setAllProducts] = useState([]);
  const [filteredProducts, setFilteredProducts] = useState([]);
  const [currentPage, setCurrentPage] = useState(1);
  const [loading, setLoading] = useState(false);
  const productsPerPage = 10;
  const navigate = useNavigate();

  useEffect(() => {
    const fetchProducts = async () => {
      setLoading(true);
      const res = await fetch("https://dummyjson.com/products?limit=100");
      const data = await res.json();
      setAllProducts(data.products);
      setFilteredProducts(data.products);
      setLoading(false);
    };

    fetchProducts();
  }, []);

  const handleSearch = (e) => {
    e.preventDefault();
    const input = e.target.elements.search.value.toLowerCase();
    const filtered = allProducts.filter((p) =>
      p.title.toLowerCase().includes(input) ||
      p.description.toLowerCase().includes(input)
    );
    setFilteredProducts(filtered);
    setCurrentPage(1);
  };

  const indexOfLast = currentPage * productsPerPage;
  const indexOfFirst = indexOfLast - productsPerPage;
  const currentProducts = filteredProducts.slice(indexOfFirst, indexOfLast);
  const totalPages = Math.ceil(filteredProducts.length / productsPerPage);

  const handlePageChange = (page) => {
    setCurrentPage(page);
  };

  return (
    <div className="container mt-4">
      <form onSubmit={handleSearch} className="d-flex mb-4">
        <input
          className="form-control me-2"
          type="text"
          name="search"
          placeholder="Search products..."
        />
        <button className="btn btn-primary" type="submit">Search</button>
      </form>

      {loading ? (
        <p>Loading...</p>
      ) : (
        <>
          <div className="row">
            {currentProducts.length === 0 ? (
              <p>No products found.</p>
            ) : (
              currentProducts.map((product) => {
                const cartItem = cart.find(
                  (item) => item.id === product.id || item.external_id == product.id
                );
                const quantity = cartItem ? cartItem.quantity : 0;
                const isOutOfStock = product.stock === 0;

                return (
                  <div key={product.id} className="col-md-4 mb-4">
                    <div
                      className="card h-100 position-relative"
                      style={{ cursor: "pointer", transition: "transform 0.3s" }}
                      onClick={() => navigate(`/product/${product.id}`)}
                      onMouseEnter={(e) => e.currentTarget.style.transform = "scale(1.05)"}
                      onMouseLeave={(e) => e.currentTarget.style.transform = "scale(1)"}
                    >
                      <img
                        src={product.thumbnail}
                        className="card-img-top"
                        alt={product.title}
                        style={{ height: "200px", objectFit: "cover" }}
                      />
                      <div className={`ribbon-wrapper ${!isOutOfStock ? "show-on-hover" : ""}`}>
                      <div className={`ribbon ${isOutOfStock ? "bg-danger" : "bg-success"}`}>
                        {isOutOfStock ? "Out of Stock" : "In Stock"}
                      </div>
                      </div>

                      <div className="card-body text-center">
                        <h5 className="card-title">{product.title}</h5>
                        <p className="card-text">${product.price}</p>

                        {!isOutOfStock && (
                          quantity === 0 ? (
                            <button
                              className="btn btn-success"
                              onClick={(e) => {
                                e.stopPropagation();
                                increaseQty(product);
                              }}
                            >
                              Add to Cart
                            </button>
                          ) : (
                            <div
                              className="d-flex align-items-center justify-content-center"
                              onClick={(e) => e.stopPropagation()}
                            >
                              <button
                                className="btn btn-outline-danger me-2"
                                onClick={() => decreaseQty(product)}
                              >
                                -
                              </button>
                              <span className="fw-bold mx-2">{quantity}</span>
                              <button
                                className="btn btn-outline-success ms-2"
                                onClick={() => increaseQty(product)}
                              >
                                +
                              </button>
                            </div>
                          )
                        )}
                      </div>
                    </div>
                  </div>
                );
              })
            )}
          </div>

          <div className="d-flex justify-content-center mt-4 flex-wrap">
            {[...Array(totalPages)].map((_, i) => (
              <button
                key={i}
                onClick={() => handlePageChange(i + 1)}
                className={`btn btn-sm mx-1 mb-2 ${
                  currentPage === i + 1 ? "btn-primary" : "btn-outline-primary"
                }`}
              >
                {i + 1}
              </button>
            ))}
          </div>
        </>
      )}
    </div>
  );
};

export default Home;
