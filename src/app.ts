import "dotenv/config";
import express from "express";
import session from "express-session";
import mongoose from "mongoose";
import createDebug from "debug";
import passport from "passport";
import routes from "./server/routes/routes.js";
import { User as UserType } from "./types/auth.js";
import User from "./database/models/User.js";
import strategy from "./server/auth/strategies/localStrategy.js";

const app = express();
const debug = createDebug("app");
const serverPort = process.env.PORT || 3000;
const mongoConnection = process.env.DATABASE;

app.use(express.json());
app.use(
  session({
    secret: process.env.SECRET!,
    resave: false,
    saveUninitialized: false,
    cookie: { secure: true },
  })
);
app.use(strategy.initialize());
app.use(passport.session());

passport.serializeUser((user, done) => {
  process.nextTick(() => {
    return done(null, user);
  });
});

passport.deserializeUser((id, done) => {
  User.findById(id, (error: Error, user: UserType) => {
    done(error, user);
  });
});

app.use("/recipes", routes);

mongoose
  .connect(mongoConnection!)
  .then(() => {
    debug(`Database connected successfully`);

    app.listen(serverPort, () => {
      debug(`Server is running on port: ${serverPort}`);
    });
  })
  .catch((error) => {
    debug(`Error connecting to database: ${error}`);
  });
