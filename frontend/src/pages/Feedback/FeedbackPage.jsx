import React, { useState, useMemo } from 'react';
import FeedbackHeader from './FeedbackHeader';
import FeedbackMetricsGrid from './FeedbackMetricsGrid';
import TicketFilterBar from './TicketFilterBar';
import ActiveTicketsList from './ActiveTicketsList';
import TicketOverviewPanel from './TicketOverviewPanel';
import FaqSection from './FaqSection';
import DirectSupportWidget from './DirectSupportWidget';
import SupportActivityFeed from './SupportActivityFeed';
import CreateTicketModal from './CreateTicketModal';
import Footer from '../../components/layout/Footer';
import { FaCheckCircle, FaTicketAlt, FaClipboard, FaInfoCircle } from 'react-icons/fa';

// -------------------------------------------
// All tickets (visible only to officials)
// -------------------------------------------
const ALL_TICKETS = [
    {
        id: 1,
        ticketId: "#TKT-4082",
        status: "IN PROGRESS",
        timestamp: "24 mins ago",
        title: "DPSF 2024 - Compliance Verification Error",
        fullTitle: "DPSF 2024 - Compliance Verification Error",
        description: "Unable to verify digital residency certificates for financial record mandates...",
        fullDescription: 'The citizen reports that the automated verification system for "Digital Residency" is rejecting valid e-certificates issued after Jan 1st, 2024. This is blocking compliance for financial records under Section 12.A of the DPSF Framework.',
        author: "Johnathan Doe",
        authorId: "usr-001",
        priority: "HIGH",
        priorityLevel: "Critical",
        categoryTag: "IT & COMM",
        assignedDepartment: "Min. of IT & Comm"
    },
    {
        id: 2,
        ticketId: "#TKT-4089",
        status: "OPEN",
        timestamp: "2 hours ago",
        title: "Scholarship Eligibility Clarification",
        fullTitle: "Scholarship Eligibility Criteria Clarification",
        description: "Question regarding the income threshold for the National Merit Scheme 2024...",
        fullDescription: "Applicant seeking clarification on whether gross or taxable income limits apply for the National Merit Higher Education Scholarship Scheme 2024 application phase 2.",
        author: "Amelia K.",
        authorId: "usr-002",
        priority: "NORMAL",
        priorityLevel: "Normal",
        categoryTag: "EDUCATION",
        assignedDepartment: "Ministry of Education"
    },
    {
        id: 3,
        ticketId: "#TKT-4085",
        status: "RESOLVED",
        timestamp: "Yesterday",
        title: "Update on Agriculture Subsidy Portal",
        fullTitle: "Update on Agriculture Subsidy Farmer Portal Login",
        description: "The portal is now accepting the updated farmer ID format after last night's...",
        fullDescription: "Farmer ID format validation issue resolved. Portal API endpoint updated to support 14-digit national agricultural identifiers.",
        author: "Marcus Wright",
        authorId: "usr-003",
        priority: "HIGH",
        priorityLevel: "High",
        categoryTag: "AGRI",
        assignedDepartment: "Department of Agriculture"
    }
];

