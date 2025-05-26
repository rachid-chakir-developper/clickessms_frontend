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
import { useLazyQuery, useQuery } from '@apollo/client';
import TheAutocomplete from '../../../../_shared/components/form-fields/TheAutocomplete';
import { ACTION_STATUS } from '../../../../_shared/tools/constants';
import { getStatusColor } from '../../../../_shared/tools/functions';
import { useAuthorizationSystem } from '../../../../_shared/context/AuthorizationSystemProvider';
import { GET_EMPLOYEES } from '../../../../_shared/graphql/queries/EmployeeQueries';

const Item = styled(Stack)(({ theme }) => ({
    backgroundColor: theme.palette.mode === 'dark' ? '#1A2027' : '#fff',
    ...theme.typography.body2,
    padding: theme.spacing(0),
    textAlign: 'center',
    color: theme.palette.text.secondary,
  }));

const TaskActionFilter = ({ onFilterChange }) => {
  
  const LIST_TYPES_ITEMS = {
    ALL : 'ALL',
    TASK_ACTION_RECEIVED : 'TASK_ACTION_RECEIVED',
    TASK_ACTION_GIVEN : 'TASK_ACTION_GIVEN',
    TASK_ACTION_ARCHIVED : 'TASK_ACTION_ARCHIVED',
    ALL_: [
      {value: 'ALL', label: 'Tous', hidden: false},
      {value: 'TASK_ACTION_RECEIVED', label: 'Actions reçues', hidden: false},
      {value: 'TASK_ACTION_GIVEN', label: 'Actions données', hidden: false},
      {value: 'TASK_ACTION_ARCHIVED', label: 'Archivées', hidden: false},
    ]
  }

  const [filterValues, setFilterValues] = useState({
    startingDateTime: null,
    endingDateTime: null,
    keyword: '',
    employees: null,
    statuses: null,
    listType: 'ALL'
  });

  const [selectedStatuses, setFilterSelectedStatuses] = useState([])
  const [selectedEmployees, setFilterSelectedEmployees] = useState([])

  const handleFilterSubmit = () => {
    // Pass the filter values to the parent component for handling the filtering logic
    onFilterChange(filterValues);
  };

  const handleFilterClear = () => {
    // Pass the filter values to the parent component for handling the filtering logic
    const filterValuesInit = { 
                            startingDateTime: null, endingDateTime: null, keyword: '', 
                            employees: null, statuses: null
                          }
    setFilterSelectedStatuses([])
    setFilterSelectedEmployees([])
    setFilterValues(filterValuesInit)
    onFilterChange(filterValuesInit);
  };

  const [getEmployees, {
    loading: loadingEmployees,
    data: employeesData,
    error: employeesError,
    fetchMore: fetchMoreEmployees,
  }] = useLazyQuery(GET_EMPLOYEES, { variables: { employeeFilter : null, page: 1, limit: 10 } });
  
  const onGetEmployees = (keyword)=>{
    getEmployees({ variables: { employeeFilter : keyword === '' ? null : {keyword}, page: 1, limit: 10 } })
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
                        options={employeesData?.employees?.nodes}
                        onInput={(e) => {
                          onGetEmployees(e.target.value)
                        }}
                        label="Employés"
                        limitTags={3}
                        value={selectedEmployees}
                        onChange={(event, newValue) => {
                            setFilterSelectedEmployees(newValue)
                            setFilterValues({ ...filterValues, employees: newValue.map((v) => v.id) })
                            onFilterChange({ ...filterValues, employees: newValue.map((v) => v.id) })
                        }}
                      />
            </Item>
        </Grid>
        <Grid item xs={12} sm={6} md={2}>
            <Item>
                <Autocomplete
                    multiple
                    id="checkboxes-tags-demo"
                    options={ACTION_STATUS?.ALL}
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

export default TaskActionFilter;