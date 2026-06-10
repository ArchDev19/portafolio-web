import React from 'react';

export const DynamicBackground: React.FC<{ variant?: string }> = () => {
  return (
    <>
      <div className="modern-bg-base">
        <div className="modern-bg-gradient modern-bg-gradient-1"></div>
        <div className="modern-bg-gradient modern-bg-gradient-2"></div>
        <div className="modern-bg-gradient modern-bg-gradient-3"></div>
      </div>
      <div className="modern-bg-grid"></div>
      <div className="modern-bg-noise"></div>
    </>
  );
};
