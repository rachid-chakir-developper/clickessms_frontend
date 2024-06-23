import type {
  EntitiesModel,
  ExtractOwnersTypesMapping,
} from './entitiesModelEngine';
import type { EntityChainRepository } from './repositoriesInterfaces';

export type GettersFns<OETS extends Record<string, string>> = {
  [K in keyof OETS]: {
    [K2 in OETS[K]]: (id: number | string) => (number | string)[] | undefined;
  };
};

export function buildEntityChainRepositoryFactory<EM extends EntitiesModel>(
  entitiesModel: EM,
): (
  getters: GettersFns<ExtractOwnersTypesMapping<EM>>,
) => EntityChainRepository<EM> {
  return function buildEntityChainRepository(getters) {
    return {
      getOwningEntities({ type: entityType, id: entityId }) {
        return Array.from(entitiesModel.getOwners(entityType)).flatMap(
          (owner) => {
            const entityTypeGetters = getters[entityType];
            if (!entityTypeGetters) {
              throw new Error(
                `Entity type ${entityType} does not declare any getter`,
              );
            }
            const entityTypeOwnerGetter = (entityTypeGetters as any)[
              owner.type
            ];
            if (!entityTypeOwnerGetter) {
              throw new Error(
                `Entity type ${entityType} does not declare any getter for owner entity type ${owner.type}`,
              );
            }
            const ownerIds = entityTypeOwnerGetter(entityId);
            // TODO: Log when ownerIds is undefined. It means that
            // the entity was not found in the store.
            if (ownerIds == null) {
              return [];
            }

            const n = ownerIds.length;
            switch (owner.cardinality) {
              case '*':
                // Nothing to validate
                break;
              case '+':
                if (n < 1) {
                  throw new Error(
                    `Expected at least 1 owner of type '${owner.type}' for entity of type '${entityType}' with id '${entityId}', but got ${n}`,
                  );
                }
                break;
              case '?':
                if (n > 1) {
                  throw new Error(
                    `Expected at most 1 owner of type '${owner.type}' for entity of type '${entityType}' with id '${entityId}', but got ${n}`,
                  );
                }
                break;
              case '1':
                if (n !== 1) {
                  throw new Error(
                    `Expected exactly 1 owner of type '${owner.type}' for entity of type '${entityType}' with id '${entityId}', but got ${n}`,
                  );
                }
                break;
              default:
                throw new Error(
                  `Unknown cardinality '${owner.cardinality}' for owner of type '${owner.type}' for entity of type '${entityType}'`,
                );
            }

            return ownerIds.map((id: number) => ({
              type: owner.type,
              id,
            }));
          },
        );
      },
    };
  };
}
