const express = require("express");
const projectController = require("../controllers/project.controller");
const router = express.Router();
const authMiddleware = require("../middlewares/authentication");

/**
 * @route GET api/projects
 * @description Get list of all projects
 * @access Public
 */
router.get("/", projectController.getProjects);

/**
 * @route GET api/topics/:topicId/:projectId
 * @description Get details of a single project
 * @access Public
 */

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
 * @route PUT api/topics/:topicId/:projectId
 * @description Update a project
 * @access Login required
 */

/**
 * @route
 * @description
 * @access
 */

module.exports = router;
