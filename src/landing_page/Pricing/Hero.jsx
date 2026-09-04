function Hero() {
  return (
    <div className="container">
      {/* Heading */}
      <div className="row text-center mt-5 pt-5 pb-5">
        <h1 className="fw-bold fs-3">Charges</h1>
        <p className="text-muted fs-5 mt-2">
List of all charges and taxes
        </p>
      </div>

      {/* Pricing Cards */}
      <div className="row text-center py-2">
        <div className="col-lg-4 col-md-4 col-12 mb-5">
          <img
            src="media/pricingMF.svg"
            alt="Free Equity Delivery"
            className="img-fluid mb-3"
            style={{ width: "30%" }}
          />
          <h3>Free equity delivery</h3>
          <p className="text-muted mt-3">
            All equity delivery investments (NSE, BSE), are absolutely free —
            ₹0 brokerage.
          </p>
        </div>

        <div className="col-lg-4 col-md-4 col-12 mb-5">
          <img
            src="media/intradayTrades.svg"
            alt="Intraday and F&O"
            className="img-fluid mb-3"
            style={{ width: "30%" }}
          />
          <h3>Intraday and F&O trades</h3>
          <p className="text-muted mt-3">
            Flat ₹20 or 0.03% (whichever is lower) per executed order on
            intraday equity, currency, and commodity trades. Flat ₹20 on all
            option trades.
          </p>
        </div>

        <div className="col-lg-4 col-md-4 col-12 mb-5">
          <img
            src="media/pricingEquity.svg"
            alt="Free Direct MF"
            className="img-fluid mb-3"
            style={{ width: "30%" }}
          />
          <h3>Free direct MF</h3>
          <p className="text-muted mt-3">
            All direct mutual fund investments are completely free — ₹0
            commission & ₹0 DP charges.
          </p>
        </div>
      </div>
    </div>
  );
}

export default Hero;