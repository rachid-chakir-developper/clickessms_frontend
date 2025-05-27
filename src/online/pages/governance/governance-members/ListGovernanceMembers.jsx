import * as React from 'react';
import { experimentalStyled as styled } from '@mui/material/styles';
import Box from '@mui/material/Box';
import Grid from '@mui/material/Grid';
import { Alert, Button, Stack, ToggleButton, ToggleButtonGroup, Tooltip } from '@mui/material';
import GovernanceMemberItemCard from './GovernanceMemberItemCard';
import { useLazyQuery, useMutation } from '@apollo/client';
import { Add, AccountTree, List } from '@mui/icons-material';
import { Link } from 'react-router-dom';

import { useFeedBacks } from '../../../../_shared/context/feedbacks/FeedBacksProvider';
import {
  DELETE_GOVERNANCE_MEMBER,
  PUT_GOVERNANCE_MEMBER_STATE,
  PUT_GOVERNANCE_MEMBER_FIELDS,
} from '../../../../_shared/graphql/mutations/GovernanceMemberMutations';
import { GET_GOVERNANCE_MEMBERS, GET_GOVERNANCE_ORGANIZATION } from '../../../../_shared/graphql/queries/GovernanceMemberQueries';
import ProgressService from '../../../../_shared/services/feedbacks/ProgressService';
import GovernanceMemberFilter from './GovernanceMemberFilter';
import PaginationControlled from '../../../../_shared/components/helpers/PaginationControlled';
import { useAuthorizationSystem } from '../../../../_shared/context/AuthorizationSystemProvider';
import OrganizationChart from '../../../_shared/components/organizational-chart/OrganizationChart';

const Item = styled(Stack)(({ theme }) => ({
  backgroundColor: theme.palette.mode === 'dark' ? '#1A2027' : '#fff',
  ...theme.typography.body2,
  padding: theme.spacing(2),
  textAlign: 'center',
  color: theme.palette.text.secondary,
}));

