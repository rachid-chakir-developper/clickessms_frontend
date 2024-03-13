import React from 'react';
import { List, Divider, Box, CircularProgress } from '@mui/material';
import ListMessagesItem from './ListMessagesItem'; // Assurez-vous d'importer le composant approprié
import { useLazyQuery } from '@apollo/client';
import { GET_MESSAGES } from '../../../../_shared/graphql/queries/ChatQueries';
import { ON_MESSAGE_ADDED } from '../../../../_shared/graphql/subscriptions/ChatSubscriptions';

const ListMessages = ({chatId, recipientId}) => {
  
    const [loadingMore, setLoadingMore] = React.useState(false);
    const [isMessagesLoaded, setIsMessagesLoaded] = React.useState(false);
    const scrollViewRef = React.useRef(null);
    const [getMessages, { 
      loading: loadingMessages, 
      data: messagesData, 
      error: messagesError,
      subscribeToMore : subscribeToMoreMessages, 
      fetchMore:  fetchMoreMessages 
    }] = useLazyQuery(GET_MESSAGES, { variables: { conversationId : chatId, participantId : recipientId, offset: 0, limit: 10 }})
    
    const messagesEndRef = React.useRef(null);

    const scrollToBottom = () => {
        messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
    };

    const handleScroll = (event) => {
        const { scrollTop } = event.currentTarget;
    
        if (scrollTop === 0 && !loadingMore) {
          setLoadingMore(true);
          loadMoreMessages()
        }
    };

    React.useEffect(() => {
        scrollToBottom();
    }, [messagesData]);

    React.useEffect(() => {
      getMessages()
      if (chatId) onSubscribeToMoreMessages();
  
      // Cleanup function to unsubscribe when the component unmounts
      return () => {
        if (chatId) {
          onUnsubscribeToMoreMessages();
        }
      };
    }, [chatId, recipientId]);
    const onSubscribeToMoreMessages = ()=>{
      subscribeToMoreMessages({
        variables : { conversationId : chatId },
        document: ON_MESSAGE_ADDED,
        updateQuery: (prev, { subscriptionData }) => {
          console.log('subscriptionData ON_MESSAGE_ADDED ** :', subscriptionData.data.onMessageAdded.message)
          if (!subscriptionData.data) return prev;
          const newMessageItem = subscriptionData.data.onMessageAdded.message;
          if (prev.messages.nodes.map((n)=> n.id).includes(newMessageItem.id)) return prev;
          return Object.assign({}, prev, {
            messages: {...prev.messages,
                            nodes : [...prev.messages.nodes, newMessageItem],
                            totalCount : prev.messages.totalCount + 1,
                            // notSeenCount : prev.messages.notSeenCount + 1
                          }
          });
        }
      })
    }
    const onUnsubscribeToMoreMessages = () => {
      // Implement your logic to unsubscribe from the subscription
      // For example, you can use a function provided by Apollo Client to unsubscribe
      // apolloClient.unsubscribe(handle);
    };
  
    const loadMoreMessages = () => {
      if(!loadingMessages && !loadingMore && messagesData?.messages?.nodes){
        setLoadingMore(true);
        fetchMoreMessages({
          variables: {
            limit: 10,
            offset: messagesData?.messages?.nodes?.length
          },
          updateQuery: (prev, { fetchMoreResult }) => {
            setLoadingMore(false);
            if (!fetchMoreResult || !fetchMoreResult?.messages || !fetchMoreResult?.messages?.nodes) return prev;
            return {
              messages: {
                ...fetchMoreResult?.messages,
                nodes: [...fetchMoreResult?.messages?.nodes, ...prev.messages?.nodes],
                totalCount : fetchMoreResult?.messages?.totalCount
              },
            };
          },
        }).then(() => {} );
      }
    };
  return (
    <Box sx={{ height: 'calc( 100vh - 250px )', maxHeight: 'calc( 100vh - 250px )', overflow: 'auto', width : '100%', padding: 10}}
        onScroll={handleScroll}
        >
            {loadingMore && (
                <Box display="flex" justifyContent="center" my={2}>
                    <CircularProgress />
                </Box>
            )}
            <List>
            {messagesData?.messages?.nodes?.map((message, index) => (
                <React.Fragment key={index}>
                <ListMessagesItem message={message} />
                </React.Fragment>
            ))}
            </List>
            <div ref={messagesEndRef} />
    </Box>
  );
};

export default ListMessages;
