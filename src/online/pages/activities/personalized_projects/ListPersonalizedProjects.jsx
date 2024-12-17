import * as React from 'react';
import Grid from '@mui/material/Grid';
import { useLazyQuery, useMutation } from '@apollo/client';
import { useFeedBacks } from '../../../../_shared/context/feedbacks/FeedBacksProvider';
import { useAuthorizationSystem } from '../../../../_shared/context/AuthorizationSystemProvider';
import {
  DELETE_PERSONALIZED_PROJECT,
  PUT_PERSONALIZED_PROJECT_STATE,
} from '../../../../_shared/graphql/mutations/PersonalizedProjectMutations';
import { GET_PERSONALIZED_PROJECTS } from '../../../../_shared/graphql/queries/PersonalizedProjectQueries';
import PersonalizedProjectFilter from './PersonalizedProjectFilter';
import PaginationControlled from '../../../../_shared/components/helpers/PaginationControlled';
import TableListPersonalizedProjects from './TableListPersonalizedProjects';
import { Link } from 'react-router-dom';
import { Box, Button } from '@mui/material';
import { Add } from '@mui/icons-material';

export default function ListPersonalizedProjects() {
  const authorizationSystem = useAuthorizationSystem();
  const [paginator, setPaginator] = React.useState({ page: 1, limit: 20 });
  const [personalizedProjectFilter, setPersonalizedProjectFilter] = React.useState(null);
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
    variables: { personalizedProjectFilter, page: paginator.page, limit: paginator.limit },
  });

  React.useEffect(() => {
    getPersonalizedProjects();
  }, [personalizedProjectFilter, paginator]);

  const [deletePersonalizedProject, { loading: loadingDelete }] = useMutation(DELETE_PERSONALIZED_PROJECT, {
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
          message: `Non supprimé ! ${datas.deletePersonalizedProject.message}.`,
          type: 'error',
        });
      }
    },
    update(cache, { data: { deletePersonalizedProject } }) {
      console.log('Updating cache after deletion:', deletePersonalizedProject);

      const deletedPersonalizedProjectId = deletePersonalizedProject.id;

      cache.modify({
        fields: {
          personalizedProjects(existingPersonalizedProjects = { totalCount: 0, nodes: [] }, { readField }) {
            const updatedPersonalizedProjects = existingPersonalizedProjects.nodes.filter(
              (personalizedProject) => readField('id', personalizedProject) !== deletedPersonalizedProjectId,
            );

            console.log('Updated personalizedProjects:', updatedPersonalizedProjects);

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
        message: 'Non supprimé ! Veuillez réessayer.',
        type: 'error',
      });
    },
  });

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

  const [updatePersonalizedProjectState, { loading: loadingPutState }] = useMutation(
    PUT_PERSONALIZED_PROJECT_STATE,
    {
      onCompleted: (datas) => {
        if (datas.updatePersonalizedProjectState.done) {
          setNotifyAlert({
            isOpen: true,
            message: 'Changée avec succès',
            type: 'success',
          });
        } else {
          setNotifyAlert({
            isOpen: true,
            message: `Non changée ! ${datas.updatePersonalizedProjectState.message}.`,
            type: 'error',
          });
        }
      },
      refetchQueries: [{ query: GET_PERSONALIZED_PROJECTS }],
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

  const onUpdatePersonalizedProjectState = (id) => {
    setConfirmDialog({
      isOpen: true,
      title: 'ATTENTION',
      subTitle: 'Voulez vous vraiment changer ?',
      onConfirm: () => {
        setConfirmDialog({ isOpen: false });
        updatePersonalizedProjectState({ variables: { id: id } });
      },
    });
  };

  return (
    <Grid container spacing={2}>
      <Grid item xs={12}>
        <Box sx={{ display: 'flex', justifyContent: 'flex-end', my: 3 }}>
          <Link to="/online/activites/projets-personnalises/ajouter" className="no_style">
            <Button variant="contained" endIcon={<Add />}>
              Ajouter un projet personnalisé
            </Button>
          </Link>
        </Box>
      </Grid>
      <Grid item xs={12}>
        <PersonalizedProjectFilter onFilterChange={handleFilterChange} />
      </Grid>
      <Grid item xs={12}>
        <TableListPersonalizedProjects
          loading={loadingPersonalizedProjects}
          rows={personalizedProjectsData?.personalizedProjects?.nodes || []}
          onDeletePersonalizedProject={onDeletePersonalizedProject}
          onFilterChange={(newFilter) => handleFilterChange({ ...personalizedProjectFilter, ...newFilter })}
          paginator={paginator}
        />
      </Grid>
      <Grid item xs={12}>
        <PaginationControlled
          totalItems={personalizedProjectsData?.personalizedProjects?.totalCount} // Nombre total d'éléments
          itemsPerPage={paginator.limit} // Nombre d'éléments par page
          currentPage={1}
          onChange={(page) => setPaginator({ ...paginator, page })}
        />
      </Grid>
    </Grid>
  );
}
