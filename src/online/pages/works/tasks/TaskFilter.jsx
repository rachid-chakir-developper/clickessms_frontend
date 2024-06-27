import React, { useEffect, useState } from 'react';
import {
  TextField,
  Button,
  Grid,
  Stack,
  Checkbox,
  Autocomplete,
  IconButton,
  Typography
} from '@mui/material';
import styled from '@emotion/styled';
import dayjs from 'dayjs';

import TheTextField from '../../../../_shared/components/form-fields/TheTextField';
import TheDesktopDatePicker from '../../../../_shared/components/form-fields/TheDesktopDatePicker';
import { STATUS } from '../../../../_shared/tools/constants';
import { CheckBox, CheckBoxOutlineBlank, Close } from '@mui/icons-material';
import { getFormatDate, getStatusColor } from '../../../../_shared/tools/functions';

const Item = styled(Stack)(({ theme }) => ({
    backgroundColor: theme.palette.mode === 'dark' ? '#1A2027' : '#fff',
    ...theme.typography.body2,
    padding: theme.spacing(2),
    textAlign: 'center',
    color: theme.palette.text.secondary,
  }));

const TaskFilter = ({ onFilterChange }) => {
  const [filterValues, setFilterValues] = useState({
    startingDateTime: null,
    endingDateTime: null,
    keyword: '',
    statuses: null
  });


  const [selectedStatuses, setFilterSelectedStatuses] = useState([])

  const handleFilterSubmit = () => {
    // Pass the filter values to the parent component for handling the filtering logic
    onFilterChange(filterValues);
  };

  const handleFilterClear = () => {
    // Pass the filter values to the parent component for handling the filtering logic
    const filterValuesInit = { startingDateTime: null, endingDateTime: null, keyword: '', statuses: null}
    setFilterSelectedStatuses([])
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
      onFilterChange({ keyword : filterValues.keyword, startingDateTime, endingDateTime  });
    }else{
      setFilterValues({ ...filterValues, startingDateTime: null, endingDateTime: null  })
      onFilterChange({ keyword : filterValues.keyword, startingDateTime: null, endingDateTime: null  });
    }
  };

  
  return (
    <Grid container spacing={2}>
        <Grid item="true" xs={12} md={12}>
            <Typography component="div" variant="h5">
                {filterValues?.startingDateTime ? `Les intérventions de ${filterValues?.startingDateTime.format('DD/MM/YYYY')} ` : 'Toutes les intérventions'}
            </Typography>
        </Grid>
        <Grid item="true" xs={12} md={4}>
            <Item>
                <TheTextField variant="outlined"
                    label="Recherche"
                    placeholder="Recherche..."
                    name="keyword"
                    value={filterValues.keyword}
                    onChange={(e) => {setFilterValues({ ...filterValues, keyword: e.target.value }); onFilterChange({ ...filterValues, keyword: e.target.value });}}
                />
            </Item>
        </Grid>
        <Grid item="true" xs={12} sm={6} md={3}>
            <Item>
                <TheDesktopDatePicker
                    type="date"
                    name="startingDateTime"
                    value={filterValues.startingDateTime}
                    onChange={(e) => handleDateChange(e)}
                />
            </Item>
        </Grid>
        {/* <Grid item="true" xs={12} sm={6} md={2}>
            <Item>
                <TheDesktopDatePicker
                    label="À"
                    name="endingDateTime"
                    value={filterValues.endingDateTime}
                    onChange={(e) => setFilterValues({ ...filterValues, endingDateTime: e })}
                />
            </Item>
        </Grid> */}
        <Grid item="true" xs={12} sm={6} md={3}>
            <Item>
                <Autocomplete
                    multiple
                    id="checkboxes-tags-demo"
                    options={STATUS?.ALL}
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
                    }}
                    renderInput={(params) => (
                        <TextField {...params} label="Etats" placeholder="Etats" />
                    )}
                />
            </Item>
        </Grid>
        <Grid item="true" xs={12} md={2} sx={{ display : 'flex', alignItems : 'center'}}>
            <Item  sx={{height: '100%', justifyContent: 'center'}}>
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

export default TaskFilter;