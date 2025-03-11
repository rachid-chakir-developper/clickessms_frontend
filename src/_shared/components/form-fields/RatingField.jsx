import React from "react";
import { Box, Typography, Rating, Paper } from "@mui/material";

const RatingField = ({ 
  variant = "outlined", 
  label = "Note", 
  value, 
  onChange, 
  disabled = false, 
  size = "medium" 
}) => {
  return (
    <Paper display="flex" flexDirection="column" variant={variant}
    sx={{padding: 4}}>
      {label && (
        <Typography variant="subtitle1" sx={{ mb: 1 }}>
          {label}
        </Typography>
      )}
      <Rating
        name="rating-field"
        value={value}
        onChange={(event, newValue) => onChange(newValue)}
        size={size}
        disabled={disabled}
      />
    </Paper>
  );
};

export default RatingField;
