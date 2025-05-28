import { gql } from '@apollo/client';
import {
  EMPLOYEE_MINI_INFOS,
  EMPLOYEE_PHONE_INFOS,
} from '../fragments/EmployeeFragment';
import {
  SUPPLIER_BASIC_INFOS,
  SUPPLIER_PHONE_INFOS,
} from '../fragments/SupplierFragment';
import { BENEFICIARY_MINI_INFOS, BENEFICIARY_PHONE_INFOS } from '../fragments/BeneficiaryFragment';
import { PARTNER_PHONE_INFOS } from '../fragments/PartnerFragment';
import { ESTABLISHMENT_PHONE_INFOS } from '../fragments/EstablishmentFragment';
import { PHONE_NUMBER_INFOS } from '../fragments/DataFragment';
import { GOVERNANCE_MEMBER_MINI_INFOS } from '../fragments/GovernanceMemberFragment';

export const GET_SEARCH = gql`
  query search(
    $searchFilter: SearchFilterInput
    $offset: Int
    $limit: Int
    $page: Int
  ) {
    search(
      searchFilter: $searchFilter
      offset: $offset
      limit: $limit
      page: $page
    ) {
      results {
        governanceMembers{
          totalCount
          nodes {
            ...GovernanceMemberMiniInfosFragment
          }
        }
        employees {
          totalCount
          nodes {
            ...EmployeeMiniInfosFragment
          }
        }
        beneficiaries {
          totalCount
          nodes {
            ...BeneficiaryMiniInfosFragment
          }
        }
        suppliers {
          totalCount
          nodes {
            ...SupplierBasicInfosFragment
          }
        }
      }
    }
  }
  ${EMPLOYEE_MINI_INFOS}
  ${GOVERNANCE_MEMBER_MINI_INFOS}
  ${BENEFICIARY_MINI_INFOS}
  ${SUPPLIER_BASIC_INFOS}
`;

export const GET_SEARCH_NUMBERS = gql`
  query searchNumbers(
    $searchFilter: SearchFilterInput
    $offset: Int
    $limit: Int
    $page: Int
  ) {
    searchNumbers(
      searchFilter: $searchFilter
      offset: $offset
      limit: $limit
      page: $page
    ) {
      results {
        employees {
          totalCount
          nodes {
            ...EmployeePhoneInfosFragment
          }
        }
        suppliers {
          totalCount
          nodes {
            ...SupplierPhoneInfosFragment
          }
        }
        partners {
          totalCount
          nodes {
            ...PartnerPhoneInfosFragment
          }
        }
        beneficiaries {
          totalCount
          nodes {
            ...BeneficiaryPhoneInfosFragment
          }
        }
        establishments {
          totalCount
          nodes {
            ...EstablishmentPhoneInfosFragment
          }
        }
        phoneNumbers {
          totalCount
          nodes {
            ...PhoneNumberInfosFragment
          }
        }
      }
    }
  }
  ${EMPLOYEE_PHONE_INFOS}
  ${SUPPLIER_PHONE_INFOS}
  ${PARTNER_PHONE_INFOS}
  ${BENEFICIARY_PHONE_INFOS}
  ${ESTABLISHMENT_PHONE_INFOS}
  ${PHONE_NUMBER_INFOS}
`;
