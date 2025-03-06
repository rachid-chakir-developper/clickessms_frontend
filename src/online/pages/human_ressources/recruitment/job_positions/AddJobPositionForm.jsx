import * as React from 'react';
import { experimentalStyled as styled } from '@mui/material/styles';
import Grid from '@mui/material/Grid';
import { Stack, Box, Typography, Button, InputAdornment, Divider, FormControl, InputLabel, Select, MenuItem } from '@mui/material';
import dayjs from 'dayjs';

import { Link, useNavigate } from 'react-router-dom';
import { useLazyQuery, useMutation, useQuery } from '@apollo/client';
import { useFormik } from 'formik';
import * as yup from 'yup';

import TheTextField from '../../../../../_shared/components/form-fields/TheTextField';
import { useFeedBacks } from '../../../../../_shared/context/feedbacks/FeedBacksProvider';
import { GET_JOB_POSITION } from '../../../../../_shared/graphql/queries/JobPositionQueries';
import {
  POST_JOB_POSITION,
  PUT_JOB_POSITION,
} from '../../../../../_shared/graphql/mutations/JobPositionMutations';
import ProgressService from '../../../../../_shared/services/feedbacks/ProgressService';
import TheDesktopDatePicker from '../../../../../_shared/components/form-fields/TheDesktopDatePicker';
import ImageFileField from '../../../../../_shared/components/form-fields/ImageFileField';
import { CONTRACT_TYPES } from '../../../../../_shared/tools/constants';

const Item = styled(Stack)(({ theme }) => ({
  backgroundColor: theme.palette.mode === 'dark' ? '#1A2027' : '#fff',
  ...theme.typography.body2,
  padding: theme.spacing(2),
  textAlign: 'center',
  color: theme.palette.text.secondary,
}));

