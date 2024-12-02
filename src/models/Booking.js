import mongoose from 'mongoose';

const bookingSchema = new mongoose.Schema({
  trainee: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: [true, 'Trainee is required']
  },
  class: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Class',
    required: [true, 'Class is required']
  },
  status: {
    type: String,
    enum: ['confirmed', 'cancelled', 'attended', 'no-show'],
    default: 'confirmed'
  },
  bookingDate: {
    type: Date,
    default: Date.now
  }
}, {
  timestamps: true
});

// Middleware to check class capacity before booking
bookingSchema.pre('save', async function(next) {
  if (this.isNew) {
    const classDoc = await mongoose.model('Class').findById(this.class);
    
    if (!classDoc) {
      throw new Error('Class not found');
    }

    if (classDoc.currentEnrollment >= classDoc.maxCapacity) {
      throw new Error('Class is already full');
    }

    // Increment the current enrollment
    await mongoose.model('Class').findByIdAndUpdate(
      this.class,
      { $inc: { currentEnrollment: 1 } }
    );
  }
  next();
});

// Decrement enrollment when booking is cancelled
bookingSchema.pre('save', async function(next) {
  if (this.isModified('status') && this.status === 'cancelled') {
    await mongoose.model('Class').findByIdAndUpdate(
      this.class,
      { $inc: { currentEnrollment: -1 } }
    );
  }
  next();
});

const Booking = mongoose.models.Booking || mongoose.model('Booking', bookingSchema);
export default Booking; 