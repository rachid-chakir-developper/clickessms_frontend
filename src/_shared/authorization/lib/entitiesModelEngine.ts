import {
  DirectedGraph,
  breadthFirstSearch,
  findCycle,
} from '../../dataStructures/directedGraph';

// TODO: Document privilege levels
export type PossiblePrivilegeLevel = string;

export type EntityTypeDefinition<
  ET extends string,
  OET extends NoInfer<ET>,
  PL extends PossiblePrivilegeLevel,
  ATTRS extends AnyEntityAttributesDefinition,
> = {
  privileges?: PL[];
  attributes?: ATTRS;
} & (
  | { root: true }
  | {
      ownedBy: OwnedBy<OET>;
    }
);

export type AnyEntityAttributesDefinitionsMapping<ET extends string> = {
  [K in ET]: AnyEntityAttributesDefinition;
};

// For now, only boolean attributes can be declared.
export type AnyEntityAttributesDefinition = Record<string, 'boolean'>;

export type ResolveAttributeType<ATTR> = ATTR extends 'boolean'
  ? boolean
  : never;

export type ResolveAllEntitiesAttributes<
  ATTRSM extends AnyEntityAttributesDefinitionsMapping<string>,
> = {
  [ET in keyof ATTRSM]: ATTRSM[ET] extends never
    ? unknown
    : {
        [K in keyof ATTRSM[ET]]: ResolveAttributeType<ATTRSM[ET][K]>;
      };
};

export type EntityAttributes<
  EM extends EntitiesModel,
  ET extends ExtractEntityTypes<EM>,
> = ResolveAllEntitiesAttributes<ExtractEntityAttributesMapping<EM>>[ET];

export type Privilege<EM extends EntitiesModel> = {
  [SingleET in ExtractEntityTypes<EM>]: `${SingleET}:${ExtractPrivilegeLevelsMapping<EM>[SingleET]}`;
}[ExtractEntityTypes<EM>];

export type PrivilegeResolver<
  EM extends EntitiesModel,
  ET extends ExtractEntityTypes<EM>,
> = (
  attributes: ResolveAllEntitiesAttributes<
    ExtractEntityAttributesMapping<EM>
  >[ET],
) =>
  | Privilege<EM>
  | [
      Privilege<EM>,
      ParameterDefinitionPrivilegeOptions<EM, ExtractEntityTypes<EM>>,
    ];

export interface ParameterDefinitionPrivilegeOptions<
  EM extends EntitiesModel,
  ET extends ExtractEntityTypes<EM>,
> {
  scope?: ET;
}

export function decomposePrivilege<EM extends EntitiesModel>(
  privilege: Privilege<EM>,
): {
  entityType: ExtractEntityTypes<EM>;
  privilegeLevel: ExtractPrivilegeLevelsMapping<EM>[ExtractEntityTypes<EM>];
} {
  const [entityType, privilegeLevel] = privilege.split(':');
  return { entityType, privilegeLevel } as any;
}

export type Cardinality =
  /** Exactly one */
  | '1'
  /** One or none */
  | '?'
  /** At least one */
  | '+'
  /** Any number */
  | '*';

type OwnedBy<OET extends string> =
  | OET
  | { anyOneOf: OET[] }
  | { oneOf: OET }
  | { manyOf: OET }
  | { anyNumberOf: OET[] };

export type EntitiesModelDefinition = Record<
  string,
  EntityTypeDefinition<
    string,
    string,
    PossiblePrivilegeLevel,
    AnyEntityAttributesDefinition
  >
>;

export type ExtractOwnersTypes<
  ETD extends EntityTypeDefinition<
    string,
    string,
    PossiblePrivilegeLevel,
    AnyEntityAttributesDefinition
  >,
> = ETD extends { ownedBy: OwnedBy<infer OET> } ? OET : never;

type ExtractEntityAttributesDefinitions<
  ETD extends EntityTypeDefinition<
    string,
    string,
    PossiblePrivilegeLevel,
    AnyEntityAttributesDefinition
  >,
> = ETD extends { attributes?: infer ATTRS } ? ATTRS : never;

type ExtractPrivilegeLevels<
  ETD extends EntityTypeDefinition<
    string,
    string,
    PossiblePrivilegeLevel,
    AnyEntityAttributesDefinition
  >,
> = ETD extends { privileges: (infer PL)[] }
  ? PL extends string
    ? PL
    : never
  : never;

