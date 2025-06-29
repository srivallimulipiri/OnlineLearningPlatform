import React, { useState } from 'react';
import './CreateCourse.css';
import { courseAPI } from '../../services/api';

const CreateCourse = ({ onCourseCreated }) => {
  const [formData, setFormData] = useState({
    title: '',
    description: '',
    category: '',
    level: '',
    price: '',
    requirements: [''],
    whatYouWillLearn: [''],
    tags: ''
  });
  const [loading, setLoading] = useState(false);
  const [imageFile, setImageFile] = useState(null);

  const categories = [
    'Web Development',
    'Mobile Development',
    'Data Science',
    'Machine Learning',
    'Design',
    'Business',
    'Marketing',
    'Photography'
  ];

  const levels = ['Beginner', 'Intermediate', 'Advanced'];

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleArrayInputChange = (index, value, field) => {
    setFormData(prev => ({
      ...prev,
      [field]: prev[field].map((item, i) => (i === index ? value : item))
    }));
  };

  const addArrayItem = (field) => {
    setFormData(prev => ({
      ...prev,
      [field]: [...prev[field], '']
    }));
  };

  const removeArrayItem = (index, field) => {
    setFormData(prev => ({
      ...prev,
      [field]: prev[field].filter((_, i) => i !== index)
    }));
  };

  // FIX: Use correct token retrieval
  const handleImageUpload = async (file) => {
    const formDataUpload = new FormData();
    formDataUpload.append('courseImage', file);

    try {
      // Use the same logic as api.js for getting the token
      const storedUser = localStorage.getItem('user');
      const user = storedUser && storedUser !== 'null' ? JSON.parse(storedUser) : {};
      const token = user.token;

      const response = await fetch('http://localhost:5000/api/upload/course-image', {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${token}`
        },
        body: formDataUpload
      });

      if (response.ok) {
        const data = await response.json();
        // The backend returns { status, data: { ... } }
        return data.data.url;
      }
      throw new Error('Image upload failed');
    } catch (error) {
      console.error('Error uploading image:', error);
      return null;
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);

    try {
      let imageUrl = null;
      if (imageFile) {
        imageUrl = await handleImageUpload(imageFile);
      }

      const courseData = {
        ...formData,
        price: parseFloat(formData.price) || 0,
        image: imageUrl,
        requirements: formData.requirements.filter(req => req.trim()),
        whatYouWillLearn: formData.whatYouWillLearn.filter(item => item.trim()),
        tags: formData.tags.split(',').map(tag => tag.trim()).filter(tag => tag)
      };

      await courseAPI.create(courseData);

      alert('Course created successfully!');
      setFormData({
        title: '',
        description: '',
        category: '',
        level: '',
        price: '',
        requirements: [''],
        whatYouWillLearn: [''],
        tags: ''
      });
      setImageFile(null);
      if (onCourseCreated) onCourseCreated();
    } catch (error) {
      console.error('Error creating course:', error);
      // Show backend error message if available
      const message = error?.response?.data?.message || error?.message || 'Failed to create course';
      let errorMessage = `Error: ${message}`;

      if (error?.response?.data?.errors && Array.isArray(error.response.data.errors)) {
        errorMessage += '\n\nDetails:\n';
        error.response.data.errors.forEach(err => {
          errorMessage += `- ${err.field}: ${err.message}\n`;
        });
      }
      alert(errorMessage);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="create-course">
      <h2>Create New Course</h2>
      <form onSubmit={handleSubmit} className="course-form">
        <div className="form-section">
          <h3>Basic Information</h3>
          <div className="form-group">
            <label htmlFor="title">Course Title *</label>
            <input type="text" id="title" name="title" value={formData.title} onChange={handleInputChange} required placeholder="Enter course title" />
          </div>
          <div className="form-group">
            <label htmlFor="description">Description *</label>
            <textarea id="description" name="description" value={formData.description} onChange={handleInputChange} required rows="4" placeholder="Describe your course..." />
          </div>
          <div className="form-row">
            <div className="form-group">
              <label htmlFor="category">Category *</label>
              <select id="category" name="category" value={formData.category} onChange={handleInputChange} required>
                <option value="">Select category</option>
                {categories.map(cat => <option key={cat} value={cat}>{cat}</option>)}
              </select>
            </div>
            <div className="form-group">
              <label htmlFor="level">Level *</label>
              <select id="level" name="level" value={formData.level} onChange={handleInputChange} required>
                <option value="">Select level</option>
                {levels.map(level => <option key={level} value={level}>{level}</option>)}
              </select>
            </div>
            <div className="form-group">
              <label htmlFor="price">Price ($) *</label>
              <input type="number" id="price" name="price" value={formData.price} onChange={handleInputChange} min="0" step="0.01" required placeholder="0.00" />
            </div>
          </div>
        </div>

        <div className="form-section">
          <h3>Course Image</h3>
          <div className="form-group">
            <label htmlFor="image">Course Thumbnail</label>
            <input type="file" id="image" accept="image/*" onChange={(e) => setImageFile(e.target.files[0])} />
            {imageFile && <div className="image-preview"><img src={URL.createObjectURL(imageFile)} alt="Preview" /></div>}
          </div>
        </div>

        <div className="form-section">
          <h3>Course Requirements</h3>
          {formData.requirements.map((req, index) => (
            <div key={index} className="array-input">
              <input type="text" value={req} onChange={(e) => handleArrayInputChange(index, e.target.value, 'requirements')} placeholder="Enter a requirement" />
              {formData.requirements.length > 1 && <button type="button" onClick={() => removeArrayItem(index, 'requirements')} className="remove-btn">✕</button>}
            </div>
          ))}
          <button type="button" onClick={() => addArrayItem('requirements')} className="add-btn">+ Add Requirement</button>
        </div>

        <div className="form-section">
          <h3>What Students Will Learn</h3>
          {formData.whatYouWillLearn.map((item, index) => (
            <div key={index} className="array-input">
              <input type="text" value={item} onChange={(e) => handleArrayInputChange(index, e.target.value, 'whatYouWillLearn')} placeholder="What will students learn?" />
              {formData.whatYouWillLearn.length > 1 && <button type="button" onClick={() => removeArrayItem(index, 'whatYouWillLearn')} className="remove-btn">✕</button>}
            </div>
          ))}
          <button type="button" onClick={() => addArrayItem('whatYouWillLearn')} className="add-btn">+ Add Learning Outcome</button>
        </div>

        <div className="form-section">
          <h3>Tags</h3>
          <div className="form-group">
            <label htmlFor="tags">Tags (comma-separated)</label>
            <input type="text" id="tags" name="tags" value={formData.tags} onChange={handleInputChange} placeholder="javascript, react, frontend" />
          </div>
        </div>

        <div className="form-actions">
          <button type="submit" disabled={loading} className="btn-primary">
            {loading ? 'Creating...' : 'Create Course'}
          </button>
        </div>
      </form>
    </div>
  );
};

export default CreateCourse;
