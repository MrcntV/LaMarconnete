import React from 'react';

interface StatCardProps {
  icon: React.ReactNode;
  title: string;
  value: string | number;
  trend?: number;
  color?: string;
}

const StatCard: React.FC<StatCardProps> = ({ icon, title, value, trend, color }) => {
  return (
    <div className="stat-card" style={color ? { borderLeftColor: color } : undefined}>
      <div className="stat-card-icon" style={color ? { background: color + '20', color } : undefined}>
        {icon}
      </div>
      <div className="stat-card-content">
        <p className="stat-card-title">{title}</p>
        <p className="stat-card-value">{value}</p>
        {trend !== undefined && (
          <p className={`stat-card-trend ${trend >= 0 ? 'trend-up' : 'trend-down'}`}>
            {trend >= 0 ? '▲' : '▼'} {Math.abs(trend)}% ce mois
          </p>
        )}
      </div>
    </div>
  );
};

export default StatCard;
