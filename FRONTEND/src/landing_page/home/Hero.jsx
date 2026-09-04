import { Link } from "react-router-dom";
function Hero() {
  return (
    <div className="container py-5 mt-5">
      <div className="row text-center justify-content-center">
        <div className="col-lg-8">
          <img
            src="media/homeHero.png"
            alt="Hero"
            className="img-fluid mb-5"
            style={{ width: "65%" }}
          />

          <h1
            className="mb-3"
            style={{
              fontSize: "2rem",
              fontWeight: "500",
              color: "#424242",
            }}
          >
            Invest in everything
          </h1>

          <p
            className="mb-4"
            style={{
              fontSize: "1.25rem",
              color: "#666",
            }}
          >
            Online platform to invest in stocks, derivatives, mutual funds,
            ETFs, bonds, and more.
          </p>

          <Link
            to="/signup"
            className="btn btn-primary px-5 py-2"
            style={{
              fontSize: "1.2rem",
              backgroundColor: "#387ed1",
              border: "none",
            }}
          >
            Sign up for free
          </Link>
        </div>
      </div>
    </div>
  );
}

export default Hero;
