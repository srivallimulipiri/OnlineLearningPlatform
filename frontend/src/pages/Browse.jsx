import { useCallback, useMemo } from 'react';

import CourseCard from '../components/CourseCard';
import CourseFilter from '../components/CourseFilter';
import LoadingSkeleton from '../components/LoadingSkeleton';
import { useCourses } from '../hooks/useCourses';
import { useAuth } from '../hooks/useAuth';
import { useNotification } from '../hooks/useNotification';
import './Browse.css';

function Browse() {
  const { user, isAuthenticated } = useAuth();
  const { notify } = useNotification();

  const {
    courses = [],
    loading,
    error,
    pagination = { page: 1, totalPages: 1, total: 0 },
    fetchCourses,
    enrollInCourse,
    loadMore,
    filters,
    setFilters
  } = useCourses();

  const handleFilterChange = useCallback(
    (newFilters) => setFilters(newFilters),
    [setFilters]
  );

  const handleEnroll = useCallback(
    async (course) => {
      if (!isAuthenticated) {
        notify?.warning?.('Please login to enroll in courses');
        return;
      }
      if (!user || user.role !== 'student') {
        notify?.error?.(`Only students can enroll (you are logged in as ${user?.role || 'guest'})`);
        return;
      }
      const result = await enrollInCourse(course._id, course.title);
      if (result.success) {
        fetchCourses({}, false);
      }
    },
    [isAuthenticated, user, notify, enrollInCourse, fetchCourses]
  );

  const handleLoadMore = useCallback(() => {
    if (pagination.page < pagination.totalPages && !loading) {
      loadMore();
    }
  }, [pagination.page, pagination.totalPages, loading, loadMore]);

  const handleRetry = useCallback(() => fetchCourses({}, false), [fetchCourses]);

  const courseCards = useMemo(
    () =>
      Array.isArray(courses)
        ? courses.map((course) => (
            <div className="browse-course-card" key={course._id}>
              <CourseCard
                course={{
                  id: course._id,
                  title: course.title,
                  description: course.description,
                  instructor: course.instructor?.name || 'Unknown Instructor',
                  image:
                    course.image ||
                    `https://source.unsplash.com/random/400x250?education,${course._id}`,
                  price: course.price,
                  level: course.level,
                  rating: course.rating || 0,
                  studentsCount: Array.isArray(course.enrolledStudents)
                    ? course.enrolledStudents.length
                    : 0,
                  duration: course.totalDuration
                    ? `${Math.round(course.totalDuration / 60)} hours`
                    : 'N/A',
                  category: course.category,
                  isEnrolled:
                    Array.isArray(course.enrolledStudents) && user?._id
                      ? course.enrolledStudents.includes(user._id)
                      : false
                }}
                onEnroll={() => handleEnroll(course)}
                loading={loading}
              />
            </div>
          ))
        : [],
    [courses, user?._id, handleEnroll, loading]
  );

  const loadingSkeletons = useMemo(
    () =>
      Array.from({ length: 6 }).map((_, idx) => (
        <div className="browse-course-card" key={idx}>
          <LoadingSkeleton type="card" />
        </div>
      )),
    []
  );

  return (
    <>
      
      <div className="browse-page">
        <div className="browse-container">
          <header className="browse-header">
            <h1 className="browse-title">Browse Courses</h1>
            <p className="browse-subtitle">
              Discover your next learning adventure from our extensive course catalog
            </p>
          </header>

          <section className="filter-section">
            <CourseFilter onFilterChange={handleFilterChange} initialFilters={filters} />
          </section>

          {error && (
            <div className="error-alert" role="alert">
              <h4>Error Loading Courses</h4>
              <p>{typeof error === 'string' ? error : 'Something went wrong'}</p>
              <button onClick={handleRetry}>Try Again</button>
            </div>
          )}

          <section>
            <div className="status-bar">
              <span className="count">
                {loading && courses.length === 0
                  ? 'Loading...'
                  : `Showing ${courses.length} of ${pagination.total} courses`}
              </span>
              {pagination.totalPages > 1 && (
                <span className="pagination">
                  Page {pagination.page} of {pagination.totalPages}
                </span>
              )}
            </div>

            {loading && courses.length === 0 && (
              <div className="courses-grid">{loadingSkeletons}</div>
            )}

            {!loading && courses.length === 0 && !error && (
              <div className="no-courses">
                <h4>No courses found</h4>
                <p>Try adjusting your filters or search terms</p>
              </div>
            )}

            {courses.length > 0 && (
              <>
                <div className="courses-grid">{courseCards}</div>
                {pagination.page < pagination.totalPages && (
                  <div className="load-more-wrapper">
                    <button
                      className="load-more-btn"
                      onClick={handleLoadMore}
                      disabled={loading}
                    >
                      {loading ? 'Loading...' : 'Load More Courses'}
                    </button>
                  </div>
                )}
              </>
            )}
          </section>
        </div>
      </div>
    </>
  );
}

export default Browse;
