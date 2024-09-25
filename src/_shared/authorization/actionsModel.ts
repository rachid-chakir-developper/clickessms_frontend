import { entitiesModel } from './entitiesModel';
import { defineActionsModel } from './lib/actionsModelEngine';

export const actionsModel = defineActionsModel(
  entitiesModel,
  ({ params, id, privilege }) => {
    return {
      manageSettings: privilege('settings:edit'),
      manageSce: privilege('sce:edit'),
      manageSceModules: privilege('sceModules:edit'),
      manageQuality: privilege('quality:edit'),
      manageActivity: privilege('activity:edit'),
      manageAdministrative: privilege('administrative:edit'),
      manageHumanRessources: privilege('humanRessources:edit'),
      manageFinance: privilege('finance:edit'),
      manageFacility: privilege('facility:edit'),
      manageParking: privilege('parking:edit'),
      getEstablishments: privilege('establishment:edit'),
      getTasks: privilege('task:edit'),
      getBankAccounts: privilege('bankAccount:edit'),
      getVehicle: params({
        vehicleId: id('vehicle').privilege('vehicle:view'),
      }),
      getVehicles: privilege('vehicle:view'),
      getVehicleInspection: params({
        vehicleInspectionId: id('vehicleInspection').privilege(
          'vehicleInspection:view',
        ),
      }),
      getVehicleInspections: privilege('vehicleInspection:view'),
      createVehicleInspection: params({
        vehicleId: id('vehicle').privilege('vehicleInspection:edit'),
      }),
      editVehicleInspection: params({
        vehicleInspectionId: id('vehicleInspection').privilege(
          'vehicleInspection:edit',
        ),
      }),
      deleteVehicleInspection: params({
        vehicleInspectionId: id('vehicleInspection').privilege(
          'vehicleInspection:edit',
        ),
      }),
    };
  },
);
