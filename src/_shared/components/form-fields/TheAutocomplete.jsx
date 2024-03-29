import * as React from 'react';
import Autocomplete from '@mui/material/Autocomplete';
import {TextField, Avatar, Chip, Box, Checkbox} from '@mui/material';
import { CheckBox, CheckBoxOutlineBlank } from '@mui/icons-material';

const icon = <CheckBoxOutlineBlank fontSize="small" />;
const checkedIcon = <CheckBox fontSize="small" />;

export default function TheAutocomplete({options = [], limitTags, label, placeholder, value, onChange, multiple=true, helperText=null}) {
 
  return (
    <Autocomplete
      multiple={multiple}
      fullWidth
      noOptionsText="Pas de résultat"
      id="multiple-limit-tags"
      limitTags={limitTags}
      options={options}
      disableCloseOnSelect={multiple}
      getOptionLabel={(option) => option?.name ? `${option?.name}` : `${option?.firstName} ${option?.lastName}`}
      filterSelectedOptions
      value={value}
      onChange={onChange}
      renderOption={(props, option, { selected }) => (
        multiple ? <li {...props}>
            <Checkbox
              icon={icon}
              checkedIcon={checkedIcon}
              style={{ marginRight: 8 }}
              checked={selected}
            />
          <Box component="li" sx={{ '& > *': { mr: 2, flexShrink: 0 } }} {...props}>
              <Avatar alt={option?.name ? `${option?.name}` : `${option?.firstName} ${option?.lastName}`} 
              src={option?.photo ? option?.photo : option?.image } />
              {option?.name ? `${option?.name}` : `${option?.firstName} ${option?.lastName}`}
          </Box>
        </li> :
        
          <Box component="li" sx={{ '& > *': { mr: 2, flexShrink: 0 } }} {...props}>
              <Avatar alt={option?.name ? `${option?.name}` : `${option?.firstName} ${option?.lastName}`} 
              src={option?.photo ? option?.photo : option?.image } />
              {option?.name ? `${option?.name}` : `${option?.firstName} ${option?.lastName}`}
          </Box>

      )}
      renderTags={(value, getTagProps) =>
        value.map((option, index) => (
          <Chip
            key={index}
            avatar={<Avatar alt={option?.name ? `${option?.name}` : `${option?.firstName} ${option?.lastName}`} 
            src={option?.photo ? option?.photo : option?.image } />}
            label={option?.name ? `${option?.name}` : `${option?.firstName} ${option?.lastName}`}
            {...getTagProps({ index })}
          />
        ))
      }
      renderInput={(params) => (
        <TextField
          {...params}
          variant="outlined"
          label={label}
          placeholder={placeholder}
          helperText={helperText}
        />
      )}
    />
  );
}
