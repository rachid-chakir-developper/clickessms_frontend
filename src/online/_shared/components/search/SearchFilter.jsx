import React, { useState, useRef, useEffect } from 'react';
import { Grid, Stack } from '@mui/material';
import styled from '@emotion/styled';
import TheTextField from '../../../../_shared/components/form-fields/TheTextField';

const Item = styled(Stack)(({ theme }) => ({
  backgroundColor: theme.palette.mode === 'dark' ? '#1A2027' : '#fff',
  ...theme.typography.body2,
  padding: theme.spacing(2),
  textAlign: 'center',
  color: theme.palette.text.secondary,
}));

const SearchFilter = ({ onFilterChange }) => {
  const searchInputRef = useRef(null);
  const [filterValues, setFilterValues] = useState({
    startingDateTime: null,
    endingDateTime: null,
    keyword: '',
  });

  // Focus sur le champ de recherche au montage du composant
  useEffect(() => {
    if (searchInputRef.current) {
      searchInputRef.current.focus();
    }
  }, []);

  const handleFilterSubmit = () => {
    // Pass the filter values to the parent component for handling the filtering logic
    onFilterChange(filterValues);
  };

  const handleFilterClear = () => {
    // Pass the filter values to the parent component for handling the filtering logic
    const filterValuesInit = {
      startingDateTime: null,
      endingDateTime: null,
      keyword: '',
    };
    setFilterValues(filterValuesInit);
    onFilterChange(filterValuesInit);
  };

  React.useEffect(() => {
    handleFilterSubmit();
  }, [filterValues]);

  return (
    <Grid container spacing={2}>
      <Grid item xs={12} md={12}>
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
            inputRef={searchInputRef}
            autoFocus
          />
        </Item>
      </Grid>
      {/* <Grid item xs={12} sm={6} md={3}>
            <Item>
                <TheDateTimePicker
                    label="De"
                    type="date"
                    name="startingDateTime"
                    value={filterValues.startingDateTime}
                    onChange={(e) => setFilterValues({ ...filterValues, startingDateTime: e })}
                />
            </Item>
        </Grid>
        <Grid item xs={12} sm={6} md={3}>
            <Item>
                <TheDateTimePicker
                    label="À"
                    name="endingDateTime"
                    value={filterValues.endingDateTime}
                    onChange={(e) => setFilterValues({ ...filterValues, endingDateTime: e })}
                />
            </Item>
        </Grid>
        <Grid item xs={12} md={2} sx={{ display : 'flex', alignItems : 'center'}}>
            <Item  sx={{height: '100%', justifyContent: 'center'}}>
                <Button variant="outlined" color="info" onClick={handleFilterSubmit}>
                    Chercher
                </Button>
            </Item>
            <IconButton color="primary" onClick={handleFilterClear}>
                <Close />
            </IconButton>
        </Grid> */}
    </Grid>
  );
};

export default SearchFilter;
