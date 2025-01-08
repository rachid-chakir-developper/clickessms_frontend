import * as React from 'react';
import { experimentalStyled as styled } from '@mui/material/styles';
import Grid from '@mui/material/Grid';
import { Alert, Button, Stack } from '@mui/material';
import { useLazyQuery, useMutation } from '@apollo/client';
import { DELETE_BENEFICIARY_ABSENCE } from '../../../../../_shared/graphql/mutations/BeneficiaryAbsenceMutations';
import { GET_BENEFICIARY_ABSENCES } from '../../../../../_shared/graphql/queries/BeneficiaryAbsenceQueries';
import { useFeedBacks } from '../../../../../_shared/context/feedbacks/FeedBacksProvider';
import TableListBeneficiaryAbsences from '../../../activities/beneficiary-absences/TableListBeneficiaryAbsences';
import PaginationControlled from '../../../../../_shared/components/helpers/PaginationControlled';

const Item = styled(Stack)(({ theme }) => ({
  backgroundColor: theme.palette.mode === 'dark' ? '#1A2027' : '#fff',
  ...theme.typography.body2,
  padding: theme.spacing(2),
  textAlign: 'center',
  color: theme.palette.text.secondary,
}));

export default function BeneficiaryAbsences({beneficiary}) {
  const [paginator, setPaginator] = React.useState({ page: 1, limit: 10 });
  const [beneficiaryAbsenceFilter, setBeneficiaryAbsenceFilter] =
    React.useState({beneficiaries: [beneficiary?.id]});
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
    variables: {
      beneficiaryAbsenceFilter,
      page: paginator.page,
      limit: paginator.limit,
    },
  });

  React.useEffect(() => {
    getBeneficiaryAbsences();
  }, [beneficiaryAbsenceFilter, paginator]);

  const [deleteBeneficiaryAbsence, { loading: loadingDelete }] = useMutation(
    DELETE_BENEFICIARY_ABSENCE,
    {
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
            message: `Non Supprimé ! ${datas.deleteBeneficiaryAbsence.message}.`,
            type: 'error',
          });
        }
      },
      update(cache, { data: { deleteBeneficiaryAbsence } }) {
        console.log('Updating cache after deletion:', deleteBeneficiaryAbsence);

        const deletedBeneficiaryAbsenceId = deleteBeneficiaryAbsence.id;

        cache.modify({
          fields: {
            beneficiaryAbsences(
              existingBeneficiaryAbsences = { totalCount: 0, nodes: [] },
              { readField },
            ) {
              const updatedBeneficiaryAbsences =
                existingBeneficiaryAbsences.nodes.filter(
                  (beneficiaryAbsence) =>
                    readField('id', beneficiaryAbsence) !==
                    deletedBeneficiaryAbsenceId,
                );

              console.log(
                'Updated beneficiaryAbsences:',
                updatedBeneficiaryAbsences,
              );

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
          message: 'Non Supprimé ! Veuillez réessayer.',
          type: 'error',
        });
      },
    },
  );

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

  return (
    <Grid container spacing={2}>
      <Grid item xs={12}>
        <TableListBeneficiaryAbsences
          loading={loadingBeneficiaryAbsences}
          rows={beneficiaryAbsencesData?.beneficiaryAbsences?.nodes || []}
          onDeleteBeneficiaryAbsence={onDeleteBeneficiaryAbsence}
        />
      </Grid>
      <Grid item xs={12}>
        <PaginationControlled
          totalItems={beneficiaryAbsencesData?.beneficiaryAbsences?.totalCount} // Nombre total d'éléments
          itemsPerPage={paginator.limit} // Nombre d'éléments par page
          currentPage={paginator.page}
          onChange={(page) => setPaginator({ ...paginator, page })}
        />
      </Grid>
    </Grid>
  );
}
