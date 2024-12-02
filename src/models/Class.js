import mongoose from 'mongoose';

const classSchema = new mongoose.Schema({
  name: {
    type: String,
    required: [true, 'Class name is required'],
    trim: true
  },
  trainer: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: [true, 'Trainer is required']
  },
  date: {
    type: Date,
    required: [true, 'Class date is required']
  },
  startTime: {
    type: String,
    required: [true, 'Start time is required'],
    validate: {
      validator: function(v) {
        // Validate time format (HH:MM)
        return /^([0-1]?[0-9]|2[0-3]):[0-5][0-9]$/.test(v);
      },
      message: 'Start time must be in HH:MM format'
    }
  },
  duration: {
    type: Number,
    default: 120, // 2 hours in minutes
    validate: {
      validator: function(v) {
        return v === 120; // Ensure class is exactly 2 hours
      },
      message: 'Class duration must be exactly 2 hours'
    }
  },
  maxCapacity: {
    type: Number,
    default: 10,
    validate: {
      validator: function(v) {
        return v <= 10; // Maximum 10 trainees per class
      },
      message: 'Class capacity cannot exceed 10 trainees'
    }
  },
  trainees: {
    type: [mongoose.Schema.Types.ObjectId],
    ref: 'User',
    default: []
  },
  currentEnrollment: {
    type: Number,
    default: 0
  },
  description: {
    type: String,
    required: [true, 'Class description is required']
  },
  status: {
    type: String,
    enum: ['scheduled', 'in-progress', 'completed', 'cancelled'],
    default: 'scheduled'
  }
}, {
  timestamps: true
});

// Middleware to check daily class limit
classSchema.pre('save', async function(next) {
  if (this.isNew) {
    const startOfDay = new Date(this.date.setHours(0, 0, 0, 0));
    const endOfDay = new Date(this.date.setHours(23, 59, 59, 999));
    
    const classCount = await this.constructor.countDocuments({
      date: {
        $gte: startOfDay,
        $lte: endOfDay
      }
    });

    if (classCount >= 5) {
      throw new Error('Maximum limit of 5 classes per day has been reached');
    }
  }
  next();
});

const Class = mongoose.models.Class || mongoose.model('Class', classSchema);
export default Class; 