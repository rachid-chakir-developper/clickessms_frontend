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

  const getOptionId = (option) => option?.id || option?.value;
  const getOptionLabel = (option) =>
    option?.label || option?.name || `${option?.firstName ?? ''} ${option?.preferredName && option?.preferredName !== '' ? option?.preferredName : option?.lastName ?? ''}`.trim();

  const onAddOption = (option) => {
    let selectedValues = [...values];
    const optionId = getOptionId(option);
    const isSelected = selectedValues.find((sv) => getOptionId(sv) === optionId);

    if (isSelected) {
      selectedValues = selectedValues.filter((sv) => getOptionId(sv) !== optionId);
    } else {
      selectedValues = [...selectedValues, option];
    }

    setValues(selectedValues);
    onChange(selectedValues, selectedValues);
  };

  React.useEffect(() => {
    setValues(value || []);
  }, [value]);

  return (
    <Box sx={{ width: '100%' }}>
      <FormControl sx={{ width: '100%' }}>
        <InputLabel id="select-checkmarks-label">{label}</InputLabel>
        <Select
          labelId="select-checkmarks-label"
          multiple={multiple}
          value={values}
          input={<OutlinedInput label={label} />}
          renderValue={(selected) => (
            <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 0.5 }}>
              {selected.map((option, index) => (
                <Chip
                  key={index}
                  icon={option?.icon || null}
                  label={getOptionLabel(option)}
                />
              ))}
            </Box>
          )}
          MenuProps={MenuProps}
          placeholder={placeholder}
        >
          {options.map((option, index) => {
            const optionId = getOptionId(option);
            const isChecked = values.find((v) => getOptionId(v) === optionId);

            return (
              <MenuItem
                key={index}
                value={option}
                onClick={() => onAddOption(option)}
              >
                <Checkbox checked={!!isChecked} />
                {option?.icon && <Box mr={1}>{option.icon}</Box>}
                <ListItemText primary={getOptionLabel(option)} />
              </MenuItem>
            );
          })}
        </Select>
        {helperText && <FormHelperText>{helperText}</FormHelperText>}
      </FormControl>
    </Box>
  );
}
