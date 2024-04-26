import React from 'react';
import { List } from '@mui/material';
import { useLazyQuery } from '@apollo/client';
import { Link } from 'react-router-dom';

import ListChatItem from './ListChatItem';
import { GET_CONVERSATIONS } from '../../../_shared/graphql/queries/ChatQueries';

const ListChat = () => {
  const [loadingMore, setLoadingMore] = React.useState(false);
  const [
    getConversations,
    {
      loading: loadingConversations,
      data: conversationsData,
      error: conversationsError,
      fetchMore: fetchMoreConversations,
    },
  ] = useLazyQuery(GET_CONVERSATIONS, { variables: { page: 1, limit: 10 } });

  React.useEffect(() => {
    getConversations();
  }, []);

  const loadMoreConversations = () => {};
  return (
    <List>
      {conversationsData?.conversations?.nodes?.map((conversation, index) => (
        <Link
          to={`/online/chat/conversation/${conversation?.id}`}
          className="no_style"
        >
          <ListChatItem key={index} conversation={conversation} />
        </Link>
      ))}
    </List>
  );
};

export default ListChat;
