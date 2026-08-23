import React, { useState } from 'react';
import AnalyticsHeader from './AnalyticsHeader';
import AnalyticsFilterBar from './AnalyticsFilterBar';
import AnalyticsMetricsGrid from './AnalyticsMetricsGrid';
import PerformanceTrendChart from './PerformanceTrendChart';
import CategoryDistributionChart from './CategoryDistributionChart';
import PublishedPoliciesWidget from './PublishedPoliciesWidget';
import CitizenEngagementChart from './CitizenEngagementChart';
import TopPerformingDepartments from './TopPerformingDepartments';
import DepartmentPerformanceIndexTable from './DepartmentPerformanceIndexTable';
import AiPerformanceInsightsWidget from './AiPerformanceInsightsWidget';
import RecentActivityWidget from './RecentActivityWidget';
import QuickActionsWidget from './QuickActionsWidget';
import Footer from '../../components/layout/Footer';
import { FaCheckCircle } from 'react-icons/fa';

const ReportsPage = () => {
    const [department, setDepartment] = useState('all');
    const [status, setStatus] = useState('all');
    const [period, setPeriod] = useState('30d');
    const [category, setCategory] = useState('all');
    const [notificationToast, setNotificationToast] = useState(null);
    const showToast = (msg) => {
        setNotificationToast(msg);
        setTimeout(() => setNotificationToast(null), 3500);
    };

    const handleExport = async (format) => {
        showToast(`Preparing ${format} export...`);
        try {
            const { getDepartmentAnalytics, getKPIs } = await import('../../services/analytics.service');
            const { downloadPDF, downloadExcel } = await import('../../services/export.service');
            
            const res = await getDepartmentAnalytics(period);
            const kpiRes = await getKPIs(period);
            
            if (res.success && Array.isArray(res.departments)) {
                const data = res.departments;
                
                if (format === 'excel') {
                    const excelData = data.map(d => ({
                        'Rank': d.rank,
                        'Department': d.name,
                        'Policies': d.policies,
                        'Schemes': d.schemes,
                        'Approval Rate (%)': d.approval,
                        'Citizen Reach': d.reach,
                        'Avg Processing (Days)': d.avgProcessDays
                    }));
                    downloadExcel('Department Performance', excelData, 'PolicyGPT_Analytics');
                    showToast('Excel download started');
                } else {
                    const headers = ['Rank', 'Department', 'Policies', 'Schemes', 'Approval Rate', 'Reach', 'Avg Days'];
                    const pdfData = data.map(d => [
                        d.rank,
                        d.name,
                        d.policies,
                        d.schemes,
                        `${d.approval}%`,
                        d.reach,
                        d.avgProcessDays
                    ]);
                    downloadPDF('PolicyGPT Analytics Report', headers, pdfData, 'PolicyGPT_Analytics');
                    showToast('PDF download started');
                }
            }
        } catch (err) {
            console.error('Export failed:', err);
            showToast('Export failed. Please try again.');
        }
    };

    return (
        <div className="w-full space-y-6 text-left select-none pb-8 relative">

            {/* Toast Notification */}
            {notificationToast && (
                <div className="fixed top-6 right-6 z-50 bg-slate-900 text-white text-xs font-extrabold px-4 py-3 rounded-xl shadow-xl border border-slate-700 flex items-center gap-2.5 animate-in fade-in slide-in-from-top-4 duration-300">
                    <FaCheckCircle className="w-4 h-4 text-emerald-400 shrink-0" />
                    <span>{notificationToast}</span>
                </div>
            )}

            {/* 1. Header */}
            <AnalyticsHeader
                onExport={() => handleExport('excel')}
                onGenerateReport={() => handleExport('pdf')}
            />

            {/* 2. Filter Bar */}
            <AnalyticsFilterBar
                department={department} onDepartmentChange={setDepartment}
                status={status} onStatusChange={setStatus}
                period={period} onPeriodChange={setPeriod}
                category={category} onCategoryChange={setCategory}
                onCompare={() => showToast('Opening Department Comparison Tool...')}
            />

            {/* 3. Metrics Grid (6 KPI Cards) */}
            <AnalyticsMetricsGrid timeRange={period} />

            {/* 4. Charts Row: Trend + Category Distribution */}
            <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
                <div className="lg:col-span-7">
                    <PerformanceTrendChart timeRange={period} />
                </div>
                <div className="lg:col-span-5">
                    <CategoryDistributionChart timeRange={period} />
                </div>
            </div>

            {/* 5. Published Policies + Citizen Engagement */}
            <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
                <div className="lg:col-span-5">
                    <PublishedPoliciesWidget timeRange={period} />
                </div>
                <div className="lg:col-span-7">
                    <CitizenEngagementChart timeRange={period} />
                </div>
            </div>

            {/* 6. Top Performing Departments */}
            <TopPerformingDepartments timeRange={period} />

            {/* 7. Main 2-Column Layout: Table + Right Sidebar */}
            <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">

                {/* LEFT: Performance Index Table (8 Cols) */}
                <div className="lg:col-span-8">
                    <DepartmentPerformanceIndexTable
                        timeRange={period}
                        onViewAll={() => showToast('Loading all 24 department records...')}
                    />
                </div>

                {/* RIGHT: AI Insights + Recent Activity + Quick Actions (4 Cols) */}
                <div className="lg:col-span-4 space-y-5">
                    <AiPerformanceInsightsWidget />
                    <RecentActivityWidget />
                    <QuickActionsWidget
                        onAction={(type) => {
                            if (type === 'fullReport') showToast('Generating full department report...');
                            else if (type === 'compare') showToast('Opening Department Comparison Tool...');
                            else if (type === 'archive') showToast('Opening Policy Archive...');
                        }}
                    />
                </div>

            </div>

            {/* Footer */}
            <Footer />
        </div>
    );
};

export default ReportsPage;
