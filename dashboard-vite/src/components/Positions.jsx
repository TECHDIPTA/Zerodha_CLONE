import React from "react";
import "./Positions.css";

/* =========================================================
   FORMAT PRICE
========================================================= */

const formatPrice = (value) => {
  const number = Number(value);

  if (!Number.isFinite(number)) {
    return "0.00";
  }

  return number.toFixed(2);
};


/* =========================================================
   FORMAT PERCENT
========================================================= */

const formatPercent = (value) => {
  const number = Number(value);

  if (!Number.isFinite(number)) {
    return "0.00%";
  }

  return `${number >= 0 ? "+" : ""}${number.toFixed(2)}%`;
};


/* =========================================================
   POSITIONS
========================================================= */

const Positions = ({
  positionsData = [],
}) => {
  return (
    <div className="positions-container">

      {/* =====================================================
          TITLE
      ===================================================== */}

      <h3 className="title">
        Positions ({positionsData.length})
      </h3>


      {/* =====================================================
          TABLE
      ===================================================== */}

      <div className="order-table-wrapper">

        <table className="order-table">

          <thead>
            <tr>
              <th>Product</th>
              <th>Instrument</th>
              <th>Qty.</th>
              <th>Avg.</th>
              <th>LTP</th>
              <th>P&amp;L</th>
              <th>Chg.</th>
            </tr>
          </thead>


          <tbody>

            {/* =================================================
                EMPTY STATE
            ================================================= */}

            {positionsData.length === 0 ? (

              <tr>
                <td
                  colSpan="7"
                  style={{
                    textAlign: "center",
                    padding: "40px 10px",
                    color: "#999",
                    fontSize: "13px",
                  }}
                >
                  No open positions
                </td>
              </tr>

            ) : (

              positionsData.map(
                (stock) => {

                  const qty =
                    Number(stock.qty) || 0;

                  const price =
                    Number(stock.price) || 0;

                  const avg =
                    Number(stock.avg) || 0;


                  /* =================================================
                     P&L

                     (LTP - Average Price) × Quantity
                  ================================================= */

                  const pnlVal =
                    (price - avg) * qty;

                  const isProfit =
                    pnlVal >= 0;


                  /* =================================================
                     REFERENCE PRICE

                     Dashboard preserves this value.
                     It does NOT change on every market tick.
                  ================================================= */

                  const previousPrice =
                    Number(stock.previousPrice) ||
                    Number(stock.referencePrice) ||
                    avg ||
                    price;


                  /* =================================================
                     CHANGE %

                     Current LTP compared with reference price
                  ================================================= */

                  const dayPercent =
                    previousPrice > 0
                      ? (
                          (price - previousPrice) /
                          previousPrice
                        ) * 100
                      : 0;

                  const isChangePositive =
                    dayPercent >= 0;


                  return (
                    <tr
                      key={
                        stock._id ||
                        `${stock.name}-${stock.product}`
                      }
                    >

                      {/* =========================================
                          PRODUCT
                      ========================================= */}

                      <td data-label="Product">
                        {stock.product || "MIS"}
                      </td>


                      {/* =========================================
                          INSTRUMENT
                      ========================================= */}

                      <td
                        data-label="Instrument"
                        className="stock-name"
                      >
                        {stock.name}
                      </td>


                      {/* =========================================
                          QUANTITY
                      ========================================= */}

                      <td data-label="Qty.">
                        {qty}
                      </td>


                      {/* =========================================
                          AVG
                      ========================================= */}

                      <td data-label="Avg.">
                        {formatPrice(avg)}
                      </td>


                      {/* =========================================
                          LTP
                      ========================================= */}

                      <td data-label="LTP">
                        {formatPrice(price)}
                      </td>


                      {/* =========================================
                          P&L
                      ========================================= */}

                      <td
                        data-label="P&L"
                        className={`pnl ${
                          isProfit
                            ? "profit"
                            : "loss"
                        }`}
                      >
                        {isProfit ? "+" : ""}
                        {formatPrice(pnlVal)}
                      </td>


                      {/* =========================================
                          CHANGE
                      ========================================= */}

                      <td
                        data-label="Chg."
                        className={`chg ${
                          isChangePositive
                            ? "profit"
                            : "loss"
                        }`}
                      >
                        {formatPercent(
                          dayPercent
                        )}
                      </td>

                    </tr>
                  );
                }
              )

            )}

          </tbody>

        </table>

      </div>

    </div>
  );
};

export default Positions;