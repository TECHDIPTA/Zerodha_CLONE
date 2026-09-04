import { useState } from "react";

function Hero({ search, setSearch }) {
  const handleChange = (e) => {
    setSearch(e.target.value);
  };

  const handleSubmit = (e) => {
    e.preventDefault();
  };

  return (
    <section className="py-5 mt-5" style={{ backgroundColor: "#F8F9FA" }}>
      <div className="container">
        {/* Top Header Row */}
        <div className="row align-items-center mb-4">
          <div className="col-sm-6">
            <h2 className="fw-bold mb-0 text-dark">Support Portal</h2>
          </div>
          <div className="col-sm-6 text-sm-end mt-3 mt-sm-0">
            <button
              type="button"
              className="btn px-4 py-2 text-white fw-medium shadow-sm"
              style={{ backgroundColor: "#387ED1", border: "none" }}
            >
              My Tickets
            </button>
          </div>
        </div>

        {/* Search Bar Form */}
        <form onSubmit={handleSubmit}>
          <div className="input-group input-group-lg shadow-sm bg-white rounded overflow-hidden">
            <span className="input-group-text bg-white border-0 ps-3">
              <i className="fa-solid fa-magnifying-glass text-secondary"></i>
            </span>
            <input
              type="text"
              className="form-control border-0 shadow-none ps-2"
              style={{ fontSize: "1.05rem", padding: "15px 10px" }}
              placeholder="Eg. How do I open my account, How do I activate F&O..."
              aria-label="Search support articles"
              value={search}
              onChange={handleChange}
            />
          </div>
        </form>
      </div>
    </section>
  );
}

export default Hero;