import React, {
  useContext,
  useEffect,
  useMemo,
  useState,
} from "react";

import axios from "axios";

import GeneralContext from "./GeneralContext";

import "./BuyActionWindow.css";

const API_BASE_URL =
  import.meta.env?.VITE_API_URL ||
  "http://localhost:3002";


const SellActionWindow = ({
  uid,
  initialPrice = 0,
}) => {
  /* =========================================================
     STATE
  ========================================================= */

  const [stockQuantity, setStockQuantity] =
    useState(1);

  const [stockPrice, setStockPrice] =
    useState(
      Number(initialPrice) || 0
    );

  const [product, setProduct] =
    useState("CNC");

  const [isSelling, setIsSelling] =
    useState(false);


  /* =========================================================
     CONTEXT
  ========================================================= */

  const {
    holdings = [],
    positions = [],
    showToast,
    notifyOrderPlaced,
    closeSellWindow,
  } = useContext(GeneralContext);


  /* =========================================================
     RESET WHEN DIFFERENT STOCK OPENS
  ========================================================= */

  useEffect(() => {
    setStockQuantity(1);

    setStockPrice(
      Number(initialPrice) || 0
    );

    setProduct("CNC");

    setIsSelling(false);
  }, [
    uid,
    initialPrice,
  ]);


  /* =========================================================
     FIND AVAILABLE QUANTITY
     
     CNC → Holdings
     MIS → Positions
  ========================================================= */

  const availableQuantity =
    useMemo(() => {

      if (!uid) {
        return 0;
      }

      if (product === "CNC") {
        const holding =
          holdings.find(
            (item) =>
              item.name === uid
          );

        return Number(
          holding?.qty
        ) || 0;
      }

      if (product === "MIS") {
        const position =
          positions.find(
            (item) =>
              item.name === uid &&
              (item.product === "MIS" ||
                !item.product)
          );

        return Number(
          position?.qty
        ) || 0;
      }

      return 0;

    }, [
      uid,
      product,
      holdings,
      positions,
    ]);


  /* =========================================================
     ORDER VALUE
  ========================================================= */

  const numericQuantity =
    Number(stockQuantity) || 0;

  const numericPrice =
    Number(stockPrice) || 0;

  const orderValue =
    numericQuantity *
    numericPrice;


  /* =========================================================
     VALIDATION
  ========================================================= */

  const quantityIsValid =
    Number.isInteger(
      numericQuantity
    ) &&
    numericQuantity > 0 &&
    numericQuantity <=
      availableQuantity;

  const priceIsValid =
    Number.isFinite(
      numericPrice
    ) &&
    numericPrice > 0;

  const canSell =
    quantityIsValid &&
    priceIsValid &&
    availableQuantity > 0 &&
    !isSelling;


  /* =========================================================
     PRODUCT CHANGE
     
     If the current quantity is greater than the new
     available quantity, reduce it automatically.
  ========================================================= */

  const handleProductChange = (
    event
  ) => {
    const nextProduct =
      event.target.value;

    setProduct(nextProduct);

    /*
      We don't calculate the new quantity here because
      availableQuantity updates immediately after product
      changes. The effect below handles it cleanly.
    */
  };


  /* =========================================================
     KEEP QUANTITY WITHIN AVAILABLE LIMIT
  ========================================================= */

  useEffect(() => {

    if (
      availableQuantity > 0 &&
      Number(stockQuantity) >
        availableQuantity
    ) {
      setStockQuantity(
        availableQuantity
      );
    }

  }, [
    availableQuantity,
    stockQuantity,
  ]);


  /* =========================================================
     QUANTITY CHANGE
  ========================================================= */

  const handleQuantityChange = (
    event
  ) => {
    const value =
      event.target.value;

    if (value === "") {
      setStockQuantity("");
      return;
    }

    const number =
      Number(value);

    if (
      !Number.isFinite(number)
    ) {
      return;
    }

    const wholeNumber =
      Math.floor(number);

    /*
      Allow the user to type a number but never
      let it exceed available quantity.
    */

    if (
      availableQuantity > 0 &&
      wholeNumber >
        availableQuantity
    ) {
      setStockQuantity(
        availableQuantity
      );

      return;
    }

    setStockQuantity(
      Math.max(
        1,
        wholeNumber
      )
    );
  };


  /* =========================================================
     PRICE CHANGE
  ========================================================= */

  const handlePriceChange = (
    event
  ) => {
    const value =
      event.target.value;

    setStockPrice(
      value === ""
        ? ""
        : Number(value)
    );
  };


  /* =========================================================
     SELL
  ========================================================= */

  const handleSellClick =
    async () => {

      const qty =
        Number(stockQuantity);

      const price =
        Number(stockPrice);


      /* -----------------------------------------------
         BASIC VALIDATION
      ------------------------------------------------ */

      if (
        !Number.isInteger(qty) ||
        qty <= 0
      ) {
        showToast?.(
          "Enter a valid whole-number quantity.",
          "error"
        );

        return;
      }


      /* -----------------------------------------------
         NO SHARES AVAILABLE
      ------------------------------------------------ */

      if (
        availableQuantity <= 0
      ) {
        showToast?.(
          `You do not have any ${uid} shares in ${product}.`,
          "error"
        );

        return;
      }


      /* -----------------------------------------------
         TOO MANY SHARES
      ------------------------------------------------ */

      if (
        qty >
        availableQuantity
      ) {
        showToast?.(
          `You can sell only ${availableQuantity} share${
            availableQuantity === 1
              ? ""
              : "s"
          } of ${uid} in ${product}.`,
          "error"
        );

        return;
      }


      /* -----------------------------------------------
         PRICE VALIDATION
      ------------------------------------------------ */

      if (
        !Number.isFinite(price) ||
        price <= 0
      ) {
        showToast?.(
          "Please enter a valid price.",
          "error"
        );

        return;
      }


      /* -----------------------------------------------
         START SELL
      ------------------------------------------------ */

      setIsSelling(true);

      try {

        const response =
          await axios.post(
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


        /* ---------------------------------------------
           SUCCESS
        --------------------------------------------- */

        showToast?.(
          response.data?.message ||
            `Sold ${qty} ${uid} @ ₹${price.toFixed(
              2
            )}`,
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


  /* =========================================================
     RENDER
  ========================================================= */

  return (
    <div
      className="container"
      id="sell-window"
    >

      {/* =====================================================
          ORDER FORM
      ===================================================== */}

      <div className="regular-order">

        <div className="inputs">

          {/* =================================================
              PRODUCT
          ================================================= */}

          <fieldset>
            <legend>
              Product
            </legend>

            <select
              value={product}
              onChange={
                handleProductChange
              }
              disabled={isSelling}
            >
              <option value="CNC">
                CNC
              </option>

              <option value="MIS">
                MIS
              </option>
            </select>
          </fieldset>


          {/* =================================================
              QUANTITY
          ================================================= */}

          <fieldset>

            <legend>
              Qty.
            </legend>

            <input
              type="number"
              min="1"
              max={
                availableQuantity > 0
                  ? availableQuantity
                  : undefined
              }
              step="1"
              value={stockQuantity}
              onChange={
                handleQuantityChange
              }
              disabled={
                isSelling ||
                availableQuantity <= 0
              }
            />

          </fieldset>


          {/* =================================================
              PRICE
          ================================================= */}

          <fieldset>

            <legend>
              Price
            </legend>

            <input
              type="number"
              min="0.05"
              step="0.05"
              value={stockPrice}
              onChange={
                handlePriceChange
              }
              disabled={isSelling}
            />

          </fieldset>

        </div>


        {/* =================================================
            AVAILABLE QUANTITY
        ================================================= */}

        <div className="available-quantity">

          <span>
            Available
          </span>

          <strong
            className={
              availableQuantity > 0
                ? "available-value"
                : "available-value unavailable"
            }
          >
            {availableQuantity}
            {" "}
            share
            {availableQuantity === 1
              ? ""
              : "s"}
          </strong>

        </div>


        {/* =================================================
            VALIDATION MESSAGE
        ================================================= */}

        {availableQuantity <= 0 ? (

          <div className="sell-warning">

            You don't own any
            {" "}
            <strong>
              {uid}
            </strong>
            {" "}
            shares in
            {" "}
            <strong>
              {product}
            </strong>
            .

          </div>

        ) : numericQuantity >
          availableQuantity ? (

          <div className="sell-warning">

            You can sell a maximum of
            {" "}
            <strong>
              {availableQuantity}
            </strong>
            {" "}
            share
            {availableQuantity === 1
              ? ""
              : "s"}.

          </div>

        ) : null}

      </div>


      {/* =====================================================
          FOOTER
      ===================================================== */}

      <div className="buttons">

        <span>
          Order value: ₹
          {orderValue.toFixed(2)}
        </span>


        <div>

          {/* ===============================================
              SELL
          =============================================== */}

          <button
            type="button"
            className="btn btn-red"
            onClick={
              handleSellClick
            }
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
            {isSelling
              ? "Selling..."
              : "Sell"}
          </button>


          {/* ===============================================
              CANCEL
          =============================================== */}

          <button
            type="button"
            className="btn btn-grey"
            onClick={
              closeSellWindow
            }
            disabled={isSelling}
          >
            Cancel
          </button>

        </div>

      </div>

    </div>
  );
};

export default SellActionWindow;