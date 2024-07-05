import React, { useEffect, useState } from 'react';
import {
  TextField,
  Button,
  Grid,
  Stack,
  Checkbox,
  Autocomplete,
  IconButton,
  Typography,
  InputAdornment
} from '@mui/material';
import styled from '@emotion/styled';
import dayjs from 'dayjs';

import TheTextField from '../../../../_shared/components/form-fields/TheTextField';
import TheDesktopDatePicker from '../../../../_shared/components/form-fields/TheDesktopDatePicker';
import { CheckBox, CheckBoxOutlineBlank, Close, Search } from '@mui/icons-material';
import { useQuery } from '@apollo/client';
import { GET_ESTABLISHMENTS } from '../../../../_shared/graphql/queries/EstablishmentQueries';
import TheAutocomplete from '../../../../_shared/components/form-fields/TheAutocomplete';

const Item = styled(Stack)(({ theme }) => ({
    backgroundColor: theme.palette.mode === 'dark' ? '#1A2027' : '#fff',
    ...theme.typography.body2,
    padding: theme.spacing(2),
    textAlign: 'center',
    color: theme.palette.text.secondary,
  }));

const UndesirableEventFilter = ({ onFilterChange }) => {
  const [filterValues, setFilterValues] = useState({
    startingDateTime: null,
    endingDateTime: null,
    keyword: '',
    establishments: null,
  });


  const [selectedEstablishments, setFilterSelectedEstablishments] = useState([])

  const handleFilterSubmit = () => {
    // Pass the filter values to the parent component for handling the filtering logic
    onFilterChange(filterValues);
  };

  const handleFilterClear = () => {
    // Pass the filter values to the parent component for handling the filtering logic
    const filterValuesInit = { 
                            startingDateTime: null, endingDateTime: null, keyword: '', 
                            establishments: null
                          }
    setFilterSelectedEstablishments([])
    setFilterValues(filterValuesInit)
    onFilterChange(filterValuesInit);
  };
  const handleDateChange = (selectedDate) => {
    if (selectedDate && selectedDate !== undefined) {
        console.log('selectedDate', selectedDate)
      let startingDateTime = dayjs(new Date(selectedDate.year(), selectedDate.month(), selectedDate.date(), 0, 0, 0))
      let endingDateTime = dayjs(new Date(selectedDate.year(), selectedDate.month(), selectedDate.date(), 23, 59, 59))
      setFilterValues({
         ...filterValues,
         startingDateTime, endingDateTime
        })
    }else{
      setFilterValues({ ...filterValues, startingDateTime: null, endingDateTime: null  })
    }
  };

  const {
    loading: loadingEstablishments,
    data: establishmentsData,
    error: establishmentsError,
    fetchMore: fetchMoreEstablishments,
  } = useQuery(GET_ESTABLISHMENTS, {
    fetchPolicy: 'network-only',
  });

  
  return (
    <Grid container spacing={2}>
        <Grid item xs={12} md={6}>
            <Item>
                <TheTextField variant="outlined"
                    label="Recherche"
                    placeholder="Recherche..."
                    name="keyword"
                    value={filterValues.keyword}
                    onChange={(e) => {setFilterValues({ ...filterValues, keyword: e.target.value }); onFilterChange({ ...filterValues, keyword: e.target.value });}}
                    InputProps={{
                      startAdornment: (
                        <InputAdornment position="start">
                          <IconButton onClick={handleFilterSubmit}>
                              <Search />
                          </IconButton>
                        </InputAdornment>
                      ),
                      endAdornment: (
                        <InputAdornment position="start">
                          <IconButton onClick={handleFilterClear}>
                              <Close />
                          </IconButton>
                        </InputAdornment>
                      ),
                    }}
                />
            </Item>
        </Grid>
        <Grid item xs={12} sm={6} md={3}>
            <Item>
                <TheDesktopDatePicker
                    type="date"
                    name="startingDateTime"
                    value={filterValues.startingDateTime}
                    onChange={(e) => handleDateChange(e)}
                />
            </Item>
        </Grid>
        <Grid item xs={12} sm={6} md={3}>
            <Item>
                <TheAutocomplete
                        options={establishmentsData?.establishments?.nodes}
                        label="Structures"
                        limitTags={3}
                        value={selectedEstablishments}
                        onChange={(event, newValue) => {
                            setFilterSelectedEstablishments(newValue)
                            setFilterValues({ ...filterValues, establishments: newValue.map((v) => v.id) })
                        }}
                      />
            </Item>
        </Grid>
    </Grid>
  );
};

export default UndesirableEventFilter;