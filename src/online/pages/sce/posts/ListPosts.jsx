import * as React from 'react';
import { experimentalStyled as styled } from '@mui/material/styles';
import Box from '@mui/material/Box';
import Grid from '@mui/material/Grid';
import { Alert, Button, Stack } from '@mui/material';
import PostItemCard from './PostItemCard';
import { useLazyQuery, useMutation } from '@apollo/client';
import { Add } from '@mui/icons-material';
import { Link } from 'react-router-dom';

import { useFeedBacks } from '../../../../_shared/context/feedbacks/FeedBacksProvider';
import {
  DELETE_POST,
  PUT_POST_STATE,
} from '../../../../_shared/graphql/mutations/PostMutations';
import { GET_POSTS } from '../../../../_shared/graphql/queries/PostQueries';
import ProgressService from '../../../../_shared/services/feedbacks/ProgressService';
import PostFilter from './PostFilter';
import PaginationControlled from '../../../../_shared/components/helpers/PaginationControlled';
import TableListPosts from './TableListPosts';

const Item = styled(Stack)(({ theme }) => ({
  backgroundColor: theme.palette.mode === 'dark' ? '#1A2027' : '#fff',
  ...theme.typography.body2,
  padding: theme.spacing(2),
  textAlign: 'center',
  color: theme.palette.text.secondary,
}));

export default function ListPosts() {
  const [paginator, setPaginator] = React.useState({ page: 1, limit: 10 });
  
  const [postFilter, setPostFilter] = React.useState(null);
  const handleFilterChange = (newFilter) => {
    console.log('newFilter', newFilter);
    setPostFilter(newFilter);
  };

  const { setNotifyAlert, setConfirmDialog } = useFeedBacks();
  const [
    getPosts,
    {
      loading: loadingPosts,
      data: postsData,
      error: postsError,
      fetchMore: fetchMorePosts,
    },
  ] = useLazyQuery(GET_POSTS, {
    variables: { postFilter, page: paginator.page, limit: paginator.limit },
  });

  React.useEffect(() => {
    getPosts();
  }, [postFilter, paginator]);
  const [deletePost, { loading: loadingDelete }] = useMutation(
    DELETE_POST,
    {
      onCompleted: (datas) => {
        if (datas.deletePost.deleted) {
          setNotifyAlert({
            isOpen: true,
            message: 'Supprimé avec succès',
            type: 'success',
          });
        } else {
          setNotifyAlert({
            isOpen: true,
            message: `Non Supprimé ! ${datas.deletePost.message}.`,
            type: 'error',
          });
        }
      },
      update(cache, { data: { deletePost } }) {
        console.log('Updating cache after deletion:', deletePost);

        const deletedPostId = deletePost.id;

        cache.modify({
          fields: {
            posts(
              existingPosts = { totalCount: 0, nodes: [] },
              { readField },
            ) {
              const updatedPosts = existingPosts.nodes.filter(
                (post) => readField('id', post) !== deletedPostId,
              );

              console.log('Updated posts:', updatedPosts);

              return {
                totalCount: existingPosts.totalCount - 1,
                nodes: updatedPosts,
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

  const onDeletePost = (id) => {
    setConfirmDialog({
      isOpen: true,
      title: 'ATTENTION',
      subTitle: 'Voulez vous vraiment supprimer ?',
      onConfirm: () => {
        setConfirmDialog({ isOpen: false });
        deletePost({ variables: { id: id } });
      },
    });
  };
  const [updatePostState, { loading: loadingPutState }] = useMutation(
    PUT_POST_STATE,
    {
      onCompleted: (datas) => {
        if (datas.updatePostState.done) {
          setNotifyAlert({
            isOpen: true,
            message: 'Changée avec succès',
            type: 'success',
          });
        } else {
          setNotifyAlert({
            isOpen: true,
            message: `Non changée ! ${datas.updatePostState.message}.`,
            type: 'error',
          });
        }
      },
      refetchQueries: [{ query: GET_POSTS }],
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

  const onUpdatePostState = (id) => {
    setConfirmDialog({
      isOpen: true,
      title: 'ATTENTION',
      subTitle: 'Voulez vous vraiment changer ?',
      onConfirm: () => {
        setConfirmDialog({ isOpen: false });
        updatePostState({ variables: { id: id } });
      },
    });
  };
  return (
    <Grid container spacing={2}>
      <Grid item xs={12}>
        <Box sx={{ display: 'flex', justifyContent: 'flex-end', my: 3 }}>
          <Link to="/online/cse/articles/ajouter" className="no_style">
            <Button variant="contained" endIcon={<Add />}>
              Ajouter un article
            </Button>
          </Link>
        </Box>
      </Grid>
      <Grid item xs={12}>
        <PostFilter onFilterChange={handleFilterChange} />
      </Grid>
      <Grid item xs={12}>
        <Box sx={{ flexGrow: 1 }}>
          <Grid
            container
            spacing={{ xs: 2, md: 3 }}
          >
            {loadingPosts && (
              <Grid key={'pgrs'} item xs={12} sm={6} md={4}>
                <ProgressService type="mediaCard" />
              </Grid>
            )}
            {postsData?.posts?.nodes?.length < 1 && !loadingPosts && (
              <Alert severity="warning">Aucun article trouvée.</Alert>
            )}
            {postsData?.posts?.nodes?.map((post, index) => (
              <Grid item xs={12} sm={6} md={4} key={index}>
                <Item>
                  <PostItemCard
                    post={post}
                    onDeletePost={onDeletePost}
                    onUpdatePostState={onUpdatePostState}
                  />
                </Item>
              </Grid>
            ))}
          </Grid>
        </Box>
      </Grid>
      {/* <Grid item xs={12}>
        <TableListPosts
          loading={loadingPosts}
          rows={postsData?.posts?.nodes || []}
          onDeletePost={onDeletePost}
          onUpdatePostState={onUpdatePostState}
        />
      </Grid> */}
      <Grid item xs={12}>
        <PaginationControlled
          totalItems={postsData?.posts?.totalCount} // Nombre total d'éléments
          itemsPerPage={paginator.limit} // Nombre d'éléments par page
          currentPage={1}
          onChange={(page) => setPaginator({ ...paginator, page })}
        />
      </Grid>
    </Grid>
  );
}
