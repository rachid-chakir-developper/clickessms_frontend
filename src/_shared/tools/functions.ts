import moment from 'moment';
import {
  GENDERS,
  ACCOUNT_TYPES,
  TASK_STATUS,
  ACTION_STATUS,
  CRIT_AIR_CHOICES,
  LEVELS,
  MEASUREMENT_ACTIVITY_UNITS,
  NOTIFICATION_PERIOD_UNITS,
  OWNERSHIP_TYPE_CHOICES,
  PRIORITIES,
  REPAIR_STATES,
  STATUS,
  STEP_TYPES,
  TECH_INSPECTION_STATES,
  VEHICLE_STATES,
  ABSENCE_TYPES,
  ABSENCE_STATUS_CHOICES,
  LEAVE_TYPE_CHOICES,
  CALL_TYPES,
  LETTER_TYPES,
  CONTRACT_TYPES,
  MSG_NOTIF_TYPES,
  FEEDBACK_MODULES,
  CSE_ROLE_CHOICES,
  UNDESIRABLE_EVENT_TYPES,
  UNDESIRABLE_EVENT_SEVERITY,
  FIELD_TYPE_CHOICES,
  BUDGET_STATUS_CHOICES,
  EXPENSE_STATUS_CHOICES,
  EXPENSE_ITEM_STATUS_CHOICES,
  PAYMENT_METHOD,
  INVOICE_TYPES,
  INVOICE_STATUS,
  EXPENSE_TYPE_CHOICES,
  TRANSACTION_TYPE_CHOICES,
  PURCHASE_ORDER_STATUS_CHOICES,
  TICKET_TYPE_CHOICES,
  ROOM_TYPE_CHOICES,
  BENEFICIARY_ADMISSION_STATUS_CHOICES,
  RECURRENCE_OPTIONS,
  CAREER_ENTRY_TYPES,
} from './constants';

export const getGenderLabel = (gender) => {
  return GENDERS.ALL.find((g) => g.value === gender)?.label || "Non spécifié";
};


export const getStatusColor = (status) => {
  switch (status) {
    case STATUS.FINISHED:
      return 'green';
    case STATUS.STARTED:
      return 'orange';
    case STATUS.PENDING:
      return 'red';
    default:
      return 'gray';
  }
};

export const getStatusLebelColor = (status) => {
  switch (status) {
    case STATUS.FINISHED:
      return 'primary';
    case STATUS.STARTED:
      return 'warning';
    case STATUS.PENDING:
      return 'info';
    default:
      return 'default';
  }
};

// 'default',
//     'primary',
//     'secondary',
//     'info',
//     'success',
//     'warning',
//     'error',

export const getStatusLabel = (status) => {
  return STATUS.ALL.find((s) => s.value == status)?.label;
};

export const getTaskStatusLabel = (status) => {
  return TASK_STATUS.ALL.find((s) => s.value == status)?.label;
};

export const getActionStatusLabel = (status) => {
  return ACTION_STATUS.ALL.find((s) => s.value == status)?.label;
};

export const getLevelLabel = (level) => {
  return LEVELS.ALL.find((l) => l.value == level)?.label;
};

export const getPriorityLabel = (priority) => {
  return PRIORITIES.ALL.find((p) => p.value == priority)?.label;
};

export const getStepTypeLabel = (stepType) => {
  return STEP_TYPES.ALL.find((t) => t.value == stepType)?.label;
};

export const getFormatDateTime = (dateTime, format='DD/MM/YYYY à HH:mm') => {
  try {
    return dateTime ? moment(dateTime).format(format) : '';
  } catch (error) {
    return null;
  }
};

export const getFormatDate = (dateTime, format='DD/MM/YYYY') => {
  try {
    return dateTime ? moment(dateTime).format(format) : '';
  } catch (error) {
    return null;
  }
};

export const getFormatTime = (dateTime, format='HH:mm') => {
  try {
    return dateTime ? moment(dateTime).format(format) : '';
  } catch (error) {
    return null;
  }
};

export const getaccountTypeLabel = (type) => {
  return ACCOUNT_TYPES.ALL.find((t) => t.value == type)?.label;
};

