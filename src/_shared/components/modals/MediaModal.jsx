import React, { useState } from 'react';
import {
  Modal,
  Backdrop,
  Fade,
  Button,
  useTheme,
  useMediaQuery,
  Box,
  Stack,
  IconButton,
  Avatar,
  Typography,
} from '@mui/material';
import {
  ArrowRight,
  Close,
  SkipNextRounded,
  SkipPreviousRounded,
} from '@mui/icons-material';
const MediaModal = ({
  open,
  handleClose,
  images = [],
  videos = [],
  currentIndex = 0,
}) => {
  const theme = useTheme();
  const fullScreen = useMediaQuery(theme.breakpoints.down('sm'));

  const [currentMediaIndex, setCurrentIndex] = useState(0);

  const handleNextImage = () => {
    if (images && images?.length > 0)
      setCurrentIndex((prevIndex) => (prevIndex + 1) % images.length);
    else if (videos && videos?.length > 0)
      setCurrentIndex((prevIndex) => (prevIndex + 1) % videos.length);
  };

  const handlePrevImage = () => {
    if (images && images?.length > 0)
      setCurrentIndex(
        (prevIndex) => (prevIndex - 1 + images.length) % images.length,
      );
    else if (videos && videos?.length > 0)
      setCurrentIndex(
        (prevIndex) => (prevIndex - 1 + videos.length) % videos.length,
      );
  };

  React.useEffect(() => {
    setCurrentIndex(currentIndex);
  }, [currentIndex]);

  return (
    <Modal
      open={open}
      onClose={handleClose}
      closeAfterTransition
      fullScreen={fullScreen}
    >
      <Fade in={open}>
        <Stack
          sx={{
            height: '100%',
            alignItems: 'center',
            justifyContent: 'center',
            padding: 20,
          }}
        >
          <Box
            sx={{
              display: 'flex',
              alignItems: 'flex-start',
              justifyContent: 'center',
            }}
          >
            <Box sx={{ alignItems: 'center', justifyContent: 'center' }}>
              {images && images?.length > 0 && (
                <img
                  src={images[currentMediaIndex]?.image}
                  alt="Media"
                  style={{ maxWidth: '100%', maxHeight: '80vh' }}
                />
              )}
              {videos && videos?.length > 0 && (
                <video controls style={{ width: '100%', height: '80vh' }}>
                  <source
                    src={videos[currentMediaIndex]?.video}
                    type="video/mp4"
                  />
                  Your browser does not support the video tag.
                </video>
              )}
            </Box>
            {images &&
              images?.length > 0 &&
              images[currentMediaIndex]?.creator && (
                <Box sx={{ padding: 6 }}>
                  <Typography
                    sx={{ color: '#e1e1e1' }}
                    variant="body1"
                    display="block"
                    gutterBottom
                  >
                    {`Par ${images[currentMediaIndex]?.creator?.firstName} ${images[currentMediaIndex]?.creator?.lastName}`}
                  </Typography>
                  <Typography
                    sx={{ color: '#e1e1e1' }}
                    variant="button"
                    display="block"
                    gutterBottom
                  >
                    {images[currentMediaIndex]?.caption}
                  </Typography>
                </Box>
              )}
            {videos &&
              videos?.length > 0 &&
              videos[currentMediaIndex]?.creator && (
                <Box sx={{ padding: 6 }}>
                  <Typography
                    sx={{ color: '#e1e1e1' }}
                    variant="body1"
                    display="block"
                    gutterBottom
                  >
                    {`Par ${videos[currentMediaIndex]?.creator?.firstName} ${videos[currentMediaIndex]?.creator?.lastName}`}
                  </Typography>
                  <Typography
                    sx={{ color: '#e1e1e1' }}
                    variant="button"
                    display="block"
                    gutterBottom
                  >
                    {videos[currentMediaIndex]?.caption}
                  </Typography>
                </Box>
              )}
          </Box>
          {(images?.length > 1 || videos?.length > 1) && (
            <Box
              sx={{
                width: '100%',
                position: 'absolute',
                bottom: 0,
                padding: 2,
                zIndex: 1000,
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
              }}
            >
              <IconButton
                sx={{ backgroundColor: '#e1e1e1', marginX: 2 }}
                variant="outlined"
                aria-label="next"
                onClick={handlePrevImage}
                size="large"
              >
                <SkipPreviousRounded size="large" />
              </IconButton>
              <Box>
                <Typography
                  sx={{ color: '#e1e1e1' }}
                  variant="button"
                  display="block"
                  gutterBottom
                >
                  {currentMediaIndex + 1}/
                  {images && images?.length > 0
                    ? images?.length
                    : videos?.length}
                </Typography>
              </Box>
              <IconButton
                sx={{ backgroundColor: '#e1e1e1', marginX: 2 }}
                variant="outlined"
                aria-label="next"
                onClick={handleNextImage}
                size="large"
              >
                <SkipNextRounded size="large" />
              </IconButton>
            </Box>
          )}

          <IconButton
            variant="contained"
            sx={{
              position: 'absolute',
              top: 20,
              right: 20,
              padding: 2,
              zIndex: 1000,
              backgroundColor: '#e1e1e1',
            }}
            aria-label="next"
            onClick={handleClose}
          >
            <Close />
          </IconButton>
        </Stack>
      </Fade>
    </Modal>
  );
};

export default MediaModal;
