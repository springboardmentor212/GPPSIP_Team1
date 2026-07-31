import React, { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router';
import PolicyDetailsPage from './PolicyDetailsPage';
import { getPolicyById } from '../../services/policy.service';

const StandalonePolicyPage = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [policy, setPolicy] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchPolicy = async () => {
      try {
        const res = await getPolicyById(id);
        if (res.success && res.policy) {
          setPolicy(res.policy);
        } else {
          setError('Policy not found.');
        }
      } catch (err) {
        setError('Error fetching policy.');
      } finally {
        setLoading(false);
      }
    };
    fetchPolicy();
  }, [id]);

  if (loading) {
    return (
      <div className="min-h-screen bg-slate-50 flex items-center justify-center">
        <p className="text-slate-500 font-bold">Loading policy...</p>
      </div>
    );
  }

  if (error || !policy) {
    return (
      <div className="min-h-screen bg-slate-50 flex items-center justify-center flex-col gap-4">
        <p className="text-rose-500 font-bold text-lg">{error || 'Policy not found.'}</p>
        <button 
          onClick={() => navigate('/dashboard')}
          className="px-4 py-2 bg-[#0052cc] hover:bg-[#0047b3] text-white rounded-lg text-sm font-bold"
        >
          Return to Dashboard
        </button>
      </div>
    );
  }

  return <PolicyDetailsPage policy={policy} onBack={() => navigate('/dashboard')} />;
};

export default StandalonePolicyPage;
