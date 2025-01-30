// AddressBookEntryFragment.js

import { gql } from '@apollo/client';

export const ADDRESS_BOOK_ENTRY_BASIC_INFOS = gql`
  fragment AddressBookEntryBasicInfosFragment on AddressBookEntryType {
    id
    title
    firstName
    lastName
    email
    fullAddress
    mobile
    fix
    fax
  }
`;

export const ADDRESS_BOOK_ENTRY_DETAILS = gql`
  fragment AddressBookEntryDetailsFragment on AddressBookEntryType {
    ...AddressBookEntryBasicInfosFragment
  }
  ${ADDRESS_BOOK_ENTRY_BASIC_INFOS}
`;

export const ADDRESS_BOOK_ENTRY_RECAP_DETAILS = gql`
  fragment AddressBookEntryRecapDetailsFragment on AddressBookEntryType {
    ...AddressBookEntryBasicInfosFragment
    createdAt
    updatedAt
  }
  ${ADDRESS_BOOK_ENTRY_BASIC_INFOS}
`;
