import * as Icons from 'lucide-react';

export default function StatCard({ title, value, icon, percentage, trend = "up" }) {
  const Icon = Icons[icon] || Icons.Activity;
  
  return (
    <div className="bg-bg-card rounded-xl p-6 border border-borderColor shadow-sm min-w-[200px]">
      <div className="flex justify-between items-center mb-4">
        <span className="text-text-secondary text-sm font-medium">{title}</span>
        <div className="bg-primary-light text-primary p-2 rounded-lg flex items-center justify-center">
          <Icon size={20} />
        </div>
      </div>
      <div className="flex items-end gap-4">
        <h3 className="text-3xl font-bold text-text-primary leading-none">{value}</h3>
        {percentage && (
          <span className={`text-sm font-semibold px-2 py-0.5 rounded ${
            trend === 'up' 
              ? 'text-success bg-green-50' 
              : 'text-danger bg-red-50'
          }`}>
            {trend === 'up' ? '+' : ''}{percentage}%
          </span>
        )}
      </div>
    </div>
  );
}
