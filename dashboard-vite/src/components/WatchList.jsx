import React, {
  useContext,
  useMemo,
  useState,
} from "react";

import { Tooltip } from "@mui/material";

import {
  BarChartOutlined,
  KeyboardArrowDown,
  KeyboardArrowUp,
  MoreHoriz,
} from "@mui/icons-material";

import { DoughnutChart } from "./DoughnoutChart";

import GeneralContext from "./GeneralContext";

import "./WatchList.css";


/* =========================================================
   WATCHLIST
========================================================= */

const WatchList = () => {
  const { watchlist: liveWatchlist = [] } =
    useContext(GeneralContext);

  const [searchTerm, setSearchTerm] =
    useState("");


  /* SEARCH */

  const filteredWatchlist = useMemo(() => {
    const query = searchTerm
      .trim()
      .toLowerCase();

    if (!query) {
      return liveWatchlist;
    }

    return liveWatchlist.filter(
      (stock) =>
        stock.name
          ?.toLowerCase()
          .includes(query) ||
        stock.symbol
          ?.toLowerCase()
          .includes(query)
    );
  }, [searchTerm, liveWatchlist]);


  /* CHART DATA */

  const labels = liveWatchlist.map(
    (stock) => stock.name
  );

  const chartData = {
    labels,

    datasets: [
      {
        label: "Price",

        data: liveWatchlist.map(
          (stock) =>
            Number(stock.price) || 0
        ),

        backgroundColor: [
          "rgba(56, 126, 209, 0.65)",
          "rgba(76, 175, 80, 0.65)",
          "rgba(223, 81, 76, 0.65)",
          "rgba(255, 193, 7, 0.65)",
          "rgba(156, 39, 176, 0.65)",
          "rgba(0, 150, 136, 0.65)",
        ],

        borderWidth: 0,
      },
    ],
  };


  /* RENDER */

  return (
    <aside className="watchlist-container">

      {/* SEARCH */}

      <div className="watchlist-search">
        <div className="search-box">

          <span className="search-icon">
            ⌕
          </span>

          <input
            type="text"
            placeholder="Search eg: infy, bse, nifty"
            value={searchTerm}
            onChange={(e) =>
              setSearchTerm(e.target.value)
            }
          />

          <span className="search-count">
            {filteredWatchlist.length}/
            {liveWatchlist.length}
          </span>

        </div>
      </div>


      {/* LIST */}

      <div className="watchlist-list">

        {filteredWatchlist.length > 0 ? (
          filteredWatchlist.map(
            (stock, index) => (
              <WatchListItem
                key={stock.name || index}
                stock={stock}
              />
            )
          )
        ) : (
          <div className="empty-watchlist">
            <span>No stocks found</span>
          </div>
        )}

      </div>


      {/* MARKET OVERVIEW */}

      <div className="watchlist-chart">

        <div className="chart-title">
          <span>Market overview</span>
        </div>

        <div className="chart-wrapper">
          <DoughnutChart data={chartData} />
        </div>

      </div>

    </aside>
  );
};

export default WatchList;


/* =========================================================
   WATCHLIST ITEM

   Desktop : actions appear on hover.
   Touch   : tap the row to toggle the actions (is-open).
========================================================= */

const WatchListItem = ({ stock }) => {
  const [isOpen, setIsOpen] =
    useState(false);

  const isDown = Boolean(stock.isDown);

  return (
    <div
      className={
        isOpen
          ? "watchlist-item is-open"
          : "watchlist-item"
      }
      onClick={() =>
        setIsOpen((previous) => !previous)
      }
    >

      {/* NORMAL VIEW */}

      <div className="watchlist-normal">

        <div className="stock-left">
          <span
            className={
              isDown
                ? "stock-name down"
                : "stock-name up"
            }
          >
            {stock.name}
          </span>
        </div>

        <div className="stock-right">

          <span
            className="stock-percent"
            style={{
              color: isDown
                ? "#df514c"
                : "#4caf50",
            }}
          >
            {stock.percent}
          </span>

          {isDown ? (
            <KeyboardArrowDown className="stock-arrow down" />
          ) : (
            <KeyboardArrowUp className="stock-arrow up" />
          )}

          <span className="stock-price">
            {Number(
              stock.price || 0
            ).toFixed(2)}
          </span>

        </div>

      </div>


      {/* ACTIONS */}

      <WatchListActions
        uid={stock.name}
        price={stock.price}
        onDone={() => setIsOpen(false)}
      />

    </div>
  );
};


/* =========================================================
   WATCHLIST ACTIONS
========================================================= */

const WatchListActions = ({
  uid,
  price,
  onDone,
}) => {
  const generalContext =
    useContext(GeneralContext);

  const handleBuy = (e) => {
    e.stopPropagation();

    generalContext.openBuyWindow(
      uid,
      price
    );

    onDone?.();
  };

  const handleSell = (e) => {
    e.stopPropagation();

    generalContext.openSellWindow(
      uid,
      price
    );

    onDone?.();
  };

  const handleAnalytics = (e) => {
    e.stopPropagation();
  };

  const handleMore = (e) => {
    e.stopPropagation();
  };

  return (
    <div
      className="watchlist-actions"
      onClick={(e) => e.stopPropagation()}
    >

      <Tooltip
        title="Buy (B)"
        placement="top"
        arrow
      >
        <button
          type="button"
          className="action-buy"
          onClick={handleBuy}
        >
          B
        </button>
      </Tooltip>

      <Tooltip
        title="Sell (S)"
        placement="top"
        arrow
      >
        <button
          type="button"
          className="action-sell"
          onClick={handleSell}
        >
          S
        </button>
      </Tooltip>

      <Tooltip
        title="Analytics (A)"
        placement="top"
        arrow
      >
        <button
          type="button"
          className="action-icon"
          onClick={handleAnalytics}
        >
          <BarChartOutlined />
        </button>
      </Tooltip>

      <Tooltip
        title="More"
        placement="top"
        arrow
      >
        <button
          type="button"
          className="action-icon"
          onClick={handleMore}
        >
          <MoreHoriz />
        </button>
      </Tooltip>

    </div>
  );
};