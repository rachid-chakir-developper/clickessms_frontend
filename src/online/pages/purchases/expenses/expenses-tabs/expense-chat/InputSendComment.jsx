import React, { useState } from 'react';
import { TextField, Button, Box, IconButton, Tooltip } from '@mui/material';
import SendIcon from '@mui/icons-material/Send';
import { POST_COMMENT } from '../../../../../../_shared/graphql/mutations/CommentMutations';
import { useMutation } from '@apollo/client';
import { Send } from '@mui/icons-material';

export default function InputSendComment({type, expense, onCommentSent}){

    const [createComment, { loading : loadingCommentPost }] = useMutation(POST_COMMENT, {
        onCompleted: (data) => {
            console.log(data);
            let { __typename, ...commentCopy } = data.createComment.comment;
            if(commentCopy && onCommentSent) onCommentSent()
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
            expenseId : expense?.id,
            commentData : {text: newComment},
        } 
    })
    setNewComment('');
  };

  return (
        <Box style={{ display: 'flex', alignItems: 'center', marginTop: 20 }}>
            <TextField
                fullWidth
                multiline
                variant="outlined"
                label="Tapez votre commentaire..."
                value={newComment}
                onChange={(e) => setNewComment(e.target.value)}
            />
            {
                type !== 'iconButton' ? <Button
                    variant="contained"
                    color="primary"
                    onClick={handleSendComment}
                    endIcon={<SendIcon />}
                    style={{ marginLeft: 8 }}
                >
                Envoyer
                </Button> :
                <Tooltip title="Envoyer">
                    <IconButton
                        color="primary"
                        onClick={handleSendComment}
                        style={{ marginLeft: 8 }}
                    >
                    <Send />
                </IconButton>
            </Tooltip>
            }
        </Box>
  );
};
