import { entitiesModel } from './entitiesModel';
import { defineRolesModel } from './lib/rolesModelEngine';

export const rolesModel = defineRolesModel(entitiesModel, {
  company: {
    SUPER_ADMIN: { // Super admin'
      companies: 'edit',
      workflows: 'edit',
      accountingNatures: 'edit',
      sce: 'edit',
      sceModules: 'edit',
      governance: 'edit',
      governanceModules: 'edit',
      settings: 'edit',
      quality: 'edit',
      activity: 'edit',
      administrative: 'edit',
      beneficiary: 'edit',
      humanRessources: 'edit',
      finance: 'edit',
      facility: 'edit',
      parking: 'edit',
      establishment: 'edit',
      task: 'edit',
      bankAccount: 'edit',
      vehicle: 'view',
      vehicleInspection: 'edit',
    },
    ADMIN: { // Admin
      sce: 'edit',
      sceModules: 'edit',
      governance: 'edit',
      governanceModules: 'edit',
      settings: 'edit',
      quality: 'edit',
      activity: 'edit',
      administrative: 'edit',
      beneficiary: 'edit',
      humanRessources: 'edit',
      finance: 'edit',
      facility: 'edit',
      parking: 'edit',
      establishment: 'edit',
      task: 'edit',
      bankAccount: 'edit',
      vehicle: 'view',
      vehicleInspection: 'edit',
    },
    MANAGER: { // Responsable strcuture,
      quality: 'edit',
      activity: 'edit',
      administrative: 'edit',
      beneficiary: 'edit',
      humanRessources: 'edit',
      finance: 'edit',
      facility: 'edit',
      parking: 'edit',
      task: 'edit',
      bankAccount: 'edit',
    },
    SCE_MANAGER: { // Responsable strcuture,
      sce: 'edit',
      sceModules: 'edit',
    },
    GOVERNANCE_MANAGER: { // Responsable strcuture,
      governance: 'edit',
      governanceModules: 'edit',
    },
    QUALITY_MANAGER: { // Responsable Qualité,
      quality: 'edit',
    },
    ACTIVITY_MANAGER: { // Responsable Activité,
      activity: 'edit',
      beneficiary: 'edit',
    },
    SUPPORT_WORKER:{ // Accompagnant (Éducateur)
      activity: 'view',
      beneficiary: 'view',
    },
    ADMINISTRATIVE_MANAGER: { // Responsable Administratif,
      settings: 'edit',
      administrative: 'edit',
      beneficiary: 'edit',
      establishment: 'edit',
    },
    HR_MANAGER: { // Responsable RH,
      humanRessources: 'edit',
    },
    FACILITY_MANAGER: { //Responsable Services Généraux
      facility: 'edit',
      parking: 'edit',
      task: 'edit',
      vehicle: 'view',
      vehicleInspection: 'edit',
    },
    FINANCE_MANAGER: {
      finance: 'edit',
      bankAccount: 'edit' // Responsable Finance,
    },
    EMPLOYEE: { // Employé,
    },
    MECHANIC: { //Garagiste
      parking: 'edit',
      vehicle: 'view',
      vehicleInspection: 'edit',
    },
    MEMBER_IN_SCE: { // membre du cse
      sceModules: 'edit',
    },
    MEMBER_IN_GOVERNANCE: { // membre de gouvernance
      governance: 'edit',
      governanceModules: 'edit',
    },
  },
});