export default function AddJobPositionForm({ idJobPosition, title }) {
  const { setNotifyAlert, setConfirmDialog } = useFeedBacks();
  const navigate = useNavigate();
  const validationSchema = yup.object({});
  const formik = useFormik({
    initialValues: {
      number: '',
      title: '',
      sector: '',
      contractType: CONTRACT_TYPES.CDI,
      duration: '',
      description: '',
      observation: '',
    },
    validationSchema: validationSchema,
    onSubmit: (values) => {
      let jobPositionCopy = {...values};
      if (idJobPosition && idJobPosition != '') {
        onUpdateJobPosition({
          id: jobPositionCopy.id,
          jobPositionData: jobPositionCopy,
        });
      } else
        createJobPosition({
          variables: {
            jobPositionData: jobPositionCopy,
          },
        });
    },
  });


  const [createJobPosition, { loading: loadingPost }] = useMutation(POST_JOB_POSITION, {
    onCompleted: (data) => {
      console.log(data);
      setNotifyAlert({
        isOpen: true,
        message: 'Ajouté avec succès',
        type: 'success',
      });
      let { __typename, ...jobPositionCopy } = data.createJobPosition.jobPosition;
      //   formik.setValues(jobPositionCopy);
      navigate('/online/ressources-humaines/recrutement/fiches-besoin/liste');
    },
    update(cache, { data: { createJobPosition } }) {
      const newJobPosition = createJobPosition.jobPosition;

      cache.modify({
        fields: {
          jobPositions(existingJobPositions = { totalCount: 0, nodes: [] }) {
            return {
              totalCount: existingJobPositions.totalCount + 1,
              nodes: [newJobPosition, ...existingJobPositions.nodes],
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
  const [updateJobPosition, { loading: loadingPut }] = useMutation(PUT_JOB_POSITION, {
    onCompleted: (data) => {
      console.log(data);
      setNotifyAlert({
        isOpen: true,
        message: 'Modifié avec succès',
        type: 'success',
      });
      let { __typename, ...jobPositionCopy } = data.updateJobPosition.jobPosition;
      //   formik.setValues(jobPositionCopy);
      navigate('/online/ressources-humaines/recrutement/fiches-besoin/liste');
    },
    update(cache, { data: { updateJobPosition } }) {
      const updatedJobPosition = updateJobPosition.jobPosition;

      cache.modify({
        fields: {
          jobPositions(
            existingJobPositions = { totalCount: 0, nodes: [] },
            { readField },
          ) {
            const updatedJobPositions = existingJobPositions.nodes.map((jobPosition) =>
              readField('id', jobPosition) === updatedJobPosition.id
                ? updatedJobPosition
                : jobPosition,
            );

            return {
              totalCount: existingJobPositions.totalCount,
              nodes: updatedJobPositions,
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
  const onUpdateJobPosition = (variables) => {
    setConfirmDialog({
      isOpen: true,
      title: 'ATTENTION',
      subTitle: 'Voulez vous vraiment modifier ?',
      onConfirm: () => {
        setConfirmDialog({ isOpen: false });
        updateJobPosition({ variables });
      },
    });
  };
  const [getJobPosition, { loading: loadingJobPosition }] = useLazyQuery(GET_JOB_POSITION, {
    fetchPolicy: 'network-only',
    onCompleted: (data) => {
      let { __typename, folder, name, ...jobPositionCopy } =  data.jobPosition;
      jobPositionCopy.expirationDate = jobPositionCopy.expirationDate ? dayjs(jobPositionCopy.expirationDate) : null;
      formik.setValues(jobPositionCopy);
    },
    onError: (err) => console.log(err),
  });

  React.useEffect(() => {
    if (idJobPosition) {
      getJobPosition({ variables: { id: idJobPosition } });
    }
  }, [idJobPosition]);
  return (
    <Box sx={{ flexGrow: 1 }}>
      <Typography component="div" variant="h5">
        {title}: <em><u>{formik.values.cardNumber}</u></em>
      </Typography>
      {loadingJobPosition && <ProgressService type="form" />}
      {!loadingJobPosition && (
        <form onSubmit={formik.handleSubmit}>
          <Grid container spacing={{ xs: 2, md: 3 }}>
            <Grid item xs={12} sm={6} md={4}>
              <Item>
                <TheTextField
                  variant="outlined"
                  label="Titre"
                  value={formik.values.title}
                  onChange={(e) => formik.setFieldValue('title', e.target.value)}
                  disabled={loadingPost || loadingPut}
                />
              </Item>
            </Grid>
            <Grid item xs={12} sm={6} md={3}>
              <Item>
                <TheTextField
                  variant="outlined"
                  label="Secteur"
                  value={formik.values.sector}
                  onChange={(e) => formik.setFieldValue('sector', e.target.value)}
                  disabled={loadingPost || loadingPut}
                />
              </Item>
            </Grid>
            <Grid item xs={12} sm={6} md={2.5} >
              <Item>
                <FormControl fullWidth>
                  <InputLabel id="demo-simple-select-label">
                    Type de contrat
                  </InputLabel>
                  <Select
                    label="Type de contrat"
                    value={formik.values.contractType}
                    onChange={(e) =>
                      formik.setFieldValue('contractType', e.target.value)
                    }
                  >
                    <MenuItem value="">
                      <em>Choisissez un type</em>
                    </MenuItem>
                    {CONTRACT_TYPES?.ALL?.map((data, index) => {
                      return (
                        <MenuItem key={index} value={data.value}>
                          {data.label}
                        </MenuItem>
                      );
                    })}
                  </Select>
                </FormControl>
              </Item>
            </Grid>
            <Grid item xs={12} sm={6} md={2.5}>
              <Item>
                <TheTextField
                  variant="outlined"
                  label="Durée"
                  value={formik.values.duration}
                  onChange={(e) => formik.setFieldValue('duration', e.target.value)}
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
                  rows={8}
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
                <Link
                  to="/online/ressources-humaines/recrutement/fiches-besoin/liste"
                  className="no_style"
                >
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
