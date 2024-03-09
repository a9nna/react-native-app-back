import { Strategy as LocalStrategy } from "passport-local";
import bcrypt from "bcrypt";
import passport from "passport";
import { User } from "../../../database/models/index.js";
import { User as UserType } from "../../../types/index.js";

const strategy = passport.use(
  new LocalStrategy(async (username, password, done) => {
    try {
      const user: UserType | null = await User.findOne({ username: username });
      if (!user) {
        return done(null, false, {
          message: "Incorrect username or password.",
        });
      }

      bcrypt.compare(
        password,
        user.hashed_password,
        (error: Error | undefined, isMatch: boolean) => {
          if (error) {
            return done(error);
          }
          if (!isMatch) {
            return done(null, false, {
              message: "Incorrect username or password.",
            });
          }
          return done(null, user);
        }
      );
    } catch (error) {
      return done(error);
    }
  })
);

export default strategy;