type ExtractOwnersTypesMappingFromEntitiesModelDefinition<
  EMD extends EntitiesModelDefinition,
> = {
  [K in keyof EMD]: ExtractOwnersTypes<EMD[K]>;
};

type ExtractPrivilegeLevelsMappingFromEntitiesModelDefinition<
  EMD extends EntitiesModelDefinition,
> = {
  [ET in keyof EMD & string]: ExtractPrivilegeLevels<EMD[ET]>;
};

type ExtractEntityAttributesMappingFromEntitiesModelDefinition<
  EMD extends EntitiesModelDefinition,
> = {
  [ET in keyof EMD & string]: ExtractEntityAttributesDefinitions<EMD[ET]>;
};

export type ExtractEntityTypes<EM extends EntitiesModel> =
  EM extends EntitiesModel<infer ET, any, any, any> ? ET : never;

export type ExtractRootEntityType<EM extends EntitiesModel> =
  EM extends EntitiesModel<infer ET, infer OETS, any, any>
    ? { [SingleET in ET]: OETS[SingleET] extends never ? SingleET : never }[ET]
    : never;

export type ExtractOwnersTypesMapping<EM extends EntitiesModel> =
  EM extends EntitiesModel<any, infer OETS, any, any> ? OETS : never;

export type ExtractPrivilegeLevelsMapping<EM extends EntitiesModel> =
  EM extends EntitiesModel<any, any, infer PLS, any> ? PLS : never;

export type ExtractEntityAttributesMapping<EM extends EntitiesModel> =
  EM extends EntitiesModel<any, any, any, infer ATTRSM> ? ATTRSM : never;

export interface EntitiesModel<
  ET extends string = string,
  OETS extends Record<ET, ET> = Record<ET, ET>,
  PLS extends Record<ET, string> = Record<ET, string>,
  ATTRSM extends
    AnyEntityAttributesDefinitionsMapping<ET> = AnyEntityAttributesDefinitionsMapping<ET>,
> {
  getPrivilegeLevelsEqualOrBelow(
    entityType: ET,
    privilegeLevel: PossiblePrivilegeLevel,
  ): string[];
  getChainOfOwnership(entityType: ET): ET[];
  getOwners<SingleET extends ET>(
    entityType: SingleET,
  ): Iterable<{ type: OETS[SingleET]; cardinality: Cardinality }>;
  getPrivilegeLevelsOfEntityType<SingleET extends ET>(
    entityType: SingleET,
  ): PLS[SingleET][];
  getRootEntityType(): {
    [SingleET in ET]: OETS[SingleET] extends never ? SingleET : never;
  }[ET];
  hasEntityType(entityType: string): entityType is ET;
  entityTypeHasTransitiveOwner<SingleET extends ET>(
    entityType: SingleET,
    potentialOwner: ET,
  ): potentialOwner is OETS[SingleET];
  getDefaultAttributes<SingleET extends ET>(
    entityType: SingleET,
  ): ResolveAllEntitiesAttributes<ATTRSM>[SingleET];
  hasAttributes<SingleET extends ET>(entityType: SingleET): boolean;
}

export type BuildEntitiesModel<EMD extends EntitiesModelDefinition> =
  EntitiesModel<
    keyof EMD & string,
    ExtractOwnersTypesMappingFromEntitiesModelDefinition<EMD>,
    ExtractPrivilegeLevelsMappingFromEntitiesModelDefinition<EMD>,
    ExtractEntityAttributesMappingFromEntitiesModelDefinition<EMD>
  >;

