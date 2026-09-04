const { Schema } = require("mongoose");

const OrdersSchema = new Schema(
  {
    userId: {
      type: Schema.Types.ObjectId,
      ref: "User",
      required: true,
      index: true,
    },

    name: {
      type: String,
      required: true,
      trim: true,
    },

    qty: {
      type: Number,
      required: true,
      min: 1,
    },

    price: {
      type: Number,
      required: true,
      min: 0,
    },

    mode: {
      type: String,
      enum: ["BUY", "SELL"],
      required: true,
    },

    product: {
      type: String,
      enum: ["CNC", "MIS"],
      required: true,
      default: "CNC",
    },
  },
  { timestamps: true }
);

module.exports = OrdersSchema;