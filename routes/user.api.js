const express = require("express");
const router = express.Router();
// const validators = require("../middlewares/validators");
const { body } = require("express-validator");
const authMiddleware = require("../middlewares/authentication");
const userController = require("../controllers/user.controller");

/**
 * @route POST api/users/
 * @description Create user profile
 * @access Public
 */
router.post("/", userController.register);

/**
 * @route PUT api/users/
 * @description Update user profile
 * @access Login required
 */
router.put("/", authMiddleware.loginRequired, userController.updateProfile);

/**
 * @route GET api/users/me
 * @description Get current user info
 * @access Login required
 */
router.get("/me", authMiddleware.loginRequired, userController.getCurrentUser);

/**
 * @route GET api/users?page=1&limit=10
 * @description Get users with pagination
 * @access Login required
 */
router.get("/", userController.getUsers);

module.exports = router;
