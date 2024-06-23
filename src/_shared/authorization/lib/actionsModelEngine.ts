import type {
  EntitiesModel,
  ExtractEntityTypes,
  ExtractRootEntityType,
  ParameterDefinitionPrivilegeOptions,
  Privilege,
  PrivilegeResolver,
} from './entitiesModelEngine';
import type {
  EntityChainRepository,
  RolesRepository,
} from './repositoriesInterfaces';
import type { TaggedId } from './taggedId';

// TODO: Switch to relying on code generation instead of type inference
// because this whole mess is unmaintainable.

// # Core types
// The types in this section are the core types that define the actions model.

/**
 * The actions model specifies the actions that can be performed by the users
 * and the privileges required to perform them.
 *
 * It presents as a record of action types to action definitions.
 */
export type ActionsModel<EM extends EntitiesModel> = {
  [actionType in string]: ActionDefinition<EM>;
};

/**
 * An action is defined by its type, which is specified as a key in the actions
 * model, and its parameters. There are two ways of defining parameters:
 * - As a union of literal objects. Each branch of the union can have arbitrary
 * keys. Almost all action types will be defined this way, and almost all of
 * them will have a single branch. At the moment, the values must be numerical
 * IDs of known entity types, but this could be extended in the future to
 * support arbitrary primitive types, if the need arises.
 * - As a flag to mark the absence of parameters. In this case, a privilege
 * level must be provided anyway. This is most useful for organization-level
 * actions.
 */
export type ActionDefinition<EM extends EntitiesModel> =
  // TODO: Consider whether branches should be named (not sure it's a good
  // idea, but it could). This is because otherwise TypeScript will happily
  // let the caller provide multiple branches at the same time.
  // Also, this would let us have branches with the same keys.
  // For DX, it would be most convenient to have a default unnamed branch.
  // We can posit that the parameter-less branch must be the default one.
  {
    params: ParametersBranchDefinition<EM>[];
    overrides: (OverrideFn<EM> | undefined)[];
  };

export type OverrideFn<EM extends EntitiesModel> = (
  dependencies: OverrideFnDependencies<EM>,
  parameters: any,
) => boolean;

export interface OverrideFnDependencies<EM extends EntitiesModel> {
  entityChainRepository: EntityChainRepository<EM>;
  rolesRepository: RolesRepository<EM>;
  doesEntityGrantPrivilege(
    taggedId: TaggedId<ExtractEntityTypes<EM>>,
    privilege: Privilege<EM>,
  ): boolean;
}

export type ExtractActionTypes<AM extends ActionsModel<any>> = keyof AM;

/**
 * A branch is a union of literal objects that each define its parameters.
 * In order to be able to operate on the type, the definition of a branch is
 * represented as a tuple instead of a union.
 */
export type ParametersBranchDefinition<EM extends EntitiesModel> = {
  [paramKey in string]: ParameterDefinition<EM, ExtractEntityTypes<EM>>;
};

export type ParameterScope<ET extends string> = {
  type: ET;
  id?: number | string;
};

/**
 * Parameter controls define the privilege required to perform an action with
 * a parameter and the scope of the entities to be considered when computing
 * the authorization.
 * The action is authorized if and only if, for each parameter, the user can
 * obtain at least the returned privilege by walking up the chain of ownership
 * starting with the entity whose ID is provided
 * The scope constrains the entity types from which roles are obtained when
 * computing an authorization. Only the roles on entities whose type match the
 * scope or their transitive owners are to be taken into account.
 */
export type ParameterControls<EM extends EntitiesModel> = {
  privilege: Privilege<EM>;
  scope: ExtractEntityTypes<EM>;
};

export type ParameterControlsResolver<EM extends EntitiesModel> = (
  // Attributes here are not type-safe because type variance causes issues with
  // type inference. Fortunately, we don't really need type-safety here. The
  // types are so generic that TypeScript is not able to check that things are
  // wired up correctly anyway.
  attributes: unknown,
) => ParameterControls<EM>;

/**
 * A parameter definition specifies the type of the parameter, the required
 * privilege to perform the action when providing a value for that parameter
 * and some other properties that control how authorization is performed.
 */
export interface ParameterDefinition<
  EM extends EntitiesModel,
  ET extends ExtractEntityTypes<EM>,
> {
  // TODO: Support arbitrary primitive types too (strings, numbers, booleans).
  // Even maybe composite types (arrays, objects).
  /**
   * The parameter is an ID of an entity of this type.
   */
  entityType: ET;
  /**
   * Returns the parameters controls computed from the attributes of the
   * entity whose ID is provided as parameter of the action. May be omitted
   * if attributes are not useful to compute the controls.
   */
  getParameterControls?: ParameterControlsResolver<EM>;
  /**
   * When an authorization is requested, the parameter may not always be
   * provided, so there are no attributes to pass to `getParameterControls`
   * In this case, the default controls are used.
   */
  defaultParameterControls: ParameterControls<EM>;
}

