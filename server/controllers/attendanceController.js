const Attendance = require('../models/Attendance');
const User = require('../models/User');
const ErrorResponse = require('../utils/errorResponse');
const moment = require('moment-timezone');
const cron = require('node-cron');
const sendEmail = require('../utils/sendEmail');

// @desc    Mark attendance
// @route   POST /api/v1/attendance
exports.markAttendance = async (req, res, next) => {
    try {
        const { status, forDate } = req.body;
        const userId = req.user.id;

        // Validate status
        if (!['office', 'home', 'leave'].includes(status)) {
            return next(new ErrorResponse('Invalid attendance status', 400));
        }

        // Parse date or use today
        let date = forDate ? new Date(forDate) : new Date();
        date = moment.tz(date, 'Asia/Kolkata').startOf('day').toDate();

        // Check if it's a weekend (Saturday or Sunday)
        const dayOfWeek = moment.tz(date, 'Asia/Kolkata').day();
        if (dayOfWeek === 0 || dayOfWeek === 6) {
            return next(new ErrorResponse('Cannot mark attendance for weekends', 400));
        }

        // Check if attendance is being marked for future dates
        const today = moment.tz('Asia/Kolkata').startOf('day');
        const selectedDate = moment.tz(date, 'Asia/Kolkata').startOf('day');
        const isFutureDate = selectedDate.isAfter(today);

        // Check cutoff time (9:30 AM)
        const now = moment.tz('Asia/Kolkata');
        const cutoffTime = moment.tz('Asia/Kolkata').set({ hour: 9, minute: 30, second: 0 });

        let actualForDate = date;
        let message = 'Attendance marked successfully';

        if (!forDate) {
            // If marking for today
            if (now.isAfter(cutoffTime)) {
                // After cutoff time, mark for tomorrow
                actualForDate = moment.tz('Asia/Kolkata').add(1, 'day').startOf('day').toDate();
                message = 'Attendance marked for tomorrow (marked after 9:30 AM cutoff)';
            }
        } else if (isFutureDate) {
            // Marking for a future date is allowed
            message = `Attendance marked for ${moment(actualForDate).format('YYYY-MM-DD')}`;
        } else {
            // Marking for a past date
            if (selectedDate.isBefore(today)) {
                return next(new ErrorResponse('Cannot mark attendance for past dates', 400));
            }
        }

        // Create or update attendance
        const attendance = await Attendance.findOneAndUpdate(
            { user: userId, forDate: actualForDate },
            { status, markedAt: new Date() },
            { new: true, upsert: true }
        );

        res.status(200).json({
            success: true,
            message,
            data: attendance
        });
    } catch (err) {
        next(err);
    }
};

// @desc    Get today's office count for chef
// @route   GET /api/v1/attendance/office-count
exports.getOfficeCount = async (req, res, next) => {
    try {
        const today = moment.tz('Asia/Kolkata').startOf('day').toDate();

        const count = await Attendance.countDocuments({
            forDate: today,
            status: 'office'
        });

        res.status(200).json({
            success: true,
            count
        });
    } catch (err) {
        next(err);
    }
};

// @desc    Get attendance analytics for admin
// @route   GET /api/v1/attendance/analytics
exports.getAttendanceAnalytics = async (req, res, next) => {
    try {
        const { startDate, endDate } = req.query;

        // Validate dates
        const start = startDate
            ? moment.tz(startDate, 'Asia/Kolkata').startOf('day').toDate()
            : moment.tz('Asia/Kolkata').subtract(30, 'days').startOf('day').toDate();

        const end = endDate
            ? moment.tz(endDate, 'Asia/Kolkata').endOf('day').toDate()
            : moment.tz('Asia/Kolkata').endOf('day').toDate();

        // Get all attendance records in date range
        const attendance = await Attendance.find({
            forDate: { $gte: start, $lte: end }
        }).populate('user', 'name email');

        // Group by date
        const analyticsByDate = {};
        attendance.forEach(record => {
            const dateStr = moment.tz(record.forDate, 'Asia/Kolkata').format('YYYY-MM-DD');

            if (!analyticsByDate[dateStr]) {
                analyticsByDate[dateStr] = {
                    date: dateStr,
                    office: 0,
                    home: 0,
                    leave: 0,
                    users: []
                };
            }

            analyticsByDate[dateStr][record.status]++;
            analyticsByDate[dateStr].users.push({
                id: record.user._id,
                name: record.user.name,
                email: record.user.email,
                status: record.status
            });
        });

        // Convert to array
        const result = Object.values(analyticsByDate).sort((a, b) =>
            new Date(a.date) - new Date(b.date)
        );

        res.status(200).json({
            success: true,
            count: result.length,
            data: result
        });
    } catch (err) {
        next(err);
    }
};

exports.getEmployeeAttendance = async (req, res, next) => {
  try {
    const { date } = req.query;
    const attendance = await Attendance.findOne({
      user: req.user.id,
      forDate: new Date(date)
    });
    
    res.status(200).json({
      success: true,
      data: attendance || null
    });
  } catch (err) {
    next(err);
  }
};

// Schedule daily notification to chef at 9:30 AM (excluding weekends)
cron.schedule('30 9 * * 1-5', async () => {
    try {
        const today = moment.tz('Asia/Kolkata').startOf('day').toDate();

        // Get office count
        const count = await Attendance.countDocuments({
            forDate: today,
            status: 'office'
        });

        // Find all chefs
        const chefs = await User.find({ role: 'chef' });

        // Send email to each chef
        for (const chef of chefs) {
            await sendEmail({
                email: chef.email,
                subject: 'Daily Office Attendance Count',
                message: `Today's office attendance count: ${count}`
            });
        }

        console.log(`Sent office count (${count}) to ${chefs.length} chef(s) at ${new Date()}`);
    } catch (err) {
        console.error('Error sending chef notification:', err);
    }
}, {
    scheduled: true,
    timezone: 'Asia/Kolkata'
});