import { Link } from "react-router-dom";

function Stats() {
  return (
    <div className="container mt-5 p-3">
      <div className="row p-5">
        <div className="col-12 col-lg-6 p-5">
          <h1 className="fs-2">Trust with confidence</h1>

          <h2 className="fs-4">Customer-first always</h2>
          <p className="text-muted">
            That's why 1.6+ crore customers trust Zerodha with ~ ₹6 lakh
            crores of equity investments, making us India’s largest broker;
            contributing to 15% of daily retail exchange volumes in India.
          </p>

          <h2 className="fs-2">No spam or gimmicks</h2>
          <p className="text-muted">
            No gimmicks, spam, "gamification", or annoying push notifications.
            High quality apps that you use at your pace, the way you like. Our
            philosophies.
          </p>

          <h2 className="fs-2">The Zerodha universe</h2>
          <p className="text-muted">
            Not just an app, but a whole ecosystem. Our investments in 30+
            fintech startups offer you tailored services specific to your
            needs.
          </p>

          <h2 className="fs-2">Do better with money</h2>
          <p className="text-muted">
            With initiatives like Nudge and Kill Switch, we don't just
            facilitate transactions, but actively help you do better with your
            money.
          </p>
        </div>

        <div className="col-12 col-lg-6 p-5 mt-4">
          <img
            src="media/ecosystem.png"
            className="img-fluid"
            style={{ width: "90%" }}
            alt="Zerodha ecosystem"
          />

          <div className="text-center">
            <Link
              to="/product"
              className="me-5"
              style={{ textDecoration: "none" }}
            >
              Explore our products{" "}
              <i className="fa-solid fa-arrow-right"></i>
            </Link>

            <a
              href="#"
              onClick={(e) => e.preventDefault()}
              style={{ textDecoration: "none" }}
            >
              Try Kite demo <i className="fa-solid fa-arrow-right"></i>
            </a>
          </div>
        </div>
      </div>
    </div>
  );
}

export default Stats;
