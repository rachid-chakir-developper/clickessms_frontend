import * as React from 'react';
import List from '@mui/material/List';
import ListItem from '@mui/material/ListItem';
import ListItemText from '@mui/material/ListItemText';
import ListItemAvatar from '@mui/material/ListItemAvatar';
import Avatar from '@mui/material/Avatar';
import Typography from '@mui/material/Typography';
import { Skeleton } from '@mui/material';

export default function SearchResultsSkeleton() {
  return (
    <List sx={{ width: '100%', maxWidth: 360, bgcolor: 'background.paper' }}>
      <ListItem alignItems="flex-start">
        <ListItemAvatar>
          <Avatar>
            <Skeleton animation="wave" variant="circle" width={40} height={40} />
          </Avatar>
        </ListItemAvatar>
        <ListItemText
          primary={<Skeleton animation="wave" height={20} width="80%" style={{ marginBottom: 6 }} />}
          secondary={
            <React.Fragment>
              <Typography
                sx={{ display: 'inline' }}
                component="span"
                variant="body2"
                color="text.primary"
              >
                <Skeleton animation="wave" height={10} width="70%" />
              </Typography>
              {<Skeleton animation="wave" height={10} width="40%" />}
            </React.Fragment>
          }
        />
      </ListItem>
    </List>
  );
}
