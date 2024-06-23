import type {
  EntitiesModel,
  EntityAttributes,
  ExtractEntityTypes,
} from './entitiesModelEngine';
import type { TaggedId } from './taggedId';

export interface RolesRepository<EM extends EntitiesModel> {
  /**
   * Returns `undefined` if the entity is not found.
   */
  getRolesInEntity(
    taggedId: TaggedId<ExtractEntityTypes<EM>>,
  ): ReadonlySet<string> | undefined;
  getTransitiveRoles(
    roleEntityType: ExtractEntityTypes<EM>,
    fromEntity: TaggedId<ExtractEntityTypes<EM>>,
  ): ReadonlySet<string> | undefined;
}

export interface EntityChainRepository<EM extends EntitiesModel> {
  getOwningEntities(
    taggedId: TaggedId<ExtractEntityTypes<EM>>,
  ): TaggedId<ExtractEntityTypes<EM>>[];
}

export interface EntityAttributesRepository<EM extends EntitiesModel> {
  getEntityAttributes<ET extends ExtractEntityTypes<EM>>(
    taggedId: TaggedId<ET>,
  ): EntityAttributes<EM, ET> | undefined;
}
