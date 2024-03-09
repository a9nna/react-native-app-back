import express from "express";
import passport from "passport";
import auth from "../middlewares/auth.js";

const router = express.Router();
const { register, login } = auth();

router.post("/register", register);
router.post(
  "/login",
  passport.authenticate("local", {
    session: false,
  }),
  login
);

export default router;
