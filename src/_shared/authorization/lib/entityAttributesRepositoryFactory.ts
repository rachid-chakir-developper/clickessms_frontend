import type {
  AnyEntityAttributesDefinitionsMapping,
  EntitiesModel,
  ExtractEntityAttributesMapping,
  ExtractEntityTypes,
  ResolveAllEntitiesAttributes,
} from './entitiesModelEngine';
import type { EntityAttributesRepository } from './repositoriesInterfaces';

type EntityTypesWithAttributes<
  ATTRSM extends AnyEntityAttributesDefinitionsMapping<any>,
> = {
  [ET in keyof ATTRSM]: ATTRSM[ET] extends never ? never : ET;
}[keyof ATTRSM];

export type GettersFns<
  ET extends string,
  ATTRSM extends AnyEntityAttributesDefinitionsMapping<ET>,
> = {
  [ET in EntityTypesWithAttributes<ATTRSM>]: (
    id: number | string,
  ) => ResolveAllEntitiesAttributes<ATTRSM>[ET] | undefined;
};

export function buildEntityAttributesRepositoryFactory<
  EM extends EntitiesModel,
>(
  entitiesModel: EM,
): (
  getters: GettersFns<
    ExtractEntityTypes<EM>,
    ExtractEntityAttributesMapping<EM>
  >,
) => EntityAttributesRepository<EM> {
  return function buildEntityAttributesRepository(getters) {
    return {
      getEntityAttributes({ type: entityType, id: entityId }) {
        if (!entitiesModel.hasAttributes(entityType)) {
          return entitiesModel.getDefaultAttributes(entityType);
        }
        const entityTypeGetter = (getters as any)[entityType];
        if (!entityTypeGetter) {
          throw new Error(
            `Entity type ${entityType} does not declare any getter`,
          );
        }
        return entityTypeGetter(entityId);
      },
    };
  };
}
