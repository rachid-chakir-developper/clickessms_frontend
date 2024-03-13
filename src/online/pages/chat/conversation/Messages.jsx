import React from 'react';
import { Box } from '@mui/material';
import ListMessages from './ListMessages';

const Messages = ({chatId, recipientId}) => {
  // Définissez votre état des messages et les fonctions associées ici

  return (
    <Box>
      <ListMessages chatId={chatId} recipientId={recipientId} />
    </Box>
  );
};

export default Messages;
