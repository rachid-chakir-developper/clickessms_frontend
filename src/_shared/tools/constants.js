export const GOOGLE = {
  MAPS_API_KEY: "AIzaSyACunnNRX8tSlQkdgC6AJRlPL5WhRQxjL0",
};

export const GENDERS = {
  MALE: "MALE",
  FEMALE: "FEMALE",
  NOT_SPECIFIED: "NOT_SPECIFIED",
  ALL: [
    { value: "MALE", label: "Homme" },
    { value: "FEMALE", label: "Femme" },
    { value: "NOT_SPECIFIED", label: "Non spécifié" },
  ],
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

export const NOTIFICATION_PERIOD_UNITS = {
  HOUR: "HOUR",
  DAY: "DAY",
  WEEK: "WEEK",
  MONTH: "MONTH",
  ALL: [
    { value: "HOUR", label: "Heure" },
    { value: "DAY", label: "Jour" },
    { value: "WEEK", label: "Semaine" },
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

export const ENTRY_ABSENCE_TYPES = {
  ABSENCE: "ABSENCE",
  LEAVE: "LEAVE",
  ALL: [
    { value: "ABSENCE", label: "Absence" },
    { value: "LEAVE", label: "Congé" },
  ],
};

export const ABSENCE_STATUS_CHOICES = {
  PENDING: "PENDING",
  TO_JUSTIFY: "TO_JUSTIFY",
  NOT_JUSTIFIED: "NOT_JUSTIFIED",
  JUSTIFIED: "JUSTIFIED",
  APPROVED: "APPROVED",
  REJECTED: "REJECTED",
  ALL: [
    { value: "PENDING", label: "En attente de traitement" },
    { value: "TO_JUSTIFY", label: "À justifier" },
    { value: "NOT_JUSTIFIED", label: "Non justifié" },
    { value: "JUSTIFIED", label: "Justifié" },
    { value: "APPROVED", label: "Approuvé" },
    { value: "REJECTED", label: "Rejeté" },
  ],
};


export const LEAVE_TYPE_CHOICES = {
  PAID: "PAID",
  UNPAID: "UNPAID",
  RWT: "RWT",
  TEMPORARY: "TEMPORARY",
  ANNUAL: "ANNUAL",
  SICK: "SICK",
  MATERNITY: "MATERNITY",
  PATERNITY: "PATERNITY",
  PARENTAL: "PARENTAL",
  BEREAVEMENT: "BEREAVEMENT",
  CHILD_BEREAVEMENT: "CHILD_BEREAVEMENT",
  MARRIAGE: "MARRIAGE",
  STUDY: "STUDY",
  ADOPTION: "ADOPTION",
  SABBATICAL: "SABBATICAL",
  CAREGIVER: "CAREGIVER",
  FAMILY_SOLIDARITY: "FAMILY_SOLIDARITY",
  MOBILITY: "MOBILITY",
  RECONVERSION: "RECONVERSION",
  BUSINESS_CREATION: "BUSINESS_CREATION",
  MANDATE: "MANDATE",
  CHILD_SICKNESS: "CHILD_SICKNESS",
  ABSENCE: "ABSENCE",
  SICK_LEAVE: "SICK_LEAVE",
  WORK_ACCIDENT: "WORK_ACCIDENT",
  PROFESSIONAL_ILLNESS: "PROFESSIONAL_ILLNESS",
  LONG_TERM_LEAVE: "LONG_TERM_LEAVE",
  CHILDCARE_LEAVE: "CHILDCARE_LEAVE",
  FAMILY_REASON: "FAMILY_REASON",
  UNPAID_AUTHORIZED: "UNPAID_AUTHORIZED",
  LATE: "LATE",
  EXCEPTIONAL: "EXCEPTIONAL",
  RELIGIOUS_HOLIDAY: "RELIGIOUS_HOLIDAY",
  TRAINING_INTERRUPTION: "TRAINING_INTERRUPTION",
  CONTRACT_SUSPENSION: "CONTRACT_SUSPENSION",
  ALL: {
    LEAVE : [
      { value: "PAID", label: "Congés payés (CP)" },
      { value: "ANNUAL", label: "Congé Annuel" },
      { value: "UNPAID", label: "Congé Sans Solde" },
      { value: "SICK", label: "Congé Maladie" },
      { value: "MATERNITY", label: "Congé Maternité" },
      { value: "PATERNITY", label: "Congé Paternité" },
      { value: "PARENTAL", label: "Congé Parental d’Éducation" },
      { value: "RWT", label: "Temps de Travail Réduit (RTT)" },
      { value: "TEMPORARY", label: "Congé Trimestriel (CT)" },
      { value: "BEREAVEMENT", label: "Congé de Décès" },
      { value: "CHILD_BEREAVEMENT", label: "Congé pour Deuil d’un Enfant" },
      { value: "MARRIAGE", label: "Congé de Mariage" },
      { value: "ADOPTION", label: "Congé d'Adoption" },
      { value: "STUDY", label: "Congé de Formation" },
      { value: "CAREGIVER", label: "Congé de Proche Aidant" },
      { value: "FAMILY_SOLIDARITY", label: "Congé de Solidarité Familiale" },
      { value: "CHILD_SICKNESS", label: "Congé pour Enfant Malade" },
      { value: "SABBATICAL", label: "Congé Sabbatique" },
      { value: "MOBILITY", label: "Congé de Mobilité" },
      { value: "RECONVERSION", label: "Congé de Reconversion" },
      { value: "BUSINESS_CREATION", label: "Congé pour Création ou Reprise d’Entreprise" },
      { value: "MANDATE", label: "Congé pour Exercice de Mandat" },
    ],
    ABSENCE:[
      { value: "SICK_LEAVE", label: "Arrêt Maladie" },
      { value: "WORK_ACCIDENT", label: "Accident du Travail" },
      { value: "PROFESSIONAL_ILLNESS", label: "Maladie Professionnelle" },
      { value: "LONG_TERM_LEAVE", label: "Arrêt Longue Durée" },
      { value: "CHILDCARE_LEAVE", label: "Garde d’Enfant Malade" },
      { value: "FAMILY_REASON", label: "Absence pour Motif Familial" },
      { value: "EXCEPTIONAL", label: "Absence Exceptionnelle" },
      { value: "UNPAID_AUTHORIZED", label: "Absence Autorisée Sans Solde" },
      { value: "RELIGIOUS_HOLIDAY", label: "Jour Férié Religieux (Non Chômé)" },
      { value: "TRAINING_INTERRUPTION", label: "Interruption de Formation" },
      { value: "CONTRACT_SUSPENSION", label: "Suspension du Contrat (hors maladie)" },
      { value: "LATE", label: "Retard Non Justifié" },
      { value: "ABSENCE", label: "Absence Injustifiée" },
      { value: "OTHER", label: "Autre" },
    ]},
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

export const SCE_ROLE_CHOICES = {
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

export const GOVERNANCE_ROLE_CHOICES = {
  PRESIDENT: "PRESIDENT",
  TREASURER: "TREASURER",
  ASSISTANT_TREASURER: "ASSISTANT_TREASURER",
  SECRETARY: "SECRETARY",
  ASSISTANT_SECRETARY: "ASSISTANT_SECRETARY",
  MEMBER: "MEMBER",
  OTHER: "OTHER",
  ALL: [
    { value: "PRESIDENT", label: "Président / Présidente" },
    { value: "TREASURER", label: "Trésorier / Trésorière" },
    { value: "ASSISTANT_TREASURER", label: "Trésorier Adjoint / Trésorière Adjointe" },
    { value: "SECRETARY", label: "Secrétaire" },
    { value: "ASSISTANT_SECRETARY", label: "Secrétaire Adjoint / Secrétaire Adjointe" },
    { value: "MEMBER", label: "Membre" },
    { value: "OTHER", label: "Autre" },
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

export const INVOICE_TYPES = {
  STANDARD: "STANDARD",
  DEPOSIT: "DEPOSIT",
  ALL: [
      { value: "STANDARD", label: "Facture Standard" },
      { value: "DEPOSIT", label: "Facture d'Acompte" }
  ]
};


export const INVOICE_STATUS = {
  DRAFT: "DRAFT",
  VALIDATED: "VALIDATED", // État Validé
  PARTIALLY_PAID: "PARTIALLY_PAID", // État Semi Réglée
  PAID: "PAID",
  CANCELED: "CANCELED",
  ALL: [
      { value: "DRAFT", label: "Brouillon" },
      { value: "VALIDATED", label: "Validée" },
      { value: "PARTIALLY_PAID", label: "Semi Réglée" },
      { value: "PAID", label: "Réglée" },
      { value: "CANCELED", label: "Annulée" },
  ]
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

export const EXPENSE_REPORT_STATUS_CHOICES = {
  DRAFT: "DRAFT",
  NEW: "NEW",
  PENDING: "PENDING",
  APPROVED: "APPROVED",
  REJECTED: "REJECTED",
  REIMBURSED: "REIMBURSED",
  ALL: [
    { value: "DRAFT", label: "Brouillon" },
    { value: "NEW", label: "Nouveau" },
    { value: "PENDING", label: "En attente" },
    { value: "APPROVED", label: "Approuvé" },
    { value: "REJECTED", label: "Rejeté" },
    { value: "REIMBURSED", label: "Remboursé" },
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

export const BENEFICIARY_ADMISSION_STATUS_CHOICES = {
  DRAFT: "DRAFT",
  // NEW: "NEW",
  PENDING: "PENDING",
  APPROVED: "APPROVED",
  REJECTED: "REJECTED",
  CANCELED: "CANCELED",
  ALL: [
    { value: "DRAFT", label: "Brouillon" },
    // { value: "NEW", label: "Nouveau" },
    { value: "PENDING", label: "En attente" },
    { value: "APPROVED", label: "Approuvé" },
    { value: "REJECTED", label: "Rejeté" },
    { value: "CANCELED", label: "Annulé" },
  ],
};

export const RECURRENCE_FREQUENCIES = {
  DAILY: "DAILY",
  WEEKLY: "WEEKLY",
  MONTHLY: "MONTHLY",
  YEARLY: "YEARLY",
  ALL: [
      { value: "DAILY", label: "Jour" },
      { value: "WEEKLY", label: "Semaine" },
      { value: "MONTHLY", label: "Mois" },
      { value: "YEARLY", label: "Année" }
  ]
};

export const RECURRENCE_OPTIONS = {
  // ONCE: "ONCE",
  // DAILY: "DAILY",
  // WEEKLY: "WEEKLY",
  MONTHLY: "MONTHLY",
  YEARLY: "YEARLY",
  // WEEKDAYS: "WEEKDAYS",
  // CUSTOM: "COSTUM",
  ALL: [
      // { value: "ONCE", label: "Une seule fois" },
      // { value: "RRULE:FREQ=DAILY;WKST=MO", label: "Tous les jours" },
      // { value: "RRULE:FREQ=WEEKLY;WKST=MO", label: "Toutes les semaines" },
      { value: "RRULE:FREQ=MONTHLY;WKST=MO", label: "Tous les mois" },
      { value: "RRULE:FREQ=YEARLY;WKST=MO", label: "Tous les ans" },
      // { value: "RRULE:FREQ=WEEKLY;BYDAY=MO,TU,WE,TH,FR;WKST=MO", label: "Tous les jours de la semaine (du lundi au vendredi)" },
      // { value: "COSTUM", label: "Personnaliser…" }
  ]
};

export const CAREER_ENTRY_TYPES = {
  EDUCATION: "EDUCATION",
  INTERNSHIP: "INTERNSHIP",
  JOB: "JOB",
  TRAINING: "TRAINING",
  VOLUNTEERING: "VOLUNTEERING",
  OTHER: "OTHER",
  ALL: [
    { value: "EDUCATION", label: "Scolarité" },
    { value: "INTERNSHIP", label: "Stage" },
    { value: "JOB", label: "Emploi" },
    { value: "TRAINING", label: "Formation" },
    { value: "VOLUNTEERING", label: "Bénévolat" },
    { value: "OTHER", label: "Autre" }
  ],
  TEXT_HELPERS : {
    EDUCATION: "Ex : Licence en Informatique",
    INTERNSHIP: "Ex : Stage en développement web chez XYZ",
    JOB: "Ex : Développeur Full Stack",
    TRAINING: "Ex : Formation en cybersécurité",
    VOLUNTEERING: "Ex : Bénévole dans une association humanitaire",
    OTHER: "Ex : Expérience particulière à préciser",
  },
  INSTITUTION_LABELS : {
    EDUCATION: "Nom de l'établissement scolaire",
    INTERNSHIP: "Nom de l'entreprise / Organisation de stage",
    JOB: "Nom de l'entreprise",
    TRAINING: "Nom de l'organisme de formation",
    VOLUNTEERING: "Nom de l'association / Organisation",
    OTHER: "Nom de l'entité liée à l'expérience",
  }
};

export const JOB_CANDIDATE_APPLICATION_STATUS = {
  PENDING: "PENDING",
  INTERESTED: "INTERESTED",
  INTERVIEW: "INTERVIEW",
  REJECTED: "REJECTED",
  ACCEPTED: "ACCEPTED",
  ALL: [
    { value: "PENDING", label: "En attente" },
    { value: "INTERESTED", label: "Intéressant"},
    { value: "INTERVIEW", label: "Entretien prévu"},
    { value: "REJECTED", label: "Rejeté"},
    { value: "ACCEPTED", label: "Accepté"},
  ],
};

export const JOB_CANDIDATE_INFORMATION_SHEET_STATUS = {
  PENDING: "PENDING",
  SENT: "SENT",
  REJECTED: "REJECTED",
  ACCEPTED: "ACCEPTED",
  ALL: [
    { value: "PENDING", label: "En attente" },
    { value: "SENT", label: "Envoyé"},
    { value: "REJECTED", label: "Rejeté"},
    { value: "ACCEPTED", label: "Accepté"},
  ],
};

export const WORKFLOW_REQUEST_TYPES = {
  LEAVE: "LEAVE",
  EXPENSE: "EXPENSE",
  TASK: "TASK",
  ALL: [
    { value: "LEAVE", label: "Demande de congé" },
    { value: "EXPENSE", label: "Note de frais" },
    { value: "TASK", label: "Demande d’intervention" },
  ],
};

export const WORKFLOW_VALIDATOR_TYPES = {
  CUSTOM: "CUSTOM",
  ROLE: "ROLE",
  POSITION: "POSITION",
  MANAGER: "MANAGER",
  ALL: [
    { value: "CUSTOM", label: "Sélection personnalisée" },
    { value: "ROLE", label: "Rôle" },
    { value: "POSITION", label: "Poste spécifique" },
    { value: "MANAGER", label: "Manager du demandeur" },
  ],
};

export const WORKFLOW_FALLBACK_TYPES = {
  REPLACEMENT: "REPLACEMENT",
  HIERARCHY: "HIERARCHY",
  ADMIN: "ADMIN",
  ALL: [
    { value: "REPLACEMENT", label: "Remplaçant déclaré" },
    { value: "HIERARCHY", label: "Supérieur hiérarchique" },
    { value: "ADMIN", label: "Notifier l’administrateur" },
  ],
};