export function defineEntitiesModel<const EMD extends EntitiesModelDefinition>(
  definition: EMD,
): BuildEntitiesModel<EMD> {
  type ET = keyof EMD & string;
  type OETS = ExtractOwnersTypesMappingFromEntitiesModelDefinition<EMD>;
  type PLS = ExtractPrivilegeLevelsMappingFromEntitiesModelDefinition<EMD>;

  const ownershipGraph = new DirectedGraph<ET>();
  const cardinalities = new Map<`${ET}>${ET}`, Cardinality>();
  let root: ET | undefined;

  const defaultAttributesByEntityType: Map<ET, any> = new Map();
  const entityTypesWithAttributes = new Set<ET>();

  for (const [entityType, entityTypeDef] of Object.entries(definition) as [
    ET,
    EntityTypeDefinition<
      ET,
      ET,
      PossiblePrivilegeLevel,
      AnyEntityAttributesDefinition
    >,
  ][]) {
    ownershipGraph.addNode(entityType);

    const defaultAttributes: any = {};
    if (entityTypeDef.attributes) {
      entityTypesWithAttributes.add(entityType);
      for (const [attribute, type] of Object.entries(
        entityTypeDef.attributes,
      )) {
        if (type !== 'boolean') {
          throw new Error('Only boolean attributes are supported');
        }
        defaultAttributes[attribute] = false;
      }
    }
    Object.freeze(defaultAttributes);

    defaultAttributesByEntityType.set(entityType, defaultAttributes);

    if ('root' in entityTypeDef && entityTypeDef.root) {
      if (root !== undefined) {
        throw new Error('Multiple roots');
      }
      root = entityType;
      continue;
    }

    // Bailing out of types because it is too annoying and provides little
    // value.
    const ownedBy = (entityTypeDef as any).ownedBy;
    if (typeof ownedBy === 'string') {
      ownershipGraph.addEdge(entityType, ownedBy as ET);
      cardinalities.set(`${entityType}>${ownedBy}`, '1');
    } else if ('oneOf' in ownedBy) {
      ownershipGraph.addEdge(entityType, ownedBy.oneOf);
      cardinalities.set(`${entityType}>${ownedBy.oneOf}`, '1');
    } else if ('manyOf' in ownedBy) {
      ownershipGraph.addEdge(entityType, ownedBy.manyOf);
      cardinalities.set(`${entityType}>${ownedBy.manyOf}`, '*');
    } else if ('anyOneOf' in ownedBy) {
      for (const owner of ownedBy.anyOneOf) {
        ownershipGraph.addEdge(entityType, owner);
        cardinalities.set(`${entityType}>${owner}`, '?');
      }
    } else if ('anyNumberOf' in ownedBy) {
      for (const owner of ownedBy.anyNumberOf) {
        ownershipGraph.addEdge(entityType, owner);
        cardinalities.set(`${entityType}>${owner}`, '*');
      }
    }
  }

  if (root === undefined) {
    throw new Error('No root');
  }

  const potentialCycle = findCycle(ownershipGraph);
  if (potentialCycle !== undefined) {
    throw new Error(`Cycle: ${potentialCycle.join(' -> ')}`);
  }

  return {
    hasEntityType(entityType): entityType is ET {
      return ownershipGraph.nodes.has(entityType);
    },
    getRootEntityType() {
      return root as any;
    },
    getPrivilegeLevelsOfEntityType<SingleET extends ET>(entityType: SingleET) {
      const entityTypeDefinition = definition[entityType];
      if (!entityTypeDefinition) {
        throw new Error(`Unknown entity type: ${entityType}`);
      }
      return (entityTypeDefinition.privileges ?? []) as PLS[SingleET][];
    },
    getPrivilegeLevelsEqualOrBelow(entityType, privilegeLevel) {
      const entityTypeDefinition = definition[entityType];
      if (!entityTypeDefinition.privileges) {
        throw new Error('Privileges are not defined');
      }
      const index = entityTypeDefinition.privileges.indexOf(privilegeLevel);
      if (index === -1) {
        throw new Error('Privilege level not found');
      }
      return entityTypeDefinition.privileges.slice(index);
    },
    getChainOfOwnership(entityType) {
      return Array.from(breadthFirstSearch(ownershipGraph, entityType));
    },
    entityTypeHasTransitiveOwner<SingleET extends ET>(
      entityType: SingleET,
      potentialOwner: ET,
    ): potentialOwner is OETS[SingleET] {
      for (const owner of breadthFirstSearch(ownershipGraph, entityType)) {
        if (owner === potentialOwner) {
          return true;
        }
      }
      return false;
    },
    *getOwners<SingleET extends ET>(entityType: SingleET) {
      for (const owner of ownershipGraph.edges.get(entityType) ?? []) {
        yield {
          type: owner as ExtractOwnersTypes<EMD[SingleET]>,
          cardinality: cardinalities.get(`${entityType}>${owner}`)!,
        };
      }
    },
    getDefaultAttributes(entityType) {
      const defaultAttributes = defaultAttributesByEntityType.get(entityType);
      if (defaultAttributes === undefined) {
        throw new Error(`Unknown entity type: ${entityType}`);
      }
      return defaultAttributes;
    },
    hasAttributes(entityType) {
      return entityTypesWithAttributes.has(entityType);
    },
  };
}
