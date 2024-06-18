import React, { useState } from 'react';
import { Paper } from '@mui/material';
import { useLazyQuery } from '@apollo/client';
import ListComments from './ListComments';
import InputSendComment from './InputSendComment';
import { GET_TICKET_COMMENTS } from '../../../../../../_shared/graphql/queries/CommentsQueries';
import { ON_COMMENT_ADDED, ON_COMMENT_DELETED } from '../../../../../../_shared/graphql/subscriptions/CommentSubscriptions';

export default function TicketChat({ticket}){
  const [getComments, 
    {   loading: loadingComments,
        data: commentsData,
        error: commentsError,
        fetchMore:  fetchMoreComments,
        subscribeToMore : subscribeToMoreComments
    }] = useLazyQuery(GET_TICKET_COMMENTS, {variables:{ticketId : ticket?.id }})

const onSubscribeToMoreComments = ()=>{
                                  subscribeToMoreComments({
                                    variables : { ticketId : ticket.id },
                                    document: ON_COMMENT_ADDED,
                                    updateQuery: (prev, { subscriptionData }) => {
                                          // console.log('subscriptionData ON_COMMENT_ADDED ** :', subscriptionData.data.onCommentAdded.comment)
                                          if (!subscriptionData.data) return prev;
                                          const newCommentItem = subscriptionData.data.onCommentAdded.comment;
                                          if (prev.ticketComments.nodes.map((n)=> n.id).includes(newCommentItem.id)) return prev;
                                          return Object.assign({}, prev, {
                                                      ticketComments: {
                                                          ...prev.ticketComments,
                                                          nodes : [...prev.ticketComments.nodes, newCommentItem],
                                                          totalCount : prev.ticketComments.totalCount + 1,
                                                      }
                                                  });
                                    },
                                  })
                                  subscribeToMoreComments({
                                    variables : { ticketId : ticket.id },
                                    document: ON_COMMENT_DELETED,
                                    updateQuery: (prev, { subscriptionData }) => {
                                      // console.log('subscriptionData ON_COMMENT_DELETED ** :', subscriptionData.data.onCommentDeleted.comment)
                                      if (!subscriptionData.data) return prev;
                                      const deletedComment = subscriptionData.data.onCommentDeleted.comment;
                                      if (!prev.ticketComments.nodes.map((n )=> n.id).includes(deletedComment.id)) return prev;
                                      return Object.assign({}, prev, {
                                                ticketComments: {
                                                    ...prev.ticketComments,
                                                    nodes: prev.ticketComments.nodes.filter((comment) => comment.id !== deletedComment.id),
                                                    totalCount: prev.ticketComments.totalCount - 1,
                                                },
                                              });
                                    },
                                  })
                                }
  React.useEffect(()=>{
        if(ticket && ticket.id){
            onSubscribeToMoreComments()
        }
    }, [ticket])

  return (
    <Paper elevation={0} style={{ width: '100%', padding: 0, margin: 'auto', marginTop: 0 }}>
        <ListComments comments={commentsData?.ticketComments?.nodes || []}/>
        <InputSendComment ticket={ticket}/>
    </Paper>
  );
};
