import "dotenv/config";
import { NextFunction, Request, Response } from "express";
import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";
import { User } from "../../database/models/index.js";

const auth = () => {
  const register = async (req: Request, res: Response) => {
    try {
      // * Check if user already exists
      const existingUser = await User.findOne({ username: req.body.username });
      if (existingUser) {
        return res.status(400).json({ message: "User already exists" });
      }

      // * Hash the password
      const salt = bcrypt.genSaltSync(10);
      const hashedPassword = bcrypt.hashSync(req.body.password, salt);

      // * Create a new user
      const user = new User({
        username: req.body.username,
        hashed_password: hashedPassword,
      });

      // * Save the user to the database
      const savedUser = await user.save();

      res.json(savedUser);
    } catch (error: Error | any) {
      res.status(500).json({ message: error.message });
    }
  };

  const login = (req: Request, res: Response, next: NextFunction) => {
    try {
      const { username } = req.body;

      const token = jwt.sign({ id: username }, "jwt_secret");

      res.json({ token: token });
    } catch (error: Error | any) {
      res.status(500).json({ message: error.message });
    }
  };

  return { register, login };
};

export default auth;