export default function ListGovernanceMembers() {
  const authorizationSystem = useAuthorizationSystem();
  const canManageGovernance = authorizationSystem.requestAuthorization({
    type: 'manageGovernance',
  }).authorized;
  const [paginator, setPaginator] = React.useState({ page: 1, limit: 18 });
  const [governanceMemberFilter, setGovernanceMemberrFilter] = React.useState(null);
  const handleFilterChange = (newFilter) => {
    console.log('newFilter', newFilter);
    setGovernanceMemberrFilter(newFilter);
  };
  const { setNotifyAlert, setConfirmDialog } = useFeedBacks();
  const [
    getGovernanceMembers,
    {
      loading: loadingGovernanceMembers,
      data: governanceMembersData,
      error: governanceMembersError,
      fetchMore: fetchMoreGovernanceMembers,
    },
  ] = useLazyQuery(GET_GOVERNANCE_MEMBERS, {
    variables: { governanceMemberFilter, page: paginator.page, limit: paginator.limit },
  });

  const [
  getGovernanceOrganization,
  {
    loading: loadingGovernanceOrganization,
    data: governanceOrganizationData,
    error: governanceOrganizationError,
    fetchMore: fetchMoreGovernanceOrganization,
  },
] = useLazyQuery(GET_GOVERNANCE_ORGANIZATION, { fetchPolicy: 'network-only' });

  const [view, setView] = React.useState('table');

  const handleChange = (event, nextView) => {
    if(nextView) setView(nextView);
  };
  
  React.useEffect(() => {
    switch (view) {
      case 'organization':
        getGovernanceOrganization()
        break;
      case 'table':
        getGovernanceMembers()
        break;
    
      default:
        break;
    }
  }, [view]);

  React.useEffect(() => {
    getGovernanceMembers();
  }, [governanceMemberFilter, paginator]);

  const [deleteGovernanceMember, { loading: loadingDelete }] = useMutation(
    DELETE_GOVERNANCE_MEMBER,
    {
      onCompleted: (datas) => {
        if (datas.deleteGovernanceMember.deleted) {
          setNotifyAlert({
            isOpen: true,
            message: 'Supprimé avec succès',
            type: 'success',
          });
        } else {
          setNotifyAlert({
            isOpen: true,
            message: `Non Supprimé ! ${datas.deleteGovernanceMember.message}.`,
            type: 'error',
          });
        }
      },
      update(cache, { data: { deleteGovernanceMember } }) {
        console.log('Updating cache after deletion:', deleteGovernanceMember);

        const deletedGovernanceMemberId = deleteGovernanceMember.id;

        cache.modify({
          fields: {
            governanceMembers(
              existingGovernanceMembers = { totalCount: 0, nodes: [] },
              { readField },
            ) {
              const updatedGovernanceMembers = existingGovernanceMembers.nodes.filter(
                (governanceMember) => readField('id', governanceMember) !== deletedGovernanceMemberId,
              );

              console.log('Updated governanceMembers:', updatedGovernanceMembers);

              return {
                totalCount: existingGovernanceMembers.totalCount - 1,
                nodes: updatedGovernanceMembers,
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

  const onDeleteGovernanceMember = (id) => {
    setConfirmDialog({
      isOpen: true,
      title: 'ATTENTION',
      subTitle: 'Voulez vous vraiment supprimer ?',
      onConfirm: () => {
        setConfirmDialog({ isOpen: false });
        deleteGovernanceMember({ variables: { id: id } });
      },
    });
  };

  const [updateGovernanceMemberState, { loading: loadingPutState }] = useMutation(
    PUT_GOVERNANCE_MEMBER_STATE,
    {
      onCompleted: (datas) => {
        if (datas.updateGovernanceMemberState.done) {
          setNotifyAlert({
            isOpen: true,
            message: 'Changée avec succès',
            type: 'success',
          });
        } else {
          setNotifyAlert({
            isOpen: true,
            message: `Non changée ! ${datas.updateGovernanceMemberState.message}.`,
            type: 'error',
          });
        }
      },
      refetchQueries: [{ query: GET_GOVERNANCE_MEMBERS }],
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

  const onUpdateGovernanceMemberState = (id) => {
    setConfirmDialog({
      isOpen: true,
      title: 'ATTENTION',
      subTitle: 'Voulez vous vraiment changer ?',
      onConfirm: () => {
        setConfirmDialog({ isOpen: false });
        updateGovernanceMemberState({ variables: { id: id } });
      },
    });
  };

  const [updateGovernanceMemberFields, { loading: loadingPut }] = useMutation(PUT_GOVERNANCE_MEMBER_FIELDS, {
      update(cache, { data: { updateGovernanceMemberFields } }) {
        if(updateGovernanceMemberFields.success){
          const updatedGovernanceMember = updateGovernanceMemberFields.governanceMember;
          cache.modify({
            fields: {
              governanceMembers(
                existingGovernanceMembers = { totalCount: 0, nodes: [] },
                { readField, storeFieldName }
              ) {
                // Vérifie si l'action mise à jour existe déjà dans les nodes
                const taskExists = existingGovernanceMembers.nodes.some(
                  (governanceMember) => readField('id', governanceMember) === updatedGovernanceMember.id
                );
          
                // Filtrer et mettre à jour la liste existante
                let updatedGovernanceMembers = existingGovernanceMembers.nodes.filter((governanceMember) => {
                  const taskId = readField('id', governanceMember);
                  const isArchived = readField('isArchived', governanceMember);
          
                  // Vérifie si la tâche correspond à celle qui a été mise à jour
                  if (taskId === updatedGovernanceMember.id) {
                    // Si l'action est archivée, l'ajoute dans GOVERNANCE_MEMBER_ARCHIVED et la retire des autres
                    if (updatedGovernanceMember.isArchived) {
                      return storeFieldName.includes('GOVERNANCE_MEMBER_ARCHIVED');
                    } else {
                      // Si l'action n'est pas archivée, l'ajoute dans ALL et la retire de GOVERNANCE_MEMBER_ARCHIVED
                      return !storeFieldName.includes('GOVERNANCE_MEMBER_ARCHIVED');
                    }
                  }
                  // Si la tâche ne correspond pas à celle mise à jour, la garde dans la liste existante
                  return true;
                });
          
                // Si l'action mise à jour n'existe pas, l'ajouter à la liste appropriée
                if (!taskExists) {
                  // Vérifier où l'ajouter : dans GOVERNANCE_MEMBER_ARCHIVED ou ALL
                  if (
                    (updatedGovernanceMember.isArchived && storeFieldName.includes('GOVERNANCE_MEMBER_ARCHIVED')) ||
                    (!updatedGovernanceMember.isArchived && !storeFieldName.includes('GOVERNANCE_MEMBER_ARCHIVED'))
                  ) {
                    updatedGovernanceMembers = [updatedGovernanceMember, ...updatedGovernanceMembers];
                  }
                }
          
                // Mettre à jour le total et la liste des nœuds
                return {
                  ...existingGovernanceMembers,
                  totalCount: updatedGovernanceMembers.length,
                  nodes: updatedGovernanceMembers,
                };
              },
            },
          });
        }
      },
    });
  
    const onUpdateGovernanceMemberFields = (input={}) => {
      setConfirmDialog({
        isOpen: true,
        title: 'ATTENTION',
        subTitle: 'Voulez êtes sûr ?',
        onConfirm: () => {
          setConfirmDialog({ isOpen: false });
          updateGovernanceMemberFields(input);
        },
      });
    };

  return (
    <>
      <Stack justifyContent="flex-end">
        <ToggleButtonGroup
          size="small"
          value={view}
          exclusive
          onChange={handleChange}
          sx={{justifyContent:"flex-end"}}
        > 
          <Tooltip title="La liste" >
            <ToggleButton value="table" aria-label="list">
              <List />
            </ToggleButton>
          </Tooltip>
          <Tooltip title="L'organigramme" >
            <ToggleButton value="organization" aria-label="quilt">
              <AccountTree  />
            </ToggleButton>
          </Tooltip>
        </ToggleButtonGroup>
      </Stack>
      {view==='table' && <Grid container spacing={2}>
        {canManageGovernance && <Grid item xs={12}>
          <Box sx={{ display: 'flex', justifyContent: 'flex-end', my: 3 }}>
            <Link
              to="/online/gouvernance/membres/ajouter"
              className="no_style"
            >
              <Button variant="contained" endIcon={<Add />}>
                Ajouter un membre
              </Button>
            </Link>
          </Box>
        </Grid>}
        <Grid item xs={12}>
          <GovernanceMemberFilter onFilterChange={handleFilterChange} />
        </Grid>
        <Grid item xs={12}>
          <Box sx={{ flexGrow: 1, paddingY: 4 }}>
            <Grid
              container
              spacing={{ xs: 2, md: 3 }}
              columns={{ xs: 4, sm: 8, md: 12 }}
            >
              {loadingGovernanceMembers && (
                <Grid key={'pgrs'} item xs={12} sm={6} md={4}>
                  <ProgressService type="mediaCard" />
                </Grid>
              )}
              {governanceMembersData?.governanceMembers?.nodes?.length < 1 &&
                !loadingGovernanceMembers && (
                  <Alert severity="warning">Aucun membre trouvé.</Alert>
                )}
              {governanceMembersData?.governanceMembers?.nodes?.map((governanceMember, index) => (
                <Grid item xs={12} sm={6} md={4} key={index}>
                  <Item>
                    <GovernanceMemberItemCard
                      governanceMember={governanceMember}
                      onDeleteGovernanceMember={onDeleteGovernanceMember}
                      onUpdateGovernanceMemberState={onUpdateGovernanceMemberState}
                      onUpdateGovernanceMemberFields={onUpdateGovernanceMemberFields}
                    />
                  </Item>
                </Grid>
              ))}
            </Grid>
          </Box>
        </Grid>
        <Grid item xs={12}>
          <PaginationControlled
            totalItems={governanceMembersData?.governanceMembers?.totalCount} // Nombre total d'éléments
            itemsPerPage={paginator.limit} // Nombre d'éléments par page
            currentPage={paginator.page}
            onChange={(page) => setPaginator({ ...paginator, page })}
          />
        </Grid>
      </Grid>}
      {view==='organization' && <OrganizationChart
        loading={loadingGovernanceOrganization}
        error={governanceOrganizationError}
        organization={governanceOrganizationData?.governanceOrganization} 
       />}
    </>
  );
}
