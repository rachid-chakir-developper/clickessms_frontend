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
import { GET_ESTABLISHMENTS } from '../../../../_shared/graphql/queries/EstablishmentQueries';
import TheAutocomplete from '../../../../_shared/components/form-fields/TheAutocomplete';
import { INVOICE_STATUS } from '../../../../_shared/tools/constants';
import { getInvoiceStatusColor } from '../../../../_shared/tools/functions';

const Item = styled(Stack)(({ theme }) => ({
    backgroundColor: theme.palette.mode === 'dark' ? '#1A2027' : '#fff',
    ...theme.typography.body2,
    padding: theme.spacing(0),
    textAlign: 'center',
    color: theme.palette.text.secondary,
  }));

const InvoiceFilter = ({ onFilterChange }) => {


  const [filterValues, setFilterValues] = useState({
    startingDateTime: null,
    endingDateTime: null,
    keyword: '',
    establishments: null,
    statuses: null,
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

  const [getEstablishments, {
          loading: loadingEstablishments,
          data: establishmentsData,
          error: establishmentsError,
          fetchMore: fetchMoreEstablishments,
        }] = useLazyQuery(GET_ESTABLISHMENTS, { variables: { beneficiaryFilter : null, page: 1, limit: 30 } });
      
        const onGetEstablishments = (keyword)=>{
          getEstablishments({ variables: { beneficiaryFilter : keyword === '' ? null : {keyword}, page: 1, limit: 30 } })
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
                        options={establishmentsData?.establishments?.nodes}
                        onInput={(e) => {
                          onGetEstablishments(e.target.value)
                        }}
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
                    options={INVOICE_STATUS?.ALL}
                    disableCloseOnSelect
                    value={selectedStatuses}
                    getOptionLabel={(option) => option.label}
                    renderOption={(props, option, { selected }) => (
                        <li {...props}>
                            <Checkbox
                                icon={<CheckBoxOutlineBlank sx={{ color : getInvoiceStatusColor(option?.value)}} fontSize="small" />}
                                checkedIcon={<CheckBox sx={{ color : getInvoiceStatusColor(option?.value)}} fontSize="small" />}
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
    </Grid>
  );
};

export default InvoiceFilter;