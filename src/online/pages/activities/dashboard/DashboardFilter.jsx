import React, { useState } from 'react';
import { Button, Grid, IconButton, Stack } from '@mui/material';
import styled from '@emotion/styled';
import TheDesktopDatePicker from '../../../../_shared/components/form-fields/TheDesktopDatePicker';
import { Close } from '@mui/icons-material';
import { GET_ESTABLISHMENTS } from '../../../../_shared/graphql/queries/EstablishmentQueries';
import { useQuery } from '@apollo/client';
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
  });

  const handleFilterSubmit = () => {
    // Pass the filter values to the parent component for handling the filtering logic
    onFilterChange(filterValues);
  };

  const handleFilterClear = () => {
    // Pass the filter values to the parent component for handling the filtering logic
    const filterValuesInit = {
      startingDateTime: null,
      endingDateTime: null,
      establishments: []
    };
    setFilterValues(filterValuesInit);
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
    <Grid container spacing={2} alignItems="center">
        <Grid item="true" xs={2} sm={6} md={6}>
            <Item>
                <TheAutocomplete
                    options={establishmentsData?.establishments?.nodes}
                    label="Structures filles"
                    placeholder="Choisissez des structures"
                    // value={formik.values.establishmentChilds}
                    // onChange={(e, newValue) =>
                    //     formik.setFieldValue('establishmentChilds', newValue)
                    // }
                />
            </Item>
        </Grid>
        <Grid item="true" xs={12} sm={6} md={2}>
            <Item>
            <TheDesktopDatePicker
                label="De"
                type="date"
                name="startingDateTime"
                value={filterValues.startingDateTime}
                onChange={(e) =>
                setFilterValues({ ...filterValues, startingDateTime: e })
                }
            />
            </Item>
      </Grid>
      <Grid item="true" xs={12} sm={6} md={2}>
        <Item>
          <TheDesktopDatePicker
            label="À"
            name="endingDateTime"
            value={filterValues.endingDateTime}
            onChange={(e) =>
              setFilterValues({ ...filterValues, endingDateTime: e })
            }
          />
        </Item>
      </Grid>
      <Grid item="true" xs={12} md={2} sx={{ display: 'flex', alignItems: 'center' }}>
        <Item sx={{ height: '100%', justifyContent: 'center' }}>
          <Button variant="outlined" color="info" onClick={handleFilterSubmit}>
            Appliquer
          </Button>
        </Item>
        <IconButton color="primary" onClick={handleFilterClear}>
          <Close />
        </IconButton>
      </Grid>
    </Grid>
  );
};

export default DashboardFilter;
