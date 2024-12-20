export const GOOGLE = {
  MAPS_API_KEY: "AIzaSyACunnNRX8tSlQkdgC6AJRlPL5WhRQxjL0",
};

export const STEP_TYPES = {
  BEFORE: "BEFORE",
  IN_PROGRESS: "IN_PROGRESS",
  AFTER: "AFTER",
  ALL: [
    { value: "BEFORE", label: "Avant" },
    { value: "IN_PROGRESS", label: "Pendant" },
    { value: "AFTER", label: "Après" },
  ],
};
export const LEVELS = {
  EASY: "EASY",
  MEDIUM: "MEDIUM",
  HARD: "HARD",
  ALL: [
    { value: "EASY", label: "Facile" },
    { value: "MEDIUM", label: "Moyen" },
    { value: "HARD", label: "Difficile" },
  ],
};

export const PRIORITIES = {
  LOW: "LOW",
  MEDIUM: "MEDIUM",
  HIGH: "HIGH",
  ALL: [
    { value: "LOW", label: "Faible" },
    { value: "MEDIUM", label: "Moyenne" },
    { value: "HIGH", label: "Haute" },
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
  PENDING: "PENDING",
  APPROVED: "APPROVED",
  REJECTED: "REJECTED",
  TO_DO : "TO_DO",
  IN_PROGRESS : "IN_PROGRESS",
  COMPLETED : "COMPLETED",
  CANCELED : "CANCELED",
  ARCHIVED : "ARCHIVED",
  ALL: [
    { value: "NEW", label: "Nouveau"},
    { value: "PENDING", label: "En attente" },
    { value: "APPROVED", label: "Approuvé" },
    { value: "REJECTED", label: "Rejeté" },
    { value: "TO_DO", label: "À faire"},
    { value: "IN_PROGRESS", label: "En cours"},
    { value: "COMPLETED", label: "Terminée"},
    { value: "CANCELED", label: "Annulée"},
    { value: "ARCHIVED", label: "Archivée"}
  ],
};


export const EI_STATUS = {
  DRAFT : "DRAFT",
  NEW : "NEW",
  IN_PROGRESS : "IN_PROGRESS",
  DONE : "DONE",
  ALL: [
    { value: "DRAFT", label: "Brouillon"},
    { value: "NEW", label: "Déclaré"},
    { value: "IN_PROGRESS", label: "En cours de traitement"},
    { value: "DONE", label: "Traité"},
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
  NORMAL: "NORMAL",
  SERIOUS: "SERIOUS",
  ALL: [
    { value: "NORMAL", label: "EVENEMENT INDESIRABLE (EI)", miniLabel: "EI" },
    { value: "SERIOUS", label: "EVENEMENT INDESIRABLE GRAVE (EIG)", miniLabel: "EIG" },
  ],
};

export const UNDESIRABLE_EVENT_SEVERITY = {
  LOW: "LOW",
  MEDIUM: "MEDIUM",
  SEVERE: "SEVERE",
  VERY_SERIOUS: "VERY_SERIOUS",
  ALL: [
    { value: "LOW", label: "Faible" },
    { value: "MEDIUM", label: "Moyenne" },
    { value: "SEVERE", label: "Grave" },
    { value: "VERY_SERIOUS", label: "Très grave" },
  ],
};

export const ACCOUNT_TYPES = {
  CURRENT: "CURRENT",
  SAVINGS: "SAVINGS",
  FIXED_TERM: "FIXED_TERM",
  ALL: [
    { value: "CURRENT", label: "Courant" },
    { value: "SAVINGS", label: "Placement" },
    { value: "FIXED_TERM", label: "Compte à terme" },
  ],
};
export const CALL_TYPES = {
  INCOMING: "INCOMING",
  OUTGOING: "OUTGOING",
  ALL: [
    { value: "INCOMING", label: "Entrant" },
    { value: "OUTGOING", label: "Sortant" },
  ],
};
export const LETTER_TYPES = {
  INCOMING: "INCOMING",
  OUTGOING: "OUTGOING",
  ALL: [
    { value: "INCOMING", label: "Entrant" },
    { value: "OUTGOING", label: "Sortant" },
  ],
};
export const CONTRACT_TYPES = {
  CDI: "CDI",
  CDD: "CDD",
  APPRENTICESHIP_CONTRACT: "APPRENTICESHIP_CONTRACT",
  SINGLE_INTEGRATION_CONTRACT: "SINGLE_INTEGRATION_CONTRACT",
  PROFESSIONALIZATION_CONTRACT: "PROFESSIONALIZATION_CONTRACT",
  SEASONAL_CONTRACT: "SEASONAL_CONTRACT",
  TEMPORARY_CONTRACT: "TEMPORARY_CONTRACT",
  PART_TIME_CONTRACT: "PART_TIME_CONTRACT",
  FULL_TIME_CONTRACT: "FULL_TIME_CONTRACT",
  INTERNSHIP_CONTRACT: "INTERNSHIP_CONTRACT",
  ALL: [
    { value: "CDI", label: "CDI" },
    { value: "CDD", label: "CDD" },
    { value: "APPRENTICESHIP_CONTRACT", label: "Contrat d'apprentissage" },
    { value: "SINGLE_INTEGRATION_CONTRACT", label: "Contrat Unique d'Insertion (CUI)" },
    { value: "PROFESSIONALIZATION_CONTRACT", label: "Contrat de professionnalisation" },
    { value: "SEASONAL_CONTRACT", label: "Contrat saisonnier" },
    { value: "TEMPORARY_CONTRACT", label: "Contrat intérimaire" },
    { value: "PART_TIME_CONTRACT", label: "Contrat à temps partiel" },
    { value: "FULL_TIME_CONTRACT", label: "Contrat à temps plein" },
    { value: "INTERNSHIP_CONTRACT", label: "Contrat de stage" },
  ],
};

export const MEASUREMENT_ACTIVITY_UNITS = {
  DAY: "DAY",
  HOUR: "HOUR",
  MONTH: "MONTH",
  ALL: [
    { value: "DAY", label: "Jour" },
    { value: "HOUR", label: "Heure" },
    { value: "MONTH", label: "Mois" },
  ],
};

export const VEHICLE_STATES = {
  GOOD: "GOOD",
  TO_REVIEW: "TO_REVIEW",
  IN_REPAIR: "IN_REPAIR",
  OUT_OF_SERVICE: "OUT_OF_SERVICE",
  ALL: [
    { value: "GOOD", label: "En bon état" },
    { value: "TO_REVIEW", label: "À réviser" },
    { value: "IN_REPAIR", label: "En réparation" },
    { value: "OUT_OF_SERVICE", label: "Hors service" },
  ],
};


export const CRIT_AIR_CHOICES = {
  ZERO: "ZERO",
  ONE: "ONE",
  TWO: "TWO",
  THREE: "THREE",
  FOUR: "FOUR",
  FIVE: "FIVE",
  ALL: [
    { value: "ZERO", label: "0" },
    { value: "ONE", label: "1" },
    { value: "TWO", label: "2" },
    { value: "THREE", label: "3" },
    { value: "FOUR", label: "4" },
    { value: "FIVE", label: "5" },
  ],
};


export const OWNERSHIP_TYPE_CHOICES = {
  LEASE: "LEASE",
  LEASE_PURCHASE_OPTION: "LEASE_PURCHASE_OPTION",
  PURCHASE: "PURCHASE",
  LOAN: "LOAN",
  SALE: "SALE",
  ALL: [
    { value: "LEASE", label: "Location Longue Durée" },
    { value: "LEASE_PURCHASE_OPTION", label: "Location avec option d'achat" },
    { value: "PURCHASE", label: "Achat" },
    { value: "LOAN", label: "Prêt" },
    { value: "SALE", label: "Vendu" },
  ],
};


export const TECH_INSPECTION_STATES = {
  FAVORABLE: "FAVORABLE",
  NOT_FAVORABLE: "NOT_FAVORABLE",
  ALL: [
    { value: "FAVORABLE", label: "Favorable" },
    { value: "NOT_FAVORABLE", label: "Non favorable" },
  ],
};

export const INSPECTION_FAILURE_TYPES = {
  MINOR: "MINOR",
  MAJOR: "MAJOR",
  CRITICAL: "CRITICAL",
  ALL: [
    { value: "MINOR", label: "Défaillance critique" },
    { value: "MAJOR", label: "Défaillance majeur" },
    { value: "CRITICAL", label: "Défaillance mineur" },
  ],
};

export const REPAIR_STATES = {
  COMPLETED: "COMPLETED",
  TO_DO: "TO_DO",
  ALL: [
    { value: "COMPLETED", label: "Terminée" },
    { value: "TO_DO", label: "À faire" },
  ],
};

export const ABSENCE_TYPES = {
  ABSENCE: "ABSENCE",
  LEAVE: "LEAVE",
  ALL: [
    { value: "ABSENCE", label: "Absence" },
    { value: "LEAVE", label: "Congé" },
  ],
};

export const ABSENCE_STATUS_CHOICES = {
  PENDING: "PENDING",
  APPROVED: "APPROVED",
  REJECTED: "REJECTED",
  ALL: [
    { value: "PENDING", label: "En attente" },
    { value: "APPROVED", label: "Approuvé" },
    { value: "REJECTED", label: "Rejeté" },
  ],
};

export const LEAVE_TYPE_CHOICES = {
  PAID: "PAID",
  UNPAID: "UNPAID",
  RWT: "RWT",
  TEMPORARY: "TEMPORARY",
  // ANNUAL: "ANNUAL",
  // SICK: "SICK",
  // MATERNITY: "MATERNITY",
  // PATERNITY: "PATERNITY",
  // PARENTAL: "PARENTAL",
  // BEREAVEMENT: "BEREAVEMENT",
  // MARRIAGE: "MARRIAGE",
  // STUDY: "STUDY",
  // ADOPTION: "ADOPTION",
  ABSENCE: "ABSENCE",
  ALL: [
    { value: "PAID", label: "Congés payés (CP)" },
    { value: "UNPAID", label: "Congé Sans Solde" },
    { value: "RWT", label: "Temps de Travail Réduit (RTT)" },
    { value: "TEMPORARY", label: "Congé Temporaire (CT)" },
    // { value: "ANNUAL", label: "Congé Annuel" },
    // { value: "SICK", label: "Congé Maladie" },
    // { value: "MATERNITY", label: "Congé Maternité" },
    // { value: "PATERNITY", label: "Congé Paternité" },
    // { value: "PARENTAL", label: "Congé Parental" },
    // { value: "BEREAVEMENT", label: "Congé de Décès" },
    // { value: "MARRIAGE", label: "Congé de Mariage" },
    // { value: "STUDY", label: "Congé de Formation" },
    // { value: "ADOPTION", label: "Congé d"Adoption"},
    { value: "ABSENCE", label: "Absence" },
  ],
};

export const MSG_NOTIF_TYPES = {
  SYSTEM: "SYSTEM",
  REMINDER: "REMINDER",
  MESSAGE: "MESSAGE",
  TASK: "TASK",
  SCE: "SCE",
  EVENT: "EVENT",
  NEWS: "NEWS",
  WARNING: "WARNING",
  PROMOTION: "PROMOTION",
  UPDATE: "UPDATE",
  FEEDBACK: "FEEDBACK",
  ERROR: "ERROR",
  ALL: [
    { value: "SYSTEM", label: "Système" },
    { value: "REMINDER", label: "Rappel" },
    { value: "MESSAGE", label: "Message" },
    { value: "SCE", label: "Cse" },
    { value: "EVENT", label: "Événement" },
    { value: "NEWS", label: "Actualités" },
    { value: "WARNING", label: "Avertissement" },
    { value: "PROMOTION", label: "Promotion" },
    { value: "UPDATE", label: "Mise à jour" },
    { value: "FEEDBACK", label: "Commentaires" },
    { value: "ERROR", label: "Erreur" },
  ],
};

export const FEEDBACK_MODULES = {
  APP: "APP",
  DASHBOARD: "DASHBOARD",
  QUALITY: "QUALITY",
  ACTIVITY: "ACTIVITY",
  HR: "HR",
  ADMINISTRATIF: "ADMINISTRATIF",
  FACILITY: "FACILITY",
  FINANCE: "FINANCE",
  IT: "IT",
  PURCHASE: "PURCHASE",
  GOVERNANCE: "GOVERNANCE",
  CSE: "CSE",
  LEGAL: "LEGAL",
  RESOURCES: "RESOURCES",
  USERS: "USERS",
  SETTINGS: "SETTINGS",
  ALL: [
    { value: "APP", label: "Application" },
    { value: "DASHBOARD", label: "Tableau de bord" },
    { value: "QUALITY", label: "Qualité" },
    { value: "ACTIVITY", label: "Activité" },
    { value: "HR", label: "Ressources Humaines" },
    { value: "ADMINISTRATIF", label: "Administratif" },
    { value: "FACILITY", label: "Services Généraux" },
    { value: "FINANCE", label: "Finance" },
    { value: "IT", label: "Informatique" },
    { value: "PURCHASE", label: "Achat" },
    { value: "GOVERNANCE", label: "Gouvernance" },
    { value: "CSE", label: "CSE" },
    { value: "LEGAL", label: "Juridiques" },
    { value: "RESOURCES", label: "Ressources" },
    { value: "USERS", label: "Utilisateurs" },
    { value: "SETTINGS", label: "Paramètres" }
  ]
};

export const CSE_ROLE_CHOICES = {
  PRESIDENT: "PRESIDENT",
  TREASURER: "TREASURER",
  ASSISTANT_TREASURER: "ASSISTANT_TREASURER",
  SECRETARY: "SECRETARY",
  ASSISTANT_SECRETARY: "ASSISTANT_SECRETARY",
  MEMBER: "MEMBER",
  SUBSTITUTE: "SUBSTITUTE",
  PRIMARY_MEMBER: "PRIMARY_MEMBER",
  ALL: [
    { value: "PRESIDENT", label: "Président / Présidente" },
    { value: "TREASURER", label: "Trésorier / Trésorière" },
    { value: "ASSISTANT_TREASURER", label: "Trésorier Adjoint / Trésorière Adjointe" },
    { value: "SECRETARY", label: "Secrétaire" },
    { value: "ASSISTANT_SECRETARY", label: "Secrétaire Adjoint / Secrétaire Adjointe" },
    { value: "MEMBER", label: "Membre" },
    { value: "SUBSTITUTE", label: "Suppléant / Suppléante" },
    { value: "PRIMARY_MEMBER", label: "Titulaire" },
  ],
};

export const FIELD_TYPE_CHOICES = {
  TEXT: "TEXT",
  TEXTAREA: "TEXTAREA",
  NUMBER: "NUMBER",
  DATE: "DATE",
  DATETIME: "DATETIME",
  BOOLEAN: "BOOLEAN",
  SELECT: "SELECT",
  SELECT_MULTIPLE: "SELECT_MULTIPLE",
  ALL: [
    { value: "TEXT", label: "Text" },
    { value: "TEXTAREA", label: "Zone du text" },
    { value: "NUMBER", label: "Number" },
    { value: "DATE", label: "Date" },
    { value: "DATETIME", label: "Date et heure" },
    { value: "BOOLEAN", label: "Boolean" },
    { value: "SELECT", label: "Liste" },
    { value: "SELECT_MULTIPLE", label: "Liste à choix multiple" },
    // Add more field types if necessary
  ],
};


export const BUDGET_STATUS_CHOICES = {
  DRAFT: "DRAFT",
  PENDING: "PENDING",
  APPROVED: "APPROVED",
  REJECTED: "REJECTED",
  IN_PROGRESS: "IN_PROGRESS",
  PARTIALLY_USED: "PARTIALLY_USED",
  COMPLETED: "COMPLETED",
  OVERSPENT: "OVERSPENT",
  ON_HOLD: "ON_HOLD",
  CANCELLED: "CANCELLED",
  CLOSED: "CLOSED",
  ALL: [
    { value: "DRAFT", label: "Brouillon" },
    { value: "PENDING", label: "En attente de validation" },
    { value: "APPROVED", label: "Validé" },
    { value: "REJECTED", label: "Rejeté" },
    { value: "IN_PROGRESS", label: "En cours" },
    { value: "PARTIALLY_USED", label: "Partiellement utilisé" },
    { value: "COMPLETED", label: "Complété" },
    { value: "OVERSPENT", label: "Dépassement" },
    { value: "ON_HOLD", label: "En attente" },
    { value: "CANCELLED", label: "Annulé" },
    { value: "CLOSED", label: "Clôturé" },
  ],
};

export const EXPENSE_STATUS_CHOICES = {
  DRAFT: "DRAFT",
  NEW: "NEW",
  PENDING: "PENDING",
  APPROVED: "APPROVED",
  REJECTED: "REJECTED",
  PAID: "PAID",
  UNPAID: "UNPAID",
  ALL: [
    { value: "DRAFT", label: "Brouillon" },
    { value: "NEW", label: "Nouveau" },
    { value: "PENDING", label: "En attente" },
    { value: "APPROVED", label: "Approuvé" },
    { value: "REJECTED", label: "Rejeté" },
    { value: "PAID", label: "Payé" },
    { value: "UNPAID", label: "Non payé" },
  ],
};



export const EXPENSE_ITEM_STATUS_CHOICES = {
  PENDING: "PENDING",
  APPROVED: "APPROVED",
  REJECTED: "REJECTED",
  PAID: "PAID",
  UNPAID: "UNPAID",
  ALL: [
    { value: "PENDING", label: "En attente" },
    { value: "APPROVED", label: "Approuvé" },
    { value: "REJECTED", label: "Rejeté" },
    { value: "PAID", label: "Payé" },
    { value: "UNPAID", label: "Non payé" },
  ],
};

export const PAYMENT_METHOD = {
  CREDIT_CARD: "CREDIT_CARD",
  CHECK: "CHECK",
  CASH: "CASH",
  PURCHASE_ORDER: "PURCHASE_ORDER",
  BANK_TRANSFER: "BANK_TRANSFER",
  DIRECT_DEBIT: "DIRECT_DEBIT",  // Prélèvement
  // BILL_OF_EXCHANGE: "BILL_OF_EXCHANGE",  // Lettre de change relevé
  // LIBEO_TRANSFER: "LIBEO_TRANSFER",  // Virement par Libeo
  // PAYPAL: "PAYPAL",
  // MOBILE_PAYMENT: "MOBILE_PAYMENT",
  // CRYPTOCURRENCY: "CRYPTOCURRENCY",
  // DEBIT_CARD: "DEBIT_CARD",
  // APPLE_PAY: "APPLE_PAY",
  // GOOGLE_PAY: "GOOGLE_PAY",
  ALL: [
      { value: "CREDIT_CARD", label: "Carte de crédit" },
      { value: "CHECK", label: "Chèque" },
      { value: "CASH", label: "Espèces" },
      { value: "PURCHASE_ORDER", label: "Bon de commande" },  // Prélèvement
      { value: "BANK_TRANSFER", label: "Virement bancaire" },
      { value: "DIRECT_DEBIT", label: "Prélèvement" },  // Prélèvement
      // { value: "BILL_OF_EXCHANGE", label: "Lettre de change relevé" },  // Lettre de change relevé
      // { value: "LIBEO_TRANSFER", label: "Virement par Libeo" },  // Virement par Libeo
      // { value: "PAYPAL", label: "PayPal" },
      // { value: "MOBILE_PAYMENT", label: "Paiement mobile" },
      // { value: "CRYPTOCURRENCY", label: "Cryptomonnaie" },
      // { value: "DEBIT_CARD", label: "Carte de débit" },
      // { value: "APPLE_PAY", label: "Apple Pay" },
      // { value: "GOOGLE_PAY", label: "Google Pay" },
  ]
};

export const EXPENSE_TYPE_CHOICES = {
  PURCHASE: "PURCHASE",
  INVESTMENT: "INVESTMENT",
  ALL: [
    { value: "PURCHASE", label: "Achat" },
    { value: "INVESTMENT", label: "Investissement" },
  ],
};

export const TRANSACTION_TYPE_CHOICES = {
  CREDIT: "CREDIT",
  DEBIT: "DEBIT",
  ALL: [
      {value: "CREDIT", label: "Encaissement", },
      {value: "DEBIT", label: "Décaissement"},
  ],
}

export const PURCHASE_ORDER_STATUS_CHOICES = {
  PENDING: "PENDING",
  APPROVED: "APPROVED",
  REJECTED: "REJECTED",
  PAID: "PAID",
  UNPAID: "UNPAID",
  ALL: [
    { value: "PENDING", label: "En attente" },
    { value: "APPROVED", label: "Approuvé" },
    { value: "REJECTED", label: "Rejeté" },
    { value: "PAID", label: "Payé" },
    { value: "UNPAID", label: "Non payé" },
  ],
};

export const TICKET_TYPE_CHOICES = {
  PLAN_ACTION: "PLAN_ACTION",
  LUP: "LUP",
  IT_SUPPORT: "IT_SUPPORT",
  GENERAL: "GENERAL",
  ALL: [
    { value: "PLAN_ACTION", label: "Plan d'action" },
    { value: "LUP", label: "Levée d'une non-conformité" },
    { value: "IT_SUPPORT", label: "Support informatique" },
    { value: "GENERAL", label: "Général" },
  ],
};

export const ROOM_TYPE_CHOICES = {
  MEETING: "MEETING",
  CONFERENCE: "CONFERENCE",
  LOUNGE: "LOUNGE",
  TRAINING: "TRAINING",
  PHONE: "PHONE",
  OFFICE: "OFFICE",
  STUDIO: "STUDIO",
  OTHER: "OTHER",
  ALL: [
    { value: "MEETING", label: "Salle de réunion" },
    { value: "CONFERENCE", label: "Salle de conférence" },
    { value: "LOUNGE", label: "Salle de pause" },
    { value: "TRAINING", label: "Salle de formation" },
    { value: "PHONE", label: "Cabine téléphonique" },
    { value: "OFFICE", label: "Bureau privé" },
    { value: "STUDIO", label: "Studio" },
    { value: "OTHER", label: "Autre" },
  ],
};
