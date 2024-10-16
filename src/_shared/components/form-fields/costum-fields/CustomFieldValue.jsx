import React, { useState } from 'react';
import { TextField, Checkbox, MenuItem, Grid, FormControlLabel } from '@mui/material';
import { GET_CUSTOM_FIELDS } from '../../../graphql/queries/CustomFieldQueries';
import { useLazyQuery } from '@apollo/client';

export default function CustomFieldValue({ formModel, initialValues = [], onChange }) {
    const [values, setValues] = useState([]);
    React.useEffect(() => {
        setValues(
            initialValues.map(item => ({
                customField: typeof item.customField === 'object' && item.customField !== null 
                    ? item.customField.id 
                    : item.customField,
                id: item.id,
                value: item.value,
            }))
        );
    }, [initialValues]);
    const [
        getCustomFields,
        {
        loading: loadingCustomFields,
        data: customFieldsData,
        error: customFieldsError,
        },
    ] = useLazyQuery(GET_CUSTOM_FIELDS);

    React.useEffect(() => {
        if (formModel) {
        getCustomFields({ variables: { customFieldFilter: { formModels: [formModel] } } });
        }
    }, [formModel]);

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
        onChange(newValues); // Appelle le onChange prop pour retourner le nouveau tableau
    };

    return (
        <Grid container spacing={2}>
        {customFieldsData?.customFields?.nodes?.map((field, index) => {
            const { fieldType, label, key, id: customField, options } = field;
            const currentValue = values.find((item) => item.customField === customField)?.value || ''; // Récupère la valeur actuelle
            switch (fieldType) {
            case 'TEXT':
                return (
                <Grid item xs={4} key={index}>
                    <TextField
                    label={label}
                    value={currentValue}
                    onChange={(e) => handleChange(e.target.value, customField)} // Update on change
                    fullWidth
                    variant="outlined"
                    />
                </Grid>
                );

            case 'NUMBER':
                return (
                <Grid item xs={4} key={index}>
                    <TextField
                    label={label}
                    type="number"
                    value={currentValue}
                    onChange={(e) => handleChange(e.target.value, customField)} // Update on change
                    fullWidth
                    variant="outlined"
                    />
                </Grid>
                );

            case 'DATE':
                return (
                <Grid item xs={4} key={index}>
                    <TextField
                    label={label}
                    type="date"
                    value={currentValue}
                    onChange={(e) => handleChange(e.target.value, customField)} // Update on change
                    fullWidth
                    variant="outlined"
                    InputLabelProps={{ shrink: true }}
                    />
                </Grid>
                );

            case 'BOOLEAN':
                return (
                <Grid item xs={4} key={index}>
                    <FormControlLabel
                    control={
                        <Checkbox
                        checked={!!currentValue}
                        onChange={(e) => handleChange(e.target.checked, customField)} // Update on change
                        />
                    }
                    label={label}
                    />
                </Grid>
                );

            case 'SELECT':
                return (
                <Grid item xs={4} key={index}>
                    <TextField
                    select
                    label={label}
                    value={currentValue}
                    onChange={(e) => handleChange(e.target.value, customField)} // Update on change
                    fullWidth
                    variant="outlined"
                    >
                    {options.map((option, idx) => (
                        <MenuItem key={idx} value={option.value}>
                        {option.label}
                        </MenuItem>
                    ))}
                    </TextField>
                </Grid>
                );

            default:
                return null;
            }
        })}
        </Grid>
    );
}
