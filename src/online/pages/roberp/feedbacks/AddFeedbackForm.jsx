import * as React from 'react';
import { experimentalStyled as styled } from '@mui/material/styles';
import Grid from '@mui/material/Grid';
import { Stack, Box, Typography, Button, Divider, FormControl, InputLabel, Select, MenuItem } from '@mui/material';

import { Link, useNavigate } from 'react-router-dom';
import { useLazyQuery, useMutation, useQuery } from '@apollo/client';
import { useFormik } from 'formik';
import * as yup from 'yup';

import TheTextField from '../../../../_shared/components/form-fields/TheTextField';
import ImageFileField from '../../../../_shared/components/form-fields/ImageFileField';
import { useFeedBacks } from '../../../../_shared/context/feedbacks/FeedBacksProvider';
import { GET_FEEDBACK } from '../../../../_shared/graphql/queries/FeedbackQueries';
import {
  POST_FEEDBACK,
  PUT_FEEDBACK,
} from '../../../../_shared/graphql/mutations/FeedbackMutations';
import ProgressService from '../../../../_shared/services/feedbacks/ProgressService';
import { FEEDBACK_MODULES } from '../../../../_shared/tools/constants';

const Item = styled(Stack)(({ theme }) => ({
  backgroundColor: theme.palette.mode === 'dark' ? '#1A2027' : '#fff',
  ...theme.typography.body2,
  padding: theme.spacing(2),
  textAlign: 'center',
  color: theme.palette.text.secondary,
}));

export default function AddFeedbackForm({ idFeedback, title }) {
  const { setNotifyAlert, setConfirmDialog } = useFeedBacks();
  const navigate = useNavigate();
  const validationSchema = yup.object({});
  const formik = useFormik({
    initialValues: {
      image: undefined,
      title: '',
      feedbackModule: FEEDBACK_MODULES.APP,
      message: '',
    },
    validationSchema: validationSchema,
    onSubmit: (values) => {
      let { image, ...feedbackCopy } = values;
      if (idFeedback && idFeedback != '') {
        onUpdateFeedback({
          id: feedbackCopy.id,
          feedbackData: feedbackCopy,
          image: image,
        });
      } else
        createFeedback({
          variables: {
            feedbackData: feedbackCopy,
            image: image,
          },
        });
    },
  });
  
  const [createFeedback, { loading: loadingPost }] = useMutation(POST_FEEDBACK, {
    onCompleted: (data) => {
      console.log(data);
      setNotifyAlert({
        isOpen: true,
        message: 'Ajouté avec succès',
        type: 'success',
      });
      let { __typename, ...feedbackCopy } = data.createFeedback.feedback;
      //   formik.setValues(feedbackCopy);
      navigate('/online/roberp/feedbacks/liste');
    },
    update(cache, { data: { createFeedback } }) {
      const newFeedback = createFeedback.feedback;

      cache.modify({
        fields: {
          feedbacks(existingFeedbacks = { totalCount: 0, nodes: [] }) {
            return {
              totalCount: existingFeedbacks.totalCount + 1,
              nodes: [newFeedback, ...existingFeedbacks.nodes],
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
  const [updateFeedback, { loading: loadingPut }] = useMutation(PUT_FEEDBACK, {
    onCompleted: (data) => {
      console.log(data);
      setNotifyAlert({
        isOpen: true,
        message: 'Modifié avec succès',
        type: 'success',
      });
      let { __typename, ...feedbackCopy } = data.updateFeedback.feedback;
      //   formik.setValues(feedbackCopy);
      navigate('/online/roberp/feedbacks/liste');
    },
    update(cache, { data: { updateFeedback } }) {
      const updatedFeedback = updateFeedback.feedback;

      cache.modify({
        fields: {
          feedbacks(
            existingFeedbacks = { totalCount: 0, nodes: [] },
            { readField },
          ) {
            const updatedFeedbacks = existingFeedbacks.nodes.map((feedback) =>
              readField('id', feedback) === updatedFeedback.id
                ? updatedFeedback
                : feedback,
            );

            return {
              totalCount: existingFeedbacks.totalCount,
              nodes: updatedFeedbacks,
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
  const onUpdateFeedback = (variables) => {
    setConfirmDialog({
      isOpen: true,
      title: 'ATTENTION',
      subTitle: 'Voulez vous vraiment modifier ?',
      onConfirm: () => {
        setConfirmDialog({ isOpen: false });
        updateFeedback({ variables });
      },
    });
  };
  const [getFeedback, { loading: loadingFeedback }] = useLazyQuery(GET_FEEDBACK, {
    fetchPolicy: 'network-only',
    onCompleted: (data) => {
      let { __typename,  createdAt, ...feedbackCopy } = data.feedback;
      formik.setValues(feedbackCopy);
    },
    onError: (err) => console.log(err),
  });


  React.useEffect(() => {
    if (idFeedback) {
      getFeedback({ variables: { id: idFeedback } });
    }
  }, [idFeedback]);
  return (
    <Box sx={{ flexGrow: 1 }}>
      <Typography component="div" variant="h5">
        {title} {formik.values.number}
      </Typography>
      {loadingFeedback && <ProgressService type="form" />}
      {!loadingFeedback && (
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
                  label="Capture d'écran"
                  imageValue={formik.values.image}
                  onChange={(imageFile) =>
                    formik.setFieldValue('image', imageFile)
                  }
                  disabled={loadingPost || loadingPut}
                />
              </Item>
            </Grid>
            <Grid item xs={12} sm={4} md={4}>
              <Item>
                <TheTextField
                  variant="outlined"
                  label="Objet"
                  value={formik.values.title}
                  onChange={(e) => formik.setFieldValue('title', e.target.value)}
                  disabled={loadingPost || loadingPut}
                />
              </Item>
            </Grid>
            <Grid item xs={12} sm={4} md={4}>
              <Item>
                <FormControl fullWidth>
                    <InputLabel>Module concerné</InputLabel>
                    <Select
                        value={formik.values.feedbackModule}
                        onChange={(e) => formik.setFieldValue('feedbackModule', e.target.value)}
                        disabled={loadingPost || loadingPut}
                    >
                    {FEEDBACK_MODULES?.ALL?.map((type, index) => {
                      return (
                        <MenuItem key={index} value={type.value}>
                          {type.label}
                        </MenuItem>
                      );
                    })}
                    </Select>
                </FormControl>
              </Item>
            </Grid>
            <Grid item xs={12} sm={12} md={12}>
              <Item>
                <TheTextField
                  variant="outlined"
                  label="Message"
                  multiline
                  rows={8}
                  value={formik.values.message}
                  onChange={(e) =>
                    formik.setFieldValue('message', e.target.value)
                  }
                  disabled={loadingPost || loadingPut}
                />
              </Item>
            </Grid>
            <Grid item xs={12} sm={12} md={12}>
              <Item sx={{ justifyContent: 'end', flexDirection: 'row' }}>
                <Link to="/online/roberp/feedbacks/liste" className="no_style">
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
