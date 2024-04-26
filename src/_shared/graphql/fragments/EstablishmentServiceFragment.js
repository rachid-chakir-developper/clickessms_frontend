// EstablishmentServiceFragment.js

import { gql } from '@apollo/client';
import { FOLDER_MINI_INFOS } from './MediaFragment';
import { ESTABLISHMENT_MINI_INFOS } from './EstablishmentFragment';

export const ESTABLISHMENT_SERVICE_MINI_INFOS = gql`
  fragment EstablishmentServiceMiniInfosFragment on EstablishmentServiceType {
    id
    number
    name
    siret
    image
    isActive
  }
`;

export const ESTABLISHMENT_SERVICE_BASIC_INFOS = gql`
  fragment EstablishmentServiceBasicInfosFragment on EstablishmentServiceType {
    ...EstablishmentServiceMiniInfosFragment
    establishmentServiceParent {
      ...EstablishmentServiceMiniInfosFragment
    }
    establishment {
      ...EstablishmentMiniInfosFragment
    }
    folder {
      ...FolderMiniInfosFragment
    }
  }
  ${ESTABLISHMENT_SERVICE_MINI_INFOS}
  ${ESTABLISHMENT_MINI_INFOS}
  ${FOLDER_MINI_INFOS}
`;
export const ESTABLISHMENT_SERVICE_DETAILS = gql`
  fragment EstablishmentServiceDetailsFragment on EstablishmentServiceType {
    ...EstablishmentServiceBasicInfosFragment
    establishmentServiceChilds {
      ...EstablishmentServiceBasicInfosFragment
    }
    establishment {
      ...EstablishmentMiniInfosFragment
    }
    description
    observation
    establishmentServiceType
  }
  ${ESTABLISHMENT_SERVICE_BASIC_INFOS}
  ${ESTABLISHMENT_MINI_INFOS}
`;
