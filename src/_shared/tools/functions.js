import moment from 'moment';
import {
  ACCOUNT_TYPES,
  LEVELS,
  MEASUREMENT_ACTIVITY_UNITS,
  OWNERSHIP_TYPE_CHOICES,
  PRIORITIES,
  REPAIR_STATES,
  STATUS,
  STEP_TYPES,
  TECH_INSPECTION_STATES,
} from './constants';

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

export const getLevelLabel = (level) => {
  return LEVELS.ALL.find((l) => l.value == level)?.label;
};

export const getPriorityLabel = (priority) => {
  return PRIORITIES.ALL.find((p) => p.value == priority)?.label;
};

export const getStepTypeLabel = (stepType) => {
  return STEP_TYPES.ALL.find((t) => t.value == stepType)?.label;
};

export const getFormatDateTime = (dateTime) => {
  try {
    return dateTime ? moment(dateTime).format('DD/MM/YYYY à HH:mm') : '';
  } catch (error) {
    return null;
  }
};

export const getFormatDate = (dateTime) => {
  try {
    return dateTime ? moment(dateTime).format('DD/MM/YYYY') : '';
  } catch (error) {
    return null;
  }
};

export const getFormatTime = (dateTime) => {
  try {
    return dateTime ? moment(dateTime).format('HH:mm') : '';
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


export const getOwnershipTypeLabel = (type) => {
  return OWNERSHIP_TYPE_CHOICES.ALL.find((t) => t.value == type)?.label;
};
export const getTechnicalInspectionLabel = (state) => {
  return TECH_INSPECTION_STATES.ALL.find((t) => t.value == state)?.label;
};
export const getRepairStateLabel = (state) => {
  return REPAIR_STATES.ALL.find((t) => t.value == state)?.label;
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

// export const getMarkerIcon = (type) => {
//   switch (type) {
//     case 'task':
//       return require('../../assets/img/work_map_marker.png');
//     case 'employee':
//       return require('../../assets/img/work_map_marker.png');
//     // Ajoutez d'autres cas pour les types supplémentaires
//     default:
//       return require('../../assets/img/work_map_marker.png');
//   }
// };
