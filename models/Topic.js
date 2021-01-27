const mongoose = require("mongoose");
const Schema = mongoose.Schema;
// const User = require("./User");

const topicSchema = Schema(
  {
    title: { type: String, required: true },
    description: { type: String, required: true },
    tags: [String],
    projectCount: { type: Number, default: 0 },
    projects: [String],
    image: [String],
    isDeleted: { type: Boolean, default: false, select: false },
  },
  { timestamps: true }
);

// topicSchema.statics.calculateTopicCount = async function (userId) {
//   const topicCount = await this.find({
//     $or: [{ from: userId }, { to: userId }],
//     status: "accepted",
//   }).countDocuments();
//   await User.findByIdAndUpdate(userId, { topicCount: topicCount });
// };

// topicSchema.post("save", function () {
//   this.constructor.calculateTopicCount(this.from);
//   this.constructor.calculateTopicCount(this.to);
// });

// topicSchema.pre(/^findOneAnd/, async function (next) {
//   this.doc = await this.findOne();
//   next();
// });

// topicSchema.post(/^findOneAnd/, async function (next) {
//   await this.doc.constructor.calculateTopicCount(this.doc.from);
//   await this.doc.constructor.calculateTopicCount(this.doc.to);
// });

topicSchema.plugin(require("./plugins/isDeletedFalse"));

const Topic = mongoose.model("Topic", topicSchema);
module.exports = Topic;
