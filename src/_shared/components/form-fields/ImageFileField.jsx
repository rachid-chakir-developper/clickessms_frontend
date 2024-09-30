import * as React from 'react';
import { Box, Card, CardContent, CardMedia, IconButton, Typography } from '@mui/material';
import CloseIcon from '@mui/icons-material/Close';
import MediaModal from '../modals/MediaModal';
import { InsertPhoto } from '@mui/icons-material';

export default function ImageFileField(props) {
  const [modalOpen, setModalOpen] = React.useState(false);
  const fileInputRef = React.useRef(null);

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
    if (typeof props?.imageValue === 'string') {
      setUploadedImage({ path: props?.imageValue, localUrl: null, file: null });
    }
  }, [props?.imageValue]);

  const handleFileChange = (e) => {
    let file = e.target.files[0];
    if (file) {
      let uploaded = {
        localUrl: URL.createObjectURL(file),
        file: file,
      };
      setUploadedImage(uploaded);
      if (props?.onChange) props?.onChange(file, uploaded, e);
    }
  };

  const handleImageUploadClick = () => {
    fileInputRef.current.click(); // Simulate click on hidden input
  };

  const handleRemoveImage = () => {
    setUploadedImage({ path: null, localUrl: null, file: null });
    if (props?.onChange) props?.onChange(null, null, null); // Optionally notify parent
  };

  return (
    <>
      
      <Card sx={{ display: 'flex', position: 'relative', cursor: 'pointer' }} variant="outlined">
        <Box sx={{ display: 'flex', flexDirection: 'column', alignItems: 'center', width: '100%' }}>
          <CardContent sx={{ display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
            <Typography variant="subtitle1" gutterBottom>
              {props?.label || 'Upload an image'} {/* Affiche le libellé ici */}
            </Typography>
            {!uploadedImage?.localUrl && !uploadedImage?.path ? (
              <InsertPhoto fontSize="large"  onClick={handleImageUploadClick}/>
            ) : (
              <CardMedia
                component="img"
                sx={{ width: 151 }}
                image={
                  uploadedImage?.localUrl ? uploadedImage?.localUrl : uploadedImage?.path
                }
                alt={props?.label}
                onClick={handleOpenModal}
              />
            )}
          </CardContent>
        </Box>

        {uploadedImage?.localUrl || uploadedImage?.path ? (
          <IconButton
            sx={{ position: 'absolute', top: 8, right: 8 }}
            onClick={handleRemoveImage}
          >
            <CloseIcon />
          </IconButton>
        ) : null}

        <input
          ref={fileInputRef}
          type="file"
          accept="image/*" // N'accepte que les fichiers image (tous les formats d'image)
          style={{ display: 'none' }}
          onChange={handleFileChange}
        />
      </Card>

      <MediaModal
        open={modalOpen}
        handleClose={handleCloseModal}
        images={[
          {
            image: uploadedImage?.localUrl ? uploadedImage?.localUrl : uploadedImage?.path,
          },
        ]}
      />
    </>
  );
}
