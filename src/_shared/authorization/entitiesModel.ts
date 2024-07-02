import { defineEntitiesModel } from './lib/entitiesModelEngine';

export const entitiesModel = defineEntitiesModel({
  company: {
    root: true,
  },
  settings: {
    ownedBy: 'company',
    privileges: ['edit', 'view'],
  },
  activity: {
    ownedBy: 'company',
    privileges: ['edit', 'view'],
  },
  establishment: {
    ownedBy: 'company',
    privileges: ['edit', 'view'],
  },
  task: {
    ownedBy: 'company',
    privileges: ['edit', 'view'],
  },
  bankAccount: {
    ownedBy: 'company',
    privileges: ['edit', 'view'],
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
