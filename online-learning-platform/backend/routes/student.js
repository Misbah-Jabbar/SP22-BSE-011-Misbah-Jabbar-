const express = require('express');
const router = express.Router();
const auth = require('../middleware/auth');
const Course = require('../models/Course');
const User = require('../models/User');

// Get student statistics
router.get('/stats', auth, async (req, res) => {
  try {
    const student = await User.findById(req.user.id);
    const enrolledCourses = await Course.find({ enrolledStudents: req.user.id });
    
    const stats = {
      totalCourses: enrolledCourses.length,
      completedCourses: enrolledCourses.filter(course => course.progress === 100).length,
      inProgressCourses: enrolledCourses.filter(course => course.progress > 0 && course.progress < 100).length,
      certificates: enrolledCourses.filter(course => course.progress === 100).length // Assuming completed courses get certificates
    };

    res.json(stats);
  } catch (error) {
    console.error('Error fetching student stats:', error);
    res.status(500).json({ message: 'Server error' });
  }
});

// Get enrolled courses with progress
router.get('/enrolled-courses', auth, async (req, res) => {
  try {
    const courses = await Course.find({ enrolledStudents: req.user.id })
      .populate('instructor', 'name email')
      .select('-content');

    res.json(courses);
  } catch (error) {
    console.error('Error fetching enrolled courses:', error);
    res.status(500).json({ message: 'Server error' });
  }
});

// Update course progress
router.put('/courses/:courseId/progress', auth, async (req, res) => {
  try {
    const { progress } = req.body;
    const course = await Course.findOne({
      _id: req.params.courseId,
      enrolledStudents: req.user.id
    });

    if (!course) {
      return res.status(404).json({ message: 'Course not found or not enrolled' });
    }

    course.progress = Math.min(100, Math.max(0, progress));
    course.lastAccessed = new Date();
    await course.save();

    res.json(course);
  } catch (error) {
    console.error('Error updating course progress:', error);
    res.status(500).json({ message: 'Server error' });
  }
});

// Get course certificate
router.get('/courses/:courseId/certificate', auth, async (req, res) => {
  try {
    const course = await Course.findOne({
      _id: req.params.courseId,
      enrolledStudents: req.user.id,
      progress: 100
    }).populate('instructor', 'name');

    if (!course) {
      return res.status(404).json({ message: 'Course not found or not completed' });
    }

    const student = await User.findById(req.user.id);
    const certificate = {
      studentName: student.name,
      courseName: course.title,
      instructorName: course.instructor.name,
      completionDate: new Date(),
      certificateId: `${course._id}-${student._id}-${Date.now()}`
    };

    res.json(certificate);
  } catch (error) {
    console.error('Error generating certificate:', error);
    res.status(500).json({ message: 'Server error' });
  }
});

module.exports = router; 