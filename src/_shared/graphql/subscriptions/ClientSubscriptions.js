import { gql } from '@apollo/client';
import { CLIENT_DETAILS } from '../fragments/ClientFragment';

export const CLIENT_CREATED_SUBSCRIPTION = gql`
  subscription ClientCreated {
    clientCreated {
      ...ClientDetailsFragment
      // Include other client fields
    }
  }
  ${CLIENT_DETAILS}
`;

export const CLIENT_UPDATED_SUBSCRIPTION = gql`
  subscription ClientUpdated {
    clientUpdated {
      ....ClientDetailsFragment
      // Include other client fields
    }
  }
  ${CLIENT_DETAILS}
`;

export const CLIENT_DELETED_SUBSCRIPTION = gql`
  subscription ClientDeleted {
    clientDeleted {
      id
    }
  }
`;

// Add more client-related subscriptions here
