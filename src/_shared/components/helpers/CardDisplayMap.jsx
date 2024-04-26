import * as React from 'react';
import Card from '@mui/material/Card';
import CardContent from '@mui/material/CardContent';
import CardMedia from '@mui/material/CardMedia';
import Typography from '@mui/material/Typography';
import DialogSelectLocationMap from '../../services/map/DialogSelectLocationMap';

export default function CardDisplayMap({ address }) {
  const [openMapDialog, setOpenMapDialog] = React.useState(false);
  const handleClickSelectMap = () => {
    setOpenMapDialog(true);
  };
  const closeMapDialog = (value) => {
    setOpenMapDialog(false);
    if (value) {
      console.log('value', value);
      address.country = value.country;
      address.city = value.city;
      address.address = value.address;
      address.zipCode = value.zip;
      address.latitude = value.latitude;
      address.longitude = value.longitude;
    }
  };
  return (
    <>
      <Card
        sx={{ maxWidth: '100%', cursor: 'pointer' }}
        variant="outlined"
        onClick={() => handleClickSelectMap()}
      >
        <CardMedia
          sx={{ height: 140 }}
          image={`https://maps.googleapis.com/maps/api/staticmap?center=${address?.latitude},${address?.longitude}&zoom=14&size=400x200&maptype=roadmap&markers=color:red%7Clabel:C%7C${Number(address?.latitude)},${Number(address?.longitude)}&key=AIzaSyDM9N54Rv7JnbQ8dnHFFCsf3kgi0I-WNpw`}
          title={`${address?.city} ${address?.country}`}
        />
        <CardContent>
          <Typography gutterBottom variant="h5" component="div">
            {!address?.city && !address?.country
              ? ''
              : `${address?.city} ${address?.country}`}
          </Typography>
          <Typography variant="body2" color="text.secondary">
            {address?.address || `Cliquez pour cherchez l'adresse`}
          </Typography>
        </CardContent>
        {/*
        <CardActions>
          <Button size="small">Y aller</Button>
          <Button size="small">Google map</Button>
        </CardActions> */}
      </Card>
      <DialogSelectLocationMap
        open={openMapDialog}
        onClose={closeMapDialog}
        localisation={{ lat: address?.latitude, lng: address?.longitude }}
      />
    </>
  );
}
