import * as React from 'react';
import { Box, Card, CardContent, CardMedia, TextField, Typography } from '@mui/material';
import MediaModal from '../modals/MediaModal';

export default function ImageFileField(props) {
  const [modalOpen, setModalOpen] = React.useState(false);

  const handleOpenModal = () => {
    setModalOpen(true);
  };

  const handleCloseModal = () => {
    setModalOpen(false);
  };

  const [uploadedImage, setUploadedImage] = React.useState({
    path: null,
    localUrl: null,
    file: null,
  });
  React.useEffect(() => {
    if (typeof props?.imageValue == 'string') {
      setUploadedImage({ path: props?.imageValue, localUrl: null, file: null });
    }
  }, [props?.imageValue]);
  return (
    <>
      <Card sx={{ display: 'flex' }} variant="outlined">
        <Box sx={{ display: 'flex', flexDirection: 'column' }}>
          <CardContent sx={{ flex: '1 0 auto' }}>
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
                  setUploadedImage(uploaded);
                  if (props?.onChange) props?.onChange(file, uploaded, e);
                }
              }}
            />
          </CardContent>
        </Box>
        {((uploadedImage?.localUrl && uploadedImage?.localUrl !== "") || (uploadedImage?.path && uploadedImage?.path !=="")) && <CardMedia
          onClick={handleOpenModal}
          component="img"
          sx={{ width: 151 }}
          image={
            uploadedImage?.localUrl
              ? uploadedImage?.localUrl
              : uploadedImage?.path
          }
          alt={props?.label}
        />}
      </Card>

      <MediaModal
        open={modalOpen}
        handleClose={handleCloseModal}
        images={[
          {
            image: uploadedImage?.localUrl
              ? uploadedImage?.localUrl
              : uploadedImage?.path,
          },
        ]}
      />
    </>
  );
}
