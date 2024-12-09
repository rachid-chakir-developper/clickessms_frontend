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
      getOptionLabel={(option) =>
        option?.name
          ? `${option?.name}`
          : `${option?.firstName} ${option?.preferredName && option?.preferredName !== ''  ? option?.preferredName : option?.lastName}`
      }
      filterSelectedOptions
      isOptionEqualToValue={(option, value) => option.id === value.id}
      value={value}
      onInputChange={onInputChange}
      onChange={onChange}
      renderOption={(props, option, { selected }) =>
        multiple ? (
          <li {...props}>
            <Checkbox
              icon={icon}
              checkedIcon={checkedIcon}
              s
              checked={selected}
            />
            <Box
              component="li"
              sx={{ '& > *': { mr: 2, flexShrink: 0 } }}
              {...props}
            >
              <Avatar
                alt={
                  option?.name
                    ? `${option?.name}`
                    : `${option?.firstName} ${option?.preferredName && option?.preferredName !== ''  ? option?.preferredName : option?.lastName}`
                }
                src={getPhoto(option)}
              />
              {option?.name
                ? `${option?.name}`
                : `${option?.firstName} ${option?.preferredName && option?.preferredName !== ''  ? option?.preferredName : option?.lastName}`}
            </Box>
          </li>
        ) : (
          <Box
            component="li"
            sx={{ '& > *': { mr: 2, flexShrink: 0 } }}
            {...props}
          >
            <Avatar
              alt={
                option?.name
                  ? `${option?.name}`
                  : `${option?.firstName} ${option?.preferredName && option?.preferredName !== ''  ? option?.preferredName : option?.lastName}`
              }
              src={getPhoto(option)}
            />
            {option?.name
              ? `${option?.name}`
              : `${option?.firstName} ${option?.preferredName && option?.preferredName !== ''  ? option?.preferredName : option?.lastName}`}
          </Box>
        )
      }
      renderTags={(value, getTagProps) =>
        value.map((option, index) => (
          <Chip
            key={index}
            avatar={
              <Avatar
                alt={
                  option?.name
                    ? `${option?.name}`
                    : `${option?.firstName} ${option?.preferredName && option?.preferredName !== ''  ? option?.preferredName : option?.lastName}`
                }
                src={getPhoto(option)}
              />
            }
            label={
              option?.name
                ? `${option?.name}`
                : `${option?.firstName} ${option?.preferredName && option?.preferredName !== ''  ? option?.preferredName : option?.lastName}`
            }
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
