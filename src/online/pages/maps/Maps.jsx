import { useQuery } from '@apollo/client';
import { GET_TASKS } from '../../../_shared/graphql/queries/TaskQueries';
import AppMap from './AppMap';
import { GET_USERS } from '../../../_shared/graphql/queries/UserQueries';
import { ON_USER_UPDATED } from '../../../_shared/graphql/subscriptions/UserSubscriptions';

export default function Maps() {
  const {
    loading: loadingTasks,
    data: tasksData,
    error: tasksError,
    fetchMore: fetchMoreTasks,
  } = useQuery(GET_TASKS);

  const {
    loading: loadingUsers,
    data: usersData,
    error: usersError,
    fetchMore: fetchMoreUsers,
    subscribeToMore: subscribeToMoreUser,
  } = useQuery(GET_USERS);

  subscribeToMoreUser({
    document: ON_USER_UPDATED,
    updateQuery: (prev, { subscriptionData }) => {
      console.log('subscriptionData', subscriptionData);
      if (!subscriptionData.data) return prev;
      const newUserItem = subscriptionData.data.onUserUpdated.user;
      let indexOfUser = prev.users.nodes.findIndex(
        (x) => x.id === newUserItem.id,
      );
      if (indexOfUser >= 0) {
        console.log('subscriptionData', subscriptionData);
        let auxUsers = { ...prev.users };
        let auxNodes = [...auxUsers.nodes];
        auxNodes[indexOfUser] = newUserItem;
        auxUsers.nodes = auxNodes;
        return Object.assign({}, prev, {
          users: auxUsers,
        });
      }
      return prev;
    },
  });

  return (
    <>
      {!loadingTasks && (
        <AppMap
          tasks={tasksData?.tasks?.nodes ? tasksData?.tasks?.nodes : []}
          users={usersData?.users?.nodes ? usersData?.users?.nodes : []}
        />
      )}
    </>
  );
}
