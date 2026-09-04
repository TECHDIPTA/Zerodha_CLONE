require("dotenv").config();

const express = require("express");
const mongoose = require("mongoose");
const session = require("express-session");
const passport = require("./config/passport");
const cors = require("cors");

// ======================================================
// MODELS
// ======================================================

const HoldingsModel = require("./model/HoldingsModel");
const PositionsModel = require("./model/PositionsModel");
const OrdersModel = require("./model/OrdersModel");
const User = require("./model/UserModel");

// ======================================================
// APP CONFIGURATION
// ======================================================

const app = express();

const PORT = process.env.PORT || 3002;
const MONGO_URL = process.env.MONGO_URL;

const AUTH_CLIENT_URL =
  process.env.AUTH_CLIENT_URL ||
  "http://localhost:5173";

const DASHBOARD_CLIENT_URL =
  process.env.DASHBOARD_CLIENT_URL ||
  "http://localhost:5174";

// ======================================================
// ENVIRONMENT VALIDATION
// ======================================================

if (!MONGO_URL) {
  console.error(
    "❌ MONGO_URL is missing from your .env file."
  );

  process.exit(1);
}

// ======================================================
// CORS
// ======================================================

const allowedOrigins = [
  AUTH_CLIENT_URL,
  DASHBOARD_CLIENT_URL,
];

app.use(
  cors({
    origin: (origin, callback) => {
      // Allow requests without an Origin header
      // such as Postman/server-to-server requests.
      if (!origin) {
        return callback(null, true);
      }

      if (allowedOrigins.includes(origin)) {
        return callback(null, true);
      }

      console.error(
        `❌ CORS blocked origin: ${origin}`
      );

      return callback(
        new Error("Not allowed by CORS")
      );
    },

    credentials: true,
  })
);

// ======================================================
// BODY PARSERS
// ======================================================

app.use(express.json());

app.use(
  express.urlencoded({
    extended: true,
  })
);

// ======================================================
// SESSION
// ======================================================

app.use(
  session({
    secret:
      process.env.SESSION_SECRET ||
      "zerodha_secret",

    resave: false,

    saveUninitialized: false,

    cookie: {
      maxAge:
        7 *
        24 *
        60 *
        60 *
        1000,

      httpOnly: true,

      secure: false,

      // Works for your localhost development
      // setup where 5173 and 5174 are separate
      // frontend origins but share this backend.
      sameSite: "lax",
    },
  })
);

// ======================================================
// PASSPORT
// ======================================================

app.use(
  passport.initialize()
);

app.use(
  passport.session()
);

// ======================================================
// HELPER: SAFE USER OBJECT
// ======================================================

const getSafeUser = (user) => {
  if (!user) {
    return null;
  }

  return {
    _id: user._id,
    username: user.username,
    email: user.email,
  };
};

// ======================================================
// AUTHENTICATION MIDDLEWARE
// ======================================================

const isAuthenticated = (
  req,
  res,
  next
) => {
  if (req.isAuthenticated()) {
    return next();
  }

  return res.status(401).json({
    authenticated: false,
    message:
      "Unauthorized. Please log in.",
  });
};

// ======================================================
// BASIC SERVER TEST
// ======================================================

app.get("/", (req, res) => {
  return res.status(200).json({
    success: true,
    message:
      "Server is running successfully",
  });
});

// ======================================================
// AUTHENTICATION
// ======================================================

// ======================================================
// CURRENT USER
// ======================================================

app.get(
  "/auth/current-user",
  (req, res) => {
    if (
      !req.isAuthenticated() ||
      !req.user
    ) {
      return res.status(401).json({
        authenticated: false,
        user: null,
      });
    }

    return res.status(200).json({
      authenticated: true,
      user: getSafeUser(req.user),
    });
  }
);

// ======================================================
// GOOGLE LOGIN
// ======================================================

