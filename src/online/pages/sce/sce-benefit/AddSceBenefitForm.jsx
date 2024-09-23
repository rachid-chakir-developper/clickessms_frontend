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
import { GET_SCE_BENEFIT } from '../../../../_shared/graphql/queries/SceBenefitQueries';
import {
  POST_SCE_BENEFIT,
  PUT_SCE_BENEFIT,
} from '../../../../_shared/graphql/mutations/SceBenefitMutations';
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

export default function AddSceBenefitForm({ idSceBenefit, title }) {
  const { setNotifyAlert, setConfirmDialog } = useFeedBacks();
  const navigate = useNavigate();
  const validationSchema = yup.object({});
  const formik = useFormik({
    initialValues: {
      title: '',
      content: '',
    },
    validationSchema: validationSchema,
    onSubmit: (values) => {
      let sceBenefitCopy = {...values};
      if (idSceBenefit && idSceBenefit != '') {
        onUpdateSceBenefit({
          id: sceBenefitCopy.id,
          sceBenefitData: sceBenefitCopy,
        });
      } else
        createSceBenefit({
          variables: {
            sceBenefitData: sceBenefitCopy,
          },
        });
    },
  });
  
  const [createSceBenefit, { loading: loadingPost }] = useMutation(POST_SCE_BENEFIT, {
    onCompleted: (data) => {
      console.log(data);
      setNotifyAlert({
        isOpen: true,
        message: 'Ajouté avec succès',
        type: 'success',
      });
      let { __typename, ...sceBenefitCopy } = data.createSceBenefit.sceBenefit;
      //   formik.setValues(sceBenefitCopy);
      navigate('/online/cse/avantages/liste');
    },
    update(cache, { data: { createSceBenefit } }) {
      const newSceBenefit = createSceBenefit.sceBenefit;

      cache.modify({
        fields: {
          sceBenefits(existingSceBenefits = { totalCount: 0, nodes: [] }) {
            return {
              totalCount: existingSceBenefits.totalCount + 1,
              nodes: [newSceBenefit, ...existingSceBenefits.nodes],
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
  const [updateSceBenefit, { loading: loadingPut }] = useMutation(PUT_SCE_BENEFIT, {
    onCompleted: (data) => {
      console.log(data);
      setNotifyAlert({
        isOpen: true,
        message: 'Modifié avec succès',
        type: 'success',
      });
      let { __typename, ...sceBenefitCopy } = data.updateSceBenefit.sceBenefit;
      //   formik.setValues(sceBenefitCopy);
      navigate('/online/cse/avantages/liste');
    },
    update(cache, { data: { updateSceBenefit } }) {
      const updatedSceBenefit = updateSceBenefit.sceBenefit;

      cache.modify({
        fields: {
          sceBenefits(
            existingSceBenefits = { totalCount: 0, nodes: [] },
            { readField },
          ) {
            const updatedSceBenefits = existingSceBenefits.nodes.map((sceBenefit) =>
              readField('id', sceBenefit) === updatedSceBenefit.id
                ? updatedSceBenefit
                : sceBenefit,
            );

            return {
              totalCount: existingSceBenefits.totalCount,
              nodes: updatedSceBenefits,
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
  const onUpdateSceBenefit = (variables) => {
    setConfirmDialog({
      isOpen: true,
      title: 'ATTENTION',
      subTitle: 'Voulez vous vraiment modifier ?',
      onConfirm: () => {
        setConfirmDialog({ isOpen: false });
        updateSceBenefit({ variables });
      },
    });
  };
  const [getSceBenefit, { loading: loadingSceBenefit }] = useLazyQuery(GET_SCE_BENEFIT, {
    fetchPolicy: 'network-only',
    onCompleted: (data) => {
      let { __typename, isRead, primaryColor, ...sceBenefitCopy } = data.sceBenefit;
      formik.setValues(sceBenefitCopy);
    },
    onError: (err) => console.log(err),
  });

  React.useEffect(() => {
    if (idSceBenefit) {
      getSceBenefit({ variables: { id: idSceBenefit } });
    }
  }, [idSceBenefit]);
  return (
    <Box sx={{ flexGrow: 1 }}>
      <Typography component="div" variant="h5">
        {title} {formik.values.number}
      </Typography>
      {loadingSceBenefit && <ProgressService type="form" />}
      {!loadingSceBenefit && (
        <form onSubmit={formik.handleSubmit}>
          <Grid
            container
            spacing={{ xs: 2, md: 3 }}
            columns={{ xs: 4, sm: 8, md: 12 }}
          >
            <Grid item xs={12} sm={12} md={12}>
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
                <Link to="/online/cse/avantages/liste" className="no_style">
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
