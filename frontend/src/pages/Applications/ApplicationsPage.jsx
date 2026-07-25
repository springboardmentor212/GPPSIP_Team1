import React, { useState, useEffect, useMemo } from 'react';
import { 
  FaClipboardList, 
  FaSearch, 
  FaEye, 
  FaEdit, 
  FaTrashAlt, 
  FaPlus, 
  FaExclamationTriangle,
  FaRedo
} from 'react-icons/fa';

// Import Reusable Components
import StatsCard from '../../components/cards/StatsCard';
import Table from '../../components/tables/Table';
import StatusBadge from '../../components/ui/StatusBadge';
import Pagination from '../../components/common/Pagination';
import Modal from '../../components/modals/Modal';
import InputField from '../../components/forms/InputField';
import SelectField from '../../components/forms/SelectField';
import Footer from '../../components/layout/Footer';

// Import Service functions
import {
  getApplications,
  applyForScheme,
  updateApplication,
  deleteApplication,
  getSimulatedFailure,
  setSimulatedFailure
} from '../../services/application.service';

const ApplicationsPage = () => {
  // Database state
  const [applications, setApplications] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  
  // Search & Filters state
  const [searchQuery, setSearchQuery] = useState('');
  const [statusFilter, setStatusFilter] = useState('All');
  const [deptFilter, setDeptFilter] = useState('All');
  const [schemeFilter, setSchemeFilter] = useState('All');
  
  // Fail simulator state
  const [simulatedFail, setSimulatedFail] = useState(getSimulatedFailure());

  // Pagination state
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 5;

  // Selected Item / Modals state
  const [activeModal, setActiveModal] = useState(null); // 'add' | 'edit' | 'view' | 'delete' | null
  const [selectedItem, setSelectedItem] = useState(null);

  // Form states
  const [formValues, setFormValues] = useState({
    applicantName: '',
    schemeName: '',
    department: '',
    status: 'Pending'
  });
  const [formErrors, setFormErrors] = useState({});

  // Static options for form inputs
  const schemeOptions = [
    "PM-KISAN (Pradhan Mantri Kisan Samman Nidhi)",
    "Post-Matric Scholarship Scheme",
    "Atal Pension Yojana",
    "Ayushman Bharat PM-JAY",
    "Pradhan Mantri Awas Yojana",
    "National Social Assistance Programme"
  ];

  const departmentOptions = [
    "Agriculture & Farmers Welfare",
    "Education",
    "Finance",
    "Health & Family Welfare",
    "Housing & Urban Affairs",
    "Social Justice & Empowerment"
  ];

  // Fetch applications
  const fetchApplicationsData = async () => {
    setLoading(true);
    setError(null);
    try {
      const response = await getApplications();
      if (response.success) {
        setApplications(response.applications);
      }
    } catch (err) {
      setError(err.message || "Failed to fetch applications.");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchApplicationsData();
  }, []);

  // Update simulator state
  const handleFailToggle = (e) => {
    const isChecked = e.target.checked;
    setSimulatedFail(isChecked);
    setSimulatedFailure(isChecked);
  };

  // Helper stats calculated dynamically
  const stats = useMemo(() => {
    const total = applications.length;
    const pending = applications.filter(a => a.status?.toLowerCase() === 'pending').length;
    const approved = applications.filter(a => a.status?.toLowerCase() === 'approved').length;
    const rejected = applications.filter(a => a.status?.toLowerCase() === 'rejected').length;
    return { total, pending, approved, rejected };
  }, [applications]);

  // Derived filter options
  const filterDropdownOptions = useMemo(() => {
    const statuses = ['All', 'Pending', 'Approved', 'Rejected', 'Under Review'];
    const departments = ['All', ...new Set(applications.map(a => a.department))].filter(Boolean);
    const schemes = ['All', ...new Set(applications.map(a => a.schemeName))].filter(Boolean);
    return { statuses, departments, schemes };
  }, [applications]);

  // Search & filter logic combined
  const filteredApplications = useMemo(() => {
    return applications.filter((app) => {
      const matchesSearch = 
        app.id?.toLowerCase().includes(searchQuery.toLowerCase()) ||
        app.applicantName?.toLowerCase().includes(searchQuery.toLowerCase()) ||
        app.schemeName?.toLowerCase().includes(searchQuery.toLowerCase());
      
      const matchesStatus = statusFilter === 'All' || app.status === statusFilter;
      const matchesDept = deptFilter === 'All' || app.department === deptFilter;
      const matchesScheme = schemeFilter === 'All' || app.schemeName === schemeFilter;

      return matchesSearch && matchesStatus && matchesDept && matchesScheme;
    });
  }, [applications, searchQuery, statusFilter, deptFilter, schemeFilter]);

  // Paginated chunk
  const paginatedApplications = useMemo(() => {
    const start = (currentPage - 1) * itemsPerPage;
    return filteredApplications.slice(start, start + itemsPerPage);
  }, [filteredApplications, currentPage]);

  const totalPages = Math.ceil(filteredApplications.length / itemsPerPage) || 1;

  // Form handlers
  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormValues(prev => ({ ...prev, [name]: value }));
    if (formErrors[name]) {
      setFormErrors(prev => ({ ...prev, [name]: null }));
    }
  };

  const validateForm = () => {
    const errors = {};
    if (!formValues.applicantName.trim()) {
      errors.applicantName = "Applicant Name is required.";
    }
    if (!formValues.schemeName) {
      errors.schemeName = "Please select a Scheme.";
    }
    if (!formValues.department) {
      errors.department = "Please select a Department.";
    }
    setFormErrors(errors);
    return Object.keys(errors).length === 0;
  };

  // CRUD actions
  const handleOpenAdd = () => {
    setFormValues({
      applicantName: '',
      schemeName: '',
      department: '',
      status: 'Pending'
    });
    setFormErrors({});
    setActiveModal('add');
  };

  const handleOpenEdit = (item) => {
    setSelectedItem(item);
    setFormValues({
      applicantName: item.applicantName,
      schemeName: appSchemeNameMapper(item.schemeName),
      department: appDepartmentMapper(item.department),
      status: item.status
    });
    setFormErrors({});
    setActiveModal('edit');
  };

  const appSchemeNameMapper = (val) => {
    return schemeOptions.includes(val) ? val : schemeOptions[0];
  };

  const appDepartmentMapper = (val) => {
    return departmentOptions.includes(val) ? val : departmentOptions[0];
  };

  const handleOpenView = (item) => {
    setSelectedItem(item);
    setActiveModal('view');
  };

  const handleOpenDelete = (item) => {
    setSelectedItem(item);
    setActiveModal('delete');
  };

  const handleAddSubmit = async (e) => {
    e.preventDefault();
    if (!validateForm()) return;
    
    setLoading(true);
    try {
      const response = await applyForScheme(formValues);
      if (response.success) {
        await fetchApplicationsData();
        setActiveModal(null);
      }
    } catch (err) {
      setError(err.message || "Failed to submit application.");
    } finally {
      setLoading(false);
    }
  };

  const handleEditSubmit = async (e) => {
    e.preventDefault();
    if (!validateForm()) return;

    setLoading(true);
    try {
      const response = await updateApplication(selectedItem.id, formValues);
      if (response.success) {
        await fetchApplicationsData();
        setActiveModal(null);
      }
    } catch (err) {
      setError(err.message || "Failed to update application.");
    } finally {
      setLoading(false);
    }
  };

  const handleDeleteConfirm = async () => {
    setLoading(true);
    try {
      const response = await deleteApplication(selectedItem.id);
      if (response.success) {
        await fetchApplicationsData();
        setActiveModal(null);
      }
    } catch (err) {
      setError(err.message || "Failed to delete application.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="space-y-8 flex flex-col justify-between min-h-full">
      <div className="flex-grow space-y-8">
        
        {/* Header Block */}
        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
          <div>
            <h2 className="text-2xl font-black text-slate-800 tracking-tight flex items-center gap-2.5 select-none">
              <FaClipboardList className="text-[#0052cc]" /> Applications Portal
            </h2>
            <p className="text-xs text-slate-400 font-semibold select-none mt-1">
              Manage and trace submitted citizen applications.
            </p>
          </div>
          
          {/* Simulated Error Control */}
          <div className="flex items-center gap-2 bg-amber-50/50 border border-amber-250 p-2.5 rounded-xl text-xs font-semibold select-none">
            <input 
              type="checkbox" 
              checked={simulatedFail} 
              onChange={handleFailToggle} 
              id="fail-simulator" 
              className="rounded border-slate-300 text-[#0052cc] focus:ring-blue-500/10 cursor-pointer"
            />
            <label htmlFor="fail-simulator" className="text-amber-800 cursor-pointer">
              Simulate Network Failure
            </label>
          </div>
        </div>

        {/* Loading Spinner */}
        {loading && !activeModal && (
          <div className="bg-white rounded-2xl border border-slate-300 p-12 flex flex-col items-center justify-center min-h-[300px]">
            <div className="w-10 h-10 border-4 border-[#0052cc] border-t-transparent rounded-full animate-spin"></div>
            <span className="text-xs font-bold text-slate-400 mt-4 select-none">Retrieving applications database records...</span>
          </div>
        )}

        {/* Error State */}
        {error && !loading && (
          <div className="bg-rose-50/50 rounded-2xl border border-rose-200 p-8 flex flex-col items-center text-center max-w-lg mx-auto">
            <FaExclamationTriangle className="text-rose-550 w-12 h-12 mb-4 animate-bounce" />
            <h3 className="text-sm font-bold text-rose-800 uppercase tracking-wider mb-2 select-none">Sync Connection Failure</h3>
            <p className="text-xs font-medium text-rose-600 mb-6 max-w-sm leading-relaxed select-none">{error}</p>
            <button
              onClick={fetchApplicationsData}
              className="px-4 py-2 bg-rose-600 hover:bg-rose-700 text-white rounded-xl text-xs font-extrabold flex items-center gap-2 shadow-sm transition-colors cursor-pointer border-none"
            >
              <FaRedo className="w-3 h-3" /> Retry Synchronization
            </button>
          </div>
        )}

        {/* Core Dashboard UI (Render when not error and not loading) */}
        {!loading && !error && (
          <>
            {/* Stats Cards Row */}
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">
              <StatsCard 
                title="Total Applications" 
                value={stats.total} 
                growth="Synchronized" 
                growthType="positive" 
                icon={FaClipboardList} 
                color="blue" 
              />
              <StatsCard 
                title="Pending Status" 
                value={stats.pending} 
                growth="Action Required" 
                growthType="neutral" 
                icon={FaClipboardList} 
                color="orange" 
              />
              <StatsCard 
                title="Approved Status" 
                value={stats.approved} 
                growth="Disbursements active" 
                growthType="positive" 
                icon={FaClipboardList} 
                color="green" 
              />
              <StatsCard 
                title="Rejected Status" 
                value={stats.rejected} 
                growth="Verified details" 
                growthType="neutral" 
                icon={FaClipboardList} 
                color="red" 
              />
            </div>

            {/* Filter controls panel */}
            <div className="bg-white rounded-2xl border border-slate-300 p-4 sm:p-5 flex flex-col gap-4 select-none">
              <div className="grid grid-cols-1 md:grid-cols-4 gap-4 items-center">
                
                {/* Search query box */}
                <div className="relative">
                  <span className="absolute left-3.5 top-3 text-slate-400">
                    <FaSearch className="w-3.5 h-3.5" />
                  </span>
                  <input
                    type="text"
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    placeholder="Search applicant or scheme..."
                    className="w-full pl-10 pr-4 py-2 border border-slate-350 bg-slate-50/30 rounded-xl text-xs placeholder-slate-400 text-slate-700 font-bold focus:outline-none focus:bg-white focus:border-[#0052cc] focus:ring-2 focus:ring-blue-500/10 transition-all"
                  />
                </div>

                {/* Status Filter */}
                <select
                  value={statusFilter}
                  onChange={(e) => { setStatusFilter(e.target.value); setCurrentPage(1); }}
                  className="px-3.5 py-2 border border-slate-350 bg-white rounded-xl text-xs font-bold text-slate-700 focus:outline-none focus:border-[#0052cc] focus:ring-2 focus:ring-blue-500/10 transition-all cursor-pointer"
                >
                  <option disabled>Filter by Status</option>
                  {filterDropdownOptions.statuses.map(s => (
                    <option key={s} value={s}>{s === 'All' ? 'All Statuses' : s}</option>
                  ))}
                </select>

                {/* Department Filter */}
                <select
                  value={deptFilter}
                  onChange={(e) => { setDeptFilter(e.target.value); setCurrentPage(1); }}
                  className="px-3.5 py-2 border border-slate-350 bg-white rounded-xl text-xs font-bold text-slate-700 focus:outline-none focus:border-[#0052cc] focus:ring-2 focus:ring-blue-500/10 transition-all cursor-pointer"
                >
                  <option disabled>Filter by Department</option>
                  {filterDropdownOptions.departments.map(d => (
                    <option key={d} value={d}>{d === 'All' ? 'All Departments' : d}</option>
                  ))}
                </select>

                {/* Scheme Filter */}
                <select
                  value={schemeFilter}
                  onChange={(e) => { setSchemeFilter(e.target.value); setCurrentPage(1); }}
                  className="px-3.5 py-2 border border-slate-350 bg-white rounded-xl text-xs font-bold text-slate-700 focus:outline-none focus:border-[#0052cc] focus:ring-2 focus:ring-blue-500/10 transition-all cursor-pointer"
                >
                  <option disabled>Filter by Scheme</option>
                  {filterDropdownOptions.schemes.map(sc => (
                    <option key={sc} value={sc}>{sc === 'All' ? 'All Schemes' : sc}</option>
                  ))}
                </select>

              </div>
            </div>

            {/* Empty State */}
            {filteredApplications.length === 0 && (
              <div className="bg-white rounded-2xl border border-slate-300 p-12 text-center flex flex-col items-center">
                <FaClipboardList className="text-slate-300 w-16 h-16 mb-4" />
                <h3 className="text-sm font-bold text-slate-700 mb-1 select-none">No Applications Found</h3>
                <p className="text-xs text-slate-400 font-semibold mb-6 max-w-xs leading-relaxed select-none">
                  We couldn't find any applications matching your query. Apply for a new scheme to get started.
                </p>
                <button
                  onClick={handleOpenAdd}
                  className="px-4.5 py-2 bg-[#0052cc] hover:bg-[#0047b3] text-white rounded-xl text-xs font-black shadow-md hover:scale-105 active:scale-95 transition-all flex items-center gap-1.5 cursor-pointer border-none"
                >
                  <FaPlus className="w-3 h-3" /> New Scheme Application
                </button>
              </div>
            )}

            {/* Applications List Table */}
            {filteredApplications.length > 0 && (
              <div className="relative">
                <Table
                  headers={[
                    "Application ID",
                    "Applicant Name",
                    "Scheme Name",
                    "Department",
                    "Submitted Date",
                    "Status",
                    "Actions"
                  ]}
                >
                  {paginatedApplications.map((app) => (
                    <tr key={app.id} className="hover:bg-slate-50/50 transition-colors">
                      {/* ID */}
                      <td className="p-4 text-xs font-black text-slate-800 font-mono">
                        {app.id}
                      </td>
                      {/* Applicant Name */}
                      <td className="p-4 text-xs font-bold text-slate-700">
                        {app.applicantName}
                      </td>
                      {/* Scheme Name */}
                      <td className="p-4 text-xs font-bold text-slate-800 max-w-xs truncate">
                        {app.schemeName}
                      </td>
                      {/* Department */}
                      <td className="p-4 text-xs font-bold text-slate-400 uppercase tracking-wide">
                        {app.department}
                      </td>
                      {/* Date */}
                      <td className="p-4 text-xs font-bold text-slate-500 font-medium">
                        {new Date(app.submittedDate).toLocaleDateString('en-GB', { day: 'numeric', month: 'short', year: 'numeric' })}
                      </td>
                      {/* Status */}
                      <td className="p-4">
                        <StatusBadge status={app.status} />
                      </td>
                      {/* Actions */}
                      <td className="p-4">
                        <div className="flex items-center gap-2 select-none">
                          <button
                            type="button"
                            onClick={() => handleOpenView(app)}
                            title="View Application"
                            className="w-7 h-7 flex items-center justify-center rounded-lg border border-slate-205 text-slate-400 bg-white hover:text-[#0052cc] hover:border-[#0052cc] transition-colors cursor-pointer"
                          >
                            <FaEye className="w-3.5 h-3.5" />
                          </button>
                          <button
                            type="button"
                            onClick={() => handleOpenEdit(app)}
                            title="Edit Application"
                            className="w-7 h-7 flex items-center justify-center rounded-lg border border-slate-205 text-slate-400 bg-white hover:text-amber-500 hover:border-amber-500 transition-colors cursor-pointer"
                          >
                            <FaEdit className="w-3.5 h-3.5" />
                          </button>
                          <button
                            type="button"
                            onClick={() => handleOpenDelete(app)}
                            title="Delete Application"
                            className="w-7 h-7 flex items-center justify-center rounded-lg border border-slate-205 text-slate-400 bg-white hover:text-rose-550 hover:border-rose-550 transition-colors cursor-pointer"
                          >
                            <FaTrashAlt className="w-3.5 h-3.5" />
                          </button>
                        </div>
                      </td>
                    </tr>
                  ))}
                </Table>

                {/* Pagination */}
                <Pagination
                  currentPage={currentPage}
                  totalPages={totalPages}
                  totalResults={filteredApplications.length}
                  resultsPerPage={itemsPerPage}
                  onPageChange={setCurrentPage}
                />

                {/* Floating Action Button */}
                <div className="absolute right-4 -bottom-6">
                  <button
                    type="button"
                    onClick={handleOpenAdd}
                    title="Add Application"
                    className="w-12 h-12 bg-[#0052cc] hover:bg-[#0047b3] text-white flex items-center justify-center rounded-full shadow-lg shadow-blue-500/20 hover:scale-110 hover:shadow-xl active:scale-95 transition-all cursor-pointer border-none"
                  >
                    <FaPlus className="w-4 h-4 text-white" />
                  </button>
                </div>
              </div>
            )}
          </>
        )}
      </div>

      <Footer />

      {/* MODALS PANEL */}

      {/* 1. Add Application Modal */}
      <Modal
        isOpen={activeModal === 'add'}
        onClose={() => setActiveModal(null)}
        title="Submit New Application"
        actions={
          <>
            <button
              type="button"
              onClick={() => setActiveModal(null)}
              className="px-4 py-2 border border-slate-300 hover:bg-slate-50 text-slate-650 rounded-xl text-xs font-bold transition-all cursor-pointer bg-white"
            >
              Cancel
            </button>
            <button
              type="button"
              onClick={handleAddSubmit}
              className="px-4 py-2 bg-[#0052cc] hover:bg-[#0047b3] text-white rounded-xl text-xs font-bold transition-all cursor-pointer border-none"
            >
              Submit Application
            </button>
          </>
        }
      >
        <form onSubmit={handleAddSubmit} className="space-y-4">
          <InputField
            label="Applicant Name"
            name="applicantName"
            value={formValues.applicantName}
            onChange={handleInputChange}
            placeholder="Enter applicant's full name"
            error={formErrors.applicantName}
          />
          <SelectField
            label="Scheme Name"
            name="schemeName"
            value={formValues.schemeName}
            onChange={handleInputChange}
            options={schemeOptions}
            placeholder="Select official scheme"
            error={formErrors.schemeName}
          />
          <SelectField
            label="Department"
            name="department"
            value={formValues.department}
            onChange={handleInputChange}
            options={departmentOptions}
            placeholder="Select ministry department"
            error={formErrors.department}
          />
          <SelectField
            label="Status"
            name="status"
            value={formValues.status}
            onChange={handleInputChange}
            options={["Pending", "Under Review", "Approved", "Rejected"]}
            placeholder="Select initial status"
          />
        </form>
      </Modal>

      {/* 2. Edit Application Modal */}
      <Modal
        isOpen={activeModal === 'edit'}
        onClose={() => setActiveModal(null)}
        title={`Edit Application (${selectedItem?.id})`}
        actions={
          <>
            <button
              type="button"
              onClick={() => setActiveModal(null)}
              className="px-4 py-2 border border-slate-300 hover:bg-slate-50 text-slate-650 rounded-xl text-xs font-bold transition-all cursor-pointer bg-white"
            >
              Cancel
            </button>
            <button
              type="button"
              onClick={handleEditSubmit}
              className="px-4 py-2 bg-[#0052cc] hover:bg-[#0047b3] text-white rounded-xl text-xs font-bold transition-all cursor-pointer border-none"
            >
              Save Changes
            </button>
          </>
        }
      >
        <form onSubmit={handleEditSubmit} className="space-y-4">
          <InputField
            label="Applicant Name"
            name="applicantName"
            value={formValues.applicantName}
            onChange={handleInputChange}
            placeholder="Enter applicant's full name"
            error={formErrors.applicantName}
          />
          <SelectField
            label="Scheme Name"
            name="schemeName"
            value={formValues.schemeName}
            onChange={handleInputChange}
            options={schemeOptions}
            placeholder="Select official scheme"
            error={formErrors.schemeName}
          />
          <SelectField
            label="Department"
            name="department"
            value={formValues.department}
            onChange={handleInputChange}
            options={departmentOptions}
            placeholder="Select ministry department"
            error={formErrors.department}
          />
          <SelectField
            label="Status"
            name="status"
            value={formValues.status}
            onChange={handleInputChange}
            options={["Pending", "Under Review", "Approved", "Rejected"]}
            placeholder="Select current status"
          />
        </form>
      </Modal>

      {/* 3. View Application Modal */}
      <Modal
        isOpen={activeModal === 'view'}
        onClose={() => setActiveModal(null)}
        title="Application Details Summary"
        actions={
          <button
            type="button"
            onClick={() => setActiveModal(null)}
            className="px-5 py-2 bg-[#0052cc] hover:bg-[#0047b3] text-white rounded-xl text-xs font-bold transition-all cursor-pointer border-none"
          >
            Close Details
          </button>
        }
      >
        {selectedItem && (
          <div className="space-y-4 text-left select-none">
            <div className="p-4 bg-slate-50 border border-slate-200 rounded-2xl space-y-2">
              <div className="flex justify-between items-center pb-2 border-b border-slate-200">
                <span className="text-[10px] font-extrabold text-slate-400 uppercase tracking-wider">Application ID</span>
                <span className="text-xs font-black text-slate-800 font-mono">{selectedItem.id}</span>
              </div>
              <div className="flex justify-between items-center py-1">
                <span className="text-xs font-bold text-slate-400">Applicant Name</span>
                <span className="text-xs font-extrabold text-slate-800">{selectedItem.applicantName}</span>
              </div>
              <div className="flex flex-col py-1">
                <span className="text-xs font-bold text-slate-400 mb-1">Scheme Name</span>
                <span className="text-xs font-extrabold text-slate-800 bg-white border border-slate-200 p-2 rounded-xl">{selectedItem.schemeName}</span>
              </div>
              <div className="flex justify-between items-center py-1">
                <span className="text-xs font-bold text-slate-400">Department</span>
                <span className="text-xs font-extrabold text-slate-800">{selectedItem.department}</span>
              </div>
              <div className="flex justify-between items-center py-1">
                <span className="text-xs font-bold text-slate-400">Submitted Date</span>
                <span className="text-xs font-extrabold text-slate-800">
                  {new Date(selectedItem.submittedDate).toLocaleDateString('en-GB', { day: 'numeric', month: 'long', year: 'numeric' })}
                </span>
              </div>
              <div className="flex justify-between items-center pt-2 border-t border-slate-200">
                <span className="text-xs font-bold text-slate-400">Current Status</span>
                <StatusBadge status={selectedItem.status} />
              </div>
            </div>
          </div>
        )}
      </Modal>

      {/* 4. Delete Application Confirmation Modal */}
      <Modal
        isOpen={activeModal === 'delete'}
        onClose={() => setActiveModal(null)}
        title="Confirm Application Deletion"
        actions={
          <>
            <button
              type="button"
              onClick={() => setActiveModal(null)}
              className="px-4 py-2 border border-slate-300 hover:bg-slate-50 text-slate-650 rounded-xl text-xs font-bold transition-all cursor-pointer bg-white"
            >
              Cancel
            </button>
            <button
              type="button"
              onClick={handleDeleteConfirm}
              className="px-4 py-2 bg-rose-600 hover:bg-rose-700 text-white rounded-xl text-xs font-bold transition-all cursor-pointer border-none"
            >
              Delete Permanently
            </button>
          </>
        }
      >
        <div className="text-center p-2 select-none">
          <FaExclamationTriangle className="text-rose-550 w-12 h-12 mb-4 mx-auto animate-pulse" />
          <h4 className="text-sm font-bold text-slate-700 mb-2">Delete application records?</h4>
          <p className="text-xs text-slate-400 font-semibold leading-relaxed">
            Are you sure you want to delete the application record for <strong className="text-slate-650">{selectedItem?.applicantName}</strong>? This action cannot be undone.
          </p>
        </div>
      </Modal>

    </div>
  );
};

export default ApplicationsPage;