app.get(
  "/auth/google",
  passport.authenticate(
    "google",
    {
      scope: [
        "profile",
        "email",
      ],

      prompt: "select_account",
    }
  )
);

// ======================================================
// GOOGLE CALLBACK
// ======================================================

app.get(
  "/auth/google/callback",

  passport.authenticate(
    "google",
    {
      failureRedirect:
        `${AUTH_CLIENT_URL}/signin?error=google_auth_failed`,

      session: true,
    }
  ),

  (req, res) => {
    const username =
      req.user?.username ||
      "Trader";

    const welcomeMsg =
      `Welcome, ${username}!`;

    /*
     * IMPORTANT:
     *
     * Google authentication is successful.
     *
     * Passport has already created the
     * authenticated session.
     *
     * We now send the user directly to
     * the dashboard.
     */

    const dashboardUrl =
      `${DASHBOARD_CLIENT_URL}/?flash=${encodeURIComponent(
        welcomeMsg
      )}&type=success`;

    return res.redirect(
      dashboardUrl
    );
  }
);

// ======================================================
// LOCAL SIGNUP
// ======================================================

app.post(
  "/auth/signup",
  async (req, res) => {
    try {
      const {
        username,
        email,
        password,
      } = req.body;

      // ----------------------------------------------
      // VALIDATION
      // ----------------------------------------------

      if (
        !username ||
        !email ||
        !password
      ) {
        return res.status(400).json({
          message:
            "Username, email, and password are required.",
        });
      }

      // ----------------------------------------------
      // CHECK EXISTING USER
      // ----------------------------------------------

      const existingUser =
        await User.findOne({
          email,
        });

      if (existingUser) {
        return res.status(409).json({
          message:
            "User with this email already exists.",
        });
      }

      // ----------------------------------------------
      // CREATE USER
      // ----------------------------------------------

      const newUser =
        new User({
          username,
          email,
          providers: ["local"],

          availableMargin:
            50000.0,

          openingBalance:
            50000.0,
        });

      const registeredUser =
        await User.register(
          newUser,
          password
        );

      // ----------------------------------------------
      // CREATE LOGIN SESSION
      // ----------------------------------------------

      req.login(
        registeredUser,
        (err) => {
          if (err) {
            console.error(
              "Signup session error:",
              err
            );

            return res.status(500).json({
              message:
                "Signup succeeded but session creation failed.",
            });
          }

          return res.status(200).json({
            authenticated: true,

            message:
              "Signup successful",

            user:
              getSafeUser(
                registeredUser
              ),
          });
        }
      );
    } catch (error) {
      console.error(
        "Signup error:",
        error
      );

      if (
        error.code === 11000 ||
        error.name ===
          "UserExistsError"
      ) {
        return res.status(409).json({
          message:
            "User with this email already exists.",
        });
      }

      return res.status(400).json({
        message:
          error.message ||
          "Signup failed.",
      });
    }
  }
);

// ======================================================
// LOCAL LOGIN
// ======================================================

app.post(
  "/auth/login",
  (req, res, next) => {
    passport.authenticate(
      "local",
      (err, user, info) => {
        // --------------------------------------------
        // PASSPORT ERROR
        // --------------------------------------------

        if (err) {
          console.error(
            "Login passport error:",
            err
          );

          return res.status(500).json({
            message:
              "Internal server error",
          });
        }

        // --------------------------------------------
        // INVALID LOGIN
        // --------------------------------------------

        if (!user) {
          return res.status(401).json({
            authenticated: false,

            message:
              info?.message ||
              "Invalid email or password",
          });
        }

        // --------------------------------------------
        // CREATE SESSION
        // --------------------------------------------

        req.login(
          user,
          (loginError) => {
            if (loginError) {
              console.error(
                "Login session error:",
                loginError
              );

              return res.status(500).json({
                message:
                  "Login session failed",
              });
            }

            return res.status(200).json({
              authenticated: true,

              message:
                "Login successful",

              user:
                getSafeUser(user),
            });
          }
        );
      }
    )(req, res, next);
  }
);

