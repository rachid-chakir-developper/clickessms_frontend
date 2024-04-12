import React from 'react';
import { ListItem, ListItemAvatar, Avatar, ListItemText, IconButton } from '@mui/material';
import { Check } from '@mui/icons-material';

const ListMessagesItem = ({ message }) => {
  const formattedTime = new Date().toLocaleTimeString();
  const { sender, isSentByMe, isRead } = message;

  return (
    <ListItem
      sx={{
        justifyContent: isSentByMe ? 'flex-end' : 'flex-start',
        textAlign: isSentByMe ? 'right' : 'left',
      }}
    >
      <ListItemAvatar>
        {!isSentByMe && (
          <Avatar
            src={sender?.photo ? sender?.photo : '/default-placeholder.jpg'}
          >
            {`${sender?.firstName.charAt(0)} ${sender?.lastName.charAt(0)}`}
          </Avatar>
        )}
      </ListItemAvatar>
      <ListItemText
        primary={message.text}
        secondary={formattedTime}
        sx={{
          color: isSentByMe ? '#000' : '#000',
          textAlign: isSentByMe ? 'right' : 'left',
          position: 'relative',
          backgroundColor: isSentByMe ? '#DCF8C6' : '#E3F2FD',
          padding: '20px',
          flex: 'initial',
          borderRadius : '20px 20px'
        }}
      />
      {isSentByMe && isRead && (
        <IconButton sx={{ position: 'absolute', bottom: 10, right: 10, color: '#4CAF50' }}>
          <Check />
        </IconButton>
      )}
      {isSentByMe && !isRead && (
        <IconButton sx={{ position: 'absolute', bottom: 10, right: 10, color: '#9E9E9E' }}>
          <Check />
        </IconButton>
      )}
    </ListItem>
  );
};

export default ListMessagesItem;
