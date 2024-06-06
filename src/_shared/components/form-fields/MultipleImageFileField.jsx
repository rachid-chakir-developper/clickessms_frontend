import * as React from 'react';
import { Box, Card, CardContent, CardMedia, IconButton, TextField, Typography } from '@mui/material';
import DeleteIcon from '@mui/icons-material/Delete';
import MediaModal from '../modals/MediaModal';
import { Close } from '@mui/icons-material';
import TheTextField from './TheTextField';

const ImageCard = ({ image, onDelete, onClick }) => {
  return (
    <Card sx={{ position: 'relative', display: 'flex', marginBottom: '10px', overflow: 'inherit' }} variant="outlined">
      <IconButton sx={{ position: 'absolute', top: -20, right: -20, zIndex: 100 }}
        onClick={onDelete}
        edge="end"
        color="error"
      >
        <Close />
      </IconButton>
      <CardMedia
        component="img"
        sx={{ width: 300, height: 300, cursor: 'pointer' }}
        image={image.localUrl || image.path}
        alt="Uploaded Image"
        onClick={onClick}
      />
    </Card>
  );
};

export default function MultipleImageFileField(props) {
  const [modalOpen, setModalOpen] = React.useState(false);
  const [selectedImage, setSelectedImage] = React.useState(null);
  const [uploadedImages, setUploadedImages] = React.useState([]);
  const [currentIndex, setCurrentIndex] = React.useState(0);

  const handleOpenModal = (image, index) => {
    setCurrentIndex(index);
    setSelectedImage(image);
    setModalOpen(true);
  };

  const handleCloseModal = () => {
    setModalOpen(false);
    setSelectedImage(null);
    setTimeout(() => {
      setCurrentIndex(0);
    }, 1000);
  };

  const handleImageChange = (e) => {
    const files = Array.from(e.target.files);
    const newImages = files.map(file => ({
      localUrl: URL.createObjectURL(file),
      caption: '',
      file,
    }));
    setUploadedImages([...uploadedImages, ...newImages]);
    if (props?.onChange) {
      props.onChange([...uploadedImages, ...newImages]);
    }
  };

  const handleDeleteImage = (index) => {
    const newImages = uploadedImages.filter((_, i) => i !== index);
    setUploadedImages(newImages);
    if (props?.onChange) {
      props.onChange(newImages);
    }
  };

  const handleCaptionChange = (index, newCaption) => {
    const newImages = uploadedImages.map((image, i) => 
      i === index ? { ...image, caption: newCaption } : image
    );
    setUploadedImages(newImages);
    if (props?.onChange) {
      props.onChange(newImages);
    }
  };

  React.useEffect(() => {
    if (Array.isArray(props?.imageValue)) {
      setUploadedImages(props.imageValue.map(value => 
        (typeof value?.image === 'string') ? 
        ({ id : value?.id, path: value?.image, localUrl: null, caption: value?.caption, file: null }) : value
      ));
    }
  }, [props?.imageValue]);

  return (
    <>
      <Box>
        <TextField
          type="file"
          variant="outlined"
          size="small"
          inputProps={{ multiple: true }}
          onChange={handleImageChange}
        />
      </Box>
      <Box sx={{ display: 'flex', justifyContent: 'space-around', flexWrap: 'wrap', marginY: 4 }}>
        {uploadedImages.map((image, index) => (
          <Box key={index} sx={{padding: 2}}>
            <ImageCard
              image={image}
              onDelete={() => handleDeleteImage(index)}
              onClick={() => handleOpenModal(image, index)}
            />
            <TheTextField
              size="small"
              fullWidth
              multiline
              variant="outlined"
              label="Caption"
              value={image.caption}
              onChange={(e) => handleCaptionChange(index, e.target.value)}
              disabled={props.disabled}
            />
          </Box>
        ))}
      </Box>

      {selectedImage && (
        <MediaModal
          open={modalOpen}
          handleClose={handleCloseModal}
          currentIndex={currentIndex}
          images={uploadedImages.map(image => ({ image: image.localUrl || image.path, caption: image.caption }))}
        />
      )}
    </>
  );
}
