const Mongoose = require('mongoose');
const bcrypt = require('bcrypt');

const userSchema = Mongoose.Schema({
  name: {
    type: String,
    required: true,
  },
  email: {
    type: String,
    required: true,
    unique: true,
  },
  password: {
    type: String,
    required: true,
  },
  passwordConfirm: {
    type: String,
    required: true,
  },
  posts: [
    {
      type: Mongoose.Schema.ObjectId,
      ref: 'Post',
    },
  ],
  role: {
    type: String,
    default: 'user',
  },
});

userSchema.pre('save', async function (next) {
  if (!this.isModified('password')) return next();
  this.passwordConfirm = undefined;
  const salt = await bcrypt.genSalt(10);
  this.password = await bcrypt.hash(this.password, salt);
  next();
});

userSchema.methods.correctPassword = async function (
  candidatePassword,
  userPassword
) {
  return await bcrypt.compare(candidatePassword, userPassword);
};

module.exports = Mongoose.model('User', userSchema);
