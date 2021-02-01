const mongoose = require("mongoose");
const Schema = mongoose.Schema;
const Topic = require("./Topic");
const User = require("./User");

const projectSchema = Schema(
  {
    title: { type: String, required: true },
    content: { type: String, required: true },
    researchQuestion: { type: String },
    tags: [String],
    images: [String],
    author: { type: Schema.Types.ObjectId, required: true, ref: "User" },
    topicId: { type: Schema.Types.ObjectId, ref: "Topic" },
    reactions: {
      love: { type: Number, default: 0 },
      thumbup: { type: Number, default: 0 },
      thumbdown: { type: Number, default: 0 },
      laugh: { type: Number, default: 0 },
      emphasize: { type: Number, default: 0 },
      question: { type: Number, default: 0 },
    },
    reviewCount: { type: Number, default: 0 },
    isDeleted: { type: Boolean, default: false, select: false },
  },
  { timestamps: true }
);

projectSchema.statics.calculateProjectCount = async function (userId) {
  const projectCount = await this.find({
    author: userId,
  }).countDocuments();
  await User.findByIdAndUpdate(userId, { projectCount: projectCount });
};

projectSchema.statics.calculateProjectInTopicCount = async function (topicId) {
  const ProjectCount = await this.find({
    topic: topicId,
  }).countDocuments();
  await Topic.findByIdAndUpdate(topicId, { projectCount: ProjectCount });
};

projectSchema.post("save", function () {
  this.constructor.calculateProjectCount(this.author);
  this.constructor.calculateProjectInTopicCount(this.topic);
});

projectSchema.pre(/^findOneAnd/, async function (next) {
  this.doc = await this.findOne();
  next();
});

projectSchema.post(/^findOneAnd/, async function (next) {
  if (this.doc)
    await this.doc.constructor.calculateProjectCount(this.doc.author);
  if (this.doc)
    await this.doc.constructor.calculateProjectInTopicCount(this.doc.topic);
});

projectSchema.plugin(require("./plugins/isDeletedFalse"));

const Project = mongoose.model("Project", projectSchema);
module.exports = Project;
