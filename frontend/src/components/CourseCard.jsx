import React from 'react';
import { Link } from 'react-router-dom';
import { formatCurrency } from '../utils/helpers';
import ProgressBar from './ProgressBar';
import { FaStar, FaUserGraduate, FaClock, FaPlay, FaBookmark, FaHeart } from 'react-icons/fa';

function CourseCard({ course, showProgress = false, onEnroll, loading = false }) {
  const {
    id,
    title,
    description,
    instructor,
    image,
    price,
    level,
    rating,
    studentsCount,
    duration,
    category,
    progress = 0,
    isEnrolled = false
  } = course;

  const handleEnroll = (e) => {
    e.preventDefault();
    e.stopPropagation();
    if (onEnroll) {
      onEnroll(course);
    }
  };

  const getLevelColor = (level) => {
    switch (level?.toLowerCase()) {
      case 'beginner':
        return 'bg-secondary-100 text-secondary-800';
      case 'intermediate':
        return 'bg-accent-100 text-accent-800';
      case 'advanced':
        return 'bg-danger-100 text-danger-800';
      default:
        return 'bg-neutral-100 text-neutral-800';
    }
  };

  return (
    <div className="course-card group">
      {/* Course Image */}
      <div className="course-card-image relative">
        <img
          src={image || `https://source.unsplash.com/random/400x250?education,${id}`}
          alt={title}
          className="w-full h-full object-cover"
        />
        
        {/* Overlay on Hover */}
        <div className="absolute inset-0 bg-black bg-opacity-0 group-hover:bg-opacity-40 transition-all duration-300 flex items-center justify-center">
          <div className="opacity-0 group-hover:opacity-100 transition-opacity duration-300">
            <Link
              to={`/course/${id}`}
              className="bg-white bg-opacity-90 backdrop-blur-sm rounded-full p-4 hover:bg-opacity-100 transition-all duration-200"
            >
              <FaPlay className="text-primary-600 text-xl" />
            </Link>
          </div>
        </div>

        {/* Top Badges */}
        <div className="absolute top-4 left-4 flex flex-wrap gap-2">
          <span className="bg-white bg-opacity-90 backdrop-blur-sm text-primary-700 text-xs font-semibold px-3 py-1 rounded-full">
            {category}
          </span>
          <span className={`text-xs font-semibold px-3 py-1 rounded-full ${getLevelColor(level)}`}>
            {level}
          </span>
        </div>

        {/* Bookmark Icon */}
        <button className="absolute top-4 right-4 p-2 bg-white bg-opacity-90 backdrop-blur-sm rounded-full hover:bg-opacity-100 transition-all duration-200">
          <FaBookmark className="text-neutral-600 text-sm" />
        </button>

        {/* Price Badge */}
        <div className="absolute bottom-4 right-4">
          <span className="bg-white bg-opacity-90 backdrop-blur-sm text-neutral-800 font-bold px-3 py-1 rounded-full text-sm">
            {price === 0 ? 'Free' : formatCurrency(price)}
          </span>
        </div>
      </div>

      {/* Course Content */}
      <div className="course-card-content">
        {/* Course Title */}
        <h3 className="text-xl font-bold text-neutral-800 mb-2 line-clamp-2 group-hover:text-primary-600 transition-colors duration-200">
          {title}
        </h3>

        {/* Instructor */}
        <p className="text-sm text-neutral-600 mb-3 font-medium">by {instructor}</p>

        {/* Description */}
        <p className="text-neutral-700 text-sm mb-4 line-clamp-2 leading-relaxed">
          {description}
        </p>

        {/* Progress Bar for Enrolled Courses */}
        {showProgress && isEnrolled && (
          <div className="mb-4">
            <div className="flex justify-between items-center mb-2">
              <span className="text-xs font-medium text-neutral-600">Progress</span>
              <span className="text-xs font-bold text-primary-600">{progress}%</span>
            </div>
            <ProgressBar progress={progress} variant="primary" size="sm" showLabel={false} />
          </div>
        )}

        {/* Course Stats */}
        <div className="flex items-center justify-between text-neutral-600 text-sm mb-6">
          <div className="flex items-center space-x-4">
            <div className="flex items-center space-x-1">
              <FaStar className="text-accent-500 text-xs" />
              <span className="font-medium">{rating}</span>
              <span className="text-neutral-400">({studentsCount})</span>
            </div>
            <div className="flex items-center space-x-1">
              <FaClock className="text-primary-500 text-xs" />
              <span>{duration}</span>
            </div>
          </div>
        </div>

        {/* Action Buttons */}
        <div className="flex items-center justify-between mt-auto">
          {isEnrolled ? (
            <Link
              to={`/course/${id}`}
              className="flex-1 bg-gradient-to-r from-secondary-500 to-secondary-600 text-white px-4 py-3 rounded-xl font-semibold hover:from-secondary-600 hover:to-secondary-700 transition-all duration-200 text-center shadow-lg hover:shadow-xl transform hover:-translate-y-0.5"
            >
              Continue Learning
            </Link>
          ) : (
            <div className="flex space-x-3 w-full">
              <Link
                to={`/course/${id}`}
                className="flex-1 border-2 border-primary-500 text-primary-600 px-4 py-3 rounded-xl font-semibold hover:bg-primary-50 transition-all duration-200 text-center"
              >
                Preview
              </Link>
              <button
                onClick={handleEnroll}
                disabled={loading}
                className="flex-1 bg-gradient-to-r from-primary-500 to-primary-600 text-white px-4 py-3 rounded-xl font-semibold hover:from-primary-600 hover:to-primary-700 transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed shadow-lg hover:shadow-xl transform hover:-translate-y-0.5 disabled:transform-none"
              >
                {loading ? (
                  <div className="flex items-center justify-center space-x-2">
                    <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                    <span>Enrolling...</span>
                  </div>
                ) : (
                  'Enroll Now'
                )}
              </button>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

export default CourseCard;
