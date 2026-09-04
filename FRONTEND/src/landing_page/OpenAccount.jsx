import { Link } from "react-router-dom";
function OpenAccount() {
  return (
    <div className="container py-5 mt-2">
      <div className="row text-center justify-content-center">
        <div className="col-lg-8">
          <h1
            className="mb-3"
            style={{
              fontSize: "2rem",
              fontWeight: "500",
              color: "#424242",
            }}
          >
            Open a Zerodha account
          </h1>

          <p
            className="mb-4"
            style={{
              fontSize: "1.25rem",
              color: "#666",
            }}
          >
            Modern a platforms and apps , ₹0 invetments and flat ₹20 intraday
            and F&O trades,
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
export default OpenAccount;
