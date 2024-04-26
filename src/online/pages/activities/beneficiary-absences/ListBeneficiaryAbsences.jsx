import * as React from 'react';
import { experimentalStyled as styled } from '@mui/material/styles';
import Box from '@mui/material/Box';
import Grid from '@mui/material/Unstable_Grid2';
import { Alert, Button, Stack } from '@mui/material';
import BeneficiaryAbsenceItemCard from './BeneficiaryAbsenceItemCard';
import { useLazyQuery, useMutation } from '@apollo/client';
import { Add } from '@mui/icons-material';
import { Link } from 'react-router-dom';

import { useFeedBacks } from '../../../../_shared/context/feedbacks/FeedBacksProvider';
import { DELETE_BENEFICIARY_ABSENCE } from '../../../../_shared/graphql/mutations/BeneficiaryAbsenceMutations';
import { GET_BENEFICIARY_ABSENCES } from '../../../../_shared/graphql/queries/BeneficiaryAbsenceQueries';
import ProgressService from '../../../../_shared/services/feedbacks/ProgressService';
import BeneficiaryAbsenceFilter from './BeneficiaryAbsenceFilter';
import PaginationControlled from '../../../../_shared/components/helpers/PaginationControlled';

const Item = styled(Stack)(({ theme }) => ({
  backgroundColor: theme.palette.mode === 'dark' ? '#1A2027' : '#fff',
  ...theme.typography.body2,
  padding: theme.spacing(2),
  textAlign: 'center',
  color: theme.palette.text.secondary,
}));

export default function ListBeneficiaryAbsences() {
  const [paginator, setPaginator] = React.useState({ page: 1, limit: 10 });
  const [beneficiaryAbsenceFilter, setBeneficiaryAbsenceFilter] =
    React.useState(null);
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
      <Grid item="true" xs={12}>
        <Box sx={{ display: 'flex', justifyContent: 'flex-end', my: 3 }}>
          <Link
            to="/online/activites/absences-beneficiaires/ajouter"
            className="no_style"
          >
            <Button variant="contained" endIcon={<Add />}>
              Ajouter une absence
            </Button>
          </Link>
        </Box>
      </Grid>
      <Grid item="true" xs={12}>
        <BeneficiaryAbsenceFilter onFilterChange={handleFilterChange} />
      </Grid>
      <Grid item="true" xs={12}>
        <Box sx={{ flexGrow: 1 }}>
          <Grid
            container
            spacing={{ xs: 2, md: 3 }}
            columns={{ xs: 4, sm: 8, md: 12 }}
          >
            {loadingBeneficiaryAbsences && (
              <Grid key={'pgrs'} item xs={2} sm={4} md={3}>
                <ProgressService type="mediaCard" />
              </Grid>
            )}
            {beneficiaryAbsencesData?.beneficiaryAbsences?.nodes?.length < 1 &&
              !loadingBeneficiaryAbsences && (
                <Alert severity="warning">Aucune absence trouvé.</Alert>
              )}
            {beneficiaryAbsencesData?.beneficiaryAbsences?.nodes?.map(
              (beneficiaryAbsence, index) => (
                <Grid xs={2} sm={4} md={3} key={index}>
                  <Item>
                    <BeneficiaryAbsenceItemCard
                      beneficiaryAbsence={beneficiaryAbsence}
                      onDeleteBeneficiaryAbsence={onDeleteBeneficiaryAbsence}
                    />
                  </Item>
                </Grid>
              ),
            )}
          </Grid>
        </Box>
      </Grid>
      <Grid item="true" xs={12}>
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
