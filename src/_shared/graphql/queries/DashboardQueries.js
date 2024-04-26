import { gql } from '@apollo/client';
import { TASK_BASIC_INFOS } from '../fragments/TaskFragment';

export const GET_DASHBOARD = gql`
  query {
    dashboard {
      tasksWeek {
        day
        count
      }
      taskPercent {
        label
        value
      }
      budgetMonth {
        date
        budget
      }
      spendingsMonth {
        date
        spendings
      }
      revenueMonth {
        date
        revenue
      }
      tasks {
        ...TaskBasicInfosFragment
      }
    }
  }
  ${TASK_BASIC_INFOS}
`;
