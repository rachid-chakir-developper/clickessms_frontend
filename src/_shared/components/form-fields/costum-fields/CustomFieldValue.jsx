import React, { useState } from 'react';
import { TextField, Checkbox, MenuItem, Grid, Typography, FormControlLabel } from '@mui/material';
import { GET_CUSTOM_FIELDS } from '../../../graphql/queries/CustomFieldQueries';
import { useLazyQuery } from '@apollo/client';

export default function CustomFieldValue({ formModel, initialValues = {}, onChange }) {

  const [values, setValues] = useState(initialValues);

  const [
    getCustomFields,
    {
      loading: loadingCustomFields,
      data: customFieldsData,
      error: customFieldsError,
      fetchMore: fetchMoreCustomFields,
    },
  ] = useLazyQuery(GET_CUSTOM_FIELDS);

  React.useEffect(() => {
    if (formModel) {
      getCustomFields({ variables: { customFieldFilter:{formModel} } });
    }
  }, [formModel]);
  // Handler to update values based on input changes
  const handleChange = (key, value) => {
    const newValues = { ...values, [key]: value };
    setValues(newValues);
    onChange(newValues); // Call the onChange prop to update the parent state
  };

  return (
    <Grid container spacing={2}>
      {customFieldsData?.customFields?.nodes?.map((field, index) => {
        const { fieldType, label, key, options } = field;
        const value = values[key] || '';

        switch (fieldType) {
          case 'TEXT':
            return (
              <Grid item xs={12} key={index}>
                <TextField
                  label={label}
                  value={value}
                  onChange={(e) => handleChange(key, e.target.value)} // Update on change
                  fullWidth
                  variant="outlined"
                />
              </Grid>
            );

          case 'NUMBER':
            return (
              <Grid item xs={12} key={index}>
                <TextField
                  label={label}
                  type="number"
                  value={value}
                  onChange={(e) => handleChange(key, e.target.value)} // Update on change
                  fullWidth
                  variant="outlined"
                />
              </Grid>
            );

          case 'DATE':
            return (
              <Grid item xs={12} key={index}>
                <TextField
                  label={label}
                  type="date"
                  value={value}
                  onChange={(e) => handleChange(key, e.target.value)} // Update on change
                  fullWidth
                  variant="outlined"
                  InputLabelProps={{ shrink: true }}
                />
              </Grid>
            );

          case 'BOOLEAN':
            return (
              <Grid item xs={12} key={index}>
                <FormControlLabel
                  control={
                    <Checkbox
                      checked={!!value}
                      onChange={(e) => handleChange(key, e.target.checked)} // Update on change
                    />
                  }
                  label={label}
                />
              </Grid>
            );

          case 'SELECT':
            return (
              <Grid item xs={12} key={index}>
                <TextField
                  select
                  label={label}
                  value={value}
                  onChange={(e) => handleChange(key, e.target.value)} // Update on change
                  fullWidth
                  variant="outlined"
                >
                  {options.map((option, idx) => (
                    <MenuItem key={idx} value={option}>
                      {option}
                    </MenuItem>
                  ))}
                </TextField>
              </Grid>
            );

          default:
            return null;
        }
      })}
    </Grid>
  );
};
