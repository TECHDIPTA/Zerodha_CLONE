import React, {
  useContext,
  useEffect,
  useState,
} from "react";

import { createPortal } from "react-dom";

import axios from "axios";

import GeneralContext from "./GeneralContext";

import "./BuyActionWindow.css";

const API_BASE_URL =
  import.meta.env?.VITE_API_URL ||
  "http://localhost:3002";


/* =========================================================
   OVERLAY (built in, no extra file needed)

   Renders the window into document.body so it is ALWAYS
   fixed to the screen and can never fall to the end of the
   page because of a parent's overflow / height rules.

   Phone / tablet (<= 1024px): dimmed backdrop, tap outside
   to close, page scroll locked while open.
   Desktop: no backdrop, page stays clickable.
========================================================= */

const Overlay = ({ id, onClose, children }) => {

  useEffect(() => {
    const isSmallScreen =
      window.matchMedia(
        "(max-width: 1024px)"
      ).matches;

    if (!isSmallScreen) {
      return undefined;
    }

    const previousOverflow =
      document.body.style.overflow;

    document.body.style.overflow = "hidden";

    return () => {
      document.body.style.overflow =
        previousOverflow;
    };
  }, []);

  useEffect(() => {
    const handleKeyDown = (event) => {
      if (event.key === "Escape") {
        onClose?.();
      }
    };

    window.addEventListener(
      "keydown",
      handleKeyDown
    );

    return () => {
      window.removeEventListener(
        "keydown",
        handleKeyDown
      );
    };
  }, [onClose]);

  return createPortal(
    <div
      className="action-overlay"
      style={{
        position: "fixed",
        top: 0,
        left: 0,
        right: 0,
        bottom: 0,
        zIndex: 10000,
      }}
      onClick={onClose}
    >
      <div
        className="container"
        id={id}
        onClick={(e) => e.stopPropagation()}
      >
        {children}
      </div>
    </div>,
    document.body
  );
};


/* =========================================================
   BUY WINDOW
========================================================= */

const BuyActionWindow = ({
  uid,
  initialPrice = 0,
}) => {
  const [stockQuantity, setStockQuantity] =
    useState(1);

  const [stockPrice, setStockPrice] =
    useState(initialPrice || 0);

  const [product, setProduct] =
    useState("CNC");

  const [isBuying, setIsBuying] =
    useState(false);

  const generalContext =
    useContext(GeneralContext);

  useEffect(() => {
    setStockQuantity(1);
    setStockPrice(initialPrice || 0);
    setProduct("CNC");
    setIsBuying(false);
  }, [uid, initialPrice]);

  const marginRequired =
    Number(stockQuantity || 0) *
    Number(stockPrice || 0);

  const handleBuyClick = async () => {
    const qty = Number(stockQuantity);
    const price = Number(stockPrice);

    if (
      !Number.isFinite(qty) ||
      !Number.isFinite(price) ||
      qty <= 0 ||
      price <= 0
    ) {
      generalContext.showToast(
        "Enter a valid quantity and price",
        "error"
      );
      return;
    }

    setIsBuying(true);

    try {
      const res = await axios.post(
        `${API_BASE_URL}/newOrder`,
        {
          name: uid,
          qty,
          price,
          mode: "BUY",
          product,
        },
        {
          withCredentials: true,
        }
      );

      generalContext.showToast(
        res.data?.message ||
          `Bought ${qty} ${uid} @ ₹${price.toFixed(2)}`,
        "success"
      );

      generalContext.notifyOrderPlaced();
      generalContext.closeBuyWindow();
    } catch (err) {
      generalContext.showToast(
        err.response?.data?.message ||
          "Order placement failed.",
        "error"
      );

      setIsBuying(false);
    }
  };

  return (
    <Overlay
      id="buy-window"
      onClose={generalContext.closeBuyWindow}
    >
      <div className="regular-order">
        <div className="inputs">

          <fieldset>
            <legend>Product</legend>

            <select
              value={product}
              onChange={(e) =>
                setProduct(e.target.value)
              }
              disabled={isBuying}
            >
              <option value="CNC">CNC</option>
              <option value="MIS">MIS</option>
            </select>
          </fieldset>

          <fieldset>
            <legend>Qty.</legend>

            <input
              type="number"
              inputMode="numeric"
              min="1"
              step="1"
              value={stockQuantity}
              disabled={isBuying}
              onChange={(e) => {
                const value = e.target.value;

                if (value === "") {
                  setStockQuantity("");
                  return;
                }

                const number = Number(value);

                setStockQuantity(
                  Number.isFinite(number)
                    ? Math.max(1, Math.floor(number))
                    : 1
                );
              }}
            />
          </fieldset>

          <fieldset>
            <legend>Price</legend>

            <input
              type="number"
              inputMode="decimal"
              min="0.05"
              step="0.05"
              value={stockPrice}
              disabled={isBuying}
              onChange={(e) => {
                const value = e.target.value;

                setStockPrice(
                  value === ""
                    ? ""
                    : Number(value)
                );
              }}
            />
          </fieldset>

        </div>
      </div>

      <div className="buttons">
        <span>
          Margin required: ₹
          {marginRequired.toFixed(2)}
        </span>

        <div>
          <button
            type="button"
            className="btn btn-blue"
            onClick={handleBuyClick}
            disabled={isBuying}
          >
            {isBuying ? "Buying..." : "Buy"}
          </button>

          <button
            type="button"
            className="btn btn-grey"
            onClick={
              generalContext.closeBuyWindow
            }
            disabled={isBuying}
          >
            Cancel
          </button>
        </div>
      </div>
    </Overlay>
  );
};

export default BuyActionWindow;