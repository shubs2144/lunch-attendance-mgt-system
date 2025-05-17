const mongoose = require('mongoose');
const moment = require('moment-timezone');

const attendanceSchema = new mongoose.Schema({
  user: {
    type: mongoose.Schema.ObjectId,
    ref: 'User',
    required: true
  },
  date: {
    type: Date,
    required: true,
    default: Date.now
  },
  status: {
    type: String,
    enum: ['office', 'home', 'leave'],
    required: true
  },
  markedAt: {
    type: Date,
    default: Date.now
  },
  forDate: {
    type: Date,
    required: true
  }
});

// Index for faster queries
attendanceSchema.index({ user: 1, forDate: 1 }, { unique: true });

// Convert dates to local timezone before saving
attendanceSchema.pre('save', function(next) {
  if (this.isNew) {
    this.markedAt = moment.tz(this.markedAt, 'Asia/Kolkata').toDate();
    this.forDate = moment.tz(this.forDate, 'Asia/Kolkata').startOf('day').toDate();
  }
  next();
});

module.exports = mongoose.model('Attendance', attendanceSchema);