import { defineEntitiesModel } from './lib/entitiesModelEngine';

export const entitiesModel = defineEntitiesModel({
  company: {
    root: true,
  },
  vehicle: {
    ownedBy: 'company',
    privileges: ['view'],
  },
  vehicleInspection: {
    ownedBy: 'vehicle',
    privileges: ['edit', 'view'],
  },
});
