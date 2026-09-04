const { Schema } = require("mongoose");
const passportLocalMongoose = require("passport-local-mongoose");

const UserSchema = new Schema(
  {
    username: {
      type: String,
      required: true,
      trim: true,
    },

    email: {
      type: String,
      required: true,
      unique: true,
      lowercase: true,
      trim: true,
    },

    googleId: {
      type: String,
      default: null,
    },

    providers: [
      {
        type: String,
        enum: ["local", "google"],
      },
    ],

    profilePicture: {
      type: String,
      default: "",
    },

    availableMargin: {
      type: Number,
      default: 50000,
      min: 0,
    },

    openingBalance: {
      type: Number,
      default: 50000,
      min: 0,
    },
  },
  { timestamps: true }
);

const pluginFn =
  typeof passportLocalMongoose === "function"
    ? passportLocalMongoose
    : passportLocalMongoose.default;

UserSchema.plugin(pluginFn, {
  usernameField: "email",
});

module.exports = UserSchema;