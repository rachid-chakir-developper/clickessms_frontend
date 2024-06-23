import { SetMultiMap } from '../../dataStructures/multiMap';
import type {
  EntitiesModel,
  ExtractEntityTypes,
  ExtractPrivilegeLevelsMapping,
  PossiblePrivilegeLevel,
} from './entitiesModelEngine';

export type RolesModelDefinition<EM extends EntitiesModel> = {
  [EntityType in ExtractEntityTypes<EM>]?: {
    [RoleName in string]: {
      [EntityType in ExtractEntityTypes<EM>]?: ExtractPrivilegeLevelsMapping<EM>[EntityType]; // privilegeLevel
    };
  };
};

type EdgeForPrivilegesGraph = [
  start: 'start' | `${string}:${string}`,
  end: `${string}:${string}`,
];

type AnyRolesModelDefinition = Record<
  string,
  Record<string, Record<string, string>>
>;

export interface RolesModel<EM extends EntitiesModel> {
  patch(rolesModelPatch: RolesModelDefinition<EM>): RolesModel<EM>;
  getEdgesOfPrivilegesGraphForRole(
    qualifiedRole: `${ExtractEntityTypes<EM>}#${string}`,
  ): EdgeForPrivilegesGraph[];
  readonly rolesByEntityType: SetMultiMap<ExtractEntityTypes<EM>, string>;
}

export function defineRolesModel<EM extends EntitiesModel>(
  entitiesModel: EM,
  rolesModelDefinition: RolesModelDefinition<EM>,
): RolesModel<EM> {
  validateInput(entitiesModel, rolesModelDefinition);

  const rolesByEntityType = new SetMultiMap<ExtractEntityTypes<EM>, string>();

  // Keys are privileges, values are qualified roles.
  const reverseIndexOfPrivileges = new SetMultiMap<string, string>();
  for (const [entityTypeOfRole, roles] of Object.entries(
    rolesModelDefinition,
  ) as [
    ExtractEntityTypes<EM>,
    Record<string, Record<string, PossiblePrivilegeLevel>>,
  ][]) {
    for (const [role, privileges] of Object.entries(roles)) {
      rolesByEntityType.addEntry(entityTypeOfRole, role);
      for (const [
        entityTypeOfPrivilegeLevel,
        maxPrivilegeLevel,
      ] of Object.entries(privileges)) {
        const privilegeLevels = entitiesModel.getPrivilegeLevelsEqualOrBelow(
          entityTypeOfPrivilegeLevel,
          maxPrivilegeLevel,
        );
        for (const privilegeLevel of privilegeLevels) {
          reverseIndexOfPrivileges.addEntry(
            `${entityTypeOfPrivilegeLevel}:${privilegeLevel}`,
            `${entityTypeOfRole}#${role}`,
          );
        }
      }
    }
  }

  return {
    rolesByEntityType,
    patch(rolesModelPatch: RolesModelDefinition<EM>): RolesModel<EM> {
      // Widen types because TypeScript can't compare the patch with the
      // original definition with our heavy use of generics.
      const _rolesModelPatch = rolesModelPatch as AnyRolesModelDefinition;
      const _rolesModelDefinition =
        rolesModelDefinition as AnyRolesModelDefinition;

      // We walk two levels into the object to spread the new privileges
      // into the existing ones.
      const patchedRolesModel: AnyRolesModelDefinition = {};
      for (const [entityType, roles] of Object.entries(_rolesModelDefinition)) {
        patchedRolesModel[entityType] = {};
        for (const [role, privileges] of Object.entries(roles)) {
          patchedRolesModel[entityType][role] = {
            ...privileges,
            ..._rolesModelPatch[entityType]?.[role],
          };
        }
      }
      return defineRolesModel(
        entitiesModel,
        patchedRolesModel as RolesModelDefinition<EM>,
      );
    },
    getEdgesOfPrivilegesGraphForRole(qualifiedRole) {
      const [entityType, role] = qualifiedRole.split('#');
      const privileges: EdgeForPrivilegesGraph[] = [];
      for (const [entityTypeOfPrivilege, privilegeLevel] of Object.entries(
        ((rolesModelDefinition as any)[entityType] ?? {})[role] ?? {},
      )) {
        privileges.push([
          'start',
          `${entityTypeOfPrivilege}:${privilegeLevel}`,
        ]);
      }
      return privileges;
    },
  };
}

function validateInput(
  entitiesModel: EntitiesModel,
  rolesModelDefinition: RolesModelDefinition<any>,
): void {
  // TODO: Validate that a role on an entity type does not grant privileges
  // on entities that are "higher" in the hierarchy of entity types
  // Examples: ticket author must not be able to grant privileges on teams
  for (const [entityType, rolesOfEntityType] of Object.entries(
    rolesModelDefinition,
  )) {
    if (!entitiesModel.hasEntityType(entityType)) {
      throw new Error(
        `The entities model does not declare the entity type '${entityType}'`,
      );
    }
    if (!rolesOfEntityType) {
      continue;
    }
    for (const [roleName, roleDefinition] of Object.entries(
      rolesOfEntityType,
    )) {
      for (const [privilegeEntityType, privilegeLevel] of Object.entries(
        roleDefinition,
      )) {
        if (!privilegeLevel) {
          throw new Error('Privilege level must be defined');
        }
        if (!entitiesModel.hasEntityType(privilegeEntityType)) {
          throw new Error(
            `Role '${roleName}' of entity type '${entityType}' grants privilege '${privilegeEntityType}:${privilegeLevel}' but the entities model does not declare the entity type '${privilegeEntityType}'`,
          );
        }
        const entityPrivileges =
          entitiesModel.getPrivilegeLevelsOfEntityType(privilegeEntityType);
        if (!entityPrivileges.includes(privilegeLevel)) {
          throw new Error(
            `Role '${roleName}' of entity type '${entityType}' grants privilege '${privilegeEntityType}:${privilegeLevel}' but the entities model does not declare the privilege level '${privilegeLevel}' for the entity type '${privilegeEntityType}' is not declared in the entities model`,
          );
        }
      }
    }
  }
}
