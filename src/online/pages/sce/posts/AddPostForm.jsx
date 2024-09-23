import * as React from 'react';
import { experimentalStyled as styled } from '@mui/material/styles';
import Grid from '@mui/material/Grid';
import { Stack, Box, Typography, Button, Divider, FormControl, InputLabel, Select, MenuItem } from '@mui/material';
import dayjs from 'dayjs';

import { Link, useNavigate } from 'react-router-dom';
import { useLazyQuery, useMutation, useQuery } from '@apollo/client';
import { useFormik } from 'formik';
import * as yup from 'yup';

import TheTextField from '../../../../_shared/components/form-fields/TheTextField';
import ImageFileField from '../../../../_shared/components/form-fields/ImageFileField';
import { useFeedBacks } from '../../../../_shared/context/feedbacks/FeedBacksProvider';
import { GET_POST } from '../../../../_shared/graphql/queries/PostQueries';
import {
  POST_POST,
  PUT_POST,
} from '../../../../_shared/graphql/mutations/PostMutations';
import ProgressService from '../../../../_shared/services/feedbacks/ProgressService';
import { GET_ESTABLISHMENTS } from '../../../../_shared/graphql/queries/EstablishmentQueries';
import TheAutocomplete from '../../../../_shared/components/form-fields/TheAutocomplete';
import { MSG_NOTIF_TYPES } from '../../../../_shared/tools/constants';
import TextEditorField from '../../../../_shared/components/form-fields/TextEditorField';

const Item = styled(Stack)(({ theme }) => ({
  backgroundColor: theme.palette.mode === 'dark' ? '#1A2027' : '#fff',
  ...theme.typography.body2,
  padding: theme.spacing(2),
  textAlign: 'center',
  color: theme.palette.text.secondary,
}));

export default function AddPostForm({ idPost, title }) {
  const { setNotifyAlert, setConfirmDialog } = useFeedBacks();
  const navigate = useNavigate();
  const validationSchema = yup.object({});
  const formik = useFormik({
    initialValues: {
      image: undefined,
      title: '',
      content: '',
    },
    validationSchema: validationSchema,
    onSubmit: (values) => {
      let {image, ...postCopy} = values;
      if (idPost && idPost != '') {
        onUpdatePost({
          id: postCopy.id,
          postData: postCopy,
          image: image,
        });
      } else
        createPost({
          variables: {
            postData: postCopy,
            image: image,
          },
        });
    },
  });
  
  const [createPost, { loading: loadingPost }] = useMutation(POST_POST, {
    onCompleted: (data) => {
      console.log(data);
      setNotifyAlert({
        isOpen: true,
        message: 'Ajouté avec succès',
        type: 'success',
      });
      let { __typename, ...postCopy } = data.createPost.post;
      //   formik.setValues(postCopy);
      navigate('/online/cse/articles/liste');
    },
    update(cache, { data: { createPost } }) {
      const newPost = createPost.post;

      cache.modify({
        fields: {
          posts(existingPosts = { totalCount: 0, nodes: [] }) {
            return {
              totalCount: existingPosts.totalCount + 1,
              nodes: [newPost, ...existingPosts.nodes],
            };
          },
        },
      });
    },
    onError: (err) => {
      console.log(err);
      setNotifyAlert({
        isOpen: true,
        message: 'Non ajouté ! Veuillez réessayer.',
        type: 'error',
      });
    },
  });
  const [updatePost, { loading: loadingPut }] = useMutation(PUT_POST, {
    onCompleted: (data) => {
      console.log(data);
      setNotifyAlert({
        isOpen: true,
        message: 'Modifié avec succès',
        type: 'success',
      });
      let { __typename, ...postCopy } = data.updatePost.post;
      //   formik.setValues(postCopy);
      navigate('/online/cse/articles/liste');
    },
    update(cache, { data: { updatePost } }) {
      const updatedPost = updatePost.post;

      cache.modify({
        fields: {
          posts(
            existingPosts = { totalCount: 0, nodes: [] },
            { readField },
          ) {
            const updatedPosts = existingPosts.nodes.map((post) =>
              readField('id', post) === updatedPost.id
                ? updatedPost
                : post,
            );

            return {
              totalCount: existingPosts.totalCount,
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
        message: 'Non modifié ! Veuillez réessayer.',
        type: 'error',
      });
    },
  });
  const onUpdatePost = (variables) => {
    setConfirmDialog({
      isOpen: true,
      title: 'ATTENTION',
      subTitle: 'Voulez vous vraiment modifier ?',
      onConfirm: () => {
        setConfirmDialog({ isOpen: false });
        updatePost({ variables });
      },
    });
  };
  const [getPost, { loading: loadingThePost }] = useLazyQuery(GET_POST, {
    fetchPolicy: 'network-only',
    onCompleted: (data) => {
      let { __typename, isRead, primaryColor, ...postCopy } = data.post;
      formik.setValues(postCopy);
    },
    onError: (err) => console.log(err),
  });

  React.useEffect(() => {
    if (idPost) {
      getPost({ variables: { id: idPost } });
    }
  }, [idPost]);
  return (
    <Box sx={{ flexGrow: 1 }}>
      <Typography component="div" variant="h5">
        {title} {formik.values.number}
      </Typography>
      {loadingThePost && <ProgressService type="form" />}
      {!loadingThePost && (
        <form onSubmit={formik.handleSubmit}>
          <Grid
            container
            spacing={{ xs: 2, md: 3 }}
            columns={{ xs: 4, sm: 8, md: 12 }}
          >
          <Grid item xs={12} sm={4} md={4}>
            <Item>
              <ImageFileField
                variant="outlined"
                label="Image"
                imageValue={formik.values.image}
                onChange={(imageFile) =>
                  formik.setFieldValue('image', imageFile)
                }
                disabled={loadingPost || loadingPut}
              />
            </Item>
          </Grid>
            <Grid item xs={12} sm={8} md={8}>
              <Item>
                <TheTextField
                  variant="outlined"
                  label="titre"
                  value={formik.values.title}
                  onChange={(e) => formik.setFieldValue('title', e.target.value)}
                  disabled={loadingPost || loadingPut}
                />
              </Item>
            </Grid>
            <Grid item xs={12} sm={12} md={12}>
              <Item>
                <TextEditorField
                  variant="outlined"
                  label="Détail"
                  placeholder="Contenu..."
                  multiline
                  rows={8}
                  value={formik.values.content}
                  onChange={(value) =>
                    formik.setFieldValue('content', value)
                  }
                  disabled={loadingPost || loadingPut}
                />
              </Item>
            </Grid>
            <Grid item xs={12} sm={12} md={12}>
              <Item sx={{ justifyContent: 'end', flexDirection: 'row' }}>
                <Link to="/online/cse/articles/liste" className="no_style">
                  <Button variant="outlined" sx={{ marginRight: '10px' }}>
                    Annuler
                  </Button>
                </Link>
                <Button
                  type="submit"
                  variant="contained"
                  disabled={!formik.isValid || loadingPost || loadingPut}
                >
                  Valider
                </Button>
              </Item>
            </Grid>
          </Grid>
        </form>
      )}
    </Box>
  );
}
