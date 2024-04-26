import * as React from 'react';
import List from '@mui/material/List';
import ListItem from '@mui/material/ListItem';
import Divider from '@mui/material/Divider';
import ListItemText from '@mui/material/ListItemText';
import ListItemAvatar from '@mui/material/ListItemAvatar';
import Avatar from '@mui/material/Avatar';
import Typography from '@mui/material/Typography';
import { getFormatDateTime } from '../../../../_shared/tools/functions';

export default function TaskWorkersList({ workers }) {
  return (
    <List sx={{ width: '100%', maxWidth: 360, bgcolor: 'background.paper' }}>
      {workers?.map((worker, index) => (
        <ListItem alignItems="flex-start" key={index}>
          <ListItemAvatar>
            <Avatar alt="Remy Sharp" src={worker?.employee?.photo} />
          </ListItemAvatar>
          <ListItemText
            primary={`${worker?.employee?.firstName} ${worker?.employee?.lastName}`}
            secondary={
              <React.Fragment>
                <Typography
                  sx={{ display: 'block' }}
                  component="span"
                  variant="body2"
                  color="text.primary"
                >
                  {worker?.employee?.email}
                </Typography>
                {`Affecté le ${getFormatDateTime(worker?.createdAt)}`}
              </React.Fragment>
            }
          />
        </ListItem>
      ))}
      <Divider variant="inset" component="li" />
    </List>
  );
}
