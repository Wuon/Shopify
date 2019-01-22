const mongoose = require('mongoose');
const bcrypt = require('bcrypt');

// user documents setup
const UserSchema = new mongoose.Schema({
  username: {
    type: String,
    required: true,
    unique: true,
  },
  password: {
    type: String,
    required: true,
  },
});

// before saving user, hash the password by performing salt rounds 12 times
// can be scaled as computer performance increases.
UserSchema.pre('save', async function hash(next) {
  this.password = await bcrypt.hash(this.password, 12);
  next();
});

// compares hashed password with given hashed
UserSchema.methods.isValid = function compare(password) {
  return bcrypt.compare(password, this.password);
};

const UserModel = mongoose.model('user', UserSchema);

module.exports = UserModel;
