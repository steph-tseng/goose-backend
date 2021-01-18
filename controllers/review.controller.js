const {
  AppError,
  catchAsync,
  sendResponse,
} = require("../helpers/utils.helper");
const Review = require("../models/Review");
const Project = require("../models/Project");

const reviewController = {};

reviewController.createNewReview = catchAsync(async (req, res, next) => {
  const userId = req.userId;
  const projectId = req.params.id;
  const { content } = req.body;

  const project = Project.findById(projectId);
  if (!project)
    return next(
      new AppError(404, "Project not found", "Create New Review Error")
    );

  let review = await Review.create({
    user: userId,
    project: projectId,
    content,
  });
  review = await review.populate("User").execPopulate();
  return sendResponse(
    res,
    200,
    true,
    review,
    null,
    "Create new review successful"
  );
});

reviewController.getReviewsOfProject = catchAsync(async (req, res, next) => {
  const projectId = req.params.id;
  const page = parseInt(req.query.page) || 1;
  const limit = parseInt(req.query.limit) || 10;

  const project = Project.findById(projectId);
  if (!project)
    return next(
      new AppError(404, "Project not found", "Create New Review Error")
    );

  const totalReviews = await Review.countDocuments({ project: projectId });
  const totalPages = Math.ceil(totalReviews / limit);
  const offset = limit * (page - 1);

  const reviews = await Review.find({ project: projectId })
    .sort({ createdAt: -1 })
    .skip(offset)
    .limit(limit);

  return sendResponse(res, 200, true, { reviews, totalPages }, null, "");
});

reviewController.updateSingleReview = catchAsync(async (req, res, next) => {
  const userId = req.userId;
  const reviewId = req.params.id;
  const { content } = req.body;

  const review = await Review.findOneAndUpdate(
    { _id: reviewId, user: userId },
    { content },
    { new: true }
  );
  if (!review)
    return next(
      new AppError(
        400,
        "Review not found or User not authorized",
        "Update Review Error"
      )
    );
  return sendResponse(res, 200, true, review, null, "Update successful");
});

reviewController.deleteSingleReview = catchAsync(async (req, res, next) => {
  const userId = req.userId;
  const reviewId = req.params.id;

  const review = await Review.findOneAndDelete({
    _id: reviewId,
    user: userId,
  });
  if (!review)
    return next(
      new AppError(
        400,
        "Review not found or User not authorized",
        "Delete Review Error"
      )
    );
  return sendResponse(res, 200, true, null, null, "Delete successful");
});

module.exports = reviewController;
