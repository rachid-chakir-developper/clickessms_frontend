import * as React from 'react';
import { experimentalStyled as styled } from '@mui/material/styles';
import Box from '@mui/material/Box';
import Grid from '@mui/material/Grid';
import { Alert, Button, Stack } from '@mui/material';
import BeneficiaryItemCard from './BeneficiaryItemCard';
import { useLazyQuery, useMutation } from '@apollo/client';
import { Add, List } from '@mui/icons-material';
import { Link } from 'react-router-dom';

import { useFeedBacks } from '../../../../_shared/context/feedbacks/FeedBacksProvider';
import {
  DELETE_BENEFICIARY,
  PUT_BENEFICIARY_STATE,
} from '../../../../_shared/graphql/mutations/BeneficiaryMutations';
import { GET_BENEFICIARIES } from '../../../../_shared/graphql/queries/BeneficiaryQueries';
import ProgressService from '../../../../_shared/services/feedbacks/ProgressService';
import BeneficiaryFilter from './BeneficiaryFilter';
import PaginationControlled from '../../../../_shared/components/helpers/PaginationControlled';
import TableListBeneficiaries from './TableListBeneficiaries';
import { IMPORT_DATAS } from '../../../../_shared/graphql/mutations/DataMutations';
import TheFileField from '../../../../_shared/components/form-fields/TheFileField';

const Item = styled(Stack)(({ theme }) => ({
  backgroundColor: theme.palette.mode === 'dark' ? '#1A2027' : '#fff',
  ...theme.typography.body2,
  padding: theme.spacing(2),
  textAlign: 'center',
  color: theme.palette.text.secondary,
}));

export default function ListBeneficiaries() {
  const [paginator, setPaginator] = React.useState({ page: 1, limit: 20 });
  const [beneficiaryFilter, setBeneficiaryrFilter] = React.useState(null);
  const handleFilterChange = (newFilter) => {
    console.log('newFilter', newFilter);
    setBeneficiaryrFilter(newFilter);
  };
  const { setNotifyAlert, setConfirmDialog } = useFeedBacks();
  const [
    getBeneficiaries,
    {
      loading: loadingBeneficiaries,
      data: beneficiariesData,
      error: beneficiariesError,
      fetchMore: fetchMoreBeneficiaries,
    },
  ] = useLazyQuery(GET_BENEFICIARIES, {
    variables: {
      beneficiaryFilter,
      page: paginator.page,
      limit: paginator.limit,
    },
  });

  React.useEffect(() => {
    getBeneficiaries();
  }, [beneficiaryFilter, paginator]);

  const [deleteBeneficiary, { loading: loadingDelete }] = useMutation(
    DELETE_BENEFICIARY,
    {
      onCompleted: (datas) => {
        if (datas.deleteBeneficiary.deleted) {
          setNotifyAlert({
            isOpen: true,
            message: 'Supprimé avec succès',
            type: 'success',
          });
        } else {
          setNotifyAlert({
            isOpen: true,
            message: `Non Supprimé ! ${datas.deleteBeneficiary.message}.`,
            type: 'error',
          });
        }
      },
      update(cache, { data: { deleteBeneficiary } }) {
        console.log('Updating cache after deletion:', deleteBeneficiary);

        const deletedBeneficiaryId = deleteBeneficiary.id;

        cache.modify({
          fields: {
            beneficiaries(
              existingBeneficiaries = { totalCount: 0, nodes: [] },
              { readField },
            ) {
              const updatedBeneficiaries = existingBeneficiaries.nodes.filter(
                (beneficiary) =>
                  readField('id', beneficiary) !== deletedBeneficiaryId,
              );

              console.log('Updated beneficiaries:', updatedBeneficiaries);

              return {
                totalCount: existingBeneficiaries.totalCount - 1,
                nodes: updatedBeneficiaries,
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

  const onDeleteBeneficiary = (id) => {
    setConfirmDialog({
      isOpen: true,
      title: 'ATTENTION',
      subTitle: 'Voulez vous vraiment supprimer ?',
      onConfirm: () => {
        setConfirmDialog({ isOpen: false });
        deleteBeneficiary({ variables: { id: id } });
      },
    });
  };

  const [updateBeneficiaryState, { loading: loadingPutState }] = useMutation(
    PUT_BENEFICIARY_STATE,
    {
      onCompleted: (datas) => {
        if (datas.updateBeneficiaryState.done) {
          setNotifyAlert({
            isOpen: true,
            message: 'Changée avec succès',
            type: 'success',
          });
        } else {
          setNotifyAlert({
            isOpen: true,
            message: `Non changée ! ${datas.updateBeneficiaryState.message}.`,
            type: 'error',
          });
        }
      },
      refetchQueries: [{ query: GET_BENEFICIARIES }],
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

  const onUpdateBeneficiaryState = (id) => {
    setConfirmDialog({
      isOpen: true,
      title: 'ATTENTION',
      subTitle: 'Voulez vous vraiment changer ?',
      onConfirm: () => {
        setConfirmDialog({ isOpen: false });
        updateBeneficiaryState({ variables: { id: id } });
      },
    });
  };
  const [importData, { loading: loadingImport }] = useMutation(
    IMPORT_DATAS,
      {
        onCompleted: (datas) => {
          if (datas.importData.done) {
            setNotifyAlert({
              isOpen: true,
              message: 'Importé avec succès',
              type: 'success',
            });
          } else {
            setNotifyAlert({
              isOpen: true,
              message: `Non importé ! ${datas.importData.message}.`,
              type: 'error',
            });
          }
        },
        refetchQueries: [{ query: GET_BENEFICIARIES }],
        onError: (err) => {
          console.log(err);
          setNotifyAlert({
            isOpen: true,
            message: 'Non importé ! Veuillez réessayer.',
            type: 'error',
          });
        },
      },
    );
  const [file, setFile] = React.useState(null);

  return (
    <Grid container spacing={2}>
      <Grid item xs={12}>
        <Box sx={{ display: 'flex', justifyContent: 'flex-end', my: 3 }}>
          <Link
            to="/online/ressources-humaines/beneficiaires/ajouter"
            className="no_style"
          >
            <Button variant="contained" endIcon={<Add />}>
              Ajouter une personne accompagnée
            </Button>
          </Link>
        </Box>
      </Grid>
      <Grid item xs={12}>
        <BeneficiaryFilter onFilterChange={handleFilterChange} />
      </Grid>
      <Grid item xs={12}>
        <TableListBeneficiaries
          loading={loadingBeneficiaries}
          rows={beneficiariesData?.beneficiaries?.nodes || []}
          totalCount={beneficiariesData?.beneficiaries?.totalCount}
          onDeleteBeneficiary={onDeleteBeneficiary}
        />
      </Grid>
      <Grid item xs={12}>
        <PaginationControlled
          totalItems={beneficiariesData?.beneficiaries?.totalCount} // Nombre total d'éléments
          itemsPerPage={paginator.limit} // Nombre d'éléments par page
          currentPage={1}
          onChange={(page) => setPaginator({ ...paginator, page })}
        />
      </Grid>
    </Grid>
  );
}
