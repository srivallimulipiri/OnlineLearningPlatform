import React from 'react';

const LoadingSkeleton = ({ type = 'default' }) => {
  if (type === 'dashboard') {
    return (
      <div className="min-h-screen bg-neutral-100 animate-pulse p-8">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
          {[1, 2, 3].map(i => (
            <div key={i} className="bg-white p-6 rounded-xl shadow-soft">
              <div className="h-6 bg-neutral-200 rounded w-3/4 mb-4"></div>
              <div className="h-10 bg-neutral-200 rounded w-1/2"></div>
            </div>
          ))}
        </div>
        <div className="bg-white rounded-xl shadow-soft p-8">
          <div className="h-8 bg-neutral-200 rounded w-1/4 mb-6"></div>
          <div className="space-y-4">
            {[1, 2, 3, 4, 5].map(i => (
              <div key={i} className="h-5 bg-neutral-200 rounded"></div>
            ))}
          </div>
        </div>
      </div>
    );
  }

  if (type === 'card') {
    return (
      <div className="bg-white rounded-xl shadow-soft overflow-hidden animate-pulse h-full flex flex-col">
        <div className="h-48 bg-neutral-200"></div>
        <div className="p-5 flex flex-col flex-grow">
          <div className="h-6 bg-neutral-200 rounded w-3/4 mb-3"></div>
          <div className="h-4 bg-neutral-200 rounded w-1/2 mb-4"></div>
          <div className="h-4 bg-neutral-200 rounded mb-2"></div>
          <div className="h-4 bg-neutral-200 rounded w-5/6 mb-4"></div>
          <div className="flex justify-between items-center mt-auto pt-4 border-t border-neutral-200">
            <div className="h-6 bg-neutral-200 rounded w-1/4"></div>
            <div className="h-10 bg-neutral-200 rounded w-1/3"></div>
          </div>
        </div>
      </div>
    );
  }

  if (type === 'form') {
    return (
      <div className="bg-white p-8 rounded-xl shadow-soft w-full max-w-md animate-pulse space-y-6">
        <div className="h-8 bg-neutral-200 rounded w-1/2 mx-auto mb-8"></div>
        <div className="space-y-4">
          <div className="h-10 bg-neutral-200 rounded"></div>
          <div className="h-10 bg-neutral-200 rounded"></div>
          <div className="h-10 bg-neutral-200 rounded"></div>
        </div>
        <div className="h-12 bg-neutral-200 rounded-lg"></div>
      </div>
    );
  }

  return (
    <div className="min-h-screen flex items-center justify-center bg-neutral-100">
      <div className="text-center">
        <div className="animate-spin rounded-full h-16 w-16 border-t-4 border-b-4 border-primary-dark mx-auto"></div>
        <p className="mt-6 text-lg text-neutral-600">Loading content...</p>
      </div>
    </div>
  );
};

export default LoadingSkeleton;
