import React from 'react';

export default function ChartCard({ title, children, isLarge = false }) {
  const containerClass = `dark-dashboard-card ${isLarge ? 'chart-card-large' : 'chart-card'}`;

  return (
    <div className={containerClass}>
      <h3 className="card-title">{title}</h3>
      <div className="content-placeholder chart-placeholder">
        {children}
      </div>
    </div>
  );
}