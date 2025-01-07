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

const DashboardFilter = ({ onFilterChange, isDisplayMonth=false }) => {
  const [filterValues, setFilterValues] = useState({
    year: null,
    month: null,
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
                            year: null, month: null, keyword: '', 
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
        <Grid item xs={12} sm={2} md={2}>
          <Item>
              <TheDesktopDatePicker
                  label="Année"
                  type="date"
                  name="year"
                  openTo="year"
                  views={['year']}
                  format="YYYY"
                  value={filterValues.year}
                  onChange={(e) => {
                    setFilterValues({ ...filterValues, year: e })
                    onFilterChange({ ...filterValues, year: e })
                  }}
              />
          </Item>
        </Grid>
        {isDisplayMonth && <Grid item xs={12} sm={2} md={2}>
          <Item>
              <TheDesktopDatePicker
                  label="Mois"
                  type="date"
                  name="month"
                  openTo="month"
                  views={['month']}
                  format="MMMM"
                  value={filterValues.month}
                  onChange={(e) => {
                    setFilterValues({ ...filterValues, month: e })
                    onFilterChange({ ...filterValues, month: e })
                  }}
              />
          </Item>
        </Grid>}
        <Grid item xs={12} sm={isDisplayMonth ? 8 : 10} md={isDisplayMonth ? 8 : 10}>
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