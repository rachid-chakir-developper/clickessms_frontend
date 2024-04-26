import * as React from 'react';
import Button from '@mui/material/Button';
import Dialog from '@mui/material/Dialog';
import AppBar from '@mui/material/AppBar';
import Toolbar from '@mui/material/Toolbar';
import IconButton from '@mui/material/IconButton';
import Typography from '@mui/material/Typography';
import CloseIcon from '@mui/icons-material/Close';
import Slide from '@mui/material/Slide';
import {
  GoogleMap,
  LoadScript,
  Marker,
  useJsApiLoader,
} from '@react-google-maps/api';
import AutocompleteGoogleMaps from './AutocompleteGoogleMaps';
import { GOOGLE } from '../../tools/constants';

const containerStyle = {
  width: '100%',
  height: '100%',
};

const Transition = React.forwardRef(function Transition(props, ref) {
  return <Slide direction="up" ref={ref} {...props} />;
});

export default function DialogSelectLocationMap({
  open,
  onClose,
  localisation,
}) {
  const handleClose = () => {
    console.log('handleCloselocalisation', localisation);
    onClose();
  };
  const handleCloseOk = () => {
    onClose(location);
  };

  const [center, setCenter] = React.useState({
    lat: 49.4279197,
    lng: 1.067133,
  });
  React.useEffect(() => {
    if (open) {
      console.log('localisation', localisation);
      setTimeout(() => {
        if (localisation.lat != '' && localisation.lng != '') {
          const latlng = {
            lat: Number(localisation.lat),
            lng: Number(localisation.lng),
          };
          console.log('latlng***************', latlng);
          setCenter(latlng);
          let markerAux = { ...marker };
          markerAux.lat = latlng.lat;
          markerAux.lng = latlng.lng;
          setMarker(markerAux);
          console.log('center', center);
          setZoom(20);
        }
      }, 1000);
    }
  }, [open]);
  const [map, setMap] = React.useState(null);
  const [zoom, setZoom] = React.useState(15);

  const onLoad = React.useCallback(function callback(map) {
    const bounds = new window.google.maps.LatLngBounds();
    map.fitBounds(bounds);
    setMap(map);
  }, []);

  const onUnmount = React.useCallback(function callback(map) {
    setMap(null);
  }, []);
  const [marker, setMarker] = React.useState(null);
  const [location, setLocation] = React.useState(null);
  const onMapClick = React.useCallback((e) => {
    setMarker({
      lat: e.latLng.lat(),
      lng: e.latLng.lng(),
      time: new Date(),
    });
    geocodeLatLng({ lat: e.latLng.lat(), lng: e.latLng.lng() });
  }, []);
  const geocodeLatLng = (latLng) => {
    console.log('latLng***', latLng);
    const geocoder = new window.google.maps.Geocoder();
    geocoder.geocode({ location: latLng }, (results, status) => {
      console.log('status***', status);
      console.log('results***', results);
      if (status === 'OK' && results[1]) {
        const position = results[1].geometry.location;
        const addressComponents = results[1].address_components;

        const updatedAddress = {
          latitude: position.lat(),
          longitude: position.lng(),
          address: results[1].formatted_address,
        };

        addressComponents.forEach((component) => {
          component.types.forEach((type) => {
            if (type === 'country')
              updatedAddress.country = component.long_name;
            if (type === 'locality') updatedAddress.city = component.long_name;
            if (type === 'postal_code')
              updatedAddress.zipCode = component.long_name;
          });
        });
        console.log('updatedAddress***', updatedAddress);
        setLocation(updatedAddress);
      } else {
        window.alert('No results found');
        setLocation({
          latitude: latLng.lat,
          longitude: latLng.lng,
          address: null,
        });
      }
    });
  };

  // Créez une fonction pour obtenir les détails d'un lieu à partir de son place_id
  const getPlaceDetails = (placeId) => {
    const placeService = new window.google.maps.places.PlacesService(
      document.createElement('div'),
    );
    placeService.getDetails({ placeId }, (result, status) => {
      if (status === 'OK' && result.geometry && result.geometry.location) {
        const latitude = result.geometry.location.lat();
        const longitude = result.geometry.location.lng();
        const updatedAddress = {
          latitude,
          longitude,
          address: result.formatted_address, // Adresse complète
          // Ajoutez d'autres détails si nécessaire
        };
        console.log('result*****************', result);
        result.address_components.forEach((component) => {
          component.types.forEach((type) => {
            if (type === 'country')
              updatedAddress.country = component.long_name;
            if (type === 'locality') updatedAddress.city = component.long_name;
            if (type === 'postal_code')
              updatedAddress.zipCode = component.long_name;
          });
        });
        console.log(updatedAddress);
        setLocation(updatedAddress);
        if (updatedAddress.latitude && updatedAddress.longitude) {
          const latlng = {
            lat: Number(updatedAddress.latitude),
            lng: Number(updatedAddress.longitude),
          };
          setCenter(latlng);
          let markerAux = { ...marker };
          markerAux.lat = latlng.lat;
          markerAux.lng = latlng.lng;
          setMarker(markerAux);
          console.log('center', center);
          setZoom(20);
        }
      } else {
        window.alert('No results found');
      }
    });
  };
  return (
    <div>
      <Dialog
        fullScreen
        open={open}
        onClose={handleClose}
        TransitionComponent={Transition}
      >
        <AppBar sx={{ position: 'relative' }}>
          <Toolbar>
            <IconButton
              edge="start"
              color="inherit"
              onClick={handleClose}
              aria-label="close"
            >
              <CloseIcon />
            </IconButton>
            <Typography sx={{ ml: 2, flex: 1 }} variant="h6" component="div">
              Où se trouve ?
            </Typography>
            <AutocompleteGoogleMaps
              onSelect={(localisation) => {
                console.log(localisation);
                getPlaceDetails(localisation?.place_id);
              }}
            />
            <Button autoFocus color="inherit" onClick={handleCloseOk}>
              Valider
            </Button>
          </Toolbar>
        </AppBar>
        {
          <LoadScript
            key={`google-maps`}
            googleMapsApiKey={GOOGLE.MAPS_API_KEY}
            libraries={['places']}
          >
            <GoogleMap
              mapContainerStyle={containerStyle}
              center={{ lat: center.lat, lng: center.lng }}
              zoom={zoom}
              onLoad={onLoad}
              onUnmount={onUnmount}
              onClick={onMapClick}
            >
              {marker && (
                <Marker
                  key={`${marker.lat}-${marker.lng}`}
                  position={{ lat: marker.lat, lng: marker.lng }}
                />
              )}
              <></>
            </GoogleMap>
          </LoadScript>
        }
      </Dialog>
    </div>
  );
}
