// CallFragment.js

import { gql } from '@apollo/client';
import {
  BENEFICIARY_MINI_INFOS,
  BENEFICIARY_PHONE_INFOS,
} from './BeneficiaryFragment';
import {  EMPLOYEE_MINI_INFOS, EMPLOYEE_PHONE_INFOS } from './EmployeeFragment';
import { CLIENT_PHONE_INFOS } from './ClientFragment';
import { SUPPLIER_PHONE_INFOS } from './SupplierFragment';
import { PARTNER_PHONE_INFOS } from './PartnerFragment';
import { ESTABLISHMENT_MINI_INFOS, ESTABLISHMENT_PHONE_INFOS } from './EstablishmentFragment';
import { PHONE_NUMBER_INFOS } from './DataFragment';


export const CALLER_DETAILS = gql`
  fragment CallerDetailsFragment on CallerType {
    id
    name
    phone
    callerType
    employee {
      ...EmployeePhoneInfosFragment
    }
    client {
      ...ClientPhoneInfosFragment
    }
    supplier {
      ...SupplierPhoneInfosFragment
    }
    partner {
      ...PartnerPhoneInfosFragment
    }
    beneficiary {
      ...BeneficiaryPhoneInfosFragment
    }
    establishment {
      ...EstablishmentPhoneInfosFragment
    }
    phoneNumber {
      ...PhoneNumberInfosFragment
    }
  }
  ${EMPLOYEE_PHONE_INFOS}
  ${CLIENT_PHONE_INFOS}
  ${SUPPLIER_PHONE_INFOS}
  ${PARTNER_PHONE_INFOS}
  ${BENEFICIARY_PHONE_INFOS}
  ${ESTABLISHMENT_PHONE_INFOS}
  ${PHONE_NUMBER_INFOS}
`;

export const CALL_ESTABLISHMENT_DETAILS = gql`
  fragment CallEstablishmentTypeFragment on CallEstablishmentType {
    id
    establishment{
      ...EstablishmentMiniInfosFragment
    }
  }
  ${ESTABLISHMENT_MINI_INFOS}
`;

export const CALL_EMPLOYEE_DETAILS = gql`
  fragment CallEmployeeTypeFragment on CallEmployeeType {
    id
    employee{
      ...EmployeeMiniInfosFragment
    }
  }
  ${EMPLOYEE_MINI_INFOS}
`;

export const CALL_BENEFICIARY_DETAILS = gql`
  fragment CallBeneficiaryTypeFragment on CallBeneficiaryType {
    id
    beneficiary {
      ...BeneficiaryMiniInfosFragment
    }
  }
  ${BENEFICIARY_MINI_INFOS}
`;


export const CALL_BASIC_INFOS = gql`
  fragment CallBasicInfosFragment on CallType {
    id
    number
    title
    callType
    image
    entryDateTime
    isActive
    isCreateUndesirableEventFrom
    caller {
      ...CallerDetailsFragment
    }
    establishments{
      ...CallEstablishmentTypeFragment
    }
    employees {
      ...CallEmployeeTypeFragment
    }
    beneficiaries {
      ...CallBeneficiaryTypeFragment
    }
  }
  ${CALL_ESTABLISHMENT_DETAILS}
  ${CALL_EMPLOYEE_DETAILS}
  ${CALL_BENEFICIARY_DETAILS}
  ${CALLER_DETAILS}
`;

export const CALL_DETAILS = gql`
  fragment CallDetailsFragment on CallType {
    ...CallBasicInfosFragment
    observation
    description
  }
  ${CALL_BASIC_INFOS}
`;

export const CALL_RECAP_DETAILS = gql`
  fragment CallRecapDetailsFragment on CallType {
    ...CallBasicInfosFragment
    description
    observation
  }
  ${CALL_BASIC_INFOS}
`;
