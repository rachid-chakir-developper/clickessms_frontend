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
    companies: {
      company() {
        return user.company.id;
      },
    },
    accountingNatures: {
      company() {
        return user.company.id;
      },
    },
    settings: {
      company() {
        return user.company.id;
      },
    },
    sce: {
      company() {
        return user.company.id;
      },
    },
    sceModules: {
      company() {
        return user.company.id;
      },
    },
    quality: {
      company() {
        return user.company.id;
      },
    },
    activity: {
      company() {
        return user.company.id;
      },
    },
    beneficiary: {
      company() {
        return user.company.id;
      },
    },
    administrative: {
      company() {
        return user.company.id;
      },
    },
    humanRessources: {
      company() {
        return user.company.id;
      },
    },
    finance: {
      company() {
        return user.company.id;
      },
    },
    facility: {
      company() {
        return user.company.id;
      },
    },
    parking: {
      company() {
        return user.company.id;
      },
    },
    establishment: {
      company() {
        return user.company.id;
      },
    },
    task: {
      company() {
        return user.company.id;
      },
    },
    bankAccount: {
      company() {
        return user.company.id;
      },
    },
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
      let roles: any[] = user?.roles
      let sceRoles: any[] = user?.employee && user?.employee?.sceRoles ? user?.employee?.sceRoles : []
      roles = [...roles, ...sceRoles];
      return roles;
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