export type IntentParameterValue<EM extends EntitiesModel> =
  | undefined
  | number
  | string
  | {
      value?: number | string;
      scope?: ExtractEntityTypes<EM> | ParameterScope<ExtractEntityTypes<EM>>;
    };

/**
 * An intent is an incomplete representation of an operation that a user intends
 * to perform in the application or through the API.
 * An intent composed of an action type, and may or may not be composed
 * of parameters, which may or may not be scoped.
 */
export type Intent<
  EM extends EntitiesModel,
  AM extends ActionsModel<EM>,
  AT extends ActionType<AM>,
> = {
  type: AT;
  parameters?: IntentParameters<EM, AM, AT>;
};

type IntentParameters<
  EM extends EntitiesModel,
  AM extends ActionsModel<EM>,
  AT extends ActionType<AM>,
> = AM[AT] extends {
  params: infer PBDS; // ParametersBranchDefinition[]
} // When the action has parameters defined as a union of literal objects
  ? PBDS extends unknown[] // Need to check for this to be able to iterate over the tuple
    ?
        | {
            [index in keyof PBDS]: {
              // Keys are parameter keys
              [key in Exclude<
                keyof PBDS[index],
                typeof $override
              >]?: IntentParameterValue<EM>;
            };
          }[number]
        | undefined
    : never
  : never;

// # Builder types
// The types in this section are used to define the actions model. An action
// model could be defined using only the core types but it would be verbose and
// error-prone. Builder types are terser and easier to use.
// (There are much less comments in this section because changes are more
// likely to occur here and the patterns are repetitive.)

/**
 * Helper functions passed to the function to define the action model.
 */
interface DefineHelpers<EM extends EntitiesModel> {
  /**
   * Declares an action without parameters.
   */
  privilege(privilege: Privilege<EM>): NoParametersBuilder<EM>;
  /**
   * Declares a parameter whose value must be an ID of the provided entity.
   */
  id<ET extends ExtractEntityTypes<EM>>(
    entityType: ET,
  ): ParameterDefinitionBuilder<EM, ET>;

  /**
   * Declares parameters for the action type as unions of literal objects.
   * Each argument of this method is a branch of the union.
   */
  params<PBBS extends ParametersBranchBuilder<EM>[]>(
    ...branches: PBBS
  ): { params: PBBS };
}

type NoParametersBuilder<EM extends EntitiesModel> = {
  params: [
    {
      [rootEntityType in ExtractRootEntityType<EM> as `${rootEntityType}Id`]: ParameterDefinitionBuilder<
        EM,
        rootEntityType
      >;
    },
  ];
  overrides: [];
};

type ActionDefinitionToBuild<EM extends EntitiesModel> = {
  params: ParametersBranchBuilder<EM>[];
};

export type ActionsModelToBuild<EM extends EntitiesModel> = {
  [actionsType in string]: ActionDefinitionToBuild<EM>;
};

type ParametersBranchBuilder<EM extends EntitiesModel> = Record<
  string,
  ParameterDefinitionBuilder<EM, ExtractEntityTypes<EM>>
> & { [$override]?: OverrideFn<EM> };

export type ActionType<AM extends ActionsModel<EntitiesModel>> = keyof AM;

// TODO: Refine builder so that methods must be called in a specific sequence
interface ParameterDefinitionBuilder<
  EM extends EntitiesModel,
  ET extends ExtractEntityTypes<EM>,
> {
  /**
   * Sets a custom privilege for the parameter.
   * (By default, it is the privilege required by the action type.)
   */
  privilege(
    privilege: Privilege<EM>,
    options?: ParameterDefinitionPrivilegeOptions<EM, ExtractEntityTypes<EM>>,
  ): ParameterDefinitionBuilder<EM, ET>;
  privilege(
    privilegeAndOptions: PrivilegeResolver<EM, ET>,
  ): ParameterDefinitionBuilder<EM, ET>;
}

export type BuildActionsModel<
  EM extends EntitiesModel,
  AMTB extends ActionsModelToBuild<EM>,
> = {
  [actionType in keyof AMTB]: BuildActionDefinition<EM, AMTB[actionType]>;
};

type BuildActionDefinition<
  EM extends EntitiesModel,
  ADTB extends ActionDefinitionToBuild<EM>,
