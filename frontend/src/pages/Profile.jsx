import { useState } from 'react';
import { useAuth } from '../hooks/useAuth';
import { FaUserCircle, FaLock, FaSave, FaSyncAlt } from 'react-icons/fa';

function Profile() {
  const { user, updateProfile } = useAuth();
  const [formData, setFormData] = useState({
    name: user?.name || '',
    email: user?.email || '',
    bio: user?.bio || '',
    website: user?.website || '',
    location: user?.location || ''
  });
  const [isLoading, setIsLoading] = useState(false);
  const [activeTab, setActiveTab] = useState('general');

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsLoading(true);
    
    // Simulate API call
    setTimeout(() => {
      updateProfile(formData);
      setIsLoading(false);
      console.log('Profile updated successfully!');
    }, 1000);
  };

  return (
    <div className="p-8">
      <div className="max-w-4xl mx-auto">
        <div className="mb-8">
          <h1 className="text-4xl font-bold text-neutral-800">Profile Settings</h1>
          <p className="text-neutral-600">Manage your account information and preferences</p>
        </div>

        <div className="bg-white rounded-xl shadow-lifted p-8">
          <div className="border-b border-neutral-200 mb-6">
            <nav className="flex space-x-8" aria-label="Tabs">
              <button
                onClick={() => setActiveTab('general')}
                className={`py-3 px-4 text-lg font-medium transition-colors duration-200
                  ${activeTab === 'general'
                    ? 'border-b-2 border-primary-dark text-primary-dark'
                    : 'text-neutral-600 hover:text-neutral-800'
                  }`}
              >
                <FaUserCircle className="inline-block mr-2" /> General
              </button>
              <button
                onClick={() => setActiveTab('security')}
                className={`py-3 px-4 text-lg font-medium transition-colors duration-200
                  ${activeTab === 'security'
                    ? 'border-b-2 border-primary-dark text-primary-dark'
                    : 'text-neutral-600 hover:text-neutral-800'
                  }`}
              >
                <FaLock className="inline-block mr-2" /> Security
              </button>
            </nav>
          </div>

          <div>
            {activeTab === 'general' && (
              <form onSubmit={handleSubmit} className="space-y-6">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div>
                    <label htmlFor="name" className="block text-sm font-medium text-neutral-700 mb-1">Full Name</label>
                    <input
                      type="text"
                      id="name"
                      name="name"
                      value={formData.name}
                      onChange={handleChange}
                      className="w-full px-4 py-2 border border-neutral-300 rounded-lg focus:ring-primary focus:border-primary transition duration-200"
                    />
                  </div>
                  <div>
                    <label htmlFor="email" className="block text-sm font-medium text-neutral-700 mb-1">Email Address</label>
                    <input
                      type="email"
                      id="email"
                      name="email"
                      value={formData.email}
                      onChange={handleChange}
                      className="w-full px-4 py-2 border border-neutral-300 rounded-lg bg-neutral-100 cursor-not-allowed"
                      disabled
                    />
                  </div>
                </div>

                <div>
                  <label htmlFor="bio" className="block text-sm font-medium text-neutral-700 mb-1">Bio</label>
                  <textarea
                    id="bio"
                    rows={3}
                    name="bio"
                    value={formData.bio}
                    onChange={handleChange}
                    placeholder="Tell us about yourself..."
                    className="w-full px-4 py-2 border border-neutral-300 rounded-lg focus:ring-primary focus:border-primary transition duration-200"
                  />
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div>
                    <label htmlFor="website" className="block text-sm font-medium text-neutral-700 mb-1">Website</label>
                    <input
                      type="url"
                      id="website"
                      name="website"
                      value={formData.website}
                      onChange={handleChange}
                      placeholder="https://yourwebsite.com"
                      className="w-full px-4 py-2 border border-neutral-300 rounded-lg focus:ring-primary focus:border-primary transition duration-200"
                    />
                  </div>
                  <div>
                    <label htmlFor="location" className="block text-sm font-medium text-neutral-700 mb-1">Location</label>
                    <input
                      type="text"
                      id="location"
                      name="location"
                      value={formData.location}
                      onChange={handleChange}
                      placeholder="City, Country"
                      className="w-full px-4 py-2 border border-neutral-300 rounded-lg focus:ring-primary focus:border-primary transition duration-200"
                    />
                  </div>
                </div>

                <button 
                  type="submit" 
                  className="bg-primary-dark text-white px-6 py-3 rounded-lg font-semibold shadow-md hover:bg-primary transition-colors duration-200 disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
                  disabled={isLoading}
                >
                  {isLoading ? <FaSyncAlt className="animate-spin" /> : <FaSave />}
                  {isLoading ? 'Saving...' : 'Save Changes'}
                </button>
              </form>
            )}

            {activeTab === 'security' && (
              <div className="space-y-6">
                <h5 className="text-xl font-semibold text-neutral-800">Change Password</h5>
                <form className="space-y-4">
                  <div>
                    <label htmlFor="current-password" className="block text-sm font-medium text-neutral-700 mb-1">Current Password</label>
                    <input
                      type="password"
                      id="current-password"
                      className="w-full px-4 py-2 border border-neutral-300 rounded-lg focus:ring-primary focus:border-primary transition duration-200"
                    />
                  </div>
                  <div>
                    <label htmlFor="new-password" className="block text-sm font-medium text-neutral-700 mb-1">New Password</label>
                    <input
                      type="password"
                      id="new-password"
                      className="w-full px-4 py-2 border border-neutral-300 rounded-lg focus:ring-primary focus:border-primary transition duration-200"
                    />
                  </div>
                  <div>
                    <label htmlFor="confirm-password" className="block text-sm font-medium text-neutral-700 mb-1">Confirm New Password</label>
                    <input
                      type="password"
                      id="confirm-password"
                      className="w-full px-4 py-2 border border-neutral-300 rounded-lg focus:ring-primary focus:border-primary transition duration-200"
                    />
                  </div>
                  <button 
                    type="submit" 
                    className="bg-primary-dark text-white px-6 py-3 rounded-lg font-semibold shadow-md hover:bg-primary transition-colors duration-200 disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
                  >
                    <FaSave /> Update Password
                  </button>
                </form>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}

export default Profile;

