import React, { useState } from 'react';
import { styled, Stack, Typography, Box, Paper } from '@mui/material';
import { GET_CUSTOM_FIELD_VALUES, GET_CUSTOM_FIELDS } from '../../../graphql/queries/CustomFieldQueries';
import { useLazyQuery } from '@apollo/client';
import { getFormatDate, getFormatDateTime } from '../../../tools/functions';

const Item = styled(Stack)(({ theme }) => ({
    backgroundColor: theme.palette.mode === 'dark' ? '#1A2027' : '#fff',
    ...theme.typography.body2,
    padding: theme.spacing(2),
    textAlign: 'center',
    color: theme.palette.text.secondary,
  }));

export default function CustomFieldValuesDetails({ formModel, idObject}) {
    const [values, setValues] = useState([]);
    const [getCustomFieldValues,
            { 
                loading: loadingFields, data: customFieldData, error: fieldError
            }] = useLazyQuery(GET_CUSTOM_FIELD_VALUES, {fetchPolicy: 'network-only'});

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

    // Gérer l'état de chargement et d'erreur
    if (loadingFields) return <Typography>Chargement...</Typography>;
    if (fieldError) return <Typography variant="body2" color="error">Erreur de chargement des champs personnalisés.</Typography>;

    return (
        <Paper sx={{ padding: 2, marginTop: 1 }} variant="outlined">
            <Box>
                {customFieldsData?.customFields?.nodes?.map((field, index) => {
                    const { fieldType, label, key, id: customField, options } = field;
                    const currentValue = values.find((item) => item.customField === customField)?.value || ''; // Récupère la valeur actuelle
                    switch (fieldType) {
                    case 'TEXT':
                        return (
                            <Typography variant="body1" key={index}>
                                {label}: {currentValue}
                            </Typography>
                        );
                    case 'TEXTAREA':
                        return (
                            <Typography variant="body1" key={index}>
                                {label}: {currentValue}
                            </Typography>
                        );

                    case 'NUMBER':
                        return (
                            <Typography variant="body1" key={index}>
                                {label}: {currentValue}
                            </Typography>
                        );

                    case 'DATE':
                        return (
                            <Typography variant="body1" key={index}>
                                {label}: {getFormatDate(currentValue)}
                            </Typography>
                        );

                    case 'DATETIME':
                        return (
                            <Typography variant="body1" key={index}>
                                {label}: {getFormatDateTime(currentValue)}
                            </Typography>
                        );

                    case 'BOOLEAN':
                        return (
                            <Typography variant="body1" key={index}>
                                {label}: {currentValue? "Oui" : "Non"}
                            </Typography>
                        );

                    case 'SELECT':
                        return (
                            <Typography variant="body1" key={index}>
                            {label}: 
                            {options.map((option, idx) => (
                                currentValue === option.value && <span key={idx}>{option.label}</span>
                            ))}
                            </Typography>
                        );

                    case 'SELECT_MULTIPLE':
                        return (
                            <Typography variant="body1" key={index}>
                            {label}: 
                            {options
                                .filter(option => currentValue.includes(option.value)) // Filtrer les options sélectionnées
                                .map((option, idx) => (
                                <span key={idx}>{option.label}{idx < options.filter(option => currentValue.includes(option.value)).length - 1 ? ', ' : ''}</span>
                                ))}
                            </Typography>
                        );

                    default:
                        return null;
                    }
                })}
            </Box>
        </Paper>
    );
}
