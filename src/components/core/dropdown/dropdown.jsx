import React from 'react';
import { FormControl, InputLabel, Select, MenuItem } from '@mui/material';
import { DropdownContainer } from './dropdown.styles';

const Dropdown   = ({ label, value, options, onChange }) => {
  return (
    <DropdownContainer>
    <FormControl fullWidth  variant='standard' color='white'>
      <InputLabel id={`${label}-label`} >{label} </InputLabel>
      <Select
        labelId={`${label}-label`}
        value={value}
        onChange={(e) => onChange(e.target.value)}
      >
        {options.map((option) => (
          <MenuItem key={option.value} value={option.value}>
            {option.label}
          </MenuItem>
        ))}
      </Select>
    </FormControl>
  </DropdownContainer>
  );
};

export default Dropdown;
