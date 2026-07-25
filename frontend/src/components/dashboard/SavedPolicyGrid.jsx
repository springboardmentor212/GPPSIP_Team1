import React from 'react';
import SavedPolicyCard from './SavedPolicyCard';
import EmptySavedPolicyCard from './EmptySavedPolicyCard';

const SavedPolicyGrid = ({ savedList = [], onQuickOpen, onRemove, onBrowse }) => {
  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 w-full">
      {/* Existing Saved Cards */}
      {savedList.map((policy) => (
        <div key={policy.id}>
          <SavedPolicyCard 
            title={policy.title}
            category={policy.category}
            description={policy.description}
            lastViewed={policy.lastViewed}
            onQuickOpen={() => onQuickOpen(policy)}
            onRemove={() => onRemove(policy.id)}
          />
        </div>
      ))}
      
      {/* The Dotted Plus/Placeholder Card at the end */}
      <div>
        <EmptySavedPolicyCard onClick={onBrowse} />
      </div>
    </div>
  );
};

export default SavedPolicyGrid;
