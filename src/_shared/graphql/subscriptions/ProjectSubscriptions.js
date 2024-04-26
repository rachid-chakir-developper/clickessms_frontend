import { gql } from '@apollo/client';
import { PROJECT_DETAILS } from '../fragments/ProjectFragment';

// Exemple de souscription aux nouveaux projets créés
export const PROJECT_CREATED_SUBSCRIPTION = gql`
  subscription {
    projectCreated {
      ...ProjectDetailsFragment
    }
  }
  ${PROJECT_DETAILS}
`;

// Exemple de souscription aux projets mis à jour
export const PROJECT_UPDATED_SUBSCRIPTION = gql`
  subscription {
    projectUpdated {
      ...ProjectDetailsFragment
    }
  }
  ${PROJECT_DETAILS}
`;

// Exemple de souscription aux projets supprimés
export const PROJECT_DELETED_SUBSCRIPTION = gql`
  subscription {
    projectDeleted {
      id
      success
      deleted
      message
    }
  }
`;

// Autres requêtes et souscriptions personnalisées au besoin
