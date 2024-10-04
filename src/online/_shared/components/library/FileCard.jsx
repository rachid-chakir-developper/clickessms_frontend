import * as React from 'react';
import {
  Box,
  Typography,
} from '@mui/material';

import {  FileCopy } from '@mui/icons-material';

export default function FileCard({ file }) {
    return (
        <Box 
        sx={{ 
            display: 'flex', 
            alignItems: 'center', 
            marginBottom: '10px', 
            border: '1px solid #ccc', 
            padding: '10px', 
            borderRadius: '4px' 
        }}
        >
        <a href={file?.file} target="_blank">
            <FileCopy sx={{ marginRight: '10px' }} />
        </a>
        <a href={file?.file} target="_blank"><Typography variant="body1" sx={{ flexGrow: 1 }}>
                {file.caption}
            </Typography>
        </a>
        </Box>
    );
};
