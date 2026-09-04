import React from "react";

function Hero() {
  return (
    <div
      className="bg-light border-bottom py-5"
      style={{
        marginTop: "90px",
      }}
    >
      <div className="container">
        <div className="text-center py-4">
          <h1 className="fw-normal text-dark mb-3">
            Zerodha Products
          </h1>

          <p className="text-muted fs-5 mb-4">
            Sleek, modern, and intuitive trading platforms
          </p>

          <p className="mb-0">
            Check out our{" "}
            <a
              href="https://zerodha.com/investments"
              target="_blank"
              rel="noopener noreferrer"
              className="text-decoration-none fw-semibold"
            >
              investment offerings →
            </a>
          </p>
        </div>
      </div>
    </div>
  );
}

export default Hero;

