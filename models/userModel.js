/* eslint-disable quotes */
const { model, Schema } = require('mongoose');
const bcrypt = require('bcrypt');
const crypto = require('crypto');

const userRolesEnum = require('../constans/userRolesEnum');

const userSchema = new Schema(
  {
    name: {
      type: String,
      required: [true, 'Set name for contact'],
    },
    email: {
      type: String,
      required: [true, 'Email is required'],
      unique: [true, 'Dublicated email..'],
    },
    password: {
      type: String,
      required: [true, 'Set password for user'],
      select: false,
    },
    subscription: {
      type: String,
      enum: Object.values(userRolesEnum),
      default: userRolesEnum.STARTER,
    },
    token: {
      type: String,
      default: '',
    },
    avatarURL: String,
    passwordResetToken: String,
    passwordResetExpires: Date,
  },

  {
    timestamps: true,
    versionKey: false,
  }
);

/**
 * Pre save mongoose hook. Fires on Create and Save
 */
userSchema.pre('save', async function (next) {
  if (this.isNew) {
    const emailHash = crypto.createHash('md5').update(this.email).digest('hex');

    this.avatarURL = `https://www.gravatar.com/avatar/${emailHash}.jpg?d=robohash`;
  }

  if (!this.isModified('password')) return next();

  const salt = await bcrypt.genSalt(10);
  this.password = await bcrypt.hash(this.password, salt);

  next();
});

// Custom mongoose method to validate password.
userSchema.methods.checkPassword = (candidate, hash) =>
  bcrypt.compare(candidate, hash);

userSchema.method.createPasswordResetToken = function () {
  const resetToken = crypto.randomBytes(32).toString('hex');

  this.passwordResetToken = crypto
    .createHash('sha256')
    .update(resetToken)
    .digest('hex');
  this.passwordResetExpires = Date.now() + 10 * 60 * 1000;

  return resetToken;
};

const User = model('User', userSchema);

module.exports = User;
