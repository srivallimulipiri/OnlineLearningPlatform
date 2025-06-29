import { useParams } from 'react-router-dom';
import { useState } from 'react';
import { FaStar, FaUserGraduate, FaClock, FaBookOpen, FaChalkboardTeacher, FaDollarSign, FaLevelUpAlt } from 'react-icons/fa';
import { formatCurrency } from '../utils/helpers';

function CourseDetail() {
  const { id } = useParams();
  const [activeTab, setActiveTab] = useState('overview');
  
  // Mock course data
  const course = {
    id: id,
    title: "React Fundamentals: Build Modern Web Apps",
    instructor: "John Doe",
    instructorBio: "Experienced React developer with 5+ years in the industry. Has taught over 10,000 students worldwide, focusing on practical, hands-on learning.",
    description: "Master React from the ground up with this comprehensive course covering components, hooks, state management, routing, and API integration. Build real-world projects and become a confident React developer.",
    image: "https://source.unsplash.com/random/800x400?reactjs,coding",
    level: "Beginner",
    price: 49.99,
    rating: 4.7,
    students: 1200,
    duration: "8 hours",
    lessons: 24,
    category: "Web Development",
    whatYouWillLearn: [
      "Build modern React applications from scratch",
      "Understand component lifecycle and hooks (useState, useEffect, useContext)",
      "Manage application state effectively with Redux/Context API",
      "Implement client-side routing with React Router",
      "Integrate with RESTful APIs and handle data fetching",
      "Write clean, maintainable, and performant React code"
    ],
    requirements: [
      "Basic understanding of HTML, CSS, and JavaScript",
      "A computer with internet access",
      "No prior React experience needed"
    ],
    curriculum: [
      { title: "Module 1: Introduction to React", duration: "30 min", lessons: 3 },
      { title: "Module 2: Components and JSX", duration: "45 min", lessons: 4 },
      { title: "Module 3: State, Props, and Events", duration: "60 min", lessons: 5 },
      { title: "Module 4: React Hooks (useState, useEffect)", duration: "90 min", lessons: 6 },
      { title: "Module 5: Advanced Hooks and Context API", duration: "75 min", lessons: 5 },
      { title: "Module 6: React Router for Navigation", duration: "60 min", lessons: 4 },
      { title: "Module 7: Working with APIs", duration: "90 min", lessons: 6 },
      { title: "Module 8: Project - E-commerce Frontend", duration: "120 min", lessons: 8 }
    ]
  };

  const levelColorClass = (level) => {
    switch (level) {
      case 'Beginner':
        return 'bg-green-100 text-green-800';
      case 'Intermediate':
        return 'bg-accent-light text-accent-dark';
      case 'Advanced':
        return 'bg-red-100 text-red-800';
      default:
        return 'bg-neutral-200 text-neutral-800';
    }
  };

  return (
    <div className="p-8">
      <div className="max-w-7xl mx-auto bg-white rounded-xl shadow-lifted overflow-hidden">
        <div className="relative h-96">
          <img 
            src={course.image} 
            alt={course.title}
            className="w-full h-full object-cover"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent"></div>
          <div className="absolute bottom-0 left-0 p-8 text-white">
            <span className="bg-primary-dark text-white text-sm font-semibold px-4 py-2 rounded-full shadow-md mb-2 inline-block">
              {course.category}
            </span>
            <h1 className="text-5xl font-bold leading-tight mb-2">{course.title}</h1>
            <p className="text-xl font-medium text-primary-light">by {course.instructor}</p>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 p-8">
          <div className="lg:col-span-2">
            <div className="border-b border-neutral-200 mb-6">
              <nav className="flex space-x-8" aria-label="Tabs">
                <button
                  onClick={() => setActiveTab('overview')}
                  className={`py-3 px-4 text-lg font-medium transition-colors duration-200
                    ${activeTab === 'overview'
                      ? 'border-b-2 border-primary-dark text-primary-dark'
                      : 'text-neutral-600 hover:text-neutral-800'
                    }`}
                >
                  Overview
                </button>
                <button
                  onClick={() => setActiveTab('curriculum')}
                  className={`py-3 px-4 text-lg font-medium transition-colors duration-200
                    ${activeTab === 'curriculum'
                      ? 'border-b-2 border-primary-dark text-primary-dark'
                      : 'text-neutral-600 hover:text-neutral-800'
                    }`}
                >
                  Curriculum
                </button>
                <button
                  onClick={() => setActiveTab('instructor')}
                  className={`py-3 px-4 text-lg font-medium transition-colors duration-200
                    ${activeTab === 'instructor'
                      ? 'border-b-2 border-primary-dark text-primary-dark'
                      : 'text-neutral-600 hover:text-neutral-800'
                    }`}
                >
                  Instructor
                </button>
              </nav>
            </div>

            <div>
              {activeTab === 'overview' && (
                <div className="space-y-6">
                  <h3 className="text-2xl font-semibold text-neutral-800">About This Course</h3>
                  <p className="text-neutral-700 leading-relaxed">{course.description}</p>
                  
                  <h4 className="text-xl font-semibold text-neutral-800">What You'll Learn</h4>
                  <ul className="list-disc list-inside text-neutral-700 space-y-2">
                    {course.whatYouWillLearn.map((item, index) => (
                      <li key={index}>{item}</li>
                    ))}
                  </ul>

                  <h4 className="text-xl font-semibold text-neutral-800">Requirements</h4>
                  <ul className="list-disc list-inside text-neutral-700 space-y-2">
                    {course.requirements.map((item, index) => (
                      <li key={index}>{item}</li>
                    ))}
                  </ul>
                </div>
              )}
              
              {activeTab === 'curriculum' && (
                <div className="space-y-4">
                  <h3 className="text-2xl font-semibold text-neutral-800">Course Content</h3>
                  {course.curriculum.map((module, index) => (
                    <div key={index} className="bg-neutral-50 p-4 rounded-lg shadow-sm border border-neutral-200">
                      <div className="flex justify-between items-center font-medium text-neutral-800">
                        <span>{module.title} ({module.lessons} lessons)</span>
                        <span className="text-neutral-600 text-sm">{module.duration}</span>
                      </div>
                    </div>
                  ))}
                </div>
              )}
              
              {activeTab === 'instructor' && (
                <div className="space-y-4">
                  <h3 className="text-2xl font-semibold text-neutral-800">About {course.instructor}</h3>
                  <p className="text-neutral-700 leading-relaxed">{course.instructorBio}</p>
                </div>
              )}
            </div>
          </div>
          
          <div className="lg:col-span-1">
            <div className="sticky top-8 bg-neutral-50 p-6 rounded-xl shadow-soft border border-neutral-200">
              <div className="text-4xl font-bold text-primary-dark mb-4">
                {course.price === 0 ? 'Free' : formatCurrency(course.price)}
              </div>
              
              <button className="w-full bg-primary-dark text-white py-3 rounded-lg font-semibold hover:bg-primary transition-colors duration-200 shadow-md mb-4">
                Enroll Now
              </button>
              
              <div className="space-y-3 text-neutral-700">
                <div className="flex justify-between items-center">
                  <span className="flex items-center gap-2"><FaLevelUpAlt className="text-primary" /> Level:</span>
                  <span className={`font-medium px-3 py-1 rounded-full text-xs ${levelColorClass(course.level)}`}>{course.level}</span>
                </div>
                <div className="flex justify-between items-center">
                  <span className="flex items-center gap-2"><FaClock className="text-primary" /> Duration:</span>
                  <span className="font-medium">{course.duration}</span>
                </div>
                <div className="flex justify-between items-center">
                  <span className="flex items-center gap-2"><FaBookOpen className="text-primary" /> Lessons:</span>
                  <span className="font-medium">{course.lessons}</span>
                </div>
                <div className="flex justify-between items-center">
                  <span className="flex items-center gap-2"><FaUserGraduate className="text-primary" /> Students:</span>
                  <span className="font-medium">{course.students}</span>
                </div>
                <div className="flex justify-between items-center">
                  <span className="flex items-center gap-2"><FaStar className="text-primary" /> Rating:</span>
                  <span className="font-medium">{course.rating}</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default CourseDetail;
