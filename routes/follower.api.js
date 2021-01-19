const express = require("express");
const router = express.Router();
const authMiddleware = require("../middlewares/authentication");
const validators = require("../middlewares/validators");
const userController = require("../controllers/user.controller");
const { body, param } = require("express-validator");

/**
 * @route POST api/friends/add/:id
 * @description Start following a user
 * @access Login required
 */
router.post(
  "/add/:id",
  authMiddleware.loginRequired,
  validators.validate([
    param("id").exists().isString().custom(validators.checkObjectId),
  ]),
  userController.startFollowing
);

/**
 * @route DELETE api/friends/add/:id
 * @description Stop following a user
 * @access Login required
 */
router.delete(
  "/add/:id",
  authMiddleware.loginRequired,
  validators.validate([
    param("id").exists().isString().custom(validators.checkObjectId),
  ]),
  userController.stopFollowing
);

/**
 * @route GET api/friends/add
 * @description Get the list of people the user follows
 * @access Login required
 */
router.get(
  "/add",
  authMiddleware.loginRequired,
  userController.getSentFollowingList
);

/**
 * @route GET api/friends
 * @description Get the list of friends
 * @access Login required
 */
router.get("/", authMiddleware.loginRequired, userController.getFollowerList);

// /**
//  * @route DELETE api/friends/:id
//  * @description Remove a friend
//  * @access Login required
//  */
// router.delete(
//   "/:id",
//   authMiddleware.loginRequired,
//   validators.validate([
//     param("id").exists().isString().custom(validators.checkObjectId),
//   ]),
//   userController.removeFriendship
// );

module.exports = router;
