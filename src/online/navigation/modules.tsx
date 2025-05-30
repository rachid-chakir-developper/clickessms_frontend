import { ReactElement } from 'react';
import DashboardIcon from '@mui/icons-material/Dashboard';
import ShoppingCartIcon from '@mui/icons-material/ShoppingCart';
import AccountBalanceIcon from '@mui/icons-material/AccountBalance';
import MarkEmailReadIcon from '@mui/icons-material/MarkEmailRead';
import DescriptionIcon from '@mui/icons-material/Description';
import SupportAgentIcon from '@mui/icons-material/SupportAgent';
import AssignmentIcon from '@mui/icons-material/Assignment';
import FormatListNumberedIcon from '@mui/icons-material/FormatListNumbered';
import PostAddIcon from '@mui/icons-material/PostAdd';
import KeyIcon from '@mui/icons-material/Key';
import RequestQuoteIcon from '@mui/icons-material/RequestQuote';
import PointOfSaleIcon from '@mui/icons-material/PointOfSale';
import LocalAtmIcon from '@mui/icons-material/LocalAtm';
import SavingsIcon from '@mui/icons-material/Savings';
import AddchartIcon from '@mui/icons-material/Addchart';
import SdCardAlertIcon from '@mui/icons-material/SdCardAlert';
import QueryStatsIcon from '@mui/icons-material/QueryStats';
import CalculateIcon from '@mui/icons-material/Calculate';
import EmailIcon from '@mui/icons-material/Email';
import LocalPoliceIcon from '@mui/icons-material/LocalPolice';
import CoPresentIcon from '@mui/icons-material/CoPresent';
import FactCheckIcon from '@mui/icons-material/FactCheck';
import PasswordIcon from '@mui/icons-material/Password';
import HowToRegIcon from '@mui/icons-material/HowToReg';
import ContentPasteIcon from '@mui/icons-material/ContentPaste';
import ReduceCapacityIcon from '@mui/icons-material/ReduceCapacity';
import SourceIcon from '@mui/icons-material/Source';
import MenuBookIcon from '@mui/icons-material/MenuBook';
import AutoStoriesIcon from '@mui/icons-material/AutoStories';
import StickyNote2Icon from '@mui/icons-material/StickyNote2';
import LibraryAddCheckIcon from '@mui/icons-material/LibraryAddCheck';
import GavelIcon from '@mui/icons-material/Gavel';
import AirportShuttleIcon from '@mui/icons-material/AirportShuttle';
import HomeWorkIcon from '@mui/icons-material/HomeWork';
import WorkIcon from '@mui/icons-material/Work';
import Diversity1Icon from '@mui/icons-material/Diversity1';
import HandshakeIcon from '@mui/icons-material/Handshake';
import WarehouseIcon from '@mui/icons-material/Warehouse';
import DevicesIcon from '@mui/icons-material/Devices';
import PersonRemoveIcon from '@mui/icons-material/PersonRemove';
import DateRangeIcon from '@mui/icons-material/DateRange';
import CalendarMonthIcon from '@mui/icons-material/CalendarMonth';
import TaskIcon from '@mui/icons-material/Task';
import AccessibleIcon from '@mui/icons-material/Accessible';
import NotificationsActiveIcon from '@mui/icons-material/NotificationsActive';
import MapIcon from '@mui/icons-material/Map';
import ChecklistRtlIcon from '@mui/icons-material/ChecklistRtl';
import GppGoodIcon from '@mui/icons-material/GppGood';
import Diversity3Icon from '@mui/icons-material/Diversity3';
import QuestionAnswerIcon from '@mui/icons-material/QuestionAnswer';
import BatchPredictionIcon from '@mui/icons-material/BatchPrediction';
import WorkspacePremiumIcon from '@mui/icons-material/WorkspacePremium';
import NoteAltIcon from '@mui/icons-material/NoteAlt';
import TroubleshootIcon from '@mui/icons-material/Troubleshoot';
import InventoryIcon from '@mui/icons-material/Inventory';
import CommentIcon from '@mui/icons-material/Comment';
import RecentActorsIcon from '@mui/icons-material/RecentActors';
import ContactsIcon from '@mui/icons-material/Contacts';
import PersonSearchIcon from '@mui/icons-material/PersonSearch';
import AssignmentIndIcon from '@mui/icons-material/AssignmentInd';
import FolderSharedIcon from '@mui/icons-material/FolderShared';
import CreditCardOffIcon from '@mui/icons-material/CreditCardOff';
import CurrencyExchangeIcon from '@mui/icons-material/CurrencyExchange';
import EditNoteIcon from '@mui/icons-material/EditNote';
import ShoppingBasketIcon from '@mui/icons-material/ShoppingBasket';
import LockPersonIcon from '@mui/icons-material/LockPerson';
import MeetingRoomIcon from '@mui/icons-material/MeetingRoom';
import EngineeringIcon from '@mui/icons-material/Engineering';
import NewspaperIcon from '@mui/icons-material/Newspaper';
import TableBarIcon from '@mui/icons-material/TableBar';
// import ImportContactsIcon from '@mui/icons-material/ImportContacts';
import WalletIcon from '@mui/icons-material/Wallet';
import AccountBalanceWalletIcon from '@mui/icons-material/AccountBalanceWallet';
import ArticleIcon from '@mui/icons-material/Article';
import RateReviewIcon from '@mui/icons-material/RateReview';
import GroupsIcon from '@mui/icons-material/Groups';
import GroupIcon from '@mui/icons-material/Group';
import ComputerIcon from '@mui/icons-material/Computer';
import ApartmentIcon from '@mui/icons-material/Apartment';
import MicrosoftIcon from '@mui/icons-material/Microsoft';
import DirectionsCarFilledIcon from '@mui/icons-material/DirectionsCarFilled';
import CarCrashIcon from '@mui/icons-material/CarCrash';
import ConstructionIcon from '@mui/icons-material/Construction';
import GarageIcon from '@mui/icons-material/Garage';
import CarRepairIcon from '@mui/icons-material/CarRepair';
import CreditCardIcon from '@mui/icons-material/CreditCard';
import MoneyIcon from '@mui/icons-material/Money';
import SaveIcon from '@mui/icons-material/Save';
import CampaignIcon from '@mui/icons-material/Campaign';
import StorefrontIcon from '@mui/icons-material/Storefront';
import AutoFixHighIcon from '@mui/icons-material/AutoFixHigh';
import FeedIcon from '@mui/icons-material/Feed';
import { CurrentAuthorizationSystem } from '../../_shared/context/AuthorizationSystemProvider';

