import React from 'react';
import { GoogleMap, OverlayView, useJsApiLoader, Marker } from '@react-google-maps/api';
import { Paper, Grid, Avatar, Typography, Badge, IconButton } from '@mui/material';
import { GOOGLE } from '../../../_shared/tools/constants';
import { Construction, Engineering } from '@mui/icons-material';
import { getFormatDateTime } from '../../../_shared/tools/functions';

const AppMap = ({ tasks = [], users = [] }) => {
  const mapContainerStyle = {
    width: '100%',
    height: 'calc( 100vh - 115px )',
  };
  const { isLoaded } = useJsApiLoader({
    id: 'google-maps',
    googleMapsApiKey: GOOGLE.MAPS_API_KEY,
  })

  const [map, setMap] = React.useState(null);

  const onLoad = React.useCallback(
    function callback(map) {
      // This is just an example of getting and using the map instance!!! don't just blindly copy!
      const bounds = new window.google.maps.LatLngBounds(center);
      map.fitBounds(bounds);

      setMap(map);
    },
    []
  );

  const onUnmount = React.useCallback(
    function callback(map) {
      setMap(null);
    },
    []
  );

  const [zoom, setZoom] = React.useState(10);

  const handleZoomChanged = () => {
    if (isLoaded) {
      try{
        const newZoom = map.getZoom();
        console.log('map newZoom', newZoom)
        setZoom(newZoom);
      }
      catch(err){
        console.log(err)
      }
    }
  };

  const center = (tasks.length > 0 ) ? { lat: Number(tasks[0].latitude), lng: Number(tasks[0].longitude) } : { lat: 48.8566, lng: 2.3522 }; 
  //const center = (users.length > 0 ) ? { lat: Number(users[0].currentLatitude), lng: Number(users[0].currentLongitude) } : { lat: 48.8566, lng: 2.3522 }; 
  //const center = { lat: 48.8566, lng: 2.3522 }; // Coordonnées du centre de la carte (Paris, France)
  return (
    <Grid container spacing={3}>
      <Grid item xs={12}>
        <Paper variant="outlined">
          { isLoaded && <GoogleMap
            mapContainerStyle={mapContainerStyle}
            center={center}
            zoom={zoom}
            onZoomChanged={handleZoomChanged}
            onLoad={onLoad}
            onUnmount={onUnmount}
          >
            {/* Marqueurs pour les tasks */}
            { 
              tasks &&
              tasks.map((task, index) => (
                <TaskMarker key={`task-${index}`} position={{ lat: Number(task.latitude), lng: Number(task.longitude) }} task={task} />
              ))
            }
            {/* Marqueurs pour les users */}
            {
            users &&
            users.map((user, index) => (
              <UserMarker key={index} position={{ lat: Number(user.currentLatitude), lng: Number(user.currentLongitude) }} user={user} />
            ))
            }
            </GoogleMap>}
        </Paper>
      </Grid>
    </Grid>
  );
};

const UserMarker = ({ position, user }) => {
  const overlayRef = React.useRef(null);

  React.useEffect(() => {
    try{
      const overlay = overlayRef.current;
      if (overlay && overlay?.getProjection()) {
        const positionPixel = overlay?.getProjection()?.fromLatLngToDivPixel(position);
        overlay.style.left = `${positionPixel.x}px`;
        overlay.style.top = `${positionPixel.y}px`;
      }
    }
    catch(err){
      //console.log(err)
    }
  }, [position]);

  return (
    <OverlayView
      position={position}
      mapPaneName={OverlayView.OVERLAY_MOUSE_TARGET}
      getPixelPositionOffset={() => ({ x: 0, y: 0 })}
      onLoad={() => {}}
      onUnmount={() => {}}
    >
      <div ref={overlayRef} style={{ position: 'absolute', width: '60px', height: '60px', borderRadius: '50%' }}>
        <Badge
            overlap="circular"
            anchorOrigin={{ vertical: 'bottom', horizontal: 'left' }}
            badgeContent={
              <IconButton color="info" sx={{ backgroundColor : "#fff !important", border: "2px solid #ccc" }} aria-label="Construction">
                <Engineering />
              </IconButton>
            }
          >
          <Avatar src={user?.employee ? user?.employee?.photo : user?.photo} alt={user?.username} 
            sx={{ width: '60px', height: '60px', border: "3px solid #ff0" }} />
        </Badge>
        <Paper sx={{position: 'absolute', zIndex : 1, width : '140px', p: 1 }}>
          <Typography  variant="h6" component="h2" sx={{ fontSize: 12}}>
            {user?.employee ? `${user?.employee?.firstName} ${user?.employee?.lastName}` : `${user?.firstName} ${user?.lastName}`}
          </Typography>
        </Paper>
      </div>
    </OverlayView>
  );
};

const TaskMarker = ({ position, task }) => {
  const overlayRef = React.useRef(null);

  React.useEffect(() => {
    try{
      const overlay = overlayRef.current;
      if (overlay && overlay?.getProjection()) {
        const positionPixel = overlay?.getProjection()?.fromLatLngToDivPixel(position);
        overlay.style.left = `${positionPixel.x}px`;
        overlay.style.top = `${positionPixel.y}px`;
      }
    }
    catch(err){
      //console.log(err)
    }
  }, [position]);

  return (
    <OverlayView
      position={position}
      mapPaneName={OverlayView.OVERLAY_MOUSE_TARGET}
      getPixelPositionOffset={() => ({ x: 0, y: 0 })}
      onLoad={() => {}}
      onUnmount={() => {}}
    >
      <div ref={overlayRef} style={{ position: 'absolute', width: '60px', height: '60px', borderRadius: '50%' }}>
        <Badge
          overlap="circular"
          anchorOrigin={{ vertical: 'top', horizontal: 'left' }}
          badgeContent={
            <IconButton color="info" sx={{ backgroundColor : "#fff !important", border: "2px solid #ccc" }} aria-label="Construction">
              <Construction />
            </IconButton>
          }
        >
          <Avatar src={task?.image} alt={task?.name} 
           sx={{ width: '60px', height: '60px', border: "3px solid #f00" }} />
        </Badge>
        <Paper sx={{ position: 'absolute', zIndex : 1, width : '140px', p: 1 }}>
          <Typography  variant="h6" component="h2" sx={{ fontSize: 12}}>
            {task?.name}
          </Typography>
          <Typography variant="body2" color="text.secondary" sx={{ fontSize: 10}}>
            <b>Date début prévue: </b> {`${getFormatDateTime(task?.startingDateTime)}`} <br />
            <b>Date début: </b>{`${getFormatDateTime(task?.startingDateTime)}`}
          </Typography>
        </Paper>
      </div>
    </OverlayView>
  );
};

export default AppMap;