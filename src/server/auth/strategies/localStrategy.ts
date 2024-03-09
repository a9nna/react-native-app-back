import { Strategy as LocalStrategy } from "passport-local";
import bcrypt from "bcrypt";
import { User } from "../../../database/models/index.js";
import { User as UserType } from "../../../types/index.js";

const strategy = new LocalStrategy((username, password, done) => {
  User.findOne({ username: username }, (error: Error, user: UserType) => {
    if (error) {
      return done(error);
    }
    if (!user) {
      return done(null, false, { message: "Incorrect username or password." });
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
  });
});

export default strategy;
