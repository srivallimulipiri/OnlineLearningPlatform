import { useState } from 'react';
import { COURSE_CATEGORIES, COURSE_LEVELS } from '../utils/constants';
import { FaSearch, FaTimes } from 'react-icons/fa';
import './CourseFilter.css';

function CourseFilter({ onFilterChange, initialFilters = {} }) {
  const [filters, setFilters] = useState({
    search: '',
    category: '',
    level: '',
    priceRange: '',
    rating: '',
    sortBy: 'newest',
    ...initialFilters
  });

  const handleFilterChange = (key, value) => {
    const newFilters = { ...filters, [key]: value };
    setFilters(newFilters);
    onFilterChange(newFilters);
  };

  const clearFilters = () => {
    const clearedFilters = {
      search: '',
      category: '',
      level: '',
      priceRange: '',
      rating: '',
      sortBy: 'newest'
    };
    setFilters(clearedFilters);
    onFilterChange(clearedFilters);
  };

  const hasActiveFilters = Object.values(filters).some(value => 
    value && value !== 'newest' && value !== ''
  );

  return (
    <div className="course-filter-container">
      <div className="filter-header">
        <h5 className="filter-title">Filter Courses</h5>
        {hasActiveFilters && (
          <button
            onClick={clearFilters}
            className="clear-filters-btn"
          >
            Clear All
          </button>
        )}
      </div>

      <form className="filter-form">
        {/* Search */}
        <div className="filter-group">
          <label htmlFor="search" className="filter-label">Search</label>
          <div className="search-input-wrapper">
            <input
              type="text"
              id="search"
              placeholder="Search courses..."
              value={filters.search}
              onChange={(e) => handleFilterChange('search', e.target.value)}
              className="filter-input search-input"
            />
            <FaSearch className="search-icon" />
          </div>
        </div>

        {/* Category */}
        <div className="filter-group">
          <label htmlFor="category" className="filter-label">Category</label>
          <select
            id="category"
            value={filters.category}
            onChange={(e) => handleFilterChange('category', e.target.value)}
            className="filter-select"
          >
            <option value="">All Categories</option>
            {COURSE_CATEGORIES.map(category => (
              <option key={category} value={category}>{category}</option>
            ))}
          </select>
        </div>

        {/* Level */}
        <div className="filter-group">
          <label htmlFor="level" className="filter-label">Level</label>
          <select
            id="level"
            value={filters.level}
            onChange={(e) => handleFilterChange('level', e.target.value)}
            className="filter-select"
          >
            <option value="">All Levels</option>
            {Object.values(COURSE_LEVELS).map(level => (
              <option key={level} value={level}>{level}</option>
            ))}
          </select>
        </div>

        {/* Price Range */}
        <div className="filter-group">
          <label htmlFor="priceRange" className="filter-label">Price</label>
          <select
            id="priceRange"
            value={filters.priceRange}
            onChange={(e) => handleFilterChange('priceRange', e.target.value)}
            className="filter-select"
          >
            <option value="">Any Price</option>
            <option value="free">Free</option>
            <option value="0-50">$0 - $50</option>
            <option value="50-100">$50 - $100</option>
            <option value="100+">$100+</option>
          </select>
        </div>

        {/* Rating */}
        <div className="filter-group">
          <label htmlFor="rating" className="filter-label">Rating</label>
          <select
            id="rating"
            value={filters.rating}
            onChange={(e) => handleFilterChange('rating', e.target.value)}
            className="filter-select"
          >
            <option value="">Any Rating</option>
            <option value="4.5">4.5+ Stars</option>
            <option value="4.0">4.0+ Stars</option>
            <option value="3.5">3.5+ Stars</option>
            <option value="3.0">3.0+ Stars</option>
          </select>
        </div>

        {/* Sort By */}
        <div className="filter-group">
          <label htmlFor="sortBy" className="filter-label">Sort By</label>
          <select
            id="sortBy"
            value={filters.sortBy}
            onChange={(e) => handleFilterChange('sortBy', e.target.value)}
            className="filter-select"
          >
            <option value="newest">Newest</option>
            <option value="oldest">Oldest</option>
            <option value="popular">Most Popular</option>
            <option value="rating">Highest Rated</option>
            <option value="price-low">Price: Low to High</option>
            <option value="price-high">Price: High to Low</option>
          </select>
        </div>
      </form>

      {/* Active Filters Display */}
      {hasActiveFilters && (
        <div className="active-filters">
          {filters.search && (
            <span className="active-filter-tag">
              Search: "{filters.search}"
              <button 
                className="remove-filter-btn"
                onClick={() => handleFilterChange('search', '')}
              >
                <FaTimes />
              </button>
            </span>
          )}
          {filters.category && (
            <span className="active-filter-tag">
              Category: {filters.category}
              <button 
                className="remove-filter-btn"
                onClick={() => handleFilterChange('category', '')}
              >
                <FaTimes />
              </button>
            </span>
          )}
          {filters.level && (
            <span className="active-filter-tag">
              Level: {filters.level}
              <button 
                className="remove-filter-btn"
                onClick={() => handleFilterChange('level', '')}
              >
                <FaTimes />
              </button>
            </span>
          )}
          {filters.priceRange && (
            <span className="active-filter-tag">
              Price: {filters.priceRange === 'free' ? 'Free' : `${filters.priceRange}`}
              <button 
                className="remove-filter-btn"
                onClick={() => handleFilterChange('priceRange', '')}
              >
                <FaTimes />
              </button>
            </span>
          )}
          {filters.rating && (
            <span className="active-filter-tag">
              Rating: {filters.rating}+ Stars
              <button 
                className="remove-filter-btn"
                onClick={() => handleFilterChange('rating', '')}
              >
                <FaTimes />
              </button>
            </span>
          )}
        </div>
      )}
    </div>
  );
}

export default CourseFilter;