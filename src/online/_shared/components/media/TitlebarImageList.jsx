import * as React from 'react';
import ImageList from '@mui/material/ImageList';
import ImageListItem from '@mui/material/ImageListItem';
import ImageListItemBar from '@mui/material/ImageListItemBar';
import ListSubheader from '@mui/material/ListSubheader';
import IconButton from '@mui/material/IconButton';
import { Image, PlayArrow } from '@mui/icons-material';
import { Alert } from '@mui/material';
import MediaModal from '../../../../_shared/components/modals/MediaModal';

export default function TitlebarImageList({
  images = [],
  videos = [],
  loading = false,
}) {
  const [modalOpen, setModalOpen] = React.useState(false);
  const [selectedMediaType, setSelectedMediaType] = React.useState('images');

  const handleOpenModal = (mediaType) => {
    setSelectedMediaType(mediaType);
    setModalOpen(true);
  };

  const handleCloseModal = () => {
    setModalOpen(false);
  };
  return (
    <>
      <ImageList sx={{ width: '100%', height: 450 }}>
        <ImageListItem key="Subheader" cols={2}>
          <ListSubheader component="div">
            Images
            {images?.length < 1 && !loading && (
              <Alert severity="warning">
                La liste est vide pour le moment !
              </Alert>
            )}
          </ListSubheader>
        </ImageListItem>
        {images.map((image, index) => (
          <ImageListItem
            key={`img${index}`}
            onClick={() => handleOpenModal('images')}
          >
            <img
              srcSet={`${image?.image}?w=248&fit=crop&auto=format&dpr=2 2x`}
              src={`${image?.image}?w=248&fit=crop&auto=format`}
              alt={image?.caption}
              loading="lazy"
            />
            <ImageListItemBar
              title={image?.caption}
              subtitle={`Par ${image?.creator?.firstName} ${image?.creator?.lastName}`}
              actionIcon={
                <IconButton sx={{ color: 'rgba(255, 255, 255, 0.54)' }}>
                  <Image />
                </IconButton>
              }
            />
          </ImageListItem>
        ))}
        <ImageListItem key="Subheader" cols={2}>
          <ListSubheader component="div">
            Videos
            {videos?.length < 1 && !loading && (
              <Alert severity="warning">
                La liste est vide pour le moment !
              </Alert>
            )}
          </ListSubheader>
        </ImageListItem>
        {videos.map((video, index) => (
          <ImageListItem
            key={`v${index}`}
            onClick={() => handleOpenModal('videos')}
          >
            <img
              srcSet={`${video?.thumbnail}?w=248&fit=crop&auto=format&dpr=2 2x`}
              src={`${video?.thumbnail}?w=248&fit=crop&auto=format`}
              alt={video?.caption}
              loading="lazy"
            />
            {/* <video playsInline muted src={video?.video} poster={video?.thumbnail} controls>
                            <source src={video?.video} type="video/mp4" />
                            <source src={video?.video} type="video/webm" />
                            <source src={video?.video} type="video/ogg" />
                            Votre navigateur ne prend pas en charge la lecture des vidéos. 
                        </video> */}
            <ImageListItemBar
              title={video?.caption}
              subtitle={`Par ${video?.creator?.firstName} ${video?.creator?.lastName}`}
              actionIcon={
                <IconButton sx={{ color: 'rgba(255, 255, 255, 0.54)' }}>
                  <PlayArrow />
                </IconButton>
              }
            />
          </ImageListItem>
        ))}
      </ImageList>
      <MediaModal
        open={modalOpen}
        handleClose={handleCloseModal}
        images={selectedMediaType == 'images' ? images : []}
        videos={selectedMediaType == 'videos' ? videos : []}
      />
    </>
  );
}
