const mongoose = require("mongoose");
const User = require("./User");
const Schema = mongoose.Schema;

const followerSchema = Schema(
  {
    follower: { type: Schema.ObjectId, required: true, ref: "User" },
    following: { type: Schema.ObjectId, required: true, ref: "User" },
  },
  { timestamps: true }
);

const Follower = mongoose.model("Follower", followerSchema);
module.exports = Follower;
