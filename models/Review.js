const mongoose = require("mongoose");
const Schema = mongoose.Schema;
const Project = require("./Project");

const reviewSchema = Schema(
  {
    content: { type: String, required: true },
    user: { type: Schema.ObjectId, required: true, ref: "User" },
    project: { type: Schema.ObjectId, required: true, ref: "Project" },
    reactions: {
      laugh: { type: Number, default: 0 },
      sad: { type: Number, default: 0 },
      like: { type: Number, default: 0 },
      love: { type: Number, default: 0 },
      angry: { type: Number, default: 0 },
    },
  },
  { timestamps: true }
);

reviewSchema.statics.calculateReviews = async function (projectId) {
  const reviewCount = await this.find({ project: projectId }).countDocuments();
  await Project.findByIdAndUpdate(projectId, { reviewCount: reviewCount });
};

reviewSchema.post("save", async function () {
  await this.constructor.calculateReviews(this.project);
});

// Neither findByIdAndUpdate norfindByIdAndDelete have access to document middleware.
// They only get access to query middleware
// Inside this hook, this will point to the current query, not the current review.
// Therefore, to access the review, we’ll need to execute the query
reviewSchema.pre(/^findOneAnd/, async function (next) {
  this.doc = await this.findOne();
  next();
});

reviewSchema.post(/^findOneAnd/, async function (next) {
  await this.doc.constructor.calculateReviews(this.doc.project);
});

const Review = mongoose.model("Review", reviewSchema);
module.exports = Review;
