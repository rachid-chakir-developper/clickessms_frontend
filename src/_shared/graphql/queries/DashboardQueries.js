import { gql } from '@apollo/client';
import { TASK_BASIC_INFOS } from '../fragments/TaskFragment';
import { EMPLOYEE_BASIC_INFOS } from '../fragments/EmployeeFragment';
import { TASK_ACTION_BASIC_INFOS } from '../fragments/TaskActionFragment';
import { UNDESIRABLE_EVENT_BASIC_INFOS } from '../fragments/UndesirableEventFragment';

export const GET_DASHBOARD = gql`
  query {
    dashboard {
      currentEmployee{
        ...EmployeeBasicInfosFragment
      }
      tasksWeek {
        day
        count
      }
      undesirableEventsWeek {
        day
        count
      }
      taskPercent {
        label
        value
      }
      tasks {
        ...TaskBasicInfosFragment
      }
      taskActions{
        ...TaskActionBasicInfosFragment
      }
      undesirableEvents{
        ...UndesirableEventBasicInfosFragment
      }
    }
  }
  ${TASK_BASIC_INFOS}
  ${EMPLOYEE_BASIC_INFOS}
  ${TASK_ACTION_BASIC_INFOS}
  ${UNDESIRABLE_EVENT_BASIC_INFOS}
`;