// -------------------------------------------
// CITIZEN VIEW — Read My Tickets + Submit
// -------------------------------------------
const CitizenFeedbackView = ({ user, onCreateTicket, toast }) => {
    const [myTickets, setMyTickets] = useState([]);
    const [selectedTicket, setSelectedTicket] = useState(null);

    // Helper to get status colour
    const statusBadge = (status) => {
        if (status === 'IN PROGRESS') return 'bg-amber-50 text-amber-700 border-amber-200';
        if (status === 'RESOLVED') return 'bg-emerald-50 text-emerald-700 border-emerald-200';
        return 'bg-blue-50 text-[#0052cc] border-blue-200';
    };

    return (
        <div className="space-y-6">
            {/* My submissions header */}
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 bg-white border border-slate-200 rounded-2xl p-5 shadow-sm">
                <div className="space-y-1">
                    <h2 className="text-base font-extrabold text-slate-900 flex items-center gap-2">
                        <FaTicketAlt className="w-4 h-4 text-[#0052cc]" />
                        My Submitted Feedback
                    </h2>
                    <p className="text-xs text-slate-500 font-medium">
                        View the status of feedback &amp; support requests you have submitted.
                    </p>
                </div>
                <button
                    onClick={onCreateTicket}
                    className="px-4 py-2.5 bg-[#0052cc] hover:bg-[#0041a8] text-white rounded-xl text-xs font-extrabold flex items-center gap-2 shadow-md cursor-pointer shrink-0 transition-all"
                >
                    <span>+ Submit New Feedback</span>
                </button>
            </div>

            {/* If no tickets submitted yet */}
            {myTickets.length === 0 ? (
                <div className="bg-white border border-slate-200 border-dashed rounded-2xl p-12 flex flex-col items-center justify-center text-center space-y-3">
                    <div className="w-12 h-12 rounded-xl bg-blue-50 text-[#0052cc] flex items-center justify-center">
                        <FaClipboard className="w-6 h-6" />
                    </div>
                    <h3 className="text-sm font-extrabold text-slate-800">No feedback submitted yet</h3>
                    <p className="text-xs text-slate-500 font-medium max-w-xs">
                        Use the button above to submit your first feedback or support request. Our team will respond within 24 hours.
                    </p>
                    <button
                        onClick={onCreateTicket}
                        className="mt-2 px-5 py-2 bg-[#0052cc] hover:bg-[#0041a8] text-white rounded-xl text-xs font-extrabold transition-all cursor-pointer shadow-sm"
                    >
                        Submit Your First Feedback
                    </button>
                </div>
            ) : (
                /* Citizen's own tickets */
                <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
                    {/* Left: list */}
                    <div className="lg:col-span-7 space-y-3">
                        {myTickets.map((t) => (
                            <div
                                key={t.id}
                                onClick={() => setSelectedTicket(t)}
                                className={`bg-white border rounded-2xl p-4 shadow-sm cursor-pointer transition-all ${selectedTicket?.id === t.id
                                        ? 'border-[#0052cc] ring-2 ring-blue-500/10'
                                        : 'border-slate-200 hover:border-slate-300'
                                    }`}
                            >
                                <div className="flex items-center justify-between text-xs gap-2">
                                    <div className="flex items-center gap-2">
                                        <span className="font-extrabold text-slate-800">{t.ticketId}</span>
                                        <span className={`px-2 py-0.5 border rounded-md text-[10px] font-black ${statusBadge(t.status)}`}>
                                            {t.status}
                                        </span>
                                    </div>
                                    <span className="text-slate-400 text-[11px]">{t.timestamp}</span>
                                </div>
                                <p className="mt-2 text-sm font-extrabold text-slate-900">{t.title}</p>
                                <p className="mt-0.5 text-xs text-slate-500 font-medium line-clamp-2">{t.description}</p>
                            </div>
                        ))}
                    </div>

                    {/* Right: read-only detail */}
                    {selectedTicket && (
                        <div className="lg:col-span-5 bg-white border border-slate-200 rounded-2xl p-5 shadow-sm space-y-4 text-left">
                            <div className="border-b border-slate-100 pb-3">
                                <span className="text-[11px] font-black text-slate-400 uppercase tracking-wider">Ticket Details</span>
                            </div>
                            <h3 className="text-base font-black text-slate-900">{selectedTicket.fullTitle}</h3>
                            <div className="grid grid-cols-2 gap-3 p-3 bg-slate-50 rounded-xl border border-slate-200 text-xs">
                                <div className="space-y-0.5">
                                    <span className="text-[10px] font-black text-slate-400 uppercase block">Status</span>
                                    <span className={`inline-flex px-2 py-0.5 border rounded-md text-[10px] font-black ${statusBadge(selectedTicket.status)}`}>
                                        {selectedTicket.status}
                                    </span>
                                </div>
                                <div className="space-y-0.5">
                                    <span className="text-[10px] font-black text-slate-400 uppercase block">Assigned To</span>
                                    <span className="font-extrabold text-slate-800">{selectedTicket.assignedDepartment}</span>
                                </div>
                            </div>
                            <p className="text-xs text-slate-600 font-medium leading-relaxed bg-slate-50/50 p-3.5 rounded-xl border border-slate-100">
                                {selectedTicket.fullDescription}
                            </p>
                            {/* Info note — no action buttons */}
                            <div className="flex items-start gap-2.5 p-3 bg-blue-50 border border-blue-200 rounded-xl text-xs text-blue-700 font-medium">
                                <FaInfoCircle className="w-3.5 h-3.5 shrink-0 mt-0.5" />
                                <span>The assigned department will review and respond to your request. You will be notified once the status is updated.</span>
                            </div>
                        </div>
                    )}
                </div>
            )}
        </div>
    );
};

