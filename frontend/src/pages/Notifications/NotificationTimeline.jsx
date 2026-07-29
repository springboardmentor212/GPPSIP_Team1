import React from 'react';
import TimelineSection from './TimelineSection';
import NotificationCard from '../../components/cards/NotificationCard';

const NotificationTimeline = ({ groupedNotifications = {}, onAction }) => {
  const sections = Object.keys(groupedNotifications);

  return (
    <div className="w-full relative">
      {/* Global vertical connecting line wrapper */}
      <div className="absolute left-4 top-8 bottom-8 w-0.5 bg-slate-200 pointer-events-none"></div>

      <div className="space-y-2 relative z-10">
        {sections.map((sectionName) => {
          const list = groupedNotifications[sectionName];
          if (!list || list.length === 0) return null;

          return (
            <TimelineSection key={sectionName} title={sectionName}>
              {list.map((item) => (
                <NotificationCard
                  key={item.id}
                  type={item.type}
                  title={item.title}
                  description={item.description}
                  timestamp={item.timestamp}
                  category={item.category}
                  actionText={item.actionText}
                  readStatus={item.readStatus}
                  onAction={() => onAction(item)}
                />
              ))}
            </TimelineSection>
          );
        })}

        {sections.length === 0 && (
          <div className="text-center py-12 border border-dashed border-slate-350 bg-white rounded-2xl">
            <p className="text-sm font-bold text-slate-400">No notifications available.</p>
          </div>
        )}
      </div>
    </div>
  );
};

export default NotificationTimeline;
