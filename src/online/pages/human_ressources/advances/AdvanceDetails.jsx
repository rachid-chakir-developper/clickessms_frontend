import * as React from 'react';
import { useQuery, useMutation } from '@apollo/client';
import { useParams, useNavigate, Link } from 'react-router-dom';
import {
  Button,
  Chip,
  Divider,
  Grid,
  Paper,
  Stack,
  Typography,
  Box,
  IconButton,
  Tooltip,
} from '@mui/material';
import dayjs from 'dayjs';
import EditIcon from '@mui/icons-material/Edit';
import DeleteIcon from '@mui/icons-material/Delete';
import CheckCircleIcon from '@mui/icons-material/CheckCircle';
import CancelIcon from '@mui/icons-material/Cancel';
import 'dayjs/locale/fr';

import { useFeedBacks } from '../../../../_shared/context/feedbacks/FeedBacksProvider';
import ProgressService from '../../../../_shared/services/feedbacks/ProgressService';
import { formatPrice } from '../../../../_shared/tools/functions';
import { GET_ADVANCE } from '../../../../_shared/graphql/queries/AdvanceQueries';
import { DELETE_ADVANCE, VALIDATE_ADVANCE } from '../../../../_shared/graphql/mutations/AdvanceMutations';

// Fonction pour récupérer le libellé du statut
const getStatusLabel = (status) => {
  switch (status) {
    case 'PENDING':
      return 'En attente';
    case 'APPROVED':
      return 'Approuvé';
    case 'REJECTED':
      return 'Rejeté';
    case 'MODIFIED':
      return 'Modifié';
    default:
      return status;
  }
};

// Fonction pour récupérer la couleur du statut
const getStatusColor = (status) => {
  switch (status) {
    case 'PENDING':
      return 'warning';
    case 'APPROVED':
      return 'success';
    case 'REJECTED':
      return 'error';
    case 'MODIFIED':
      return 'info';
    default:
      return 'default';
  }
};

