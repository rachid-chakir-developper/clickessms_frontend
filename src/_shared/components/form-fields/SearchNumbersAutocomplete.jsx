import React from 'react';
import { useLazyQuery } from '@apollo/client';
import { TextField, Autocomplete, Box, Avatar, Chip } from '@mui/material';
import CircularProgress from '@mui/material/CircularProgress';
import { GET_SEARCH_NUMBERS } from '../../graphql/queries/SearchQueries';

export default function SearchNumbersAutocomplete(props) {
  const [getSearchResults, { loading, data }] =
    useLazyQuery(GET_SEARCH_NUMBERS);

  const handleSearch = (event, value) => {
    if (value != '') {
      getSearchResults({
        variables: {
          searchFilter: { query: value },
          offset: 0,
          limit: 10,
          page: 1,
        },
      });
    }
  };

  // Formater les données pour les options de l'autocomplétion
  const formatOptions = () => {
    let options = [];

    if (data && data.searchNumbers && data.searchNumbers.results) {
      const {
        employees,
        clients,
        suppliers,
        beneficiaries,
        partners,
        establishments,
        phoneNumbers,
      } = data.searchNumbers.results;

      if (employees && employees.nodes) {
        options = options.concat(
          employees.nodes.map((item) => ({
            caller: item,
            callerType: 'Employee',
            typeLabel: 'Employés',
          })),
        );
      }

      if (beneficiaries && beneficiaries.nodes) {
        options = options.concat(
          beneficiaries.nodes.map((item) => ({
            caller: item,
            callerType: 'Beneficiary',
            typeLabel: 'Beneficiaires',
          })),
        );
      }

      if (clients && clients.nodes) {
        options = options.concat(
          clients.nodes.map((item) => ({
            caller: item,
            callerType: 'Client',
            typeLabel: 'Clients',
          })),
        );
      }

      if (suppliers && suppliers.nodes) {
        options = options.concat(
          suppliers.nodes.map((item) => ({
            caller: item,
            callerType: 'Supplier',
            typeLabel: 'Fourniseurs',
          })),
        );
      }

      if (partners && partners.nodes) {
        options = options.concat(
          partners.nodes.map((item) => ({
            caller: item,
            callerType: 'Partner',
            typeLabel: 'Partenaires',
          })),
        );
      }

      if (establishments && establishments.nodes) {
        options = options.concat(
          establishments.nodes.map((item) => ({
            caller: item,
            callerType: 'Establishment',
            typeLabel: 'Structures',
          })),
        );
      }

      if (phoneNumbers && phoneNumbers.nodes) {
        options = options.concat(
          phoneNumbers.nodes.map((item) => ({
            caller: item,
            callerType: 'PhoneNumber',
            typeLabel: 'Autres',
          })),
        );
      }
    }

    return options;
  };

  return (
    <Autocomplete
      id="search-autocomplete"
      fullWidth
      freeSolo
      noOptionsText="Pas de résultat"
      options={formatOptions()}
      filterSelectedOptions
      value={props?.value}
      onChange={props?.onChange}
      groupBy={(option) => option.typeLabel}
      getOptionLabel={(option) => {
        if (typeof option === 'string') {
          return option;
        }
        return `${option?.caller?.name ? `${option?.caller?.name}` : `${option?.caller?.firstName} ${option?.caller?.lastName}`} ${option?.caller?.phone || ''} ${option?.caller?.fix || ''} ${option?.caller?.mobile || ''}`;
      }}
      renderOption={(props, option, { selected }) => {
        if (typeof option === 'string') {
          return (
            <Box
              component="li"
              sx={{ '& > *': { mr: 2, flexShrink: 0 } }}
              {...props}
            >
              <Box>{option}</Box>
            </Box>
          );
        } else
          return (
            <Box
              component="li"
              sx={{ '& > *': { mr: 2, flexShrink: 0 } }}
              {...props}
            >
              <Avatar
                alt={
                  option?.caller?.name
                    ? `${option?.caller?.name}`
                    : `${option?.caller?.firstName} ${option?.caller?.lastName}`
                }
                src={
                  option?.caller?.photo
                    ? option?.caller?.photo
                    : option?.caller?.image
                }
              />
              <Box>
                {option?.caller?.name
                  ? `${option?.caller?.name}`
                  : `${option?.caller?.firstName} ${option?.caller?.lastName}`}
                <br />
                {option?.caller?.fix && option?.caller?.fix != '' && (
                  <em>{option?.caller?.fix} </em>
                )}
                {option?.caller?.fix &&
                  option?.caller?.fix != '' &&
                  option?.caller?.mobile &&
                  option?.caller?.mobile != '' && <>|</>}
                {option?.caller?.mobile && option?.caller?.mobile != '' && (
                  <em> {option?.caller?.mobile}</em>
                )}
                {((option?.caller?.fix && option?.caller?.fix != '') ||
                  (option?.caller?.mobile && option?.caller?.mobile != '')) && (
                  <br />
                )}
                {option?.caller?.phone && option?.caller?.phone != '' && (
                  <em> {option?.caller?.phone}</em>
                )}
                {/* <em>{option?.typeLabel}</em> */}
              </Box>
            </Box>
          );
      }}
      renderTags={(value, getTagProps) =>
        value.map((option, index) => (
          <Chip
            key={index}
            avatar={
              <Avatar
                alt={
                  option?.caller?.name
                    ? `${option?.caller?.name}`
                    : `${option?.caller?.firstName} ${option?.caller?.lastName}`
                }
                src={
                  option?.caller?.photo
                    ? option?.caller?.photo
                    : option?.caller?.image
                }
              />
            }
            label={
              option?.caller?.name
                ? `${option?.caller?.name}`
                : `${option?.caller?.firstName} ${option?.caller?.lastName}`
            }
            {...getTagProps({ index })}
          />
        ))
      }
      renderInput={(params) => (
        <TextField
          {...params}
          label={props?.label}
          placeholder={props?.placeholder}
          variant="outlined"
          onChange={handleSearch}
          onKeyDown={(event) => {
            if (event.key === 'Enter') {
              event.preventDefault(); // Empêcher la soumission par défaut du formulaire
            }
          }}
          InputProps={{
            ...params.InputProps,
            endAdornment: (
              <>
                {loading ? (
                  <CircularProgress color="inherit" size={20} />
                ) : null}
                {params.InputProps.endAdornment}
              </>
            ),
          }}
        />
      )}
    />
  );
}
