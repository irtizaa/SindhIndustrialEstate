import React from 'react';

export default function StatCard({ title, value, detail, size = 'small', status }) {
  // Determine CSS classes based on props
  const valueClass = size === 'large' ? 'large-value' : 'card-value';
  const detailClass = status === 'success' ? 'card-detail success' : 'card-detail';
  const containerClass = `dark-dashboard-card ${size === 'large' ? 'main-stat-card' : 'small-stat-card'}`;

  return (
    <div className={containerClass}>
      <h3 className="card-title">{title}</h3>
      <div className={valueClass}>{value}</div>
      {detail && <p className={detailClass}>{detail}</p>}
    </div>
  );
}