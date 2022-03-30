const User = require('../models/userModel');
const AppError = require('../utils/AppError');
const jwt = require('jsonwebtoken');
const bcrypt = require('bcrypt');

//sending token to the user
function sendToken(id) {
  return jwt.sign({ id }, process.env.SECRET, {
    expiresIn: process.env.EXPIRES_IN,
  });
}

exports.signup = async (req, res, next) => {
  try {
    let newUser = await User.create(req.body);
    res.status(200).json({
      status: 'success',
      newUser,
      token: sendToken(newUser._id),
    });
  } catch (err) {
    res.status(400).json({
      status: `fail`,
      message: `${err.status === 11000}`
        ? 'Oops!! there is a user with the provided email address'
        : 'Kindly try again',
    });
  }
};

exports.login = async (req, res, next) => {
  try {
    const { email, password } = req.body;
    if (!email || !password) {
      return next(new AppError('oops!! invalid username or password', 400));
    }
    let user = await User.findOne({ email }).select('+password');

    if (!user || !(await user.correctPassword(password, user.password))) {
      return next(new AppError('oops!! invalid username or password', 400));
    }
    res.status(200).json({
      status: 'success',
      token: sendToken(user._id),
      user,
      totalPosts: user.posts.length,
      userId: user._id,
    });
  } catch (err) {
    next(err);
  }
};

//this is for protecting routes
exports.protect = async (req, res, next) => {
  try {
    let token;
    if (
      req.headers.authorization &&
      req.headers.authorization.startsWith('Bearer')
    ) {
      token = req.headers.authorization.split(' ')[1];
    }
    if (!token) {
      return next(new AppError('you are not logged in, login to access', 401));
    }
    const user_Id = jwt.verify(token, process.env.SECRET).id;
    const currentUser = await User.findById(user_Id);
    if (!currentUser) {
      return next(
        new AppError(`The user with the provided token doesn't exist`, 401)
      );
    }
    req.user = currentUser;
    req.userId = user_Id;
    next();
  } catch (err) {
    next(err);
  }
};

exports.getMe = async (req, res, next) => {
  try {
    const user = await User.findOne(
      { _id: req.user.id },
      { password: 0, __v: 0 }
    ).populate({ path: 'posts', select: '-__v' });
    res.status(200).json({
      status: 'success',
      user,
      no_of_posts: user.posts.length,
    });
  } catch (err) {
    console.log(err);
    next(new AppError('kindly try again', 500));
  }
};

exports.getAllUsers = async (req, res, next) => {
  try {
    const users = await User.find(
      {},
      {
        name: 1,
        email: 1,
        posts: 1,
      }
    ).populate({ path: 'posts', select: '-__v' });
    if (users.length === 0) {
      return next(new AppError('no user found', 404));
    }
    res.status(200).json({
      users,
    });
  } catch {
    err;
    next(err);
  }
};
