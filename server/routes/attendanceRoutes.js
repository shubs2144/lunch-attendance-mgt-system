const express = require('express');
const {
    markAttendance,
    getOfficeCount,
    getAttendanceAnalytics,
    getEmployeeAttendance
} = require('../controllers/attendanceController');
const { protect, authorize } = require('../middleware/auth');

const router = express.Router();

// Employee routes
router.post('/', protect, markAttendance);

router.get('/', protect, authorize('employee'), getEmployeeAttendance);

// Chef routes
router.get('/office-count', protect, authorize('chef', 'admin'), getOfficeCount);

// Admin routes
router.get('/analytics', protect, authorize('admin'), getAttendanceAnalytics);

module.exports = router;