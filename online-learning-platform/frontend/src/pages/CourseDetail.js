import React, { useState, useEffect, useCallback } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import {
  Container,
  Paper,
  Typography,
  Button,
  Box,
  Grid,
  List,
  ListItem,
  ListItemText,
  Divider,
  Alert
} from '@mui/material';
import axios from 'axios';
import { useAuth } from '../context/AuthContext';

const CourseDetail = () => {
  const [course, setCourse] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [enrolled, setEnrolled] = useState(false);
  const { id } = useParams();
  const navigate = useNavigate();
  const { user } = useAuth();

  const fetchCourse = useCallback(async () => {
    try {
      const res = await axios.get(`http://localhost:5000/api/courses/${id}`);
      setCourse(res.data);
      if (user) {
        setEnrolled(res.data.enrolledStudents.includes(user.id));
      }
      setLoading(false);
    } catch (err) {
      setError('Failed to fetch course details');
      setLoading(false);
    }
  }, [id, user]);

  useEffect(() => {
    fetchCourse();
  }, [fetchCourse]);

  const handleEnroll = async () => {
    if (!user) {
      navigate('/login');
      return;
    }

    try {
      await axios.post(`http://localhost:5000/api/enrollments/${id}`);
      setEnrolled(true);
    } catch (err) {
      setError('Failed to enroll in course');
    }
  };

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

  if (!course) {
    return (
      <Container>
        <Alert severity="error">Course not found</Alert>
      </Container>
    );
  }

  return (
    <Container>
      <Box sx={{ my: 4 }}>
        <Paper elevation={3} sx={{ p: 4 }}>
          <Typography variant="h4" component="h1" gutterBottom>
            {course.title}
          </Typography>
          <Typography variant="subtitle1" color="text.secondary" gutterBottom>
            Instructor: {course.instructor.name}
          </Typography>
          <Typography variant="body1" paragraph>
            {course.description}
          </Typography>
          <Grid container spacing={2} sx={{ mb: 4 }}>
            <Grid item xs={12} sm={4}>
              <Typography variant="body2" color="text.secondary">
                Level: {course.level}
              </Typography>
            </Grid>
            <Grid item xs={12} sm={4}>
              <Typography variant="body2" color="text.secondary">
                Duration: {course.duration} hours
              </Typography>
            </Grid>
            <Grid item xs={12} sm={4}>
              <Typography variant="body2" color="text.secondary">
                Price: ${course.price}
              </Typography>
            </Grid>
          </Grid>
          {enrolled ? (
            <Alert severity="success">You are enrolled in this course</Alert>
          ) : (
            <Button
              variant="contained"
              color="primary"
              onClick={handleEnroll}
              disabled={!user}
            >
              {user ? 'Enroll Now' : 'Login to Enroll'}
            </Button>
          )}
        </Paper>

        {enrolled && (
          <Paper elevation={3} sx={{ p: 4, mt: 4 }}>
            <Typography variant="h5" gutterBottom>
              Course Content
            </Typography>
            <List>
              {course.content.map((item, index) => (
                <React.Fragment key={index}>
                  <ListItem>
                    <ListItemText
                      primary={item.title}
                      secondary={`Type: ${item.type} | Duration: ${item.duration} minutes`}
                    />
                  </ListItem>
                  {index < course.content.length - 1 && <Divider />}
                </React.Fragment>
              ))}
            </List>
          </Paper>
        )}

        <Paper elevation={3} sx={{ p: 4, mt: 4 }}>
          <Typography variant="h5" gutterBottom>
            Reviews
          </Typography>
          {course.reviews.length > 0 ? (
            course.reviews.map((review, index) => (
              <Box key={index} sx={{ mb: 2 }}>
                <Typography variant="subtitle1">
                  {review.user.name}
                </Typography>
                <Typography variant="body2" color="text.secondary">
                  Rating: {review.rating}/5
                </Typography>
                <Typography variant="body1">
                  {review.comment}
                </Typography>
                <Divider sx={{ my: 2 }} />
              </Box>
            ))
          ) : (
            <Typography>No reviews yet</Typography>
          )}
        </Paper>
      </Box>
    </Container>
  );
};

export default CourseDetail; 