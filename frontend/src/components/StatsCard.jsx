import React from 'react';

function StatsCard({ title, value, icon, color = 'primary', subtitle, trend, className = '' }) {
  const getColorClasses = (color) => {
    const colorMap = {
      primary: {
        bg: 'from-primary-500 to-primary-600',
        text: 'text-primary-600',
        lightBg: 'bg-primary-50',
        border: 'border-primary-200'
      },
      secondary: {
        bg: 'from-secondary-500 to-secondary-600',
        text: 'text-secondary-600',
        lightBg: 'bg-secondary-50',
        border: 'border-secondary-200'
      },
      success: {
        bg: 'from-secondary-500 to-secondary-600',
        text: 'text-secondary-600',
        lightBg: 'bg-secondary-50',
        border: 'border-secondary-200'
      },
      warning: {
        bg: 'from-accent-500 to-accent-600',
        text: 'text-accent-600',
        lightBg: 'bg-accent-50',
        border: 'border-accent-200'
      },
      danger: {
        bg: 'from-danger-500 to-danger-600',
        text: 'text-danger-600',
        lightBg: 'bg-danger-50',
        border: 'border-danger-200'
      },
      info: {
        bg: 'from-blue-500 to-blue-600',
        text: 'text-blue-600',
        lightBg: 'bg-blue-50',
        border: 'border-blue-200'
      }
    };
    return colorMap[color] || colorMap.primary;
  };

  const colors = getColorClasses(color);

  const getTrendIcon = (type) => {
    return type === 'up' ? '↗' : type === 'down' ? '↘' : '→';
  };

  const getTrendColor = (type) => {
    return type === 'up' ? 'text-secondary-600' : type === 'down' ? 'text-danger-600' : 'text-neutral-600';
  };

  return (
    <div className={`stats-card group ${className}`}>
      <div className="flex items-start justify-between">
        <div className="flex-1">
          {/* Value */}
          <div className={`text-3xl font-bold mb-1 ${colors.text} transition-all duration-300 group-hover:scale-105`}>
            {value}
          </div>
          
          {/* Title */}
          <h3 className="text-lg font-semibold text-neutral-700 mb-1">{title}</h3>
          
          {/* Subtitle */}
          {subtitle && (
            <p className="text-sm text-neutral-500">{subtitle}</p>
          )}
          
          {/* Trend */}
          {trend && (
            <div className="flex items-center mt-3">
              <span className={`text-sm font-medium flex items-center ${getTrendColor(trend.type)}`}>
                <span className="mr-1 text-lg">{getTrendIcon(trend.type)}</span>
                {trend.value}
              </span>
              <span className="text-xs text-neutral-500 ml-2">vs last period</span>
            </div>
          )}
        </div>

        {/* Icon */}
        <div className={`w-16 h-16 rounded-2xl bg-gradient-to-br ${colors.bg} flex items-center justify-center text-white text-2xl shadow-lg transform transition-all duration-300 group-hover:scale-110 group-hover:rotate-3`}>
          {icon}
        </div>
      </div>

      {/* Background Decoration */}
      <div className={`absolute top-0 right-0 w-32 h-32 ${colors.lightBg} rounded-full -translate-y-16 translate-x-16 opacity-20 transition-all duration-300 group-hover:opacity-30`}></div>
    </div>
  );
}

export default StatsCard;
