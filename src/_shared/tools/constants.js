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
  NEW : "NEW",
  ACCEPTED : "ACCEPTED",
  REFUSED : "REFUSED",
  IN_PROGRESS : "IN_PROGRESS",
  COMPLETED : "COMPLETED",
  ON_HOLD : "ON_HOLD",
  CANCELED : "CANCELED",
  ARCHIVED : "ARCHIVED",
  ALL: [
    { value: "NEW", label: "Nouveau"},
    { value: "ACCEPTED", label: "Accepté"},
    { value: "REFUSED", label: "Refusé"},
    { value: "IN_PROGRESS", label: "En cours"},
    { value: "COMPLETED", label: "Terminée"},
    { value: "ON_HOLD", label: "En attente"},
    { value: "CANCELED", label: "Annulée"},
    { value: "ARCHIVED", label: "Archivée"}
  ],
};

export const TASK_STATUS = {
  NEW : "NEW",
  PENDING: 'PENDING',
  APPROVED: 'APPROVED',
  REJECTED: 'REJECTED',
  TO_DO : "TO_DO",
  IN_PROGRESS : "IN_PROGRESS",
  COMPLETED : "COMPLETED",
  CANCELED : "CANCELED",
  ARCHIVED : "ARCHIVED",
  ALL: [
    { value: "NEW", label: "Nouveau"},
    { value: 'PENDING', label: 'En attente' },
    { value: 'APPROVED', label: 'Approuvé' },
    { value: 'REJECTED', label: 'Rejeté' },
    { value: "TO_DO", label: "À faire"},
    { value: "IN_PROGRESS", label: "En cours"},
    { value: "COMPLETED", label: "Terminée"},
    { value: "CANCELED", label: "Annulée"},
    { value: "ARCHIVED", label: "Archivée"}
  ],
};

export const ACTION_STATUS = {
  TO_DO : "TO_DO",
  IN_PROGRESS : "IN_PROGRESS",
  DONE : "DONE",
  ALL: [
    { value: "TO_DO", label: "À traiter"},
    { value: "IN_PROGRESS", label: "En cours"},
    { value: "DONE", label: "Traité"},
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
export const CALL_TYPES = {
  INCOMING: 'INCOMING',
  OUTGOING: 'OUTGOING',
  ALL: [
    { value: 'INCOMING', label: 'Entrant' },
    { value: 'OUTGOING', label: 'Sortant' },
  ],
};
export const LETTER_TYPES = {
  INCOMING: 'INCOMING',
  OUTGOING: 'OUTGOING',
  ALL: [
    { value: 'INCOMING', label: 'Entrant' },
    { value: 'OUTGOING', label: 'Sortant' },
  ],
};
export const CONTRACT_TYPES = {
  CDI: 'CDI',
  CDD: 'CDD',
  ALL: [
    { value: 'CDI', label: 'CDI' },
    { value: 'CDD', label: 'CDD' },
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

export const ABSENCE_TYPES = {
  ABSENCE: 'ABSENCE',
  LEAVE: 'LEAVE',
  ALL: [
    { value: 'ABSENCE', label: 'Absence' },
    { value: 'LEAVE', label: 'Congé' },
  ],
};

export const ABSENCE_STATUS_CHOICES = {
  PENDING: 'PENDING',
  APPROVED: 'APPROVED',
  REJECTED: 'REJECTED',
  ALL: [
    { value: 'PENDING', label: 'En attente' },
    { value: 'APPROVED', label: 'Approuvé' },
    { value: 'REJECTED', label: 'Rejeté' },
  ],
};

export const LEAVE_TYPE_CHOICES = {
  PAID: 'PAID',
  UNPAID: 'UNPAID',
  RWT: 'RWT',
  TEMPORARY: 'TEMPORARY',
  // ANNUAL: 'ANNUAL',
  // SICK: 'SICK',
  // MATERNITY: 'MATERNITY',
  // PATERNITY: 'PATERNITY',
  // PARENTAL: 'PARENTAL',
  // BEREAVEMENT: 'BEREAVEMENT',
  // MARRIAGE: 'MARRIAGE',
  // STUDY: 'STUDY',
  // ADOPTION: 'ADOPTION',
  ABSENCE: 'ABSENCE',
  ALL: [
    { value: 'PAID', label: 'Congés payés (CP)' },
    { value: 'UNPAID', label: 'Congé Sans Solde' },
    { value: 'RWT', label: 'Temps de Travail Réduit (RTT)' },
    { value: 'TEMPORARY', label: 'Congé Temporaire (CT)' },
    // { value: 'ANNUAL', label: 'Congé Annuel' },
    // { value: 'SICK', label: 'Congé Maladie' },
    // { value: 'MATERNITY', label: 'Congé Maternité' },
    // { value: 'PATERNITY', label: 'Congé Paternité' },
    // { value: 'PARENTAL', label: 'Congé Parental' },
    // { value: 'BEREAVEMENT', label: 'Congé de Décès' },
    // { value: 'MARRIAGE', label: 'Congé de Mariage' },
    // { value: 'STUDY', label: 'Congé de Formation' },
    // { value: 'ADOPTION', label: "Congé d'Adoption"},
    { value: 'ABSENCE', label: 'Absence' },
  ],
};

export const MSG_NOTIF_TYPES = {
  SYSTEM: 'SYSTEM',
  REMINDER: 'REMINDER',
  MESSAGE: 'MESSAGE',
  TASK: 'TASK',
  EVENT: 'EVENT',
  NEWS: 'NEWS',
  WARNING: 'WARNING',
  PROMOTION: 'PROMOTION',
  UPDATE: 'UPDATE',
  FEEDBACK: 'FEEDBACK',
  ERROR: 'ERROR',
  ALL: [
    { value: 'SYSTEM', label: 'Système' },
    { value: 'REMINDER', label: 'Rappel' },
    { value: 'MESSAGE', label: 'Message' },
    { value: 'TASK', label: 'Tâche' },
    { value: 'EVENT', label: 'Événement' },
    { value: 'NEWS', label: 'Actualités' },
    { value: 'WARNING', label: 'Avertissement' },
    { value: 'PROMOTION', label: 'Promotion' },
    { value: 'UPDATE', label: 'Mise à jour' },
    { value: 'FEEDBACK', label: 'Commentaires' },
    { value: 'ERROR', label: 'Erreur' },
  ],
};
