import { gql } from '@apollo/client';
import { TASK_BASIC_INFOS, TASK_DETAILS, TASK_RECAP } from '../fragments/TaskFragment';

export const GET_TASK = gql`
  query GetTask($id: ID!) {
    task(id: $id) {
      ...TaskDetailsFragment
    }
  }
  ${TASK_DETAILS}
`;

export const GET_TASKS = gql`
  query GetTasks($taskFilter: TaskFilterInput, $offset: Int, $limit: Int, $page: Int){
    tasks(taskFilter: $taskFilter, offset : $offset, limit : $limit, page : $page){
      totalCount
      nodes{
        ...TaskBasicInfosFragment
      }
    }
  }
  ${TASK_BASIC_INFOS}
`;

export const GET_TASK_RECAP = gql`
  query GetTask($id: ID!) {
    task(id: $id) {
      ...TaskRecapFragment
    }
  }
  ${TASK_RECAP}
`;
// Add more task-related queries here
// Add more task-related queries here
