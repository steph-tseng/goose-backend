const express = require("express");
const router = express.Router();
const authMiddleware = require("../middlewares/authentication");
const validators = require("../middlewares/validators");
const userController = require("../controllers/user.controller");
const { body, param } = require("express-validator");

/**
 * @route POST api/following/add/:id
 * @description Start following a user
 * @access Login required
 */
router.post(
  "/:id",
  authMiddleware.loginRequired,
  validators.validate([
    param("id").exists().isString().custom(validators.checkObjectId),
  ]),
  userController.startFollowing
);

/**
 * @route DELETE api/following/add/:id
 * @description Stop following a user
 * @access Login required
 */
router.delete(
  "/:id",
  authMiddleware.loginRequired,
  validators.validate([
    param("id").exists().isString().custom(validators.checkObjectId),
  ]),
  userController.stopFollowing
);

/**
 * @route GET api/following/add
 * @description Get the list of people the user follows
 * @access Login required
 */
router.get("/", authMiddleware.loginRequired, userController.getFollowingList);

module.exports = router;
