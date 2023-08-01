/* eslint-disable quotes */
const { model, Schema } = require('mongoose');
const bcrypt = require('bcrypt');
const crypto = require('crypto');

const userRolesEnum = require('../constans/userRolesEnum');

const userSchema = new Schema(
  {
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
    avatar: String,
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
    const emailHesh = crypto.createHash('md5').update(this.email).digest('hex');

    this.avatar = `https:www.gravatar.com/avatar/${emailHesh}.jpg?d=robohash`;
  }

  if (!this.isModified('password')) return next();

  const salt = await bcrypt.genSalt(10);
  this.password = await bcrypt.hash(this.password, salt);

  next();
});

// Custom mongoose method to validate password.
userSchema.methods.checkPassword = (candidate, hash) =>
  bcrypt.compare(candidate, hash);

const User = model('User', userSchema);

module.exports = User;