// ======================================================
// LOGOUT
// ======================================================

app.post(
  "/auth/logout",
  (req, res, next) => {
    /*
     * IMPORTANT:
     *
     * THIS is the only route that destroys
     * the user's authentication session.
     *
     * Dashboard Cancel should NEVER call
     * this endpoint.
     */

    req.logout(
      (logoutError) => {
        if (logoutError) {
          console.error(
            "Logout error:",
            logoutError
          );

          return next(
            logoutError
          );
        }

        req.session.destroy(
          (sessionError) => {
            if (sessionError) {
              console.error(
                "Session destroy error:",
                sessionError
              );

              return res.status(500).json({
                message:
                  "Logout failed",
              });
            }

            // ----------------------------------------
            // REMOVE SESSION COOKIE
            // ----------------------------------------

            res.clearCookie(
              "connect.sid",
              {
                path: "/",
                httpOnly: true,
                sameSite: "lax",
                secure: false,
              }
            );

            return res.status(200).json({
              authenticated: false,

              message:
                "Logged out successfully",

              redirectUrl:
                `${AUTH_CLIENT_URL}/home`,
            });
          }
        );
      }
    );
  }
);

// ======================================================
// USER DATA
// ======================================================

app.get(
  "/userData",
  isAuthenticated,
  async (req, res) => {
    try {
      const user =
        await User.findById(
          req.user._id
        ).select(
          "-hash -salt"
        );

      if (!user) {
        return res.status(404).json({
          message:
            "User not found",
        });
      }

      return res.status(200).json(
        user
      );
    } catch (error) {
      console.error(
        "User data error:",
        error
      );

      return res.status(500).json({
        message:
          "Error fetching user data",
      });
    }
  }
);

// ======================================================
// HOLDINGS
// ======================================================

app.get(
  "/allHoldings",
  isAuthenticated,
  async (req, res) => {
    try {
      const holdings =
        await HoldingsModel.find({
          userId:
            req.user._id,
        });

      return res.status(200).json(
        holdings
      );
    } catch (error) {
      console.error(
        "Holdings error:",
        error
      );

      return res.status(500).json({
        message:
          "Failed to fetch holdings",
      });
    }
  }
);

// ======================================================
// POSITIONS
// ======================================================

app.get(
  "/allPositions",
  isAuthenticated,
  async (req, res) => {
    try {
      const positions =
        await PositionsModel.find({
          userId:
            req.user._id,
        });

      return res.status(200).json(
        positions
      );
    } catch (error) {
      console.error(
        "Positions error:",
        error
      );

      return res.status(500).json({
        message:
          "Failed to fetch positions",
      });
    }
  }
);

// ======================================================
// ORDERS
// ======================================================

app.get(
  "/allOrders",
  isAuthenticated,
  async (req, res) => {
    try {
      const orders =
        await OrdersModel.find({
          userId:
            req.user._id,
        }).sort({
          createdAt: -1,
        });

      return res.status(200).json(
        orders
      );
    } catch (error) {
      console.error(
        "Orders error:",
        error
      );

      return res.status(500).json({
        message:
          "Failed to fetch orders",
      });
    }
  }
);

// ======================================================
// NEW ORDER
// CNC / MIS
// ======================================================

