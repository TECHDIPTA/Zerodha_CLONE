import React, {
  useContext,
  useEffect,
  useState,
} from "react";

import axios from "axios";

import GeneralContext from "./GeneralContext";

import "./BuyActionWindow.css";

const API_BASE_URL =
  import.meta.env?.VITE_API_URL ||
  "http://localhost:3002";

const BuyActionWindow = ({
  uid,
  initialPrice = 0,
}) => {
  const [stockQuantity, setStockQuantity] = useState(1);
  const [stockPrice, setStockPrice] = useState(
    initialPrice || 0
  );
  const [product, setProduct] = useState("CNC");

  const generalContext =
    useContext(GeneralContext);

  useEffect(() => {
    setStockQuantity(1);
    setStockPrice(initialPrice || 0);
    setProduct("CNC");
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
    }
  };

  return (
    <div
      className="container"
      id="buy-window"
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
            >
              <option value="CNC">CNC</option>
              <option value="MIS">MIS</option>
            </select>
          </fieldset>

          <fieldset>
            <legend>Qty.</legend>

            <input
              type="number"
              min="1"
              step="1"
              value={stockQuantity}
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
              min="0.05"
              step="0.05"
              value={stockPrice}
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
          >
            Buy
          </button>

          <button
            type="button"
            className="btn btn-grey"
            onClick={
              generalContext.closeBuyWindow
            }
          >
            Cancel
          </button>
        </div>
      </div>
    </div>
  );
};

export default BuyActionWindow;