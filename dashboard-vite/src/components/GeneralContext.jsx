
import React from "react";

const GeneralContext = React.createContext({
  // Trading windows
  openBuyWindow: (uid, defaultPrice) => {},
  closeBuyWindow: () => {},

  openSellWindow: (uid, defaultPrice) => {},
  closeSellWindow: () => {},

  // Notifications
  showToast: (message, type) => {},

  // Orders
  notifyOrderPlaced: () => {},
  ordersVersion: 0,

  // User data
  user: null,
  refreshUserData: () => {},

  // Portfolio
  holdings: [],
  positions: [],
  orders: [],

  // Watchlist
  watchlist: [],
});

export default GeneralContext;