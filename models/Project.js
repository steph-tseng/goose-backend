const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const projectSchema = Schema(
  {
    title: { type: String, required: true },
    content: { type: String, required: true },
    researchQuestion: { type: String },
    tags: [String],
    author: { type: Schema.Types.ObjectId, required: true, ref: "User" },
    topic: { type: Schema.Types.ObjectId, ref: "Topic" },
    projectCount: { type: Number },
    isDeleted: { type: Boolean, default: false, select: false },
  },
  { timestamps: true }
);

projectSchema.statics.calculateProjectCount = async function (userId) {
  const ProjectCount = await this.find({
    $or: [{ from: userId }, { to: userId }],
    status: "accepted",
  }).countDocuments();
  await User.findByIdAndUpdate(userId, { ProjectCount: ProjectCount });
};

projectSchema.post("save", function () {
  this.constructor.calculateProjectCount(this.from);
  this.constructor.calculateProjectCount(this.to);
});

projectSchema.pre(/^findOneAnd/, async function (next) {
  this.doc = await this.findOne();
  next();
});

projectSchema.post(/^findOneAnd/, async function (next) {
  await this.doc.constructor.calculateProjectCount(this.doc.from);
  await this.doc.constructor.calculateProjectCount(this.doc.to);
});

projectSchema.plugin(require("./plugins/isDeletedFalse"));

const Project = mongoose.model("Project", projectSchema);
module.exports = Project;
