import React from 'react';
import PropTypes from 'prop-types';
import { Grid, TextField, MenuItem, Box, Button } from '@mui/material';
import { useQuery } from '@apollo/client';
import { GET_EMPLOYEES } from '../../../../_shared/graphql/queries/EmployeeQueries';
import Autocomplete from '@mui/material/Autocomplete';

/**
 * Composant de filtre pour la liste des acomptes
 */
export default function TableFilterAdvance({ filterValues, setFilterValues }) {
  // Requête pour récupérer la liste des employés pour le filtre
  const { data } = useQuery(GET_EMPLOYEES);
  const employees = data?.employeesForSelect || [];

  // Gestion des changements de filtres
  const handleFilterChange = (event) => {
    const { name, value } = event.target;
    setFilterValues({
      ...filterValues,
      [name]: value,
    });
  };

  // Gestion du changement d'employé
  const handleEmployeeChange = (_, newValue) => {
    setFilterValues({
      ...filterValues,
      employee_id: newValue ? newValue.id : null,
    });
  };

  // Réinitialisation des filtres
  const handleResetFilters = () => {
    setFilterValues({
      keyword: '',
      status: '',
      employee_id: null,
    });
  };

  return (
    <Box component="form" noValidate autoComplete="off">
      <Grid container spacing={2}>
        <Grid item xs={12} md={3}>
          <TextField
            fullWidth
            label="Recherche"
            name="keyword"
            value={filterValues.keyword}
            onChange={handleFilterChange}
            placeholder="Numéro, commentaire..."
            size="small"
          />
        </Grid>
        <Grid item xs={12} md={3}>
          <TextField
            fullWidth
            select
            label="Statut"
            name="status"
            value={filterValues.status}
            onChange={handleFilterChange}
            size="small"
          >
            <MenuItem value="">Tous</MenuItem>
            <MenuItem value="PENDING">En attente</MenuItem>
            <MenuItem value="APPROVED">Approuvé</MenuItem>
            <MenuItem value="REJECTED">Rejeté</MenuItem>
            <MenuItem value="MODIFIED">Modifié</MenuItem>
          </TextField>
        </Grid>
        <Grid item xs={12} md={4}>
          <Autocomplete
            options={employees}
            getOptionLabel={(option) => `${option.firstName} ${option.lastName}`}
            value={employees.find(emp => emp.id === filterValues.employee_id) || null}
            onChange={handleEmployeeChange}
            renderInput={(params) => (
              <TextField
                {...params}
                label="Employé"
                size="small"
                fullWidth
              />
            )}
          />
        </Grid>
        <Grid item xs={12} md={2}>
          <Button
            variant="outlined"
            onClick={handleResetFilters}
            fullWidth
          >
            Réinitialiser
          </Button>
        </Grid>
      </Grid>
    </Box>
  );
}

TableFilterAdvance.propTypes = {
  filterValues: PropTypes.shape({
    keyword: PropTypes.string,
    status: PropTypes.string,
    employee_id: PropTypes.string,
  }).isRequired,
  setFilterValues: PropTypes.func.isRequired,
}; 