const express = require('express');
const router = express.Router();
const Course = require('../models/Course');
const User = require('../models/User');
const auth = require('../middleware/auth');

// Enroll in a course
router.post('/:courseId', auth, async (req, res) => {
    try {
        const course = await Course.findById(req.params.courseId);
        if (!course) {
            return res.status(404).json({ message: 'Course not found' });
        }

        const user = await User.findById(req.user.id);
        if (!user) {
            return res.status(404).json({ message: 'User not found' });
        }

        // Check if already enrolled
        if (user.enrolledCourses.includes(req.params.courseId)) {
            return res.status(400).json({ message: 'Already enrolled in this course' });
        }

        // Add course to user's enrolled courses
        user.enrolledCourses.push(req.params.courseId);
        await user.save();

        // Add user to course's enrolled students
        course.enrolledStudents.push(req.user.id);
        await course.save();

        res.json({ message: 'Successfully enrolled in course' });
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Server error' });
    }
});

// Get user's enrolled courses
router.get('/my-courses', auth, async (req, res) => {
    try {
        const user = await User.findById(req.user.id)
            .populate({
                path: 'enrolledCourses',
                select: 'title description instructor duration level',
                populate: {
                    path: 'instructor',
                    select: 'name email'
                }
            });

        res.json(user.enrolledCourses);
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Server error' });
    }
});

// Unenroll from a course
router.delete('/:courseId', auth, async (req, res) => {
    try {
        const course = await Course.findById(req.params.courseId);
        if (!course) {
            return res.status(404).json({ message: 'Course not found' });
        }

        const user = await User.findById(req.user.id);
        if (!user) {
            return res.status(404).json({ message: 'User not found' });
        }

        // Remove course from user's enrolled courses
        user.enrolledCourses = user.enrolledCourses.filter(
            courseId => courseId.toString() !== req.params.courseId
        );
        await user.save();

        // Remove user from course's enrolled students
        course.enrolledStudents = course.enrolledStudents.filter(
            studentId => studentId.toString() !== req.user.id
        );
        await course.save();

        res.json({ message: 'Successfully unenrolled from course' });
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Server error' });
    }
});

module.exports = router; 