app.post(
  "/newOrder",
  isAuthenticated,
  async (req, res) => {
    try {
      const {
        name,
        qty,
        price,
        mode,
        product = "CNC",
      } = req.body;

      const quantity =
        Number(qty);

      const orderPrice =
        Number(price);

      // ==================================================
      // VALIDATION
      // ==================================================

      if (!name) {
        return res.status(400).json({
          message:
            "Stock name is required.",
        });
      }

      if (
        !["BUY", "SELL"].includes(
          mode
        )
      ) {
        return res.status(400).json({
          message:
            "Invalid order mode.",
        });
      }

      if (
        !["CNC", "MIS"].includes(
          product
        )
      ) {
        return res.status(400).json({
          message:
            "Invalid product type.",
        });
      }

      if (
        !Number.isFinite(
          quantity
        ) ||
        quantity <= 0
      ) {
        return res.status(400).json({
          message:
            "Quantity must be greater than zero.",
        });
      }

      if (
        !Number.isFinite(
          orderPrice
        ) ||
        orderPrice <= 0
      ) {
        return res.status(400).json({
          message:
            "Invalid stock price.",
        });
      }

      const orderCost =
        quantity *
        orderPrice;

      const userId =
        req.user._id;

      const user =
        await User.findById(
          userId
        );

      if (!user) {
        return res.status(404).json({
          message:
            "User not found.",
        });
      }

      // ==================================================
      // MIS
      // ==================================================

      if (
        product === "MIS"
      ) {
        const existingPosition =
          await PositionsModel.findOne(
            {
              userId,
              name,
              product: "MIS",
            }
          );

        // ----------------------------------------------
        // MIS BUY
        // ----------------------------------------------

        if (
          mode === "BUY"
        ) {
          if (
            user.availableMargin <
            orderCost
          ) {
            return res.status(400).json({
              message:
                `Insufficient margin. ` +
                `Required ₹${orderCost.toFixed(2)}, ` +
                `Available ₹${user.availableMargin.toFixed(2)}`,
            });
          }

          user.availableMargin -=
            orderCost;

          await user.save();

          if (
            existingPosition
          ) {
            const oldQty =
              existingPosition.qty;

            const oldAvg =
              existingPosition.avg;

            const newQty =
              oldQty +
              quantity;

            const totalCost =
              oldQty * oldAvg +
              quantity *
                orderPrice;

            existingPosition.qty =
              newQty;

            existingPosition.avg =
              totalCost /
              newQty;

            existingPosition.price =
              orderPrice;

            await existingPosition.save();
          } else {
            await PositionsModel.create(
              {
                userId,

                name,

                qty:
                  quantity,

                avg:
                  orderPrice,

                price:
                  orderPrice,

                product:
                  "MIS",

                net:
                  "+0.00%",

                day:
                  "+0.00%",

                isLoss:
                  false,
              }
            );
          }
        }

        // ----------------------------------------------
        // MIS SELL
        // ----------------------------------------------

        if (
          mode === "SELL"
        ) {
          if (
            !existingPosition ||
            existingPosition.qty <
              quantity
          ) {
            return res.status(400).json({
              message:
                `Cannot sell position. ` +
                `Available quantity: ${
                  existingPosition
                    ? existingPosition.qty
                    : 0
                }`,
            });
          }

          user.availableMargin +=
            orderCost;

          await user.save();

          existingPosition.qty -=
            quantity;

          if (
            existingPosition.qty ===
            0
          ) {
            await PositionsModel.deleteOne(
              {
                _id:
                  existingPosition._id,
              }
            );
          } else {
            existingPosition.price =
              orderPrice;

            await existingPosition.save();
          }
        }
      }

      // ==================================================
      // CNC
      // ==================================================

      if (
        product === "CNC"
      ) {
        const existingHolding =
          await HoldingsModel.findOne(
            {
              userId,
              name,
            }
          );

        // ----------------------------------------------
        // CNC BUY
        // ----------------------------------------------

        if (
          mode === "BUY"
        ) {
          if (
            user.availableMargin <
            orderCost
          ) {
            return res.status(400).json({
              message:
                `Insufficient funds. ` +
                `Required ₹${orderCost.toFixed(2)}, ` +
                `Available ₹${user.availableMargin.toFixed(2)}`,
            });
          }

          user.availableMargin -=
            orderCost;

          await user.save();

          if (
            existingHolding
          ) {
            const oldQty =
              existingHolding.qty;

            const oldAvg =
              existingHolding.avg;

            const newQty =
              oldQty +
              quantity;

            const totalCost =
              oldQty * oldAvg +
              quantity *
                orderPrice;

            existingHolding.qty =
              newQty;

            existingHolding.avg =
              totalCost /
              newQty;

            existingHolding.price =
              orderPrice;

            await existingHolding.save();
          } else {
            await HoldingsModel.create(
              {
                userId,

                name,

                qty:
                  quantity,

                avg:
                  orderPrice,

                price:
                  orderPrice,

                net:
                  "+0.00%",

                day:
                  "+0.00%",
              }
            );
          }
        }

        // ----------------------------------------------
        // CNC SELL
        // ----------------------------------------------

        if (
          mode === "SELL"
        ) {
          if (
            !existingHolding ||
            existingHolding.qty <
              quantity
          ) {
            return res.status(400).json({
              message:
                `Cannot sell stock. ` +
                `Available quantity: ${
                  existingHolding
                    ? existingHolding.qty
                    : 0
                }`,
            });
          }

          user.availableMargin +=
            orderCost;

          await user.save();

          existingHolding.qty -=
            quantity;

          if (
            existingHolding.qty ===
            0
          ) {
            await HoldingsModel.deleteOne(
              {
                _id:
                  existingHolding._id,
              }
            );
          } else {
            existingHolding.price =
              orderPrice;

            await existingHolding.save();
          }
        }
      }

      // ==================================================
      // SAVE ORDER HISTORY
      // ==================================================

      const newOrder =
        await OrdersModel.create(
          {
            userId,

            name,

            qty:
              quantity,

            price:
              orderPrice,

            mode,

            product,
          }
        );

      // ==================================================
      // RESPONSE
      // ==================================================

      return res.status(200).json({
        message:
          `${product} ${mode} order executed successfully at ₹${orderPrice.toFixed(2)}!`,

        availableMargin:
          user.availableMargin,

        order:
          newOrder,
      });
    } catch (error) {
      console.error(
        "Order error:",
        error
      );

      return res.status(500).json({
        message:
          "Failed to place order.",
      });
    }
  }
);

