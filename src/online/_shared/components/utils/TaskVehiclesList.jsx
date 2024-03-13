import * as React from 'react';
import List from '@mui/material/List';
import ListItem from '@mui/material/ListItem';
import Divider from '@mui/material/Divider';
import ListItemText from '@mui/material/ListItemText';
import ListItemAvatar from '@mui/material/ListItemAvatar';
import Avatar from '@mui/material/Avatar';
import Typography from '@mui/material/Typography';
import { getFormatDateTime } from '../../../../_shared/tools/functions';

export default function TaskVehiclesList({vehicles}) {
  return (
    <List sx={{ width: '100%', maxWidth: 360, bgcolor: 'background.paper' }}>
        {vehicles?.map((vehicle, index) => (
        <ListItem alignItems="flex-start" key={index}>
            <ListItemAvatar>
            <Avatar alt="Remy Sharp" src={vehicle?.vehicle?.image} />
            </ListItemAvatar>
            <ListItemText
                primary={vehicle?.vehicle?.name}
                secondary={
                    <React.Fragment>
                    <Typography
                        sx={{ display: 'block' }}
                        component="span"
                        variant="body2"
                        color="text.primary"
                    >
                        {vehicle?.vehicle?.registrationNumber}
                    </Typography>
                    {`Affecté le ${getFormatDateTime(vehicle?.createdAt)}`}
                    </React.Fragment>
                }
            />
        </ListItem>
        ))}
         <Divider variant="inset" component="li" />
    </List>
  );
}
