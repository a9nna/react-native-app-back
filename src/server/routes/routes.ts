import express from "express";
import auth from "../middlewares/auth.js";

const router = express.Router();
const { register } = auth();

router.post("/register", register);

export default router;
