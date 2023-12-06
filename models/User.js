const mongoose = require('mongoose');

const userSchema = new mongoose.Schema({
  email: String,
  resetToken: String,
  resetTokenExpiry: Date,
  password:String,
});

 const User = mongoose.model('User', userSchema);
 module.exports =User;