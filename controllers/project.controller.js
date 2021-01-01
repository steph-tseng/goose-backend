const {
  AppError,
  catchAsync,
  sendResponse,
} = require("../helpers/utils.helper");
const Project = require("../models/Project");
const projectController = {};

// TODO
projectController.getProjects = catchAsync(async (req, res, next) => {
  let { page, limit, sortBy, ...filter } = { ...req.query };
  page = parseInt(page) || 1;
  limit = parseInt(limit) || 10;

  const totalProjects = await Project.countDocuments({
    ...filter,
    isDeleted: false,
  });
  const totalPages = Math.ceil(totalProjects / limit);
  const offset = limit * (page - 1);

  const projects = await Project.find(filter)
    .sort({ ...sortBy, createdAt: -1 })
    .skip(offset)
    .limit(limit)
    .populate("author");

  return sendResponse(res, 200, true, { projects, totalPages }, null, "");
});

projectController.createNewProject = catchAsync(async (req, res, next) => {
  const author = req.userId;
  const { title, content, tags } = req.body;

  const project = await Project.create({ title, content, tags, author });

  return sendResponse(
    res,
    200,
    true,
    project,
    null,
    "Successfully created a new project"
  );
});

module.exports = projectController;
