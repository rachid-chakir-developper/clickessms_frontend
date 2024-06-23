import {
  DirectedGraph,
  breadthFirstSearch as originalBreadthFirstSearch,
} from '../../dataStructures/directedGraph';
import type {
  ActionType,
  ActionsModel,
  Intent,
  IntentParameterValue,
  OverrideFn,
  ParameterControls,
  ParameterDefinition,
  ParameterScope,
  ParametersBranchDefinition,
} from './actionsModelEngine';
import {
  type EntitiesModel,
  type ExtractEntityTypes,
  type Privilege,
  decomposePrivilege,
} from './entitiesModelEngine';
import { breadthFirstSearchInEntityGraph } from './entityGraph';
import type {
  EntityAttributesRepository,
  EntityChainRepository,
  RolesRepository,
} from './repositoriesInterfaces';
import type { RolesModel } from './rolesModelEngine';
import type { TaggedId } from './taggedId';

export interface AuthorizationSystem<
  EM extends EntitiesModel,
  AM extends ActionsModel<EM>,
> {
  requestAuthorization<AT extends ActionType<AM>>(
    request: AuthorizationRequest<EM, AM, AT>,
  ): AuthorizationResponse;
}

export interface AuthorizationSystemDependencies<
  EM extends EntitiesModel,
  AM extends ActionsModel<EM>,
> {
  entitiesModel: EM;
  actionsModel: AM;
  rolesModel: RolesModel<EM>;
  rolesRepository: RolesRepository<EM>;
  entityChainRepository: EntityChainRepository<EM>;
  entityAttributesRepository: EntityAttributesRepository<EM>;
}

export function buildAuthorizationSystem<
  const EM extends EntitiesModel,
  const AM extends ActionsModel<EM>,
>(
  dependencies: AuthorizationSystemDependencies<EM, AM>,
): AuthorizationSystem<EM, AM> {
  const { entitiesModel, actionsModel } = dependencies;

  validateInput(entitiesModel, actionsModel);

  return {
    requestAuthorization(intent) {
      const actionType = intent.type;
      const actionTypeDefinition = actionsModel[actionType] as AM[keyof AM];
      if (actionTypeDefinition === undefined) {
        throw new Error(`Unknown action type: ${String(actionType)}`);
      }

      return getAuthorization(
        dependencies,
        actionTypeDefinition,
        intent.parameters ?? {},
      );
    },
  };
}

export type AuthorizationRequest<
  EM extends EntitiesModel,
  AM extends ActionsModel<EM>,
  AT extends ActionType<AM>,
> = Intent<EM, AM, AT>;

export type AuthorizationResponse = { authorized: boolean; reasons?: string[] };

function setDifference<T>(a: Set<T>, b: Set<T>): Set<T> {
  const result = new Set<T>();
  for (const value of a) {
    if (!b.has(value)) {
      result.add(value);
    }
  }
  return result;
}

function* getMatchingBranches<
  const EM extends EntitiesModel,
  const AM extends ActionsModel<EM>,
>(
  actionTypeDefinition: AM[keyof AM],
  parameters: Record<string, IntentParameterValue<EM>> = {},
): Iterable<{
  branch: ParametersBranchDefinition<EM>;
  branchKeys: Set<string>;
  override?: OverrideFn<EM>;
}> {
  const branches = actionTypeDefinition.params;

  const allParamKeys = new Set<string>();
  for (const branch of branches) {
    for (const key of Object.keys(branch)) {
      allParamKeys.add(key);
    }
  }

  const knownProvidedParamKeys = new Set(Object.keys(parameters));
  for (const key of knownProvidedParamKeys) {
    if (!allParamKeys.has(key)) {
      knownProvidedParamKeys.delete(key);
    }
  }

  // For each branch in the union of possible objects...
  for (const [i, branch] of branches.entries()) {
    const branchKeys = new Set(Object.keys(branch));

    // If a parameter that is provided is not in the branch
    // definition, the branch does not match.
    const unmatchingKeys = setDifference(knownProvidedParamKeys, branchKeys);
    if (unmatchingKeys.size > 0) {
      continue;
    }

    yield { branch, branchKeys, override: actionTypeDefinition.overrides[i] };
  }
}

