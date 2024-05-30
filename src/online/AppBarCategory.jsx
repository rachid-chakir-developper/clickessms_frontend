import React from 'react';
import SearchIcon from '@mui/icons-material/Search';
import { styled, alpha } from '@mui/material/styles';
import InputBase from '@mui/material/InputBase';
import WarningIcon from "@mui/icons-material/Warning";
import DoNotDisturbOnIcon from "@mui/icons-material/DoNotDisturbOn";
import SentimentVeryDissatisfiedIcon from "@mui/icons-material/SentimentVeryDissatisfied";
import MapIcon from "@mui/icons-material/Map";
import ChecklistRtlIcon from "@mui/icons-material/ChecklistRtl";
import GppGoodIcon from "@mui/icons-material/GppGood";
import AddchartIcon from "@mui/icons-material/Addchart";
import SdCardAlertIcon from "@mui/icons-material/SdCardAlert";
import QuestionAnswerIcon from "@mui/icons-material/QuestionAnswer";
import LibraryAddCheckIcon from "@mui/icons-material/LibraryAddCheck";
import Diversity1Icon from "@mui/icons-material/Diversity1";
import BatchPredictionIcon from "@mui/icons-material/BatchPrediction";
import RecentActorsIcon from "@mui/icons-material/RecentActors";
import CommentIcon from "@mui/icons-material/Comment";
import LocalPoliceIcon from "@mui/icons-material/LocalPolice";
import CalendarMonthIcon from "@mui/icons-material/CalendarMonth";
import TaskIcon from "@mui/icons-material/Task";
import AccessibleIcon from "@mui/icons-material/Accessible";
import CoPresentIcon from "@mui/icons-material/CoPresent";
import AssignmentIcon from "@mui/icons-material/Assignment";
import PersonRemoveIcon from "@mui/icons-material/PersonRemove";
import RequestQuoteIcon from "@mui/icons-material/RequestQuote";
import DateRangeIcon from "@mui/icons-material/DateRange";
import LockPersonIcon from "@mui/icons-material/LockPerson";
import ContactsIcon from "@mui/icons-material/Contacts";
import AutoStoriesIcon from "@mui/icons-material/AutoStories";
import StickyNote2Icon from "@mui/icons-material/StickyNote2";
import {Apartment, Group, Microsoft, Note} from "@mui/icons-material";
import AssignmentIndIcon from "@mui/icons-material/AssignmentInd";
import WalletIcon from "@mui/icons-material/Wallet";
import Diversity3Icon from "@mui/icons-material/Diversity3";
import HandshakeIcon from "@mui/icons-material/Handshake";
import WarehouseIcon from "@mui/icons-material/Warehouse";
import SupportAgentIcon from "@mui/icons-material/SupportAgent";
import MarkEmailReadIcon from "@mui/icons-material/MarkEmailRead";
import DescriptionIcon from "@mui/icons-material/Description";
import FormatListNumberedIcon from "@mui/icons-material/FormatListNumbered";
import MeetingRoomIcon from "@mui/icons-material/MeetingRoom";
import EngineeringIcon from "@mui/icons-material/Engineering";
import AirportShuttleIcon from "@mui/icons-material/AirportShuttle";
import HomeWorkIcon from "@mui/icons-material/HomeWork";
import PostAddIcon from "@mui/icons-material/PostAdd";
import KeyIcon from "@mui/icons-material/Key";
import AttachMoneyIcon from "@mui/icons-material/AttachMoney";
import PointOfSaleIcon from "@mui/icons-material/PointOfSale";
import LocalAtmIcon from "@mui/icons-material/LocalAtm";
import SavingsIcon from "@mui/icons-material/Savings";
import QueryStatsIcon from "@mui/icons-material/QueryStats";
import CalculateIcon from "@mui/icons-material/Calculate";
import CreditCardOffIcon from "@mui/icons-material/CreditCardOff";
import FactCheckIcon from "@mui/icons-material/FactCheck";
import RateReviewIcon from "@mui/icons-material/RateReview";
import DevicesIcon from "@mui/icons-material/Devices";
import EmailIcon from "@mui/icons-material/Email";
import SaveIcon from "@mui/icons-material/Save";
import PasswordIcon from "@mui/icons-material/Password";
import ShoppingBasketIcon from "@mui/icons-material/ShoppingBasket";
import HowToRegIcon from "@mui/icons-material/HowToReg";
import ContentPasteIcon from "@mui/icons-material/ContentPaste";
import ReduceCapacityIcon from "@mui/icons-material/ReduceCapacity";
import SourceIcon from "@mui/icons-material/Source";
import ImportContactsIcon from "@mui/icons-material/ImportContacts";
import MenuBookIcon from "@mui/icons-material/MenuBook";
import NewspaperIcon from "@mui/icons-material/Newspaper";

const Search = styled('div')(({ theme }) => ({
    position: 'relative',
    borderRadius: theme.shape.borderRadius,
    backgroundColor: alpha(theme.palette.common.white, 0.15),
    '&:hover': {
        backgroundColor: alpha(theme.palette.common.white, 0.25),
    },
    marginRight: theme.spacing(2),
    marginLeft: 0,
    width: '100%',
    [theme.breakpoints.up('sm')]: {
        marginLeft: theme.spacing(3),
        width: 'auto',
    },
}));

