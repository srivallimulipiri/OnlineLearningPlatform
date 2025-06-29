import { useState } from 'react';
import CourseCard from '../components/CourseCard';
import { useAuth } from '../hooks/useAuth';

function MyCourses() {
  const { user } = useAuth();
  const [activeTab, setActiveTab] = useState('in-progress');
  
  // Mock enrolled courses data
  const enrolledCourses = [
    {
      id: 1,
      title: "Complete React Development",
      instructor: "Sarah Johnson",
      image: "https://images.unsplash.com/photo-1633356122544-f134324a6cee?w=400&h=250&fit=crop",
      price: 89,
      level: "Beginner",
      rating: 4.8,
      studentsCount: 12847,
      duration: "40 hours",
      category: "Web Development",
      progress: 75,
      isEnrolled: true
    },
    {
      id: 2,
      title: "Advanced JavaScript Patterns",
      instructor: "David Chen",
      image: "https://images.unsplash.com/photo-1627398242454-45a1465c2479?w=400&h=250&fit=crop",
      price: 129,
      level: "Advanced",
      rating: 4.9,
      studentsCount: 8934,
      duration: "35 hours",
      category: "Web Development",
      progress: 30,
      isEnrolled: true
    }
  ];

  const completedCourses = [
    {
      id: 3,
      title: "Full-Stack Web Development",
      instructor: "Maria Rodriguez",
      image: "https://images.unsplash.com/photo-1498050108023-c5249f4df085?w=400&h=250&fit=crop",
      price: 0,
      level: "Intermediate",
      rating: 4.7,
      studentsCount: 15632,
      duration: "60 hours",
      category: "Web Development",
      progress: 100,
      isEnrolled: true,
      completedAt: "2024-01-15"
    }
  ];

  return (
    <div className="p-8">
      <div className="mb-8">
        <h1 className="text-4xl font-bold text-neutral-800">My Courses</h1>
        <p className="text-lg text-neutral-600">Track your learning progress and continue where you left off</p>
      </div>

      <div className="bg-white rounded-xl shadow-lifted p-8">
        <div className="border-b border-neutral-200 mb-6">
          <nav className="flex space-x-8" aria-label="Tabs">
            <button
              onClick={() => setActiveTab('in-progress')}
              className={`py-3 px-4 text-lg font-medium transition-colors duration-200
                ${activeTab === 'in-progress'
                  ? 'border-b-2 border-primary-dark text-primary-dark'
                  : 'text-neutral-600 hover:text-neutral-800'
                }`}
            >
              In Progress ({enrolledCourses.length})
            </button>
            <button
              onClick={() => setActiveTab('completed')}
              className={`py-3 px-4 text-lg font-medium transition-colors duration-200
                ${activeTab === 'completed'
                  ? 'border-b-2 border-primary-dark text-primary-dark'
                  : 'text-neutral-600 hover:text-neutral-800'
                }`}
            >
              Completed ({completedCourses.length})
            </button>
          </nav>
        </div>

        <div>
          {activeTab === 'in-progress' && (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {enrolledCourses.map(course => (
                <CourseCard 
                  key={course.id}
                  course={course} 
                  showProgress={true}
                />
              ))}
            </div>
          )}

          {activeTab === 'completed' && (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {completedCourses.map(course => (
                <CourseCard 
                  key={course.id}
                  course={course} 
                  showProgress={true}
                />
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

export default MyCourses;
