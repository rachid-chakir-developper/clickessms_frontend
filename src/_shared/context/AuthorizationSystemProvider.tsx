import { createContext, useContext } from 'react';
import {
  AuthorizationSystem,
  buildAuthorizationSystem,
} from '../authorization/lib/authorizationSystem';
import { gql, useApolloClient } from '@apollo/client';
import { entitiesModel } from '../authorization/entitiesModel';
import { actionsModel } from '../authorization/actionsModel';
import { rolesModel } from '../authorization/rolesModel';
import { buildEntityChainRepositoryFactory } from '../authorization/lib/entityChainRepositoryFactory';
import { buildEntityAttributesRepositoryFactory } from '../authorization/lib/entityAttributesRepositoryFactory';
import { buildRolesRepositoryFactory } from '../authorization/lib/rolesRepositoryFactory';
import { useSession } from './SessionProvider';

const buildEntityChainRepository =
  buildEntityChainRepositoryFactory(entitiesModel);

const buildEntityAttributesRepository =
  buildEntityAttributesRepositoryFactory(entitiesModel);

const buildRolesRepository = buildRolesRepositoryFactory(entitiesModel);

export type CurrentAuthorizationSystem = AuthorizationSystem<
  typeof entitiesModel,
  typeof actionsModel
>;

const authorizationContext = createContext<
  CurrentAuthorizationSystem | undefined
>(undefined);

export function AuthorizationSystemProvider({ children }) {
  const { Provider } = authorizationContext;

  const { user } = useSession();

  const apolloClient = useApolloClient();

  const entityAttributesRepository = buildEntityAttributesRepository({});

  const entityChainRepository = buildEntityChainRepository({
    company: {},
    vehicle: {
      company() {
        return user.company.id;
      },
    },
    vehicleInspection: {
      vehicle(inspectionId) {
        const frag = apolloClient.readFragment({
          id: `VehicleInspection:${inspectionId}`,
          fragment: gql`
            fragment VehicleInspectionVehicle on VehicleInspection {
              vehicle {
                id
              }
            }
          `,
        });
        return frag?.vehicle?.id ?? undefined;
      },
    },
  });

  const rolesRepository = buildRolesRepository(entityChainRepository, {
    company() {
      // Use role of user in here
      return ['admin'];
    },
  });

  const authorizationSystem = buildAuthorizationSystem({
    entitiesModel,
    actionsModel,
    rolesModel,
    entityAttributesRepository,
    entityChainRepository,
    rolesRepository,
  });

  return <Provider value={authorizationSystem}>{children}</Provider>;
}

export function useAuthorizationSystem() {
  const authorizationSystem = useContext(authorizationContext);
  if (!authorizationSystem) {
    throw new Error(
      'useAuthorizationSystem must be used within a AuthorizationSystemProvider',
    );
  }
  return authorizationSystem;
}