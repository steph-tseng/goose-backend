const {
  AppError,
  catchAsync,
  sendResponse,
} = require("../helpers/utils.helper");
const Topic = require("../models/Topic");
const topicController = {};

// TODO
topicController.getTopics = catchAsync(async (req, res, next) => {
  let { page, limit, sortBy, ...filter } = { ...req.query };
  page = parseInt(page) || 1;
  limit = parseInt(limit) || 10;

  const totalTopics = await Topic.countDocuments({
    ...filter,
    isDeleted: false,
  });
  const totalPages = Math.ceil(totalTopics / limit);
  const offset = limit * (page - 1);

  // console.log({ filter, sortBy });
  const topics = await Topic.find(filter)
    .sort({ ...sortBy, createdAt: -1 })
    .skip(offset)
    .limit(limit)
    .populate("author");

  return sendResponse(res, 200, true, { topics, totalPages }, null, "");
});

topicController.getSelectedTopic = catchAsync(async (req, res, next) => {
  let topic = await Topic.findById(req.params.id).populate("author");
  if (!topic)
    return next(
      new AppError(404, "Topic not found", "Get specific topic error")
    );
  topic = topic.toJSON();
  return sendResponse(res, 200, true, topic, null, null);
});

topicController.createNewTopic = catchAsync(async (req, res, next) => {
  const author = req.userId;
  const { title, description } = req.body;

  const topic = await Topic.create({ title, description, author });

  return sendResponse(
    res,
    200,
    true,
    topic,
    null,
    "Successfully created a new topic"
  );
});

topicController.deleteTopic = catchAsync(async (req, res, next) => {
  const topicId = req.params.id;

  const topic = await Topic.findOneAndUpdate(
    { _id: topicId },
    { isDeleted: true },
    { new: true }
  );
  if (!topic)
    return next(
      new AppError(
        400,
        "Topic not found or User not authorized",
        "Delete Topic Error"
      )
    );
  return sendResponse(res, 200, true, null, null, "Topic deleted successfully");
});

module.exports = topicController;
