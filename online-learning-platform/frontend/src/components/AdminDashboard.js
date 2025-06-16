import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { toast } from 'react-toastify';
import { FaUsers, FaCog, FaChartBar, FaShieldAlt, FaPlus, FaEdit, FaTrash, FaLock, FaUnlock, FaBook, FaBell, FaDatabase } from 'react-icons/fa';
import './AdminDashboard.css';

const AdminDashboard = () => {
    const [users, setUsers] = useState([]);
    const [stats, setStats] = useState({
        totalUsers: 0,
        activeUsers: 0,
        totalCourses: 0,
        totalRevenue: 0
    });
    const [showAddModal, setShowAddModal] = useState(false);
    const [showEditModal, setShowEditModal] = useState(false);
    const [selectedUser, setSelectedUser] = useState(null);
    const [newUser, setNewUser] = useState({
        name: '',
        email: '',
        role: 'student',
        status: 'active'
    });
    const [systemSettings, setSystemSettings] = useState({
        emailNotifications: true,
        maintenanceMode: false,
        autoBackup: true
    });
    const [courses, setCourses] = useState([]);
    const [showCourseModal, setShowCourseModal] = useState(false);
    const [selectedCourse, setSelectedCourse] = useState(null);
    const [platformSettings, setPlatformSettings] = useState({
        siteName: 'Online Learning Platform',
        siteDescription: 'A modern platform for online learning',
        maintenanceMode: false,
        allowRegistration: true,
        requireEmailVerification: true,
        maxFileSize: 10, // MB
        allowedFileTypes: ['pdf', 'doc', 'docx', 'ppt', 'pptx', 'mp4'],
        courseApprovalRequired: true,
        maxCoursesPerInstructor: 10
    });
    const [courseCategories, setCourseCategories] = useState([]);
    const [showCategoryModal, setShowCategoryModal] = useState(false);
    const [selectedCategory, setSelectedCategory] = useState(null);

    const fetchUsers = async () => {
        try {
            const token = localStorage.getItem('token');
            const response = await axios.get('http://localhost:5000/api/admin/users', {
                headers: {
                    'Authorization': `Bearer ${token}`,
                    'Content-Type': 'application/json'
                }
            });
            setUsers(response.data);
        } catch (error) {
            console.error('Error fetching users:', error);
            toast.error('Failed to fetch users');
        }
    };

    const fetchStats = async () => {
        try {
            const token = localStorage.getItem('token');
            const response = await axios.get('http://localhost:5000/api/admin/stats', {
                headers: {
                    'Authorization': `Bearer ${token}`,
                    'Content-Type': 'application/json'
                }
            });
            setStats(response.data);
        } catch (error) {
            console.error('Error fetching stats:', error);
            toast.error('Failed to fetch statistics');
        }
    };

    const handleSettingChange = async (setting, value) => {
        try {
            const token = localStorage.getItem('token');
            await axios.put(
                'http://localhost:5000/api/admin/settings',
                { [setting]: value },
                {
                    headers: {
                        'Authorization': `Bearer ${token}`,
                        'Content-Type': 'application/json'
                    }
                }
            );
            setSystemSettings(prev => ({ ...prev, [setting]: value }));
            toast.success('Settings updated successfully');
        } catch (error) {
            console.error('Error updating settings:', error);
            toast.error('Failed to update settings');
        }
    };

    const handleDelete = async (userId) => {
        try {
            const token = localStorage.getItem('token');
            if (!token) {
                toast.error('Authentication required');
                return;
            }

            const response = await axios.delete(
                `http://localhost:5000/api/admin/users/${userId}`,
                {
                    headers: {
                        'Authorization': `Bearer ${token}`,
                        'Content-Type': 'application/json'
                    }
                }
            );

            if (response.data.message) {
                toast.success(response.data.message);
                // Refresh the users list
                fetchUsers();
            }
        } catch (error) {
            console.error('Error deleting user:', error);
            toast.error(error.response?.data?.message || 'Failed to delete user');
        }
    };

    // Fetch courses
    const fetchCourses = async () => {
        try {
            const token = localStorage.getItem('token');
            const response = await axios.get('http://localhost:5000/api/admin/courses', {
                headers: {
                    'Authorization': `Bearer ${token}`,
                    'Content-Type': 'application/json'
                }
            });
            setCourses(response.data);
        } catch (error) {
            console.error('Error fetching courses:', error);
            toast.error('Failed to fetch courses');
        }
    };

    // Handle platform settings update
    const handlePlatformSettingChange = async (setting, value) => {
        try {
            const token = localStorage.getItem('token');
            const updatedSettings = {
                ...platformSettings,
                [setting]: value
            };

            await axios.put(
                'http://localhost:5000/api/admin/platform-settings',
                updatedSettings,
                {
                    headers: {
                        'Authorization': `Bearer ${token}`,
                        'Content-Type': 'application/json'
                    }
                }
            );
            setPlatformSettings(updatedSettings);
            toast.success('Platform settings updated successfully');
        } catch (error) {
            console.error('Error updating platform settings:', error);
            toast.error('Failed to update platform settings');
        }
    };

    // Fetch platform settings
    const fetchPlatformSettings = async () => {
        try {
            const token = localStorage.getItem('token');
            const response = await axios.get('http://localhost:5000/api/admin/platform-settings', {
                headers: {
                    'Authorization': `Bearer ${token}`,
                    'Content-Type': 'application/json'
                }
            });
            setPlatformSettings(response.data);
        } catch (error) {
            console.error('Error fetching platform settings:', error);
            toast.error('Failed to fetch platform settings');
        }
    };

    // Handle course category management
    const handleCategoryAction = async (action, categoryId) => {
        try {
            const token = localStorage.getItem('token');
            switch (action) {
                case 'delete':
                    await axios.delete(`http://localhost:5000/api/admin/categories/${categoryId}`, {
                        headers: {
                            'Authorization': `Bearer ${token}`,
                            'Content-Type': 'application/json'
                        }
                    });
                    toast.success('Category deleted successfully');
                    break;
                case 'toggle':
                    await axios.put(
                        `http://localhost:5000/api/admin/categories/${categoryId}/toggle`,
                        {},
                        {
                            headers: {
                                'Authorization': `Bearer ${token}`,
                                'Content-Type': 'application/json'
                            }
                        }
                    );
                    toast.success('Category status updated');
                    break;
                default:
                    break;
            }
            fetchCategories();
        } catch (error) {
            console.error('Error managing category:', error);
            toast.error('Failed to manage category');
        }
    };

    // Fetch categories
    const fetchCategories = async () => {
        try {
            const token = localStorage.getItem('token');
            const response = await axios.get('http://localhost:5000/api/admin/categories', {
                headers: {
                    'Authorization': `Bearer ${token}`,
                    'Content-Type': 'application/json'
                }
            });
            setCourseCategories(response.data);
        } catch (error) {
            console.error('Error fetching categories:', error);
            toast.error('Failed to fetch categories');
        }
    };

    // Handle category submission
    const handleCategorySubmit = async (e) => {
        e.preventDefault();
        try {
            const token = localStorage.getItem('token');
            const categoryData = {
                name: selectedCategory.name,
                description: selectedCategory.description
            };

            if (selectedCategory?._id) {
                // Update existing category
                await axios.put(
                    `http://localhost:5000/api/admin/categories/${selectedCategory._id}`,
                    categoryData,
                    {
                        headers: {
                            'Authorization': `Bearer ${token}`,
                            'Content-Type': 'application/json'
                        }
                    }
                );
                toast.success('Category updated successfully');
            } else {
                // Create new category
                await axios.post(
                    'http://localhost:5000/api/admin/categories',
                    categoryData,
                    {
                        headers: {
                            'Authorization': `Bearer ${token}`,
                            'Content-Type': 'application/json'
                        }
                    }
                );
                toast.success('Category created successfully');
            }
            setShowCategoryModal(false);
            setSelectedCategory(null);
            fetchCategories();
        } catch (error) {
            console.error('Error saving category:', error);
            toast.error(error.response?.data?.message || 'Failed to save category');
        }
    };

    // Handle tab change
    const [activeTab, setActiveTab] = useState('courses');
    const handleTabChange = (tab) => {
        setActiveTab(tab);
    };

    // Handle user edit submission
    const handleSubmit = async (e) => {
        e.preventDefault();
        try {
            const token = localStorage.getItem('token');
            await axios.put(
                `http://localhost:5000/api/admin/users/${selectedUser._id}`,
                selectedUser,
                {
                    headers: {
                        'Authorization': `Bearer ${token}`,
                        'Content-Type': 'application/json'
                    }
                }
            );
            toast.success('User updated successfully');
            setShowEditModal(false);
            fetchUsers();
        } catch (error) {
            console.error('Error updating user:', error);
            toast.error('Failed to update user');
        }
    };

    // Handle user edit
    const handleEdit = (user) => {
        setSelectedUser(user);
        setShowEditModal(true);
    };

    // Handle course submission
    const handleCourseSubmit = async (e) => {
        e.preventDefault();
        try {
            const token = localStorage.getItem('token');
            if (selectedCourse) {
                // Update existing course
                await axios.put(
                    `http://localhost:5000/api/admin/courses/${selectedCourse._id}`,
                    selectedCourse,
                    {
                        headers: {
                            'Authorization': `Bearer ${token}`,
                            'Content-Type': 'application/json'
                        }
                    }
                );
                toast.success('Course updated successfully');
            } else {
                // Create new course
                await axios.post(
                    'http://localhost:5000/api/admin/courses',
                    selectedCourse,
                    {
                        headers: {
                            'Authorization': `Bearer ${token}`,
                            'Content-Type': 'application/json'
                        }
                    }
                );
                toast.success('Course created successfully');
            }
            setShowCourseModal(false);
            fetchCourses();
        } catch (error) {
            console.error('Error managing course:', error);
            toast.error('Failed to manage course');
        }
    };

    useEffect(() => {
        fetchUsers();
        fetchStats();
        fetchCourses();
        fetchCategories();
        fetchPlatformSettings();
    }, []);

    return (
        <div className="admin-dashboard">
            <div className="dashboard-header">
                <h1>Admin Dashboard</h1>
                <div className="header-actions">
                    <button className="refresh-btn" onClick={() => {
                        fetchUsers();
                        fetchStats();
                    }}>
                        Refresh Data
                    </button>
                </div>
            </div>

            <div className="dashboard-grid">
                {/* User Management Section */}
                <div className="dashboard-card user-management">
                    <div className="card-header">
                        <FaUsers className="card-icon" />
                        <h2>User Management</h2>
                    </div>
                    <div className="card-content">
                        <div className="users-table-container">
                            <table className="users-table">
                                <thead>
                                    <tr>
                                        <th>Name</th>
                                        <th>Email</th>
                                        <th>Role</th>
                                        <th>Status</th>
                                        <th>Actions</th>
                                    </tr>
                                </thead>
                                <tbody>
                                    {users.map(user => (
                                        <tr key={user._id}>
                                            <td>{user.name}</td>
                                            <td>{user.email}</td>
                                            <td>{user.role}</td>
                                            <td>
                                                <span className={`status-badge ${user.status}`}>
                                                    {user.status}
                                                </span>
                                            </td>
                                            <td className="action-buttons">
                                                <button
                                                    className="action-btn edit"
                                                    onClick={() => {
                                                        setSelectedUser(user);
                                                        setShowEditModal(true);
                                                    }}
                                                >
                                                    <FaEdit />
                                                </button>
                                                <button
                                                    className="action-btn delete"
                                                    onClick={() => handleDelete(user._id)}
                                                >
                                                    <FaTrash />
                                                </button>
                                            </td>
                                        </tr>
                                    ))}
                                </tbody>
                            </table>
                        </div>
                    </div>
                </div>

                {/* System Settings Section */}
                <div className="dashboard-card system-settings">
                    <div className="card-header">
                        <FaCog className="card-icon" />
                        <h2>System Settings</h2>
                    </div>
                    <div className="card-content">
                        <div className="settings-grid">
                            <div className="setting-item">
                                <div className="setting-info">
                                    <FaCog className="setting-icon" />
                                    <h3>Maintenance Mode</h3>
                                </div>
                                <label className="switch">
                                    <input
                                        type="checkbox"
                                        checked={systemSettings.maintenanceMode}
                                        onChange={(e) => handleSettingChange('maintenanceMode', e.target.checked)}
                                    />
                                    <span className="slider"></span>
                                </label>
                            </div>
                            <div className="setting-item">
                                <div className="setting-info">
                                    <FaShieldAlt className="setting-icon" />
                                    <h3>Auto Backup</h3>
                                </div>
                                <label className="switch">
                                    <input
                                        type="checkbox"
                                        checked={systemSettings.autoBackup}
                                        onChange={(e) => handleSettingChange('autoBackup', e.target.checked)}
                                    />
                                    <span className="slider"></span>
                                </label>
                            </div>
                        </div>
                    </div>
                </div>

                {/* Security Section */}
                <div className="dashboard-card security">
                    <div className="card-header">
                        <FaShieldAlt className="card-icon" />
                        <h2>Security</h2>
                    </div>
                    <div className="card-content">
                        <div className="security-stats">
                            <div className="stat-item">
                                <h3>Total Users</h3>
                                <p>{stats.totalUsers}</p>
                            </div>
                            <div className="stat-item">
                                <h3>Active Users</h3>
                                <p>{stats.activeUsers}</p>
                            </div>
                            <div className="stat-item">
                                <h3>Total Courses</h3>
                                <p>{stats.totalCourses}</p>
                            </div>
                            <div className="stat-item">
                                <h3>Total Revenue</h3>
                                <p>${stats.totalRevenue}</p>
                            </div>
                        </div>
                    </div>
                </div>
            </div>

            {/* Add User Modal */}
            {showAddModal && (
                <div className="modal-overlay">
                    <div className="modal-content">
                        <h2>Add New User</h2>
                        <form onSubmit={handleSubmit}>
                            <div className="form-group">
                                <label>Name</label>
                                <input
                                    type="text"
                                    value={newUser.name}
                                    onChange={(e) => setNewUser({...newUser, name: e.target.value})}
                                    required
                                />
                            </div>
                            <div className="form-group">
                                <label>Email</label>
                                <input
                                    type="email"
                                    value={newUser.email}
                                    onChange={(e) => setNewUser({...newUser, email: e.target.value})}
                                    required
                                />
                            </div>
                            <div className="form-group">
                                <label>Role</label>
                                <select
                                    value={newUser.role}
                                    onChange={(e) => setNewUser({...newUser, role: e.target.value})}
                                >
                                    <option value="student">Student</option>
                                    <option value="instructor">Instructor</option>
                                    <option value="admin">Admin</option>
                                </select>
                            </div>
                            <div className="modal-actions">
                                <button type="submit" className="btn-primary">Add User</button>
                                <button type="button" className="btn-secondary" onClick={() => setShowAddModal(false)}>Cancel</button>
                            </div>
                        </form>
                    </div>
                </div>
            )}

            {/* Edit User Modal */}
            {showEditModal && selectedUser && (
                <div className="modal-overlay">
                    <div className="modal-content">
                        <h2>Edit User</h2>
                        <form onSubmit={(e) => handleSubmit(e)}>
                            <div className="form-group">
                                <label>Name</label>
                                <input
                                    type="text"
                                    value={selectedUser.name}
                                    onChange={(e) => setSelectedUser({...selectedUser, name: e.target.value})}
                                    required
                                />
                            </div>
                            <div className="form-group">
                                <label>Email</label>
                                <input
                                    type="email"
                                    value={selectedUser.email}
                                    onChange={(e) => setSelectedUser({...selectedUser, email: e.target.value})}
                                    required
                                />
                            </div>
                            <div className="form-group">
                                <label>Role</label>
                                <select
                                    value={selectedUser.role}
                                    onChange={(e) => setSelectedUser({...selectedUser, role: e.target.value})}
                                >
                                    <option value="student">Student</option>
                                    <option value="instructor">Instructor</option>
                                    <option value="admin">Admin</option>
                                </select>
                            </div>
                            <div className="modal-actions">
                                <button type="submit" className="btn-primary">Save Changes</button>
                                <button type="button" className="btn-secondary" onClick={() => setShowEditModal(false)}>Cancel</button>
                            </div>
                        </form>
                    </div>
                </div>
            )}

            {/* Course Modal */}
            {showCourseModal && (
                <div className="modal-overlay">
                    <div className="modal-content">
                        <h2>{selectedCourse?._id ? 'Edit Course' : 'Add New Course'}</h2>
                        <form onSubmit={handleCourseSubmit}>
                            <div className="form-group">
                                <label>Title</label>
                                <input
                                    type="text"
                                    value={selectedCourse?.title || ''}
                                    onChange={(e) => setSelectedCourse(prev => ({ ...prev, title: e.target.value }))}
                                    required
                                />
                            </div>
                            <div className="form-group">
                                <label>Description</label>
                                <textarea
                                    value={selectedCourse?.description || ''}
                                    onChange={(e) => setSelectedCourse(prev => ({ ...prev, description: e.target.value }))}
                                    required
                                />
                            </div>
                            <div className="form-group">
                                <label>Category</label>
                                <select
                                    value={selectedCourse?.category || ''}
                                    onChange={(e) => setSelectedCourse(prev => ({ ...prev, category: e.target.value }))}
                                    required
                                >
                                    <option value="">Select Category</option>
                                    {courseCategories.map(category => (
                                        <option key={category._id} value={category._id}>
                                            {category.name}
                                        </option>
                                    ))}
                                </select>
                            </div>
                            <div className="form-group">
                                <label>Instructor</label>
                                <select
                                    value={selectedCourse?.instructor || ''}
                                    onChange={(e) => setSelectedCourse(prev => ({ ...prev, instructor: e.target.value }))}
                                    required
                                >
                                    <option value="">Select Instructor</option>
                                    {users
                                        .filter(user => user.role === 'instructor')
                                        .map(instructor => (
                                            <option key={instructor._id} value={instructor._id}>
                                                {instructor.name}
                                            </option>
                                        ))}
                                </select>
                            </div>
                            <div className="modal-actions">
                                <button type="submit" className="btn-primary">
                                    {selectedCourse?._id ? 'Save Changes' : 'Add Course'}
                                </button>
                                <button
                                    type="button"
                                    className="btn-secondary"
                                    onClick={() => {
                                        setShowCourseModal(false);
                                        setSelectedCourse(null);
                                    }}
                                >
                                    Cancel
                                </button>
                            </div>
                        </form>
                    </div>
                </div>
            )}

            {/* Category Modal */}
            {showCategoryModal && (
                <div className="modal-overlay">
                    <div className="modal-content">
                        <h2>{selectedCategory?._id ? 'Edit Category' : 'Add New Category'}</h2>
                        <form onSubmit={handleCategorySubmit}>
                            <div className="form-group">
                                <label>Name</label>
                                <input
                                    type="text"
                                    value={selectedCategory?.name || ''}
                                    onChange={(e) => setSelectedCategory(prev => ({ ...prev, name: e.target.value }))}
                                    required
                                />
                            </div>
                            <div className="form-group">
                                <label>Description</label>
                                <textarea
                                    value={selectedCategory?.description || ''}
                                    onChange={(e) => setSelectedCategory(prev => ({ ...prev, description: e.target.value }))}
                                    required
                                />
                            </div>
                            <div className="modal-actions">
                                <button type="submit" className="btn-primary">
                                    {selectedCategory?._id ? 'Save Changes' : 'Add Category'}
                                </button>
                                <button
                                    type="button"
                                    className="btn-secondary"
                                    onClick={() => {
                                        setShowCategoryModal(false);
                                        setSelectedCategory(null);
                                    }}
                                >
                                    Cancel
                                </button>
                            </div>
                        </form>
                    </div>
                </div>
            )}
        </div>
    );
};

export default AdminDashboard; 