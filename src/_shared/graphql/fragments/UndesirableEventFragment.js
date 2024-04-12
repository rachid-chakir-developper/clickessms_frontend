// UndesirableEventFragment.js

import { gql } from '@apollo/client';
import { BENEFICIARY_MINI_INFOS } from './BeneficiaryFragment';
import { EMPLOYEE_BASIC_INFOS } from './EmployeeFragment';
import { ESTABLISHMENT_MINI_INFOS } from './EstablishmentFragment';
import { ESTABLISHMENT_SERVICE_MINI_INFOS } from './EstablishmentServiceFragment';



export const UDESIRABLE_EVENT_ESTABLISHMENT_DETAILS = gql`
  fragment UndesirableEventEstablishmentTypeFragment on UndesirableEventEstablishmentType {
    id
    establishment{
      ...EstablishmentMiniInfosFragment
    }
  }
  ${ESTABLISHMENT_MINI_INFOS}
`;

export const UDESIRABLE_EVENT_BASIC_INFOS = gql`
  fragment UndesirableEventBasicInfosFragment on UndesirableEventType {
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
    establishments{
      ...UndesirableEventEstablishmentTypeFragment
    }
    folder{
      id
      number
      name
    }
  }
  ${UDESIRABLE_EVENT_ESTABLISHMENT_DETAILS}
`;

export const UDESIRABLE_EVENT_ESTABLISHMENT_SERVICE_DETAILS = gql`
  fragment UndesirableEventEstablishmentServiceTypeFragment on UndesirableEventEstablishmentServiceType {
    id
    establishmentService{
      ...EstablishmentServiceMiniInfosFragment
    }
  }
  ${ESTABLISHMENT_SERVICE_MINI_INFOS}
`;

export const UDESIRABLE_EVENT_BENEFICIARY_DETAILS = gql`
  fragment UndesirableEventBeneficiaryTypeFragment on UndesirableEventBeneficiaryType {
    id
    beneficiary{
      ...BeneficiaryMiniInfosFragment
    }
  }
  ${BENEFICIARY_MINI_INFOS}
`;

export const UDESIRABLE_EVENT_EMPLOYEE_DETAILS = gql`
  fragment UndesirableEventEmployeeTypeFragment on UndesirableEventEmployeeType {
    id
    employee{
      ...EmployeeBasicInfosFragment
    }
  }
  ${EMPLOYEE_BASIC_INFOS}
`;

export const UDESIRABLE_EVENT_PERSON_NOTIFIED_DETAILS = gql`
  fragment UndesirableEventNotifiedPersonTypeFragment on UndesirableEventNotifiedPersonType {
    id
    employee{
      ...EmployeeBasicInfosFragment
    }
  }
  ${EMPLOYEE_BASIC_INFOS}
`;

export const UDESIRABLE_EVENT_DETAILS = gql`
  fragment UndesirableEventDetailsFragment on UndesirableEventType {
    ...UndesirableEventBasicInfosFragment
    severity
    actionsTakenText
    courseFactsDateTime
    courseFactsPlace
    circumstanceEventText
    observation
    establishmentServices{
      ...UndesirableEventEstablishmentServiceTypeFragment
    }
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
    employee{
      ...EmployeeBasicInfosFragment
    }
    normalTypes{
      id
      name
    }
    seriousTypes{
      id
      name
    }
    frequency{
      id
      name
    }
  }
  ${UDESIRABLE_EVENT_BASIC_INFOS}
  ${UDESIRABLE_EVENT_ESTABLISHMENT_SERVICE_DETAILS}
  ${UDESIRABLE_EVENT_EMPLOYEE_DETAILS}
  ${UDESIRABLE_EVENT_PERSON_NOTIFIED_DETAILS}
  ${UDESIRABLE_EVENT_BENEFICIARY_DETAILS}
  ${EMPLOYEE_BASIC_INFOS}
`;

export const UDESIRABLE_EVENT_RECAP_DETAILS = gql`
  fragment UndesirableEventRecapDetailsFragment on UndesirableEventType {
    ...UndesirableEventBasicInfosFragment
    severity
    actionsTakenText
    courseFactsDateTime
    courseFactsPlace
    circumstanceEventText
    observation
    establishmentServices{
      ...UndesirableEventEstablishmentServiceTypeFragment
    }
    beneficiaries{
      ...UndesirableEventBeneficiaryTypeFragment
    }
    employees{
      ...EmployeeBasicInfosFragment
    }
    notifiedPersons{
      ...UndesirableEventNotifiedPersonTypeFragment
    }
    otherNotifiedPersons
    employee{
      ...EmployeeBasicInfosFragment
    }
    normalTypes{
      id
      name
    }
    seriousTypes{
      id
      name
    }
    frequency{
      id
      name
    }
  }
  ${UDESIRABLE_EVENT_BASIC_INFOS}
  ${UDESIRABLE_EVENT_ESTABLISHMENT_DETAILS}
  ${UDESIRABLE_EVENT_ESTABLISHMENT_SERVICE_DETAILS}
  ${UDESIRABLE_EVENT_BENEFICIARY_DETAILS}
  ${UDESIRABLE_EVENT_PERSON_NOTIFIED_DETAILS}
  ${EMPLOYEE_BASIC_INFOS}
`;

