const {
  AppError,
  catchAsync,
  sendResponse,
} = require("../helpers/utils.helper");
const Follower = require("../models/Follower");
const Project = require("../models/Project");
const projectController = {};

// TODO
projectController.getProjects = catchAsync(async (req, res, next) => {
  let { page, limit, sortBy, ...filter } = { ...req.query };
  page = parseInt(page) || 1;
  limit = parseInt(limit) || 10;
  // console.log("SEARCH AUTHOR", filter);

  const totalProjects = await Project.countDocuments({
    ...filter,
    isDeleted: false,
  });
  const totalPages = Math.ceil(totalProjects / limit);
  const offset = limit * (page - 1);

  const projects = await Project.find({ ...filter })
    .sort({ ...sortBy, createdAt: -1 })
    .skip(offset)
    .limit(limit)
    .populate("author")
    .populate("topic");
  return sendResponse(res, 200, true, { projects, totalPages }, null, "");
});

projectController.getProjectsOfFollowing = catchAsync(
  async (req, res, next) => {
    let { page, limit, sortBy, ...filter } = { ...req.query };
    page = parseInt(page) || 1;
    limit = parseInt(limit) || 10;
    const currentUserId = req.userId;
    console.log({ currentUserId });
    let followings = await Follower.find({ follower: currentUserId }).select(
      "following"
    );
    followings = followings.map((f) => f.following);
    console.log({ followings });
    const promises = followings.map(
      async (user) =>
        await Project.find({ author: user })
          .populate("author")
          .populate("topic")
    );
    let projects = await Promise.all(promises);
    projects = projects.flat();
    // console.log("SEARCH AUTHOR", filter);
    console.log({ projects });
    const totalProjects = projects.length;
    const totalPages = Math.ceil(totalProjects / limit);
    const offset = limit * (page - 1);

    projects = projects.slice(offset, offset + limit);
    return sendResponse(res, 200, true, { projects, totalPages }, null, "");
  }
);

projectController.getSelectedProject = catchAsync(async (req, res, next) => {
  let project = await Project.findById(req.params.id)
    .populate("author")
    .populate("topic");
  if (!project)
    return next(
      new AppError(404, "Project not found", "Get specific topic error")
    );
  project = project.toJSON();
  return sendResponse(res, 200, true, project, null, null);
});

projectController.createNewProject = catchAsync(async (req, res, next) => {
  const author = req.userId;
  // const topic = req.topicId;
  console.log("redaasdadf", req.body);
  const { title, content, topicId, tags } = req.body;
  console.log("kkkkkkk", { title, content, topicId, tags });
  const project = await Project.create({
    title,
    content,
    tags,
    topicId,
    author,
  });

  return sendResponse(
    res,
    200,
    true,
    project,
    null,
    "Successfully created a new project"
  );
});

projectController.updateProject = catchAsync(async (req, res, next) => {
  // console.log(req);
  const author = req.userId;
  const projectId = req.params.id;
  const { title, content, tags, topicId } = req.body;

  const project = await Project.findOneAndUpdate(
    { _id: projectId, author: author },
    { title, content, tags, topicId },
    { new: true }
  );

  if (!project)
    return next(
      new AppError(
        400,
        "Project not found or User not authorized",
        "Update project error"
      )
    );
  return sendResponse(
    res,
    200,
    true,
    project,
    null,
    "Update project successful"
  );
});

projectController.deleteProject = catchAsync(async (req, res, next) => {
  const author = req.userId;
  const projectId = req.params.id;

  const project = await Project.findOneAndUpdate(
    { _id: projectId, author: author },
    { isDeleted: true },
    { new: true }
  );
  if (!project)
    return next(
      new AppError(
        400,
        "Project not found or User not authorized",
        "Delete Project Error"
      )
    );
  return sendResponse(res, 200, true, null, null, "Delete Blog successful");
});

module.exports = projectController;
