const express = require("express");
const projectController = require("../controllers/project.controller");
const router = express.Router();
const authMiddleware = require("../middlewares/authentication");
const validators = require("../middlewares/validators");

/**
 * @route GET api/projects
 * @description Get list of all projects
 * @access Public
 */
router.get("/", projectController.getProjects);

/**
 * @route GET api/projects/topics/:id?page=1&limit=10
 * @description Get projects of a topic with pagination
 * @access Public
 */
router.get("/topics/:id", projectController.getProjectByTopic);

/**
 * @route GET api/projects/following
 * @description Get list of all projects of followed users
 * @access Login required
 */
router.get(
  "/following",
  authMiddleware.loginRequired,
  projectController.getProjectsOfFollowing
);

/**
 * @route GET api/projects/:projectId
 * @description Get details of a single project
 * @access Public
 */
router.get("/:id", projectController.getSelectedProject);

/**
 * @route POST api/projects
 * @description Create a new project in a topic
 * @access Login required
 */
router.post(
  "/",
  authMiddleware.loginRequired,
  projectController.createNewProject
);

/**
 * @route PUT api/projects/:projectId
 * @description Update a project
 * @access Login required
 */
router.put(
  "/:id",
  authMiddleware.loginRequired,
  projectController.updateProject
);

/**
 * @route DELETE api/projects/:projectId
 * @description Delete a project
 * @access Login required
 */
router.delete(
  "/:id",
  authMiddleware.loginRequired,
  projectController.deleteProject
);

module.exports = router;
