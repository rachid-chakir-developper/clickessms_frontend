import { entitiesModel } from './entitiesModel';
import { defineRolesModel } from './lib/rolesModelEngine';

export const rolesModel = defineRolesModel(entitiesModel, {
  company: {
    mechanic: {
      vehicle: 'view',
      vehicleInspection: 'edit',
    },
    admin: {
      vehicle: 'view',
      vehicleInspection: 'edit',
    },
  },
});
