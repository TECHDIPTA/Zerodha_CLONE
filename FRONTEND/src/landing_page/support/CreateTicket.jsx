import React from "react";
import {
  FaPlusCircle,
  FaUserCircle,
  FaChartLine,
  FaRupeeSign,
  FaDesktop,
  FaCoins,
} from "react-icons/fa";

const supportCategories = [
  {
    id: "accountOpening",
    title: "Account Opening",
    icon: FaPlusCircle,
    items: [
      "Resident Individual Account",
      "Minor Account",
      "NRI Account",
      "Corporate Account",
    ],
  },
  {
    id: "zerodhaAccount",
    title: "Your Zerodha Account",
    icon: FaUserCircle,
    items: [
      "Profile & KYC",
      "Bank Account Details",
      "Nomination",
      "Account Modification",
    ],
  },
  {
    id: "kite",
    title: "Kite",
    icon: FaChartLine,
    items: [
      "Orders & Trades",
      "Charts & Indicators",
      "Watchlists",
      "Positions & Holdings",
    ],
  },
  {
    id: "funds",
    title: "Funds",
    icon: FaRupeeSign,
    items: [
      "Add Funds",
      "Withdraw Funds",
      "Fund Transfer Issues",
      "Margin Information",
    ],
  },
  {
    id: "console",
    title: "Console",
    icon: FaDesktop,
    items: [
      "Portfolio",
      "Tax P&L",
      "Corporate Actions",
      "Reports",
      "Ledger",
      "Fund Statement",
    ],
  },
  {
    id: "coin",
    title: "Coin",
    icon: FaCoins,
    items: [
      "Mutual Fund Investments",
      "SIP Setup",
      "Redemption",
      "Portfolio Tracking",
      "Mandate Issues",
    ],
  },
];

function CreateTicket({ search = "", setSearch }) {
  const matches = (title, items) => {
    if (!search.trim()) return true;
    const keyword = search.toLowerCase().trim();
    return (
      title.toLowerCase().includes(keyword) ||
      items.some((item) => item.toLowerCase().includes(keyword))
    );
  };

  const getFilteredItems = (title, items) => {
    if (!search.trim()) return items;
    const keyword = search.toLowerCase().trim();

    if (title.toLowerCase().includes(keyword)) {
      return items;
    }

    return items.filter((item) => item.toLowerCase().includes(keyword));
  };

  const hasMatches = supportCategories.some((cat) =>
    matches(cat.title, cat.items)
  );

  return (
    /* Reduced vertical padding (pt-3 pb-1 when no matches, py-5 normally) */
    <section className={hasMatches ? "py-5" : "pt-3 pb-1"}>
      <div className="container">
        <div className="row">
          {/* Main Content Column */}
          <div className={hasMatches ? "col-lg-8" : "col-12"}>
            {hasMatches ? (
              <div className="accordion" id="supportAccordion">
                {supportCategories.map((category) => {
                  if (!matches(category.title, category.items)) return null;

                  const IconComponent = category.icon;
                  const visibleItems = getFilteredItems(
                    category.title,
                    category.items
                  );
                  const isSearching = Boolean(search.trim());

                  return (
                    <div
                      key={category.id}
                      className="accordion-item mb-3 border rounded shadow-sm overflow-hidden"
                    >
                      <h2 className="accordion-header">
                        <button
                          className={`accordion-button ${
                            isSearching ? "" : "collapsed"
                          }`}
                          type="button"
                          data-bs-toggle="collapse"
                          data-bs-target={`#${category.id}`}
                          aria-expanded={isSearching}
                        >
                          <IconComponent className="me-3 text-primary fs-5" />
                          <span className="fw-medium text-dark">
                            {category.title}
                          </span>
                        </button>
                      </h2>

                      <div
                        id={category.id}
                        className={`accordion-collapse collapse ${
                          isSearching ? "show" : ""
                        }`}
                        data-bs-parent="#supportAccordion"
                      >
                        <div className="accordion-body bg-white">
                          <ul className="mb-0 ps-3">
                            {visibleItems.map((item, index) => (
                              <li key={index} className="py-1">
                                <a
                                  href={`#${item
                                    .toLowerCase()
                                    .replace(/\s+/g, "-")}`}
                                  className="text-decoration-none text-secondary"
                                  onClick={(e) => {
                                    e.preventDefault();
                                    console.log("Clicked topic:", item);
                                  }}
                                >
                                  {item}
                                </a>
                              </li>
                            ))}
                          </ul>
                        </div>
                      </div>
                    </div>
                  );
                })}
              </div>
            ) : (
              /* Compact "No Results" container to minimize gap to footer */
              <div className="pt-2 pb-0 mb-0">
                <h3 className="fw-normal text-dark">
                  Search results for <span className="fw-semibold">"{search}"</span>
                </h3>
                
              </div>
            )}
          </div>

          {/* Right Sidebar (Featured Updates & Quick Links) */}
          {hasMatches && (
            <div className="col-lg-4 mt-4 mt-lg-0">
              {/* Featured Updates Banner */}
              <div
                className="p-4 mb-4 rounded shadow-sm"
                style={{
                  backgroundColor: "#FFF8E8",
                  borderLeft: "5px solid #F99D1C",
                }}
              >
                <ul className="mb-0 ps-3">
                  <li className="mb-3">
                    <a
                      href="#update1"
                      className="text-decoration-none text-primary fw-medium"
                    >
                      [Resolved] Issue with price updates and order placement on BSE
                    </a>
                  </li>
                  <li>
                    <a
                      href="#update2"
                      className="text-decoration-none text-primary fw-medium"
                    >
                      Latest Intraday leverages and Square-off timings
                    </a>
                  </li>
                </ul>
              </div>

              {/* Quick Links Section */}
              <div className="border rounded shadow-sm bg-white overflow-hidden">
                <div className="p-3 fw-semibold border-bottom bg-light text-dark">
                  Quick links
                </div>
                <ol className="p-4 mb-0 ps-4 text-primary">
                  <li className="mb-3">
                    <a href="#track-account" className="text-decoration-none">
                      Track account opening
                    </a>
                  </li>
                  <li className="mb-3">
                    <a href="#track-segment" className="text-decoration-none">
                      Track segment activation
                    </a>
                  </li>
                  <li>
                    <a href="#margins" className="text-decoration-none">
                      Intraday margins
                    </a>
                  </li>
                </ol>
              </div>
            </div>
          )}
        </div>
      </div>
    </section>
  );
}

export default CreateTicket;