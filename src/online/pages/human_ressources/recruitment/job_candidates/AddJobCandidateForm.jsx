import * as React from 'react';
import { experimentalStyled as styled } from '@mui/material/styles';
import Grid from '@mui/material/Grid';
import { Stack, Box, Typography, Button, InputAdornment, Divider, MenuItem, FormControl, InputLabel, Select } from '@mui/material';
import dayjs from 'dayjs';

import { Link, useNavigate } from 'react-router-dom';
import { useLazyQuery, useMutation, useQuery } from '@apollo/client';
import { useFormik } from 'formik';
import * as yup from 'yup';

import TheTextField from '../../../../../_shared/components/form-fields/TheTextField';
import TheFileField from '../../../../../_shared/components/form-fields/TheFileField';
import { useFeedBacks } from '../../../../../_shared/context/feedbacks/FeedBacksProvider';
import { GET_JOB_CANDIDATE } from '../../../../../_shared/graphql/queries/JobCandidateQueries';
import {
  POST_JOB_CANDIDATE,
  PUT_JOB_CANDIDATE,
} from '../../../../../_shared/graphql/mutations/JobCandidateMutations';
import ProgressService from '../../../../../_shared/services/feedbacks/ProgressService';
import TheAutocomplete from '../../../../../_shared/components/form-fields/TheAutocomplete';
import { GET_JOB_POSITIONS } from '../../../../../_shared/graphql/queries/JobPositionQueries';
import TheDesktopDatePicker from '../../../../../_shared/components/form-fields/TheDesktopDatePicker';
import RatingField from '../../../../../_shared/components/form-fields/RatingField';
import { GET_DATAS_JOB } from '../../../../../_shared/graphql/queries/DataQueries';

const Item = styled(Stack)(({ theme }) => ({
  backgroundColor: theme.palette.mode === 'dark' ? '#1A2027' : '#fff',
  ...theme.typography.body2,
  padding: theme.spacing(2),
  textAlign: 'center',
  color: theme.palette.text.secondary,
}));

