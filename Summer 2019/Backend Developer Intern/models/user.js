const mongoose = require('mongoose');
const bcrypt = require('bcrypt');

const UserSchema = new mongoose.Schema({
  username: {
    type: String,
    required: true,
    unique: true,
  },
  password: {
    type: String,
    required: true,
  }
});

UserSchema.pre('save', async function hash(next) {
  this.password = await bcrypt.hash(this.password, 12);
  next();
});

UserSchema.methods.isValid = function compare(password) {
  return bcrypt.compare(password, this.password);
};

const UserModel = mongoose.model('user', UserSchema);

module.exports = UserModel;
