import { gql } from '@apollo/client';
import { PARTNER_BASIC_INFOS, PARTNER_DETAILS } from '../fragments/PartnerFragment';

export const GET_PARTNER = gql`
  query GetPartner($id: ID!) {
    partner(id: $id) {
      ...PartnerDetailsFragment
    }
  }
  ${PARTNER_DETAILS}
`;

export const GET_PARTNERS = gql`
  query GetPartners($partnerFilter: PartnerFilterInput, $offset: Int, $limit: Int, $page: Int){
    partners(partnerFilter: $partnerFilter, offset : $offset, limit : $limit, page : $page){
      totalCount
      nodes{
        ...PartnerBasicInfosFragment
      }
    }
  }
  ${PARTNER_BASIC_INFOS}
`;

// Add more partner-related queries here
