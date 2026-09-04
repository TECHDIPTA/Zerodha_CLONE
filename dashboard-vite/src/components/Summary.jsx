import React from "react";
import "./Summary.css";

const formatMoney = (value) => {
  const number = Number(value) || 0;

  if (Math.abs(number) >= 10000000) {
    return `₹${(number / 10000000).toFixed(2)}Cr`;
  }

  if (Math.abs(number) >= 100000) {
    return `₹${(number / 100000).toFixed(2)}L`;
  }

  if (Math.abs(number) >= 1000) {
    return `₹${(number / 1000).toFixed(2)}k`;
  }

  return `₹${number.toFixed(2)}`;
};

const Summary = ({
  userName = "Trader",
  holdingsData = [],
  positionsData = [],
  marginAvailable = 0,
  openingBalance = 0,
}) => {
  const totalInvestment = holdingsData.reduce(
    (sum, stock) =>
      sum + (Number(stock.avg) || 0) * (Number(stock.qty) || 0),
    0
  );

  const currentValue = holdingsData.reduce(
    (sum, stock) =>
      sum + (Number(stock.price) || 0) * (Number(stock.qty) || 0),
    0
  );

  const holdingsPnL = currentValue - totalInvestment;

  const holdingsPnLPercent =
    totalInvestment > 0
      ? (holdingsPnL / totalInvestment) * 100
      : 0;

  const marginsUsed = positionsData.reduce(
    (sum, position) =>
      sum +
      (Number(position.marginRequired) ||
        (Number(position.avg) || 0) * (Number(position.qty) || 0)),
    0
  );

  return (
    <div className="summary-page">

      {/* Greeting */}
      <section className="summary-header">
        <h1>Hi, {userName}</h1>
        <p>Your investment overview</p>
      </section>


      {/* Equity */}
      <section className="summary-card">

        <div className="summary-card-header">
          <h2>Equity</h2>
        </div>

        <div className="summary-grid">

          <div className="summary-main">
            <span className="summary-value">
              {formatMoney(marginAvailable)}
            </span>

            <span className="summary-label">
              Margin available
            </span>
          </div>

          <div className="summary-stat">
            <span>Margins used</span>
            <strong>{formatMoney(marginsUsed)}</strong>
          </div>

          <div className="summary-stat">
            <span>Opening balance</span>
            <strong>
              {formatMoney(openingBalance || marginAvailable)}
            </strong>
          </div>

        </div>
      </section>


      {/* Holdings */}
      <section className="summary-card">

        <div className="summary-card-header">
          <h2>
            Holdings
            <span> {holdingsData.length}</span>
          </h2>
        </div>

        <div className="summary-grid">

          <div className="summary-main">

            <span
              className={`summary-value ${
                holdingsPnL >= 0 ? "profit" : "loss"
              }`}
            >
              {holdingsPnL >= 0 ? "+" : ""}
              {formatMoney(holdingsPnL)}
            </span>

            <span className="summary-label">
              P&amp;L

              <small
                className={
                  holdingsPnL >= 0 ? "profit" : "loss"
                }
              >
                {holdingsPnL >= 0 ? "+" : ""}
                {holdingsPnLPercent.toFixed(2)}%
              </small>
            </span>

          </div>

          <div className="summary-stat">
            <span>Current value</span>
            <strong>{formatMoney(currentValue)}</strong>
          </div>

          <div className="summary-stat">
            <span>Investment</span>
            <strong>{formatMoney(totalInvestment)}</strong>
          </div>

        </div>
      </section>


      {/* Quick overview */}
      <section className="summary-card quick-card">

        <div className="summary-card-header">
          <h2>Account overview</h2>
        </div>

        <div className="overview-row">
          <span>Holdings</span>
          <strong>{holdingsData.length}</strong>
        </div>

        <div className="overview-row">
          <span>Open positions</span>
          <strong>{positionsData.length}</strong>
        </div>

        <div className="overview-row">
          <span>Portfolio value</span>
          <strong>{formatMoney(currentValue)}</strong>
        </div>

      </section>

    </div>
  );
};

export default Summary;