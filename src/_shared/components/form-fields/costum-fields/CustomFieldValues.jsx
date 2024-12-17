import React, { useState } from 'react';
import { TextField, Checkbox, MenuItem, Grid, FormControlLabel, FormControl, InputLabel, Select, Button, styled, Stack, Typography } from '@mui/material';
import { GET_CUSTOM_FIELD_VALUES, GET_CUSTOM_FIELDS } from '../../../graphql/queries/CustomFieldQueries';
import { PUT_CUSTOM_FIELD_VALUES } from '../../../graphql/mutations/CustomFieldMutations';
import { useLazyQuery, useMutation } from '@apollo/client';
import TheDateTimePicker from '../TheDateTimePicker';
import dayjs from 'dayjs';
import TheDesktopDatePicker from '../TheDesktopDatePicker';
import { useFeedBacks } from '../../../context/feedbacks/FeedBacksProvider';

const Item = styled(Stack)(({ theme }) => ({
    backgroundColor: theme.palette.mode === 'dark' ? '#1A2027' : '#fff',
    ...theme.typography.body2,
    padding: theme.spacing(2),
    textAlign: 'center',
    color: theme.palette.text.secondary,
  }));

export default function CustomFieldValues({ formModel, idObject, disabled=false, triggerSave , onSaved}) {
    const { setNotifyAlert, setConfirmDialog } = useFeedBacks();
    const [values, setValues] = useState([]);
    const [getCustomFieldValues, 
        {
            loading: loadingFields, data: customFieldData, error: fieldError
        }] = useLazyQuery(GET_CUSTOM_FIELD_VALUES, {fetchPolicy: 'network-only'});
    const [updateCustomFieldValues] = useMutation(PUT_CUSTOM_FIELD_VALUES,
        {
          onCompleted: (data) => {
            console.log(data);
            setNotifyAlert({
              isOpen: true,
              message: 'Modifié avec succès',
              type: 'success',
            });
            onSaved(data);
          },
          update(cache, { data: { updateCustomFieldValues } }) {
            const updatedCustomFieldValues = updateCustomFieldValues.customFieldValues;
          
            cache.modify({
              fields: {
                customFieldValues(existingCustomFieldValues = [], { readField }) {
                  // Mettez à jour les valeurs du cache en remplaçant celles qui ont été modifiées
                  const updatedNodes = existingCustomFieldValues.map((customFieldValue) => {
                    const updatedValue = updatedCustomFieldValues.find(
                      (updatedCustomFieldValue) =>
                        readField('id', customFieldValue) === updatedCustomFieldValue.id,
                    );
                    return updatedValue || customFieldValue;
                  });
          
                  // Retourne le tableau mis à jour
                  return updatedNodes;
                },
              },
            });
          },
          onError: (err) => {
            console.log(err);
            setNotifyAlert({
              isOpen: true,
              message: 'Non modifié ! Veuillez réessayer.',
              type: 'error',
            });
            onSaved(null, err);
          },
        },);
    
  const onUpdateCustomFieldValues = (variables) => {
    setConfirmDialog({
      isOpen: true,
      title: 'ATTENTION',
      subTitle: 'Voulez vous vraiment modifier ?',
      onConfirm: () => {
        setConfirmDialog({ isOpen: false });
        updateCustomFieldValues({ variables });
      },
    });
  };
    const [
        getCustomFields,
        {
        loading: loadingCustomFields,
        data: customFieldsData,
        error: customFieldsError,
        },
    ] = useLazyQuery(GET_CUSTOM_FIELDS, {
        onCompleted: (data) => {
            getCustomFieldValues({ variables: { formModel, idObject } });
        },
        onError: (err) => {
          console.log(err);
        },
      });

    React.useEffect(() => {
        if (formModel && idObject) {
            getCustomFields({ variables: { customFieldFilter: { formModels: [formModel] } } });
        }
    }, [formModel, idObject]);

     // Populate fields and values when data is fetched
    React.useEffect(() => {
        if (customFieldData?.customFieldValues) {
            const fieldValues = customFieldData.customFieldValues.map(item => ({
                id: item.id,
                customField: item.customField?.id || item.customField,
                value: item.value,
            }));
            setValues(fieldValues);
        }
    }, [customFieldData]);

    // Handler to update values based on input changes
    const handleChange = (value, customField) => {
        // Vérifiez si la clé existe déjà
        const existingIndex = values.findIndex((item) => item.customField === customField);

        let newValues;
        if (existingIndex >= 0) {
        // La clé existe, mettez à jour la valeur
        newValues = values.map((item, index) => {
            if (index === existingIndex) {
            return { ...item, value }; // Met à jour la valeur pour la clé correspondante
            }
            return item; // Conserve les autres éléments
        });
        } else {
        // La clé n'existe pas, ajoutez-la au tableau avec customField
        newValues = [...values, {  value, customField }];
        }
        setValues(newValues);
    };

     // Save updated values to the server
     const handleSave = () => {
        onUpdateCustomFieldValues({
                formModel,
                idObject,
                customFieldValuesData: values,
            },
        );
    };
    React.useEffect(() => {
        if (triggerSave) {
            handleSave();
        }
    }, [triggerSave]);

    // Gérer l'état de chargement et d'erreur
    if (loadingFields || loadingCustomFields) return <Typography sx={{fontStyle: 'italic'}}>Chargement des champs personnalisés...</Typography>;
    if (fieldError || customFieldsError) return <Typography variant="body2" color="error">Erreur de chargement des champs personnalisés.</Typography>;

    return (
        <>
            <Grid container spacing={{ xs: 2, md: 3 }}>
                {customFieldsData?.customFields?.nodes?.map((field, index) => {
                    const { fieldType, label, key, id: customField, options } = field;
                    const currentValue = values.find((item) => item.customField === customField)?.value || ''; // Récupère la valeur actuelle
                    switch (fieldType) {
                    case 'TEXT':
                        return (
                        <Grid item xs={12} sm={6} md={4} key={index}>
                            <Item>
                                <TextField
                                    label={label}
                                    value={currentValue}
                                    onChange={(e) => handleChange(e.target.value, customField)} // Update on change
                                    fullWidth
                                    variant="outlined"
                                    disabled={disabled}
                                />
                            </Item>
                        </Grid>
                        );
                    case 'TEXTAREA':
                        return (
                        <Grid item xs={12} sm={6} md={4} key={index}>
                            <Item>
                                <TextField
                                    label={label}
                                    value={currentValue}
                                    onChange={(e) => handleChange(e.target.value, customField)} // Update on change
                                    fullWidth
                                    multiline
                                    rows={4}
                                    variant="outlined"
                                    disabled={disabled}
                                />
                            </Item>
                        </Grid>
                        );

                    case 'NUMBER':
                        return (
                        <Grid item xs={12} sm={6} md={4} key={index}>
                            <Item>
                                <TextField
                                    label={label}
                                    type="number"
                                    value={currentValue}
                                    onChange={(e) => handleChange(e.target.value, customField)} // Update on change
                                    fullWidth
                                    variant="outlined"
                                    disabled={disabled}
                                />
                            </Item>
                        </Grid>
                        );

                    case 'DATE':
                        return (
                        <Grid item xs={12} sm={6} md={4} key={index}>
                            <Item>
                                <TheDesktopDatePicker
                                    label={label}
                                    value={currentValue ? dayjs(new Date(currentValue)) : null}
                                    onChange={(newValue) => handleChange(newValue, customField)}
                                    sx={{width: '100%'}}
                                    variant="outlined"
                                    disabled={disabled}
                                />
                            </Item>
                        </Grid>
                        );

                    case 'DATETIME':
                        return (
                        <Grid item xs={12} sm={6} md={4} key={index}>
                            <Item>
                                <TheDateTimePicker
                                    label={label}
                                    value={currentValue ? dayjs(new Date(currentValue)) : null}
                                    onChange={(newValue) => handleChange(newValue, customField)}
                                    fullWidth
                                    variant="outlined"
                                    disabled={disabled}
                                    />
                            </Item>
                        </Grid>
                        );

                    case 'BOOLEAN':
                        return (
                        <Grid item xs={12} sm={6} md={4} key={index}>
                            <Item>
                                <FormControlLabel
                                    control={
                                        <Checkbox
                                        checked={!!(currentValue === "true" || currentValue === true)}
                                        onChange={(e) => handleChange(e.target.checked, customField)} // Update on change
                                        />
                                    }
                                    label={label}
                                    disabled={disabled}
                                />
                            </Item>
                        </Grid>
                        );

                    case 'SELECT':
                        return (
                        <Grid item xs={12} sm={6} md={4} key={index}>
                            <Item>
                                <FormControl fullWidth>
                                <InputLabel id="demo-simple-select-label">
                                    {label}
                                </InputLabel>
                                <Select
                                    label={label}
                                    value={currentValue}
                                    onChange={(e) => handleChange(e.target.value, customField)}
                                >
                                    {options.map((option, idx) => (
                                        <MenuItem key={idx} value={option.value}>
                                        {option.label}
                                        </MenuItem>
                                    ))}
                                </Select>
                                </FormControl>
                            </Item>
                        </Grid>
                        );

                    case 'SELECT_MULTIPLE':
                        return (
                        <Grid item xs={12} sm={6} md={4} key={index}>
                            <Item>
                                <FormControl fullWidth>
                                <InputLabel id="demo-simple-select-label">
                                    {label}
                                </InputLabel>
                                <Select
                                    multiple={true}
                                    label={label}
                                    value={currentValue}
                                    onChange={(e) => handleChange(e.target.value, customField)}
                                >
                                    {options.map((option, idx) => (
                                        <MenuItem key={idx} value={option.value}>
                                        {option.label}
                                        </MenuItem>
                                    ))}
                                </Select>
                                </FormControl>
                            </Item>
                        </Grid>
                        );

                    default:
                        return null;
                    }
                })}
            </Grid>
        </>
    );
}
