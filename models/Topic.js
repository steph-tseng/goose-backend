const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const TopicSchema = Schema(
  {
    title: { type: String, required: true },
    body: { type: String, required: true },
    tags: [String],
    projectCount: { type: Number },
    isDeleted: { type: Boolean, default: false, select: false },
  },
  { timestamps: true }
);

TopicSchema.plugin(require("./plugins/isDeletedFalse"));

const Topic = mongoose.model("Topic", TopicSchema);
module.exports = Topic;
