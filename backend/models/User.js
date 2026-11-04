const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');

const userSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: [true, 'Please enter your full name'],
      trim: true,
      maxlength: [100, 'Name cannot exceed 100 characters'],
    },
    email: {
      type: String,
      required: [true, 'Please enter your email address'],
      unique: true,
      lowercase: true,
      trim: true,
      match: [
        /^\w+([.-]?\w+)*@\w+([.-]?\w+)*(\.\w{2,3})+$/,
        'Please enter a valid email address',
      ],
    },
    password: {
      type: String,
      required: [true, 'Please enter a password'],
      minlength: [6, 'Password must be at least 6 characters'],
      select: false, // Don't return password by default
    },
    college: {
      type: String,
      required: [true, 'Please enter your college name'],
      trim: true,
    },
    branch: {
      type: String,
      required: [true, 'Please enter your branch/major'],
      trim: true,
    },
    graduationYear: {
      type: Number,
      required: [true, 'Please enter your graduation year'],
      min: [2000, 'Graduation year must be 2000 or later'],
      max: [2040, 'Graduation year must be reasonable'],
    },
  },
  {
    timestamps: { createdAt: true, updatedAt: true },
  }
);

// Hash password before saving
userSchema.pre('save', async function (next) {
  if (!this.isModified('password')) {
    return next();
  }
  const salt = await bcrypt.genSalt(10);
  this.password = await bcrypt.hash(this.password, salt);
  next();
});

// Compare entered password with hashed password
userSchema.methods.matchPassword = async function (enteredPassword) {
  return await bcrypt.compare(enteredPassword, this.password);
};

// Remove sensitive fields from JSON representation
userSchema.methods.toJSON = function () {
  const user = this.toObject();
  delete user.password;
  return user;
};

// Indexes: email unique constraint is configured in schema definition

const User = mongoose.model('User', userSchema);

module.exports = User;