const SearchIconWrapper = styled('div')(({ theme }) => ({
    padding: theme.spacing(0, 2),
    height: '100%',
    position: 'absolute',
    pointerEvents: 'none',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
}));

const StyledInputBase = styled(InputBase)(({ theme }) => ({
    color: 'inherit',
    '& .MuiInputBase-input': {
        padding: theme.spacing(1, 1, 1, 0),
        paddingLeft: `calc(1em + ${theme.spacing(4)})`,
        transition: theme.transitions.create('width'),
        width: '100%',
        [theme.breakpoints.up('md')]: {
            width: '20ch',
        },
    },
}));

export const categories = [
    {
        items: [
            // { to: "chemin du lien", text: "texte visible lors de la recherche", icon: <Nom de l'icone lors de la recherche /> },

            // évènement
            { to: "/online/qualites/evenements-indesirables", text: "Évènements indésirables", icon: <WarningIcon /> },
            { to: "/online/qualities/évènements/maltraitance-violence", text: "Maltraitance et violence", icon: <DoNotDisturbOnIcon/> },
            { to: "/online/qualities/évènements/plaintes-réclamation", text: "Plaintes et réclamation", icon: <SentimentVeryDissatisfiedIcon/> },
            { to: "/online/qualities/plan-d’action", text: "Plan d’action", icon: <MapIcon/> },
            // audits
            { to: "/online/qualities/audits/evaluation-has", text: "Évaluation HAS", icon: <ChecklistRtlIcon/> },
            { to: "/online/qualities/audits/rgpd", text: "RGPD", icon: <GppGoodIcon/> },
            { to: "/online/qualities/audits/Autodiagnostic-cpom", text: "Autodiagnostic CPOM", icon: <AddchartIcon/> },
            { to: "/online/audits/gestion-risques", text: "Gestion des risques", icon: <SdCardAlertIcon/> },
            { to: "/online/audits/enquêtes-résultats", text: "Enquêtes et Résultats", icon: <QuestionAnswerIcon/> },
            { to: "/online/audits/procédures", text: "Procédures", icon: <LibraryAddCheckIcon/> },
            { to: "/online/audits/qvct", text: "QVCT", icon: <Diversity1Icon/> },
            { to: "/online/audits/boîte-idées", text: "Boîte à idées", icon: <BatchPredictionIcon/> },
            // activités
            { to: "/online/activité/projet-personnalisé", text: "Projet personnalisé ( PPA)", icon: <RecentActorsIcon/> },
            { to: "/online/activites/evenements", text: "Évènements / Transmissions", icon: <CommentIcon/> },
            { to: "/online/activité/malette-loi-2002-2", text: "Malette loi 2002-2", icon: <LocalPoliceIcon/> },
            { to: "/online/activites/absences-beneficiaires", text: "Présences / Absences", icon: <CalendarMonthIcon/> },
            { to: "/online/activité/prestations", text: "Prestations", icon: <TaskIcon/> },
            { to: "/online/activité/Serafin-ph", text: "Serafin PH", icon: <AccessibleIcon/> },
            // ressources humaines
            { to: "/online/ressources-humaines/formations", text: "Formations", icon: <CoPresentIcon/> },
            { to: "/online/ressources-humaines/cr-entretiens", text: "CR Entretiens", icon: <AssignmentIcon/> },
            { to: "/online/ressources-humaines/absences", text: "Absences", icon: <PersonRemoveIcon/> },
            { to: "/online/notes-frais", text: "Notes de frais", icon: <RequestQuoteIcon/> },
            { to: "/online/ressources-humaines/planning", text: "Planning", icon: <DateRangeIcon/> },
            { to: "/online/ressources-humaines/bdes", text: "BDES", icon: <LockPersonIcon/> },
            { to: "/online/ressources-humaines/vivier-candidats", text: "Vivier candidats", icon: <ContactsIcon/> },
            { to: "/online/ressources-humaines/convention-collective", text: "Convention collective", icon: <AutoStoriesIcon/> },
            { to: "/online/ressources-humaines/accord-d’entreprise", text: "Accord d’entreprise", icon: <StickyNote2Icon/> },
            // administratif
            { to: "/online/associations/structures", text: "Structures", icon: <Apartment/> },
            { to: "/online/ressources-humaines/beneficiaires", text: "Bénéficiaires", icon: <AssignmentIndIcon/> },
            { to: "/online/ressources-humaines/employes", text: "Salariés", icon: <WalletIcon/> },
            { to: "/online/partenariats/financeurs", text: "Financeur", icon: <Diversity3Icon/> },
            { to: "/online/partenariats/partenaires", text: "Partenaires", icon: <HandshakeIcon/> },
            { to: "/online/achats/fournisseurs", text: "Fournisseurs", icon: <WarehouseIcon/> },
            { to: "/online/administratif/appels", text: "Suivi appels", icon: <SupportAgentIcon/> },
            { to: "/online/administratif/courriers", text: "Suivi courriers", icon: <MarkEmailReadIcon/> },
            { to: "/online/administratif/reunions", text: "CR Réunions", icon: <AssignmentIcon/> },
            { to: "/online/administratif/documents_trames", text: "Documents / Trames", icon: <DescriptionIcon/> },
            { to: "/online/administratif/lup", text: "LUP", icon: <FormatListNumberedIcon/> },
            { to: "/online/administratif/sdr", text: "Salle de réunion", icon: <MeetingRoomIcon/> },
            // services généraux
            { to: "/online/travaux/interventions", text: "Interventions", icon: <EngineeringIcon/> },
            { to: "/online/vehicules", text: "Parc automobile", icon: <AirportShuttleIcon/> },
            { to: "/online/partnerships/bâtiment-immobilier", text: "Bâtiment / Immobilier", icon: <HomeWorkIcon/> },
            { to: "/online/partnerships/bons-commande", text: "Bons de commande", icon: <PostAddIcon/> },
            { to: "/online/recuperations/objets", text: "Suivi des clés", icon: <KeyIcon/> },
            // finance
            { to: "/online/sales/dépenses-engagements", text: "Dépenses et Engagements", icon: <AttachMoneyIcon/> },
            { to: "/online/sales/facturation-activité", text: "Facturation de l’activité", icon: <RequestQuoteIcon/> },
            { to: "/online/sales/caisse", text: "Caisse", icon: <PointOfSaleIcon/> },
            { to: "/online/sales/budget", text: "Budget", icon: <LocalAtmIcon/> },
            { to: "/online/finance/tresorerie/comptes-bancaires", text: "Trésorerie", icon: <SavingsIcon/> },
            { to: "/online/sales/diagnostic-financier", text: "Diagnostic financier", icon: <QueryStatsIcon/> },
            { to: "/online/sales/comptabilité", text: "Comptabilité", icon: <CalculateIcon/> },
            { to: "/online/sales/immobilisations", text: "Immobilisations", icon: <CreditCardOffIcon/> },
            { to: "/online/sales/révision-comptes", text: "Révision des comptes", icon: <FactCheckIcon/> },
            { to: "/online/finance/decisions", text: "Tarification", icon: <RateReviewIcon/> },
            // informatique
            { to: "/online/materiels", text: "Matériels", icon: <DevicesIcon/> },
            { to: "/online/logiciels", text: "Logiciel", icon: <Microsoft/> },
            { to: "/online/tickets", text: "Ticket", icon: <EmailIcon/> },
            { to: "/online/sauvegardes", text: "Sauvegardes", icon: <SaveIcon/> },
            { to: "/online/mots-de-passe", text: "Mots de passe", icon: <PasswordIcon/> },
            // achat
            { to: "/online/achat/demande-achat-investissement", text: "Demande d’achat / Investissement", icon: <ShoppingBasketIcon/> },
            { to: "/online/achat/fournisseurs-vérifiés", text: "Fournisseurs vérifiés", icon: <HowToRegIcon/> },
            { to: "/online/achat/base-contrat", text: "Base contrat", icon: <ContentPasteIcon/> },
            { to: "/online/achat/mise-en-concurrence", text: "Mise en concurrence", icon: <ReduceCapacityIcon/> },
            // gouvernance
            { to: "/online/gouvernance/membres", text: "Membres", icon: <Group/> },
            { to: "/online/gouvernance/reunions", text: "Procès-verbal", icon: <Note/> },
            // cse
            { to: "/online/cse/membres", text: "Membres", icon: <Group/> },
            { to: "/online/cse/procès-verbal", text: "Procès-verbal", icon: <TaskIcon/> },
            { to: "/online/cse/bdes", text: "BDES", icon: <RequestQuoteIcon/> },
            // juridique
            { to: "/online/juridique/casf", text: "CASF", icon: <SourceIcon/>},
            { to: "/online/juridique/Code-associations-fondations", text: "Code des associations et fondations", icon: <ImportContactsIcon/> },
            { to: "/online/juridique/droit-travail", text: "Droit du travail", icon: <MenuBookIcon/> },
            { to: "/online/juridique/convention-collective", text: "Convention collective", icon: <AutoStoriesIcon/> },
            { to: "/online/juridique/accord-d’entreprise", text: "Accord d’entreprise", icon: <StickyNote2Icon/> },
            // ressources
            { to: "/online/ressources/blog", text: "Blog", icon: <StickyNote2Icon/> },
            { to: "/online/ressources/le-comptoir-des-essms", text: "Le comptoir des ESSMS", icon: <NewspaperIcon/> }
        ]
    },
];

const SearchBar = ({ searchTerm, handleSearch }) => {
    return (
        <Search>
            <SearchIconWrapper>
                <SearchIcon />
            </SearchIconWrapper>
            <StyledInputBase
                placeholder="Rechercher..."
                inputProps={{ 'aria-label': 'search' }}
                value={searchTerm}
                onChange={handleSearch}
            />
        </Search>
    );
};

export default SearchBar;