// -------------------------------------------
// OFFICIAL VIEW — Full Ticket Management
// -------------------------------------------
const OfficialFeedbackView = ({ user, onCreateTicket, allTickets, setAllTickets, toast }) => {
    const [selectedTicketId, setSelectedTicketId] = useState(allTickets[0]?.id);
    const [searchQuery, setSearchQuery] = useState('');
    const [categoryFilter, setCategoryFilter] = useState('all');
    const [priorityFilter, setPriorityFilter] = useState('all');
    const [statusFilter, setStatusFilter] = useState('all');

    const filteredTickets = useMemo(() => {
        return allTickets.filter((item) => {
            if (searchQuery.trim()) {
                const q = searchQuery.toLowerCase();
                if (!item.title.toLowerCase().includes(q) && !item.ticketId.toLowerCase().includes(q) && !item.author.toLowerCase().includes(q)) return false;
            }
            if (categoryFilter !== 'all' && !item.categoryTag.toLowerCase().includes(categoryFilter.toLowerCase())) return false;
            if (priorityFilter !== 'all' && item.priority.toLowerCase() !== priorityFilter.toLowerCase()) return false;
            if (statusFilter !== 'all') {
                if (statusFilter === 'in_progress' && item.status !== 'IN PROGRESS') return false;
                if (statusFilter === 'open' && item.status !== 'OPEN') return false;
                if (statusFilter === 'resolved' && item.status !== 'RESOLVED') return false;
            }
            return true;
        });
    }, [allTickets, searchQuery, categoryFilter, priorityFilter, statusFilter]);

    const selectedTicket = useMemo(() => {
        return allTickets.find((t) => t.id === selectedTicketId) || filteredTickets[0] || allTickets[0];
    }, [allTickets, selectedTicketId, filteredTickets]);

    const handleSendResponse = (ticketId) => {
        toast(`Response sent on ticket ${selectedTicket?.ticketId || ticketId}`);
    };

    const handleResolveTicket = (ticketId) => {
        setAllTickets((prev) => prev.map((t) => (t.id === ticketId ? { ...t, status: 'RESOLVED' } : t)));
        toast(`Ticket ${selectedTicket?.ticketId || ticketId} marked as RESOLVED`);
    };

    return (
        <div className="space-y-6">
            {/* Overall metrics (officials see aggregate stats) */}
            <FeedbackMetricsGrid />

            {/* Filter bar */}
            <TicketFilterBar
                searchQuery={searchQuery} onSearchChange={setSearchQuery}
                category={categoryFilter} onCategoryChange={setCategoryFilter}
                priority={priorityFilter} onPriorityChange={setPriorityFilter}
                status={statusFilter} onStatusChange={setStatusFilter}
            />

            {/* 2-col: ticket list + detail panel */}
            <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
                <div className="lg:col-span-7">
                    <ActiveTicketsList
                        tickets={filteredTickets}
                        selectedTicketId={selectedTicket?.id}
                        onSelectTicket={setSelectedTicketId}
                        onLoadMore={() => toast('Loading additional historical tickets...')}
                    />
                </div>
                <div className="lg:col-span-5">
                    <TicketOverviewPanel
                        ticket={selectedTicket}
                        onSendResponse={handleSendResponse}
                        onResolveTicket={handleResolveTicket}
                        userRole={user?.role}
                    />
                </div>
            </div>

            {/* Recent support activity */}
            <SupportActivityFeed />
        </div>
    );
};

