import React, {
  useState,
  useEffect,
  useCallback,
  useRef,
} from "react";

import { Route, Routes } from "react-router-dom";
import axios from "axios";

import NavBar from "./NavBar";
import BottomNav from "./BottomNav";
import Apps from "./Apps";
import Funds from "./Funds";
import Holdings from "./Holdings";
import Orders from "./Orders";
import Positions from "./Positions";
import Summary from "./Summary";
import WatchList from "./WatchList";
import BuyActionWindow from "./BuyActionWindow";
import SellActionWindow from "./SellActionWindow";
import { Profile, Settings } from "./ProfileSettings";
import Toast from "./Toast";
import GeneralContext from "./GeneralContext";

import { watchlist as initialWatchlist } from "../data/data";

const TICK_INTERVAL_MS = 2000;
const MAX_TICK_PERCENT = 0.01;

const API_BASE_URL =
  import.meta.env?.VITE_API_URL ||
  "http://localhost:3002";


/* =========================================================
   LIVE PRICE TICK
========================================================= */

const tickPrice = (price) => {
  const number = Number(price) || 0;

  if (number <= 0) {
    return 0;
  }

  const tickFraction =
    (Math.random() * 2 - 1) *
    MAX_TICK_PERCENT;

  return Math.max(
    0.01,
    number * (1 + tickFraction)
  );
};


/* =========================================================
   WATCHLIST LIVE UPDATE
========================================================= */

const updateWatchlistPrices = (previous) => {
  return previous.map((stock) => {
    const oldPrice =
      Number(stock.price) || 0;

    if (oldPrice <= 0) {
      return stock;
    }

    const newPrice =
      tickPrice(oldPrice);

    const percentChange =
      ((newPrice - oldPrice) / oldPrice) *
      100;

    return {
      ...stock,

      price: newPrice,

      percent:
        `${percentChange >= 0 ? "+" : ""}` +
        `${percentChange.toFixed(2)}%`,

      isDown:
        newPrice < oldPrice,
    };
  });
};


/* =========================================================
   DASHBOARD
========================================================= */

