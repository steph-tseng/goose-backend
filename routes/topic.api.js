const express = require("express");
const topicController = require("../controllers/topic.controller");
const router = express.Router();
const authMiddleware = require("../middlewares/authentication");
const validators = require("../middlewares/validators");
const { body, param } = require("express-validator");

/**
 * @route GET api/topics
 * @description Get list of topics
 * @access Public
 */
router.get("/", topicController.getTopics);

/**
 * @route GET api/topics/:topicId
 * @description Get list of projects inside of topic
 * @access Public
 */
router.get("/:id", topicController.getSelectedTopic);

/**
 * @route POST api/topics
 * @description Create a new topic
 * @access Login required
 */
router.post("/", authMiddleware.loginRequired, topicController.createNewTopic);

/**
 * @route PUT api/topics/:topicId
 * @description Update a topic
 * @access Login required
 */

/**
 * @route DELETE api/topics/:topicId
 * @description Delete a topic
 * @access Admin only
 */
router.delete(
  "/:id",
  authMiddleware.loginRequired,
  validators.validate([
    param("id").exists().isString().custom(validators.checkObjectId),
  ]),
  topicController.deleteTopic
);

module.exports = router;
