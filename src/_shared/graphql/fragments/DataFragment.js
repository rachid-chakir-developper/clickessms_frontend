// DataFragment.js

import { gql } from '@apollo/client';

export const DATA_BASIC_INFOS = gql`
  fragment DataBasicInfosFragment on DataType {
    id
    number
    code
    name
    description
  }
`;

export const ACCOUNTING_NATURE_MINI_INFOS = gql`
  fragment AccountingNatureMiniInfosFragment on AccountingNatureType {
    id
    number
    code
    name
    description
    childrenNumber
    amountAllocated
    isActive
  }
`;

export const ACCOUNTING_NATURE_BASIC_INFOS = gql`
  fragment AccountingNatureBasicInfosFragment on AccountingNatureType {
    ...AccountingNatureMiniInfosFragment
    children{
      ...AccountingNatureMiniInfosFragment
      children{
        ...AccountingNatureMiniInfosFragment
        children{
          ...AccountingNatureMiniInfosFragment
          children{
            ...AccountingNatureMiniInfosFragment
            children{
              ...AccountingNatureMiniInfosFragment
              children{
                ...AccountingNatureMiniInfosFragment
                children{
                  ...AccountingNatureMiniInfosFragment
                  children{
                    ...AccountingNatureMiniInfosFragment
                    children{
                      ...AccountingNatureMiniInfosFragment
                    }
                  }
                }
              }
            }
          }
        }
      }
    }
  }
  ${ACCOUNTING_NATURE_MINI_INFOS}
`;

// export const ACCOUNTING_NATURE_BASIC_INFOS = gql`
//   fragment AccountingNatureBasicInfosFragment on AccountingNatureType {
//     ...AccountingNatureMiniInfosFragment
//   }
//   ${ACCOUNTING_NATURE_MINI_INFOS}
// `;

export const PHONE_NUMBER_INFOS = gql`
  fragment PhoneNumberInfosFragment on PhoneNumberType {
    id
    name
    phone
    description
  }
`;
