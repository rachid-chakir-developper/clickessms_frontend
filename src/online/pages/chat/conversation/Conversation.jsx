import React from 'react';
import { Box, Typography, Divider } from '@mui/material';
import { useParams } from 'react-router-dom';
import SendMessageInput from './SendMessageInput';
import Messages from './Messages';

const Conversation = () => {
  let { chatId, recipientId } = useParams();
  return (
    <Box  sx={{ position : 'relative',}}>
      <Typography variant="h5" gutterBottom>
        {/* Conversation */}
      </Typography>
      <Messages chatId={chatId} recipientId={recipientId}/>
      <Box sx={{ position : 'absolute', width : '100%', padding: 0, backgroundColor: '#ffffff'}}>
          <Divider sx={{ my: 2 }} />
          <SendMessageInput chatId={chatId} recipientId={recipientId} />
      </Box>
    </Box>
  );
};

export default Conversation;
