import React, { useMemo } from 'react';
import { State, City } from 'country-state-city';
import SearchableDropdown from '../../features/auth/components/SearchableDropdown';

const DistrictDropdown = ({ state, value, onChange, error, disabled }) => {
  const districtsList = useMemo(() => {
    if (!state) return [];
    const stateObj = State.getStatesOfCountry('IN').find((s) => s.name === state);
    if (!stateObj) return [];
    return City.getCitiesOfState('IN', stateObj.isoCode)
      .map((c) => c.name)
      .filter((value, index, self) => self.indexOf(value) === index)
      .sort((a, b) => a.localeCompare(b));
  }, [state]);

  return (
    <div className="w-full flex flex-col text-left">
      <label className="text-[10px] font-extrabold text-slate-400 uppercase tracking-wider mb-1.5 block">
        District
      </label>
      <SearchableDropdown
        name="district"
        value={value}
        onChange={onChange}
        options={districtsList}
        placeholder={state ? "Select District" : "Select State First"}
        disabled={disabled || !state}
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

export default DistrictDropdown;
