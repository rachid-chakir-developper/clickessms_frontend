import * as React from 'react';
import { useLazyQuery, useMutation } from '@apollo/client';
import { GET_NOTIFICATIONS } from '../../../../_shared/graphql/queries/NotificationQueries';
import { ON_NOTIFICATION_ADDED } from '../../../../_shared/graphql/subscriptions/NotificationSubscriptions';
import { useFeedBacks } from '../../../../_shared/context/feedbacks/FeedBacksProvider';
import { MARK_NOTIFICATIONS_AS_SEEN } from '../../../../_shared/graphql/mutations/NotificationMutations';
import NotificationsPopover from './NotificationsPopover';

export default function NotificationPanel() {
  const { setNotifyAlert, setConfirmDialog } = useFeedBacks();
  const [page, setPage] = React.useState(1);

  const [markNotificationsAsSeen, { loading: loadingMarskAsSeen }] =
    useMutation(MARK_NOTIFICATIONS_AS_SEEN, {
      onCompleted: (datas) => {
        if (datas.markNotificationsAsSeen.done) {
          console.log('Lues avec succès');
        } else {
          console.warn(`Non lues ! ${datas.markNotificationsAsSeen.message}.`);
        }
      },
      onError: (err) => {
        console.log(err);
        console.error('Non lues ! Veuillez réessayer.');
      },
    });

  const [
    getNotifications,
    {
      loading: loadingNotifications,
      data: notificationsData,
      error: notificationsError,
      fetchMore: fetchMoreNotifications,
      subscribeToMore: subscribeToMoreNotification,
    },
  ] = useLazyQuery(GET_NOTIFICATIONS, { variables: { page, limit: 6 } });

  subscribeToMoreNotification({
    document: ON_NOTIFICATION_ADDED,
    updateQuery: (prev, { subscriptionData }) => {
      console.log('subscriptionData', subscriptionData);
      if (!subscriptionData.data) return prev;
      const newNotificationItem =
        subscriptionData.data.onNotificationAdded.notification;
      if (
        prev.notifications.nodes
          .map((n) => n.id)
          .includes(newNotificationItem.id)
      )
        return prev;
      setNotifyAlert({
        isOpen: true,
        message: newNotificationItem.message,
        type: 'warning',
      });
      return Object.assign({}, prev, {
        notifications: {
          ...prev.notifications,
          nodes: [newNotificationItem, ...prev.notifications.nodes],
          totalCount: prev.notifications.totalCount + 1,
          notSeenCount: prev.notifications.notSeenCount + 1,
        },
      });
    },
  });

  // Utiliser fetchMoreNotifications pour charger plus de données
  const loadMoreNotification = () => {
    if (
      !loadingNotifications &&
      notificationsData?.notifications?.nodes &&
      notificationsData?.notifications?.nodes.length >= 6 &&
      notificationsData?.notifications?.totalCount / 6 > page
    ) {
      fetchMoreNotifications({
        variables: {
          page: page + 1,
        },
        updateQuery: (prev, { fetchMoreResult }) => {
          if (
            !fetchMoreResult ||
            !fetchMoreResult?.notifications ||
            !fetchMoreResult?.notifications?.nodes
          )
            return prev;
          setPage(page + 1);
          return {
            notifications: {
              ...fetchMoreResult?.notifications,
              nodes: [
                ...prev.notifications?.nodes,
                ...fetchMoreResult?.notifications?.nodes,
              ],
              totalCount: fetchMoreResult.notifications.totalCount,
              notSeenCount: fetchMoreResult.notifications.notSeenCount,
            },
          };
        },
      }).then(() => onMarkNotificationsAsSeen());
    }
  };
  const onMarkNotificationsAsSeen = () => {
    if (
      notificationsData?.notifications?.nodes?.filter((n) => !n.isSeen).length >
      0
    ) {
      markNotificationsAsSeen({
        variables: {
          ids: notificationsData?.notifications?.nodes
            ?.filter((n) => !n.isSeen)
            .map((n) => n?.id),
        },
      });
    }
  };
  React.useEffect(() => {
    getNotifications();
  }, []);

  return (
    <NotificationsPopover
      notifications={notificationsData?.notifications?.nodes}
      notSeenCount={notificationsData?.notifications?.notSeenCount}
      loading={loadingNotifications}
      loadMoreNotification={loadMoreNotification}
      onMarkNotificationsAsSeen={onMarkNotificationsAsSeen}
    />
  );
}
