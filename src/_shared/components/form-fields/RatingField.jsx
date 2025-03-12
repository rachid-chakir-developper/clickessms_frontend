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
    <Paper  sx={{padding: 4, display:"flex", flexDirection:"column", alignItems: 'center'}} variant={variant}>
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
