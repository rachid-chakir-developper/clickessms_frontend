import React, { useState } from 'react';
import { TextField, Checkbox, MenuItem, Grid, FormControlLabel, FormControl, InputLabel, Select } from '@mui/material';
import { GET_CUSTOM_FIELDS } from '../../../graphql/queries/CustomFieldQueries';
import { useLazyQuery } from '@apollo/client';
import TheDateTimePicker from '../TheDateTimePicker';
import dayjs from 'dayjs';
import TheDesktopDatePicker from '../TheDesktopDatePicker';

export default function CustomFieldValue({ formModel, initialValues = [], onChange, disabled=false }) {
    const [values, setValues] = useState([]);
    const [isReorganized, setIsReorganized] = useState(false);
    React.useEffect(() => {
        if(!isReorganized){
            const initialValuesCopy = initialValues.map(item => ({
                customField: typeof item.customField === 'object' && item.customField !== null 
                    ? item.customField.id 
                    : item.customField,
                id: item.id,
                value: item.value,
            }))
            setValues(initialValuesCopy);
            if(initialValuesCopy?.length > 0){
                setIsReorganized(true)
                onChange(initialValuesCopy)
            }
        }
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
        <Grid container spacing={{ xs: 2, md: 3 }}>
        {customFieldsData?.customFields?.nodes?.map((field, index) => {
            const { fieldType, label, key, id: customField, options } = field;
            const currentValue = values.find((item) => item.customField === customField)?.value || ''; // Récupère la valeur actuelle
            switch (fieldType) {
            case 'TEXT':
                return (
                <Grid item xs={12} sm={6} md={4} key={index}>
                    <TextField
                        label={label}
                        value={currentValue}
                        onChange={(e) => handleChange(e.target.value, customField)} // Update on change
                        fullWidth
                        variant="outlined"
                        disabled={disabled}
                    />
                </Grid>
                );

            case 'NUMBER':
                return (
                <Grid item xs={12} sm={6} md={4} key={index}>
                    <TextField
                    label={label}
                    type="number"
                    value={currentValue}
                    onChange={(e) => handleChange(e.target.value, customField)} // Update on change
                    fullWidth
                    variant="outlined"
                    disabled={disabled}
                    />
                </Grid>
                );

            case 'DATE':
                return (
                <Grid item xs={12} sm={6} md={4} key={index}>
                    <TheDesktopDatePicker
                        label={label}
                        value={currentValue ? dayjs(new Date(currentValue)) : null}
                        onChange={(newValue) => handleChange(newValue, customField)}
                        sx={{width: '100%'}}
                        variant="outlined"
                        disabled={disabled}
                      />
                </Grid>
                );

            case 'DATETIME':
                return (
                <Grid item xs={12} sm={6} md={4} key={index}>
                    <TheDateTimePicker
                        label={label}
                        value={currentValue ? dayjs(new Date(currentValue)) : null}
                        onChange={(newValue) => handleChange(newValue, customField)}
                        fullWidth
                        variant="outlined"
                        disabled={disabled}
                        />
                </Grid>
                );

            case 'BOOLEAN':
                return (
                <Grid item xs={12} sm={6} md={4} key={index}>
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
                </Grid>
                );

            case 'SELECT':
                return (
                <Grid item xs={12} sm={6} md={4} key={index}>
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
                </Grid>
                );

            case 'SELECT_MULTIPLE':
                return (
                <Grid item xs={12} sm={6} md={4} key={index}>
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
                </Grid>
                );

            default:
                return null;
            }
        })}
        </Grid>
    );
}
