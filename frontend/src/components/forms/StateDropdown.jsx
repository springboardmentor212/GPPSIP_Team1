import React, { useMemo } from 'react';
import { State } from 'country-state-city';
import SearchableDropdown from '../../features/auth/components/SearchableDropdown';

const StateDropdown = ({ value, onChange, error, disabled }) => {
  const statesList = useMemo(() => {
    return State.getStatesOfCountry('IN')
      .map((s) => s.name)
      .sort((a, b) => a.localeCompare(b));
  }, []);

  return (
    <div className="w-full flex flex-col text-left">
      <label className="text-[10px] font-extrabold text-slate-400 uppercase tracking-wider mb-1.5 block">
        State
      </label>
      <SearchableDropdown
        name="state"
        value={value}
        onChange={onChange}
        options={statesList}
        placeholder="Select State"
        disabled={disabled}
        error={error}
      />
      {error && (
        <span className="text-[10px] text-red-550 font-bold mt-1 pl-1">
          {error}
        </span>
      )}
    </div>
  );
};

export default StateDropdown;
