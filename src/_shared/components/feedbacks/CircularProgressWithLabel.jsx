import * as React from 'react';
import CircularProgress from '@mui/material/CircularProgress';
import Typography from '@mui/material/Typography';
import Box from '@mui/material/Box';

function GradientCircularProgress(props) {
    return (
      <>
        <svg width={0} height={0}>
          <defs>
            <linearGradient id="my_gradient" x1="0%" y1="0%" x2="0%" y2="100%">
              <stop offset="0%" stopColor="#e01cd5" />
              <stop offset="60%" stopColor="#1CB5E0" />
            </linearGradient>
          </defs>
        </svg>
        <CircularProgress sx={{ position: 'absolute', left: 0, 'svg circle': { stroke: 'url(#my_gradient)' } }} variant="determinate" {...props}
        size={40}
        thickness={4}/>
      </>
    );
  }

  
export default function CircularProgressWithLabel(props) {
  return (
    <Box sx={{ position: 'relative', display: 'inline-flex' }}>
        <Box sx={{ position: 'relative' }}>
            <CircularProgress
                variant="determinate"
                sx={{
                color: (theme) =>
                    theme.palette.grey[theme.palette.mode === 'light' ? 200 : 800],
                }}
                size={40}
                thickness={4}
                {...props}
                value={100}
            />
            <GradientCircularProgress {...props} />
        </Box>
        <Box
            sx={{
            top: 0,
            left: 0,
            bottom: 0,
            right: 0,
            position: 'absolute',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            }}
        >
            <Typography variant="caption" component="span" color="text.secondary">
            {`${Math.round(props.value)}%`}
            </Typography>
        </Box>
    </Box>
  );
}
