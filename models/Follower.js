const mongoose = require("mongoose");
const User = require("./User");
const Schema = mongoose.Schema;

const followerSchema = Schema(
  {
    follower: { type: Schema.ObjectId, required: true, ref: "User" },
    following: { type: Schema.ObjectId, required: true, ref: "User" },
    status: { type: String, enum: ["following, mutual, cancelled"] },
  },
  { timestamps: true }
);

const Follower = mongoose.model("Follower", followerSchema);
module.exports = Follower;
