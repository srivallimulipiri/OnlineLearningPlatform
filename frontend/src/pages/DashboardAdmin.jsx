import React from 'react';
import StatsCard from '../components/StatsCard';
import {
  FaUsers,
  FaBook,
  FaDollarSign,
  FaHourglassHalf,
  FaEdit,
  FaCheckCircle,
} from 'react-icons/fa';

function DashboardAdmin() {
  const users = [
    { id: 1, name: "John Doe", email: "john@example.com", role: "Teacher", status: "Active" },
    { id: 2, name: "Jane Smith", email: "jane@example.com", role: "Student", status: "Active" },
    { id: 3, name: "Bob Wilson", email: "bob@example.com", role: "Student", status: "Inactive" }
  ];

  const courses = [
    { id: 1, title: "React Fundamentals", instructor: "John Doe", students: 1200, status: "Published" },
    { id: 2, title: "Vue.js Basics", instructor: "Jane Smith", students: 0, status: "Pending" }
  ];

  return (
    <div className="p-8">
      <h1 className="text-3xl font-bold text-neutral-800 mb-8">Admin Dashboard</h1>
      
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
        <StatsCard 
          title="Total Users" 
          value="156"
          icon={<FaUsers className="text-white" />}
          color="primary"
        />
        <StatsCard 
          title="Total Courses" 
          value="42"
          icon={<FaBook className="text-white" />}
          color="success"
        />
        <StatsCard 
          title="Total Revenue" 
          value="$45,230"
          icon={<FaDollarSign className="text-white" />}
          color="info"
        />
        <StatsCard 
          title="Pending Approvals" 
          value="8"
          icon={<FaHourglassHalf className="text-white" />}
          color="warning"
        />
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <div className="bg-white rounded-xl shadow-soft p-6">
          <h2 className="text-2xl font-semibold text-neutral-800 mb-6">Recent Users</h2>
          <div className="overflow-x-auto">
            <table className="min-w-full leading-normal">
              <thead>
                <tr>
                  <th className="px-5 py-3 border-b-2 border-neutral-200 bg-neutral-100 text-left text-xs font-semibold text-neutral-600 uppercase tracking-wider">
                    Name
                  </th>
                  <th className="px-5 py-3 border-b-2 border-neutral-200 bg-neutral-100 text-left text-xs font-semibold text-neutral-600 uppercase tracking-wider">
                    Role
                  </th>
                  <th className="px-5 py-3 border-b-2 border-neutral-200 bg-neutral-100 text-left text-xs font-semibold text-neutral-600 uppercase tracking-wider">
                    Status
                  </th>
                  <th className="px-5 py-3 border-b-2 border-neutral-200 bg-neutral-100 text-left text-xs font-semibold text-neutral-600 uppercase tracking-wider">
                    Actions
                  </th>
                </tr>
              </thead>
              <tbody>
                {users.map(user => (
                  <tr key={user.id} className="hover:bg-neutral-50">
                    <td className="px-5 py-5 border-b border-neutral-200 bg-white text-sm">
                      <p className="text-neutral-900 whitespace-no-wrap">{user.name}</p>
                    </td>
                    <td className="px-5 py-5 border-b border-neutral-200 bg-white text-sm">
                      <span
                        className={`relative inline-block px-3 py-1 font-semibold leading-tight ${user.role === 'Teacher' ? 'text-primary-dark' : 'text-neutral-700'}`}
                      >
                        <span
                          aria-hidden
                          className={`absolute inset-0 opacity-50 rounded-full ${user.role === 'Teacher' ? 'bg-primary-light' : 'bg-neutral-200'}`}
                        ></span>
                        <span className="relative">{user.role}</span>
                      </span>
                    </td>
                    <td className="px-5 py-5 border-b border-neutral-200 bg-white text-sm">
                      <span
                        className={`relative inline-block px-3 py-1 font-semibold leading-tight ${user.status === 'Active' ? 'text-green-900' : 'text-red-900'}`}
                      >
                        <span
                          aria-hidden
                          className={`absolute inset-0 opacity-50 rounded-full ${user.status === 'Active' ? 'bg-green-200' : 'bg-red-200'}`}
                        ></span>
                        <span className="relative">{user.status}</span>
                      </span>
                    </td>
                    <td className="px-5 py-5 border-b border-neutral-200 bg-white text-sm">
                      <button className="text-primary-dark hover:text-primary">
                        <FaEdit /> Edit
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
        
        <div className="bg-white rounded-xl shadow-soft p-6">
          <h2 className="text-2xl font-semibold text-neutral-800 mb-6">Course Management</h2>
          <div className="overflow-x-auto">
            <table className="min-w-full leading-normal">
              <thead>
                <tr>
                  <th className="px-5 py-3 border-b-2 border-neutral-200 bg-neutral-100 text-left text-xs font-semibold text-neutral-600 uppercase tracking-wider">
                    Course
                  </th>
                  <th className="px-5 py-3 border-b-2 border-neutral-200 bg-neutral-100 text-left text-xs font-semibold text-neutral-600 uppercase tracking-wider">
                    Students
                  </th>
                  <th className="px-5 py-3 border-b-2 border-neutral-200 bg-neutral-100 text-left text-xs font-semibold text-neutral-600 uppercase tracking-wider">
                    Status
                  </th>
                  <th className="px-5 py-3 border-b-2 border-neutral-200 bg-neutral-100 text-left text-xs font-semibold text-neutral-600 uppercase tracking-wider">
                    Actions
                  </th>
                </tr>
              </thead>
              <tbody>
                {courses.map(course => (
                  <tr key={course.id} className="hover:bg-neutral-50">
                    <td className="px-5 py-5 border-b border-neutral-200 bg-white text-sm">
                      <p className="text-neutral-900 whitespace-no-wrap">{course.title}</p>
                    </td>
                    <td className="px-5 py-5 border-b border-neutral-200 bg-white text-sm">
                      <p className="text-neutral-900 whitespace-no-wrap">{course.students}</p>
                    </td>
                    <td className="px-5 py-5 border-b border-neutral-200 bg-white text-sm">
                      <span
                        className={`relative inline-block px-3 py-1 font-semibold leading-tight ${course.status === 'Published' ? 'text-green-900' : 'text-accent-dark'}`}
                      >
                        <span
                          aria-hidden
                          className={`absolute inset-0 opacity-50 rounded-full ${course.status === 'Published' ? 'bg-green-200' : 'bg-accent-light'}`}
                        ></span>
                        <span className="relative">{course.status}</span>
                      </span>
                    </td>
                    <td className="px-5 py-5 border-b border-neutral-200 bg-white text-sm">
                      <button className="text-green-600 hover:text-green-800">
                        <FaCheckCircle /> Approve
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </div>
  );
}

export default DashboardAdmin;