function parseEntity<EM extends EntitiesModel>(
  entitiesModel: EM,
  paramDef: ParameterDefinition<EM, ExtractEntityTypes<EM>>,
  paramValue: IntentParameterValue<EM>,
): TaggedId<ExtractEntityTypes<EM>> | undefined {
  type ET = ExtractEntityTypes<EM>;

  const rootEntityType = entitiesModel.getRootEntityType();

  let entity: TaggedId<ET> | undefined = undefined;

  // If the ID is directly provided (shorthand), we wrap it in a tagged ID.
  if (typeof paramValue === 'number' || typeof paramValue === 'string') {
    entity = { type: paramDef.entityType, id: paramValue };
  }
  // If the parameter is an object that has the ID as its property `value`,
  // we get it out and wrap it in a tagged ID
  else if (
    typeof paramValue === 'object' &&
    paramValue !== null &&
    paramValue.value !== undefined
  ) {
    entity = { type: paramDef.entityType, id: paramValue.value };
  }

  // There is a single entity of the root entity type, and we don't really
  // care about its ID for authorization purposes. We can just set it to 0.
  // TODO: Set the real ID for correctness, just in case.
  if (entity && entity.type === rootEntityType) {
    entity.id = 0;
  }

  return entity;
}

function parseScope<const EM extends EntitiesModel>(
  entitiesModel: EM,
  entityType: ExtractEntityTypes<EM>,
  paramValue: IntentParameterValue<EM>,
): ParameterScope<ExtractEntityTypes<EM>> {
  const rootEntityType = entitiesModel.getRootEntityType();

  // If the scope is not provided alongside the parameter, we default to the
  // entity type of the parameter.
  // Note that we cannot just get `entity.type` as the specific entity may
  // not have been provided.
  let scope: ParameterScope<ExtractEntityTypes<EM>> = { type: entityType };
  if (
    typeof paramValue === 'object' &&
    paramValue !== null &&
    paramValue.scope
  ) {
    // Scopes on entity types can be provided directly as a string
    // (shorthand).
    scope =
      typeof paramValue.scope === 'string'
        ? { type: paramValue.scope }
        : paramValue.scope;
  }

  // There is a single entity of the root entity type, and we don't really
  // care about its ID for authorization purposes. We can just set it to 0.
  // TODO: Set the real ID for correctness, just in case.
  if (scope.type === rootEntityType) {
    scope.id = 0;
  }

  return scope;
}

function resolveScope<const EM extends EntitiesModel>(
  entitiesModel: EM,
  paramDefScope: ExtractEntityTypes<EM>,
  entityType: ExtractEntityTypes<EM>,
  entity: TaggedId<ExtractEntityTypes<EM>> | undefined,
  providedScope: ParameterScope<ExtractEntityTypes<EM>>,
): ParameterScope<ExtractEntityTypes<EM>> {
  // From the provided scope, we need to determine the actual scope based on
  // the parameter definition.
  // There are 4 possible situations:
  // - The entity type of the provided scope is equal to the entity type
  // of the parameter definition scope. In this case, we keep the provided
  // scope. (The scopes themselves may be different because the provided
  // scope can be on a specific entity, while the parameter definition scope
  // is always on an entity type only. This is why we explicitely keep the
  // provided scope).
  // - The entity type of the provided scope is in the chain of ownership
  // of the parameter definition scope. It means that the provided scope
  // is more restrictive than the parameter definition scope, so we keep it.
  // - The entity type of the parameter definition scope is in the chain
  // of ownership of the provided scope. It means that the provided scope
  // is less restrictive than the parameter definition scope. If the entity
  // type of provided scope is equal to the entity type of the parameter, it
  // means that no scope was actually provided. Thus, we want to take the
  // scope of the parameter definition. Else, we would need to combine the
  // provided scope and the parameter definition scope. As we currently have
  // no use case for this, and the  implementation is a bit complex, we will
  // throw. WARNING: This works as long as an entity type can never own
  // itself!
  // - Neither entity types are in the chain of ownership of the other.
  // This is an error on the part of the requester. For now we throw an
  // error.

  let scope: ParameterScope<ExtractEntityTypes<EM>> = providedScope;

  if (providedScope.type === paramDefScope) {
    // If an ID of entity is provided and its type is the same as the scope,
    // we can zero-out on it directly as we assume that no entity can be
    // owned by another entity of the same type.
    if (entity) {
      scope = entity;
    }
  } else if (
    entitiesModel.entityTypeHasTransitiveOwner(
      paramDefScope,
      providedScope.type,
    )
  ) {
    // Do nothing
  } else if (
    entitiesModel.entityTypeHasTransitiveOwner(
      providedScope.type,
      paramDefScope,
    )
  ) {
    if (scope.type !== entityType) {
      throw new Error('Combining scopes is not supported (yet)');
    }
    scope = { type: paramDefScope };
  } else {
    throw new Error(
      `Entity type '${providedScope.type}' of provided scope is not an ancestor of the parameter scope '${paramDefScope}'`,
    );
  }

  if (
    entity === undefined &&
    scope.type !== paramDefScope &&
    scope.id === undefined
  ) {
    throw new Error(
      'Entity type scope is not supported when parameter is missing',
    );
  }

  return scope;
}

