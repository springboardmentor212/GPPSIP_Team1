import React from 'react';
import { FaCog, FaPlus, FaShieldAlt, FaRegClock, FaCalendarAlt } from 'react-icons/fa';

const UpcomingScheduleWidget = ({ onAddSchedule, onManageSchedule }) => {
    const scheduleItems = [
        {
            id: 1,
            day: '15',
            month: 'OCT',
            title: 'Weekly Security Audit',
            meta: 'Frequency: Weekly • 09:00 AM',
            icon: FaShieldAlt,
            iconBg: 'bg-blue-100 text-[#0052cc]'
        },
        {
            id: 2,
            day: '01',
            month: 'NOV',
            title: 'Monthly Scheme Usage',
            meta: 'Frequency: Monthly • 10:00 PM',
            icon: FaRegClock,
            iconBg: 'bg-[#0052cc]/10 text-[#0052cc]'
        },
        {
            id: 3,
            day: '31',
            month: 'DEC',
            title: 'Annual Compliance Review',
            meta: 'Frequency: Yearly • 05:00 PM',
            icon: FaCalendarAlt,
            iconBg: 'bg-indigo-100 text-indigo-700'
        }
    ];

    return (
        <div className="bg-white border border-slate-200 rounded-2xl p-5 shadow-sm select-none text-left space-y-4">
            {/* Widget Header */}
            <div className="flex items-center justify-between">
                <h3 className="text-base font-extrabold text-slate-900 tracking-tight">
                    Upcoming Schedule
                </h3>
                <button
                    onClick={onManageSchedule}
                    className="p-1.5 text-slate-400 hover:text-slate-700 rounded-lg transition-colors cursor-pointer"
                    title="Schedule Settings"
                >
                    <FaCog className="w-3.5 h-3.5" />
                </button>
            </div>

            {/* Schedule Items List */}
            <div className="space-y-3">
                {scheduleItems.map((item) => {
                    const IconComp = item.icon;
                    return (
                        <div
                            key={item.id}
                            className="p-3 bg-slate-50/80 hover:bg-blue-50/40 border border-slate-200/80 rounded-xl flex items-center gap-3 transition-colors group cursor-pointer"
                        >
                            {/* Date Box */}
                            <div className="w-11 h-11 bg-white border border-slate-200 rounded-xl flex flex-col items-center justify-center shrink-0 shadow-2xs">
                                <span className="text-xs font-black text-slate-900 leading-none">{item.day}</span>
                                <span className="text-[9px] font-extrabold text-[#0052cc] uppercase mt-0.5 tracking-wider">{item.month}</span>
                            </div>

                            {/* Title & Metadata */}
                            <div className="flex-grow min-w-0">
                                <div className="text-xs font-extrabold text-slate-900 truncate group-hover:text-[#0052cc] transition-colors">
                                    {item.title}
                                </div>
                                <div className="text-[11px] font-medium text-slate-400 truncate">
                                    {item.meta}
                                </div>
                            </div>

                            {/* Category Icon */}
                            <div className={`w-7 h-7 rounded-lg ${item.iconBg} flex items-center justify-center shrink-0`}>
                                <IconComp className="w-3.5 h-3.5" />
                            </div>
                        </div>
                    );
                })}
            </div>

            {/* Add New Schedule Button */}
            <button
                onClick={onAddSchedule}
                className="w-full py-2.5 bg-white border-2 border-dashed border-blue-200 hover:border-[#0052cc] hover:bg-blue-50/50 text-[#0052cc] rounded-xl text-xs font-extrabold flex items-center justify-center gap-2 transition-all cursor-pointer"
            >
                <FaPlus className="w-3 h-3" />
                <span>+ Add New Schedule</span>
            </button>
        </div>
    );
};

export default UpcomingScheduleWidget;
