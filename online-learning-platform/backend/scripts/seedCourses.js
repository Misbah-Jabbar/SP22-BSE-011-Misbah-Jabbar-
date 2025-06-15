const mongoose = require('mongoose');
const Course = require('../models/Course');
const User = require('../models/User');
require('dotenv').config();

const courses = [
  {
    title: "Web Development Bootcamp",
    description: "Learn full-stack web development with HTML, CSS, JavaScript, Node.js, and React. Build real-world projects and become a professional web developer.",
    price: 49.99,
    category: "programming",
    instructor: null // Will be set after creating instructor
  },
  {
    title: "Python for Data Science",
    description: "Master Python programming and data analysis. Learn NumPy, Pandas, Matplotlib, and machine learning basics.",
    price: 39.99,
    category: "programming",
    instructor: null
  },
  {
    title: "UI/UX Design Fundamentals",
    description: "Learn the principles of user interface and user experience design. Create beautiful and functional designs using Figma.",
    price: 29.99,
    category: "design",
    instructor: null
  },
  {
    title: "Digital Marketing Masterclass",
    description: "Comprehensive course covering SEO, social media marketing, email marketing, and content strategy.",
    price: 59.99,
    category: "marketing",
    instructor: null
  },
  {
    title: "Business Analytics",
    description: "Learn to analyze business data and make data-driven decisions. Master Excel, SQL, and data visualization.",
    price: 44.99,
    category: "business",
    instructor: null
  },
  {
    title: "Mobile App Development",
    description: "Build iOS and Android apps using React Native. Learn mobile app design, development, and deployment.",
    price: 54.99,
    category: "programming",
    instructor: null
  },
  {
    title: "Graphic Design Essentials",
    description: "Master Adobe Photoshop, Illustrator, and InDesign. Create professional graphics and designs.",
    price: 34.99,
    category: "design",
    instructor: null
  },
  {
    title: "Social Media Marketing",
    description: "Learn to create and manage successful social media campaigns across all major platforms.",
    price: 29.99,
    category: "marketing",
    instructor: null
  }
];

const seedCourses = async () => {
  try {
    // Connect to MongoDB
    await mongoose.connect(process.env.MONGODB_URI || 'mongodb://localhost:27017/learning-platform');
    console.log('Connected to MongoDB');

    // Create an instructor user if not exists
    let instructor = await User.findOne({ role: 'instructor' });
    if (!instructor) {
      instructor = await User.create({
        name: 'John Doe',
        email: 'instructor@example.com',
        password: 'password123',
        role: 'instructor'
      });
      console.log('Created instructor user');
    }

    // Add instructor ID to courses
    const coursesWithInstructor = courses.map(course => ({
      ...course,
      instructor: instructor._id
    }));

    // Clear existing courses
    await Course.deleteMany({});
    console.log('Cleared existing courses');

    // Insert new courses
    await Course.insertMany(coursesWithInstructor);
    console.log('Added sample courses');

    console.log('Database seeded successfully');
    process.exit(0);
  } catch (error) {
    console.error('Error seeding database:', error);
    process.exit(1);
  }
};

seedCourses(); 