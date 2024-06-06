export const GOOGLE = {
  MAPS_API_KEY: 'AIzaSyACunnNRX8tSlQkdgC6AJRlPL5WhRQxjL0',
};

export const STEP_TYPES = {
  BEFORE: 'BEFORE',
  IN_PROGRESS: 'IN_PROGRESS',
  AFTER: 'AFTER',
  ALL: [
    { value: 'BEFORE', label: 'Avant' },
    { value: 'IN_PROGRESS', label: 'Pendant' },
    { value: 'AFTER', label: 'Après' },
  ],
};
export const LEVELS = {
  EASY: 'EASY',
  MEDIUM: 'MEDIUM',
  HARD: 'HARD',
  ALL: [
    { value: 'EASY', label: 'Facile' },
    { value: 'MEDIUM', label: 'Moyen' },
    { value: 'HARD', label: 'Difficile' },
  ],
};

export const PRIORITIES = {
  LOW: 'LOW',
  MEDIUM: 'MEDIUM',
  HIGH: 'HIGH',
  ALL: [
    { value: 'LOW', label: 'Faible' },
    { value: 'MEDIUM', label: 'Moyenne' },
    { value: 'HIGH', label: 'Haute' },
  ],
};
export const STATUS = {
  NEW: 'NEW',
  STARTED: 'STARTED',
  PENDING: 'PENDING',
  FINISHED: 'FINISHED',
  ALL: [
    { value: 'NEW', label: 'À faire' },
    { value: 'STARTED', label: 'En cours' },
    { value: 'PENDING', label: 'En attente' },
    { value: 'FINISHED', label: 'Terminée' },
  ],
};

export const UNDESIRABLE_EVENT_TYPES = {
  NORMAL: 'NORMAL',
  SERIOUS: 'SERIOUS',
  ALL: [
    { value: 'NORMAL', label: 'EVENEMENT INDESIRABLE (EI)' },
    { value: 'SERIOUS', label: 'EVENEMENT INDESIRABLE GRAVE (EIG)' },
  ],
};

export const UNDESIRABLE_EVENT_SEVERITY = {
  LOW: 'LOW',
  MEDIUM: 'MEDIUM',
  SEVERE: 'SEVERE',
  VERY_SERIOUS: 'VERY_SERIOUS',
  ALL: [
    { value: 'LOW', label: 'Faible' },
    { value: 'MEDIUM', label: 'Moyenne' },
    { value: 'SEVERE', label: 'Grave' },
    { value: 'VERY_SERIOUS', label: 'Très grave' },
  ],
};

export const ACCOUNT_TYPES = {
  CURRENT: 'CURRENT',
  SAVINGS: 'SAVINGS',
  FIXED_TERM: 'FIXED_TERM',
  ALL: [
    { value: 'CURRENT', label: 'Courant' },
    { value: 'SAVINGS', label: 'Placement' },
    { value: 'FIXED_TERM', label: 'Compte à terme' },
  ],
};

export const MEASUREMENT_ACTIVITY_UNITS = {
  DAY: 'DAY',
  HOUR: 'HOUR',
  MONTH: 'MONTH',
  ALL: [
    { value: 'DAY', label: 'Jour' },
    { value: 'HOUR', label: 'Heure' },
    { value: 'MONTH', label: 'Mois' },
  ],
};

export const VEHICLE_STATES = {
  NEW: 'NEW',
  GOOD: 'GOOD',
  BAD: 'BAD',
  ALL: [
    { value: 'NEW', label: 'Neuf' },
    { value: 'GOOD', label: 'Correct' },
    { value: 'BAD', label: 'Mauvais' },
  ],
};

export const CRIT_AIR_CHOICES = {
  ZERO: 'ZERO',
  ONE: 'ONE',
  TWO: 'TWO',
  THREE: 'THREE',
  FOUR: 'FOUR',
  FIVE: 'FIVE',
  ALL: [
    { value: 'ZERO', label: '0' },
    { value: 'ONE', label: '1' },
    { value: 'TWO', label: '2' },
    { value: 'THREE', label: '3' },
    { value: 'FOUR', label: '4' },
    { value: 'FIVE', label: '5' },
  ],
};


export const OWNERSHIP_TYPE_CHOICES = {
  LEASE: 'LEASE',
  PURCHASE: 'PURCHASE',
  SALE: 'SALE',
  ALL: [
    { value: 'LEASE', label: 'Location' },
    { value: 'PURCHASE', label: 'Achat' },
    { value: 'SALE', label: 'Vente' },
  ],
};


export const TECH_INSPECTION_STATES = {
  FAVORABLE: 'FAVORABLE',
  NOT_FAVORABLE: 'NOT_FAVORABLE',
  ALL: [
    { value: 'FAVORABLE', label: 'Favorable' },
    { value: 'NOT_FAVORABLE', label: 'Non favorable' },
  ],
};

export const INSPECTION_FAILURE_TYPES = {
  MINOR: 'MINOR',
  MAJOR: 'MAJOR',
  CRITICAL: 'CRITICAL',
  ALL: [
    { value: 'MINOR', label: 'Défaillance critique' },
    { value: 'MAJOR', label: 'Défaillance majeur' },
    { value: 'CRITICAL', label: 'Défaillance mineur' },
  ],
};

export const REPAIR_STATES = {
  COMPLETED: 'COMPLETED',
  TO_DO: 'TO_DO',
  ALL: [
    { value: 'COMPLETED', label: 'Términée' },
    { value: 'TO_DO', label: 'À faire' },
  ],
};