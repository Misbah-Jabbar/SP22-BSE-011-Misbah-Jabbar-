const express = require('express');
const Course = require('../models/Course');
const Category = require('../models/Category');
const User = require('../models/User');

// User Management Controller
const getUsers = async (req, res) => {
    try {
        const users = await User.find().select('-password');
        res.json(users);
    } catch (error) {
        console.error('Error fetching users:', error);
        res.status(500).json({ message: 'Failed to fetch users' });
    }
};

const updateUser = async (req, res) => {
    try {
        const { id } = req.params;
        const updates = req.body;
        const user = await User.findByIdAndUpdate(id, updates, { new: true }).select('-password');
        if (!user) {
            return res.status(404).json({ message: 'User not found' });
        }
        res.json(user);
    } catch (error) {
        console.error('Error updating user:', error);
        res.status(500).json({ message: 'Failed to update user' });
    }
};

const deleteUser = async (req, res) => {
    try {
        const { id } = req.params;
        const user = await User.findByIdAndDelete(id);
        if (!user) {
            return res.status(404).json({ message: 'User not found' });
        }
        res.json({ message: 'User deleted successfully' });
    } catch (error) {
        console.error('Error deleting user:', error);
        res.status(500).json({ message: 'Failed to delete user' });
    }
};

// Stats Controller
const getStats = async (req, res) => {
    try {
        const totalUsers = await User.countDocuments();
        const activeUsers = await User.countDocuments({ status: 'active' });
        const totalCourses = await Course.countDocuments();
        const totalRevenue = await Course.aggregate([
            { $match: { status: 'published' } },
            { $group: { _id: null, total: { $sum: '$price' } } }
        ]);

        res.json({
            totalUsers,
            activeUsers,
            totalCourses,
            totalRevenue: totalRevenue[0]?.total || 0
        });
    } catch (error) {
        console.error('Error fetching stats:', error);
        res.status(500).json({ message: 'Failed to fetch statistics' });
    }
};

// Platform Settings Controller
const getPlatformSettings = async (req, res) => {
    try {
        // Get settings from database or return default settings
        const settings = {
            siteName: 'Online Learning Platform',
            siteDescription: 'A modern platform for online learning',
            maintenanceMode: false,
            allowRegistration: true,
            requireEmailVerification: true,
            maxFileSize: 10,
            allowedFileTypes: ['pdf', 'doc', 'docx', 'ppt', 'pptx', 'mp4'],
            courseApprovalRequired: true,
            maxCoursesPerInstructor: 10,
            autoBackup: true,
            twoFactorAuth: false
        };
        res.json(settings);
    } catch (error) {
        console.error('Error fetching platform settings:', error);
        res.status(500).json({ message: 'Failed to fetch platform settings' });
    }
};

const updatePlatformSettings = async (req, res) => {
    try {
        const settings = req.body;
        // Here you would typically save the settings to your database
        // For now, we'll just return success
        res.json({ message: 'Platform settings updated successfully', settings });
    } catch (error) {
        console.error('Error updating platform settings:', error);
        res.status(500).json({ message: 'Failed to update platform settings' });
    }
};

// Course Management Controller
const getCourses = async (req, res) => {
    try {
        const courses = await Course.find()
            .populate('instructor', 'name email')
            .populate('category', 'name')
            .populate('enrolledStudents', 'name');
        res.json(courses);
    } catch (error) {
        console.error('Error fetching courses:', error);
        res.status(500).json({ message: 'Failed to fetch courses' });
    }
};

const createCourse = async (req, res) => {
    try {
        const { title, description, instructor, category } = req.body;
        const course = new Course({
            title,
            description,
            instructor,
            category,
            status: 'draft'
        });
        await course.save();
        res.status(201).json(course);
    } catch (error) {
        console.error('Error creating course:', error);
        res.status(500).json({ message: 'Failed to create course' });
    }
};

const updateCourse = async (req, res) => {
    try {
        const { id } = req.params;
        const updates = req.body;
        const course = await Course.findByIdAndUpdate(id, updates, { new: true });
        if (!course) {
            return res.status(404).json({ message: 'Course not found' });
        }
        res.json(course);
    } catch (error) {
        console.error('Error updating course:', error);
        res.status(500).json({ message: 'Failed to update course' });
    }
};

const deleteCourse = async (req, res) => {
    try {
        const { id } = req.params;
        const course = await Course.findByIdAndDelete(id);
        if (!course) {
            return res.status(404).json({ message: 'Course not found' });
        }
        res.json({ message: 'Course deleted successfully' });
    } catch (error) {
        console.error('Error deleting course:', error);
        res.status(500).json({ message: 'Failed to delete course' });
    }
};

// Category Management Controller
const getCategories = async (req, res) => {
    try {
        const categories = await Category.find().populate('courses');
        res.json(categories);
    } catch (error) {
        console.error('Error fetching categories:', error);
        res.status(500).json({ message: 'Failed to fetch categories' });
    }
};

const createCategory = async (req, res) => {
    try {
        const { name, description } = req.body;
        const category = new Category({ name, description });
        await category.save();
        res.status(201).json(category);
    } catch (error) {
        console.error('Error creating category:', error);
        res.status(500).json({ message: 'Failed to create category' });
    }
};

const updateCategory = async (req, res) => {
    try {
        const { id } = req.params;
        const updates = req.body;
        const category = await Category.findByIdAndUpdate(id, updates, { new: true });
        if (!category) {
            return res.status(404).json({ message: 'Category not found' });
        }
        res.json(category);
    } catch (error) {
        console.error('Error updating category:', error);
        res.status(500).json({ message: 'Failed to update category' });
    }
};

const deleteCategory = async (req, res) => {
    try {
        const { id } = req.params;
        const category = await Category.findByIdAndDelete(id);
        if (!category) {
            return res.status(404).json({ message: 'Category not found' });
        }
        res.json({ message: 'Category deleted successfully' });
    } catch (error) {
        console.error('Error deleting category:', error);
        res.status(500).json({ message: 'Failed to delete category' });
    }
};

module.exports = {
    getUsers,
    updateUser,
    deleteUser,
    getStats,
    getPlatformSettings,
    updatePlatformSettings,
    getCourses,
    createCourse,
    updateCourse,
    deleteCourse,
    getCategories,
    createCategory,
    updateCategory,
    deleteCategory
}; 