function getWhetherUserHasPrivilegeFromEntityAndScope<
  const EM extends EntitiesModel,
  const AM extends ActionsModel<EM>,
>(
  dependencies: AuthorizationSystemDependencies<EM, AM>,
  entity: TaggedId<ExtractEntityTypes<EM>> | undefined,
  scope: ParameterScope<ExtractEntityTypes<EM>>,
  privilege: Privilege<EM>,
): { outcome: 'aborted'; reason: string } | { outcome: 'granted' | 'denied' } {
  type ET = ExtractEntityTypes<EM>;
  const { entitiesModel, entityChainRepository, rolesModel, rolesRepository } =
    dependencies;
  const rootEntityType = entitiesModel.getRootEntityType();

  const { entityType, privilegeLevel } = decomposePrivilege(privilege);

  // Instantiate graph
  const privilegesGraph = new DirectedGraph();
  privilegesGraph.addNode('start');

  const entityPrivileges =
    entitiesModel.getPrivilegeLevelsOfEntityType(entityType);

  // For all attainable privileges of targeted entity
  for (const [i, privilege] of entityPrivileges.entries()) {
    // Create the node for this privilege
    const currentPrivilege = `${entityType}:${privilege}`;
    privilegesGraph.addNode(currentPrivilege);

    // Starting at the second privilege, add the edge between the one before and the current one
    // allowing traversal from a higher privilege to a lower one
    if (i !== 0) {
      const previousPrivilege = `${entityType}:${entityPrivileges[i - 1]}`;
      privilegesGraph.addEdge(previousPrivilege, currentPrivilege);
    }
  }

  let startingEntity: TaggedId<ET>;
  if (entity === undefined) {
    if (scope.id === undefined) {
      // For now, ignore non-root missing parameters
      return { outcome: 'granted' };
    }
    startingEntity = scope as TaggedId<ET>;
  } else {
    startingEntity = entity;
  }

  for (const { type, id } of breadthFirstSearchInEntityGraph(
    rootEntityType,
    entityChainRepository,
    scope,
    startingEntity,
  )) {
    const currentRoles = rolesRepository.getRolesInEntity({ type, id });

    if (currentRoles === undefined) {
      // Entity was not found
      // TODO: Log this, then test that we log
      return {
        outcome: 'aborted',
        reason: `Entity '${type}' of ID '${id}' not found`,
      };
    }

    for (const role of currentRoles) {
      const edges = rolesModel.getEdgesOfPrivilegesGraphForRole(
        `${type}#${role}`,
      );
      for (const [start, end] of edges) {
        privilegesGraph.addEdge(start, end);
      }

      /**
       * FIXME: Not optimal, we traverse the graph on each found role to try and exit early
       * We could also use depthFirstSearch to start from the privilege and try to find a path to start
       * instead, as most path do not lead to the required privilege.
       */
      for (const node of originalBreadthFirstSearch(privilegesGraph, 'start')) {
        if (node === `${entityType}:${privilegeLevel}`) {
          return { outcome: 'granted' };
        }
      }
    }
  }
  return { outcome: 'denied' };
}

