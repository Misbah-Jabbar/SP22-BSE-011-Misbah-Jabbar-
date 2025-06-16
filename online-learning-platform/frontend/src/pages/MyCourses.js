import React, { useState, useEffect } from 'react';
import { Link as RouterLink } from 'react-router-dom';
import {
  Container,
  Typography,
  Grid,
  Card,
  CardContent,
  CardActions,
  Button,
  Box,
  Alert,
  Link
} from '@mui/material';
import axios from 'axios';
import { useAuth } from '../context/AuthContext';

const MyCourses = () => {
  const [courses, setCourses] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const { user } = useAuth();

  useEffect(() => {
    if (user) {
      fetchEnrolledCourses();
    }
  }, [user]);

  const fetchEnrolledCourses = async () => {
    try {
      const res = await axios.get('http://localhost:5000/api/student/enrolled-courses', {
        headers: {
          Authorization: `Bearer ${localStorage.getItem('token')}`
        }
      });
      setCourses(res.data);
      setLoading(false);
    } catch (err) {
      setError('Failed to fetch enrolled courses');
      setLoading(false);
    }
  };

  if (!user) {
    return (
      <Container>
        <Alert severity="info">Please login to view your enrolled courses</Alert>
      </Container>
    );
  }

  if (loading) {
    return (
      <Container>
        <Typography>Loading...</Typography>
      </Container>
    );
  }

  if (error) {
    return (
      <Container>
        <Alert severity="error">{error}</Alert>
      </Container>
    );
  }

  return (
    <Container>
      <Box sx={{ my: 4 }}>
        <Typography variant="h4" component="h1" gutterBottom>
          My Enrolled Courses
        </Typography>
        {courses.length === 0 ? (
          <Alert severity="info">
            You haven't enrolled in any courses yet. Browse our{' '}
            <Link component={RouterLink} to="/courses">
              available courses
            </Link>
            .
          </Alert>
        ) : (
          <Grid container spacing={3}>
            {courses.map(course => (
              <Grid item xs={12} sm={6} md={4} key={course._id}>
                <Card>
                  <CardContent>
                    <Typography variant="h6" gutterBottom>
                      {course.title}
                    </Typography>
                    <Typography variant="body2" color="text.secondary" paragraph>
                      {course.description}
                    </Typography>
                    <Typography variant="body2" color="text.secondary">
                      Level: {course.level}
                    </Typography>
                    <Typography variant="body2" color="text.secondary">
                      Duration: {course.duration} hours
                    </Typography>
                  </CardContent>
                  <CardActions>
                    <Button
                      component={RouterLink}
                      to={`/courses/${course._id}`}
                      size="small"
                      color="primary"
                    >
                      Continue Learning
                    </Button>
                  </CardActions>
                </Card>
              </Grid>
            ))}
          </Grid>
        )}
      </Box>
    </Container>
  );
};

export default MyCourses; 