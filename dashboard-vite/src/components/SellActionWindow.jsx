import React, {
  useContext,
  useEffect,
  useMemo,
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
   SELL WINDOW
========================================================= */

const SellActionWindow = ({
  uid,
  initialPrice = 0,
}) => {

  /* STATE */

  const [stockQuantity, setStockQuantity] =
    useState(1);

  const [stockPrice, setStockPrice] =
    useState(Number(initialPrice) || 0);

  const [product, setProduct] =
    useState("CNC");

  const [isSelling, setIsSelling] =
    useState(false);


  /* CONTEXT */

  const {
    holdings = [],
    positions = [],
    showToast,
    notifyOrderPlaced,
    closeSellWindow,
  } = useContext(GeneralContext);


  /* RESET WHEN A DIFFERENT STOCK OPENS */

  useEffect(() => {
    setStockQuantity(1);
    setStockPrice(Number(initialPrice) || 0);
    setProduct("CNC");
    setIsSelling(false);
  }, [uid, initialPrice]);


  /* AVAILABLE QUANTITY
     CNC -> Holdings, MIS -> Positions */

  const availableQuantity = useMemo(() => {
    if (!uid) {
      return 0;
    }

    if (product === "CNC") {
      const holding = holdings.find(
        (item) => item.name === uid
      );

      return Number(holding?.qty) || 0;
    }

    if (product === "MIS") {
      const position = positions.find(
        (item) =>
          item.name === uid &&
          (item.product === "MIS" ||
            !item.product)
      );

      return Number(position?.qty) || 0;
    }

    return 0;
  }, [uid, product, holdings, positions]);


  /* ORDER VALUE */

  const numericQuantity =
    Number(stockQuantity) || 0;

  const numericPrice =
    Number(stockPrice) || 0;

  const orderValue =
    numericQuantity * numericPrice;


  /* VALIDATION */

  const quantityIsValid =
    Number.isInteger(numericQuantity) &&
    numericQuantity > 0 &&
    numericQuantity <= availableQuantity;

  const priceIsValid =
    Number.isFinite(numericPrice) &&
    numericPrice > 0;

  const canSell =
    quantityIsValid &&
    priceIsValid &&
    availableQuantity > 0 &&
    !isSelling;


  /* KEEP QUANTITY WITHIN AVAILABLE LIMIT */

  useEffect(() => {
    if (
      availableQuantity > 0 &&
      Number(stockQuantity) >
        availableQuantity
    ) {
      setStockQuantity(availableQuantity);
    }
  }, [availableQuantity, stockQuantity]);


  /* HANDLERS */

  const handleProductChange = (event) => {
    setProduct(event.target.value);
  };

  const handleQuantityChange = (event) => {
    const value = event.target.value;

    if (value === "") {
      setStockQuantity("");
      return;
    }

    const number = Number(value);

    if (!Number.isFinite(number)) {
      return;
    }

    const wholeNumber = Math.floor(number);

    if (
      availableQuantity > 0 &&
      wholeNumber > availableQuantity
    ) {
      setStockQuantity(availableQuantity);
      return;
    }

    setStockQuantity(
      Math.max(1, wholeNumber)
    );
  };

  const handlePriceChange = (event) => {
    const value = event.target.value;

    setStockPrice(
      value === "" ? "" : Number(value)
    );
  };


  /* SELL */

  const handleSellClick = async () => {
    const qty = Number(stockQuantity);
    const price = Number(stockPrice);

    if (!Number.isInteger(qty) || qty <= 0) {
      showToast?.(
        "Enter a valid whole-number quantity.",
        "error"
      );
      return;
    }

    if (availableQuantity <= 0) {
      showToast?.(
        `You do not have any ${uid} shares in ${product}.`,
        "error"
      );
      return;
    }

    if (qty > availableQuantity) {
      showToast?.(
        `You can sell only ${availableQuantity} share${
          availableQuantity === 1 ? "" : "s"
        } of ${uid} in ${product}.`,
        "error"
      );
      return;
    }

    if (!Number.isFinite(price) || price <= 0) {
      showToast?.(
        "Please enter a valid price.",
        "error"
      );
      return;
    }

    setIsSelling(true);

    try {
      const response = await axios.post(
        `${API_BASE_URL}/newOrder`,
        {
          name: uid,
          qty,
          price,
          mode: "SELL",
          product,
        },
        {
          withCredentials: true,
        }
      );

      showToast?.(
        response.data?.message ||
          `Sold ${qty} ${uid} @ ₹${price.toFixed(2)}`,
        "success"
      );

      notifyOrderPlaced?.();
      closeSellWindow?.();
    } catch (error) {
      console.error(
        "Sell order failed:",
        error
      );

      showToast?.(
        error.response?.data?.message ||
          "Sell failed. Check your available quantity.",
        "error"
      );
    } finally {
      setIsSelling(false);
    }
  };


  /* RENDER */

  return (
    <Overlay
      id="sell-window"
      onClose={closeSellWindow}
    >

      {/* ORDER FORM */}

      <div className="regular-order">

        <div className="inputs">

          <fieldset>
            <legend>Product</legend>

            <select
              value={product}
              onChange={handleProductChange}
              disabled={isSelling}
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
              max={
                availableQuantity > 0
                  ? availableQuantity
                  : undefined
              }
              step="1"
              value={stockQuantity}
              onChange={handleQuantityChange}
              disabled={
                isSelling ||
                availableQuantity <= 0
              }
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
              onChange={handlePriceChange}
              disabled={isSelling}
            />
          </fieldset>

        </div>


        {/* AVAILABLE QUANTITY */}

        <div className="available-quantity">

          <span>Available</span>

          <strong
            className={
              availableQuantity > 0
                ? "available-value"
                : "available-value unavailable"
            }
          >
            {availableQuantity}{" "}
            share
            {availableQuantity === 1 ? "" : "s"}
          </strong>

        </div>


        {/* VALIDATION MESSAGE */}

        {availableQuantity <= 0 ? (

          <div className="sell-warning">
            You don't own any{" "}
            <strong>{uid}</strong>{" "}
            shares in{" "}
            <strong>{product}</strong>.
          </div>

        ) : numericQuantity >
          availableQuantity ? (

          <div className="sell-warning">
            You can sell a maximum of{" "}
            <strong>{availableQuantity}</strong>{" "}
            share
            {availableQuantity === 1 ? "" : "s"}.
          </div>

        ) : null}

      </div>


      {/* FOOTER */}

      <div className="buttons">

        <span>
          Order value: ₹
          {orderValue.toFixed(2)}
        </span>

        <div>

          <button
            type="button"
            className="btn btn-red"
            onClick={handleSellClick}
            disabled={!canSell}
            title={
              availableQuantity <= 0
                ? `No ${product} shares available`
                : numericQuantity >
                  availableQuantity
                ? `Maximum available: ${availableQuantity}`
                : ""
            }
          >
            {isSelling ? "Selling..." : "Sell"}
          </button>

          <button
            type="button"
            className="btn btn-grey"
            onClick={closeSellWindow}
            disabled={isSelling}
          >
            Cancel
          </button>

        </div>

      </div>

    </Overlay>
  );
};

export default SellActionWindow;