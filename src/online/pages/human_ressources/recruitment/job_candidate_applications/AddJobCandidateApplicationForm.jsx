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
import { GET_JOB_CANDIDATE_APPLICATION } from '../../../../../_shared/graphql/queries/JobCandidateApplicationQueries';
import {
  POST_JOB_CANDIDATE_APPLICATION,
  PUT_JOB_CANDIDATE_APPLICATION,
} from '../../../../../_shared/graphql/mutations/JobCandidateApplicationMutations';
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

export default function AddJobCandidateApplicationForm({ idJobCandidateApplication, title }) {
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
      jobPosition: null,
      description: '',
      observation: '',
      files: [],
    },
    validationSchema: validationSchema,
    onSubmit: (values) => {
      let { cv, coverLetter, files, ...jobCandidateApplicationCopy } = values;
      jobCandidateApplicationCopy.jobPosition = jobCandidateApplicationCopy.jobPosition
        ? jobCandidateApplicationCopy.jobPosition.id
        : null;
      if (idJobCandidateApplication && idJobCandidateApplication != '') {
        onUpdateJobCandidateApplication({
          id: jobCandidateApplicationCopy.id,
          jobCandidateApplicationData: jobCandidateApplicationCopy,
          cv: cv,
          coverLetter: coverLetter,
          files: files
        });
      } else
        createJobCandidateApplication({
          variables: {
            jobCandidateApplicationData: jobCandidateApplicationCopy,
            cv: cv,
            coverLetter: coverLetter,
            files: files,
          },
        });
    },
  });
  
  const [getJobPositions, {
      loading: loadingJobPositions,
      data: jobPositionsData,
      error: jobPositionsError,
      fetchMore: fetchMoreJobPositions,
    }] = useLazyQuery(GET_JOB_POSITIONS, { variables: { jobPositionFilter : null, page: 1, limit: 10 } });
    
    const onGetJobPositions = (keyword)=>{
      getJobPositions({ variables: { jobPositionFilter : keyword === '' ? null : {keyword}, page: 1, limit: 10 } })
    }

  const [createJobCandidateApplication, { loading: loadingPost }] = useMutation(POST_JOB_CANDIDATE_APPLICATION, {
    onCompleted: (data) => {
      console.log(data);
      setNotifyAlert({
        isOpen: true,
        message: 'Ajouté avec succès',
        type: 'success',
      });
      let { __typename, ...jobCandidateApplicationCopy } = data.createJobCandidateApplication.jobCandidateApplication;
      //   formik.setValues(jobCandidateApplicationCopy);
      navigate('/online/ressources-humaines/recrutement/vivier-candidats/liste');
    },
    update(cache, { data: { createJobCandidateApplication } }) {
      const newJobCandidateApplication = createJobCandidateApplication.jobCandidateApplication;

      cache.modify({
        fields: {
          jobCandidateApplications(existingJobCandidateApplications = { totalCount: 0, nodes: [] }) {
            return {
              totalCount: existingJobCandidateApplications.totalCount + 1,
              nodes: [newJobCandidateApplication, ...existingJobCandidateApplications.nodes],
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
  const [updateJobCandidateApplication, { loading: loadingPut }] = useMutation(PUT_JOB_CANDIDATE_APPLICATION, {
    onCompleted: (data) => {
      console.log(data);
      setNotifyAlert({
        isOpen: true,
        message: 'Modifié avec succès',
        type: 'success',
      });
      let { __typename, ...jobCandidateApplicationCopy } = data.updateJobCandidateApplication.jobCandidateApplication;
      //   formik.setValues(jobCandidateApplicationCopy);
      navigate('/online/ressources-humaines/recrutement/vivier-candidats/liste');
    },
    update(cache, { data: { updateJobCandidateApplication } }) {
      const updatedJobCandidateApplication = updateJobCandidateApplication.jobCandidateApplication;

      cache.modify({
        fields: {
          jobCandidateApplications(
            existingJobCandidateApplications = { totalCount: 0, nodes: [] },
            { readField },
          ) {
            const updatedJobCandidateApplications = existingJobCandidateApplications.nodes.map((jobCandidateApplication) =>
              readField('id', jobCandidateApplication) === updatedJobCandidateApplication.id
                ? updatedJobCandidateApplication
                : jobCandidateApplication,
            );

            return {
              totalCount: existingJobCandidateApplications.totalCount,
              nodes: updatedJobCandidateApplications,
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
  const onUpdateJobCandidateApplication = (variables) => {
    setConfirmDialog({
      isOpen: true,
      title: 'ATTENTION',
      subTitle: 'Voulez vous vraiment modifier ?',
      onConfirm: () => {
        setConfirmDialog({ isOpen: false });
        updateJobCandidateApplication({ variables });
      },
    });
  };

   const {
      loading: loadingDatas,
      data: dataData,
      error: datsError,
      fetchMore: fetchMoreDatas,
    } = useQuery(GET_DATAS_JOB, { fetchPolicy: 'network-only' });

  const [getJobCandidateApplication, { loading: loadingJobCandidateApplication }] = useLazyQuery(GET_JOB_CANDIDATE_APPLICATION, {
    fetchPolicy: 'network-only',
    onCompleted: (data) => {
      let { __typename, folder, employee, ...jobCandidateApplicationCopy } =  data.jobCandidateApplication;
      jobCandidateApplicationCopy.jobPlatform = jobCandidateApplicationCopy.jobPlatform ? Number(jobCandidateApplicationCopy.jobPlatform.id): null;
      jobCandidateApplicationCopy.availabilityDate = jobCandidateApplicationCopy.availabilityDate ? dayjs(jobCandidateApplicationCopy.availabilityDate) : null;
      formik.setValues(jobCandidateApplicationCopy);
    },
    onError: (err) => console.log(err),
  });

  React.useEffect(() => {
    if (idJobCandidateApplication) {
      getJobCandidateApplication({ variables: { id: idJobCandidateApplication } });
    }
  }, [idJobCandidateApplication]);
  return (
    <Box sx={{ flexGrow: 1 }}>
      <Typography component="div" variant="h5">
        {title}: <em><u>{formik.values.cardNumber}</u></em>
      </Typography>
      {loadingJobCandidateApplication && <ProgressService type="form" />}
      {!loadingJobCandidateApplication && (
        <form onSubmit={formik.handleSubmit}>
          <Grid container spacing={{ xs: 2, md: 3 }}>
            <Grid item xs={12} sm={6} md={3}>
              <Item>
                <TheAutocomplete
                  options={jobPositionsData?.jobPositions?.nodes}
                  onInput={(e) => {
                    onGetJobPositions(e.target.value)
                  }}
                  onFocus={(e) => {
                    onGetJobPositions(e.target.value)
                  }}
                  label="Fiche besoin"
                  placeholder="Choisissez une fiche ?"
                  multiple={false}
                  value={formik.values.jobPosition}
                  onChange={(e, newValue) =>
                    formik.setFieldValue('jobPosition', newValue)
                  }
                />
              </Item>
            </Grid>
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