export default function AdvanceDetails() {
  const { idAdvance } = useParams();
  const navigate = useNavigate();
  const { setNotifyAlert, setConfirmDialog } = useFeedBacks();
  
  // Requête pour récupérer les détails de l'acompte
  const { loading, data, error, refetch } = useQuery(GET_ADVANCE, {
    variables: { id: idAdvance },
    fetchPolicy: 'network-only',
  });
  
  // Mutation pour supprimer un acompte
  const [deleteAdvance, { loading: loadingDelete }] = useMutation(DELETE_ADVANCE, {
    onCompleted: (data) => {
      if (data.deleteAdvance.success) {
        setNotifyAlert({
          isOpen: true,
          message: 'Acompte supprimé avec succès',
          type: 'success',
        });
        navigate('/online/rh/acomptes/liste');
      } else {
        setNotifyAlert({
          isOpen: true,
          message: data.deleteAdvance.message || 'Une erreur est survenue lors de la suppression',
          type: 'error',
        });
      }
    },
    onError: (err) => {
      console.error(err);
      setNotifyAlert({
        isOpen: true,
        message: 'Une erreur est survenue lors de la suppression',
        type: 'error',
      });
    },
  });
  
  // Mutation pour valider/rejeter un acompte
  const [validateAdvance, { loading: loadingValidate }] = useMutation(VALIDATE_ADVANCE, {
    onCompleted: (data) => {
      if (data.validateAdvance.success) {
        setNotifyAlert({
          isOpen: true,
          message: 'Statut de l\'acompte mis à jour avec succès',
          type: 'success',
        });
        refetch();
      } else {
        setNotifyAlert({
          isOpen: true,
          message: data.validateAdvance.message || 'Une erreur est survenue lors de la mise à jour',
          type: 'error',
        });
      }
    },
    onError: (err) => {
      console.error(err);
      setNotifyAlert({
        isOpen: true,
        message: 'Une erreur est survenue lors de la mise à jour',
        type: 'error',
      });
    },
  });
  
  // Gestion de la suppression
  const onDeleteAdvance = () => {
    setConfirmDialog({
      isOpen: true,
      title: 'ATTENTION',
      subTitle: 'Voulez-vous vraiment supprimer cet acompte ?',
      onConfirm: () => {
        setConfirmDialog({ isOpen: false });
        deleteAdvance({ variables: { id: idAdvance } });
      },
    });
  };
  
  // Gestion de la validation/rejet
  const onValidateAdvance = (status, comments = null) => {
    setConfirmDialog({
      isOpen: true,
      title: 'CONFIRMATION',
      subTitle: `Voulez-vous vraiment ${status === 'APPROVED' ? 'approuver' : 'rejeter'} cet acompte ?`,
      onConfirm: () => {
        setConfirmDialog({ isOpen: false });
        validateAdvance({ variables: { id: idAdvance, status, comments } });
      },
    });
  };
  
  if (loading || loadingDelete || loadingValidate) {
    return <ProgressService type="circular" />;
  }
  
  if (error) {
    return (
      <Typography color="error">
        Erreur lors du chargement des données : {error.message}
      </Typography>
    );
  }
  
  const advance = data?.advance;
  
  if (!advance) {
    return (
      <Typography>
        Aucune demande d'acompte trouvée avec cet identifiant.
      </Typography>
    );
  }
  
  return (
    <Box sx={{ maxWidth: 800, margin: 'auto' }}>
      <Paper sx={{ p: 3, mb: 3 }}>
        <Stack direction="row" justifyContent="space-between" alignItems="center" mb={2}>
          <Typography variant="h5">Détails de la demande d'acompte</Typography>
          <Box>
            <Button
              component={Link}
              to="/online/ressources-humaines/acomptes/liste"
              variant="outlined"
              color="primary"
              sx={{ mr: 1 }}
            >
              Retour à la liste
            </Button>
            
            {advance.status === 'PENDING' && (
              <>
                <Tooltip title="Modifier">
                  <IconButton
                    color="primary"
                    component={Link}
                    to={`/online/rh/acomptes/modifier/${advance.id}`}
                    sx={{ mr: 1 }}
                  >
                    <EditIcon />
                  </IconButton>
                </Tooltip>
                
                <Tooltip title="Approuver">
                  <IconButton
                    color="success"
                    onClick={() => onValidateAdvance('APPROVED')}
                    sx={{ mr: 1 }}
                  >
                    <CheckCircleIcon />
                  </IconButton>
                </Tooltip>
                
                <Tooltip title="Rejeter">
                  <IconButton
                    color="error"
                    onClick={() => onValidateAdvance('REJECTED')}
                    sx={{ mr: 1 }}
                  >
                    <CancelIcon />
                  </IconButton>
                </Tooltip>
                
                <Tooltip title="Supprimer">
                  <IconButton
                    color="error"
                    onClick={onDeleteAdvance}
                  >
                    <DeleteIcon />
                  </IconButton>
                </Tooltip>
              </>
            )}
          </Box>
        </Stack>
        
        <Divider sx={{ mb: 3 }} />
        
        <Grid container spacing={3}>
          <Grid item xs={12} sm={6}>
            <Typography variant="subtitle1">Numéro</Typography>
            <Typography variant="body1">{advance.number}</Typography>
          </Grid>
          
          <Grid item xs={12} sm={6}>
            <Typography variant="subtitle1">Statut</Typography>
            <Chip 
              label={getStatusLabel(advance.status)}
              color={getStatusColor(advance.status)}
            />
          </Grid>
          
          <Grid item xs={12} sm={6}>
            <Typography variant="subtitle1">Employé</Typography>
            <Typography variant="body1">
              {advance.employee?.firstName} {advance.employee?.lastName}
            </Typography>
          </Grid>
          
          <Grid item xs={12} sm={6}>
            <Typography variant="subtitle1">Montant</Typography>
            <Typography variant="body1" sx={{ fontWeight: 'bold' }}>
              {formatPrice(advance.amount)} €
            </Typography>
          </Grid>
          
          <Grid item xs={12} sm={6}>
            <Typography variant="subtitle1">Pour le mois de</Typography>
            <Typography variant="body1">
              {dayjs(advance.month).locale('fr').format('MMMM YYYY')}
            </Typography>
          </Grid>
          
          <Grid item xs={12} sm={6}>
            <Typography variant="subtitle1">Date de demande</Typography>
            <Typography variant="body1">
              {dayjs(advance.createdAt).format('DD/MM/YYYY HH:mm')}
            </Typography>
          </Grid>
          
          {advance.validationDate && (
            <Grid item xs={12} sm={6}>
              <Typography variant="subtitle1">Date de validation/rejet</Typography>
              <Typography variant="body1">
                {dayjs(advance.validationDate).format('DD/MM/YYYY HH:mm')}
              </Typography>
            </Grid>
          )}
          
          {advance.validatedBy && (
            <Grid item xs={12} sm={6}>
              <Typography variant="subtitle1">Validé/Rejeté par</Typography>
              <Typography variant="body1">
                {advance.validatedBy?.firstName} {advance.validatedBy?.lastName}
              </Typography>
            </Grid>
          )}
          
          {advance.reason && (
            <Grid item xs={12}>
              <Typography variant="subtitle1">Motif de la demande</Typography>
              <Typography variant="body1">
                {advance.reason}
              </Typography>
            </Grid>
          )}
          
          {advance.comments && (
            <Grid item xs={12}>
              <Typography variant="subtitle1">Commentaires RH</Typography>
              <Typography variant="body1">
                {advance.comments}
              </Typography>
            </Grid>
          )}
        </Grid>
      </Paper>
    </Box>
  );
} 