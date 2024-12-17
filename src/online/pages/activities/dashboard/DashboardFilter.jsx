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
  Tooltip
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

const DashboardFilter = ({ onFilterChange }) => {
  const [filterValues, setFilterValues] = useState({
    startingDateTime: null,
    endingDateTime: null,
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
        <Grid item xs={12} sm={6} md={8}>
          <Item sx={{position: 'relative'}}>
            <TheAutocomplete
              options={establishmentsData?.establishments?.nodes}
              label="Structures"
              limitTags={5}
              value={selectedEstablishments}
              onChange={(event, newValue) => {
                  setFilterSelectedEstablishments(newValue)
                  setFilterValues({ ...filterValues, establishments: newValue.map((v) => v.id) })
                  onFilterChange({ ...filterValues, establishments: newValue.map((v) => v.id) })
              }}
            />
            <Tooltip title="Initialiser la recherche">
              <IconButton onClick={handleFilterClear}  sx={{position: 'absolute', top: 20, right: -20}}>
                <Close />
              </IconButton>
            </Tooltip>
          </Item>
        </Grid>
    </Grid>
  );
};

export default DashboardFilter;