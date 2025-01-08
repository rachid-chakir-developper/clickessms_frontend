import * as React from 'react';
import { experimentalStyled as styled } from '@mui/material/styles';
import Box from '@mui/material/Box';
import Grid from '@mui/material/Grid';
import { Alert, Button, Stack } from '@mui/material';
import BeneficiaryAdmissionItemCard from './BeneficiaryAdmissionItemCard';
import { useLazyQuery, useMutation } from '@apollo/client';
import { Add } from '@mui/icons-material';
import { Link } from 'react-router-dom';

import { useFeedBacks } from '../../../../_shared/context/feedbacks/FeedBacksProvider';
import { useAuthorizationSystem } from '../../../../_shared/context/AuthorizationSystemProvider';
import {
  DELETE_BENEFICIARY_ADMISSION,
  PUT_BENEFICIARY_ADMISSION_STATE,
} from '../../../../_shared/graphql/mutations/BeneficiaryAdmissionMutations';
import { GET_BENEFICIARY_ADMISSIONS } from '../../../../_shared/graphql/queries/BeneficiaryAdmissionQueries';
import ProgressService from '../../../../_shared/services/feedbacks/ProgressService';
import BeneficiaryAdmissionFilter from './BeneficiaryAdmissionFilter';
import PaginationControlled from '../../../../_shared/components/helpers/PaginationControlled';
import TableListBeneficiaryAdmissions from './TableListBeneficiaryAdmissions';

const Item = styled(Stack)(({ theme }) => ({
  backgroundColor: theme.palette.mode === 'dark' ? '#1A2027' : '#fff',
  ...theme.typography.body2,
  padding: theme.spacing(2),
  textAlign: 'center',
  color: theme.palette.text.secondary,
}));

export default function ListBeneficiaryAdmissions() {
  const authorizationSystem = useAuthorizationSystem();
  const canManageActivity = authorizationSystem.requestAuthorization({
    type: 'manageActivity',
  }).authorized;
  const [paginator, setPaginator] = React.useState({ page: 1, limit: 10 });
  const [beneficiaryAdmissionFilter, setBeneficiaryAdmissionFilter] = React.useState(null);
  const handleFilterChange = (newFilter) => {
    console.log('newFilter', newFilter);
    setBeneficiaryAdmissionFilter(newFilter);
  };

  const { setNotifyAlert, setConfirmDialog } = useFeedBacks();
  const [
    getBeneficiaryAdmissions,
    {
      loading: loadingBeneficiaryAdmissions,
      data: beneficiaryAdmissionsData,
      error: beneficiaryAdmissionsError,
      fetchMore: fetchMoreBeneficiaryAdmissions,
    },
  ] = useLazyQuery(GET_BENEFICIARY_ADMISSIONS, {
    variables: { beneficiaryAdmissionFilter, page: paginator.page, limit: paginator.limit },
  });

  React.useEffect(() => {
    getBeneficiaryAdmissions();
  }, [beneficiaryAdmissionFilter, paginator]);

  const [deleteBeneficiaryAdmission, { loading: loadingDelete }] = useMutation(DELETE_BENEFICIARY_ADMISSION, {
    onCompleted: (datas) => {
      if (datas.deleteBeneficiaryAdmission.deleted) {
        setNotifyAlert({
          isOpen: true,
          message: 'Supprimé avec succès',
          type: 'success',
        });
      } else {
        setNotifyAlert({
          isOpen: true,
          message: `Non supprimé ! ${datas.deleteBeneficiaryAdmission.message}.`,
          type: 'error',
        });
      }
    },
    update(cache, { data: { deleteBeneficiaryAdmission } }) {
      console.log('Updating cache after deletion:', deleteBeneficiaryAdmission);

      const deletedBeneficiaryAdmissionId = deleteBeneficiaryAdmission.id;

      cache.modify({
        fields: {
          beneficiaryAdmissions(existingBeneficiaryAdmissions = { totalCount: 0, nodes: [] }, { readField }) {
            const updatedBeneficiaryAdmissions = existingBeneficiaryAdmissions.nodes.filter(
              (beneficiaryAdmission) => readField('id', beneficiaryAdmission) !== deletedBeneficiaryAdmissionId,
            );

            console.log('Updated beneficiaryAdmissions:', updatedBeneficiaryAdmissions);

            return {
              totalCount: existingBeneficiaryAdmissions.totalCount - 1,
              nodes: updatedBeneficiaryAdmissions,
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

  const onDeleteBeneficiaryAdmission = (id) => {
    setConfirmDialog({
      isOpen: true,
      title: 'ATTENTION',
      subTitle: 'Voulez vous vraiment supprimer ?',
      onConfirm: () => {
        setConfirmDialog({ isOpen: false });
        deleteBeneficiaryAdmission({ variables: { id: id } });
      },
    });
  };

  const [updateBeneficiaryAdmissionState, { loading: loadingPutState }] = useMutation(
    PUT_BENEFICIARY_ADMISSION_STATE,
    {
      onCompleted: (datas) => {
        if (datas.updateBeneficiaryAdmissionState.done) {
          setNotifyAlert({
            isOpen: true,
            message: 'Changée avec succès',
            type: 'success',
          });
        } else {
          setNotifyAlert({
            isOpen: true,
            message: `Non changée ! ${datas.updateBeneficiaryAdmissionState.message}.`,
            type: 'error',
          });
        }
      },
      refetchQueries: [{ query: GET_BENEFICIARY_ADMISSIONS }],
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

  const onUpdateBeneficiaryAdmissionState = (id) => {
    setConfirmDialog({
      isOpen: true,
      title: 'ATTENTION',
      subTitle: 'Voulez vous vraiment changer ?',
      onConfirm: () => {
        setConfirmDialog({ isOpen: false });
        updateBeneficiaryAdmissionState({ variables: { id: id } });
      },
    });
  };

  return (
    <Grid container spacing={2}>
      <Grid item xs={12}>
        <Box sx={{ display: 'flex', justifyContent: 'flex-end', my: 3 }}>
          {!canManageActivity && <Link
            to="/online/ressources-humaines/admissions-beneficiaires/ajouter?type=REQUEST"
            className="no_style"
          >
            <Button variant="outlined" endIcon={<Add />}
            sx={{ mx: 3 }}>
              Demander une admission
            </Button>
          </Link>}
          {
          canManageActivity && <Link to="/online/ressources-humaines/admissions-beneficiaires/ajouter" className="no_style">
            <Button variant="contained" endIcon={<Add />}>
              Ajouter une admission
            </Button>
          </Link>}
        </Box>
      </Grid>
      <Grid item xs={12}>
        <BeneficiaryAdmissionFilter onFilterChange={handleFilterChange} />
      </Grid>
      <Grid item xs={12}>
        <TableListBeneficiaryAdmissions
          loading={loadingBeneficiaryAdmissions}
          rows={beneficiaryAdmissionsData?.beneficiaryAdmissions?.nodes || []}
          onDeleteBeneficiaryAdmission={onDeleteBeneficiaryAdmission}
          onFilterChange={(newFilter) => handleFilterChange({ ...beneficiaryAdmissionFilter, ...newFilter })}
          paginator={paginator}
        />
      </Grid>
      <Grid item xs={12}>
        <PaginationControlled
          totalItems={beneficiaryAdmissionsData?.beneficiaryAdmissions?.totalCount} // Nombre total d'éléments
          itemsPerPage={paginator.limit} // Nombre d'éléments par page
          currentPage={paginator.page}
          onChange={(page) => setPaginator({ ...paginator, page })}
        />
      </Grid>
    </Grid>
  );
}
