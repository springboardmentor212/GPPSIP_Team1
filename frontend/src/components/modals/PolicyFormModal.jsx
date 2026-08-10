import React, { useState } from 'react';
import Modal from './Modal';
import InputField from '../forms/InputField';
import SelectField from '../forms/SelectField';
import { createPolicy, updatePolicy } from '../../services/policy.service';

const policyCategories = [
  'Education', 'Healthcare', 'Agriculture', 'Employment', 'Finance',
  'Women & Child Welfare', 'Housing', 'Environment', 'Digital Governance', 'Infrastructure'
];

const PolicyFormModal = ({ isOpen, onClose, onSuccess, initialData = null }) => {
  const [formValues, setFormValues] = useState({
    title: '',
    description: '',
    department: '',
    category: policyCategories[0]
  });

  React.useEffect(() => {
    if (initialData && isOpen) {
      setFormValues({
        title: initialData.title || '',
        description: initialData.description || '',
        department: initialData.department || '',
        category: initialData.category || policyCategories[0]
      });
    } else if (!isOpen) {
      setFormValues({
        title: '',
        description: '',
        department: '',
        category: policyCategories[0]
      });
    }
  }, [initialData, isOpen]);
  
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormValues(prev => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!formValues.title || !formValues.description || !formValues.department) {
      setError("Please fill out all required fields.");
      return;
    }
    
    setLoading(true);
    setError(null);
    try {
      let response;
      const policyId = initialData?._id || initialData?.id;
      if (initialData && policyId) {
        response = await updatePolicy(policyId, formValues);
      } else {
        response = await createPolicy(formValues);
      }
      
      if (response.success) {
        onSuccess();
        onClose();
      }
    } catch (err) {
      setError(err.response?.data?.message || err.message || `Failed to ${initialData ? 'update' : 'create'} policy`);
    } finally {
      setLoading(false);
    }
  };

  return (
    <Modal
      isOpen={isOpen}
      onClose={onClose}
      title={initialData ? "Edit Policy" : "Create New Policy"}
      actions={
        <>
          <button
            type="button"
            onClick={onClose}
            disabled={loading}
            className="px-4 py-2 border border-slate-300 hover:bg-slate-50 text-slate-650 rounded-xl text-xs font-bold transition-all cursor-pointer bg-white"
          >
            Cancel
          </button>
          <button
            type="button"
            onClick={handleSubmit}
            disabled={loading}
            className="px-4 py-2 bg-[#0052cc] hover:bg-[#0047b3] text-white rounded-xl text-xs font-bold transition-all cursor-pointer border-none flex items-center gap-2"
          >
            {loading ? (initialData ? 'Updating...' : 'Creating...') : (initialData ? 'Update Policy' : 'Create Policy')}
          </button>
        </>
      }
    >
      <form onSubmit={handleSubmit} className="space-y-4">
        {error && (
          <div className="p-3 bg-rose-50 text-rose-700 text-xs font-bold rounded-lg border border-rose-200">
            {error}
          </div>
        )}
        <InputField
          label="Policy Title *"
          name="title"
          value={formValues.title}
          onChange={handleInputChange}
          placeholder="Enter the official policy title"
        />
        <div className="flex flex-col">
          <label className="text-[10px] font-extrabold text-slate-400 uppercase tracking-wider mb-1.5">
            Description *
          </label>
          <textarea
            name="description"
            rows={4}
            value={formValues.description}
            onChange={handleInputChange}
            placeholder="Detailed description of the policy objectives and scope"
            className="w-full px-3.5 py-2.5 rounded-xl border border-slate-300 text-xs font-bold text-slate-700 bg-white placeholder-slate-400 focus:outline-none focus:border-[#0052cc] focus:ring-2 focus:ring-blue-500/10 transition-all resize-none"
          />
        </div>
        <InputField
          label="Department / Ministry *"
          name="department"
          value={formValues.department}
          onChange={handleInputChange}
          placeholder="e.g. Ministry of Health & Family Welfare"
        />
        <SelectField
          label="Category *"
          name="category"
          value={formValues.category}
          onChange={handleInputChange}
          options={policyCategories}
          placeholder="Select policy category"
        />
      </form>
    </Modal>
  );
};

export default PolicyFormModal;
