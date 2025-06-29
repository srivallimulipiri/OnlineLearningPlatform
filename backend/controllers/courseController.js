const Course = require('../models/Course');
const Enrollment = require('../models/Enrollment');
const { asyncHandler } = require('../middleware/errorMiddleware');
const { sendCourseEnrollmentEmail } = require('../utils/sendEmail');

// Get all courses with optional filters
const getCourses = asyncHandler(async (req, res) => {
  const { category, level, priceRange, search, sortBy, page = 1, limit = 12 } = req.query;

  const query = { isPublished: true, isApproved: true };

  // Apply filters
  if (category) query.category = category;
  if (level) query.level = level;

  if (priceRange) {
    if (priceRange === 'free') {
      query.price = 0;
    } else if (priceRange.includes('-')) {
      const [min, max] = priceRange.split('-').map(Number);
      query.price = { $gte: min, $lte: max };
    } else if (priceRange.endsWith('+')) {
      const min = Number(priceRange.slice(0, -1));
      query.price = { $gte: min };
    }
  }

  if (search) {
    query.$or = [
      { title: { $regex: search, $options: 'i' } },
      { description: { $regex: search, $options: 'i' } },
      { tags: { $in: [new RegExp(search, 'i')] } }
    ];
  }

  // Sorting
  let sort = { createdAt: -1 };
  if (sortBy) {
    switch (sortBy) {
      case 'newest':
        sort = { createdAt: -1 };
        break;
      case 'oldest':
        sort = { createdAt: 1 };
        break;
      case 'popular':
        sort = { 'enrolledStudents.length': -1 };
        break;
      case 'rating':
        sort = { rating: -1 };
        break;
      case 'price-low':
        sort = { price: 1 };
        break;
      case 'price-high':
        sort = { price: -1 };
        break;
      default:
        sort = { createdAt: -1 };
    }
  }

  const skip = (page - 1) * limit;

  const courses = await Course.find(query)
    .sort(sort)
    .skip(skip)
    .limit(Number(limit))
    .populate('instructor', 'name email avatar')
    .select('-sections'); // Don't include sections in list view

  const total = await Course.countDocuments(query);

  res.json({
    status: 'success',
    data: {
      courses,
      pagination: {
        total,
        page: Number(page),
        limit: Number(limit),
        totalPages: Math.ceil(total / limit)
      }
    }
  });
});

// Get course by ID
const getCourseById = asyncHandler(async (req, res) => {
  const course = await Course.findById(req.params.id)
    .populate('instructor', 'name email avatar bio')
    .populate('reviews.student', 'name avatar');

  if (!course) {
    res.status(404);
    throw new Error('Course not found');
  }

  // Check if user is enrolled (if authenticated)
  let isEnrolled = false;
  let enrollment = null;
  
  if (req.user) {
    enrollment = await Enrollment.findOne({
      student: req.user._id,
      course: course._id
    });
    isEnrolled = !!enrollment;
  }

  res.json({ 
    status: 'success', 
    data: {
      course,
      isEnrolled,
      enrollment
    }
  });
});

// Create new course (Teacher only)
const createCourse = asyncHandler(async (req, res) => {
  const { 
    title, 
    description, 
    category, 
    level, 
    price, 
    image, 
    requirements,
    whatYouWillLearn,
    tags
  } = req.body;

  const course = new Course({
    title,
    description,
    category,
    level,
    price: Number(price),
    image,
    requirements: requirements || [],
    whatYouWillLearn: whatYouWillLearn || [],
    tags: tags || [],
    instructor: req.user._id,
    isPublished: false,
    isApproved: false
  });

  const savedCourse = await course.save();
  await savedCourse.populate('instructor', 'name email');

  res.status(201).json({ 
    status: 'success', 
    data: savedCourse 
  });
});

// Update course
const updateCourse = asyncHandler(async (req, res) => {
  const course = await Course.findById(req.params.id);

  if (!course) {
    res.status(404);
    throw new Error('Course not found');
  }

  // Only instructor or admin can update
  if (course.instructor.toString() !== req.user._id.toString() && req.user.role !== 'admin') {
    res.status(403);
    throw new Error('Not authorized to update this course');
  }

  const updates = req.body;
  
  // Don't allow updating certain fields after approval
  if (course.isApproved && req.user.role !== 'admin') {
    delete updates.price;
    delete updates.category;
  }

  Object.assign(course, updates);
  const updatedCourse = await course.save();

  res.json({ status: 'success', data: updatedCourse });
});

