import { useState } from "react";

function Brokerage() {
  const [activeTab, setActiveTab] = useState("equity");
  const equityData = [
    {
      charge: "Brokerage",
      delivery: "Zero Brokerage",
      intraday: "0.03% or ₹20/executed order whichever is lower",
      futures: "0.03% or ₹20/executed order whichever is lower",
      options: "Flat ₹20 per executed order",
    },
    {
      charge: "STT / CTT",
      delivery: "0.1% on buy & sell",
      intraday: "0.025% on sell side",
      futures: "0.02% on sell side",
      options:
        "0.125% of intrinsic value on exercised options & 0.1% on sell side (premium)",
    },
    {
      charge: "Transaction Charges",
      delivery: "NSE: 0.00297% | BSE: 0.00375%",
      intraday: "NSE: 0.00297% | BSE: 0.00375%",
      futures: "NSE: 0.00173% | BSE: 0%",
      options: "NSE: 0.03503% | BSE: 0.0205%",
    },
    {
      charge: "GST",
      delivery: "18% on Brokerage + Transaction + SEBI charges",
      intraday: "18% on Brokerage + Transaction + SEBI charges",
      futures: "18% on Brokerage + Transaction + SEBI charges",
      options: "18% on Brokerage + Transaction + SEBI charges",
    },
    {
      charge: "SEBI Charges",
      delivery: "₹10 / Crore",
      intraday: "₹10 / Crore",
      futures: "₹10 / Crore",
      options: "₹10 / Crore",
    },
    {
      charge: "Stamp Charges",
      delivery: "0.015% (Buy Side)",
      intraday: "0.003% (Buy Side)",
      futures: "0.002% (Buy Side)",
      options: "0.003% (Buy Side)",
    },
  ];


const currencyData = [
  {
    charge: "Brokerage",
    futures: "0.03% or ₹20/executed order whichever is lower",
    options: "₹20/executed order",
  },
  {
    charge: "STT / CTT",
    futures: "No STT",
    options: "No STT",
  },
  {
    charge: "Transaction Charges",
    futures: "NSE: 0.00035%",
    options: "NSE: 0.0311% (Premium)",
  },
  {
    charge: "GST",
    futures: "18% on (Brokerage + SEBI + Transaction charges)",
    options: "18% on (Brokerage + SEBI + Transaction charges)",
  },
  {
    charge: "SEBI Charges",
    futures: "₹10 / Crore",
    options: "₹10 / Crore",
  },
  {
    charge: "Stamp Charges",
    futures: "0.0001% (Buy Side)",
    options: "0.0001% (Buy Side)",
  },
];
const commodityData = [
  {
    charge: "Brokerage",
    futures: "0.03% or ₹20/executed order whichever is lower",
    options: "₹20/executed order",
  },
  {
    charge: "CTT",
    futures: "0.01% on sell side (Non-Agri)",
    options: "0.05% on sell side",
  },
  {
    charge: "Transaction Charges",
    futures: "MCX: 0.0021%",
    options: "MCX: 0.0418%",
  },
  {
    charge: "GST",
    futures: "18% on (Brokerage + SEBI + Transaction charges)",
    options: "18% on (Brokerage + SEBI + Transaction charges)",
  },
  {
    charge: "SEBI Charges",
    futures: "₹10 / Crore",
    options: "₹10 / Crore",
  },
  {
    charge: "Stamp Charges",
    futures: "0.002% (Buy Side)",
    options: "0.003% (Buy Side)",
  },
];
  const tableData =
    activeTab === "equity"
      ? equityData
      : activeTab === "currency"
      ? currencyData
      : commodityData;

  return (
    <div className="container py-5">

      {/* Tabs */}
      <ul className="nav border-bottom mb-2">
        <li className="nav-item">
          <button
            className={`nav-link ${
              activeTab === "equity"
                ? "text-primary border-bottom border-2 border-primary fw-bold"
                : "text-secondary"
            }`}
            onClick={() => setActiveTab("equity")}
          >
            Equity
          </button>
        </li>

        <li className="nav-item">
          <button
            className={`nav-link ${
              activeTab === "currency"
                ? "text-primary border-bottom border-2 border-primary fw-bold"
                : "text-secondary"
            }`}
            onClick={() => setActiveTab("currency")}
          >
            Currency
          </button>
        </li>

        <li className="nav-item">
          <button
            className={`nav-link ${
              activeTab === "commodity"
                ? "text-primary border-bottom border-2 border-primary fw-bold"
                : "text-secondary"
            }`}
            onClick={() => setActiveTab("commodity")}
          >
            Commodity
          </button>
        </li>
      </ul>

      {/* Table */}
      <div className="table-responsive">
        <table className="table table-bordered align-middle text-center"
        style={{
            fontSize: "0.85rem",
            tableLayout: "fixed",
            width: "100%",
        }}
>

          <thead className="table-light text-center">
            <tr>
              <th style={{
        whiteSpace: "normal",
        wordBreak: "break-word",
        padding: "10px 6px",
    }}>Charges</th>

              {activeTab === "equity" && (
                <>
                  <th style={{
        whiteSpace: "normal",
        wordBreak: "break-word",
        padding: "10px 6px",
    }}>Equity Delivery</th>
                  <th style={{
        whiteSpace: "normal",
        wordBreak: "break-word",
        padding: "10px 6px",
    }}>Equity Intraday</th>
                  <th style={{
        whiteSpace: "normal",
        wordBreak: "break-word",
        padding: "10px 6px",
    }}>F&O Futures</th>
                  <th style={{
        whiteSpace: "normal",
        wordBreak: "break-word",
        padding: "10px 6px",
    }}>F&O Options</th>
                </>
              )}

              {activeTab === "currency" && (
                <>
                  <th style={{
        whiteSpace: "normal",
        wordBreak: "break-word",
        padding: "10px 6px",
    }}>Currency Futures</th>
                  <th style={{
        whiteSpace: "normal",
        wordBreak: "break-word",
        padding: "10px 6px",
    }}>Currency Options</th>
                </>
              )}

              {activeTab === "commodity" && (
                <>
                  <th style={{
        whiteSpace: "normal",
        wordBreak: "break-word",
        padding: "10px 6px",
    }}>Commodity Futures</th>
                  <th style={{
        whiteSpace: "normal",
        wordBreak: "break-word",
        padding: "10px 6px",
    }}>Commodity Options</th>
                </>
              )}
            </tr>
          </thead>

          <tbody>

            {tableData.map((row, index) => (
              <tr key={index}>
                <th style={{
        whiteSpace: "normal",
        wordBreak: "break-word",
        padding: "10px 6px",
    }}>{row.charge}</th>

                {activeTab === "equity" && (
                  <>
                    <td style={{
        whiteSpace: "normal",
        wordBreak: "break-word",
        padding: "10px 6px",
    }}>{row.delivery}</td>
                    <td style={{
        whiteSpace: "normal",
        wordBreak: "break-word",
        padding: "10px 6px",
    }}>{row.intraday}</td>
                    <td style={{
        whiteSpace: "normal",
        wordBreak: "break-word",
        padding: "10px 6px",
    }}>{row.futures}</td>
                    <td style={{
        whiteSpace: "normal",
        wordBreak: "break-word",
        padding: "10px 6px",
    }}>{row.options}</td>
                  </>
                )}

                {activeTab === "currency" && (
                  <>
                    <td style={{
        whiteSpace: "normal",
        wordBreak: "break-word",
        padding: "10px 6px",
    }}>{row.futures}</td>
                    <td style={{
        whiteSpace: "normal",
        wordBreak: "break-word",
        padding: "10px 6px",
    }}>{row.options}</td>
                  </>
                )}

                {activeTab === "commodity" && (
                  <>
                    <td style={{
        whiteSpace: "normal",
        wordBreak: "break-word",
        padding: "10px 6px",
    }}>{row.futures}</td>
                    <td style={{
        whiteSpace: "normal",
        wordBreak: "break-word",
        padding: "10px 6px",
    }}>{row.options}</td>
                  </>
                )}

              </tr>
            ))}

          </tbody>

        </table>
      </div>
    {/* ========================= ACCOUNT OPENING ========================= */}
<div className="container mb-2 text-center">
    <div className="row ">
       <span className="fs-5"> <a href="" className="text-primary text-decoration-none">Calculate your costs upfront</a> &nbsp;using our brokerage calculator </span>
    </div>
</div>
<section className="container py-5">

    <div className="row gx-0 mb-2">
        <div className="col-lg-8">
            <h2
                className="fw-semibold mb-2"
                style={{ color: "#424242" }}
            >
                Charges for account opening
            </h2>

            <p
                style={{
                    color: "#666",
                    lineHeight: "30px",
                    fontSize: "16px",
                }}
            >
                Open your investment account with transparent pricing and
                straightforward account opening charges.
            </p>
        </div>
    </div>

    <div className="table-responsive shadow-sm rounded-3">

        <table className="table   align-middle mb-0" style={{     border: "1px solid #dee2e6",
}}>

            <thead
                style={{
                    backgroundColor: "#fafafa",
                }}
            >
                <tr>

                    <th
                        style={{
                            color: "#424242",
                            padding: "18px",
                        }}
                    >
                        Type of Account
                    </th>

                    <th
                        style={{
                            color: "#424242",
                            padding: "18px",
                        }}
                    >
                        Charges
                    </th>

                </tr>
            </thead>

            <tbody>

                <tr>
                    <td className="p-3">Individual Account</td>
<td className="p-3">
    <span
        style={{
 display: "inline-block",
            backgroundColor: "#4CAF50",
            color: "#fff",
            padding: "3px 8px",
            fontSize: "14px",
            fontWeight: "500"
        }}
    >
        FREE
    </span>
</td>                </tr>

                <tr>
                    <td className="p-3">Minor Account</td>
<td className="p-3">
    <span
        style={{
             display: "inline-block",
            backgroundColor: "#4CAF50",
            color: "#fff",
            padding: "3px 8px",
            fontSize: "14px",
            fontWeight: "500"
        }}
    >
        FREE
    </span>
</td>                </tr>

                <tr>
                    <td className="p-3">NRI Account</td>
                    <td className="fw-semibold p-3">₹500</td>
                </tr>

                <tr>
                    <td className="p-3">HUF Account</td>
                    <td className="p-3">
                      <span
        style={{
            display: "inline-block",
            backgroundColor: "#4CAF50",
            color: "#fff",
            padding: "3px 8px",
            fontSize: "14px",
            fontWeight: "500"
        }}
    >FREE</span> &nbsp;
                         (Online) / <strong>₹500</strong> (Offline)
                    </td>
                </tr>

                <tr>
                    <td className="p-3">
                        Partnership, LLP & Corporate
                    </td>

                    <td className="fw-semibold p-3">
                        ₹500 (Offline only)
                    </td>

                </tr>

            </tbody>

        </table>

    </div>

</section>



{/* ========================= DEMAT AMC ========================= */}
<section className="container py-4">
        <h1 className="mb-4 fs-3">Demat AMC (Annual Maintenance Charge)</h1>

  <div
    style={{
      background: "#fff",
      borderLeft: "5px solid #387ed1",
      padding: "8px 12px",
      boxShadow: "0 4px 18px rgba(56,126,209,0.12)",
      width: "220px",
    }}
  >
    <h6
      className="fw-semibold mb-1"
      style={{
        color: "#387ed1",
        fontSize: ".9rem",
      }}
    >
      Free for the first year*
    </h6>
  </div>

  <p
    className="mt-3"
    style={{
      color: "#666",
      fontSize: "14px",
      lineHeight: "28px",
    }}
  >
    From second year onwards, for BSDA accounts:
  </p>

  <table className="table  mt-3" style={{ border: "1px solid #dee2e6" }}>
    <thead>
      <tr>
        <th>Value of holdings</th>
        <th>AMC</th>
      </tr>
    </thead>
    <tbody>
      <tr>
        <td>Up to ₹4 lakh</td>
        <td><span
        style={{
 display: "inline-block",
            backgroundColor: "#4CAF50",
            color: "#fff",
            padding: "3px 8px",
            fontSize: "14px",
            fontWeight: "500"
        }}
    >
        FREE
    </span></td>
      </tr>
      <tr>
        <td>₹4 lakh – ₹10 lakh</td>
        <td>₹100 per year + 18% GST, charged quarterly</td>
      </tr>
      <tr>
        <td>Above ₹10 lakh</td>
        <td>₹300 per year + 18% GST, charged quarterly</td>
      </tr>
    </tbody>
  </table>

  <p
    style={{
      color: "#666",
      fontSize: "14px",
      lineHeight: "28px",
    }}
  >
    For a non-BSDA account, AMC is ₹300 per year + 18% GST,
    regardless of holdings value, charged quarterly.
  </p>

  <p
    style={{
      color: "#666",
      fontSize: "14px",
      lineHeight: "28px",
    }}
  >
    To learn more about BSDA <a href="#" className="text-decoration-none text-primary">click here</a>. To learn more about AMC ,
    <a href="#" className="text-decoration-none text-primary">
      click here
    </a>
  </p>

  <p
    style={{
      color: "#666",
      fontSize: "13px",
    }}
  >
    *Resident individual accounts only.
  </p>
</section>
{/* ========================= OPTIONAL VALUE ADDED SERVICES ========================= */}

<section className="container py-2">

    <div className="row mb-2">

        <div className="col-lg-8">

            <h2
                className="fw-semibold mb-2"
                style={{ color: "#424242" }}
            >
                Optional value added services
            </h2>

            <p
                style={{
                    color: "#666",
                    lineHeight: "30px",
                    fontSize: "16px",
                }}
            >
                Enhance your investing experience with optional third-party
                tools and premium services.
            </p>

        </div>

    </div>

    <div className="table-responsive shadow-sm rounded-3" style={{     border: "1px solid #dee2e6",
}}>

        <table className="table  align-middle mb-0">

            <thead style={{ background: "#fafafa" }}>

                <tr>

                    <th className="p-3">Service</th>

                    <th className="p-3">Billing Frequency</th>

                    <th className="p-3">Charges</th>

                </tr>

            </thead>

            <tbody>

                <tr>

                    <td className="p-3 fw-semibold">
                        Tickertape
                    </td>

                    <td className="p-3">
                        Monthly / Quarterly / Annual
                    </td>

                    <td className="p-3">
                        Free : ₹0 <br />
                        Pro : ₹249 / ₹699 / ₹2399
                    </td>

                </tr>

                <tr>

                    <td className="p-3 fw-semibold">
                        Smallcase
                    </td>

                    <td className="p-3">
                        Per transaction
                    </td>

                    <td className="p-3">
                        Buy & Invest More : ₹100
                        <br />
                        SIP : ₹10
                    </td>

                </tr>

                <tr>

                    <td className="p-3 fw-semibold">
                        Kite Connect
                    </td>

                    <td className="p-3">
                        Monthly
                    </td>

                    <td className="p-3">
                        Connect : ₹500
                        <br />
                        Personal : Free
                    </td>

                </tr>

            </tbody>

        </table>

    </div>

</section>



{/* ========================= CHARGES EXPLAINED ========================= */}
<section className="container py-5">

    <h2
        className="fw-semibold mb-5"
        style={{
            fontSize: "2rem",
            color: "#424242",
        }}
    >
        Charges explained
    </h2>

    <div className="row g-5">

        {/* ================= LEFT COLUMN ================= */}

        <div className="col-lg-6">

            {/* Securities / Commodities transaction tax */}

            <div className="mb-5">

                <h5
                    className="fw-semibold"
                    style={{
                        fontSize: "1rem",
                        color: "#424242",
                    }}
                >
                    Securities / Commodities transaction tax
                </h5>

                <p className="text-muted" style={{ fontSize: ".9rem", lineHeight: "1.8" }}>
                    Tax by the government when transacting on the exchanges.
                    Charged on both buy and sell sides for equity delivery and
                    only on the sell side for intraday and F&O trades.
                </p>

                <p className="text-muted mb-0" style={{ fontSize: ".9rem", lineHeight: "1.8" }}>
                    When trading at Zerodha, STT/CTT can often be much higher
                    than the brokerage charged.
                </p>

            </div>

            {/* Transaction Charges */}

            <div className="mb-3">

                <h5
                    className="fw-semibold"
                    style={{
                        fontSize: "1rem",
                        color: "#424242",
                    }}
                >
                    Transaction / Turnover Charges
                </h5>

                <p className="text-muted" style={{ fontSize: ".9rem", lineHeight: "1.8" }}>
                    Charged by exchanges such as NSE, BSE and MCX on the value
                    of every transaction executed.
                </p>

                <ul className="text-muted small" style={{ lineHeight: "1.9" }}>
                    <li>BSE XC, XD, XT, Z & ZP groups – ₹10,000 per crore.</li>
                    <li>BSE SS & ST groups – ₹1,00,000 per crore.</li>
                    <li>BSE Group A, B & non-exclusive scrips – ₹375 per crore.</li>
                    <li>BSE M, MT, TS & MS groups – ₹275 per crore.</li>
                </ul>

            </div>

            {/* Call & Trade */}

            <div className="mb-3">

                <h5
                    className="fw-semibold"
                    style={{
                        fontSize: "1rem",
                        color: "#424242",
                    }}
                >
                    Call & Trade
                </h5>

                <p className="text-muted" style={{ fontSize: ".9rem", lineHeight: "1.8" }}>
                    ₹50 per executed order for orders placed through a dealer,
                    including auto square-off orders.
                </p>

            </div>

            {/* Stamp Charges */}

            <div className="mb-3">

                <h5
                    className="fw-semibold"
                    style={{
                        fontSize: "1rem",
                        color: "#424242",
                    }}
                >
                    Stamp Charges
                </h5>

                <p className="text-muted" style={{ fontSize: ".9rem", lineHeight: "1.8" }}>
                    Stamp duty charged by the Government of India as per the
                    Indian Stamp Act, 1899, for transactions on stock
                    exchanges and depositories.
                </p>

            </div>

            {/* NRI Brokerage */}

            <div className="mb-3">

                <h5
                    className="fw-semibold"
                    style={{
                        fontSize: "1rem",
                        color: "#424242",
                    }}
                >
                    NRI Brokerage Charges
                </h5>

                <ul className="text-muted small" style={{ lineHeight: "1.9" }}>
                    <li>Non-PIS: 0.5% or ₹50/order (whichever is lower).</li>
                    <li>PIS: 0.5% or ₹200/order (whichever is lower).</li>
                    <li>AMC: ₹500 + GST per year.</li>
                </ul>

            </div>

            {/* Debit Balance */}

            <div className="mb-3">

                <h5
                    className="fw-semibold"
                    style={{
                        fontSize: "1rem",
                        color: "#424242",
                    }}
                >
                    Account with Debit Balance
                </h5>

                <p className="text-muted" style={{ fontSize: ".9rem", lineHeight: "1.8" }}>
                    Orders placed while the trading account has a debit balance
                    are charged ₹40 per executed order instead of ₹20.
                </p>

            </div>

            {/* IPFT */}

            <div className="mb-3">

                <h5
                    className="fw-semibold"
                    style={{
                        fontSize: "1rem",
                        color: "#424242",
                    }}
                >
                    IPFT Charges by NSE
                </h5>

                <ul className="text-muted small" style={{ lineHeight: "1.9" }}>
                    <li>Equity & Futures – ₹0.01 per crore + GST.</li>
                    <li>Options – ₹0.01 per crore + GST on premium.</li>
                    <li>Currency Futures – ₹0.05 per lakh + GST.</li>
                    <li>Currency Options – ₹2 per lakh + GST on premium.</li>
                </ul>

            </div>

            {/* MTF */}

            <div className="mb-3">

                <h5
                    className="fw-semibold"
                    style={{
                        fontSize: "1rem",
                        color: "#424242",
                    }}
                >
                    Margin Trading Facility (MTF)
                </h5>

                <ul className="text-muted small" style={{ lineHeight: "1.9" }}>
                    <li>Interest: 0.04% per day (₹40 per lakh).</li>
                    <li>Brokerage: 0.3% or ₹20/order.</li>
                    <li>Pledge charge: ₹15 + GST per ISIN.</li>
                </ul>

            </div>

        </div>
                {/* ================= RIGHT COLUMN ================= */}

        <div className="col-lg-6">

            {/* GST */}

            <div className="mb-2">

                <h5
                    className="fw-semibold"
                    style={{
                        fontSize: "1rem",
                        color: "#424242",
                    }}
                >
                    GST
                </h5>

                <p
                    className="text-muted"
                    style={{
                        fontSize: ".9rem",
                        lineHeight: "1.8",
                    }}
                >
                    Tax levied by the Government on services rendered.
                    Applicable at <strong>18%</strong> of
                    (Brokerage + SEBI Charges + Transaction Charges).
                </p>

            </div>

            {/* SEBI Charges */}

            <div className="mb-2">

                <h5
                    className="fw-semibold"
                    style={{
                        fontSize: "1rem",
                        color: "#424242",
                    }}
                >
                    SEBI Charges
                </h5>

                <p
                    className="text-muted"
                    style={{
                        fontSize: ".9rem",
                        lineHeight: "1.8",
                    }}
                >
                    Charged at <strong>₹10 per crore + GST</strong> by SEBI
                    for regulating the securities market.
                </p>

            </div>

            {/* DP Charges */}

            <div className="mb-2">

                <h5
                    className="fw-semibold"
                    style={{
                        fontSize: "1rem",
                        color: "#424242",
                    }}
                >
                    DP (Depository Participant) Charges
                </h5>

                <p
                    className="text-muted"
                    style={{
                        fontSize: ".9rem",
                        lineHeight: "1.8",
                    }}
                >
                    ₹15.34 per scrip is charged whenever stocks are sold,
                    irrespective of quantity.
                </p>

                <ul className="text-muted small" style={{ lineHeight: "1.9" }}>
                    <li>₹3.50 CDSL Fee</li>
                    <li>₹9.50 Zerodha Fee</li>
                    <li>₹2.34 GST</li>
                    <li>Discounts available for female account holders and mutual fund/bond debits.</li>
                </ul>

            </div>

            {/* Pledging */}

            <div className="mb-2">

                <h5
                    className="fw-semibold"
                    style={{
                        fontSize: "1rem",
                        color: "#424242",
                    }}
                >
                    Pledging Charges
                </h5>

                <p
                    className="text-muted"
                    style={{
                        fontSize: ".9rem",
                        lineHeight: "1.8",
                    }}
                >
                    ₹30 + GST per pledge request per ISIN.
                </p>

            </div>

            {/* AMC */}

            <div className="mb-2">

                <h5
                    className="fw-semibold"
                    style={{
                        fontSize: "1rem",
                        color: "#424242",
                    }}
                >
                    AMC (Account Maintenance Charges)
                </h5>

                <ul className="text-muted small" style={{ lineHeight: "1.9" }}>
                    <li>Free for the first year on all new resident individual accounts.</li>
                    <li>BSDA: Zero charges for holdings below ₹4,00,000.</li>
                    <li>Non-BSDA: ₹300/year + 18% GST charged quarterly.</li>
                </ul>

            </div>

            {/* Corporate Action */}

            <div className="mb-2">

                <h5
                    className="fw-semibold"
                    style={{
                        fontSize: "1rem",
                        color: "#424242",
                    }}
                >
                    Corporate Action Order Charges
                </h5>

                <p
                    className="text-muted"
                    style={{
                        fontSize: ".9rem",
                        lineHeight: "1.8",
                    }}
                >
                    ₹20 + GST for OFS, Buyback, Takeover and Delisting
                    orders placed through Console.
                </p>

            </div>

            {/* Off Market */}

            <div className="mb-2">

                <h5
                    className="fw-semibold"
                    style={{
                        fontSize: "1rem",
                        color: "#424242",
                    }}
                >
                    Off-market Transfer Charges
                </h5>

                <p
                    className="text-muted"
                    style={{
                        fontSize: ".9rem",
                        lineHeight: "1.8",
                    }}
                >
                    ₹25 per transaction.
                </p>

            </div>

            {/* Physical CMR */}

            <div className="mb-2">

                <h5
                    className="fw-semibold"
                    style={{
                        fontSize: "1rem",
                        color: "#424242",
                    }}
                >
                    Physical CMR Request
                </h5>

                <p
                    className="text-muted"
                    style={{
                        fontSize: ".9rem",
                        lineHeight: "1.8",
                    }}
                >
                    First request is free. Subsequent requests are charged
                    ₹20 + ₹100 courier charges + 18% GST.
                </p>

            </div>

            {/* Payment Gateway */}

            <div className="mb-2">

                <h5
                    className="fw-semibold"
                    style={{
                        fontSize: "1rem",
                        color: "#424242",
                    }}
                >
                    Payment Gateway Charges
                </h5>

                <p
                    className="text-muted"
                    style={{
                        fontSize: ".9rem",
                        lineHeight: "1.8",
                    }}
                >
                    ₹9 + GST.
                    <br />
                    <small>(Not applicable for UPI transfers.)</small>
                </p>

            </div>

            {/* Delayed Payment */}

            <div className="mb-2">

                <h5
                    className="fw-semibold"
                    style={{
                        fontSize: "1rem",
                        color: "#424242",
                    }}
                >
                    Delayed Payment Charges
                </h5>

                <p
                    className="text-muted"
                    style={{
                        fontSize: ".9rem",
                        lineHeight: "1.8",
                    }}
                >
                    Interest is charged at
                    <strong>18% per annum</strong>
                    (0.05% per day) on debit balances in the trading account.
                </p>

            </div>

            {/* 3-in-1 */}

            <div className="mb-2">

                <h5
                    className="fw-semibold"
                    style={{
                        fontSize: "1rem",
                        color: "#424242",
                    }}
                >
                    Trading using 3-in-1 Account with Block Functionality
                </h5>

                <ul className="text-muted small" style={{ lineHeight: "1.9" }}>
                    <li>Delivery & MTF Brokerage: 0.5% per executed order.</li>
                    <li>Intraday Brokerage: 0.05% per executed order.</li>
                </ul>

            </div>

        </div>

    </div>

</section>


{/* ========================= DISCLAIMER ========================= */}


<section className="container py-3">

    <div className="row">

        <div className="col-lg-10">

            <h2
                className="fw-semibold mb-2"
                style={{
                    color: "#424242",
                    fontSize: "1rem",
                }}
            >
                Disclaimer
            </h2>

            <p
                style={{
                    fontSize: "1rem",
                        color: "#424242",
                        marginBottom: ".8rem"
                }}
            >
                Brokerage, statutory charges, taxes and exchange fees are
                applicable according to current regulations. Charges may vary
                depending on the trading segment, order type and applicable
                government guidelines.
            </p>

            <p
                style={{
                    fontSize: "1rem",
                        color: "#424242",
                        marginBottom: ".8rem"
                }}
            >
                Delivery trades, derivatives, corporate actions and other
                services may have different pricing structures. Please refer to
                the latest brokerage schedule and regulatory circulars before
                trading or investing.
            </p>

            <p
                style={{
                    fontSize: "1rem",
                        color: "#424242",
                        marginBottom: ".8rem"
                }}
            >
                All charges are subject to revision from time to time. The final
                amount charged will always be based on the prevailing exchange,
                SEBI and government regulations.
            </p>

        </div>

    </div>

</section>
</div>
  );
}

export default Brokerage;
