const jwt = require("jsonwebtoken");
const JWT_SECRET_KEY = process.env.JWT_SECRET_KEY;
const { AppError } = require("../helpers/utils.helper");
const authMiddleware = {};

authMiddleware.loginRequired = (req, res, next) => {
  try {
    const tokenString = req.headers.authorization;
    console.log("ssssss", tokenString);
    if (!tokenString)
      return next(new AppError(401, "Login required", "Validation Error"));
    if (tokenString.includes("Bearer Bearer")) {
      const token = tokenString.replace("Bearer Bearer ", "");
      jwt.verify(token, JWT_SECRET_KEY, (err, payload) => {
        if (err) {
          if (err.name === "TokenExpiredError") {
            return next(new AppError(401, "Token expired", "Validation Error"));
          } else {
            return next(
              new AppError(401, "Token is invalid", "Validation Error")
            );
          }
        }
        // console.log(payload);
        req.userId = payload._id;
      });
    } else if (tokenString.includes("Bearer ")) {
      const token = tokenString.replace("Bearer ", "");
      jwt.verify(token, JWT_SECRET_KEY, (err, payload) => {
        if (err) {
          if (err.name === "TokenExpiredError") {
            return next(new AppError(401, "Token expired", "Validation Error"));
          } else {
            return next(
              new AppError(401, "Token is invalid", "Validation Error")
            );
          }
        }
        // console.log(payload);
        req.userId = payload._id;
      });
    } else {
      const token = tokenString;
      jwt.verify(token, JWT_SECRET_KEY, (err, payload) => {
        if (err) {
          if (err.name === "TokenExpiredError") {
            return next(new AppError(401, "Token expired", "Validation Error"));
          } else {
            return next(
              new AppError(401, "Token is invalid", "Validation Error")
            );
          }
        }
        // console.log(payload);
        req.userId = payload._id;
      });
    }

    next();
  } catch (error) {
    next(error);
  }
};

module.exports = authMiddleware;
