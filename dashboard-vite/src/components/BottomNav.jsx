import React from "react";
import { NavLink } from "react-router-dom";

import {
  SpaceDashboardOutlined,
  ReceiptLongOutlined,
  AccountBalanceWalletOutlined,
  ShowChartOutlined,
  CurrencyRupeeOutlined,
  AppsOutlined,
} from "@mui/icons-material";

import "./BottomNav.css";

const tabs = [
  {
    label: "Dashboard",
    path: "/",
    icon: SpaceDashboardOutlined,
  },
  {
    label: "Orders",
    path: "/orders",
    icon: ReceiptLongOutlined,
  },
  {
    label: "Holdings",
    path: "/holdings",
    icon: AccountBalanceWalletOutlined,
  },
  {
    label: "Positions",
    path: "/positions",
    icon: ShowChartOutlined,
  },
  {
    label: "Funds",
    path: "/funds",
    icon: CurrencyRupeeOutlined,
  },
  {
    label: "Apps",
    path: "/apps",
    icon: AppsOutlined,
  },
];

const BottomNav = () => {
  return (
    <nav className="bottom-nav">

      {tabs.map(
        ({
          label,
          path,
          icon: Icon,
        }) => (
          <NavLink
            key={path}
            to={path}
            end={path === "/"}
            className={({ isActive }) =>
              `bottom-nav-item ${
                isActive ? "active" : ""
              }`
            }
          >
            <Icon
              className="bottom-nav-icon"
              fontSize="small"
            />

            <span className="bottom-nav-label">
              {label}
            </span>
          </NavLink>
        )
      )}

    </nav>
  );
};

export default BottomNav;