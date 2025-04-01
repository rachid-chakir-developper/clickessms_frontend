import * as React from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useQuery, useMutation } from '@apollo/client';
import {
  Paper,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  TablePagination,
  Box,
  IconButton,
  Tooltip,
  Typography,
  Chip,
  Button,
  Divider,
} from '@mui/material';
import EditIcon from '@mui/icons-material/Edit';
import DeleteIcon from '@mui/icons-material/Delete';
import CheckCircleIcon from '@mui/icons-material/CheckCircle';
import CancelIcon from '@mui/icons-material/Cancel';
import DownloadIcon from '@mui/icons-material/Download';
import SwipeRightIcon from '@mui/icons-material/SwipeRight';
import dayjs from 'dayjs';
import 'dayjs/locale/fr';
import AddIcon from '@mui/icons-material/Add';

import { useFeedBacks } from '../../../../_shared/context/feedbacks/FeedBacksProvider';
import ProgressService from '../../../../_shared/services/feedbacks/ProgressService';
import { formatPrice } from '../../../../_shared/tools/functions';
import { GET_ADVANCES } from '../../../../_shared/graphql/queries/AdvanceQueries';
import { DELETE_ADVANCE, VALIDATE_ADVANCE } from '../../../../_shared/graphql/mutations/AdvanceMutations';
import TableToolbar from '../../../../_shared/components/tables/TableToolbar';
import TableFilterAdvance from './TableFilterAdvance';

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

