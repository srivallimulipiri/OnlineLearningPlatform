import React, { useState, useEffect, useCallback } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { courseAPI } from '../services/api';
import LoadingSkeleton from '../components/LoadingSkeleton';
import Toast from '../components/Toast';
import '../components/teacher/CreateCourse.css'; // Reusing styles from CreateCourse

function EditCourse() {
  const { id } = useParams();
  const navigate = useNavigate();
  const [course, setCourse] = useState(null);
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
  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);
  const [imageFile, setImageFile] = useState(null);
  const [toast, setToast] = useState({ show: false, message: '', type: '' });

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

  const fetchCourse = useCallback(async () => {
    setLoading(true);
    try {
      const response = await courseAPI.getById(id);
      const fetchedCourse = response.data.data.course;
      setCourse(fetchedCourse);
      setFormData({
        title: fetchedCourse.title,
        description: fetchedCourse.description,
        category: fetchedCourse.category,
        level: fetchedCourse.level,
        price: fetchedCourse.price.toString(),
        requirements: fetchedCourse.requirements.length > 0 ? fetchedCourse.requirements : [''],
        whatYouWillLearn: fetchedCourse.whatYouWillLearn.length > 0 ? fetchedCourse.whatYouWillLearn : [''],
        tags: fetchedCourse.tags.join(', ')
      });
    } catch (err) {
      console.error('Failed to fetch course:', err);
      setToast({ show: true, message: 'Failed to load course details.', type: 'error' });
      navigate('/teacher-dashboard'); // Redirect if course not found or error
    } finally {
      setLoading(false);
    }
  }, [id, navigate]);

  useEffect(() => {
    fetchCourse();
  }, [fetchCourse]);

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

  const handleImageUpload = async (file) => {
    const formDataUpload = new FormData();
    formDataUpload.append('courseImage', file);

    try {
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
        return data.data.url;
      }
      throw new Error('Image upload failed');
    } catch (error) {
      console.error('Error uploading image:', error);
      setToast({ show: true, message: 'Image upload failed.', type: 'error' });
      return null;
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setSubmitting(true);

    try {
      let imageUrl = course?.image;
      if (imageFile) {
        imageUrl = await handleImageUpload(imageFile);
        if (!imageUrl) {
          throw new Error('Image upload failed, cannot save course.');
        }
      }

      const courseData = {
        ...formData,
        price: parseFloat(formData.price) || 0,
        image: imageUrl,
        requirements: formData.requirements.filter(req => req.trim()),
        whatYouWillLearn: formData.whatYouWillLearn.filter(item => item.trim()),
        tags: formData.tags.split(',').map(tag => tag.trim()).filter(tag => tag)
      };

      await courseAPI.update(id, courseData);

      setToast({ show: true, message: 'Course updated successfully!', type: 'success' });
      // Optionally, navigate back or refresh data
      // navigate('/teacher-dashboard');
    } catch (error) {
      console.error('Error updating course:', error);
      const message = error?.response?.data?.message || error?.message || 'Failed to update course';
      let errorMessage = `Error: ${message}`;

      if (error?.response?.data?.errors && Array.isArray(error.response.data.errors)) {
        errorMessage += '\n\nDetails:\n';
        error.response.data.errors.forEach(err => {
          errorMessage += `- ${err.field}: ${err.message}\n`;
        });
      }
      setToast({ show: true, message: errorMessage, type: 'error' });
    } finally {
      setSubmitting(false);
    }
  };

  if (loading) {
    return <LoadingSkeleton type="form" />;
  }

  if (!course) {
    return <div className="error-message">Course not found.</div>;
  }

  return (
    <div className="create-course">
      {toast.show && (
        <Toast
          message={toast.message}
          type={toast.type}
          onClose={() => setToast({ ...toast, show: false })}
        />
      )}
      <h2>Edit Course: {course.title}</h2>
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
            {imageFile ? (
              <div className="image-preview"><img src={URL.createObjectURL(imageFile)} alt="Preview" /></div>
            ) : course.image ? (
              <div className="image-preview"><img src={course.image} alt="Current" /></div>
            ) : (
              <p>No image uploaded yet.</p>
            )}
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
          <button type="submit" disabled={submitting} className="btn-primary">
            {submitting ? 'Saving...' : 'Save Changes'}
          </button>
        </div>
      </form>

      <div className="form-section">
        <h3>Course Content (Sections & Lessons)</h3>
        <div className="sections-list">
          {course.sections.sort((a, b) => a.order - b.order).map((section, sectionIndex) => (
            <div key={section._id} className="section-item">
              <div className="section-header">
                <h4>Section {sectionIndex + 1}: {section.title}</h4>
                <div className="section-actions">
                  <button type="button" className="btn-secondary" onClick={() => handleEditSection(section._id)}>Edit</button>
                  <button type="button" className="btn-danger" onClick={() => handleDeleteSection(section._id)}>Delete</button>
                </div>
              </div>
              <p>{section.description}</p>

              <div className="lessons-list">
                {section.lessons.sort((a, b) => a.order - b.order).map((lesson, lessonIndex) => (
                  <div key={lesson._id} className="lesson-item">
                    <h5>Lesson {lessonIndex + 1}: {lesson.title}</h5>
                    <p>{lesson.description}</p>
                    {lesson.videoUrl && <p>Video: <a href={lesson.videoUrl} target="_blank" rel="noopener noreferrer">{lesson.videoUrl}</a></p>}
                    {lesson.duration && <p>Duration: {lesson.duration} minutes</p>}
                    <div className="lesson-actions">
                      <button type="button" className="btn-secondary" onClick={() => handleEditLesson(section._id, lesson._id)}>Edit</button>
                      <button type="button" className="btn-danger" onClick={() => handleDeleteLesson(section._id, lesson._id)}>Delete</button>
                    </div>
                  </div>
                ))}
                <button type="button" className="btn-add" onClick={() => handleAddLesson(section._id)}>+ Add Lesson</button>
              </div>
            </div>
          ))}
        </div>
        <button type="button" className="btn-primary" onClick={handleAddSection}>+ Add Section</button>
      </div>
    </div>
  );
}

export default EditCourse;
