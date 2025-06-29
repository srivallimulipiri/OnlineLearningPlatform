// Safe localStorage operations with error handling
export const storage = {
  get: (key, defaultValue = null) => {
    try {
      const item = localStorage.getItem(key);
      return item ? JSON.parse(item) : defaultValue;
    } catch (error) {
      console.error(`Error reading from localStorage key "${key}":`, error);
      return defaultValue;
    }
  },

  set: (key, value) => {
    try {
      const itemToStore = value === undefined ? null : value;
      localStorage.setItem(key, JSON.stringify(itemToStore));
      return true;
    } catch (error) {
      console.error(`Error writing to localStorage key "${key}":`, error);
      return false;
    }
  },

  remove: (key) => {
    try {
      localStorage.removeItem(key);
      return true;
    } catch (error) {
      console.error(`Error removing localStorage key "${key}":`, error);
      return false;
    }
  },

  clear: () => {
    try {
      localStorage.clear();
      return true;
    } catch (error) {
      console.error('Error clearing localStorage:', error);
      return false;
    }
  },

  // Check if localStorage is available
  isAvailable: () => {
    try {
      const test = '__localStorage_test__';
      localStorage.setItem(test, test);
      localStorage.removeItem(test);
      return true;
    } catch (error) {
      return false;
    }
  }
};

// Token storage utilities
export const tokenStorage = {
  getAccessToken: () => localStorage.getItem('accessToken'),
  setAccessToken: (token) => localStorage.setItem('accessToken', token),
  removeAccessToken: () => localStorage.removeItem('accessToken'),
  
  getRefreshToken: () => localStorage.getItem('refreshToken'),
  setRefreshToken: (token) => localStorage.setItem('refreshToken', token),
  removeRefreshToken: () => localStorage.removeItem('refreshToken'),
};

// User storage utilities
export const userStorage = {
  getUser: () => {
    try {
      const user = localStorage.getItem('user');
      return user ? JSON.parse(user) : null;
    } catch (error) {
      console.error('Error parsing user data:', error);
      return null;
    }
  },
  
  setUser: (user) => {
    try {
      localStorage.setItem('user', JSON.stringify(user));
    } catch (error) {
      console.error('Error storing user data:', error);
    }
  },
  
  removeUser: () => localStorage.removeItem('user'),
};

export const courseStorage = {
  getCachedCourses: () => storage.get('cachedCourses', []),
  setCachedCourses: (courses) => storage.set('cachedCourses', courses),
  getLastFetch: () => storage.get('coursesLastFetch'),
  setLastFetch: (timestamp) => storage.set('coursesLastFetch', timestamp),
  clearCache: () => {
    storage.remove('cachedCourses');
    storage.remove('coursesLastFetch');
  }
};

export const settingsStorage = {
  getSettings: () => storage.get('appSettings', {
    theme: 'light',
    notifications: true,
    autoSave: true
  }),
  setSettings: (settings) => storage.set('appSettings', settings),
  updateSetting: (key, value) => {
    const settings = settingsStorage.getSettings();
    settings[key] = value;
    settingsStorage.setSettings(settings);
  }
};