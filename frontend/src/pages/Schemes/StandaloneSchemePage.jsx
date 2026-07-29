import React, { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router';
import SchemeDetailsPage from './SchemeDetailsPage';
import { getSchemeById } from '../../services/scheme.service';

const StandaloneSchemePage = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [scheme, setScheme] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchScheme = async () => {
      try {
        const res = await getSchemeById(id);
        if (res.success && res.scheme) {
          setScheme(res.scheme);
        } else {
          setError('Scheme not found.');
        }
      } catch (err) {
        setError('Error fetching scheme.');
      } finally {
        setLoading(false);
      }
    };
    fetchScheme();
  }, [id]);

  if (loading) {
    return (
      <div className="min-h-screen bg-slate-50 flex items-center justify-center">
        <p className="text-slate-500 font-bold">Loading scheme details...</p>
      </div>
    );
  }

  if (error || !scheme) {
    return (
      <div className="min-h-screen bg-slate-50 flex items-center justify-center flex-col gap-4">
        <p className="text-rose-500 font-bold text-lg">{error || 'Scheme not found.'}</p>
        <button 
          onClick={() => navigate('/dashboard?tab=applications')}
          className="px-4 py-2 bg-[#0052cc] hover:bg-[#0047b3] text-white rounded-lg text-sm font-bold border-none cursor-pointer"
        >
          Return to Dashboard
        </button>
      </div>
    );
  }

  return <SchemeDetailsPage scheme={scheme} onBack={() => navigate('/dashboard?tab=applications')} />;
};

export default StandaloneSchemePage;
