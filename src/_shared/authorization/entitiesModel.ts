import { defineEntitiesModel } from './lib/entitiesModelEngine';

export const entitiesModel = defineEntitiesModel({
  company: {
    root: true,
  },
  companies: {
    ownedBy: 'company',
    privileges: ['edit', 'view'],
  },
  accountingNatures: {
    ownedBy: 'company',
    privileges: ['edit', 'view'],
  },
  settings: {
    ownedBy: 'company',
    privileges: ['edit', 'view'],
  },
  sce: {
    ownedBy: 'company',
    privileges: ['edit', 'view'],
  },
  sceModules: {
    ownedBy: 'company',
    privileges: ['edit', 'view'],
  },
  quality: {
    ownedBy: 'company',
    privileges: ['edit', 'view'],
  },
  activity: {
    ownedBy: 'company',
    privileges: ['edit', 'view'],
  },
  beneficiary: {
    ownedBy: 'company',
    privileges: ['edit', 'view'],
  },
  administrative: {
    ownedBy: 'company',
    privileges: ['edit', 'view'],
  },
  humanRessources: {
    ownedBy: 'company',
    privileges: ['edit', 'view'],
  },
  finance: {
    ownedBy: 'company',
    privileges: ['edit', 'view'],
  },
  facility: {
    ownedBy: 'company',
    privileges: ['edit', 'view'],
  },
  parking: {
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
