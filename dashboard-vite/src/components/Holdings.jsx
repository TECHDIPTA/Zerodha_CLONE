import "./Holdings.css";
import { VerticalGraph } from "./VerticalGraph";

const formatPercent = (value) => {
  const number = Number(value);

  if (!Number.isFinite(number)) {
    return "0.00%";
  }

  return `${number >= 0 ? "+" : ""}${number.toFixed(2)}%`;
};

const getPercentClass = (value) => {
  return Number(value) >= 0 ? "profit" : "loss";
};

const Holdings = ({
  holdingsData = [],
}) => {

  /* =========================================================
     TOTAL INVESTMENT
  ========================================================= */

  const totalInvestment =
    holdingsData.reduce(
      (sum, stock) =>
        sum +
        (Number(stock.avg) || 0) *
          (Number(stock.qty) || 0),
      0
    );


  /* =========================================================
     CURRENT VALUE
  ========================================================= */

  const currentValue =
    holdingsData.reduce(
      (sum, stock) =>
        sum +
        (Number(stock.price) || 0) *
          (Number(stock.qty) || 0),
      0
    );


  /* =========================================================
     TOTAL P&L
  ========================================================= */

  const totalPnL =
    currentValue -
    totalInvestment;


  /* =========================================================
     TOTAL P&L %
  ========================================================= */

  const totalPnLPercent =
    totalInvestment > 0
      ? (totalPnL / totalInvestment) * 100
      : 0;


  /* =========================================================
     CHART DATA
  ========================================================= */

  const labels =
    holdingsData.map(
      (stock) => stock.name
    );

  const data = {
    labels,

    datasets: [
      {
        label: "Stock value",

        data:
          holdingsData.map(
            (stock) =>
              (Number(stock.price) || 0) *
              (Number(stock.qty) || 0)
          ),

        backgroundColor:
          "rgba(97, 81, 156, 0.5)",

        borderWidth: 0,
      },
    ],
  };


  return (
    <div className="holdings-container">

      {/* ===================================================
          TITLE
      =================================================== */}

      <h3 className="holdings-title">
        Holdings ({holdingsData.length})
      </h3>


      {/* ===================================================
          HOLDINGS TABLE
      =================================================== */}

      <div className="order-table-wrapper">

        <table className="holdings-table">

          <thead>

            <tr>

              <th>
                Instrument
              </th>

              <th>
                Qty.
              </th>

              <th>
                Avg. cost
              </th>

              <th>
                LTP
              </th>

              <th>
                Cur. val
              </th>

              <th>
                P&amp;L
              </th>

              <th>
                Net chg.
              </th>

              <th>
                Day chg.
              </th>

            </tr>

          </thead>


          <tbody>

            {holdingsData.map(
              (stock) => {

                const qty =
                  Number(stock.qty) || 0;

                const avg =
                  Number(stock.avg) || 0;

                const price =
                  Number(stock.price) || 0;


                /* -----------------------------------------
                   CURRENT VALUE
                ----------------------------------------- */

                const curValue =
                  price * qty;


                /* -----------------------------------------
                   P&L
                ----------------------------------------- */

                const pnl =
                  curValue -
                  avg * qty;


                const isProfit =
                  pnl >= 0;


                /* -----------------------------------------
                   NET CHANGE

                   Current price vs average purchase price
                ----------------------------------------- */

                const netChange =
                  avg > 0
                    ? ((price - avg) / avg) *
                      100
                    : 0;


                /* -----------------------------------------
                   DAY CHANGE

                   Use previousClose if available.

                   For demo data, Dashboard will maintain
                   this reference price dynamically.
                ----------------------------------------- */

                const previousClose =
                  Number(
                    stock.previousClose
                  ) || avg;


                const dayChange =
                  previousClose > 0
                    ? (
                        (price -
                          previousClose) /
                        previousClose
                      ) *
                      100
                    : 0;


                return (
                  <tr
                    key={
                      stock._id ||
                      stock.name
                    }
                  >

                    {/* =====================================
                        INSTRUMENT
                    ===================================== */}

                    <td
                      className="
                        instrument-cell
                        stock-name
                      "
                    >
                      {stock.name}
                    </td>


                    {/* =====================================
                        QUANTITY
                    ===================================== */}

                    <td data-label="Qty.">
                      {qty}
                    </td>


                    {/* =====================================
                        AVG COST
                    ===================================== */}

                    <td data-label="Avg. cost">
                      {avg.toFixed(2)}
                    </td>


                    {/* =====================================
                        LTP
                    ===================================== */}

                    <td data-label="LTP">
                      {price.toFixed(2)}
                    </td>


                    {/* =====================================
                        CURRENT VALUE
                    ===================================== */}

                    <td data-label="Cur. val">
                      {curValue.toFixed(2)}
                    </td>


                    {/* =====================================
                        P&L
                    ===================================== */}

                    <td
                      data-label="P&L"
                      className={
                        isProfit
                          ? "profit"
                          : "loss"
                      }
                    >
                      {isProfit
                        ? "+"
                        : ""}

                      {pnl.toFixed(2)}
                    </td>


                    {/* =====================================
                        NET CHANGE
                    ===================================== */}

                    <td
                      data-label="Net chg."
                      className={
                        getPercentClass(
                          netChange
                        )
                      }
                    >
                      {formatPercent(
                        netChange
                      )}
                    </td>


                    {/* =====================================
                        DAY CHANGE
                    ===================================== */}

                    <td
                      data-label="Day chg."
                      className={
                        getPercentClass(
                          dayChange
                        )
                      }
                    >
                      {formatPercent(
                        dayChange
                      )}
                    </td>

                  </tr>
                );
              }
            )}

          </tbody>

        </table>

      </div>


      {/* ===================================================
          SUMMARY
      =================================================== */}

      <div className="summary-card">

        {/* TOTAL INVESTMENT */}

        <div className="summary-col">

          <p className="summary-value">

            {totalInvestment.toFixed(
              2
            )}

          </p>

          <p className="summary-label">
            Total investment
          </p>

        </div>


        {/* CURRENT VALUE */}

        <div className="summary-col">

          <p className="summary-value">

            {currentValue.toFixed(
              2
            )}

          </p>

          <p className="summary-label">
            Current value
          </p>

        </div>


        {/* TOTAL P&L */}

        <div className="summary-col">

          <p
            className={`summary-value ${
              totalPnL >= 0
                ? "profit"
                : "loss"
            }`}
          >
            {totalPnL >= 0
              ? "+"
              : ""}

            {totalPnL.toFixed(2)}

            {" ("}

            {formatPercent(
              totalPnLPercent
            )}

            {")"}
          </p>

          <p className="summary-label">
            P&amp;L
          </p>

        </div>

      </div>


      {/* ===================================================
          GRAPH

          Wrapper is intentionally present so the graph
          starts at the exact same left boundary as the
          Holdings table.
      =================================================== */}

      <div className="holdings-graph">

        <VerticalGraph
          data={data}
        />

      </div>

    </div>
  );
};

export default Holdings;