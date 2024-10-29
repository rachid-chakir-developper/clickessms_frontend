import * as React from 'react';
import OutlinedInput from '@mui/material/OutlinedInput';
import InputLabel from '@mui/material/InputLabel';
import MenuItem from '@mui/material/MenuItem';
import FormControl from '@mui/material/FormControl';
import ListItemText from '@mui/material/ListItemText';
import Select from '@mui/material/Select';
import Checkbox from '@mui/material/Checkbox';
import { Box, Chip, FormHelperText } from '@mui/material';

const ITEM_HEIGHT = 48;
const ITEM_PADDING_TOP = 8;
const MenuProps = {
  PaperProps: {
    style: {
      maxHeight: ITEM_HEIGHT * 4.5 + ITEM_PADDING_TOP,
      width: 250,
    },
  },
};

export default function SelectCheckmarks({
  options = [],
  limitTags,
  label,
  placeholder,
  value,
  onChange,
  multiple = true,
  helperText = null,
}) {
  const [values, setValues] = React.useState(value || []);

  const onAddOption = (option) => {
    console.log('option', option);
    let selectedValues = [...values];
    if (selectedValues.map((sv) => sv.id).includes(option.id))
      selectedValues = selectedValues.filter((sv) => sv.id !== option.id);
    else selectedValues = [...selectedValues, option];
    setValues(selectedValues);
    onChange(selectedValues, selectedValues);
  };
  React.useEffect(() => {
    setValues(value);
  }, [value]);

  return (
    <Box sx={{ width: '100%' }}>
      <FormControl sx={{ width: '100%' }}>
        <InputLabel id="demo-multiple-checkbox-label">{label}</InputLabel>
        <Select
          labelId="demo-multiple-checkbox-label"
          id="demo-multiple-checkbox"
          multiple={multiple}
          value={values}
          input={<OutlinedInput label={label} />}
          renderValue={(selected) => (
            <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 0.5 }}>
              {selected.map((option, index) => (
                <Chip
                  key={index}
                  label={
                    option?.name
                      ? `${option?.name}`
                      : `${option?.firstName} ${option?.lastName}`
                  }
                />
              ))}
            </Box>
          )}
          MenuProps={MenuProps}
          placeholder={placeholder}
        >
          {options.map((option, index) => (
            <MenuItem
              key={index}
              value={option}
              onClick={() => onAddOption(option)}
            >
              <Checkbox checked={values.map((v) => v.id).includes(option.id)} />
              <ListItemText
                primary={
                  option?.name
                    ? `${option?.name}`
                    : `${option?.firstName} ${option?.lastName}`
                }
              />
            </MenuItem>
          ))}
        </Select>
        {helperText && <FormHelperText>{helperText}</FormHelperText>}
      </FormControl>
    </Box>
  );
}
