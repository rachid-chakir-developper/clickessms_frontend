import React, { useState } from 'react';
import { Button, Grid, Stack, IconButton } from '@mui/material';
import styled from '@emotion/styled';
import TheTextField from '../../../../_shared/components/form-fields/TheTextField';
import TheDateTimePicker from '../../../../_shared/components/form-fields/TheDateTimePicker';
import { Close } from '@mui/icons-material';

const Item = styled(Stack)(({ theme }) => ({
  backgroundColor: theme.palette.mode === 'dark' ? '#1A2027' : '#fff',
  ...theme.typography.body2,
  padding: theme.spacing(2),
  textAlign: 'center',
  color: theme.palette.text.secondary,
}));

const TheObjectFilter = ({ onFilterChange }) => {
  const [filterValues, setFilterValues] = useState({
    recoveryDate: null,
    returnDate: null,
    keyword: '',
  });

  const handleFilterSubmit = () => {
    // Pass the filter values to the parent component for handling the filtering logic
    onFilterChange(filterValues);
  };

  const handleFilterClear = () => {
    // Pass the filter values to the parent component for handling the filtering logic
    const filterValuesInit = {
      recoveryDate: null,
      returnDate: null,
      keyword: '',
    };
    setFilterValues(filterValuesInit);
    onFilterChange(filterValuesInit);
  };

  return (
    <Grid container spacing={2}>
      <Grid item xs={12} md={4}>
        <Item>
          <TheTextField
            variant="outlined"
            label="Recherche"
            placeholder="Recherche..."
            name="keyword"
            value={filterValues.keyword}
            onChange={(e) =>
              setFilterValues({ ...filterValues, keyword: e.target.value })
            }
          />
        </Item>
      </Grid>
      <Grid item xs={12} sm={6} md={3}>
        <Item>
          <TheDateTimePicker
            label="De"
            type="date"
            name="recoveryDate"
            value={filterValues.recoveryDate}
            onChange={(e) =>
              setFilterValues({ ...filterValues, recoveryDate: e })
            }
          />
        </Item>
      </Grid>
      <Grid item xs={12} sm={6} md={3}>
        <Item>
          <TheDateTimePicker
            label="De"
            name="returnDate"
            value={filterValues.returnDate}
            onChange={(e) =>
              setFilterValues({ ...filterValues, returnDate: e })
            }
          />
        </Item>
      </Grid>
      <Grid item xs={12} md={2} sx={{ display: 'flex', alignItems: 'center' }}>
        <Item sx={{ height: '100%', justifyContent: 'center' }}>
          <Button variant="outlined" color="info" onClick={handleFilterSubmit}>
            Chercher
          </Button>
        </Item>
        <IconButton color="primary" onClick={handleFilterClear}>
          <Close />
        </IconButton>
      </Grid>
    </Grid>
  );
};

export default TheObjectFilter;
