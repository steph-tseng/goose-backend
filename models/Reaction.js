const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const reactionSchema = Schema(
  {
    user: { type: Schema.ObjectId, required: true, ref: "User" },
    targetType: {
      type: String,
      required: true,
      enum: ["Project", "Review"],
    },
    targetId: {
      type: Schema.ObjectId,
      required: true,
      refPath: "targetType",
    },
    emoji: {
      type: String,
      required: true,
      enum: ["love", "thumbup", "thumbdown", "laugh", "emphasize", "question"],
    },
  },
  { timestamps: true }
);

reactionSchema.statics.calculateReaction = async function (
  targetId,
  targetType
) {
  const stats = await this.aggregate([
    {
      $match: { targetId },
    },
    {
      $group: {
        _id: "$targetId",
        love: {
          $sum: {
            $cond: [{ $eq: ["$emoji", "love"] }, 1, 0],
          },
        },
        thumbup: {
          $sum: {
            $cond: [{ $eq: ["$emoji", "thumbup"] }, 1, 0],
          },
        },
        thumbdown: {
          $sum: {
            $cond: [{ $eq: ["$emoji", "thumbdown"] }, 1, 0],
          },
        },
        laugh: {
          $sum: {
            $cond: [{ $eq: ["$emoji", "laugh"] }, 1, 0],
          },
        },
        emphasize: {
          $sum: {
            $cond: [{ $eq: ["$emoji", "emphasize"] }, 1, 0],
          },
        },
        question: {
          $sum: {
            $cond: [{ $eq: ["$emoji", "question"] }, 1, 0],
          },
        },
      },
    },
  ]);
  await mongoose.model(targetType).findByIdAndUpdate(targetId, {
    reactions: {
      love: (stats[0] && stats[0].love) || 0,
      thumbup: (stats[0] && stats[0].thumbup) || 0,
      thumbdown: (stats[0] && stats[0].thumbdown) || 0,
      laugh: (stats[0] && stats[0].laugh) || 0,
      emphasize: (stats[0] && stats[0].emphasize) || 0,
      question: (stats[0] && stats[0].question) || 0,
    },
  });
};

reactionSchema.post("save", async function () {
  // this point to current review
  await this.constructor.calculateReaction(this.targetId, this.targetType);
});

reactionSchema.pre(/^findOneAnd/, async function (next) {
  this.doc = await this.findOne();
  next();
});

reactionSchema.post(/^findOneAnd/, async function (next) {
  await this.doc.constructor.calculateReaction(
    this.doc.targetId,
    this.doc.targetType
  );
});

const Reaction = mongoose.model("Reaction", reactionSchema);
module.exports = Reaction;
