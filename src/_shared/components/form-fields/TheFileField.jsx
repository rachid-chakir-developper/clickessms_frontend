import * as React from 'react';
import { useTheme } from '@mui/material/styles';
import {
  Box,
  Card,
  CardContent,
  CardMedia,
  TextField,
  Typography,
  IconButton,
} from '@mui/material';
import SkipPreviousIcon from '@mui/icons-material/SkipPrevious';
import PlayArrowIcon from '@mui/icons-material/PlayArrow';
import SkipNextIcon from '@mui/icons-material/SkipNext';

export default function TheFieldField(props) {
  const theme = useTheme();
  const [uploadedFile, setUploadedFile] = React.useState({
    path: null,
    localUrl: null,
    file: null,
  });
  React.useEffect(() => {
    if (typeof props?.fileValue == 'string') {
      setUploadedFile({ path: props?.fileValue, localUrl: null, file: null });
    }
  }, [props?.fileValue]);
  return (
    <Card sx={{ display: 'flex' }} variant="outlined">
      <Box sx={{ display: 'flex', flexDirection: 'column' }}>
        <CardContent sx={{ flex: '1 0 auto' }}>
          {/* <Typography component="div" variant="h5">
            {props?.label}
          </Typography>
          <Typography variant="subtitle1" color="text.secondary" component="div">
            {props?.placeholder}
          </Typography> */}
          <TextField
            type="file"
            variant="outlined"
            size="small"
            onChange={(e) => {
              let file = e.target.files[0];
              if (file) {
                let uploaded = {
                  localUrl: URL.createObjectURL(file),
                  file: file,
                };
                setUploadedFile(uploaded);
                if (props?.onChange) props?.onChange(file, uploaded, e);
              }
            }}
          />
        </CardContent>
        {/* <Box sx={{ display: 'flex', alignItems: 'center', pl: 1, pb: 1 }}>
          <IconButton aria-label="previous">
            {theme.direction === 'rtl' ? <SkipNextIcon /> : <SkipPreviousIcon />}
          </IconButton>
          <IconButton aria-label="play/pause">
            <PlayArrowIcon sx={{ height: 38, width: 38 }} />
          </IconButton>
          <IconButton aria-label="next">
            {theme.direction === 'rtl' ? <SkipPreviousIcon /> : <SkipNextIcon />}
          </IconButton>
        </Box> */}
      </Box>
      {/* <CardMedia
        component="img"
        sx={{ width: 151 }}
        file={uploadedFile?.localUrl ? uploadedFile?.localUrl : uploadedFile?.path }
        alt={props?.label}
      /> */}
    </Card>
  );
}
