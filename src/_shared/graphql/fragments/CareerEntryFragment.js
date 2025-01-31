// CareerEntryFragment.js

import { gql } from '@apollo/client';

export const CAREER_ENTRY_BASIC_INFOS = gql`
  fragment CareerEntryBasicInfosFragment on CareerEntryType {
    id
    careerType
    institution
    title
    startingDate
    endingDate
    professionalStatus{
        id
        name
    }
    email
    fullAddress
    description
    mobile
    fix
    fax
  }
`;

export const CAREER_ENTRY_DETAILS = gql`
  fragment CareerEntryDetailsFragment on CareerEntryType {
    ...CareerEntryBasicInfosFragment
  }
  ${CAREER_ENTRY_BASIC_INFOS}
`;

export const CAREER_ENTRY_RECAP_DETAILS = gql`
  fragment CareerEntryRecapDetailsFragment on CareerEntryType {
    ...CareerEntryBasicInfosFragment
    createdAt
    updatedAt
  }
  ${CAREER_ENTRY_BASIC_INFOS}
`;
