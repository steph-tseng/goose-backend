const utilsHelper = require("./helpers/utils.helper");

var express = require("express");
require("dotenv").config();
var path = require("path");
var cookieParser = require("cookie-parser");
var logger = require("morgan");
const cors = require("cors");
const mongoose = require("mongoose");
const MONGODB_URI = process.env.MONGODB_URI;
const passport = require("passport");
require("./middlewares/passport");

var indexRouter = require("./routes/index");

var app = express();

app.use(logger("dev"));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(cors());
app.use(express.static(path.join(__dirname, "public")));
app.use(passport.initialize());

mongoose
  .connect(MONGODB_URI, {
    // to get rid of deprecated warning
    useCreateIndex: true,
    useNewUrlParser: true,
    useFindAndModify: true,
    useUnifiedTopology: true,
    useFindAndModify: false,
  })
  .then(() => {
    // console.log(`Mongoose connected to ${MONGODB_URI}`);
    console.log("The goose has flown");
    // require("./testing/testSchema");
  })
  .catch((err) => console.log(err));

/* Initialize Routes */
app.use("/api", indexRouter);

// catch 404 and forard to error handler
app.use((req, res, next) => {
  const err = new Error("Not Found");
  err.statusCode = 404;
  next(err);
});

/* Initialize Error Handling */
app.use((err, req, res, next) => {
  console.log("ERROR", err);
  if (err.isOperational) {
    return utilsHelper.sendResponse(
      res,
      err.statusCode ? err.statusCode : 500,
      false,
      null,
      { message: err.message },
      err.errorType
    );
  } else {
    return utilsHelper.sendResponse(
      res,
      err.statusCode ? err.statusCode : 500,
      false,
      null,
      { message: err.message },
      "Internal Server Error"
    );
  }
});

module.exports = app;
