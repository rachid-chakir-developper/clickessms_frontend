import { gql } from '@apollo/client';
import { TASK_BASIC_INFOS } from '../fragments/TaskFragment';
import { EMPLOYEE_BASIC_INFOS } from '../fragments/EmployeeFragment';

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
  ${EMPLOYEE_BASIC_INFOS}
`;