function getParameterControls<const EM extends EntitiesModel>(
  entityAttributesRepository: EntityAttributesRepository<EM>,
  paramDef: ParameterDefinition<EM, ExtractEntityTypes<EM>>,
  entity: TaggedId<ExtractEntityTypes<EM>> | undefined,
): ParameterControls<EM> {
  if (entity && paramDef.getParameterControls) {
    const attributes = entityAttributesRepository.getEntityAttributes(entity);
    if (attributes === undefined) {
      throw new Error(
        `Attributes not found for entity of type '${entity.type}' and ID '${entity.id}'`,
      );
    }
    return paramDef.getParameterControls(attributes);
  }
  return paramDef.defaultParameterControls;
}

function getAuthorization<
  const EM extends EntitiesModel,
  const AM extends ActionsModel<EM>,
>(
  dependencies: AuthorizationSystemDependencies<EM, AM>,
  actionTypeDefinition: AM[keyof AM],
  parameters: Record<string, IntentParameterValue<NoInfer<EM>>>,
): AuthorizationResponse {
  const { entitiesModel, entityAttributesRepository } = dependencies;

  const reasons: string[] = [];

  for (const { branch, branchKeys, override } of getMatchingBranches(
    actionTypeDefinition,
    parameters,
  )) {
    if (override) {
      const authorizedForCurrentBranch = override(
        {
          ...dependencies,
          doesEntityGrantPrivilege(taggedId, privilege) {
            const result = getWhetherUserHasPrivilegeFromEntityAndScope(
              dependencies,
              taggedId,
              taggedId,
              privilege,
            );
            return result.outcome === 'granted';
          },
        },
        parameters,
      );
      if (authorizedForCurrentBranch) {
        return { authorized: true };
      }
    } else {
      const authorizedForCurrentBranch = Array.from(branchKeys).every(
        (paramKey): boolean => {
          const paramDef = branch[paramKey];
          const paramValue = parameters[paramKey];

          const entity = parseEntity(entitiesModel, paramDef, paramValue);
          // This must always be true. The assertion is here in case
          // the logic changes in the future.
          if (entity && entity.type !== paramDef.entityType) {
            throw new Error(
              `Entity type of entity does not match entity type of parameter definition`,
            );
          }

          const { privilege, scope: paramDefScope } = getParameterControls(
            entityAttributesRepository,
            paramDef,
            entity,
          );

          const providedScope = parseScope(
            entitiesModel,
            paramDef.entityType,
            paramValue,
          );

          const scope = resolveScope(
            entitiesModel,
            paramDefScope,
            paramDef.entityType,
            entity,
            providedScope,
          );

          const result = getWhetherUserHasPrivilegeFromEntityAndScope(
            dependencies,
            entity,
            scope,
            privilege,
          );

          switch (result.outcome) {
            case 'aborted':
              reasons.push(result.reason);
              return false;
            case 'denied':
              reasons.push(
                `Privilege '${privilege}' not granted for entity of type '${entity?.type ?? entitiesModel.getRootEntityType()}'`,
              );
              return false;
            case 'granted':
              return true;
            default:
              throw new Error(
                `Unexpected outcome: '${(result as any).outcome}'`,
              );
          }
        },
      );
      if (authorizedForCurrentBranch) {
        return { authorized: true };
      }
    }
  }
  return { authorized: false, reasons };
}

function validateInput<EM extends EntitiesModel, AM extends ActionsModel<EM>>(
  entitiesModel: EM,
  actionsModel: AM,
) {
  const declaredPrivileges = extractActionsModelPrivileges(actionsModel);
  for (const privilege of declaredPrivileges) {
    const [entityType, privilegeLevel] = privilege.split(':');
    const entityPrivileges =
      entitiesModel.getPrivilegeLevelsOfEntityType(entityType);
    if (!entityPrivileges.includes(privilegeLevel)) {
      throw new Error(
        `Privilege '${privilege}' is used in actions model but not declared in entities model`,
      );
    }
  }
}

function extractActionsModelPrivileges(
  actionsModel: ActionsModel<any>,
): string[] {
  const privileges: string[] = [];

  function recurse(node: any): void {
    if (typeof node === 'object' && node !== null) {
      if (Array.isArray(node)) {
        node.forEach((item) => recurse(item));
      } else {
        for (const key in node) {
          if (key === 'privilege') {
            privileges.push(node[key]);
          } else {
            recurse(node[key]);
          }
        }
      }
    }
  }

  recurse(actionsModel);
  return privileges;
}
