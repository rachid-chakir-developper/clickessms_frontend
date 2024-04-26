import * as React from 'react';
import ImageList from '@mui/material/ImageList';
import ImageListItem from '@mui/material/ImageListItem';
import ImageListItemBar from '@mui/material/ImageListItemBar';

export default function TitlebarBelowImageList({ images }) {
  return (
    <ImageList sx={{ width: 'auto', height: 450 }}>
      {images.map((image) => (
        <ImageListItem key={image.image}>
          <img
            srcSet={`${image.image}?w=248&fit=crop&auto=format&dpr=2 2x`}
            src={`${image.image}?w=248&fit=crop&auto=format`}
            alt={image.caption}
            loading="lazy"
          />
          <ImageListItemBar
            title={image.caption}
            subtitle={<span>Par: {image?.creator?.firstName}</span>}
            position="below"
          />
        </ImageListItem>
      ))}
    </ImageList>
  );
}
