import React, { useState } from 'react';
import { TextField, Button, Box } from '@mui/material';
import SendIcon from '@mui/icons-material/Send';
import { POST_COMMENT } from '../../../../../../_shared/graphql/mutations/CommentMutations';
import { useMutation } from '@apollo/client';

export default function InputSendComment({ticket}){

    const [createComment, { loading : loadingCommentPost }] = useMutation(POST_COMMENT, {
        onCompleted: (data) => {
            console.log(data);
            //let { __typename, ...commentCopy } = data.createComment.comment;
        },
        onError: (err) => {
            console.warn(err)
        },
    })
  const [newComment, setNewComment] = useState('');

  const handleSendComment = () => {
    if (newComment.trim() === '') return;
    createComment({ 
        variables: {
            ticketId : ticket?.id,
            commentData : {text: newComment},
        } 
    })
    setNewComment('');
  };

  return (
        <Box style={{ display: 'flex', alignItems: 'end', marginTop: 60 }}>
            <TextField
                fullWidth
                multiline
                variant="outlined"
                label="Tapez votre comment..."
                value={newComment}
                onChange={(e) => setNewComment(e.target.value)}
            />
            <Button
            variant="contained"
            color="primary"
            onClick={handleSendComment}
            endIcon={<SendIcon />}
            style={{ marginLeft: 8 }}
            >
            Envoyer
            </Button>
        </Box>
  );
};
