// UndesirableEventFragment.js

import{ gql } from '@apollo/client';
import{ BENEFICIARY_MINI_INFOS } from './BeneficiaryFragment';
import{ EMPLOYEE_BASIC_INFOS } from './EmployeeFragment';
import{ ESTABLISHMENT_MINI_INFOS } from './EstablishmentFragment';
import { TICKET_MINI_INFOS } from './TicketFragment';
import { USER_BASIC_INFOS } from './UserFragment';

export const UNDESIRABLE_EVENT_ESTABLISHMENT_DETAILS = gql`
  fragment UndesirableEventEstablishmentTypeFragment on UndesirableEventEstablishmentType{
    id
    establishment{
      ...EstablishmentMiniInfosFragment
    }
  }
  ${ESTABLISHMENT_MINI_INFOS}
`;
export const UNDESIRABLE_EVENT_MINI_INFOS = gql`
  fragment UndesirableEventBasicMiniFragment on UndesirableEventType{
    id
    number
    title
    image
    undesirableEventType
    startingDateTime
    endingDateTime
    description
    isActive
    status
    completionPercentage
  }
`;

export const UNDESIRABLE_EVENT_BENEFICIARY_DETAILS = gql`
  fragment UndesirableEventBeneficiaryTypeFragment on UndesirableEventBeneficiaryType{
    id
    beneficiary{
      ...BeneficiaryMiniInfosFragment
    }
  }
  ${BENEFICIARY_MINI_INFOS}
`;

export const UNDESIRABLE_EVENT_EMPLOYEE_DETAILS = gql`
  fragment UndesirableEventEmployeeTypeFragment on UndesirableEventEmployeeType{
    id
    employee{
      ...EmployeeBasicInfosFragment
    }
  }
  ${EMPLOYEE_BASIC_INFOS}
`;

export const UNDESIRABLE_EVENT_PERSON_NOTIFIED_DETAILS = gql`
  fragment UndesirableEventNotifiedPersonTypeFragment on UndesirableEventNotifiedPersonType{
    id
    employee{
      ...EmployeeBasicInfosFragment
    }
  }
  ${EMPLOYEE_BASIC_INFOS}
`;

export const UNDESIRABLE_EVENT_BASIC_INFOS = gql`
  fragment UndesirableEventBasicInfosFragment on UndesirableEventType{
    ...UndesirableEventBasicMiniFragment
    establishments{
      ...UndesirableEventEstablishmentTypeFragment
    }
    creator{
      ...UserBasicInfosFragment
    }
    employee{
      ...EmployeeBasicInfosFragment
    }
    declarants{
      ...EmployeeBasicInfosFragment
    }
    ticket {
      ...TicketMiniInfosFragment
    }
    folder{
      id
      number
      name
    }
    severity
    actionsTakenText
    courseFactsDateTime
    courseFactsPlace
    circumstanceEventText
    observation
    beneficiaries{
      ...UndesirableEventBeneficiaryTypeFragment
    }
    employees{
      ...UndesirableEventEmployeeTypeFragment
    }
    concernedFamilies
    notifiedPersons{
      ...UndesirableEventNotifiedPersonTypeFragment
    }
    otherNotifiedPersons
    normalTypes{
      id
      name
    }
    seriousTypes{
      id
      name
    }
    otherTypes
    frequency{
      id
      name
    }
  }
  ${UNDESIRABLE_EVENT_MINI_INFOS}
  ${UNDESIRABLE_EVENT_ESTABLISHMENT_DETAILS}
  ${USER_BASIC_INFOS}
  ${EMPLOYEE_BASIC_INFOS}
  ${TICKET_MINI_INFOS}
  ${UNDESIRABLE_EVENT_EMPLOYEE_DETAILS}
  ${UNDESIRABLE_EVENT_PERSON_NOTIFIED_DETAILS}
  ${UNDESIRABLE_EVENT_BENEFICIARY_DETAILS}
`;

export const UNDESIRABLE_EVENT_DETAILS = gql`
  fragment UndesirableEventDetailsFragment on UndesirableEventType{
    ...UndesirableEventBasicInfosFragment
    files {
      id
      caption
      file
      createdAt
      updatedAt
    }
  }
  ${UNDESIRABLE_EVENT_BASIC_INFOS}
`;

export const UNDESIRABLE_EVENT_RECAP_DETAILS = gql`
  fragment UndesirableEventRecapDetailsFragment on UndesirableEventType{
    ...UndesirableEventBasicInfosFragment
    severity
    actionsTakenText
    courseFactsDateTime
    courseFactsPlace
    circumstanceEventText
    observation
    concernedFamilies
    beneficiaries{
      ...UndesirableEventBeneficiaryTypeFragment
    }
    employees{
      ...UndesirableEventEmployeeTypeFragment
    }
    notifiedPersons{
      ...UndesirableEventNotifiedPersonTypeFragment
    }
    otherNotifiedPersons
    normalTypes{
      id
      name
    }
    seriousTypes{
      id
      name
    }
    otherTypes
    frequency{
      id
      name
    }
    files {
      id
      caption
      file
      createdAt
      updatedAt
    }
    createdAt
    updatedAt
  }
  ${UNDESIRABLE_EVENT_BASIC_INFOS}
  ${UNDESIRABLE_EVENT_EMPLOYEE_DETAILS}
  ${UNDESIRABLE_EVENT_PERSON_NOTIFIED_DETAILS}
  ${UNDESIRABLE_EVENT_BENEFICIARY_DETAILS}
`;
