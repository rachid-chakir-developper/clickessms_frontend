// TicketFragment.js

import{ gql } from '@apollo/client';
import{ EMPLOYEE_MINI_INFOS } from './EmployeeFragment';
import{ ESTABLISHMENT_MINI_INFOS } from './EstablishmentFragment';
import { TASK_ACTION_MINI_INFOS } from './TaskActionFragment';

export const TICKET_MINI_INFOS = gql`
  fragment TicketMiniInfosFragment on TicketType{
    id
    number
    title
    priority
    status
    completionPercentage
    isActive
  }
`;

export const EFC_REPORT_DETAILS = gql`
  fragment EfcReportDetailsFragment on EfcReportType {
    id
    title
    description
    efcDate
    document
    declarationDate
    employees{
      ...EmployeeMiniInfosFragment
    }
  }
  ${EMPLOYEE_MINI_INFOS}
`;

export const TICKET_BASIC_INFOS = gql`
  fragment TicketBasicInfosFragment on TicketType{
    ...TicketMiniInfosFragment
    establishments{
      ...EstablishmentMiniInfosFragment
    }
    undesirableEvent {
      id
      title
    }
    folder{
      id
      number
      name
    }
    actions{
      ...TaskActionMiniInfosFragment
    }
    description
    employee{
      ...EmployeeMiniInfosFragment
    }
    isHaveEfcReport
    efcReports{
      ...EfcReportDetailsFragment
    }
  }
  ${TICKET_MINI_INFOS}
  ${ESTABLISHMENT_MINI_INFOS}
  ${TASK_ACTION_MINI_INFOS}
  ${EMPLOYEE_MINI_INFOS}
  ${EFC_REPORT_DETAILS}
`;

export const TICKET_DETAILS = gql`
  fragment TicketDetailsFragment on TicketType{
    ...TicketBasicInfosFragment
  }
  ${TICKET_BASIC_INFOS}
`;

export const TICKET_RECAP_DETAILS = gql`
  fragment TicketRecapDetailsFragment on TicketType{
    ...TicketBasicInfosFragment
    description
    employee{
      ...EmployeeMiniInfosFragment
    }
    isHaveEfcReport
    efcReports{
      ...EfcReportDetailsFragment
    }
    createdAt
    updatedAt
  }
  ${TICKET_BASIC_INFOS}
  ${EMPLOYEE_MINI_INFOS}
  ${EFC_REPORT_DETAILS}
`;
