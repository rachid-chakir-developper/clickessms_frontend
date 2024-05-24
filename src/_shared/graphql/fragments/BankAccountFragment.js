// BankAccountFragment.js

import { gql } from '@apollo/client';
import { FOLDER_MINI_INFOS } from './MediaFragment';
import { ESTABLISHMENT_MINI_INFOS } from './EstablishmentFragment';

export const BANK_ACCOUNT_BASIC_INFOS = gql`
  fragment BankAccountBasicInfosFragment on BankAccountType {
    id
    number
    name
    image
    accountNumber
    accountType
    bankName
    iban
    bic
    isActive
    balance
    establishment {
      ...EstablishmentMiniInfosFragment
    }
    folder {
      ...FolderMiniInfosFragment
    }
  }
  ${ESTABLISHMENT_MINI_INFOS}
  ${FOLDER_MINI_INFOS}
`;

export const BANK_ACCOUNT_DETAILS = gql`
  fragment BankAccountDetailsFragment on BankAccountType {
    ...BankAccountBasicInfosFragment
    openingDate
    closingDate
    description
    observation
  }
  ${BANK_ACCOUNT_BASIC_INFOS}
`;

export const BANK_ACCOUNT_RECAP_DETAILS = gql`
  fragment BankAccountRecapDetailsFragment on BankAccountType {
    ...BankAccountBasicInfosFragment
    openingDate
    closingDate
    description
    observation
  }
  ${BANK_ACCOUNT_BASIC_INFOS}
`;
