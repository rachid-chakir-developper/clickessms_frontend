import * as React from 'react';
import { experimentalStyled as styled } from '@mui/material/styles';
import Grid from '@mui/material/Grid';
import { Alert, Button, Stack } from '@mui/material';
import { useLazyQuery, useMutation } from '@apollo/client';
import { DELETE_PERSONALIZED_PROJECT } from '../../../../../_shared/graphql/mutations/PersonalizedProjectMutations';
import { GET_PERSONALIZED_PROJECTS } from '../../../../../_shared/graphql/queries/PersonalizedProjectQueries';
import { useFeedBacks } from '../../../../../_shared/context/feedbacks/FeedBacksProvider';
import TableListPersonalizedProjects from '../../../activities/personalized_projects/TableListPersonalizedProjects';
import PaginationControlled from '../../../../../_shared/components/helpers/PaginationControlled';

const Item = styled(Stack)(({ theme }) => ({
  backgroundColor: theme.palette.mode === 'dark' ? '#1A2027' : '#fff',
  ...theme.typography.body2,
  padding: theme.spacing(2),
  textAlign: 'center',
  color: theme.palette.text.secondary,
}));

export default function PersonalizedProjects({beneficiary}) {
  const [paginator, setPaginator] = React.useState({ page: 1, limit: 10 });
  const [personalizedProjectFilter, setPersonalizedProjectFilter] =
    React.useState({beneficiaries: [beneficiary?.id]});
  const handleFilterChange = (newFilter) => {
    console.log('newFilter', newFilter);
    setPersonalizedProjectFilter(newFilter);
  };

  const { setNotifyAlert, setConfirmDialog } = useFeedBacks();
  const [
    getPersonalizedProjects,
    {
      loading: loadingPersonalizedProjects,
      data: personalizedProjectsData,
      error: personalizedProjectsError,
      fetchMore: fetchMorePersonalizedProjects,
    },
  ] = useLazyQuery(GET_PERSONALIZED_PROJECTS, {
    variables: {
      personalizedProjectFilter,
      page: paginator.page,
      limit: paginator.limit,
    },
  });

  React.useEffect(() => {
    getPersonalizedProjects();
  }, [personalizedProjectFilter, paginator]);

  const [deletePersonalizedProject, { loading: loadingDelete }] = useMutation(
    DELETE_PERSONALIZED_PROJECT,
    {
      onCompleted: (datas) => {
        if (datas.deletePersonalizedProject.deleted) {
          setNotifyAlert({
            isOpen: true,
            message: 'Supprimé avec succès',
            type: 'success',
          });
        } else {
          setNotifyAlert({
            isOpen: true,
            message: `Non Supprimé ! ${datas.deletePersonalizedProject.message}.`,
            type: 'error',
          });
        }
      },
      update(cache, { data: { deletePersonalizedProject } }) {
        console.log('Updating cache after deletion:', deletePersonalizedProject);

        const deletedPersonalizedProjectId = deletePersonalizedProject.id;

        cache.modify({
          fields: {
            personalizedProjects(
              existingPersonalizedProjects = { totalCount: 0, nodes: [] },
              { readField },
            ) {
              const updatedPersonalizedProjects =
                existingPersonalizedProjects.nodes.filter(
                  (personalizedProject) =>
                    readField('id', personalizedProject) !==
                    deletedPersonalizedProjectId,
                );

              console.log(
                'Updated personalizedProjects:',
                updatedPersonalizedProjects,
              );

              return {
                totalCount: existingPersonalizedProjects.totalCount - 1,
                nodes: updatedPersonalizedProjects,
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

  const onDeletePersonalizedProject = (id) => {
    setConfirmDialog({
      isOpen: true,
      title: 'ATTENTION',
      subTitle: 'Voulez vous vraiment supprimer ?',
      onConfirm: () => {
        setConfirmDialog({ isOpen: false });
        deletePersonalizedProject({ variables: { id: id } });
      },
    });
  };

  return (
    <Grid container spacing={2}>
      <Grid item xs={12}>
        <TableListPersonalizedProjects
          loading={loadingPersonalizedProjects}
          rows={personalizedProjectsData?.personalizedProjects?.nodes || []}
          onDeletePersonalizedProject={onDeletePersonalizedProject}
        />
      </Grid>
      <Grid item xs={12}>
        <PaginationControlled
          totalItems={personalizedProjectsData?.personalizedProjects?.totalCount} // Nombre total d'éléments
          itemsPerPage={paginator.limit} // Nombre d'éléments par page
          currentPage={paginator.page}
          onChange={(page) => setPaginator({ ...paginator, page })}
        />
      </Grid>
    </Grid>
  );
}
