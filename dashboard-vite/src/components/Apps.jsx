import React from "react";

import {
  AnalyticsOutlined,
  AutoGraphOutlined,
  AssessmentOutlined,
  CalculateOutlined,
  CodeOutlined,
  DescriptionOutlined,
  NotificationsNoneOutlined,
  ShowChartOutlined,
} from "@mui/icons-material";

import "./Apps.css";

const apps = [
  {
    title: "Market Analytics",
    description:
      "Explore market trends, price movement, and portfolio performance.",
    icon: AnalyticsOutlined,
    tag: "Analytics",
    primary: true,
  },
  {
    title: "TradingView",
    description:
      "View detailed charts and study price movements with technical analysis.",
    icon: ShowChartOutlined,
    tag: "Charts",
  },
  {
    title: "Profit Calculator",
    description:
      "Estimate profit, loss, returns, and trade values before placing an order.",
    icon: CalculateOutlined,
    tag: "Tools",
  },
  {
    title: "Fundamental Analysis",
    description:
      "Review company-level information and understand your investments better.",
    icon: AssessmentOutlined,
    tag: "Research",
  },
  {
    title: "Algo Trading",
    description:
      "Build and experiment with automated trading strategies for your portfolio.",
    icon: AutoGraphOutlined,
    tag: "Advanced",
  },
  {
    title: "Developer Tools",
    description:
      "Access APIs and developer utilities for building trading applications.",
    icon: CodeOutlined,
    tag: "Developer",
  },
  {
    title: "Reports",
    description:
      "Review statements, transaction history, and downloadable account reports.",
    icon: DescriptionOutlined,
    tag: "Reports",
  },
  {
    title: "Alerts",
    description:
      "Create and manage price alerts to keep track of important market moves.",
    icon: NotificationsNoneOutlined,
    tag: "Alerts",
  },
];

const Apps = () => {
  return (
    <div className="apps-page">

      {/* =====================================================
          HEADER
      ===================================================== */}

      <div className="apps-header">
        <div>
          <h2 className="apps-title">
            Apps
          </h2>

          <p className="apps-subtitle">
            Useful tools and services for your trading journey.
          </p>
        </div>
      </div>


      {/* =====================================================
          HERO
      ===================================================== */}

      <section className="apps-hero">

        <div className="apps-hero-content">

          <span className="apps-hero-badge">
            Trading ecosystem
          </span>

          <h3>
            Everything you need,
            <br />
            in one place.
          </h3>

          <p>
            Discover analytics, charting, research,
            calculation tools, alerts, and developer
            utilities designed to support your trading workflow.
          </p>

        </div>

        <div className="apps-hero-graphic">
          <div className="hero-circle hero-circle-one" />
          <div className="hero-circle hero-circle-two" />

          <div className="hero-chart-card">
            <div className="hero-chart-header">
              <span>Portfolio</span>
              <span className="hero-profit">
                +4.82%
              </span>
            </div>

            <div className="hero-bars">
              <span />
              <span />
              <span />
              <span />
              <span />
              <span />
              <span />
            </div>
          </div>
        </div>

      </section>


      {/* =====================================================
          SECTION HEADING
      ===================================================== */}

      <div className="apps-section-header">

        <div>
          <h3>
            Explore tools
          </h3>

          <p>
            Choose a tool to improve your trading workflow.
          </p>
        </div>

        <span className="apps-count">
          {apps.length} tools
        </span>

      </div>


      {/* =====================================================
          APP GRID
      ===================================================== */}

      <div className="apps-grid">

        {apps.map((app) => {

          const Icon = app.icon;

          return (
            <article
              className={`app-card ${
                app.primary
                  ? "app-card-primary"
                  : ""
              }`}
              key={app.title}
            >

              <div className="app-card-top">

                <div
                  className={`app-icon ${
                    app.primary
                      ? "app-icon-primary"
                      : ""
                  }`}
                >
                  <Icon />
                </div>

                <span className="app-tag">
                  {app.tag}
                </span>

              </div>


              <div className="app-card-content">

                <h4>
                  {app.title}
                </h4>

                <p>
                  {app.description}
                </p>

              </div>


              <button
                type="button"
                className="app-open-button"
              >
                Open
                <span>→</span>
              </button>

            </article>
          );
        })}

      </div>


      {/* =====================================================
          FOOTER NOTE
      ===================================================== */}

      <div className="apps-footer">

        <span className="apps-footer-dot" />

        <p>
          More integrations and trading tools can be
          added as your platform grows.
        </p>

      </div>

    </div>
  );
};

export default Apps;