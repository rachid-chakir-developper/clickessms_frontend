import type { ParameterScope } from './actionsModelEngine';
import type {
  EntitiesModel,
  ExtractEntityTypes,
  ExtractRootEntityType,
} from './entitiesModelEngine';
import type { EntityChainRepository } from './repositoriesInterfaces';
import { type TaggedId, serializeTaggedId } from './taggedId';

/**
 * Yields visited nodes under scope when performing a breadth-firth traversal of
 * the entities graph, starting from the given entity.
 */
export function* breadthFirstSearchInEntityGraph<EM extends EntitiesModel>(
  rootEntityType: ExtractRootEntityType<EM>,
  entityChainRepository: EntityChainRepository<EM>,
  scope: ParameterScope<ExtractEntityTypes<EM>>,
  startingEntity: TaggedId<ExtractEntityTypes<EM>>,
): Iterable<TaggedId<ExtractEntityTypes<EM>>> {
  type ET = ExtractEntityTypes<EM>;

  // If the scope is the root entity, we can skip graph traversal. Indeed,
  // the root entity is unique and already known; there is no reason to walk
  // up the chain of ownership to get it.
  if (scope.type === rootEntityType) {
    yield { type: rootEntityType, id: 0 };
  }

  const outsideScopeQueue: TaggedId<ET>[] = [startingEntity];
  const insideScopeQueue: TaggedId<ET>[] = [];
  const visitedOutsideScope = new Set<string>([
    serializeTaggedId(startingEntity),
  ]);
  const visitedInsideScope = new Set<string>();

  while (outsideScopeQueue.length > 0) {
    const currentNode = outsideScopeQueue.shift()!;
    if (
      currentNode.type === scope.type &&
      (scope.id === undefined || currentNode.id === scope.id)
    ) {
      insideScopeQueue.push(currentNode);
      continue;
    }

    for (const neighbor of entityChainRepository.getOwningEntities(
      currentNode,
    ) || []) {
      const serialized = serializeTaggedId(neighbor);
      if (!visitedOutsideScope.has(serialized)) {
        visitedOutsideScope.add(serialized);
        outsideScopeQueue.push(neighbor);
      }
    }
  }

  while (insideScopeQueue.length > 0) {
    const currentNode = insideScopeQueue.shift()!;
    yield currentNode;

    for (const neighbor of entityChainRepository.getOwningEntities(
      currentNode,
    ) || []) {
      const serialized = serializeTaggedId(neighbor);
      if (!visitedInsideScope.has(serialized)) {
        visitedInsideScope.add(serialized);
        visitedOutsideScope.add(serialized);
        insideScopeQueue.push(neighbor);
      }
    }
  }
}
