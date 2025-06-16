const mongoose = require('mongoose');

const courseSchema = new mongoose.Schema({
    title: {
        type: String,
        required: true,
        trim: true
    },
    description: {
        type: String,
        required: true
    },
    price: {
        type: Number,
        required: true,
        min: 0
    },
    category: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Category'
    },
    level: {
        type: String,
        required: true,
        enum: ['beginner', 'intermediate', 'advanced']
    },
    duration: {
        type: String,
        required: true
    },
    instructor: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
        required: true
    },
    status: {
        type: String,
        enum: ['draft', 'pending', 'active', 'inactive'],
        default: 'draft'
    },
    enrolledStudents: [{
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User'
    }],
    content: [{
        title: String,
        type: {
            type: String,
            enum: ['video', 'document', 'quiz']
        },
        url: String,
        duration: String
    }],
    rating: {
        type: Number,
        default: 0,
        min: 0,
        max: 5
    },
    ratingCount: {
        type: Number,
        default: 0
    },
    reviews: [{
        student: {
            type: mongoose.Schema.Types.ObjectId,
            ref: 'User'
        },
        rating: {
            type: Number,
            required: true,
            min: 1,
            max: 5
        },
        comment: String,
        date: {
            type: Date,
            default: Date.now
        }
    }],
    prerequisites: [{
        type: String
    }],
    learningObjectives: [{
        type: String
    }],
    createdAt: {
        type: Date,
        default: Date.now
    },
    updatedAt: {
        type: Date,
        default: Date.now
    }
}, {
    timestamps: true
});

// Update the updatedAt timestamp before saving
courseSchema.pre('save', function(next) {
    this.updatedAt = Date.now();
    next();
});

// Calculate average rating
courseSchema.methods.calculateRating = function() {
    if (this.reviews.length === 0) {
        this.rating = 0;
        this.ratingCount = 0;
        return;
    }

    const totalRating = this.reviews.reduce((sum, review) => sum + review.rating, 0);
    this.rating = totalRating / this.reviews.length;
    this.ratingCount = this.reviews.length;
};

// Get student progress
courseSchema.methods.getStudentProgress = function(studentId) {
    const enrollment = this.enrolledStudents.find(
        enrollment => enrollment.toString() === studentId.toString()
    );
    return enrollment ? enrollment.progress : 0;
};

// Update student progress
courseSchema.methods.updateStudentProgress = async function(studentId, progress) {
    const enrollment = this.enrolledStudents.find(
        enrollment => enrollment.toString() === studentId.toString()
    );

    if (enrollment) {
        enrollment.progress = Math.min(100, Math.max(0, progress));
        enrollment.lastAccessed = new Date();
        await this.save();
        return enrollment.progress;
    }
    return null;
};

const Course = mongoose.model('Course', courseSchema);

module.exports = Course; 