export const getMeasurementActivityUnitLabel = (unit) => {
  return MEASUREMENT_ACTIVITY_UNITS.ALL.find((t) => t.value == unit)?.label;
};
export const getNotificationPeriodUnitLabel = (unit) => {
  return NOTIFICATION_PERIOD_UNITS.ALL.find((t) => t.value == unit)?.label;
};

export const getExpirationStatusDetails = (status) => {
  switch (status) {
    case "EXPIRED":
      return { color: "error", label: "Expiré" };
    case "EXPIRING_SOON":
      return { color: "yellow", label: "Expire prochainement" };
    case "ALMOST_EXPIRED":
      return { color: "warning", label: "Bientôt expiré" };
    case "NOT_YET_EXPIRED":
      return { color: "success", label: "Pas encore expiré" };
    case "NO_EXPIRATION_DATE":
      return { color: "default", label: "Pas de date d'expiration" };
    default:
      return { color: "default", label: "Inconnu" };
  }
};


export const getVehicleStateLabel = (state) => {
  return VEHICLE_STATES.ALL.find((t) => t.value == state)?.label;
};

export const getCritAirVignetteLabel = (crit) => {
  return CRIT_AIR_CHOICES.ALL.find((t) => t.value == crit)?.label;
};

export const getOwnershipTypeLabel = (type) => {
  return OWNERSHIP_TYPE_CHOICES.ALL.find((t) => t.value == type)?.label;
};
export const getTechnicalInspectionLabel = (state) => {
  return TECH_INSPECTION_STATES.ALL.find((t) => t.value == state)?.label;
};
export const getRepairStateLabel = (state) => {
  return REPAIR_STATES.ALL.find((t) => t.value == state)?.label;
};
export const getAbsenceTypeLabel = (type) => {
  return ABSENCE_TYPES.ALL.find((t) => t.value == type)?.label;
};
export const getAbsenceStatusLabel = (status) => {
  return ABSENCE_STATUS_CHOICES.ALL.find((t) => t.value == status)?.label;
};
export const getLeaveTypeLabel = (type) => {
  return LEAVE_TYPE_CHOICES.ALL.find((t) => t.value == type)?.label;
};
export const getCallTypeLabel = (type) => {
  return CALL_TYPES.ALL.find((t) => t.value == type)?.label;
};
export const getLetterTypeLabel = (type) => {
  return LETTER_TYPES.ALL.find((t) => t.value == type)?.label;
};
export const getContractTypeLabel = (type) => {
  return CONTRACT_TYPES.ALL.find((t) => t.value === type)?.label;
};

export const getMessageNotificationTypeLabel = (type) => {
  return MSG_NOTIF_TYPES.ALL.find((t) => t.value == type)?.label;
};
export const getFeedbackModuleLabel = (module) => {
  return FEEDBACK_MODULES.ALL.find((t) => t.value == module)?.label;
};

export const getCSERoleLabel = (role) => {
  return CSE_ROLE_CHOICES.ALL.find((t) => t.value === role)?.label;
};

export const getUndesirableEventTypeLabel = (eventType) => {
  return UNDESIRABLE_EVENT_TYPES.ALL.find((type) => type.value === eventType)?.label;
};
export const getUndesirableEventTypeMiniLabel = (eventType) => {
  return UNDESIRABLE_EVENT_TYPES.ALL.find((type) => type.value === eventType)?.miniLabel;
};

export const getUndesirableEventSeverityLabel = (severity) => {
  return UNDESIRABLE_EVENT_SEVERITY.ALL.find((level) => level.value === severity)?.label;
};

export const getFieldTypeLabel = (fieldType) => {
  return FIELD_TYPE_CHOICES.ALL.find((t) => t.value === fieldType)?.label;
};

export const getBudgetStatusLabel = (status) => {
  return BUDGET_STATUS_CHOICES.ALL.find((s) => s.value === status)?.label;
};

export const getExpenseStatusLabel = (status) => {
  return EXPENSE_STATUS_CHOICES.ALL.find((s) => s.value === status)?.label;
};

export const getExpenseItemStatusLabel = (status) => {
  return EXPENSE_ITEM_STATUS_CHOICES.ALL.find((s) => s.value === status)?.label;
};

