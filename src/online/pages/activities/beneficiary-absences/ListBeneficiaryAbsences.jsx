import * as React from 'react';
import Grid from '@mui/material/Grid';
import { useLazyQuery, useMutation } from '@apollo/client';
import { useFeedBacks } from '../../../../_shared/context/feedbacks/FeedBacksProvider';
import { useAuthorizationSystem } from '../../../../_shared/context/AuthorizationSystemProvider';
import {
  DELETE_BENEFICIARY_ABSENCE,
  PUT_BENEFICIARY_ABSENCE_STATE,
} from '../../../../_shared/graphql/mutations/BeneficiaryAbsenceMutations';
import { GET_BENEFICIARY_ABSENCES } from '../../../../_shared/graphql/queries/BeneficiaryAbsenceQueries';
import BeneficiaryAbsenceFilter from './BeneficiaryAbsenceFilter';
import PaginationControlled from '../../../../_shared/components/helpers/PaginationControlled';
import TableListBeneficiaryAbsences from './TableListBeneficiaryAbsences';
import { Link } from 'react-router-dom';
import { Box, Button } from '@mui/material';
import { Add } from '@mui/icons-material';

export default function ListBeneficiaryAbsences() {
  const authorizationSystem = useAuthorizationSystem();
  const [paginator, setPaginator] = React.useState({ page: 1, limit: 20 });
  const [beneficiaryAbsenceFilter, setBeneficiaryAbsenceFilter] = React.useState(null);
  const handleFilterChange = (newFilter) => {
    console.log('newFilter', newFilter);
    setBeneficiaryAbsenceFilter(newFilter);
  };

  const { setNotifyAlert, setConfirmDialog } = useFeedBacks();
  const [
    getBeneficiaryAbsences,
    {
      loading: loadingBeneficiaryAbsences,
      data: beneficiaryAbsencesData,
      error: beneficiaryAbsencesError,
      fetchMore: fetchMoreBeneficiaryAbsences,
    },
  ] = useLazyQuery(GET_BENEFICIARY_ABSENCES, {
    variables: { beneficiaryAbsenceFilter, page: paginator.page, limit: paginator.limit },
  });

  React.useEffect(() => {
    getBeneficiaryAbsences();
  }, [beneficiaryAbsenceFilter, paginator]);

  const [deleteBeneficiaryAbsence, { loading: loadingDelete }] = useMutation(DELETE_BENEFICIARY_ABSENCE, {
    onCompleted: (datas) => {
      if (datas.deleteBeneficiaryAbsence.deleted) {
        setNotifyAlert({
          isOpen: true,
          message: 'Supprimé avec succès',
          type: 'success',
        });
      } else {
        setNotifyAlert({
          isOpen: true,
          message: `Non supprimé ! ${datas.deleteBeneficiaryAbsence.message}.`,
          type: 'error',
        });
      }
    },
    update(cache, { data: { deleteBeneficiaryAbsence } }) {
      console.log('Updating cache after deletion:', deleteBeneficiaryAbsence);

      const deletedBeneficiaryAbsenceId = deleteBeneficiaryAbsence.id;

      cache.modify({
        fields: {
          beneficiaryAbsences(existingBeneficiaryAbsences = { totalCount: 0, nodes: [] }, { readField }) {
            const updatedBeneficiaryAbsences = existingBeneficiaryAbsences.nodes.filter(
              (beneficiaryAbsence) => readField('id', beneficiaryAbsence) !== deletedBeneficiaryAbsenceId,
            );

            console.log('Updated beneficiaryAbsences:', updatedBeneficiaryAbsences);

            return {
              totalCount: existingBeneficiaryAbsences.totalCount - 1,
              nodes: updatedBeneficiaryAbsences,
            };
          },
        },
      });
    },
    onError: (err) => {
      console.log(err);
      setNotifyAlert({
        isOpen: true,
        message: 'Non supprimé ! Veuillez réessayer.',
        type: 'error',
      });
    },
  });

  const onDeleteBeneficiaryAbsence = (id) => {
    setConfirmDialog({
      isOpen: true,
      title: 'ATTENTION',
      subTitle: 'Voulez vous vraiment supprimer ?',
      onConfirm: () => {
        setConfirmDialog({ isOpen: false });
        deleteBeneficiaryAbsence({ variables: { id: id } });
      },
    });
  };

  const [updateBeneficiaryAbsenceState, { loading: loadingPutState }] = useMutation(
    PUT_BENEFICIARY_ABSENCE_STATE,
    {
      onCompleted: (datas) => {
        if (datas.updateBeneficiaryAbsenceState.done) {
          setNotifyAlert({
            isOpen: true,
            message: 'Changée avec succès',
            type: 'success',
          });
        } else {
          setNotifyAlert({
            isOpen: true,
            message: `Non changée ! ${datas.updateBeneficiaryAbsenceState.message}.`,
            type: 'error',
          });
        }
      },
      refetchQueries: [{ query: GET_BENEFICIARY_ABSENCES }],
      onError: (err) => {
        console.log(err);
        setNotifyAlert({
          isOpen: true,
          message: 'Non changée ! Veuillez réessayer.',
          type: 'error',
        });
      },
    },
  );

  const onUpdateBeneficiaryAbsenceState = (id) => {
    setConfirmDialog({
      isOpen: true,
      title: 'ATTENTION',
      subTitle: 'Voulez vous vraiment changer ?',
      onConfirm: () => {
        setConfirmDialog({ isOpen: false });
        updateBeneficiaryAbsenceState({ variables: { id: id } });
      },
    });
  };

  return (
    <Grid container spacing={2}>
      <Grid item xs={12}>
        <Box sx={{ display: 'flex', justifyContent: 'flex-end', my: 3 }}>
          <Link to="/online/activites/absences-beneficiaires/ajouter" className="no_style">
            <Button variant="contained" endIcon={<Add />}>
              Ajouter une absence
            </Button>
          </Link>
        </Box>
      </Grid>
      <Grid item xs={12}>
        <BeneficiaryAbsenceFilter onFilterChange={handleFilterChange} />
      </Grid>
      <Grid item xs={12}>
        <TableListBeneficiaryAbsences
          loading={loadingBeneficiaryAbsences}
          rows={beneficiaryAbsencesData?.beneficiaryAbsences?.nodes || []}
          onDeleteBeneficiaryAbsence={onDeleteBeneficiaryAbsence}
          onFilterChange={(newFilter) => handleFilterChange({ ...beneficiaryAbsenceFilter, ...newFilter })}
          paginator={paginator}
        />
      </Grid>
      <Grid item xs={12}>
        <PaginationControlled
          totalItems={beneficiaryAbsencesData?.beneficiaryAbsences?.totalCount} // Nombre total d'éléments
          itemsPerPage={paginator.limit} // Nombre d'éléments par page
          currentPage={1}
          onChange={(page) => setPaginator({ ...paginator, page })}
        />
      </Grid>
    </Grid>
  );
}