// -------------------------------------------
// MAIN FeedbackPage — delegates by role
// -------------------------------------------
const FeedbackPage = ({ user }) => {
    const isCitizen = !user || user.role === 'Citizen';

    const [allTickets, setAllTickets] = useState(ALL_TICKETS);
    const [isCreateModalOpen, setIsCreateModalOpen] = useState(false);
    const [notificationToast, setNotificationToast] = useState(null);

    const showToast = (msg) => {
        setNotificationToast(msg);
        setTimeout(() => setNotificationToast(null), 3500);
    };

    const handleAddTicket = (newTicketData) => {
        const newId = allTickets.length + 1;
        const createdTicket = {
            id: newId,
            ticketId: `#TKT-${4090 + newId}`,
            status: "OPEN",
            timestamp: "Just now",
            title: newTicketData.title,
            fullTitle: newTicketData.title,
            description: newTicketData.description,
            fullDescription: newTicketData.description,
            author: user?.fullName || "Citizen User",
            authorId: user?.id || "usr-citizen",
            priority: newTicketData.priority,
            priorityLevel: newTicketData.priority === 'CRITICAL' ? 'Critical' : newTicketData.priority === 'HIGH' ? 'High' : 'Normal',
            categoryTag: newTicketData.categoryTag,
            assignedDepartment: `Min. of ${newTicketData.categoryTag}`
        };
        setAllTickets((prev) => [createdTicket, ...prev]);
        showToast(`Ticket ${createdTicket.ticketId} submitted successfully!`);
    };

    return (
        <div className="w-full space-y-6 text-left select-none pb-8 relative">

            {/* Toast */}
            {notificationToast && (
                <div className="fixed top-6 right-6 z-50 bg-slate-900 text-white text-xs font-extrabold px-4 py-3 rounded-xl shadow-xl border border-slate-700 flex items-center gap-2.5 animate-in fade-in slide-in-from-top-4 duration-300">
                    <FaCheckCircle className="w-4 h-4 text-emerald-400 shrink-0" />
                    <span>{notificationToast}</span>
                </div>
            )}

            {/* Header (citizen header hides admin-specific detail) */}
            <FeedbackHeader
                onCreateTicket={() => setIsCreateModalOpen(true)}
                onSubmitFeedback={() => setIsCreateModalOpen(true)}
                isCitizen={isCitizen}
            />

            {/* Role-based body */}
            {isCitizen ? (
                <CitizenFeedbackView
                    user={user}
                    onCreateTicket={() => setIsCreateModalOpen(true)}
                    toast={showToast}
                />
            ) : (
                <OfficialFeedbackView
                    user={user}
                    onCreateTicket={() => setIsCreateModalOpen(true)}
                    allTickets={allTickets}
                    setAllTickets={setAllTickets}
                    toast={showToast}
                />
            )}

            {/* FAQs & Direct Support — shown to all roles */}
            <FaqSection onReadFaq={(faq) => showToast(`Opening article: "${faq.title}"`)} />

            <DirectSupportWidget
                onLiveChat={() => showToast('Initiating 24/7 Live Support Session...')}
                onEmailSupport={() => showToast('Opening direct email support portal...')}
            />

            {/* Create Ticket Modal */}
            <CreateTicketModal
                isOpen={isCreateModalOpen}
                onClose={() => setIsCreateModalOpen(false)}
                onSubmitTicket={handleAddTicket}
            />

            <Footer />
        </div>
    );
};

export default FeedbackPage;
