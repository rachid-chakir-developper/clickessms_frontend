import * as React from 'react';
import { Badge, IconButton, Tooltip } from '@mui/material';
import { useLazyQuery } from '@apollo/client';
import MailIcon from '@mui/icons-material/Mail';
import { Link } from 'react-router-dom';
import { GET_CONVERSATIONS } from '../../../../_shared/graphql/queries/ChatQueries';

export default function ChatPanel() {
  const [
    getConversations,
    {
      loading: loadingConversations,
      data: conversationsData,
      error: conversationsError,
      fetchMore: fetchMoreConversations,
      subscribeToMore: subscribeToMoreConversation,
    },
  ] = useLazyQuery(GET_CONVERSATIONS, { variables: { page: 1, limit: 10 } });

  // subscribeToMoreConversation({
  //     document: ON_CONVERSATION_ADDED,
  //     updateQuery: (prev, { subscriptionData }) => {
  //     console.log('subscriptionData', subscriptionData)
  //     if (!subscriptionData.data) return prev;
  //     const newConversationItem = subscriptionData.data.onConversationAdded.conversation;
  //     if (prev.conversations.nodes.map(n => n.id).includes(newConversationItem.id)) return prev;
  //     // setNotifyAlert({
  //     //     isOpen: true,
  //     //     message: newConversationItem.message,
  //     //     type: 'warning'
  //     // })
  //     return Object.assign({}, prev, {
  //         conversations: {...prev.conversations,
  //                         nodes : [newConversationItem, ...prev.conversations.nodes],
  //                         totalCount : prev.conversations.totalCount + 1,
  //                         notSeenCount : prev.conversations.notSeenCount + 1
  //                     }
  //     });
  //     }
  // })

  React.useEffect(() => {
    getConversations();
  }, []);
  return (
    <div>
      <Tooltip title="chat">
        <Link to="/online/chat/" className="no_style">
          <IconButton size="large" color="inherit">
            <Badge
              badgeContent={conversationsData?.conversations?.notSeenCount}
              color="error"
            >
              <MailIcon />
            </Badge>
          </IconButton>
        </Link>
      </Tooltip>
    </div>
  );
}
