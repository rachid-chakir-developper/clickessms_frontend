import * as React from 'react';
import { experimentalStyled as styled } from '@mui/material/styles';
import Box from '@mui/material/Box';
import Grid from '@mui/material/Grid';
import { Alert, Button, Stack } from '@mui/material';
import ContractTemplateItemCard from './ContractTemplateItemCard';
import { useLazyQuery, useMutation } from '@apollo/client';
import { Add } from '@mui/icons-material';
import { Link } from 'react-router-dom';

import { useFeedBacks } from '../../../../../../_shared/context/feedbacks/FeedBacksProvider';
import { useAuthorizationSystem } from '../../../../../../_shared/context/AuthorizationSystemProvider';
import {
  DELETE_CONTRACT_TEMPLATE,
  PUT_CONTRACT_TEMPLATE_STATE,
} from '../../../../../../_shared/graphql/mutations/ContractTemplateMutations';
import { GET_CONTRACT_TEMPLATES } from '../../../../../../_shared/graphql/queries/ContractTemplateQueries';
import ProgressService from '../../../../../../_shared/services/feedbacks/ProgressService';
import ContractTemplateFilter from './ContractTemplateFilter';
import PaginationControlled from '../../../../../../_shared/components/helpers/PaginationControlled';

const Item = styled(Stack)(({ theme }) => ({
  backgroundColor: theme.palette.mode === 'dark' ? '#1A2027' : '#fff',
  ...theme.typography.body2,
  padding: theme.spacing(2),
  textAlign: 'center',
  color: theme.palette.text.secondary,
}));

export default function ListContractTemplates() {
  const authorizationSystem = useAuthorizationSystem();
  const canManageSceModules = authorizationSystem.requestAuthorization({
    type: 'manageSceModules',
  }).authorized;
  const [paginator, setPaginator] = React.useState({ page: 1, limit: 10 });
  
  const [contractTemplateFilter, setContractTemplateFilter] = React.useState(null);
  const handleFilterChange = (newFilter) => {
    console.log('newFilter', newFilter);
    setContractTemplateFilter(newFilter);
  };

  const { setNotifyAlert, setConfirmDialog } = useFeedBacks();
  const [
    getContractTemplates,
    {
      loading: loadingContractTemplates,
      data: contractTemplatesData,
      error: contractTemplatesError,
      fetchMore: fetchMoreContractTemplates,
    },
  ] = useLazyQuery(GET_CONTRACT_TEMPLATES, {
    variables: { contractTemplateFilter, page: paginator.page, limit: paginator.limit },
  });

  React.useEffect(() => {
    getContractTemplates();
  }, [contractTemplateFilter, paginator]);
  const [deleteContractTemplate, { loading: loadingDelete }] = useMutation(
    DELETE_CONTRACT_TEMPLATE,
    {
      onCompleted: (datas) => {
        if (datas.deleteContractTemplate.deleted) {
          setNotifyAlert({
            isOpen: true,
            message: 'Supprimé avec succès',
            type: 'success',
          });
        } else {
          setNotifyAlert({
            isOpen: true,
            message: `Non Supprimé ! ${datas.deleteContractTemplate.message}.`,
            type: 'error',
          });
        }
      },
      update(cache, { data: { deleteContractTemplate } }) {
        console.log('Updating cache after deletion:', deleteContractTemplate);

        const deletedContractTemplateId = deleteContractTemplate.id;

        cache.modify({
          fields: {
            contractTemplates(
              existingContractTemplates = { totalCount: 0, nodes: [] },
              { readField },
            ) {
              const updatedContractTemplates = existingContractTemplates.nodes.filter(
                (contractTemplate) => readField('id', contractTemplate) !== deletedContractTemplateId,
              );

              console.log('Updated contractTemplates:', updatedContractTemplates);

              return {
                totalCount: existingContractTemplates.totalCount - 1,
                nodes: updatedContractTemplates,
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

  const onDeleteContractTemplate = (id) => {
    setConfirmDialog({
      isOpen: true,
      title: 'ATTENTION',
      subTitle: 'Voulez vous vraiment supprimer ?',
      onConfirm: () => {
        setConfirmDialog({ isOpen: false });
        deleteContractTemplate({ variables: { id: id } });
      },
    });
  };
  const [updateContractTemplateState, { loading: loadingPutState }] = useMutation(
    PUT_CONTRACT_TEMPLATE_STATE,
    {
      onCompleted: (datas) => {
        if (datas.updateContractTemplateState.done) {
          setNotifyAlert({
            isOpen: true,
            message: 'Changée avec succès',
            type: 'success',
          });
        } else {
          setNotifyAlert({
            isOpen: true,
            message: `Non changée ! ${datas.updateContractTemplateState.message}.`,
            type: 'error',
          });
        }
      },
      refetchQueries: [{ query: GET_CONTRACT_TEMPLATES }],
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

  const onUpdateContractTemplateState = (id) => {
    setConfirmDialog({
      isOpen: true,
      title: 'ATTENTION',
      subTitle: 'Voulez vous vraiment changer ?',
      onConfirm: () => {
        setConfirmDialog({ isOpen: false });
        updateContractTemplateState({ variables: { id: id } });
      },
    });
  };
  return (
    <Grid container spacing={2}>
      {canManageSceModules && <Grid item xs={12}>
        <Box sx={{ display: 'flex', justifyContent: 'flex-end', my: 3 }}>
          <Link to="/online/ressources-humaines/employes/contrats/templates/ajouter" className="no_style">
            <Button variant="contained" endIcon={<Add />}>
              Ajouter un model
            </Button>
          </Link>
        </Box>
      </Grid>}
      <Grid item xs={12}>
        <ContractTemplateFilter onFilterChange={handleFilterChange} />
      </Grid>
      <Grid item xs={12}>
        <Box sx={{ flexGrow: 1 }}>
          <Grid
            container
            spacing={{ xs: 2, md: 3 }}
          >
            {loadingContractTemplates && (
              <Grid key={'pgrs'} item xs={12} sm={6} md={4}>
                <ProgressService type="mediaCard" />
              </Grid>
            )}
            {contractTemplatesData?.contractTemplates?.nodes?.length < 1 && !loadingContractTemplates && (
              <Alert severity="warning">Aucun model trouvée.</Alert>
            )}
            {contractTemplatesData?.contractTemplates?.nodes?.map((contractTemplate, index) => (
              <Grid item xs={12} sm={6} md={4} key={index}>
                <Item>
                  <ContractTemplateItemCard
                    contractTemplate={contractTemplate}
                    onDeleteContractTemplate={onDeleteContractTemplate}
                    onUpdateContractTemplateState={onUpdateContractTemplateState}
                  />
                </Item>
              </Grid>
            ))}
          </Grid>
        </Box>
      </Grid>
      {/* <Grid item xs={12}>
        <TableListContractTemplates
          loading={loadingContractTemplates}
          rows={contractTemplatesData?.contractTemplates?.nodes || []}
          onDeleteContractTemplate={onDeleteContractTemplate}
          onUpdateContractTemplateState={onUpdateContractTemplateState}
        />
      </Grid> */}
      <Grid item xs={12}>
        <PaginationControlled
          totalItems={contractTemplatesData?.contractTemplates?.totalCount} // Nombre total d'éléments
          itemsPerPage={paginator.limit} // Nombre d'éléments par page
          currentPage={1}
          onChange={(page) => setPaginator({ ...paginator, page })}
        />
      </Grid>
    </Grid>
  );
}
