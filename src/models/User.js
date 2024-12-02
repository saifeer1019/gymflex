// File: models/User.js
import mongoose from 'mongoose';
import bcrypt from 'bcryptjs';

// Define possible user roles
const UserRole = ['admin', 'trainer', 'trainee'];

const UserSchema = new mongoose.Schema({
  email: {
    type: String,
    required: [true, 'Please provide an email'],
    unique: true,
    lowercase: true,
    trim: true,
    match: [/^\w+([.-]?\w+)*@\w+([.-]?\w+)*(\.\w{2,3})+$/, 'Please fill a valid email address']
  },
  password: {
    type: String,
    required: [true, 'Please provide a password'],
    minlength: 6,
    select: false // Prevents password from being returned in queries
  },
  name: {
    type: String,
    trim: true
  },
  specialization: {
    type: String,
    trim: true
  },
  role: {
    type: String,
    enum: UserRole,
    default: 'trainee',
    required: true
  }
}, { 
  timestamps: true,
  toJSON: { virtuals: true },
  toObject: { virtuals: true }
});

// Hash password before saving
UserSchema.pre('save', async function(next) {
  if (!this.isModified('password')) return next();
  
  try {
    const salt = await bcrypt.genSalt(10);
    this.password = await bcrypt.hash(this.password, salt);
    next();
  } catch (error) {
    next(error);
  }
});

// Method to compare passwords
UserSchema.methods.comparePassword = async function(candidatePassword) {
  return bcrypt.compare(candidatePassword, this.password);
};

// Create or get existing model
const User = mongoose.models.User || mongoose.model('User', UserSchema);

export default User;