// Delete course
const deleteCourse = asyncHandler(async (req, res) => {
  const course = await Course.findById(req.params.id);

  if (!course) {
    res.status(404);
    throw new Error('Course not found');
  }

  // Only instructor or admin can delete
  if (course.instructor.toString() !== req.user._id.toString() && req.user.role !== 'admin') {
    res.status(403);
    throw new Error('Not authorized to delete this course');
  }

  // Check if course has enrollments
  const enrollmentCount = await Enrollment.countDocuments({ course: course._id });
  if (enrollmentCount > 0 && req.user.role !== 'admin') {
    res.status(400);
    throw new Error('Cannot delete course with active enrollments');
  }

  await Course.findByIdAndDelete(req.params.id);

  res.json({ status: 'success', message: 'Course deleted successfully' });
});

// Enroll in course
const enrollInCourse = asyncHandler(async (req, res) => {
  const course = await Course.findById(req.params.id)
    .populate('instructor', 'name email');

  if (!course) {
    res.status(404);
    throw new Error('Course not found');
  }

  if (!course.isPublished || !course.isApproved) {
    res.status(400);
    throw new Error('Course is not available for enrollment');
  }

  // Check if already enrolled
  const existingEnrollment = await Enrollment.findOne({
    student: req.user._id,
    course: course._id
  });

  if (existingEnrollment) {
    res.status(400);
    throw new Error('Already enrolled in this course');
  }

  // Create enrollment
  const enrollment = await Enrollment.create({
    student: req.user._id,
    course: course._id,
    amountPaid: course.price,
    paymentStatus: course.price === 0 ? 'completed' : 'pending'
  });

  // Add student to course's enrolledStudents
  course.enrolledStudents.push(req.user._id);
  await course.save();

  // Send enrollment email
  sendCourseEnrollmentEmail(
    req.user.email,
    req.user.name,
    course.title,
    course.instructor.name
  );

  res.status(201).json({ 
    status: 'success', 
    data: enrollment 
  });
});

// Update progress
const updateProgress = asyncHandler(async (req, res) => {
  const { sectionId, lessonId, completed } = req.body;

  const enrollment = await Enrollment.findOne({
    student: req.user._id,
    course: req.params.id
  });

  if (!enrollment) {
    res.status(404);
    throw new Error('Enrollment not found');
  }

  // Mark lesson as completed if completed flag is true
  if (completed) {
    await enrollment.completeLesson(sectionId, lessonId);
  }

  // Update progress
  await enrollment.updateProgress();

  res.json({ status: 'success', data: enrollment });
});

// Add review to course
const addReview = asyncHandler(async (req, res) => {
  const { rating, comment } = req.body;
  const course = await Course.findById(req.params.id);

  if (!course) {
    res.status(404);
    throw new Error('Course not found');
  }

  // Check if user is enrolled
  const enrollment = await Enrollment.findOne({
    student: req.user._id,
    course: course._id
  });

  if (!enrollment) {
    res.status(400);
    throw new Error('You must be enrolled to review this course');
  }

  // Check if user already reviewed
  const existingReview = course.reviews.find(
    review => review.student.toString() === req.user._id.toString()
  );

  if (existingReview) {
    res.status(400);
    throw new Error('You have already reviewed this course');
  }

  // Add review
  course.reviews.push({
    student: req.user._id,
    rating: Number(rating),
    comment
  });

  // Recalculate average rating
  await course.calculateAverageRating();

  res.status(201).json({ 
    status: 'success', 
    message: 'Review added successfully' 
  });
});

// Get teacher's courses
const getTeacherCourses = asyncHandler(async (req, res) => {
  const { page = 1, limit = 10 } = req.query;
  const skip = (page - 1) * limit;

  console.log(`Fetching courses for instructor ID: ${req.user._id}`);

  const courses = await Course.find({ instructor: req.user._id })
    .sort({ createdAt: -1 })
    .skip(skip)
    .limit(Number(limit))
    .populate('enrolledStudents', 'name email');

  const total = await Course.countDocuments({ instructor: req.user._id });

  console.log(`Found ${courses.length} courses for instructor ${req.user._id}. Total count: ${total}`);
  console.log('Courses data:', courses);

  res.json({
    status: 'success',
    data: {
      courses,
      pagination: {
        total,
        page: Number(page),
        limit: Number(limit),
        totalPages: Math.ceil(total / limit)
      }
    }
  });
});

// Add section to course
const addSection = asyncHandler(async (req, res) => {
  const { title, description, order } = req.body;
  const course = await Course.findById(req.params.id);

  if (!course) {
    res.status(404);
    throw new Error('Course not found');
  }

  // Check course ownership (already handled by checkCourseOwnership middleware)

  const newSection = {
    title,
    description,
    order: order !== undefined ? order : course.sections.length
  };

  course.sections.push(newSection);
  await course.save();

  res.status(201).json({
    status: 'success',
    data: course.sections[course.sections.length - 1] // Return the newly added section
  });
});

