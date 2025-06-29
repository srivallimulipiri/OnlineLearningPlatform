import React from 'react';

function ProgressBar({
  progress = 0,
  variant = 'primary',
  size = 'md',
  showLabel = true,
  animated = false,
  striped = false,
  className = ''
}) {
  const getVariantClasses = (variant) => {
    const variants = {
      primary: 'from-primary-500 to-primary-600',
      secondary: 'from-secondary-500 to-secondary-600',
      success: 'from-secondary-500 to-secondary-600',
      warning: 'from-accent-500 to-accent-600',
      danger: 'from-danger-500 to-danger-600',
      info: 'from-blue-500 to-blue-600'
    };
    return variants[variant] || variants.primary;
  };

  const getSizeClasses = (size) => {
    const sizes = {
      sm: 'h-2',
      md: 'h-3',
      lg: 'h-4',
      xl: 'h-6'
    };
    return sizes[size] || sizes.md;
  };

  const getTextColor = (variant) => {
    const colors = {
      primary: 'text-primary-600',
      secondary: 'text-secondary-600',
      success: 'text-secondary-600',
      warning: 'text-accent-600',
      danger: 'text-danger-600',
      info: 'text-blue-600'
    };
    return colors[variant] || colors.primary;
  };

  const progressValue = Math.min(Math.max(progress, 0), 100);

  return (
    <div className={`w-full ${className}`}>
      {showLabel && (
        <div className="flex justify-between items-center mb-2">
          <span className="text-sm font-medium text-neutral-700">Progress</span>
          <span className={`text-sm font-bold ${getTextColor(variant)}`}>
            {Math.round(progressValue)}%
          </span>
        </div>
      )}

      <div className={`w-full bg-neutral-200 rounded-full overflow-hidden ${getSizeClasses(size)}`}>
        <div
          className={`h-full bg-gradient-to-r ${getVariantClasses(variant)} rounded-full transition-all duration-700 ease-out relative ${
            animated ? 'animate-pulse' : ''
          }`}
          style={{ width: `${progressValue}%` }}
        >
          {striped && (
            <div
              className="absolute inset-0 bg-gradient-to-r from-transparent via-white via-transparent opacity-20"
              style={{
                backgroundImage: 'repeating-linear-gradient(45deg, transparent, transparent 10px, rgba(255,255,255,0.1) 10px, rgba(255,255,255,0.1) 20px)',
                animation: 'progress-stripes 1s linear infinite'
              }}
            />
          )}
        </div>
      </div>
    </div>
  );
}

export default ProgressBar;
