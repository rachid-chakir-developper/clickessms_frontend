import * as React from 'react';
import { experimentalStyled as styled } from '@mui/material/styles';
import Grid from '@mui/material/Grid';
import {
  Stack,
  Box,
  Typography,
  InputAdornment,
  Button,
  Divider,
} from '@mui/material';

import { Link, useNavigate } from 'react-router-dom';
import { useLazyQuery, useMutation } from '@apollo/client';
import { useFormik } from 'formik';
import * as yup from 'yup';

import TheTextField from '../../../../_shared/components/form-fields/TheTextField';
import ImageFileField from '../../../../_shared/components/form-fields/ImageFileField';
import { useFeedBacks } from '../../../../_shared/context/feedbacks/FeedBacksProvider';
import { GET_BOX_IDEA } from '../../../../_shared/graphql/queries/BoxIdeaQueries';
import {
  POST_BOX_IDEA,
  PUT_BOX_IDEA,
} from '../../../../_shared/graphql/mutations/BoxIdeaMutations';
import ProgressService from '../../../../_shared/services/feedbacks/ProgressService';
import TheSwitch from '../../../../_shared/components/form-fields/theSwitch';
import dayjs from 'dayjs';
import TheDesktopDatePicker from '../../../../_shared/components/form-fields/TheDesktopDatePicker';

const Item = styled(Stack)(({ theme }) => ({
  backgroundColor: theme.palette.mode === 'dark' ? '#1A2027' : '#fff',
  ...theme.typography.body2,
  padding: theme.spacing(2),
  textAlign: 'center',
  color: theme.palette.text.secondary,
}));

export default function AddBoxIdeaForm({ idBoxIdea, title }) {
  const { setNotifyAlert, setConfirmDialog } = useFeedBacks();
  const navigate = useNavigate();
  const validationSchema = yup.object({
    name: yup
      .string('Entrez le nom du idée')
      .required('Le nom du idée est obligatoire'),
  });
  const formik = useFormik({
    initialValues: {
      number: '',
      title: '',
      link: '',
      description: '',
      observation: '',
      isActive: true,
    },
    validationSchema: validationSchema,
    onSubmit: (values) => {
      let boxIdeaCopy= {...values};
      if (idBoxIdea && idBoxIdea != '') {
        onUpdateBoxIdea({
          id: boxIdeaCopy.id,
          boxIdeaData: boxIdeaCopy,
        });
      } else
        createBoxIdea({
          variables: {
            boxIdeaData: boxIdeaCopy,
          },
        });
    },
  });
  const [createBoxIdea, { loading: loadingPost }] = useMutation(
    POST_BOX_IDEA,
    {
      onCompleted: (data) => {
        console.log(data);
        setNotifyAlert({
          isOpen: true,
          message: 'Ajouté avec succès',
          type: 'success',
        });
        let { __typename, ...boxIdeaCopy } = data.createBoxIdea.boxIdea;
        //   formik.setValues(boxIdeaCopy);
        navigate('/online/qualites/boite-idees/liste');
      },
      update(cache, { data: { createBoxIdea } }) {
        const newBoxIdea = createBoxIdea.boxIdea;

        cache.modify({
          fields: {
            boxIdeas(existingBoxIdeas = { totalCount: 0, nodes: [] }) {
              return {
                totalCount: existingBoxIdeas.totalCount + 1,
                nodes: [newBoxIdea, ...existingBoxIdeas.nodes],
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
    },
  );
  const [updateBoxIdea, { loading: loadingPut }] = useMutation(PUT_BOX_IDEA, {
    onCompleted: (data) => {
      console.log(data);
      setNotifyAlert({
        isOpen: true,
        message: 'Modifié avec succès',
        type: 'success',
      });
      let { __typename, ...boxIdeaCopy } = data.updateBoxIdea.boxIdea;
      //   formik.setValues(boxIdeaCopy);
      navigate('/online/qualites/boite-idees/liste');
    },
    update(cache, { data: { updateBoxIdea } }) {
      const updatedBoxIdea = updateBoxIdea.boxIdea;

      cache.modify({
        fields: {
          boxIdeas(
            existingBoxIdeas = { totalCount: 0, nodes: [] },
            { readField },
          ) {
            const updatedBoxIdeas = existingBoxIdeas.nodes.map((boxIdea) =>
              readField('id', boxIdea) === updatedBoxIdea.id
                ? updatedBoxIdea
                : boxIdea,
            );

            return {
              totalCount: existingBoxIdeas.totalCount,
              nodes: updatedBoxIdeas,
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
  const onUpdateBoxIdea = (variables) => {
    setConfirmDialog({
      isOpen: true,
      title: 'ATTENTION',
      subTitle: 'Voulez vous vraiment modifier ?',
      onConfirm: () => {
        setConfirmDialog({ isOpen: false });
        updateBoxIdea({ variables });
      },
    });
  };
  const [getBoxIdea, { loading: loadingBoxIdea }] = useLazyQuery(
    GET_BOX_IDEA,
    {
      fetchPolicy: 'network-only',
      onCompleted: (data) => {
        let { __typename, folder, ...boxIdeaCopy } = data.boxIdea;
        formik.setValues(boxIdeaCopy);
      },
      onError: (err) => console.log(err),
    },
  );
  React.useEffect(() => {
    if (idBoxIdea) {
      getBoxIdea({ variables: { id: idBoxIdea } });
    }
  }, [idBoxIdea]);
  return (
    <Box sx={{ flexGrow: 1 }}>
      <Typography component="div" variant="h5">
        {title}: <u><em>{formik.values.label}</em></u>
      </Typography>
      {loadingBoxIdea && <ProgressService type="form" />}
      {!loadingBoxIdea && (
        <form onSubmit={formik.handleSubmit}>
          <Grid
            container
            spacing={{ xs: 2, md: 3 }}
            columns={{ xs: 4, sm: 8, md: 12 }}
          >
            <Grid item xs={2} sm={4} md={6}>
              <Item>
                <TheTextField
                  variant="outlined"
                  label="Libellé"
                  id="label"
                  value={formik.values.label}
                  required
                  onChange={(e) => formik.setFieldValue('label', e.target.value)}
                  onBlur={formik.handleBlur}
                  error={formik.touched.label && Boolean(formik.errors.label)}
                  helperText={formik.touched.label && formik.errors.label}
                  disabled={loadingPost || loadingPut}
                />
              </Item>
            </Grid>
            <Grid item xs={12} sm={12} md={6} >
              <Item>
                <TheTextField
                  variant="outlined"
                  label="Lien"
                  value={formik.values.link}
                  onChange={(e) =>
                    formik.setFieldValue('link', e.target.value)
                  }
                  disabled={loadingPost || loadingPut}
                />
              </Item>
            </Grid>
            <Grid item xs={12} sm={12} md={12}>
              <Divider variant="middle" />
            </Grid>
            <Grid item xs={12} sm={12} md={12}>
              <Item>
                <TheTextField
                  variant="outlined"
                  label="Détails"
                  multiline
                  rows={4}
                  value={formik.values.description}
                  onChange={(e) =>
                    formik.setFieldValue('description', e.target.value)
                  }
                  disabled={loadingPost || loadingPut}
                />
              </Item>
            </Grid>
            <Grid item xs={12} sm={12} md={12}>
              <Item sx={{ justifyContent: 'end', flexDirection: 'row' }}>
                <Link to="/online/qualites/boite-idees/liste" className="no_style">
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
