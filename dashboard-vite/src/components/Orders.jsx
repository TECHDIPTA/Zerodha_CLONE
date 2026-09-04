import React, {
  useContext,
  useEffect,
  useState,
} from "react";

import { Link } from "react-router-dom";
import axios from "axios";

import GeneralContext from "./GeneralContext";

import "./Orders.css";

const API_BASE_URL =
  import.meta.env?.VITE_API_URL ||
  "http://localhost:3002";


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
   ORDERS
========================================================= */

const Orders = () => {
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);

  const { ordersVersion } =
    useContext(GeneralContext);


  /* =======================================================
     FETCH ORDERS
  ======================================================= */

  const fetchOrders = async () => {
    try {
      const response =
        await axios.get(
          `${API_BASE_URL}/allOrders`,
          {
            withCredentials: true,
          }
        );

      setOrders(
        response.data || []
      );

    } catch (error) {
      console.error(
        "Error fetching orders:",
        error
      );
    } finally {
      setLoading(false);
    }
  };


  /* =======================================================
     LOAD + REFRESH
  ======================================================= */

  useEffect(() => {
    fetchOrders();

    const interval =
      setInterval(
        fetchOrders,
        4000
      );

    return () => {
      clearInterval(interval);
    };
  }, [ordersVersion]);


  /* =======================================================
     LOADING
  ======================================================= */

  if (loading) {
    return (
      <div className="orders-page">

        <div className="orders-header">
          <div>
            <h2 className="orders-title">
              Orders
            </h2>

            <p className="orders-subtitle">
              Your recent trading activity.
            </p>
          </div>
        </div>

        <div className="orders-loading-card">

          <div className="orders-loader" />

          <p>
            Loading orders...
          </p>

        </div>

      </div>
    );
  }


  /* =======================================================
     EMPTY STATE
  ======================================================= */

  if (orders.length === 0) {
    return (
      <div className="orders-page">

        <div className="orders-header">

          <div>
            <h2 className="orders-title">
              Orders
            </h2>

            <p className="orders-subtitle">
              Your recent trading activity.
            </p>
          </div>

          <span className="orders-count">
            0 orders
          </span>

        </div>


        <div className="orders-empty-card">

          <div className="empty-orders-icon">
            ↗
          </div>

          <h3>
            No orders yet
          </h3>

          <p>
            You haven't placed any
            orders today.
          </p>

          <Link
            to="/"
            className="get-started-button"
          >
            Get started
            <span>→</span>
          </Link>

        </div>

      </div>
    );
  }


  /* =======================================================
     ORDER LIST
  ======================================================= */

  return (
    <div className="orders-page">

      {/* ===================================================
          HEADER
      =================================================== */}

      <div className="orders-header">

        <div>

          <h2 className="orders-title">
            Orders
          </h2>

          <p className="orders-subtitle">
            Review your recent trading activity.
          </p>

        </div>


        <span className="orders-count">
          {orders.length}
          {" "}
          {orders.length === 1
            ? "order"
            : "orders"}
        </span>

      </div>


      {/* ===================================================
          ORDER TABLE CARD
      =================================================== */}

      <div className="orders-table-card">

        <div className="orders-table-heading">

          <div>

            <h3>
              Order history
            </h3>

            <p>
              Latest orders appear first.
            </p>

          </div>

        </div>


        <div className="orders-table-wrapper">

          <table className="orders-table">

            <thead>

              <tr>

                <th>
                  Instrument
                </th>

                <th>
                  Qty.
                </th>

                <th>
                  Price
                </th>

                <th>
                  Product
                </th>

                <th>
                  Mode
                </th>

              </tr>

            </thead>


            <tbody>

              {orders.map(
                (order, index) => {

                  const isBuy =
                    order.mode ===
                    "BUY";

                  const isMIS =
                    order.product ===
                    "MIS";


                  return (
                    <tr
                      key={
                        order._id ||
                        index
                      }
                    >

                      {/* =================================
                          INSTRUMENT
                      ================================= */}

                      <td
                        data-label="Instrument"
                        className="order-instrument"
                      >
                        {order.name}
                      </td>


                      {/* =================================
                          QUANTITY
                      ================================= */}

                      <td data-label="Qty.">
                        {order.qty}
                      </td>


                      {/* =================================
                          PRICE
                      ================================= */}

                      <td
                        data-label="Price"
                        className="order-price"
                      >
                        ₹
                        {formatPrice(
                          order.price
                        )}
                      </td>


                      {/* =================================
                          PRODUCT
                      ================================= */}

                      <td data-label="Product">

                        <span
                          className={`order-badge ${
                            isMIS
                              ? "badge-mis"
                              : "badge-cnc"
                          }`}
                        >
                          {order.product ||
                            "CNC"}
                        </span>

                      </td>


                      {/* =================================
                          MODE
                      ================================= */}

                      <td data-label="Mode">

                        <span
                          className={`order-mode ${
                            isBuy
                              ? "mode-buy"
                              : "mode-sell"
                          }`}
                        >

                          <span className="mode-dot" />

                          {order.mode}

                        </span>

                      </td>

                    </tr>
                  );
                }
              )}

            </tbody>

          </table>

        </div>

      </div>

    </div>
  );
};

export default Orders;