> =
  ADTB extends ActionDefinitionToBuild<EM>
    ? ADTB extends {
        params: infer PBBS;
      }
      ? PBBS extends unknown[]
        ? {
            params: {
              [index in keyof PBBS]: {
                [key in keyof PBBS[index]]: PBBS[index][key] extends ParameterDefinitionBuilder<
                  EM,
                  infer ET
                >
                  ? ParameterDefinition<EM, ET>
                  : never;
              };
            };
            overrides: (OverrideFn<EM> | undefined)[];
          }
        : never
      : never
    : never;

export type DefineFn<
  EM extends EntitiesModel,
  AMTB extends ActionsModelToBuild<EM>,
> = (defineContext: DefineHelpers<EM>) => AMTB;

export function defineActionsModel<
  EM extends EntitiesModel,
  AMTB extends ActionsModelToBuild<EM>,
>(
  entitiesModel: EM,
  defineFn: DefineFn<EM, AMTB>,
): BuildActionsModel<EM, AMTB> {
  type RET = ExtractRootEntityType<EM>;

  const rootEntityType = entitiesModel.getRootEntityType();

  const defineContext: DefineHelpers<EM> = {
    privilege(providedPrivilege) {
      const defaultParameterControls = {
        privilege: providedPrivilege,
        scope: rootEntityType,
      };
      const definition: ParameterDefinition<EM, RET> = {
        entityType: rootEntityType,
        defaultParameterControls,
        getParameterControls: undefined,
      };

      const builder: ParameterDefinitionBuilder<EM, RET> & {
        _definition: ParameterDefinition<EM, RET>;
      } = {
        privilege() {
          throw new Error('privilege() cannot be called on root entity');
        },
        _definition: definition,
      };

      return {
        params: [
          {
            [`${rootEntityType}Id`]: builder as ParameterDefinitionBuilder<
              EM,
              RET
            >,
          },
        ],
        overrides: [],
      };
    },
    params(...branches) {
      const overrides: any[] = [];
      for (const branch of branches) {
        overrides.push(branch[$override]);
      }
      return { params: branches, overrides };
    },
    id<ET extends ExtractEntityTypes<EM>>(entityType: ET) {
      const definition: ParameterDefinition<EM, ET> = {
        entityType: entityType,
        getParameterControls: undefined,
        // TODO: Type-check stuff below
        defaultParameterControls: undefined as any,
      };

      const defaultAttributes = entitiesModel.getDefaultAttributes(entityType);

      const builder: ParameterDefinitionBuilder<EM, ET> & {
        _definition: ParameterDefinition<EM, ET>;
      } = {
        privilege(privilegeOrResolver, maybeOptions = undefined) {
          if (typeof privilegeOrResolver === 'function') {
            const resolver = privilegeOrResolver;
            function getParameterControls(attributes: any) {
              const output = resolver(attributes);
              if (typeof output === 'string') {
                return { privilege: output, scope: entityType };
              }
              const [privilege, options] = output;
              return { privilege, scope: options?.scope ?? entityType };
            }
            definition.getParameterControls = getParameterControls;
            definition.defaultParameterControls =
              getParameterControls(defaultAttributes);
          } else {
            const options: ParameterDefinitionPrivilegeOptions<
              EM,
              ExtractEntityTypes<EM>
            > = maybeOptions ?? {};

            const defaultParameterControls = {
              privilege: privilegeOrResolver,
              scope: options.scope ?? entityType,
            };

            definition.defaultParameterControls = defaultParameterControls;
          }
          return builder;
        },
        _definition: definition,
      };
      return builder as ParameterDefinitionBuilder<EM, ET>;
    },
  };
  const actionsModelToBuild = defineFn(defineContext);

  const actionsModel: ActionsModel<EM> = {};
  for (const [actionType, actionDefinitionToBuild] of Object.entries(
    actionsModelToBuild,
  )) {
    const params: any[] = [];
    const overrides: any[] = [];
    for (const branchToBuild of actionDefinitionToBuild.params) {
      const branch = Object.fromEntries(
        Object.entries(branchToBuild).map(
          ([key, paramBuilder]: [string, any]) => {
            return [key, paramBuilder._definition];
          },
        ),
      );
      params.push(branch);
      overrides.push(branchToBuild[$override]);
    }
    actionsModel[actionType] = { params, overrides };
  }

  return actionsModel as BuildActionsModel<EM, AMTB>;
}

type MergeActionsModels<AMS extends unknown[]> = AMS extends [
  infer AM,
  ...infer Rest,
]
  ? AM & MergeActionsModels<Rest>
  : unknown;

export function mergeActionsModels<AMS extends ActionsModel<EntitiesModel>[]>(
  ...actionsModels: AMS
): MergeActionsModels<AMS> {
  return Object.assign({}, ...actionsModels);
}

export const $override: unique symbol = Symbol('override');
