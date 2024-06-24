import { entitiesModel } from './entitiesModel';
import { defineRolesModel } from './lib/rolesModelEngine';

export const rolesModel = defineRolesModel(entitiesModel, {
  company: {
    garagist: {
      vehicle: 'view',
      vehicleInspection: 'edit',
    },
    admin: {
      vehicle: 'view',
      vehicleInspection: 'edit',
    },
  },
});
