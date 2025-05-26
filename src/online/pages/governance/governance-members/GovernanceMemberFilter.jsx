import React, { useState } from 'react';
import {
  TextField,
  Grid,
  Stack,
  Checkbox,
  Autocomplete,
  IconButton,
  InputAdornment,
  FormControlLabel,
  Radio,
  FormControl,
  RadioGroup,
} from '@mui/material';
import styled from '@emotion/styled';

import TheTextField from '../../../../_shared/components/form-fields/TheTextField';
import TheDesktopDatePicker from '../../../../_shared/components/form-fields/TheDesktopDatePicker';
import {  Close, Search } from '@mui/icons-material';
import { useAuthorizationSystem } from '../../../../_shared/context/AuthorizationSystemProvider';

const Item = styled(Stack)(({ theme }) => ({
    backgroundColor: theme.palette.mode === 'dark' ? '#1A2027' : '#fff',
    ...theme.typography.body2,
    padding: theme.spacing(0),
    textAlign: 'center',
    color: theme.palette.text.secondary,
  }));

const GovernanceMemberFilter = ({ onFilterChange }) => {
  const authorizationSystem = useAuthorizationSystem();
  const canManageGovernance = authorizationSystem.requestAuthorization({
    type: 'manageGovernance',
  }).authorized;

  const LIST_TYPES_ITEMS = {
    ALL : 'ALL',
    GOVERNANCE_MEMBER_ARCHIVED : 'GOVERNANCE_MEMBER_ARCHIVED',
    ALL_: [
      {value: 'ALL', label: 'Tous', hidden: false},
      {value: 'GOVERNANCE_MEMBER_ARCHIVED', label: 'Archivées', hidden: !canManageGovernance},
    ]
  }

  const [filterValues, setFilterValues] = useState({
    startingDateTime: null,
    endingDateTime: null,
    keyword: '',
    listType: 'ALL'
  });

  const handleFilterSubmit = () => {
    // Pass the filter values to the parent component for handling the filtering logic
    onFilterChange(filterValues);
  };

  const handleFilterClear = () => {
    // Pass the filter values to the parent component for handling the filtering logic
    const filterValuesInit = { 
                            startingDateTime: null, endingDateTime: null, keyword: '',
                          }
    setFilterValues(filterValuesInit)
    onFilterChange(filterValuesInit);
  };



  
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
        <Grid item xs={12} md={8}>
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
        {canManageGovernance && <Grid item xs={12} sm={12} md={12}>
          <Item>
            <FormControl>
              <RadioGroup
                row
                aria-labelledby="demo-row-radio-buttons-group-label"
                name="row-radio-buttons-group"
                value={filterValues.listType}
                onChange={(e) =>{
                    setFilterValues({ ...filterValues, listType: e.target.value });
                    onFilterChange({ ...filterValues, listType: e.target.value });
                  }
                }
              >
                {LIST_TYPES_ITEMS?.ALL_?.map((item, index) => {
                  return (
                      !item.hidden && <FormControlLabel key={index} value={item.value} control={<Radio />} label={item.label} />
                    
                  );
                })}
              </RadioGroup>
            </FormControl>
          </Item>
        </Grid>}
    </Grid>
  );
};

export default GovernanceMemberFilter;