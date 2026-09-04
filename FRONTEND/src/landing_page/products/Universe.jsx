import { Link } from "react-router-dom";
function Universe() {
  const logoContainerStyle = {
    height: "75px",
  };

  const logoStyle = {
    maxHeight: "60px",
    maxWidth: "190px",
    objectFit: "contain",
  };

  const sensibullStyle = {
    maxHeight: "80px",
    maxWidth: "240px",
    objectFit: "contain",
  };

  return (
    <div className="container mt-5">
      <div className="row text-center">
        <h1>The Zerodha Universe</h1>

        <p className="mb-5">
          Extend your trading and investment experience even further with our
          partner platforms
        </p>

        {/* Fund House */}
        <div className="col-12 col-md-6 col-lg-4 p-3">
          <div
            className="d-flex justify-content-center align-items-center mb-3"
            style={logoContainerStyle}
          >
            <img
              src="media/zerodhaFundhouse.png"
              alt="Fund House"
              className="img-fluid"
              style={logoStyle}
            />
          </div>

          <p className="text-muted small">
            Our asset management venture that is creating simple and transparent
            index funds to help you save for your goals.
          </p>
        </div>

        {/* Sensibull */}
        <div className="col-12 col-md-6 col-lg-4 p-3">
          <div
            className="d-flex justify-content-center align-items-center mb-3"
            style={logoContainerStyle}
          >
            <img
  src="media/sensibullLogo.svg"
  alt="Sensibull"
  className="img-fluid"
  style={{
    maxHeight: "60px",
    transform: "scale(1.6)",
    transformOrigin: "center",
  }}
/>
          </div>

          <p className="text-muted small">
            Options trading platform that lets you create strategies, analyze
            positions, and examine data points like open interest, FII/DII, and
            more.
          </p>
        </div>

        {/* Streak */}
        <div className="col-12 col-md-6 col-lg-4 p-3">
          <div
            className="d-flex justify-content-center align-items-center mb-3"
            style={logoContainerStyle}
          >
            <img
              src="media/streakLogo.png"
              alt="Streak"
              className="img-fluid"
              style={logoStyle}
            />
          </div>

          <p className="text-muted small">
            Systematic trading platform that allows you to create and backtest
            strategies without coding.
          </p>
        </div>

        {/* Smallcase */}
        <div className="col-12 col-md-6 col-lg-4 p-3">
          <div
            className="d-flex justify-content-center align-items-center mb-3"
            style={logoContainerStyle}
          >
            <img
              src="media/smallcaseLogo.png"
              alt="Smallcase"
              className="img-fluid"
              style={logoStyle}
            />
          </div>

          <p className="text-muted small">
            Thematic investing platform that helps you invest in diversified
            baskets of stocks and ETFs.
          </p>
        </div>

        {/* Tijori */}
        <div className="col-12 col-md-6 col-lg-4 p-3">
          <div
            className="d-flex justify-content-center align-items-center mb-3"
            style={logoContainerStyle}
          >
            <img
              src="media/tijori.svg"
              alt="Tijori"
              className="img-fluid"
              style={logoStyle}
            />
          </div>

          <p className="text-muted small">
            Investment research platform that offers detailed insights on
            stocks, sectors, supply chains, and more.
          </p>
        </div>

        {/* Ditto */}
        <div className="col-12 col-md-6 col-lg-4 p-3">
          <div
            className="d-flex justify-content-center align-items-center mb-3"
            style={logoContainerStyle}
          >
            <img
              src="media/dittoLogo.png"
              alt="Ditto"
              className="img-fluid"
              style={logoStyle}
            />
          </div>

          <p className="text-muted small">
            Personalized advice on life and health insurance. No spam and no
            mis-selling.
          </p>
        </div>

        <div className="col-12 text-center mt-5 mb-5">
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

export default Universe;