export const modules: Module[] = [
  {
    id: 'quality',
    name: 'Qualité',
    icon: <WorkspacePremiumIcon />,
    entries: [
      {
        id: 'undesirable-events',
        name: 'Évènements indésirables',
        path: '/online/qualites/evenements-indesirables',
        icon: <NotificationsActiveIcon />,
      },
      {
        id: 'task-plan',
        name: "Plan d'action",
        path: '/online/qualites/plan-action',
        icon: <MapIcon />,
      },
      {
        id: 'audits',
        name: 'Audits',
        icon: <NoteAltIcon />,
        hidden(authorizationSystem) {
          return !authorizationSystem.requestAuthorization({
            type: 'manageQuality',
          }).authorized;
        },
        pages: [
          {
            id: 'has-evaluation',
            name: 'Évaluation HAS',
            path: '/online/qualities/audits/evaluation-has',
            icon: <ChecklistRtlIcon />,
            disabled: true,
          },
          {
            id: 'gdpr',
            name: 'RGPD',
            path: '/online/qualities/audits/rgpd',
            icon: <GppGoodIcon />,
            disabled: true,
          },
          {
            id: 'cpom',
            name: 'Autodiagnostic CPOM',
            path: '/online/qualities/audits/Autodiagnostic-cpom',
            icon: <AddchartIcon />,
            disabled: true,
          },
        ],
      },
      {
        id: 'risk-management',
        name: 'Gestion des risques',
        path: '/online/audits/gestion-risques',
        icon: <SdCardAlertIcon />,
        disabled: true,
        hidden(authorizationSystem) {
          return !authorizationSystem.requestAuthorization({
            type: 'manageQuality',
          }).authorized;
        },
      },
      {
        id: 'surveys-results',
        name: 'Enquêtes et Résultats',
        path: '/online/audits/enquêtes-résultats',
        icon: <QuestionAnswerIcon />,
        disabled: true,
        hidden(authorizationSystem) {
          return !authorizationSystem.requestAuthorization({
            type: 'manageQuality',
          }).authorized;
        },
      },
      {
        id: 'procedures',
        name: 'Procédures',
        path: '/online/qualites/procedure',
        icon: <LibraryAddCheckIcon />,
        disabled: false,
        hidden(authorizationSystem) {
          return !authorizationSystem.requestAuthorization({
            type: 'manageQuality',
          }).authorized;
        },
      },
      {
        id: 'qvct',
        name: 'QVCT',
        path: '/online/audits/qvct',
        icon: <Diversity1Icon />,
        disabled: true,
        hidden(authorizationSystem) {
          return !authorizationSystem.requestAuthorization({
            type: 'manageQuality',
          }).authorized;
        },
      },
      {
        id: 'idea-box',
        name: 'Boîte à idées',
        path: '/online/qualites/boite-idees',
        icon: <BatchPredictionIcon />,
        hidden(authorizationSystem) {
          return !authorizationSystem.requestAuthorization({
            type: 'manageQuality',
          }).authorized;
        },
      },
    ],
  },
  {
    id: 'activity',
    name: 'Activité',
    icon: <TroubleshootIcon />,
    hidden(authorizationSystem) {
      return !authorizationSystem.requestAuthorization({
        type: 'seeActivity',
      }).authorized;
    },
    entries: [
      {
        id: 'activites-dashboard',
        name: 'Tableau de bord',
        path: '/online/activites/dashboard',
        icon: <DashboardIcon />,
        hidden(authorizationSystem) {
          return !authorizationSystem.requestAuthorization({
            type: 'manageActivity',
          }).authorized;
        },
      },
      {
        id: 'beneficiaries',
        name: 'Personnes accompagnées',
        path: '/online/ressources-humaines/beneficiaires',
        icon: <AssignmentIndIcon />,
        hidden(authorizationSystem) {
          return !authorizationSystem.requestAuthorization({
            type: 'geteneficiaries',
          }).authorized;
        },
      },
      {
        id: 'beneficiary-admissions',
        name: "Demandes d'admissions",
        path: '/online/ressources-humaines/admissions-beneficiaires',
        icon: <AssignmentIndIcon />,
        hidden(authorizationSystem) {
          return !authorizationSystem.requestAuthorization({
            type: 'manageActivity',
          }).authorized;
        },
      },
      {
        id: 'beneficiary-documents',
        name: 'Documents',
        path: '/online/activites/documents-beneficiaires',
        icon: <FolderSharedIcon />,
        hidden(authorizationSystem) {
          return !authorizationSystem.requestAuthorization({
            type: 'geteneficiaries',
          }).authorized;
        },
      },
      {
        id: 'personalized-projects',
        name: 'Projets personnalisés ( PPA)',
        path: '/online/activites/projets-personnalises',
        icon: <RecentActorsIcon />,
        hidden(authorizationSystem) {
          return !authorizationSystem.requestAuthorization({
            type: 'geteneficiaries',
          }).authorized;
        },
      },
      {
        id: 'events-transmissions',
        name: 'Évènements / Transmissions',
        path: '/online/activites/evenements',
        icon: <CommentIcon />,
        hidden(authorizationSystem) {
          return !authorizationSystem.requestAuthorization({
            type: 'geteneficiaries',
          }).authorized;
        },
      },
      {
        id: 'presence-absence',
        name: 'Présences / Absences',
        path: '/online/activites/absences-beneficiaires',
        icon: <CalendarMonthIcon />,
        hidden(authorizationSystem) {
          return !authorizationSystem.requestAuthorization({
            type: 'geteneficiaries',
          }).authorized;
        },
      },
      {
        id: 'beneficiary-expenses',
        name: 'Dépenses',
        path: '/online/activites/depenses',
        icon: <ShoppingBasketIcon />,
        hidden(authorizationSystem) {
          return !authorizationSystem.requestAuthorization({
            type: 'geteneficiaries',
          }).authorized;
        }
      },
      {
        id: 'malette-law-2002-2',
        name: 'Malette loi 2002-2',
        path: '/online/activité/malette-loi-2002-2',
        icon: <LocalPoliceIcon />,
        disabled: true,
        hidden(authorizationSystem) {
          return !authorizationSystem.requestAuthorization({
            type: 'manageActivity',
          }).authorized;
        },
      },
      {
        id: 'prestations',
        name: 'Prestations',
        path: '/online/activité/prestations',
        icon: <TaskIcon />,
        disabled: true,
        hidden(authorizationSystem) {
          return !authorizationSystem.requestAuthorization({
            type: 'manageActivity',
          }).authorized;
        },
      },
      {
        id: 'serafin-ph',
        name: 'Serafin PH',
        path: '/online/activité/Serafin-ph',
        icon: <AccessibleIcon />,
        disabled: true,
        hidden(authorizationSystem) {
          return !authorizationSystem.requestAuthorization({
            type: 'manageActivity',
          }).authorized;
        },
      },
    ],
  },
  {
    id: 'human-resources',
    name: 'Ressources humaines',
    icon: <GroupsIcon />,
    entries: [
      {
        id: 'employees',
        name: 'Salariés',
        path: '/online/ressources-humaines/employes',
        icon: <WalletIcon />,
        hidden(authorizationSystem) {
          return !authorizationSystem.requestAuthorization({
            type: 'getEstablishments',
          }).authorized;
        },
      },
      {
        id: 'contrats',
        name: 'Contrat de travail',
        path: '/online/ressources-humaines/contrats/',
        icon: <ArticleIcon />,
        hidden(authorizationSystem) {
          return !authorizationSystem.requestAuthorization({
            type: 'getEstablishments',
          }).authorized;
        },
      },
      {
        id: 'trainings',
        name: 'Formations',
        path: '/online/ressources-humaines/formations',
        icon: <CoPresentIcon />,
        disabled: true,
      },
      {
        id: 'interviews-reports',
        name: 'CR Entretiens',
        path: '/online/ressources-humaines/cr-entretiens',
        icon: <AssignmentIcon />,
      },
      {
        id: 'absences',
        name: 'Absences',
        path: '/online/planning/absences-employes/',
        icon: <PersonRemoveIcon />,
      },
      {
        id: 'expense-reports',
        name: 'Notes de frais',
        path: '/online/achats/notes-frais',
        icon: <RequestQuoteIcon />,
      },
      {
        id: 'schedule',
        name: 'Planning',
        path: '/online/ressources-humaines/planning',
        icon: <DateRangeIcon />,
        disabled: true,
      },
      {
        id: 'advances',
        name: 'Acomptes',
        path: '/online/ressources-humaines/acomptes',
        icon: <WalletIcon />,
      },
      {
        id: 'bdes',
        name: 'BDES',
        path: '/online/ressources-humaines/bdes',
        icon: <LockPersonIcon />,
        disabled: true,
      },
      {
        id: 'recruitment',
        name: 'Recrutement',
        icon: <WorkIcon />,
        hidden(authorizationSystem) {
          return !authorizationSystem.requestAuthorization({
            type: 'manageHumanRessources',
          }).authorized;
        },
        pages: [
          {
            id: 'job_position',
            name: 'Fiches besoin',
            path: '/online/ressources-humaines/recrutement/fiches-besoin',
            icon: <PersonSearchIcon  />,
          },
          {
            id: 'job_posting',
            name: 'Diffusions',
            path: '/online/ressources-humaines/recrutement/annonces',
            icon: <CampaignIcon   />,
          },
          {
            id: 'candidates-pool',
            name: 'Vivier candidats',
            path: '/online/ressources-humaines/recrutement/vivier-candidats',
            icon: <ContactsIcon />,
          },
          {
            id: 'interviews-candidates',
            name: 'Entretiens',
            path: '/online/ressources-humaines/recrutement/entretiens',
            icon: <AssignmentIcon />,
          },
        ],
      },
      {
        id: 'collective-bargaining-agreement',
        name: 'Convention collective',
        path(session) {
          const {user}= session
          return user?.company?.companyMedia?.collectiveAgreement ? user?.company?.companyMedia?.collectiveAgreement : user?.company?.companyMedia?.collectiveAgreementUrl
        },
        target: '_blank',
        icon: <AutoStoriesIcon />,
      },
      {
        id: 'company-agreement',
        name: "Accord d'entreprise",
        path(session) {
          const {user}= session
          return user?.company?.companyMedia?.companyAgreement ? user?.company?.companyMedia?.companyAgreement : user?.company?.companyMedia?.companyAgreementUrl
        },
        target: '_blank',
        icon: <StickyNote2Icon />,
      },
    ],
  },
  {
    id: 'administrative',
    name: 'Administratif',
    icon: <EditNoteIcon />,
    entries: [
      {
        id: 'structures',
        name: 'Structures',
        path: '/online/associations/structures',
        icon: <ApartmentIcon />,
        hidden(authorizationSystem) {
          return !authorizationSystem.requestAuthorization({
            type: 'getEstablishments',
          }).authorized;
        },
      },
      {
        id: 'beneficiaries',
        name: 'Personnes accompagnées',
        path: '/online/ressources-humaines/beneficiaires',
        icon: <AssignmentIndIcon />,
        hidden(authorizationSystem) {
          return !authorizationSystem.requestAuthorization({
            type: 'manageAdministrative',
          }).authorized;
        },
      },
      {
        id: 'employees',
        name: 'Salariés',
        path: '/online/ressources-humaines/employes',
        icon: <WalletIcon />,
        hidden(authorizationSystem) {
          return !authorizationSystem.requestAuthorization({
            type: 'manageAdministrative',
          }).authorized;
        },
      },
      {
        id: 'financers',
        name: 'Financeur',
        path: '/online/partenariats/financeurs',
        icon: <Diversity3Icon />,
        hidden(authorizationSystem) {
          return !authorizationSystem.requestAuthorization({
            type: 'manageAdministrative',
          }).authorized;
        },
      },
      {
        id: 'partners',
        name: 'Partenaires',
        path: '/online/partenariats/partenaires',
        icon: <HandshakeIcon />,
        hidden(authorizationSystem) {
          return !authorizationSystem.requestAuthorization({
            type: 'manageAdministrative',
          }).authorized;
        },
      },
      {
        id: 'suppliers',
        name: 'Fournisseurs',
        path: '/online/achats/fournisseurs',
        icon: <WarehouseIcon />,
        hidden(authorizationSystem) {
          return !authorizationSystem.requestAuthorization({
            type: 'manageAdministrative',
          }).authorized;
        },
      },
      {
        id: 'calls',
        name: 'Suivi appels',
        path: '/online/administratif/appels',
        icon: <SupportAgentIcon />,
        hidden(authorizationSystem) {
          return !authorizationSystem.requestAuthorization({
            type: 'manageAdministrative',
          }).authorized;
        },
      },
      {
        id: 'mails',
        name: 'Suivi courriers',
        path: '/online/administratif/courriers',
        icon: <MarkEmailReadIcon />,
        hidden(authorizationSystem) {
          return !authorizationSystem.requestAuthorization({
            type: 'manageAdministrative',
          }).authorized;
        },
      },
      {
        id: 'meetings',
        name: 'CR Réunions',
        path: '/online/administratif/reunions',
        icon: <AssignmentIcon />,
      },
      {
        id: 'documents',
        name: 'Documents / Trames',
        path: '/online/administratif/documents-trames',
        icon: <DescriptionIcon />,
      },
      {
        id: 'lup',
        name: 'LUP',
        path: '/online/administratif/lup',
        icon: <FormatListNumberedIcon />,
        disabled: true,
      },
      {
        id: 'meeting-room',
        name: 'Salle de réunion',
        path: '/online/batiment-immobilier/salles',
        icon: <MeetingRoomIcon />,
        disabled: true,
      },
    ],
  },
  {
    id: 'general-services',
    name: 'Services généraux',
    icon: <ConstructionIcon />,
    entries: [
      {
        id: 'intervetions',
        name: 'Interventions',
        path: '/online/travaux/interventions',
        icon: <EngineeringIcon />,
      },
      {
        id: 'car-fleet',
        name: 'Parc automobile',
        icon: <AirportShuttleIcon />,
        pages: [
          {
            id: 'vehicles',
            name: 'Vehicules',
            path: '/online/parc-automobile/vehicules',
            icon: <DirectionsCarFilledIcon />,
          },
          {
            id: 'monthly-checks',
            name: 'Contrôles véhicules',
            path: '/online/parc-automobile/controles-vehicules',
            icon: <CarCrashIcon />,
            hidden(authorizationSystem) {
              return !authorizationSystem.requestAuthorization({
                type: 'manageParking',
              }).authorized;
            }
          },
          {
            id: 'technical-checks',
            name: 'Contrôles techniques',
            path: '/online/parc-automobile/controles-techniques',
            icon: <GarageIcon />,
            hidden(authorizationSystem) {
              return !authorizationSystem.requestAuthorization({
                type: 'manageParking',
              }).authorized;
            }
          },
          {
            id: 'repairs',
            name: 'Suivi des réparations',
            path: '/online/parc-automobile/reparations',
            icon: <CarRepairIcon />,
            hidden(authorizationSystem) {
              return !authorizationSystem.requestAuthorization({
                type: 'manageParking',
              }).authorized;
            }
          },
        ],
      },
      {
        id: 'real-estate',
        name: 'Bâtiment / Immobilier',
        path: '/online/batiment-immobilier/batiment-immobilier',
        icon: <HomeWorkIcon />,
        disabled: true,
      },
      {
        id: 'purchase-orders',
        name: 'Bons de commande',
        path: '/online/achats/bons-commandes',
        icon: <PostAddIcon />,
      },
      {
        id: 'keys',
        name: 'Suivi des clés',
        path: '/online/recuperations/objets',
        icon: <KeyIcon />,
        disabled: true,
      },
    ],
  },
  {
    id: 'finance',
    name: 'Finance',
    icon: <CurrencyExchangeIcon />,
    hidden(authorizationSystem) {
      return !authorizationSystem.requestAuthorization({
        type: 'manageFinance',
      }).authorized;
    },
    entries: [
      {
        id: 'finance-dashboard',
        name: 'Tableaux de bord',
        path: '/online/finance/dashboard',
        icon: <DashboardIcon />,
        disabled: true,
      },
      {
        id: 'billing',
        name: "Facturation de l'activité",
        path: '/online/ventes/factures',
        icon: <RequestQuoteIcon />,
      },
      {
        id: 'endowment',
        name: 'Dotations',
        path: '/online/finance/dotations-paiements',
        icon: <AccountBalanceWalletIcon />,
      },
      {
        id: 'budget',
        name: 'Budget / Réalisé',
        path: '/online/finance/budgets',
        icon: <LocalAtmIcon />,
      },
      {
        id: 'cash-flow',
        name: 'Trésorerie',
        icon: <SavingsIcon />,
        disabled(authorizationSystem) {
          return !authorizationSystem.requestAuthorization({
            type: 'getBankAccounts',
          }).authorized;
        },
        pages: [
          {
            id: 'bank-accounts',
            name: 'Comptes bancaires',
            path: '/online/finance/tresorerie/comptes-bancaires',
            icon: <AccountBalanceIcon />,
          },
          {
            id: 'bank_cards',
            name: 'Cartes bancaires',
            path: '/online/finance/tresorerie/cartes-bancaires',
            icon: <CreditCardIcon />,
          },
          {
            id: 'balances',
            name: 'Soldes',
            path: '/online/finance/tresorerie/soldes',
            icon: <MoneyIcon />,
          },
          {
            id: 'cash-register',
            name: 'Caisse',
            path: '/online/finance/tresorerie/caisses',
            icon: <PointOfSaleIcon />,
          },
        ],
      },
      {
        id: 'financial-diagnostic',
        name: 'Diagnostic financier',
        path: '/online/sales/diagnostic-financier',
        icon: <QueryStatsIcon />,
        disabled: true,
      },
      {
        id: 'accounting',
        name: 'Comptabilité',
        path: '/online/sales/comptabilité',
        icon: <CalculateIcon />,
        disabled: true,
      },
      {
        id: 'assets',
        name: 'Immobilisations',
        path: '/online/sales/immobilisations',
        icon: <CreditCardOffIcon />,
        disabled: true,
      },
      {
        id: 'revision',
        name: 'Révision des comptes',
        path: '/online/sales/révision-comptes',
        icon: <FactCheckIcon />,
        disabled: true,
      },
      {
        id: 'pricing',
        name: 'Tarification',
        path: '/online/finance/decisions',
        icon: <RateReviewIcon />,
        disabled(authorizationSystem) {
          return !authorizationSystem.requestAuthorization({
            type: 'getBankAccounts',
          }).authorized;
        },
      },
    ],
  },

  {
    id: 'information-technology',
    name: 'Informatique',
    icon: <ComputerIcon />,
    hidden(authorizationSystem) {
      return !authorizationSystem.requestAuthorization({
        type: 'manageFinance',
      }).authorized;
    },
    entries: [
      {
        id: 'hardware',
        name: 'Matériels',
        path: '/online/informatique/materiels',
        icon: <DevicesIcon />,
      },
      {
        id: 'software',
        name: 'Logiciel',
        path: '/online/informatique/logiciels',
        icon: <MicrosoftIcon />,
      },
      {
        id: 'tickets',
        name: 'Tickets',
        path: '/online/informatique/tickets',
        icon: <EmailIcon />,
      },
      {
        id: 'backups',
        name: 'Sauvegardes',
        path: '/online/informatique/sauvegardes',
        icon: <SaveIcon />,
      },
      {
        id: 'passwords',
        name: 'Mots de passe',
        path: '/online/informatique/mots-de-passe',
        icon: <PasswordIcon />,
      },
    ],
  },
  {
    id: 'procurement',
    name: 'Achat',
    icon: <ShoppingCartIcon />,
    entries: [
      {
        id: 'purchase-request-investment',
        name: "Demande d'achat / Investissement",
        path: '/online/achats/depenses-engagements',
        icon: <ShoppingBasketIcon />,
      },
      {
        id: 'purchase-orders',
        name: 'Bons de commande',
        path: '/online/achats/bons-commandes',
        icon: <PostAddIcon />,
      },
      {
        id: 'approved-suppliers',
        name: 'Fournisseurs vérifiés',
        path: '/online/achats/fournisseurs',
        icon: <HowToRegIcon />,
        hidden(authorizationSystem) {
          return !authorizationSystem.requestAuthorization({
            type: 'manageFinance',
          }).authorized;
        },
      },
      {
        id: 'contract-template',
        name: 'Base contrat',
        path: '/online/achats/base-contrats',
        icon: <ContentPasteIcon />,
        hidden(authorizationSystem) {
          return !authorizationSystem.requestAuthorization({
            type: 'manageFinance',
          }).authorized;
        },
      },
      {
        id: 'competition',
        name: 'Mise en concurrence',
        path: '/online/achats/mise-en-concurrence',
        icon: <ReduceCapacityIcon />,
        hidden(authorizationSystem) {
          return !authorizationSystem.requestAuthorization({
            type: 'manageFinance',
          }).authorized;
        },
        disabled: true,
      },
    ],
  },
  {
    id: 'governance',
    name: 'Gouvernance',
    icon: <TableBarIcon />,
    entries: [
      {
        id: 'members',
        name: 'Membres',
        path: '/online/gouvernance/membres',
        icon: <GroupIcon />,
      },
      {
        id: 'documents',
        name: 'Documents associatifs',
        path: '/online/gouvernance/documents-trames',
        icon: <DescriptionIcon />,
        hidden(authorizationSystem) {
          return !authorizationSystem.requestAuthorization({
            type: 'manageGovernanceModules',
          }).authorized;
        },
      },
      {
        id: 'minutes',
        name: 'Procès-verbaux',
        path: '/online/gouvernance/reunions',
        icon: <TaskIcon />,
        hidden(authorizationSystem) {
          return !authorizationSystem.requestAuthorization({
            type: 'manageGovernanceModules',
          }).authorized;
        },
      },
    ],
  },
  {
    id: 'cse',
    name: 'CSE',
    icon: <AccountBalanceIcon />,
    entries: [
      {
        id: 'members',
        name: 'Membres',
        path: '/online/cse/membres',
        icon: <GroupIcon />,
      },
      {
        id: 'minutes',
        name: 'Procès-verbaux',
        path: '/online/cse/reunions',
        icon: <TaskIcon />,
        hidden(authorizationSystem) {
          return !authorizationSystem.requestAuthorization({
            type: 'manageSceModules',
          }).authorized;
        },
      },
      {
        id: 'message-notifications',
        name: 'Annonces',
        path: '/online/cse/notifications-messages/',
        icon: <CampaignIcon />,
        hidden(authorizationSystem) {
          return !authorizationSystem.requestAuthorization({
            type: 'manageSceModules',
          }).authorized;
        },
      },
      {
        id: 'shop',
        name: 'Boutique',
        path(session) {
          const {user}= session
          return user?.company?.companyMedia?.sceShopUrl
        },
        target: '_blank',
        icon: <StorefrontIcon />,
      },
      {
        id: 'benefit',
        name: 'Avantages',
        path: '/online/cse/avantages',
        icon: <AutoFixHighIcon />,
      },
      {
        id: 'blog',
        name: 'Blog',
        path: '/online/cse/articles',
        icon: <FeedIcon />,
      },
      {
        id: 'bdes',
        name: 'BDES',
        path: '/online/cse/bdes',
        icon: <RequestQuoteIcon />,
        disabled: true,
      },
    ],
  },
  {
    id: 'legal',
    name: 'Juridique',
    icon: <GavelIcon />,
    entries: [
      {
        id: 'casf',
        name: 'CASF',
        path(session) {
          const {user}= session
          return user?.company?.companyMedia?.safcCode ? user?.company?.companyMedia?.safcCode : user?.company?.companyMedia?.safcCodeUrl
        },
        target: '_blank',
        icon: <SourceIcon />,
      },
      // {
      //   id: 'associations-foundation-code',
      //   name: 'Code des associations et fondations',
      //   path(session) {
      //     const {user}= session
      //     return user?.company?.companyMedia?.associationsFoundationsCode ? user?.company?.companyMedia?.associationsFoundationsCode : user?.company?.companyMedia?.associationsFoundationsCodeUrl
      //   },
      //   target: '_blank',
      //   icon: <ImportContactsIcon />,
      //   disabled: true,
      // },
      {
        id: 'labor-law',
        name: 'Droit du travail',
        path(session) {
          const {user}= session
          return user?.company?.companyMedia?.laborLaw ? user?.company?.companyMedia?.laborLaw : user?.company?.companyMedia?.laborLawUrl
        },
        target: '_blank',
        icon: <MenuBookIcon />,
      },
      {
        id: 'collective-bargaining-agreement',
        name: 'Convention collective',
        path(session) {
          const {user}= session
          return user?.company?.companyMedia?.collectiveAgreement ? user?.company?.companyMedia?.collectiveAgreement : user?.company?.companyMedia?.collectiveAgreementUrl
        },
        target: '_blank',
        icon: <AutoStoriesIcon />,
      },
      {
        id: 'company-agreement',
        name: "Accord d'entreprise",
        path(session) {
          const {user}= session
          return user?.company?.companyMedia?.companyAgreement ? user?.company?.companyMedia?.companyAgreement : user?.company?.companyMedia?.companyAgreementUrl
        },
        target: '_blank',
        icon: <StickyNote2Icon />,
      },
    ],
  },
  {
    id: 'resources',
    name: 'Ressources',
    icon: <InventoryIcon />,
    entries: [
      {
        id: 'blog',
        name: 'Blog',
        path(session) {
          const {user}= session
          return user?.company?.companyMedia?.blogUrl
        },
        target: '_blank',
        icon: <StickyNote2Icon />,
      },
      {
        id: 'le-comptoir-des-essms',
        name: 'Le comptoir des ESSMS',
        path: '/online/ressources/le-comptoir-des-essms',
        icon: <NewspaperIcon />,
        disabled: true,
      },
    ],
  },
];

export interface Module {
  id: string;
  name: string;
  icon: ReactElement;
  target?: string;
  entries: (Submodule | Page)[];
  disabled?:
    | boolean
    | ((authorizationSystem: CurrentAuthorizationSystem) => boolean);
  hidden?:
    | boolean
    | ((authorizationSystem: CurrentAuthorizationSystem) => boolean);
}

export interface Submodule {
  id: string;
  name: string;
  icon: ReactElement;
  target?: string;
  pages: Page[];
  disabled?:
    | boolean
    | ((authorizationSystem: CurrentAuthorizationSystem) => boolean);
  hidden?:
    | boolean
    | ((authorizationSystem: CurrentAuthorizationSystem) => boolean);
}

export interface Page {
  id: string;
  name: string;
  path: string | ((session: any) => string);
  target?: string;
  icon: ReactElement;
  disabled?:
    | boolean
    | ((authorizationSystem: CurrentAuthorizationSystem) => boolean);
  hidden?:
    | boolean
    | ((authorizationSystem: CurrentAuthorizationSystem) => boolean);
}
