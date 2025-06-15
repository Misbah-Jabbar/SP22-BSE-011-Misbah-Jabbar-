import React from 'react';
import { Link as RouterLink } from 'react-router-dom';
import {
  Container,
  Typography,
  Button,
  Box,
  Grid,
  Card,
  CardContent
} from '@mui/material';
import { useAuth } from '../context/AuthContext';

const Home = () => {
  const { user } = useAuth();

  return (
    <Box>
      {/* Hero Section */}
      <Box
        sx={{
          bgcolor: 'primary.main',
          color: 'white',
          py: 8,
          mb: 6
        }}
      >
        <Container maxWidth="lg">
          <Grid container spacing={4} alignItems="center">
            <Grid item xs={12} md={6}>
              <Typography variant="h2" component="h1" gutterBottom>
                Learn Without Limits
              </Typography>
              <Typography variant="h5" paragraph>
                Start, switch, or advance your career with thousands of courses from expert instructors.
              </Typography>
              <Button
                component={RouterLink}
                to="/courses"
                variant="contained"
                color="secondary"
                size="large"
                sx={{ mt: 2 }}
              >
                Browse Courses
              </Button>
            </Grid>
            <Grid item xs={12} md={6}>
              <Box
                component="img"
                src="/images/hero-image.jpg"
                alt="Learning"
                sx={{
                  width: '100%',
                  height: 'auto',
                  borderRadius: 2,
                  boxShadow: 3
                }}
              />
            </Grid>
          </Grid>
        </Container>
      </Box>

      {/* Features Section */}
      <Container maxWidth="lg" sx={{ mb: 6 }}>
        <Typography variant="h3" component="h2" align="center" gutterBottom>
          Why Choose Our Platform?
        </Typography>
        <Grid container spacing={4} sx={{ mt: 2 }}>
          <Grid item xs={12} md={4}>
            <Card>
              <CardContent>
                <Typography variant="h5" component="h3" gutterBottom>
                  Expert Instructors
                </Typography>
                <Typography variant="body1">
                  Learn from industry experts who are passionate about teaching.
                </Typography>
              </CardContent>
            </Card>
          </Grid>
          <Grid item xs={12} md={4}>
            <Card>
              <CardContent>
                <Typography variant="h5" component="h3" gutterBottom>
                  Flexible Learning
                </Typography>
                <Typography variant="body1">
                  Study at your own pace, anywhere and anytime.
                </Typography>
              </CardContent>
            </Card>
          </Grid>
          <Grid item xs={12} md={4}>
            <Card>
              <CardContent>
                <Typography variant="h5" component="h3" gutterBottom>
                  Quality Content
                </Typography>
                <Typography variant="body1">
                  Access high-quality courses with practical knowledge.
                </Typography>
              </CardContent>
            </Card>
          </Grid>
        </Grid>
      </Container>

      {/* Call to Action */}
      <Box sx={{ bgcolor: 'grey.100', py: 6 }}>
        <Container maxWidth="md">
          <Typography variant="h4" component="h2" align="center" gutterBottom>
            Ready to Start Learning?
          </Typography>
          <Typography variant="h6" align="center" paragraph>
            Join thousands of students already learning on our platform.
          </Typography>
          <Box sx={{ textAlign: 'center', mt: 4 }}>
            {user ? (
              <Button
                component={RouterLink}
                to="/courses"
                variant="contained"
                color="primary"
                size="large"
              >
                Browse Courses
              </Button>
            ) : (
              <Button
                component={RouterLink}
                to="/register"
                variant="contained"
                color="primary"
                size="large"
              >
                Get Started
              </Button>
            )}
          </Box>
        </Container>
      </Box>
    </Box>
  );
};

export default Home; 