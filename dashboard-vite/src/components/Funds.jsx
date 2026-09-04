import React, {
  useContext,
  useState,
} from "react";

import axios from "axios";

import GeneralContext from "./GeneralContext";

import "./Funds.css";

const API_BASE_URL =
  import.meta.env?.VITE_API_URL ||
  "http://localhost:3002";

const Funds = () => {
  const {
    user,
    refreshUserData,
    showToast,
  } = useContext(GeneralContext);

  const [depositAmount, setDepositAmount] =
    useState("");

  const [isAddingFunds, setIsAddingFunds] =
    useState(false);


  /* =========================================================
     ADD FUNDS
  ========================================================= */

  const handleAddFunds = async () => {
    const amount =
      Number(depositAmount);

    if (
      !Number.isFinite(amount) ||
      amount <= 0
    ) {
      showToast(
        "Enter a valid amount",
        "error"
      );

      return;
    }

    setIsAddingFunds(true);

    try {
      const response =
        await axios.post(
          `${API_BASE_URL}/funds/add`,
          {
            amount,
          },
          {
            withCredentials: true,
          }
        );

      showToast(
        response.data?.message ||
          `₹${amount.toFixed(
            2
          )} added successfully!`,
        "success"
      );

      setDepositAmount("");

      await refreshUserData();
    } catch (error) {
      showToast(
        error.response?.data?.message ||
          "Failed to add funds",
        "error"
      );
    } finally {
      setIsAddingFunds(false);
    }
  };


  /* =========================================================
     ACCOUNT VALUES
  ========================================================= */

  const availableMargin =
    Number(user?.availableMargin) ||
    0;

  const openingBalance =
    Number(user?.openingBalance) ||
    0;

  const usedMargin = Math.max(
    0,
    openingBalance -
      availableMargin
  );


  /* =========================================================
     RENDER
  ========================================================= */

  return (
    <div className="funds-page">

      {/* =====================================================
          PAGE HEADER
      ===================================================== */}

      <div className="funds-header">

        <div>
          <h2 className="funds-title">
            Funds
          </h2>

          <p className="funds-subtitle">
            Manage your trading balance
            and available margin.
          </p>
        </div>

      </div>


      {/* =====================================================
          QUICK BALANCE CARDS
      ===================================================== */}

      <div className="funds-stats">

        <div className="fund-stat-card">

          <div className="fund-stat-label">
            Available margin
          </div>

          <div className="fund-stat-value primary">
            ₹{availableMargin.toFixed(2)}
          </div>

          <div className="fund-stat-note">
            Available for trading
          </div>

        </div>


        <div className="fund-stat-card">

          <div className="fund-stat-label">
            Used margin
          </div>

          <div className="fund-stat-value">
            ₹{usedMargin.toFixed(2)}
          </div>

          <div className="fund-stat-note">
            Currently utilized
          </div>

        </div>


        <div className="fund-stat-card">

          <div className="fund-stat-label">
            Opening balance
          </div>

          <div className="fund-stat-value">
            ₹{openingBalance.toFixed(2)}
          </div>

          <div className="fund-stat-note">
            Total funds added
          </div>

        </div>

      </div>


      {/* =====================================================
          DEPOSIT SECTION
      ===================================================== */}

      <section className="funds-section">

        <div className="section-heading">

          <div>
            <h3>
              Add funds
            </h3>

            <p>
              Add money instantly to your
              trading account.
            </p>
          </div>

        </div>


        <div className="fund-deposit-card">

          <div className="deposit-copy">

            <span className="deposit-badge">
              Instant
            </span>

            <h4>
              Add money to your account
            </h4>

            <p>
              Enter the amount you want
              to add to your available
              trading balance.
            </p>

          </div>


          <div className="deposit-form">

            <div className="deposit-input-wrapper">

              <span className="rupee-prefix">
                ₹
              </span>

              <input
                type="number"
                min="1"
                step="0.01"
                placeholder="Enter amount"
                value={depositAmount}
                onChange={(event) =>
                  setDepositAmount(
                    event.target.value
                  )
                }
                disabled={isAddingFunds}
              />

            </div>


            <button
              type="button"
              className="add-funds-button"
              onClick={
                handleAddFunds
              }
              disabled={isAddingFunds}
            >
              {isAddingFunds
                ? "Adding..."
                : "Add funds"}
            </button>

          </div>

        </div>

      </section>


      {/* =====================================================
          EQUITY
      ===================================================== */}

      <section className="funds-section">

        <div className="section-heading">

          <div>
            <h3>
              Equity
            </h3>

            <p>
              Current account margin
              and balance details.
            </p>
          </div>

        </div>


        <div className="equity-layout">

          {/* =================================================
              LEFT DETAILS
          ================================================= */}

          <div className="equity-card">

            <div className="equity-row highlight-row">

              <div className="equity-label">
                Available margin
              </div>

              <div className="equity-value primary">
                ₹{availableMargin.toFixed(2)}
              </div>

            </div>


            <div className="equity-divider" />


            <div className="equity-row">

              <div className="equity-label">
                Used margin
              </div>

              <div className="equity-value">
                ₹{usedMargin.toFixed(2)}
              </div>

            </div>


            <div className="equity-row">

              <div className="equity-label">
                Available cash
              </div>

              <div className="equity-value">
                ₹{availableMargin.toFixed(2)}
              </div>

            </div>


            <div className="equity-divider" />


            <div className="equity-row">

              <div className="equity-label">
                Opening balance
              </div>

              <div className="equity-value">
                ₹{openingBalance.toFixed(2)}
              </div>

            </div>


            <div className="equity-row">

              <div className="equity-label">
                Payin
              </div>

              <div className="equity-value">
                ₹{openingBalance.toFixed(2)}
              </div>

            </div>


            <div className="equity-divider" />


            <div className="equity-row muted-row">

              <div className="equity-label">
                SPAN
              </div>

              <div className="equity-value">
                ₹0.00
              </div>

            </div>


            <div className="equity-row muted-row">

              <div className="equity-label">
                Delivery margin
              </div>

              <div className="equity-value">
                ₹0.00
              </div>

            </div>


            <div className="equity-row muted-row">

              <div className="equity-label">
                Exposure
              </div>

              <div className="equity-value">
                ₹0.00
              </div>

            </div>


            <div className="equity-row muted-row">

              <div className="equity-label">
                Options premium
              </div>

              <div className="equity-value">
                ₹0.00
              </div>

            </div>

          </div>


          {/* =================================================
              RIGHT COMMODITY CARD
          ================================================= */}

          <div className="commodity-card">

            <div className="commodity-icon">
              ₹
            </div>

            <span className="commodity-badge">
              Commodity
            </span>

            <h4>
              Commodity account
            </h4>

            <p>
              You don't have a commodity
              account yet. Open one to
              access commodity trading.
            </p>

            <button
              type="button"
              className="commodity-button"
            >
              Open Account
            </button>

          </div>

        </div>

      </section>

    </div>
  );
};

export default Funds;