export default function AddJobCandidateForm({ idJobCandidate, title }) {
  const { setNotifyAlert, setConfirmDialog } = useFeedBacks();
  const navigate = useNavigate();
  const validationSchema = yup.object({});
  const formik = useFormik({
    initialValues: {
      cv: undefined,
      coverLetter: undefined,
      number: '',
      firstName: '',
      lastName: '',
      email: '',
      phone: '',
      jobTitle: '',
      jobPlatform: null,
      rating: 0,
      availabilityDate:  null,
      isActive: true,
      description: '',
      observation: '',
      files: [],
    },
    validationSchema: validationSchema,
    onSubmit: (values) => {
      let { cv, coverLetter, files, ...jobCandidateCopy } = values;
      if (idJobCandidate && idJobCandidate != '') {
        onUpdateJobCandidate({
          id: jobCandidateCopy.id,
          jobCandidateData: jobCandidateCopy,
          cv: cv,
          coverLetter: coverLetter,
          files: files
        });
      } else
        createJobCandidate({
          variables: {
            jobCandidateData: jobCandidateCopy,
            cv: cv,
            coverLetter: coverLetter,
            files: files,
          },
        });
    },
  });

  const [createJobCandidate, { loading: loadingPost }] = useMutation(POST_JOB_CANDIDATE, {
    onCompleted: (data) => {
      console.log(data);
      setNotifyAlert({
        isOpen: true,
        message: 'Ajouté avec succès',
        type: 'success',
      });
      let { __typename, ...jobCandidateCopy } = data.createJobCandidate.jobCandidate;
      //   formik.setValues(jobCandidateCopy);
      navigate('/online/ressources-humaines/recrutement/vivier-candidats/liste');
    },
    update(cache, { data: { createJobCandidate } }) {
      const newJobCandidate = createJobCandidate.jobCandidate;

      cache.modify({
        fields: {
          jobCandidates(existingJobCandidates = { totalCount: 0, nodes: [] }) {
            return {
              totalCount: existingJobCandidates.totalCount + 1,
              nodes: [newJobCandidate, ...existingJobCandidates.nodes],
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
  const [updateJobCandidate, { loading: loadingPut }] = useMutation(PUT_JOB_CANDIDATE, {
    onCompleted: (data) => {
      console.log(data);
      setNotifyAlert({
        isOpen: true,
        message: 'Modifié avec succès',
        type: 'success',
      });
      let { __typename, ...jobCandidateCopy } = data.updateJobCandidate.jobCandidate;
      //   formik.setValues(jobCandidateCopy);
      navigate('/online/ressources-humaines/recrutement/vivier-candidats/liste');
    },
    update(cache, { data: { updateJobCandidate } }) {
      const updatedJobCandidate = updateJobCandidate.jobCandidate;

      cache.modify({
        fields: {
          jobCandidates(
            existingJobCandidates = { totalCount: 0, nodes: [] },
            { readField },
          ) {
            const updatedJobCandidates = existingJobCandidates.nodes.map((jobCandidate) =>
              readField('id', jobCandidate) === updatedJobCandidate.id
                ? updatedJobCandidate
                : jobCandidate,
            );

            return {
              totalCount: existingJobCandidates.totalCount,
              nodes: updatedJobCandidates,
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
  const onUpdateJobCandidate = (variables) => {
    setConfirmDialog({
      isOpen: true,
      title: 'ATTENTION',
      subTitle: 'Voulez vous vraiment modifier ?',
      onConfirm: () => {
        setConfirmDialog({ isOpen: false });
        updateJobCandidate({ variables });
      },
    });
  };

   const {
      loading: loadingDatas,
      data: dataData,
      error: datsError,
      fetchMore: fetchMoreDatas,
    } = useQuery(GET_DATAS_JOB, { fetchPolicy: 'network-only' });

  const [getJobCandidate, { loading: loadingJobCandidate }] = useLazyQuery(GET_JOB_CANDIDATE, {
    fetchPolicy: 'network-only',
    onCompleted: (data) => {
      let { __typename, folder, employee, ...jobCandidateCopy } =  data.jobCandidate;
      jobCandidateCopy.jobPlatform = jobCandidateCopy.jobPlatform ? Number(jobCandidateCopy.jobPlatform.id): null;
      jobCandidateCopy.availabilityDate = jobCandidateCopy.availabilityDate ? dayjs(jobCandidateCopy.availabilityDate) : null;
      formik.setValues(jobCandidateCopy);
    },
    onError: (err) => console.log(err),
  });

  React.useEffect(() => {
    if (idJobCandidate) {
      getJobCandidate({ variables: { id: idJobCandidate } });
    }
  }, [idJobCandidate]);
  return (
    <Box sx={{ flexGrow: 1 }}>
      <Typography component="div" variant="h5">
        {title}: <em><u>{formik.values.cardNumber}</u></em>
      </Typography>
      {loadingJobCandidate && <ProgressService type="form" />}
      {!loadingJobCandidate && (
        <form onSubmit={formik.handleSubmit}>
          <Grid container spacing={{ xs: 2, md: 3 }}>
            <Grid item xs={12} sm={6} md={3}>
              <Item>
                <TheTextField
                  variant="outlined"
                  label="Prénom"
                  value={formik.values.firstName}
                  onChange={(e) => formik.setFieldValue('firstName', e.target.value)}
                  disabled={loadingPost || loadingPut}
                />
              </Item>
            </Grid>
            <Grid item xs={12} sm={6} md={3}>
              <Item>
                <TheTextField
                  variant="outlined"
                  label="Nom"
                  value={formik.values.lastName}
                  onChange={(e) => formik.setFieldValue('lastName', e.target.value)}
                  disabled={loadingPost || loadingPut}
                />
              </Item>
            </Grid>
            <Grid item xs={12} sm={6} md={3}>
              <Item>
                <TheTextField
                  variant="outlined"
                  label="Métier"
                  value={formik.values.jobTitle}
                  onChange={(e) => formik.setFieldValue('jobTitle', e.target.value)}
                  disabled={loadingPost || loadingPut}
                />
              </Item>
            </Grid>
            <Grid item xs={12} sm={6} md={3} >
              <Item>
                <TheTextField
                  variant="outlined"
                  label="E-mail"
                  value={formik.values.email}
                  onChange={(e) =>
                    formik.setFieldValue('email', e.target.value)
                  }
                  disabled={loadingPost || loadingPut}
                />
              </Item>
            </Grid>
            <Grid item xs={12} sm={6} md={3} >
              <Item>
                <TheTextField
                  variant="outlined"
                  label="Tél"
                  value={formik.values.phone}
                  onChange={(e) =>
                    formik.setFieldValue('phone', e.target.value)
                  }
                  disabled={loadingPost || loadingPut}
                />
              </Item>
            </Grid>
            <Grid item xs={12} sm={6} md={3} >
              <Item>
                <TheDesktopDatePicker
                  label="Disponible le"
                  value={formik.values.availabilityDate}
                  onChange={(date) =>
                    formik.setFieldValue('availabilityDate', date)
                  }
                  disabled={loadingPost || loadingPut}
                />
              </Item>
            </Grid>
            <Grid item xs={12} sm={6} md={3} >
              <Item>
                <FormControl fullWidth>
                  <InputLabel id="demo-simple-select-label">
                  Source
                  </InputLabel>
                  <Select
                    labelId="demo-simple-select-label"
                    id="jobPlatform"
                    label="Source"
                    value={formik.values.jobPlatform}
                    onChange={(e) =>
                      formik.setFieldValue('jobPlatform', e.target.value)
                    }
                    disabled={loadingPost || loadingPut}
                  >
                    <MenuItem value={null}>
                      <em>Choisissez une source</em>
                    </MenuItem>
                    {dataData?.jobPlatforms?.map((data, index) => {
                      return (
                        <MenuItem key={index} value={data.id}>
                          {data.name}
                        </MenuItem>
                      );
                    })}
                  </Select>
                </FormControl>
              </Item>
            </Grid>
            <Grid item xs={12} sm={6} md={4}>
              <Item>
                <RatingField
                  size="large"
                  variant="outlined"
                  label="Note"
                  value={formik.values.rating}
                  onChange={(e) => formik.setFieldValue('rating', e)}
                  disabled={loadingPost || loadingPut}
                />
              </Item>
            </Grid>
            <Grid item xs={12} sm={6} md={4}>
              <Item>
                <TheFileField
                  variant="outlined"
                  label="CV"
                  fileValue={formik.values.cv}
                  onChange={(cvFile) =>
                    formik.setFieldValue('cv', cvFile)
                  }
                  disabled={loadingPost || loadingPut}
                />
              </Item>
            </Grid>
            <Grid item xs={12} sm={6} md={4}>
              <Item>
                <TheFileField
                  variant="outlined"
                  label="Lettre de motivation"
                  fileValue={formik.values.coverLetter}
                  onChange={(coverLetterFile) =>
                    formik.setFieldValue('coverLetter', coverLetterFile)
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
                  label="Détail"
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
                  to="/online/ressources-humaines/recrutement/vivier-candidats/liste"
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
