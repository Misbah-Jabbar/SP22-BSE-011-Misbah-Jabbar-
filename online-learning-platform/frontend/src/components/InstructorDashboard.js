import React, { useState, useEffect } from 'react';
import axios from 'axios';
import './InstructorDashboard.css';

const InstructorDashboard = () => {
    const [courses, setCourses] = useState([]);
    const [stats, setStats] = useState({
        totalCourses: 0,
        totalStudents: 0,
        totalRevenue: 0
    });

    const fetchCourses = async () => {
        try {
            const token = localStorage.getItem('token');
            const response = await axios.get('http://localhost:5000/api/instructor/courses', {
                headers: {
                    'Authorization': `Bearer ${token}`,
                    'Content-Type': 'application/json'
                }
            });
            setCourses(response.data);
        } catch (error) {
            console.error('Error fetching courses:', error);
            alert('Failed to fetch courses');
        }
    };

    const fetchStats = async () => {
        try {
            const token = localStorage.getItem('token');
            const response = await axios.get('http://localhost:5000/api/instructor/stats', {
                headers: {
                    'Authorization': `Bearer ${token}`,
                    'Content-Type': 'application/json'
                }
            });
            setStats(response.data);
        } catch (error) {
            console.error('Error fetching stats:', error);
            alert('Failed to fetch statistics');
        }
    };

    const handleDelete = async (courseId) => {
        if (window.confirm('Are you sure you want to delete this course?')) {
            try {
                const token = localStorage.getItem('token');
                await axios.delete(`http://localhost:5000/api/instructor/courses/${courseId}`, {
                    headers: {
                        'Authorization': `Bearer ${token}`,
                        'Content-Type': 'application/json'
                    }
                });
                alert('Course deleted successfully');
                fetchCourses();
            } catch (error) {
                console.error('Error deleting course:', error);
                alert('Failed to delete course');
            }
        }
    };

    useEffect(() => {
        fetchCourses();
        fetchStats();
    }, []);

    return (
        <div className="instructor-dashboard">
            <div className="dashboard-header">
                <h1>Instructor Dashboard</h1>
                <div className="header-actions">
                    <button className="add-course-btn" onClick={() => window.location.href = '/courses/new'}>
                        Add New Course
                    </button>
                </div>
            </div>

            <div className="dashboard-grid">
                {/* Course Management Section */}
                <div className="dashboard-card course-management">
                    <div className="card-header">
                        <h2>My Courses</h2>
                    </div>
                    <div className="card-content">
                        <div className="courses-table-container">
                            <table className="courses-table">
                                <thead>
                                    <tr>
                                        <th>Title</th>
                                        <th>Students</th>
                                        <th>Status</th>
                                        <th>Actions</th>
                                    </tr>
                                </thead>
                                <tbody>
                                    {courses.map(course => (
                                        <tr key={course._id}>
                                            <td>{course.title}</td>
                                            <td>{course.enrolledStudents?.length || 0}</td>
                                            <td>
                                                <span className={`status-badge ${course.status}`}>
                                                    {course.status}
                                                </span>
                                            </td>
                                            <td className="action-buttons">
                                                <button
                                                    className="action-btn edit"
                                                    onClick={() => window.location.href = `/courses/${course._id}/edit`}
                                                >
                                                    Edit
                                                </button>
                                                <button
                                                    className="action-btn delete"
                                                    onClick={() => handleDelete(course._id)}
                                                >
                                                    Delete
                                                </button>
                                            </td>
                                        </tr>
                                    ))}
                                </tbody>
                            </table>
                        </div>
                    </div>
                </div>

                {/* Statistics Section */}
                <div className="dashboard-card statistics">
                    <div className="card-header">
                        <h2>Statistics</h2>
                    </div>
                    <div className="card-content">
                        <div className="stats-grid">
                            <div className="stat-item">
                                <h3>Total Courses</h3>
                                <p>{stats.totalCourses}</p>
                            </div>
                            <div className="stat-item">
                                <h3>Total Students</h3>
                                <p>{stats.totalStudents}</p>
                            </div>
                            <div className="stat-item">
                                <h3>Total Revenue</h3>
                                <p>${stats.totalRevenue}</p>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default InstructorDashboard; 