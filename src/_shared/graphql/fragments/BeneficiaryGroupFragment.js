// BeneficiaryGroupFragment.js

import { gql } from '@apollo/client';
import { BENEFICIARY_BASIC_INFOS } from './BeneficiaryFragment';

export const BENEFICIARY_GROUP_BASIC_INFOS = gql`
  fragment BeneficiaryGroupBasicInfosFragment on BeneficiaryGroupType {
    id
    number
    name
    image
    description
    isActive
  }
`;

export const BENEFICIARY_GROUP_ITEM_DETAILS = gql`
  fragment BeneficiaryGroupItemTypeFragment on BeneficiaryGroupItemType {
    id
    beneficiary{
      ...BeneficiaryBasicInfosFragment
    }
  }
  ${BENEFICIARY_BASIC_INFOS}
`;

export const BENEFICIARY_GROUP_DETAILS = gql`
  fragment BeneficiaryGroupDetailsFragment on BeneficiaryGroupType {
    ...BeneficiaryGroupBasicInfosFragment
    observation
    beneficiaries{
      ...BeneficiaryGroupItemTypeFragment
    }
  }
  ${BENEFICIARY_GROUP_BASIC_INFOS}
  ${BENEFICIARY_GROUP_ITEM_DETAILS}
`;

export const BENEFICIARY_GROUP_RECAP_DETAILS = gql`
  fragment BeneficiaryGroupRecapDetailsFragment on BeneficiaryGroupType {
    ...BeneficiaryGroupBasicInfosFragment
    observation
    beneficiaries{
      ...BeneficiaryGroupItemTypeFragment
    }
  }
  ${BENEFICIARY_GROUP_BASIC_INFOS}
  ${BENEFICIARY_GROUP_ITEM_DETAILS}
`;



