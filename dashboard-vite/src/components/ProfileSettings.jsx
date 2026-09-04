import React, { useContext } from "react";
import GeneralContext from "./GeneralContext";

export const Profile = () => {
  const { user } = useContext(GeneralContext);

  return (
    <div style={{ padding: "30px", maxWidth: "600px" }}>
      <h3 style={{ marginBottom: "20px" }}>My Profile</h3>
      <div style={{ background: "#fff", border: "1px solid #e0e0e0", borderRadius: "8px", padding: "24px" }}>
        <p style={{ margin: "10px 0" }}><strong>Username:</strong> {user?.username || "N/A"}</p>
        <p style={{ margin: "10px 0" }}><strong>Email:</strong> {user?.email || "N/A"}</p>
        <p style={{ margin: "10px 0" }}>
          <strong>Available Margin:</strong> ₹{user?.availableMargin ? user.availableMargin.toFixed(2) : "0.00"}
        </p>
        <p style={{ margin: "10px 0" }}>
          <strong>Opening Balance:</strong> ₹{user?.openingBalance ? user.openingBalance.toFixed(2) : "0.00"}
        </p>
      </div>
    </div>
  );
};

export const Settings = () => {
  return (
    <div style={{ padding: "30px", maxWidth: "600px" }}>
      <h3 style={{ marginBottom: "20px" }}>Account Settings</h3>
      <div style={{ background: "#fff", border: "1px solid #e0e0e0", borderRadius: "8px", padding: "24px" }}>
        <p>Manage notification preferences, default order types (CNC/MIS), and trading themes.</p>
      </div>
    </div>
  );
};