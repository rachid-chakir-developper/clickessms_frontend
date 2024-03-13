import { gql } from '@apollo/client';
import { USER_BASIC_INFOS, USER_DETAILS } from '../fragments/UserFragment';

export const ON_USER_ADDEd = gql`
  subscription onUserAdded {
    onUserAdded {
      user{
        ...UserDetailsFragment
      }
    }
  }
  ${USER_DETAILS}
`;

export const ON_USER_UPDATED = gql`
  subscription onUserUpdated {
    onUserUpdated {
      user{
        ...UserBasicInfosFragment
      }
    }
  }
  ${USER_BASIC_INFOS}
`;

export const ON_USER_DELETED = gql`
  subscription onUserDeleted {
    onUserDeleted {
      id
    }
  }
`;

// Similar subscriptions can be defined for Client and Employee entities.
