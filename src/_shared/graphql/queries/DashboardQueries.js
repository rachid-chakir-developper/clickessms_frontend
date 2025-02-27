import { gql } from '@apollo/client';
import { TASK_BASIC_INFOS } from '../fragments/TaskFragment';
import { EMPLOYEE_BASIC_INFOS } from '../fragments/EmployeeFragment';
import { TASK_ACTION_BASIC_INFOS } from '../fragments/TaskActionFragment';
import { UNDESIRABLE_EVENT_BASIC_INFOS } from '../fragments/UndesirableEventFragment';
import { BENEFICIARY_ENTRY_DETAILS, BENEFICIARY_MINI_INFOS } from '../fragments/BeneficiaryFragment';
import { BENEFICIARY_ADMISSION_MINI_INFOS } from '../fragments/BeneficiaryAdmissionFragment';
import { DASHBOARD_COMMENT_BASIC_INFOS } from '../fragments/DashboardCommentFragment';

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


export const GET_DASHBOARD_ACTIVITY = gql`
  query getDashboardActivity($dashboardActivityFilter: DashboardActivityFilterInput){
    dashboardActivity(dashboardActivityFilter: $dashboardActivityFilter){
      activityTrackingEstablishments{
        year
        months
        title
        establishment{
          id
          name
          logo
        }
        activityTrackingMonth{
          month
          year
          entriesCount
          exitsCount
          plannedExitsCount
          presentsMonthCount
          daysCount
          objectiveDaysCount
          gapDaysCount
          objectiveOccupancyRate
          occupancyRate
          valuation
          objectiveValuation
          gapValuation
        }
        activityTrackingAccumulation{
          year
          label
          entriesCount
          exitsCount
          plannedExitsCount
          presentsMonthCount
          daysCount
          objectiveDaysCount
          gapDaysCount
          objectiveOccupancyRate
          occupancyRate
          valuation
          objectiveValuation
          gapValuation
        }
      }
      activitySynthesis{
        year
        months
        monthTotals
        activitySynthesisEstablishments{
          year
          months
          title
          establishment{
            id
            name
            logo
          }
          activitySynthesisMonth{
            year
            month
            countReceived
            countApproved
            countRejected
            countCanceled
            countOccupiedPlaces
            countAvailablePlaces
            beneficiaryEntries{
              beneficiary{
                ...BeneficiaryMiniInfosFragment
              }
              ...BeneficiaryEntryFragment
            }
            beneficiaryAdmissions{
              beneficiary{
                ...BeneficiaryMiniInfosFragment
              }
              ...BeneficiaryAdmissionMiniInfosFragment
            }
          }
          activityTotalSynthesisMonth{
            totalReceived
            totalApproved
            totalRejected
            totalCanceled
            totalAvailablePlaces
          }
        }
      }
      activityMonth{
        title
        year
        month
        activityMonthEstablishments{
          year
          title
          establishment{
            id
            name
            logo
          }
          capacity
          countOutsidePlacesDepartment
          countOccupiedPlaces
          countAvailablePlaces
          agesText
          beneficiaryEntries{
            beneficiary{
              ...BeneficiaryMiniInfosFragment
            }
            ...BeneficiaryEntryFragment
          }
        }
      }
    }
  }
  ${BENEFICIARY_MINI_INFOS}
  ${BENEFICIARY_ENTRY_DETAILS}
  ${BENEFICIARY_ADMISSION_MINI_INFOS}
`;

export const GET_DASHBOARD_ACTIVITY_TRACKING_ESTABLISHMENTS = gql`
  query getDashboardActivity($dashboardActivityFilter: DashboardActivityFilterInput){
    dashboardActivity(dashboardActivityFilter: $dashboardActivityFilter){
      activityTrackingEstablishments{
        year
        months
        title
        establishment{
          id
          name
          logo
        }
        activityTrackingMonth{
          year
          month
          isCurrentMonth
          isFutureMonth
          entriesCount
          exitsCount
          plannedExitsCount
          presentsMonthCount
          daysCount
          objectiveDaysCount
          gapDaysCount
          objectiveOccupancyRate
          occupancyRate
          valuation
          objectiveValuation
          gapValuation
        }
        activityTrackingAccumulation{
          year
          label
          entriesCount
          exitsCount
          plannedExitsCount
          presentsMonthCount
          daysCount
          objectiveDaysCount
          gapDaysCount
          objectiveOccupancyRate
          occupancyRate
          valuation
          objectiveValuation
          gapValuation
        }
      }
    }
  }
`;



export const GET_DASHBOARD_ACTIVITY_SYNTHESIS = gql`
  query getDashboardActivity($dashboardActivityFilter: DashboardActivityFilterInput){
    dashboardActivity(dashboardActivityFilter: $dashboardActivityFilter){
      activitySynthesis{
        year
        months
        monthTotals
        activitySynthesisEstablishments{
          year
          months
          title
          establishment{
            id
            name
            logo
          }
          activitySynthesisMonth{
            year
            month
            countReceived
            countApproved
            countRejected
            countCanceled
            countOccupiedPlaces
            countAvailablePlaces
            dashboardComment{
              ...DashboardCommentBasicInfosFragment
            }
            dashboardComments{
              ...DashboardCommentBasicInfosFragment
            }
            beneficiaryEntries{
              beneficiary{
                ...BeneficiaryMiniInfosFragment
              }
              ...BeneficiaryEntryFragment
            }
            beneficiaryAdmissions{
              beneficiary{
                ...BeneficiaryMiniInfosFragment
              }
              ...BeneficiaryAdmissionMiniInfosFragment
            }
          }
          activityTotalSynthesisMonth{
            totalReceived
            totalApproved
            totalRejected
            totalCanceled
            totalAvailablePlaces
          }
        }
      }
    }
  }
  ${DASHBOARD_COMMENT_BASIC_INFOS}
  ${BENEFICIARY_MINI_INFOS}
  ${BENEFICIARY_ENTRY_DETAILS}
  ${BENEFICIARY_ADMISSION_MINI_INFOS}
`;

export const GET_DASHBOARD_ACTIVITY_MONTH = gql`
  query getDashboardActivity($dashboardActivityFilter: DashboardActivityFilterInput){
    dashboardActivity(dashboardActivityFilter: $dashboardActivityFilter){
      activityMonth{
        title
        year
        month
        activityMonthEstablishments{
          year
          title
          establishment{
            id
            name
            logo
          }
          capacity
          countOutsidePlacesDepartment
          countOccupiedPlaces
          countAvailablePlaces
          agesText
          beneficiaryEntries{
            beneficiary{
              ...BeneficiaryMiniInfosFragment
            }
            ...BeneficiaryEntryFragment
          }
        }
      }
    }
  }
  ${BENEFICIARY_MINI_INFOS}
  ${BENEFICIARY_ENTRY_DETAILS}
`;