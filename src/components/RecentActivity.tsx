
import React from "react";
import { RefreshCw, AlertCircle, Check, Clock } from "lucide-react";

interface ActivityItem {
  id: string;
  type: "sync" | "error" | "update" | "info";
  message: string;
  timestamp: string;
}

interface RecentActivityProps {
  activities: ActivityItem[];
}

const RecentActivity: React.FC<RecentActivityProps> = ({ activities }) => {
  const getIcon = (type: ActivityItem["type"]) => {
    switch (type) {
      case "sync":
        return <RefreshCw size={16} className="text-electric" />;
      case "error":
        return <AlertCircle size={16} className="text-red-400" />;
      case "update":
        return <Check size={16} className="text-green-400" />;
      case "info":
        return <Clock size={16} className="text-muted-foreground" />;
    }
  };

  return (
    <div className="rounded-xl p-6 card-gradient border border-dark-border">
      <h3 className="font-semibold mb-4">Actividad Reciente</h3>
      <div className="space-y-4">
        {activities.map((activity) => (
          <div key={activity.id} className="flex items-start gap-3 text-sm">
            <div className="mt-0.5">{getIcon(activity.type)}</div>
            <div className="flex-1">
              <p className="text-sm">{activity.message}</p>
              <p className="text-xs text-muted-foreground">{activity.timestamp}</p>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default RecentActivity;
