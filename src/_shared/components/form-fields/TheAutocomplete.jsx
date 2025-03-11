import * as React from 'react';
import Autocomplete from '@mui/material/Autocomplete';
import { TextField, Avatar, Chip, Box, Checkbox } from '@mui/material';
import { CheckBox, CheckBoxOutlineBlank } from '@mui/icons-material';

const icon = <CheckBoxOutlineBlank fontSize="small" />;
const checkedIcon = <CheckBox fontSize="small" />;

export default function TheAutocomplete({
  options = [],
  limitTags,
  label,
  placeholder,
  value,
  onChange,
  onInputChange,
  onInput,
  onFocus,
  onKeyDown,
  onClick,
  multiple = true,
  id="TheAutocomplete",
  helperText = null,
  onBlur,
  error = false,
  disabled=false,
  required=false,
  size
}) {
  const getPhoto = (option) => {
    if (option?.photo) return option?.photo;
    else if (option?.image) return option?.image;
    else if (option?.logo) return option?.logo;
    else return null;
  };
  const getLabel = (option) => {
    if (option?.title) return option?.title;
    if (option?.name) return option?.name;
    return `${option?.firstName} ${option?.preferredName && option?.preferredName !== '' ? option?.preferredName : option?.lastName}`;
  };
  return (
    <Autocomplete
      size={size}
      multiple={multiple}
      disabled={disabled}
      onBlur={onBlur}
      fullWidth
      noOptionsText="Pas de résultat"
      id={id}
      limitTags={limitTags}
      options={options}
      disableCloseOnSelect={multiple}
      getOptionLabel={getLabel}
      filterSelectedOptions
      isOptionEqualToValue={(option, value) => option.id === value.id}
      value={value}
      onInputChange={onInputChange}
      onChange={onChange}
      renderOption={(props, option, { selected }) =>
        multiple ? (
          <Box {...props}>
            <Checkbox
              icon={icon}
              checkedIcon={checkedIcon}
              checked={selected}
            />
            <Box
              component="li"
              sx={{ '& > *': { mr: 2, flexShrink: 0 } }}
              {...props}
            >
              <Avatar
                alt={getLabel(option)}
                src={getPhoto(option)}
              />
              {getLabel(option)}
            </Box>
          </Box>
        ) : (
          <Box
            component="li"
            sx={{ '& > *': { mr: 2, flexShrink: 0 } }}
            {...props}
          >
            <Avatar
              alt={getLabel(option)}
              src={getPhoto(option)}
            />
            {getLabel(option)}
          </Box>
        )
      }
      renderTags={(value, getTagProps) =>
        value.map((option, index) => (
          <Chip
            key={index}
            avatar={
              <Avatar
                alt={getLabel(option)}
                src={getPhoto(option)}
              />
            }
            label={getLabel(option)}
            {...getTagProps({ index })}
          />
        ))
      }
      renderInput={(params) => (
        <TextField
          {...params}
          id={id}
          variant="outlined"
          label={label}
          placeholder={placeholder}
          helperText={helperText}
          error={error}
          onInput={onInput}
          onFocus={onFocus}
          onKeyDown={onKeyDown}
          onClick={onClick}
          size={size}
        />
      )}
    />
  );
}