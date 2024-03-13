import * as React from 'react';
import Autocomplete from '@mui/material/Autocomplete';
import {TextField, Avatar, Chip, Box} from '@mui/material';

export default function TheAutocomplete({options = [], limitTags, label, placeholder, value, onChange, multiple=true}) {
 
  return (
    <Autocomplete
      multiple={multiple}
      fullWidth
      noOptionsText="Pas de résultat"
      id="multiple-limit-tags"
      limitTags={limitTags}
      options={options}
      getOptionLabel={(option) => option?.name ? `${option?.name}` : `${option?.firstName} ${option?.lastName}`}
      filterSelectedOptions
      value={value}
      onChange={onChange}
      renderOption={(props, option) => (
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
        />
      )}
    />
  );
}
