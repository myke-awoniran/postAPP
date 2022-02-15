const Mongoose = require('mongoose');
const User = require('../models/userModel');

const PostSchema = Mongoose.Schema({
  title: {
    type: String,
    require: true,
    unique: true,
  },
  content: {
    type: String,
  },
  creator: {
    type: Mongoose.Schema.ObjectId,
    ref: 'User',
  },
  createAt: { type: Date, default: new Date() },
});

module.exports = Mongoose.model('Post', PostSchema);
