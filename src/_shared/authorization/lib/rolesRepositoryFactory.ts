import type { EntitiesModel, ExtractEntityTypes } from './entitiesModelEngine';
import { breadthFirstSearchInEntityGraph } from './entityGraph';
import type {
  EntityChainRepository,
  RolesRepository,
} from './repositoriesInterfaces';
import type { TaggedId } from './taggedId';

export type GettersFns<ET extends string> = {
  [EntityType in ET]?: (id: number | string) => Iterable<string> | undefined;
};

export function buildRolesRepositoryFactory<
  EM extends EntitiesModel<
    string,
    Record<string, string>,
    Record<string, string>
  >,
>(
  entitiesModel: EM,
): (
  entityChainRepository: EntityChainRepository<EM>,
  getters: GettersFns<ExtractEntityTypes<EM>>,
) => RolesRepository<EM> {
  const rootEntityType = entitiesModel.getRootEntityType();

  return function buildRolesRepository(entityChainRepository, getters) {
    function getRolesInEntity(
      taggedId: TaggedId<ExtractEntityTypes<EM>>,
    ): ReadonlySet<string> | undefined {
      const { type: entityType, id: entityId } = taggedId;
      if (!entitiesModel.hasEntityType(entityType)) {
        throw new Error(`Entity type '${entityType}' is unknown`);
      }
      const rolesGetter = getters[entityType];
      if (!rolesGetter) {
        return new Set();
      }
      const maybeRoles = rolesGetter(entityId);
      if (maybeRoles === undefined) {
        return undefined;
      }
      return new Set(maybeRoles);
    }

    function getTransitiveRoles(
      roleEntityType: ExtractEntityTypes<EM>,
      fromEntity: TaggedId<ExtractEntityTypes<EM>>,
    ): ReadonlySet<string> | undefined {
      if (roleEntityType === fromEntity.type) {
        return getRolesInEntity({
          type: fromEntity.type,
          id: fromEntity.id,
        });
      }
      const nodesToEvaluate = breadthFirstSearchInEntityGraph(
        rootEntityType,
        entityChainRepository,
        { type: roleEntityType as any },
        fromEntity as any,
      );
      return new Set(
        Array.from(nodesToEvaluate)
          .filter((node) => node.type === roleEntityType)
          .flatMap(({ type, id }) => {
            const nodeRoles = getRolesInEntity({ type, id });
            if (!nodeRoles) return [];
            return [...nodeRoles];
          }),
      );
    }

    return {
      getRolesInEntity,
      getTransitiveRoles,
    };
  };
}