const Dashboard = () => {

  /* =======================================================
     BUY / SELL WINDOW
  ======================================================= */

  const [isBuyWindowOpen, setIsBuyWindowOpen] =
    useState(false);

  const [isSellWindowOpen, setIsSellWindowOpen] =
    useState(false);

  const [selectedStockUID, setSelectedStockUID] =
    useState("");

  const [selectedStockPrice, setSelectedStockPrice] =
    useState(0);


  /* =======================================================
     TOAST
  ======================================================= */

  const [toast, setToast] = useState(null);


  /* =======================================================
     ORDER REFRESH VERSION
  ======================================================= */

  const [ordersVersion, setOrdersVersion] =
    useState(0);


  /* =======================================================
     ACCOUNT DATA
  ======================================================= */

  const [holdings, setHoldings] =
    useState([]);

  const [positions, setPositions] =
    useState([]);

  const [user, setUser] =
    useState(null);


  /* =======================================================
     LIVE WATCHLIST
  ======================================================= */

  const [marketWatchlist, setMarketWatchlist] =
    useState(
      initialWatchlist.map((stock) => ({
        ...stock,

        price:
          Number(stock.price) || 0,

        percent:
          stock.percent ||
          "+0.00%",

        isDown:
          Boolean(stock.isDown),
      }))
    );


  /* =======================================================
     POSITION REFERENCE PRICES
     
     IMPORTANT:
     Stores the original/reference price for each
     position and does not change on every tick.
  ======================================================= */

  const positionReferencePrices =
    useRef({});


  /* =======================================================
     BUY WINDOW
  ======================================================= */

  const handleOpenBuyWindow = (
    uid,
    defaultPrice = 0
  ) => {
    setSelectedStockUID(uid);

    setSelectedStockPrice(
      Number(defaultPrice) || 0
    );

    setIsBuyWindowOpen(true);
    setIsSellWindowOpen(false);
  };


  const handleCloseBuyWindow = () => {
    setIsBuyWindowOpen(false);

    setSelectedStockUID("");

    setSelectedStockPrice(0);
  };


  /* =======================================================
     SELL WINDOW
  ======================================================= */

  const handleOpenSellWindow = (
    uid,
    defaultPrice = 0
  ) => {
    setSelectedStockUID(uid);

    setSelectedStockPrice(
      Number(defaultPrice) || 0
    );

    setIsSellWindowOpen(true);
    setIsBuyWindowOpen(false);
  };


  const handleCloseSellWindow = () => {
    setIsSellWindowOpen(false);

    setSelectedStockUID("");

    setSelectedStockPrice(0);
  };


  /* =======================================================
     TOAST
  ======================================================= */

  const handleShowToast = (
    message,
    type = "success"
  ) => {
    setToast({
      message,
      type,
    });
  };


  /* =======================================================
     ORDER UPDATE
  ======================================================= */

  const handleNotifyOrderPlaced = () => {
    setOrdersVersion(
      (previous) =>
        previous + 1
    );
  };


  /* =======================================================
     USER DATA
  ======================================================= */

  const fetchUserData =
    useCallback(async () => {
      try {
        const response =
          await axios.get(
            `${API_BASE_URL}/userData`,
            {
              withCredentials: true,
            }
          );

        setUser(response.data);
      } catch (error) {
        console.error(
          "User session missing:",
          error
        );

        setUser(null);
      }
    }, []);


  useEffect(() => {
    fetchUserData();
  }, [
    fetchUserData,
    ordersVersion,
  ]);


  /* =======================================================
     HOLDINGS
  ======================================================= */

  useEffect(() => {
    const fetchHoldings =
      async () => {
        try {
          const response =
            await axios.get(
              `${API_BASE_URL}/allHoldings`,
              {
                withCredentials: true,
              }
            );

          setHoldings(
            response.data || []
          );
        } catch (error) {
          console.error(
            "Holdings fetch failed:",
            error.message
          );
        }
      };

    fetchHoldings();
  }, [
    ordersVersion,
  ]);


  /* =======================================================
     POSITIONS
  ======================================================= */

  useEffect(() => {
    const fetchPositions =
      async () => {
        try {
          const response =
            await axios.get(
              `${API_BASE_URL}/allPositions`,
              {
                withCredentials: true,
              }
            );

          const fetchedPositions =
            response.data || [];


          /*
            Initialize a reference price only once
            for every position.
          */

          fetchedPositions.forEach(
            (position) => {
              const id =
                position._id ||
                `${position.name}-${position.product}`;

              if (
                positionReferencePrices
                  .current[id] ===
                undefined
              ) {
                positionReferencePrices
                  .current[id] =
                  Number(
                    position.price
                  ) ||
                  Number(
                    position.avg
                  ) ||
                  0;
              }
            }
          );


          /*
            Attach previousPrice to the frontend
            position object.
          */

          const preparedPositions =
            fetchedPositions.map(
              (position) => {
                const id =
                  position._id ||
                  `${position.name}-${position.product}`;

                return {
                  ...position,

                  previousPrice:
                    positionReferencePrices
                      .current[id] ||
                    Number(
                      position.price
                    ) ||
                    Number(
                      position.avg
                    ) ||
                    0,
                };
              }
            );


          setPositions(
            preparedPositions
          );

        } catch (error) {
          console.error(
            "Positions fetch failed:",
            error.message
          );
        }
      };

    fetchPositions();
  }, [
    ordersVersion,
  ]);


  /* =======================================================
     LIVE MARKET TICK
     
     Every 2 seconds:
       Watchlist:
         - price
         - percentage
         - direction

       Holdings:
         - LTP

       Positions:
         - LTP
         - preserved reference price
  ======================================================= */

  useEffect(() => {

    const interval =
      setInterval(() => {

        /* ===============================================
           WATCHLIST
        =============================================== */

        setMarketWatchlist(
          updateWatchlistPrices
        );


        /* ===============================================
           HOLDINGS
        =============================================== */

        setHoldings(
          (previous) =>
            previous.map(
              (holding) => {

                const oldPrice =
                  Number(
                    holding.price
                  ) || 0;

                const newPrice =
                  tickPrice(
                    oldPrice
                  );

                return {
                  ...holding,

                  price:
                    newPrice,
                };
              }
            )
        );


        /* ===============================================
           POSITIONS
        =============================================== */

        setPositions(
          (previous) =>
            previous.map(
              (position) => {

                const oldPrice =
                  Number(
                    position.price
                  ) || 0;

                const newPrice =
                  tickPrice(
                    oldPrice
                  );

                const id =
                  position._id ||
                  `${position.name}-${position.product}`;


                /*
                  If a reference doesn't exist,
                  establish it now.
                */

                if (
                  positionReferencePrices
                    .current[id] ===
                  undefined
                ) {
                  positionReferencePrices
                    .current[id] =
                    oldPrice;
                }


                return {
                  ...position,

                  price:
                    newPrice,

                  previousPrice:
                    positionReferencePrices
                      .current[id],
                };
              }
            )
        );

      }, TICK_INTERVAL_MS);


    return () => {
      clearInterval(interval);
    };

  }, []);


  /* =======================================================
     CONTEXT
  ======================================================= */

  return (
    <GeneralContext.Provider
      value={{

        /* -----------------------------------------------
           BUY
        ----------------------------------------------- */

        openBuyWindow:
          handleOpenBuyWindow,

        closeBuyWindow:
          handleCloseBuyWindow,


        /* -----------------------------------------------
           SELL
        ----------------------------------------------- */

        openSellWindow:
          handleOpenSellWindow,

        closeSellWindow:
          handleCloseSellWindow,


        /* -----------------------------------------------
           TOAST
        ----------------------------------------------- */

        showToast:
          handleShowToast,


        /* -----------------------------------------------
           ORDER UPDATE
        ----------------------------------------------- */

        notifyOrderPlaced:
          handleNotifyOrderPlaced,

        ordersVersion,


        /* -----------------------------------------------
           ACCOUNT
        ----------------------------------------------- */

        holdings,

        positions,

        watchlist:
          marketWatchlist,

        user,


        /* -----------------------------------------------
           USER REFRESH
        ----------------------------------------------- */

        refreshUserData:
          fetchUserData,
      }}
    >

      <div className="kite-app-layout">

        {/* =================================================
            NAVBAR
        ================================================= */}

        <NavBar />


        {/* =================================================
            MAIN DASHBOARD
        ================================================= */}

        <div className="dashboard-container">

          {/* -----------------------------------------------
              WATCHLIST
          ------------------------------------------------ */}

          <aside className="watchlist-pane">

            <WatchList />

          </aside>


          {/* -----------------------------------------------
              CONTENT
          ------------------------------------------------ */}

          <main className="content-pane">

            <Routes>

              {/* ===========================================
                  DASHBOARD
              =========================================== */}

              <Route
                path="/"
                element={
                  <Summary
                    userName={
                      user?.username ||
                      "Trader"
                    }

                    holdingsData={
                      holdings
                    }

                    positionsData={
                      positions
                    }

                    marginAvailable={
                      user?.availableMargin ||
                      0
                    }

                    openingBalance={
                      user?.openingBalance ||
                      0
                    }
                  />
                }
              />


              {/* ===========================================
                  ORDERS
              =========================================== */}

              <Route
                path="/orders"
                element={
                  <Orders />
                }
              />


              {/* ===========================================
                  HOLDINGS
              =========================================== */}

              <Route
                path="/holdings"
                element={
                  <Holdings
                    holdingsData={
                      holdings
                    }
                  />
                }
              />


              {/* ===========================================
                  POSITIONS
              =========================================== */}

              <Route
                path="/positions"
                element={
                  <Positions
                    positionsData={
                      positions
                    }
                  />
                }
              />


              {/* ===========================================
                  FUNDS
              =========================================== */}

              <Route
                path="/funds"
                element={
                  <Funds />
                }
              />


              {/* ===========================================
                  APPS
              =========================================== */}

              <Route
                path="/apps"
                element={
                  <Apps />
                }
              />


              {/* ===========================================
                  PROFILE
              =========================================== */}

              <Route
                path="/profile"
                element={
                  <Profile />
                }
              />


              {/* ===========================================
                  SETTINGS
              =========================================== */}

              <Route
                path="/settings"
                element={
                  <Settings />
                }
              />

            </Routes>

          </main>

        </div>


        {/* =================================================
            MOBILE BOTTOM NAV
        ================================================= */}

        <div className="mobile-bottom-nav-wrapper">
          <BottomNav />
        </div>


        {/* =================================================
            BUY WINDOW
        ================================================= */}

        {isBuyWindowOpen && (
          <BuyActionWindow
            uid={
              selectedStockUID
            }
            initialPrice={
              selectedStockPrice
            }
          />
        )}


        {/* =================================================
            SELL WINDOW
        ================================================= */}

        {isSellWindowOpen && (
          <SellActionWindow
            uid={
              selectedStockUID
            }
            initialPrice={
              selectedStockPrice
            }
          />
        )}


        {/* =================================================
            TOAST
        ================================================= */}

        {toast && (
          <Toast
            message={
              toast.message
            }
            type={
              toast.type
            }
            onClose={() =>
              setToast(null)
            }
          />
        )}

      </div>

    </GeneralContext.Provider>
  );
};

export default Dashboard;