// ======================================================
// ADD FUNDS
// ======================================================

app.post(
  "/funds/add",
  isAuthenticated,
  async (req, res) => {
    try {
      const amount =
        Number(
          req.body.amount
        );

      if (
        !amount ||
        amount <= 0
      ) {
        return res.status(400).json({
          message:
            "Enter a valid amount.",
        });
      }

      const user =
        await User.findById(
          req.user._id
        );

      if (!user) {
        return res.status(404).json({
          message:
            "User not found.",
        });
      }

      user.availableMargin +=
        amount;

      user.openingBalance +=
        amount;

      await user.save();

      return res.status(200).json({
        message:
          "Funds added successfully",

        availableMargin:
          user.availableMargin,
      });
    } catch (error) {
      console.error(
        "Add funds error:",
        error
      );

      return res.status(500).json({
        message:
          "Failed to add funds",
      });
    }
  }
);

// ======================================================
// GLOBAL ERROR HANDLER
// ======================================================

app.use(
  (err, req, res, next) => {
    console.error(
      "❌ Server error:",
      err
    );

    if (
      res.headersSent
    ) {
      return next(err);
    }

    return res.status(500).json({
      message:
        "Internal server error",
    });
  }
);

// ======================================================
// MONGODB CONNECTION
// ======================================================

mongoose
  .connect(MONGO_URL)

  .then(() => {
    console.log(
      "✅ MongoDB connected"
    );

    app.listen(
      PORT,
      () => {
        console.log(
          `🚀 Server running on http://localhost:${PORT}`
        );

        console.log(
          `🔐 Auth client: ${AUTH_CLIENT_URL}`
        );

        console.log(
          `📊 Dashboard client: ${DASHBOARD_CLIENT_URL}`
        );
      }
    );
  })

  .catch((error) => {
    console.error(
      "❌ MongoDB connection error:",
      error.message
    );

    process.exit(1);
  });