export default function TableListAdvances() {
  const { setNotifyAlert, setConfirmDialog } = useFeedBacks();
  const navigate = useNavigate();
  const [page, setPage] = React.useState(0);
  const [rowsPerPage, setRowsPerPage] = React.useState(10);
  const [filterValues, setFilterValues] = React.useState({
    keyword: '',
    status: '',
    employee_id: null,
  });

  // Requête pour récupérer les acomptes
  const {
    loading,
    data,
    error,
    refetch,
  } = useQuery(GET_ADVANCES, {
    variables: {
      advanceFilter: (filterValues.keyword !== '' || filterValues.status !== '' || filterValues.employee_id !== null) ? 
        {
          keyword: filterValues.keyword !== '' ? filterValues.keyword : undefined,
          ...(filterValues.status !== '' && { status: filterValues.status }),
          // Le filtre employee_id n'est pas disponible dans le schéma GraphQL actuel, 
          // nous l'omettons pour éviter les erreurs
        } : undefined,
      page: page + 1,
      limit: rowsPerPage,
    },
    fetchPolicy: 'network-only',
    onCompleted: (data) => {
      console.log('GraphQL Query Response:', data);
      console.log('Advances:', data?.advances?.nodes);
      console.log('Total Count:', data?.advances?.totalCount);
    },
    onError: (error) => {
      console.error('GraphQL Query Error:', error);
      console.error('GraphQL Error Details:', error.graphQLErrors);
      console.error('Network Error:', error.networkError);
    }
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
        refetch();
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
  const onDeleteAdvance = (id) => {
    setConfirmDialog({
      isOpen: true,
      title: 'ATTENTION',
      subTitle: 'Voulez-vous vraiment supprimer cet acompte ?',
      onConfirm: () => {
        setConfirmDialog({ isOpen: false });
        // S'assurer que l'ID est bien une chaîne de caractères
        const idString = String(id);
        deleteAdvance({
          variables: {
            id: idString
          }
        });
      },
    });
  };

  // Gestion de la validation/rejet
  const onValidateAdvance = (id, status, comments = null) => {
    setConfirmDialog({
      isOpen: true,
      title: 'CONFIRMATION',
      subTitle: `Voulez-vous vraiment ${status === 'APPROVED' ? 'approuver' : 'rejeter'} cet acompte ?`,
      onConfirm: () => {
        setConfirmDialog({ isOpen: false });
        // S'assurer que l'ID est bien une chaîne de caractères
        const idString = String(id);
        validateAdvance({
          variables: {
            id: idString,
            status: status,
            comments: comments
          }
        });
      },
    });
  };

  // Gestion de la pagination
  const handleChangePage = (event, newPage) => {
    setPage(newPage);
  };

  const handleChangeRowsPerPage = (event) => {
    setRowsPerPage(parseInt(event.target.value, 10));
    setPage(0);
  };

  // Récupération des données
  const advances = data?.advances?.nodes || [];
  const totalCount = data?.advances?.totalCount || 0;

  return (
    <Box sx={{ width: '100%' }}>
      <Paper sx={{ width: '100%', mb: 2 }}>
        <TableToolbar
          title="Liste des demandes d'acomptes"
          filterComponent={
            <TableFilterAdvance
              filterValues={filterValues}
              setFilterValues={setFilterValues}
            />
          }
        >
          <Button
            component={Link}
            to="../ajouter"
            variant="contained"
            color="primary"
            startIcon={<AddIcon />}
          >
            Ajouter une demande
          </Button>
        </TableToolbar>
        <Divider />

        {(loading || loadingDelete || loadingValidate) && (
          <ProgressService type="linear" />
        )}

        <TableContainer>
          <Table
            sx={{ minWidth: 750 }}
            aria-labelledby="tableTitle"
            size="medium"
          >
            <TableHead>
              <TableRow>
                <TableCell>N°</TableCell>
                <TableCell>Employé</TableCell>
                <TableCell>Montant</TableCell>
                <TableCell>Pour le mois de</TableCell>
                <TableCell>Statut</TableCell>
                <TableCell>Date de demande</TableCell>
                <TableCell>Actions</TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {advances.length === 0 ? (
                <TableRow>
                  <TableCell colSpan={7} align="center">
                    Aucune demande d'acompte trouvée
                  </TableCell>
                </TableRow>
              ) : (
                advances.map((row) => (
                  <TableRow
                    hover
                    role="checkbox"
                    tabIndex={-1}
                    key={row.id}
                  >
                    <TableCell>{row.number}</TableCell>
                    <TableCell>
                      {row.employee ? `${row.employee.firstName || ''} ${row.employee.lastName || ''}` : '-'}
                    </TableCell>
                    <TableCell>{formatPrice(row.amount)} €</TableCell>
                    <TableCell>
                      {row.month && dayjs(row.month).locale('fr').format('MMMM YYYY')}
                    </TableCell>
                    <TableCell>
                      <Chip
                        label={getStatusLabel(row.status)}
                        color={getStatusColor(row.status)}
                        size="small"
                      />
                    </TableCell>
                    <TableCell>
                      {row.createdAt && dayjs(row.createdAt).format('DD/MM/YYYY HH:mm')}
                    </TableCell>
                    <TableCell>
                      <Box sx={{ display: 'flex' }}>
                        <Tooltip title="Voir les détails">
                          <IconButton
                            color="primary"
                            onClick={() => navigate(`../details/${row.id}`)}
                          >
                            <SwipeRightIcon />
                          </IconButton>
                        </Tooltip>

                        {row.status === 'PENDING' && (
                          <>
                            <Tooltip title="Modifier">
                              <IconButton
                                color="primary"
                                component={Link}
                                to={`../modifier/${row.id}`}
                              >
                                <EditIcon />
                              </IconButton>
                            </Tooltip>

                            <Tooltip title="Approuver">
                              <IconButton
                                color="success"
                                onClick={() => onValidateAdvance(row.id, 'APPROVED')}
                              >
                                <CheckCircleIcon />
                              </IconButton>
                            </Tooltip>

                            <Tooltip title="Rejeter">
                              <IconButton
                                color="error"
                                onClick={() => onValidateAdvance(row.id, 'REJECTED')}
                              >
                                <CancelIcon />
                              </IconButton>
                            </Tooltip>

                            <Tooltip title="Supprimer">
                              <IconButton
                                color="error"
                                onClick={() => onDeleteAdvance(row.id)}
                              >
                                <DeleteIcon />
                              </IconButton>
                            </Tooltip>
                          </>
                        )}
                      </Box>
                    </TableCell>
                  </TableRow>
                ))
              )}
            </TableBody>
          </Table>
        </TableContainer>

        <TablePagination
          rowsPerPageOptions={[5, 10, 25, 50, 100]}
          component="div"
          count={totalCount}
          rowsPerPage={rowsPerPage}
          page={page}
          onPageChange={handleChangePage}
          onRowsPerPageChange={handleChangeRowsPerPage}
          labelRowsPerPage="Lignes par page"
          labelDisplayedRows={({ from, to, count }) =>
            `${from}-${to} sur ${count !== -1 ? count : `plus de ${to}`}`
          }
        />
      </Paper>
    </Box>
  );
} 