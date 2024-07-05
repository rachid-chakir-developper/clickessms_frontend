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
import { STATUS } from '../../../../_shared/tools/constants';
import { CheckBox, CheckBoxOutlineBlank, Close, Search } from '@mui/icons-material';
import { getFormatDate, getStatusColor } from '../../../../_shared/tools/functions';
import { GET_DATAS_ESTABLISHMENT } from '../../../../_shared/graphql/queries/DataQueries';
import { useQuery } from '@apollo/client';

const Item = styled(Stack)(({ theme }) => ({
    backgroundColor: theme.palette.mode === 'dark' ? '#1A2027' : '#fff',
    ...theme.typography.body2,
    padding: theme.spacing(2),
    textAlign: 'center',
    color: theme.palette.text.secondary,
  }));

const EstablishmentFilter = ({ onFilterChange }) => {
  const [filterValues, setFilterValues] = useState({
    startingDateTime: null,
    endingDateTime: null,
    keyword: '',
    establishmentCategories: null,
    establishmentTypes: null,
  });


  const [selectedEstablishmentCategories, setFilterSelectedEstablishmentCategories] = useState([])
  const [selectedEstablishmentTypes, setFilterSelectedEstablishmentTypes] = useState([])

  const handleFilterSubmit = () => {
    // Pass the filter values to the parent component for handling the filtering logic
    onFilterChange(filterValues);
  };

  const handleFilterClear = () => {
    // Pass the filter values to the parent component for handling the filtering logic
    const filterValuesInit = { 
                            startingDateTime: null, endingDateTime: null, keyword: '', 
                            establishmentCategories: null,
                            establishmentTypes: null
                          }
    setFilterSelectedEstablishmentCategories([])
    setFilterSelectedEstablishmentTypes([])
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
    loading: loadingDatas,
    data: dataData,
    error: datsError,
    fetchMore: fetchMoreDatas,
  } = useQuery(GET_DATAS_ESTABLISHMENT, { fetchPolicy: 'network-only' });


  
  return (
    <Grid container spacing={2}>
        <Grid item xs={12} md={12}>
            <Typography component="div" variant="h5">
              Les structures
            </Typography>
        </Grid>
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
        {/* <Grid item xs={12} sm={6} md={2}>
            <Item>
                <TheDesktopDatePicker
                    type="date"
                    name="startingDateTime"
                    value={filterValues.startingDateTime}
                    onChange={(e) => handleDateChange(e)}
                />
            </Item>
        </Grid> */}
        <Grid item xs={12} sm={6} md={3}>
            <Item>
                <Autocomplete
                    multiple
                    id="checkboxes-tags-demo"
                    options={dataData?.establishmentCategories || []}
                    disableCloseOnSelect
                    value={selectedEstablishmentCategories}
                    getOptionLabel={(option) => option.name}
                    renderOption={(props, option, { selected }) => (
                        <li {...props}>
                            <Checkbox
                                icon={<CheckBoxOutlineBlank fontSize="small" />}
                                checkedIcon={<CheckBox fontSize="small" />}
                                style={{ marginRight: 8}}
                                checked={selected}
                            />
                            {option.name}
                        </li>
                    )}
                    onChange={(event, newValue) => {
                        setFilterSelectedEstablishmentCategories(newValue)
                        setFilterValues({ ...filterValues, establishmentCategories: newValue.map((v) => v.id) })
                    }}
                    renderInput={(params) => (
                        <TextField {...params} label="Categories" placeholder="Categories" />
                    )}
                />
            </Item>
        </Grid>
        <Grid item xs={12} sm={6} md={3}>
            <Item>
                <Autocomplete
                    multiple
                    id="checkboxes-tags-demo"
                    options={dataData?.establishmentTypes || []}
                    disableCloseOnSelect
                    value={selectedEstablishmentTypes}
                    getOptionLabel={(option) => option.name}
                    renderOption={(props, option, { selected }) => (
                        <li {...props}>
                            <Checkbox
                                icon={<CheckBoxOutlineBlank fontSize="small" />}
                                checkedIcon={<CheckBox fontSize="small" />}
                                style={{ marginRight: 8}}
                                checked={selected}
                            />
                            {option.name}
                        </li>
                    )}
                    onChange={(event, newValue) => {
                        setFilterSelectedEstablishmentTypes(newValue)
                        setFilterValues({ ...filterValues, establishmentTypes: newValue.map((v) => v.id) })
                    }}
                    renderInput={(params) => (
                        <TextField {...params} label="Types" placeholder="Types" />
                    )}
                />
            </Item>
        </Grid>
    </Grid>
  );
};

export default EstablishmentFilter;