// Update section in course
const updateSection = asyncHandler(async (req, res) => {
  const { sectionId } = req.params;
  const { title, description, order } = req.body;
  const course = await Course.findById(req.params.id);

  if (!course) {
    res.status(404);
    throw new Error('Course not found');
  }

  // Check course ownership (already handled by checkCourseOwnership middleware)

  const section = course.sections.id(sectionId);
  if (!section) {
    res.status(404);
    throw new Error('Section not found');
  }

  if (title !== undefined) section.title = title;
  if (description !== undefined) section.description = description;
  if (order !== undefined) section.order = order;

  await course.save();

  res.json({
    status: 'success',
    data: section
  });
});

// Delete section from course
const deleteSection = asyncHandler(async (req, res) => {
  const { sectionId } = req.params;
  const course = await Course.findById(req.params.id);

  if (!course) {
    res.status(404);
    throw new Error('Course not found');
  }

  // Check course ownership (already handled by checkCourseOwnership middleware)

  const section = course.sections.id(sectionId);
  if (!section) {
    res.status(404);
    throw new Error('Section not found');
  }

  section.deleteOne(); // Use deleteOne() for subdocuments
  await course.save();

  res.json({
    status: 'success',
    message: 'Section deleted successfully'
  });
});

// Add lesson to section
const addLesson = asyncHandler(async (req, res) => {
  const { sectionId } = req.params;
  const { title, description, videoUrl, duration, resources, isPreview, order } = req.body;
  const course = await Course.findById(req.params.id);

  if (!course) {
    res.status(404);
    throw new Error('Course not found');
  }

  // Check course ownership (already handled by checkCourseOwnership middleware)

  const section = course.sections.id(sectionId);
  if (!section) {
    res.status(404);
    throw new Error('Section not found');
  }

  const newLesson = {
    title,
    description,
    videoUrl,
    duration,
    resources: resources || [],
    isPreview: isPreview || false,
    order: order !== undefined ? order : section.lessons.length
  };

  section.lessons.push(newLesson);
  await course.save();
  await course.calculateTotalDuration(); // Recalculate total course duration

  res.status(201).json({
    status: 'success',
    data: section.lessons[section.lessons.length - 1] // Return the newly added lesson
  });
});

// Update lesson in section
const updateLesson = asyncHandler(async (req, res) => {
  const { sectionId, lessonId } = req.params;
  const { title, description, videoUrl, duration, resources, isPreview, order } = req.body;
  const course = await Course.findById(req.params.id);

  if (!course) {
    res.status(404);
    throw new Error('Course not found');
  }

  // Check course ownership (already handled by checkCourseOwnership middleware)

  const section = course.sections.id(sectionId);
  if (!section) {
    res.status(404);
    throw new Error('Section not found');
  }

  const lesson = section.lessons.id(lessonId);
  if (!lesson) {
    res.status(404);
    throw new Error('Lesson not found');
  }

  if (title !== undefined) lesson.title = title;
  if (description !== undefined) lesson.description = description;
  if (videoUrl !== undefined) lesson.videoUrl = videoUrl;
  if (duration !== undefined) lesson.duration = duration;
  if (resources !== undefined) lesson.resources = resources;
  if (isPreview !== undefined) lesson.isPreview = isPreview;
  if (order !== undefined) lesson.order = order;

  await course.save();
  await course.calculateTotalDuration(); // Recalculate total course duration

  res.json({
    status: 'success',
    data: lesson
  });
});

// Delete lesson from section
const deleteLesson = asyncHandler(async (req, res) => {
  const { sectionId, lessonId } = req.params;
  const course = await Course.findById(req.params.id);

  if (!course) {
    res.status(404);
    throw new Error('Course not found');
  }

  // Check course ownership (already handled by checkCourseOwnership middleware)

  const section = course.sections.id(sectionId);
  if (!section) {
    res.status(404);
    throw new Error('Section not found');
  }

  const lesson = section.lessons.id(lessonId);
  if (!lesson) {
    res.status(404);
    throw new Error('Lesson not found');
  }

  lesson.deleteOne(); // Use deleteOne() for subdocuments
  await course.save();
  await course.calculateTotalDuration(); // Recalculate total course duration

  res.json({
    status: 'success',
    message: 'Lesson deleted successfully'
  });
});

module.exports = {
  getCourses,
  getCourseById,
  createCourse,
  updateCourse,
  deleteCourse,
  enrollInCourse,
  updateProgress,
  addReview,
  getTeacherCourses,
  addSection,
  updateSection,
  deleteSection,
  addLesson,
  updateLesson,
  deleteLesson
};
