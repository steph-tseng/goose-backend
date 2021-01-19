var express = require("express");
var router = express.Router();

// userApi
const userApi = require("./user.api");
router.use("/users", userApi);

// authApi
const authApi = require("./auth.api");
router.use("/auth", authApi);

// topicApi
const topicApi = require("./topic.api");
router.use("/topics", topicApi);

// projectApi
const projectApi = require("./project.api");
router.use("/projects", projectApi);

// reviewApi
const reviewApi = require("./review.api");
router.use("/reviews", reviewApi);

// reactionApi
const reactionApi = require("./reaction.api");
router.use("/reactions", reactionApi);

module.exports = router;
