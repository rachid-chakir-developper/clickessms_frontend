import * as React from 'react';
import { useLazyQuery, useMutation } from '@apollo/client';
import { GET_MSG_NOTIFICATIONS } from '../../../../../_shared/graphql/queries/MessageNotificationQueries';
import { ON_MSG_NOTIFICATION_ADDED } from '../../../../../_shared/graphql/subscriptions/MessageNotificationSubscriptions';
import { useFeedBacks } from '../../../../../_shared/context/feedbacks/FeedBacksProvider';
import { MARK_MSG_NOTIFICATIONS_AS_SEEN } from '../../../../../_shared/graphql/mutations/MessageNotificationMutations';
import MessageNotificationsPopover from './MessageNotificationsPopover';

export default function MessageNotificationPanel() {
  const { setNotifyAlert, setMessageNotificationModal } = useFeedBacks();
  const [page, setPage] = React.useState(1);

  const [markMessageNotificationsAsSeen, { loading: loadingMarskAsSeen }] =
    useMutation(MARK_MSG_NOTIFICATIONS_AS_SEEN, {
      onCompleted: (datas) => {
        if (datas.markMessageNotificationsAsSeen.done) {
          console.log('Lues avec succès');
        } else {
          console.warn(`Non lues ! ${datas.markMessageNotificationsAsSeen.message}.`);
        }
      },
      onError: (err) => {
        console.log(err);
        console.error('Non lues ! Veuillez réessayer.');
      },
    });

  const [
    getMessageNotifications,
    {
      loading: loadingMessageNotifications,
      data: messageNotificationsData,
      error: messageNotificationsError,
      fetchMore: fetchMoreMessageNotifications,
      subscribeToMore: subscribeToMoreMessageNotification,
    },
  ] = useLazyQuery(GET_MSG_NOTIFICATIONS, {
      variables: { page, limit: 6 },
      onCompleted: (data) => {
        console.log(data);
        onOpenMessageNotificationModal(data.messageNotifications.nodes)
      }
    }
  );
  

  subscribeToMoreMessageNotification({
    document: ON_MSG_NOTIFICATION_ADDED,
    updateQuery: (prev, { subscriptionData }) => {
      console.log('subscriptionData', subscriptionData);
      if (!subscriptionData.data) return prev;
      const newMessageNotificationItem =
        subscriptionData.data.onMessageNotificationAdded.messageNotification;
      if (
        prev.messageNotifications.nodes
          .map((n) => n.id)
          .includes(newMessageNotificationItem.id)
      )
        return prev;
      setNotifyAlert({
        isOpen: true,
        message: newMessageNotificationItem.message,
        type: 'warning',
      });
      return Object.assign({}, prev, {
        messageNotifications: {
          ...prev.messageNotifications,
          nodes: [newMessageNotificationItem, ...prev.messageNotifications.nodes],
          totalCount: prev.messageNotifications.totalCount + 1,
          notSeenCount: prev.messageNotifications.notSeenCount + 1,
        },
      });
    },
  });

  // Utiliser fetchMoreMessageNotifications pour charger plus de données
  const loadMoreMessageNotification = () => {
    if (
      !loadingMessageNotifications &&
      messageNotificationsData?.messageNotifications?.nodes &&
      messageNotificationsData?.messageNotifications?.nodes.length >= 6 &&
      messageNotificationsData?.messageNotifications?.totalCount / 6 > page
    ) {
      fetchMoreMessageNotifications({
        variables: {
          page: page + 1,
        },
        updateQuery: (prev, { fetchMoreResult }) => {
          if (
            !fetchMoreResult ||
            !fetchMoreResult?.messageNotifications ||
            !fetchMoreResult?.messageNotifications?.nodes
          )
            return prev;
          setPage(page + 1);
          return {
            messageNotifications: {
              ...fetchMoreResult?.messageNotifications,
              nodes: [
                ...prev.messageNotifications?.nodes,
                ...fetchMoreResult?.messageNotifications?.nodes,
              ],
              totalCount: fetchMoreResult.messageNotifications.totalCount,
              notSeenCount: fetchMoreResult.messageNotifications.notSeenCount,
            },
          };
        },
      }).then(() => onMarkMessageNotificationsAsSeen());
    }
  };
  const onMarkMessageNotificationsAsSeen = () => {
    if (
      messageNotificationsData?.messageNotifications?.nodes?.filter((n) => !n.isSeen).length >
      0
    ) {
      markMessageNotificationsAsSeen({
        variables: {
          ids: messageNotificationsData?.messageNotifications?.nodes
            ?.filter((n) => !n.isSeen)
            .map((n) => n?.id),
        },
      });
    }
  };
  const onOpenMessageNotificationModal  = (data) => {
    setMessageNotificationModal({
      isOpen: true,
      data,
      onClose: () => {
        setMessageNotificationModal({ isOpen: false });
      },
    });
  };
  React.useEffect(() => {
    getMessageNotifications()
  }, []);
  

  return (
    <MessageNotificationsPopover
      messageNotifications={messageNotificationsData?.messageNotifications?.nodes}
      notSeenCount={messageNotificationsData?.messageNotifications?.notSeenCount}
      loading={loadingMessageNotifications}
      loadMoreMessageNotification={loadMoreMessageNotification}
      onMarkMessageNotificationsAsSeen={onMarkMessageNotificationsAsSeen}
    />
  );
}
