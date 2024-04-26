// CallFragment.js

import { gql } from '@apollo/client';
import {
  BENEFICIARY_MINI_INFOS,
  BENEFICIARY_PHONE_INFOS,
} from './BeneficiaryFragment';
import { EMPLOYEE_BASIC_INFOS, EMPLOYEE_PHONE_INFOS } from './EmployeeFragment';
import { CLIENT_PHONE_INFOS } from './ClientFragment';
import { SUPPLIER_PHONE_INFOS } from './SupplierFragment';
import { PARTNER_PHONE_INFOS } from './PartnerFragment';
import { ESTABLISHMENT_PHONE_INFOS } from './EstablishmentFragment';
import { PHONE_NUMBER_INFOS } from './DataFragment';

export const CALL_BASIC_INFOS = gql`
  fragment CallBasicInfosFragment on CallType {
    id
    number
    title
    callType
    image
    entryDateTime
    description
    isActive
  }
`;

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

export const CALL_BENEFICIARY_DETAILS = gql`
  fragment CallBeneficiaryTypeFragment on CallBeneficiaryType {
    id
    beneficiary {
      ...BeneficiaryMiniInfosFragment
    }
  }
  ${BENEFICIARY_MINI_INFOS}
`;

export const CALL_DETAILS = gql`
  fragment CallDetailsFragment on CallType {
    ...CallBasicInfosFragment
    observation
    caller {
      ...CallerDetailsFragment
    }
    beneficiaries {
      ...CallBeneficiaryTypeFragment
    }
    employee {
      ...EmployeeBasicInfosFragment
    }
  }
  ${CALL_BASIC_INFOS}
  ${CALL_BENEFICIARY_DETAILS}
  ${EMPLOYEE_BASIC_INFOS}
  ${CALLER_DETAILS}
`;

export const CALL_RECAP_DETAILS = gql`
  fragment CallRecapDetailsFragment on CallType {
    ...CallBasicInfosFragment
    observation
    caller {
      ...CallerDetailsFragment
    }
    beneficiaries {
      ...CallBeneficiaryTypeFragment
    }
    employee {
      ...EmployeeBasicInfosFragment
    }
  }
  ${CALL_BASIC_INFOS}
  ${CALL_BENEFICIARY_DETAILS}
  ${EMPLOYEE_BASIC_INFOS}
  ${CALLER_DETAILS}
`;
