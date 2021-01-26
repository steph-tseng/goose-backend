const {
  AppError,
  catchAsync,
  sendResponse,
} = require("../helpers/utils.helper");
const User = require("../models/User");
const Follower = require("../models/Follower");
const bcrypt = require("bcryptjs");
const userController = {};

userController.register = catchAsync(async (req, res, next) => {
  let { name, email, password, avatarURL } = req.body;
  console.log(req.body);
  let user = await User.findOne({ email });
  if (user)
    return next(new AppError(409, "User already exists", "Register Error"));

  const salt = await bcrypt.genSalt(10);
  password = await bcrypt.hash(req.body.password, salt);
  user = await User.create({
    name,
    email,
    password,
    avatarURL,
  });
  const accessToken = await user.generateToken();
  return sendResponse(res, 200, true, { user }, null, "Create user successful");
});

userController.updateProfile = catchAsync(async (req, res, next) => {
  const userId = req.userId;
  const allows = ["name", "password", "avatarURL"];
  const { name, password, avatarURL } = req.body;
  const user = await User.findById(userId);
  if (!user) {
    return next(new AppError(404, "Account not found", "Update Profile Error"));
  }

  allows.forEach((field) => {
    if (req.body[field] !== undefined) {
      user[field] = req.body[field];
    }
  });

  // const userUpdate = await User.findOneAndUpdate(
  //   { _id: userId },
  //   { name, password, avatarURL }
  // );

  await user.save();
  return sendResponse(
    res,
    200,
    true,
    user,
    null,
    "Update Profile successfully"
  );
});

userController.getCurrentUser = catchAsync(async (req, res, next) => {
  const userId = req.userId;
  console.log("process", userId);
  const user = await User.findById(userId);
  if (!user)
    return next(new AppError(400, "User not found", "Get Current User Error"));
  return sendResponse(
    res,
    200,
    true,
    user,
    null,
    "Get current user successful"
  );
});

userController.getUsers = catchAsync(async (req, res, next) => {
  let { page, limit, sortBy, ...filter } = { ...req.query };
  const currentUserId = req.userId;
  page = parseInt(page) || 1;
  limit = parseInt(limit) || 10;

  const totalUsers = await User.countDocuments({
    ...filter,
    isDeleted: false,
  });
  const totalPages = Math.ceil(totalUsers / limit);
  const offset = limit * (page - 1);

  let users = await User.find(filter)
    .sort({ ...sortBy, createdAt: -1 })
    .skip(offset)
    .limit(limit);

  // const promises = users.map(async (user) => {
  //   let temp = user.toJSON();
  //   temp.friendship = await Friendship.findOne(
  //     {
  //       $or: [
  //         { from: currentUserId, to: user._id },
  //         { from: user._id, to: currentUserId },
  //       ],
  //     },
  //     "-_id status updatedAt"
  //   );
  //   return temp;
  // });
  // const usersWithFriendship = await Promise.all(promises);

  return sendResponse(res, 200, true, { users, totalPages }, null, "");
});

userController.startFollowing = catchAsync(async (req, res, next) => {
  const userId = req.userId; // From
  const toUserId = req.params.id; // To

  const user = await User.findById(toUserId);
  if (!user) {
    return next(
      new AppError(400, "User not found", "Send Friend Request Error")
    );
  }

  console.log("hi");
  let following = await Follower.findOne({
    follower: userId,
    following: toUserId,
  });
  // following.status = "following";
  if (!following) {
    await Follower.create({
      follower: userId,
      following: toUserId,
      status: "following",
    });
    return sendResponse(
      res,
      200,
      true,
      null,
      null,
      "You are now following this user"
    );
  } else {
    return next(
      new AppError(
        400,
        "You are already following this user",
        "Follow Request Error"
      )
    );
  }
  // } else {
  //   switch (following.status) {
  //     case "following":
  //       if (friendship.follower.equals(userId)) {
  //         return next(
  //           new AppError(
  //             400,
  //             "You are already following this user",
  //             "Follow User Error"
  //           )
  //         );
  //       } else {
  //         return next(
  //           new AppError(
  //             400,
  //             "You have received a request from this user",
  //             "Follow User Error"
  //           )
  //         );
  //       }
  //       break;
  //     case "accepted":
  //       return next(
  //         new AppError(400, "Users are already friend", "Add Friend Error")
  //       );
  //       break;
  //     case "removed":
  //     case "decline":
  //     case "cancel":
  //       friendship.from = userId;
  //       friendship.to = toUserId;
  //       friendship.status = "requesting";
  //       await friendship.save();
  //       return sendResponse(res, 200, true, null, null, "Request has ben sent");
  //       break;
  //     default:
  //       break;
  //   }
  // }
});

userController.stopFollowing = catchAsync(async (req, res, next) => {
  const userId = req.userId; // From
  const toUserId = req.params.id; // To

  const user = await User.findById(toUserId);
  if (!user) {
    return next(
      new AppError(400, "User not found", "Send Friend Request Error")
    );
  }

  let following = await Follower.findOneAndDelete({
    follower: userId,
    following: toUserId,
  });
  if (!following) {
    return next(
      new AppError(
        400,
        "Already unfollowed or User not following this User",
        "Unfollow User Error"
      )
    );
  }

  return sendResponse(
    res,
    200,
    true,
    null,
    null,
    "You have stopped following this user"
  );
});

userController.getFollowingList = catchAsync(async (req, res, next) => {
  let { page, limit, sortBy, ...filter } = { ...req.query };
  const userId = req.userId;
  page = parseInt(page) || 1;
  limit = parseInt(limit) || 10;
  console.log("hi");

  let followingList = await Follower.find({
    follower: userId,
    status: "following",
  });

  const followingIds = followingList.map((item) => item.following);

  const totalFollowing = await User.countDocuments({
    ...filter,
    isDeleted: false,
    _id: { $in: followingIds },
  });
  const totalPages = Math.ceil(totalFollowing / limit);
  const offset = limit * (page - 1);

  let users = await User.find({ ...filter, _id: { $in: followingIds } })
    .sort({ ...sortBy, createdAt: -1 })
    .skip(offset)
    .limit(limit);

  return sendResponse(res, 200, true, { users, totalPages }, null, null);
});

module.exports = userController;
