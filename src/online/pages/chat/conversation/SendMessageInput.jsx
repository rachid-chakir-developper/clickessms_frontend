import React, { useState } from 'react';
import { TextField, Button, Box, IconButton } from '@mui/material';
import { Send } from '@mui/icons-material';
import { useMutation } from '@apollo/client';
import { useFeedBacks } from '../../../../_shared/context/feedbacks/FeedBacksProvider';
import { POST_MESSAGE } from '../../../../_shared/graphql/mutations/ChatMutations';

const SendMessageInput = ({ chatId, recipientId }) => {
  const [newMessage, setNewMessage] = useState('');
  const { setNotifyAlert, setConfirmDialog } = useFeedBacks();

  const [createMessage, { loading: loadingPost }] = useMutation(POST_MESSAGE, {
    onCompleted: (datas) => {
      // console.log('datas.createMessage', datas.createMessage)
      if (datas.createMessage.done) {
        setNotifyAlert({
          isOpen: true,
          message: 'Envoyé avec succès',
          type: 'success',
        });
      } else {
        setNotifyAlert({
          isOpen: true,
          message: `Non envoyé ! ${datas.createMessage.messageResponse}.`,
          type: 'error',
        });
      }
    },
    onError: (err) => {
      console.log(err);
      setNotifyAlert({
        isOpen: true,
        message: 'Non envoyé ! Veuillez réessayer.',
        type: 'error',
      });
    },
  });

  const handleSendMessage = () => {
    if (newMessage.trim() !== '') {
      const messageData = {
        text: newMessage,
        conversation: chatId,
        recipient: recipientId,
      };
      createMessage({ variables: { messageData } });
      setNewMessage('');
    }
  };

  return (
    <Box display="flex" alignItems="center">
      <TextField
        label="Tapez votre message..."
        variant="outlined"
        fullWidth
        value={newMessage}
        onChange={(e) => setNewMessage(e.target.value)}
        disabled={loadingPost}
      />
      <IconButton onClick={handleSendMessage}>
        <Send />
      </IconButton>
    </Box>
  );
};

export default SendMessageInput;
