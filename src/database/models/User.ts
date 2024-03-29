import mongoose from "mongoose";

const UserSchema = new mongoose.Schema({
  username: {
    type: String,
    required: true,
    unique: true,
  },
  hashed_password: {
    type: String,
    required: true,
  },
  id: {
    type: String,
  },
});

const User = mongoose.model("Users", UserSchema);

export default User;
