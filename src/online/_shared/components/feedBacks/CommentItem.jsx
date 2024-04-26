import * as React from 'react';
import ListItem from '@mui/material/ListItem';
import Divider from '@mui/material/Divider';
import ListItemText from '@mui/material/ListItemText';
import ListItemAvatar from '@mui/material/ListItemAvatar';
import Avatar from '@mui/material/Avatar';
import Typography from '@mui/material/Typography';
import { getFormatDateTime } from '../../../../_shared/tools/functions';

export default function CommentItem({ comment }) {
  return (
    <>
      <ListItem alignItems="flex-start">
        <ListItemAvatar>
          <Avatar
            alt={`${comment?.creator?.firstName} ${comment?.creator?.lastName} `}
            src={comment?.creator?.employee?.photo}
          />
        </ListItemAvatar>
        <ListItemText
          primary={comment?.text}
          secondary={
            <React.Fragment>
              <Typography
                sx={{ display: 'inline', fontSize: 12 }}
                component="span"
                variant="body2"
                color="text.primary"
              >
                {`${comment?.creator?.firstName} ${comment?.creator?.lastName} `}
              </Typography>
              <small>{getFormatDateTime(comment?.createdAt)}</small>
            </React.Fragment>
          }
        />
      </ListItem>
      <Divider variant="inset" component="li" />
    </>
  );
}
