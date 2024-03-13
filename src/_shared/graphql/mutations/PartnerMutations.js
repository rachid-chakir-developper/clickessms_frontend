import { gql } from '@apollo/client';
import { PARTNER_BASIC_INFOS } from '../fragments/PartnerFragment';

export const POST_PARTNER = gql`
  mutation CreatePartner($partnerData: PartnerInput!, $photo : Upload, $coverImage : Upload) {
    createPartner(partnerData: $partnerData, photo : $photo, coverImage : $coverImage) {
      partner{
        ...PartnerBasicInfosFragment
      }
    }
  }
  ${PARTNER_BASIC_INFOS}
`;

export const PUT_PARTNER = gql`
  mutation UpdatePartner($id: ID!, $partnerData: PartnerInput!, $photo : Upload, $coverImage : Upload) {
    updatePartner(id: $id, partnerData: $partnerData, photo : $photo, coverImage : $coverImage) {
      partner{
        ...PartnerBasicInfosFragment
      }
    }
  }
  ${PARTNER_BASIC_INFOS}
`;

export const PUT_PARTNER_STATE = gql`
  mutation UpdatePartnerState($id: ID!) {
    updatePartnerState(id: $id){
      done
      success
      message
      partner{
        ...PartnerBasicInfosFragment
      }
    }
  }
  ${PARTNER_BASIC_INFOS}
`;

export const DELETE_PARTNER = gql`
  mutation DeletePartner($id: ID!) {
    deletePartner(id: $id){
      id
      success
      deleted
      message
    }
  }
`;