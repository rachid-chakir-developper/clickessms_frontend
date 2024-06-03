import React, { useRef, useState } from 'react';
import { Modal, Backdrop, Fade, Button, useTheme, useMediaQuery, Box, Stack, IconButton, Avatar, Typography } from '@mui/material';
import { ArrowRight, Cancel, Clear, Close, Refresh, SkipNextRounded, SkipPreviousRounded, ZoomIn, ZoomOut } from '@mui/icons-material';
import { TransformWrapper, TransformComponent, useControls } from "react-zoom-pan-pinch";


const Controls = ({count, setCount}) => {
  const { zoomIn, zoomOut, resetTransform } = useControls();
  return (
    <Box>
      <IconButton sx={{backgroundColor: "#d1d1d1", marginX: 0.3, marginY: 1}} onClick={() => {zoomIn(); setCount((prev)=>prev+1)}} size="small">
          <ZoomIn size="small"/>
      </IconButton>
      <IconButton sx={{backgroundColor: "#d1d1d1", marginX: 0.3, marginY: 1}} onClick={() => {zoomOut(); if(count > 1) setCount((prev)=>prev-1)}} size="small">
          <ZoomOut size="small"/>
      </IconButton>
      {count !== 1 && <IconButton sx={{backgroundColor: "#d1d1d1", marginX: 0.3, marginY: 1}} onClick={() => {resetTransform(); setCount(1)}} size="small">
          <Clear size="small"/>
      </IconButton>}
    </Box>
  );
};

const MediaModal = ({ open, handleClose, images = [], videos = [], currentIndex = 0 }) => {
  const [count, setCount] = useState(1);
  const theme = useTheme();
  const fullScreen = useMediaQuery(theme.breakpoints.down('sm'));

  const [currentMediaIndex, setCurrentIndex] = useState(0);

  const handleNextImage = () => {
    if(containerZoomRef) {containerZoomRef?.current?.resetTransform(); setCount(1)}
    if(images && images?.length > 0) setCurrentIndex((prevIndex) => (prevIndex + 1) % images.length);
    else if(videos && videos?.length > 0) setCurrentIndex((prevIndex) => (prevIndex + 1) % videos.length);
  };

  const handlePrevImage = () => {
    if(containerZoomRef) {containerZoomRef?.current?.resetTransform(); setCount(1)}
    if(images && images?.length > 0)  setCurrentIndex((prevIndex) => (prevIndex - 1 + images.length) % images.length);
    else if(videos && videos?.length > 0)  setCurrentIndex((prevIndex) => (prevIndex - 1 + videos.length) % videos.length);
  };

  const handleClickClose = () => {
    if(containerZoomRef) {containerZoomRef?.current?.resetTransform(); setCount(1)}
    handleClose()
  };

  React.useEffect(()=>{
    setCurrentIndex(currentIndex)
  }, [currentIndex])

  const containerRef = useRef(null);
  const containerZoomRef = useRef(null);

  return (
    <Modal
      open={open}
      onClose={handleClickClose}
      closeAfterTransition
      fullScreen={fullScreen}
    >
      <Fade in={open}>
        <Stack sx={{ height : '100%', alignItems : 'center', justifyContent : 'center', padding: 20}} onClick={(e)=>{
          if (containerRef.current && !containerRef.current.contains(e.target)) {
            handleClickClose();
          }
        }}
        onKeyDown={(e)=>{
          if (e.key === 'ArrowLeft') {
            handlePrevImage();
            } else if (e.key === 'ArrowRight') {
                handleNextImage();
            }
        }}
        >
            <Box ref={containerRef} sx={{ display : 'flex', alignItems : 'flex-start', justifyContent : 'center'}}>
              <Box sx={{ display : 'flex', alignItems : 'flex-start', justifyContent : 'center'}}>
                  <Box sx={{ alignItems : 'center', justifyContent : 'center'}}>
                      {(images && images?.length > 0) && 
                                                        <TransformWrapper
                                                        ref={containerZoomRef}
                                                        initialScale={1}
                                                      >
                                                        {({ zoomIn, zoomOut, resetTransform, ...rest }) => (
                                                          <>
                                                            <Controls count={count} setCount={setCount} />
                                                            <TransformComponent>
                                                              <img src={images[currentMediaIndex]?.image} alt="Media" style={{ maxWidth: '100%', maxHeight: '80vh' }} />
                                                            </TransformComponent>
                                                          </>
                                                        )}
                                                      </TransformWrapper>
                      }
                      {(videos && videos?.length > 0) && <video controls style={{ width: '100%', height: '80vh' }}>
                          <source src={videos[currentMediaIndex]?.video} type="video/mp4" />
                          Your browser does not support the video tag.
                      </video>}
                  </Box>
                  {(images && images?.length > 0 && images[currentMediaIndex]?.creator) && <Box sx={{ padding : 6}}>
                      <Typography sx={{color : "#e1e1e1"}} variant="body1" display="block" gutterBottom>
                          {`Par ${images[currentMediaIndex]?.creator?.firstName} ${images[currentMediaIndex]?.creator?.lastName}`}
                      </Typography>
                      <Typography sx={{color : "#e1e1e1"}} variant="button" display="block" gutterBottom>
                          {images[currentMediaIndex]?.caption}
                      </Typography>
                  </Box>}
                  {(videos && videos?.length > 0 && videos[currentMediaIndex]?.creator) && <Box sx={{ padding : 6}}>
                      <Typography sx={{color : "#e1e1e1"}} variant="body1" display="block" gutterBottom>
                          {`Par ${videos[currentMediaIndex]?.creator?.firstName} ${videos[currentMediaIndex]?.creator?.lastName}`}
                      </Typography>
                      <Typography sx={{color : "#e1e1e1"}} variant="button" display="block" gutterBottom>
                          {videos[currentMediaIndex]?.caption}
                      </Typography>
                  </Box>}
              </Box>
              {(images?.length >  1 || videos?.length > 1) && <Box sx={{ width: '100%', position : 'absolute', bottom : 0, padding : 2, zIndex: 1000,
                          display : 'flex', alignItems : 'center', justifyContent : 'center'}}>
                  <IconButton sx={{backgroundColor: "#e1e1e1", marginX: 2}} variant="outlined" aria-label="next" onClick={handlePrevImage} size="large">
                      <SkipPreviousRounded size="large"/>
                  </IconButton>
                  <Box>
                      <Typography sx={{color : "#e1e1e1"}} variant="button" display="block" gutterBottom>
                          {currentMediaIndex+1}/{(images && images?.length > 0) ? images?.length : videos?.length}
                      </Typography>
                  </Box>
                  <IconButton sx={{backgroundColor: "#e1e1e1", marginX: 2}} variant="outlined" aria-label="next" onClick={handleNextImage} size="large">
                      <SkipNextRounded size="large"/>
                  </IconButton>
              </Box>}
            </Box>
            
            <IconButton variant="contained" 
            sx={{position : 'absolute', top : 20, right: 20, padding : 2, zIndex: 1000, backgroundColor: "#e1e1e1"}} 
             aria-label="next" onClick={handleClickClose} >
                <Close />
            </IconButton>
        </Stack>
      </Fade>
    </Modal>
  );
};

export default MediaModal;
