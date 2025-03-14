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

import TheTextField from '../../../../../_shared/components/form-fields/TheTextField';
import TheDesktopDatePicker from '../../../../../_shared/components/form-fields/TheDesktopDatePicker';
import { CheckBox, CheckBoxOutlineBlank, Close, Search } from '@mui/icons-material';
import { useLazyQuery, useQuery } from '@apollo/client';
import { GET_JOB_POSITIONS } from '../../../../../_shared/graphql/queries/JobPositionQueries';
import TheAutocomplete from '../../../../../_shared/components/form-fields/TheAutocomplete';

const Item = styled(Stack)(({ theme }) => ({
    backgroundColor: theme.palette.mode === 'dark' ? '#1A2027' : '#fff',
    ...theme.typography.body2,
    padding: theme.spacing(2),
    textAlign: 'center',
    color: theme.palette.text.secondary,
  }));

const JobCandidateInformationSheetFilter = ({ onFilterChange }) => {
  const [filterValues, setFilterValues] = useState({
    startingDateTime: null,
    endingDateTime: null,
    keyword: '',
    jobPositions: null,
  });


  const [selectedJobPositions, setFilterSelectedJobPositions] = useState([])

  const handleFilterSubmit = () => {
    // Pass the filter values to the parent component for handling the filtering logic
    onFilterChange(filterValues);
  };

  const handleFilterClear = () => {
    // Pass the filter values to the parent component for handling the filtering logic
    const filterValuesInit = { 
                            startingDateTime: null, endingDateTime: null, keyword: '', 
                            jobPositions: null
                          }
    setFilterSelectedJobPositions([])
    setFilterValues(filterValuesInit)
    onFilterChange(filterValuesInit);
  };

  const [getJobPositions, {
    loading: loadingJobPositions,
    data: jobPositionsData,
    error: jobPositionsError,
    fetchMore: fetchMoreJobPositions,
  }] = useLazyQuery(GET_JOB_POSITIONS, { variables: { jobPositionFilter : null, page: 1, limit: 10 } });

  const onGetJobPositions = (keyword)=>{
    getJobPositions({ variables: { jobPositionFilter : keyword === '' ? null : {keyword}, page: 1, limit: 10 } })
  }
  
  return (
    <Grid container spacing={2}>
        <Grid item xs={12} sm={6} md={2}>
            <Item>
                <TheDesktopDatePicker
                    label="De"
                    type="date"
                    name="startingDateTime"
                    value={filterValues.startingDateTime}
                    onChange={(e) => {
                      setFilterValues({ ...filterValues, startingDateTime: e })
                      onFilterChange({ ...filterValues, startingDateTime: e })
                    }}
                />
            </Item>
        </Grid>
        <Grid item xs={12} sm={6} md={2}>
            <Item>
                <TheDesktopDatePicker
                    label="À"
                    type="date"
                    name="endingDateTime"
                    value={filterValues.endingDateTime}
                    onChange={(e) => {
                      setFilterValues({ ...filterValues, endingDateTime: e })
                      onFilterChange({ ...filterValues, endingDateTime: e })
                    }}
                />
            </Item>
        </Grid>
        <Grid item xs={12} md={4}>
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
        <Grid item xs={12} sm={6} md={4}>
            <Item>
                <TheAutocomplete
                        options={jobPositionsData?.jobPositions?.nodes}
                        onInput={(e) => {
                          onGetJobPositions(e.target.value)
                        }}
                        onFocus={(e) => {
                          onGetJobPositions(e.target.value)
                        }}
                        label="Fiche besoin"
                        limitTags={3}
                        value={selectedJobPositions}
                        onChange={(event, newValue) => {
                          setFilterSelectedJobPositions(newValue)
                          setFilterValues({ ...filterValues, jobPositions: newValue.map((v) => v.id) })
                          onFilterChange({ ...filterValues, jobPositions: newValue.map((v) => v.id) })
                        }}
                      />
            </Item>
        </Grid>
    </Grid>
  );
};

export default JobCandidateInformationSheetFilter;