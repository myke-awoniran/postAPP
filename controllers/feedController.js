const Post = require('../models/postModel');
const AppError = require('../utils/AppError');
const User = require('../models/userModel');

exports.home = (req, res, next) => {
  res.status(200).json({
    status: 'success',
    message: 'welcome to Publisher  ',
  });
};

exports.addPost = async (req, res, next) => {
  try {
    const newPost = await Post.create({
      email: req.body.email,
      title: req.body.title,
      content: req.body.content,
      creator: req.userId,
    });
    const userPost = await User.findById(req.userId);
    const posts = userPost.posts.push(newPost._id);
    await userPost.save({ validateBeforeSave: false });
    res.status(201).json({
      status: 'success',
      newPost,
    });
  } catch (err) {
    console.log(err);
    res.status(500).json({
      status: 'fail',
      message: `fail to create post, ${
        err.code === 11000
          ? 'Duplicate title is not allowed'
          : 'kindly try again'
      }`,
    });
  }
};

// to get all posts from the database
exports.getPosts = async (req, res, next) => {
  try {
    const posts = await Post.find({}, { __v: 0 })
      .populate('creator')
      .limit(req.query.limit)
      .skip((req.query.page - 1) * req.query.limit);
    if (posts.length === 0) {
      return next(new AppError('no post found', 404));
    }
    res.status(200).json({
      status: 'success',
      results: posts.length,
      posts,
    });
  } catch (err) {
    next(new AppError('fail to get posts!!! Try again,', 400));
  }
};

// to delete a post from the collection
exports.deletePost = async (req, res, next) => {
  try {
    const post = await Post.findByIdAndDelete(req.params.postId);
    res.status(204).json({
      status: 'success',
    });
    const user = await User.findById(req.userId);
    const deletePost = await user.posts.pull(post);
    deletePost.save();
  } catch (err) {
    next(new AppError('something went very wrong', 500));
  }
};

// to get a single post
exports.getPost = async (req, res, next) => {
  try {
    const post = await Post.findById(req.params.postId).populate({
      path: 'creator',
      select: 'name',
    });
    if (!post) {
      return next(new AppError('no post found', 404));
    }
    res.status(200).json({
      status: 'success',
      post,
    });
  } catch (err) {
    next(new AppError('fail to get Post!!!', 500));
  }
};

// a handler to update the post
exports.updatePost = async (req, res, next) => {
  try {
    const updatedPost = await Post.findByIdAndUpdate(
      req.params.postId,
      req.body,
      {
        new: true,
        runValidators: true,
      }
    );
    if (!updatedPost) {
      return next(new AppError('Post not found !!!', 404));
    }
    res.status(200).json({
      status: 'success',
      updatedPost,
    });
  } catch (err) {
    next(new AppError('fail to update post!!!, try again later'), 500);
  }
};
