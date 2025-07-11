import React from "react";

const Footer = () => {
  return (
    <footer id="foot">
      <div className="container d-flex flex-column flex-md-row justify-content-between align-items-center">
        <div>
          <h5 className="mb-2">Reeha Kolagani</h5>
          <p className="mb-1"><i className="fas fa-envelope me-2"></i>reehakolagani@gmail.com</p>
          <p className="mb-1"><i className="fas fa-phone me-2"></i>+1 (732) 343-2416</p>
          <p><i className="fas fa-map-marker-alt me-2"></i>Atlanta, GA, USA</p>
        </div>
        <div className="text-center text-md-end mt-3 mt-md-0">
          <p>Follow me:</p>
          <a href="https://github.com/KolaganiReeha" className="text-black me-3" target="_blank" rel="noreferrer">
            <i className="fab fa-github fa-lg"></i>
          </a>
          <a href="https://www.linkedin.com/in/reeha-kolagani/" className="text-black me-3" target="_blank" rel="noreferrer">
            <i className="fab fa-linkedin fa-lg"></i>
          </a>
          <a href="https://kolaganireeha.github.io/portfolio/" className="text-black" target="_blank" rel="noreferrer">
            <i className="fas fa-globe fa-lg"></i>
          </a>
        </div>
      </div>
      <hr className="bg-white my-3" />
      <div className="text-center small">
        © {new Date().getFullYear()} Reeha Kolagani. All rights reserved.
      </div>
    </footer>
  );
};

export default Footer;
