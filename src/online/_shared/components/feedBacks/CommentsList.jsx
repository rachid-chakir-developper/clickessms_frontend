import * as React from 'react';
import List from '@mui/material/List';
import CommentItem from './CommentItem';
import { Alert, Typography } from '@mui/material';

export default function CommentsList({comments = [], loading=false}) {
  return (
    <>
        <Typography variant="h6" component="div">
            Commentaires:
        </Typography>
        <List sx={{ width: '100%', bgcolor: 'background.paper' }}>
            {comments?.length < 1 && !loading && <Alert severity="warning">La liste est vide pour le moment !</Alert>}
            {comments?.map((comment, index) => (
                <CommentItem key={index} comment={comment}/>
            ))}
        </List>
    </>
  );
}
