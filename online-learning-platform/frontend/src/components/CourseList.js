import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import axios from 'axios';
import './CourseList.css';

const CourseList = () => {
    const [courses, setCourses] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    useEffect(() => {
        const fetchCourses = async () => {
            try {
                const response = await axios.get('http://localhost:5000/api/courses');
                setCourses(response.data);
                setLoading(false);
            } catch (error) {
                console.error('Error fetching courses:', error);
                setError('Failed to load courses');
                setLoading(false);
            }
        };

        fetchCourses();
    }, []);

    if (loading) return <div>Loading courses...</div>;
    if (error) return <div>{error}</div>;

    return (
        <div className="course-list">
            <h1>Available Courses</h1>
            <div className="courses-grid">
                {courses.map(course => (
                    <div key={course._id} className="course-card">
                        <div className="course-image">
                            <img src={course.image || 'default-course.jpg'} alt={course.title} />
                        </div>
                        <div className="course-content">
                            <h2>{course.title}</h2>
                            <p>{course.description}</p>
                            <div className="course-meta">
                                <span>Instructor: {course.instructor}</span>
                                <span>Duration: {course.duration}</span>
                            </div>
                            <Link to={`/courses/${course._id}`} className="view-course-btn">
                                View Course
                            </Link>
                        </div>
                    </div>
                ))}
            </div>
        </div>
    );
};

export default CourseList; 