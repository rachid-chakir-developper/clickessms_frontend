import { entitiesModel } from './entitiesModel';
import { defineRolesModel } from './lib/rolesModelEngine';

export const rolesModel = defineRolesModel(entitiesModel, {
  company: {
    SUPER_ADMIN: { // Super admin'
      settings: 'edit',
      activity: 'edit',
      establishment: 'edit',
      task: 'edit',
      bankAccount: 'edit',
      vehicle: 'view',
      vehicleInspection: 'edit',
    },
    ADMIN: { // Admin
      settings: 'edit',
      activity: 'edit',
      establishment: 'edit',
      task: 'edit',
      bankAccount: 'edit',
      vehicle: 'view',
      vehicleInspection: 'edit',
    },
    MANAGER: { // Responsable strcuture,
      activity: 'edit',
      establishment: 'edit',
      task: 'edit',
      bankAccount: 'edit',
    },
    QUALITY_MANAGER: { // Responsable Qualité,
    },
    ACTIVITY_MANAGER: { // Responsable Activité,
      activity: 'edit',
    },
    ADMINISTRATIVE_MANAGER: { // Responsable Administratif,
      settings: 'edit',
      establishment: 'edit',
    },
    HR_MANAGER: { // Responsable RH,
    },
    FACILITY_MANAGER: { //Responsable Services Généraux
      task: 'edit',
      vehicle: 'view',
      vehicleInspection: 'edit',
    },
    FINANCE_MANAGER: {
      bankAccount: 'edit' // Responsable Finance,
    },
    EMPLOYEE: { // Employé,
    },
    MECHANIC: { //Garagiste
      vehicle: 'view',
      vehicleInspection: 'edit',
    },
  },
});