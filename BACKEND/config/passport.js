const passport = require("passport");
const LocalStrategy = require("passport-local").Strategy;
const GoogleStrategy = require("passport-google-oauth20").Strategy;
const User = require("../model/UserModel");

// =======================================================
// 1. LOCAL STRATEGY
// =======================================================
passport.use(
  new LocalStrategy(
    { usernameField: "username", passwordField: "password" },
    async (username, password, done) => {
      try {
        const user = await User.findOne({
          $or: [{ username: username }, { email: username }],
        });

        if (!user) {
          return done(null, false, { message: "User does not exist" });
        }

        const result = await user.authenticate(password);
        if (result.error || !result.user) {
          return done(null, false, { message: "Wrong password" });
        }

        return done(null, result.user);
      } catch (err) {
        return done(err);
      }
    }
  )
);

// =======================================================
// 2. GOOGLE OAUTH STRATEGY
// =======================================================
passport.use(
  new GoogleStrategy(
    {
      clientID: process.env.GOOGLE_CLIENT_ID,
      clientSecret: process.env.GOOGLE_CLIENT_SECRET,
      // Use absolute URL (or set via environment variable)
      callbackURL: process.env.GOOGLE_CALLBACK_URL || "http://localhost:3002/auth/google/callback",
    },
    async (accessToken, refreshToken, profile, done) => {
      try {
        const email = profile.emails?.[0]?.value?.toLowerCase();
        if (!email) {
          return done(new Error("No email found in Google profile"), null);
        }

        // 1. Match by Google ID
        let user = await User.findOne({ googleId: profile.id });
        if (user) {
          return done(null, user);
        }

        // 2. Match by email (link Google ID to existing local account)
        user = await User.findOne({ email: email });
        if (user) {
          user.googleId = profile.id;
          if (!user.providers.includes("google")) {
            user.providers.push("google");
          }
          if (!user.profilePicture && profile.photos?.[0]?.value) {
            user.profilePicture = profile.photos[0].value;
          }
          await user.save();
          return done(null, user);
        }

        // 3. Create new user
        const fallbackUsername =
          profile.displayName ||
          email.split("@")[0] ||
          `user_${Date.now()}`;

        user = await User.create({
          googleId: profile.id,
          username: fallbackUsername,
          email: email,
          profilePicture: profile.photos?.[0]?.value || "",
          providers: ["google"],
          availableMargin: 50000.0,
          openingBalance: 50000.0,
        });

        return done(null, user);
      } catch (err) {
        return done(err, null);
      }
    }
  )
);

// =======================================================
// 3. SERIALIZATION (Universal MongoDB _id strategy)
// =======================================================
passport.serializeUser((user, done) => {
  done(null, user._id || user.id);
});

passport.deserializeUser(async (id, done) => {
  try {
    const user = await User.findById(id);
    done(null, user);
  } catch (err) {
    done(err, null);
  }
});

module.exports = passport;