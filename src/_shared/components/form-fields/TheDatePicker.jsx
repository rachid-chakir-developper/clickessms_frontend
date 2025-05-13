import React from 'react';
import PropTypes from 'prop-types';
import { TextField } from '@mui/material';
import { DatePicker } from '@mui/x-date-pickers/DatePicker';
import dayjs from 'dayjs';

/**
 * Composant de sélection de date qui encapsule DatePicker de MUI
 * avec des fonctionnalités supplémentaires
 */
export default function TheDatePicker({
  label,
  value,
  onChange,
  format = 'DD/MM/YYYY',
  disabled = false,
  error = false,
  helperText = '',
  required = false,
  fullWidth = true,
  minDate = null,
  maxDate = null,
  views = ['year', 'month', 'day'],
  size = 'medium',
  sx = {},
  ...props
}) {
  // Convertir la valeur en objet dayjs si elle est fournie
  const dateValue = value ? dayjs(value) : null;

  // Gérer le changement de date
  const handleDateChange = (newDate) => {
    // Convertir en format ISO pour l'API
    const isoDate = newDate ? newDate.format('YYYY-MM-DD') : null;
    onChange(isoDate);
  };

  return (
    <DatePicker
      label={label}
      value={dateValue}
      onChange={handleDateChange}
      format={format}
      disabled={disabled}
      views={views}
      minDate={minDate ? dayjs(minDate) : undefined}
      maxDate={maxDate ? dayjs(maxDate) : undefined}
      slotProps={{
        textField: {
          fullWidth,
          variant: 'outlined',
          size,
          error,
          helperText,
          required,
          sx,
          ...props,
        },
      }}
    />
  );
}

TheDatePicker.propTypes = {
  label: PropTypes.string.isRequired,
  value: PropTypes.string,
  onChange: PropTypes.func.isRequired,
  format: PropTypes.string,
  disabled: PropTypes.bool,
  error: PropTypes.bool,
  helperText: PropTypes.string,
  required: PropTypes.bool,
  fullWidth: PropTypes.bool,
  minDate: PropTypes.string,
  maxDate: PropTypes.string,
  views: PropTypes.arrayOf(PropTypes.string),
  size: PropTypes.string,
  sx: PropTypes.object,
}; 