export const getInvoiceTypeLabel = (type) => {
  return INVOICE_TYPES.ALL.find((t) => t.value === type)?.label || "Type de facture inconnu";
};

export const getInvoiceTypeColor = (type) => {
  switch (type) {
      case "STANDARD":
          return 'blue'; // Facture Standard
      case "DEPOSIT":
          return 'green'; // Facture d'Acompte
      default:
          return 'gray'; // Type inconnu ou par défaut
  }
};

export const getInvoiceStatusLabel = (status) => {
  return INVOICE_STATUS.ALL.find((s) => s.value === status)?.label || "Statut inconnu";
};

export const getInvoiceStatusColor = (status) => {
  switch (status) {
    case "DRAFT":
      return 'gray'; // Brouillon
    case "VALIDATED":
      return 'blue'; // Validé
    case "PARTIALLY_PAID":
      return 'orange'; // Semi Réglée
    case "PAID":
      return 'green'; // Réglée
    case "CANCELED":
      return 'darkred'; // Annulé
    default:
      return 'gray'; // Statut inconnu ou par défaut
  }
};

export const getPaymentMethodLabel = (method) => {
  return PAYMENT_METHOD.ALL.find((m) => m.value === method)?.label || "Méthode inconnue";
};

export const getExpenseTypeLabel = (method) => {
  return EXPENSE_TYPE_CHOICES.ALL.find((m) => m.value === method)?.label || "Type inconnu";
};

export const getTransactionTypeLabel = (type) => {
  return TRANSACTION_TYPE_CHOICES.ALL.find((t) => t.value === type)?.label || "Mouvement";
};

export const getPurchaseOrderStatusLabel = (status) => {
  return PURCHASE_ORDER_STATUS_CHOICES.ALL.find((s) => s.value === status)?.label;
};

export const getTicketTypeLabel = (ticketType) => {
  return TICKET_TYPE_CHOICES.ALL.find((type) => type.value === ticketType)?.label;
};

export const getRoomTypeLabel = (roomType) => {
  return ROOM_TYPE_CHOICES.ALL.find((type) => type.value === roomType)?.label;
};

export const getBeneficiaryAdmissionStatusLabel = (status) => {
  return BENEFICIARY_ADMISSION_STATUS_CHOICES.ALL.find((s) => s.value === status)?.label;
};
export const getRecurrenceLabel = (recurrence) => {
  return RECURRENCE_OPTIONS.ALL.find((option) => option.value === recurrence)?.label || "Récurrence inconnue";
};

export const getCareerEntryLabel = (careerType) => {
  return CAREER_ENTRY_TYPES.ALL.find((option) => option.value === careerType)?.label || "Type inconnu";
};


const intlNumFmt = new Intl.NumberFormat('fr-FR', {
  style: 'currency',
  currency: 'EUR',
});

export const formatCurrencyAmount = (amount) => {
  if (typeof amount === 'string') {
    amount = Number(amount);
  }
  return intlNumFmt.format(amount);
};

/**
 * Combination for a map and a filter. If the function returns undefined, the
 * result is ignored.
 */
export function filterMap<I, O>(
  array: I[],
  fn: (item: I) => O | undefined,
): O[] {
  const result: O[] = [];
  for (const item of array) {
    const mapped = fn(item);
    if (mapped !== undefined) {
      result.push(mapped);
    }
  }
  return result;
}


export const truncateText = (text, maxLength = 20) => {
  if (typeof text !== 'string') {
    return '';
  }
  return text.length > maxLength ? `${text.substring(0, maxLength)}...` : text;
};

// Fonction pour formater un prix avec séparateur de milliers et 2 décimales
export const formatPrice = (price) => {
  if (price === null || price === undefined) {
    return '0,00';
  }
  
  // Convertir en nombre si c'est une chaîne
  const numPrice = typeof price === 'string' ? parseFloat(price) : price;
  
  // Formater le prix avec séparateur de milliers et 2 décimales
  return numPrice.toLocaleString('fr-FR', {
    minimumFractionDigits: 2,
    maximumFractionDigits: 2
  });
};
