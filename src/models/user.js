const mongoose = require('mongoose');

const bcrypt = require('bcrypt');
const crypto = require('crypto');
const jwt = require('jsonwebtoken');

const Schema = mongoose.Schema;

const UserSchema = new Schema({
  name: {
    type: String,
    required: true
  },
  lastName: {
    type: String,
    required: true
  },
  email: {
    type: String,
    unique: true,
    required: true,
    lowercase: true,
    trim: true
  },
  emailChecked: {
    type: Boolean,
    required: true,
    default: false
  },
  emailToken: {
    type: String,
    select: false
  },
  password: {
    type: String,
    required: true,
    select: false
  },
  passwordResetToken: {
    type: String,
    select: false
  },
  passwordResetExpires: {
    type: Date,
    select: false
  },
  cartsIds: [{ type: Schema.Types.ObjectId, ref: 'Cart' }],
  storeId: {
    type: Schema.Types.ObjectId,
    required: true,
    ref: 'Store'
  },
  createdAt: {
    type: Date,
    default: Date.now
  }
});

UserSchema.pre('save', async function(next) {
  if (this.isModified('password') || this.isNew) {
    const hash = await bcrypt.hash(this.password, 10);
    this.password = hash;
  }

  next();
});

UserSchema.methods.getToken = function() {
  return jwt.sign({ userId: this._id }, process.env.SECRET_OR_KEY, {
    expiresIn: '5h'
  });
};

UserSchema.methods.createEmailToken = function() {
  return crypto.randomBytes(16).toString('hex') + this._id.toString();
};

module.exports = mongoose.model('User', UserSchema);
