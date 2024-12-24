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
  InputAdornment,
  FormControl,
  RadioGroup,
  FormControlLabel,
  Radio
} from '@mui/material';
import styled from '@emotion/styled';
import dayjs from 'dayjs';

import TheTextField from '../../../../_shared/components/form-fields/TheTextField';
import TheDesktopDatePicker from '../../../../_shared/components/form-fields/TheDesktopDatePicker';
import { CheckBox, CheckBoxOutlineBlank, Close, Search } from '@mui/icons-material';
import { useQuery } from '@apollo/client';
import { GET_ESTABLISHMENTS } from '../../../../_shared/graphql/queries/EstablishmentQueries';
import TheAutocomplete from '../../../../_shared/components/form-fields/TheAutocomplete';
import { EXPENSE_REPORT_STATUS_CHOICES } from '../../../../_shared/tools/constants';
import { getStatusColor } from '../../../../_shared/tools/functions';
import { useAuthorizationSystem } from '../../../../_shared/context/AuthorizationSystemProvider';

const Item = styled(Stack)(({ theme }) => ({
    backgroundColor: theme.palette.mode === 'dark' ? '#1A2027' : '#fff',
    ...theme.typography.body2,
    padding: theme.spacing(0),
    textAlign: 'center',
    color: theme.palette.text.secondary,
  }));

const ExpenseReportFilter = ({ onFilterChange }) => {
  
  const authorizationSystem = useAuthorizationSystem();
  const canManageFinance = authorizationSystem.requestAuthorization({
    type: 'manageFinance',
  }).authorized;

  const LIST_TYPES_ITEMS = {
    MY_EXPENSE_REPORTS : 'MY_EXPENSE_REPORTS',
    MY_EXPENSE_REPORT_REQUESTS : 'MY_EXPENSE_REPORT_REQUESTS',
    ALL : 'ALL',
    ALL_: [
      {value: 'ALL', label: 'Tous', hidden: false},
      {value: 'MY_EXPENSE_REPORTS', label: 'Mes notes de frais', hidden: false},
      {value: 'MY_EXPENSE_REPORT_REQUESTS', label: 'Mes demandes', hidden: true},
    ]
  }

  const [filterValues, setFilterValues] = useState({
    startingDateTime: null,
    endingDateTime: null,
    keyword: '',
    establishments: null,
    statuses: null,
    listType: 'ALL'
  });

  const [selectedStatuses, setFilterSelectedStatuses] = useState([])
  const [selectedEstablishments, setFilterSelectedEstablishments] = useState([])

  const handleFilterSubmit = () => {
    // Pass the filter values to the parent component for handling the filtering logic
    onFilterChange(filterValues);
  };

  const handleFilterClear = () => {
    // Pass the filter values to the parent component for handling the filtering logic
    const filterValuesInit = { 
                            startingDateTime: null, endingDateTime: null, keyword: '', 
                            establishments: null, statuses: null
                          }
    setFilterSelectedStatuses([])
    setFilterSelectedEstablishments([])
    setFilterValues(filterValuesInit)
    onFilterChange(filterValuesInit);
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
        <Grid item xs={12} md={3}>
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
                <TheAutocomplete
                        options={establishmentsData?.establishments?.nodes}
                        label="Structures"
                        limitTags={3}
                        value={selectedEstablishments}
                        onChange={(event, newValue) => {
                            setFilterSelectedEstablishments(newValue)
                            setFilterValues({ ...filterValues, establishments: newValue.map((v) => v.id) })
                            onFilterChange({ ...filterValues, establishments: newValue.map((v) => v.id) })
                        }}
                      />
            </Item>
        </Grid>
        <Grid item xs={12} sm={6} md={2}>
            <Item>
                <Autocomplete
                    multiple
                    id="checkboxes-tags-demo"
                    options={EXPENSE_REPORT_STATUS_CHOICES?.ALL}
                    disableCloseOnSelect
                    value={selectedStatuses}
                    getOptionLabel={(option) => option.label}
                    renderOption={(props, option, { selected }) => (
                        <li {...props}>
                            <Checkbox
                                icon={<CheckBoxOutlineBlank sx={{ color : getStatusColor(option?.value)}} fontSize="small" />}
                                checkedIcon={<CheckBox sx={{ color : getStatusColor(option?.value)}} fontSize="small" />}
                                style={{ marginRight: 8}}
                                checked={selected}
                            />
                            {option.label}
                        </li>
                    )}
                    onChange={(event, newValue) => {
                        setFilterSelectedStatuses(newValue)
                        setFilterValues({ ...filterValues, statuses: newValue.map((v) => v.value) })
                        onFilterChange({ ...filterValues, statuses: newValue.map((v) => v.value) })
                    }}
                    renderInput={(params) => (
                        <TextField {...params} label="Etats" placeholder="Etats" />
                    )}
                />
            </Item>
        </Grid>
        <Grid item xs={12} sm={12} md={12}>
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
        </Grid>
    </Grid>
  );
};

export default ExpenseReportFilter;