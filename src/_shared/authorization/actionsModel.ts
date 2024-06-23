import { entitiesModel } from './entitiesModel';
import { defineActionsModel } from './lib/actionsModelEngine';

export const actionsModel = defineActionsModel(
  entitiesModel,
  ({ params, id, privilege }) => {
    return {
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
