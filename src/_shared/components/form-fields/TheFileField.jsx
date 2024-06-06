import * as React from 'react';
import { useTheme } from '@mui/material/styles';
import { Box, Card, CardContent, TextField, IconButton, Typography } from "@mui/material";
import { Description } from '@mui/icons-material';

export default function  TheFileField(props) {
  const theme = useTheme();
  const [uploadedFile, setUploadedFile] = React.useState({ path: null, localUrl : null, file : null })
  React.useEffect(
    () => {
      if(typeof(props?.fileValue) == 'string'){
        setUploadedFile({ path: props?.fileValue, localUrl : null, file : null });
      }
    },
    [props?.fileValue]
  );
  return (
    <Card sx={{ display: 'flex' }} variant="outlined">
      <Box sx={{ display: 'flex', flexDirection: 'column' }}>
        <CardContent sx={{ flex: '1 0 auto' }}>
        <Typography variant="subtitle1" color="text.secondary" component="div">
            {props?.label}
          </Typography>
          <Typography variant="subtitle1" color="text.secondary" component="div">
            {props?.placeholder}
          </Typography>
          <TextField
                type="file"
                variant="outlined"
                size="small"
                onChange={(e) =>{
                  let file = e.target.files[0];
                  if (file) {
                    let uploaded = {
                      localUrl : URL.createObjectURL(file),
                      file : file
                    }
                    setUploadedFile(uploaded)
                    if(props?.onChange) props?.onChange(file, uploaded, e)
                  }
                }
                }
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
      {props?.fileValue && <a href={uploadedFile?.localUrl ? uploadedFile?.localUrl : uploadedFile?.path} target="_blank">
        <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'center', pl: 1, pb: 1 }}>
          <IconButton aria-label="Quote">
            <Description sx={{ height: 50, width: 50 }}/>
          </IconButton>
        </Box>
      </a>}
    </Card>
  );
}