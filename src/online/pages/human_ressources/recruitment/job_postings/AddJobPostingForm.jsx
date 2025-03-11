import * as React from 'react';
import { experimentalStyled as styled } from '@mui/material/styles';
import Grid from '@mui/material/Grid';
import { Stack, Box, Typography, Button, InputAdornment, Divider, MenuItem, FormControl, InputLabel, Select, IconButton } from '@mui/material';
import dayjs from 'dayjs';

import { Link, useNavigate } from 'react-router-dom';
import { useLazyQuery, useMutation, useQuery } from '@apollo/client';
import { useFormik } from 'formik';
import * as yup from 'yup';

import TheTextField from '../../../../../_shared/components/form-fields/TheTextField';
import TheFileField from '../../../../../_shared/components/form-fields/TheFileField';
import { useFeedBacks } from '../../../../../_shared/context/feedbacks/FeedBacksProvider';
import { GET_JOB_POSTING } from '../../../../../_shared/graphql/queries/JobPostingQueries';
import {
  POST_JOB_POSTING,
  PUT_JOB_POSTING,
} from '../../../../../_shared/graphql/mutations/JobPostingMutations';
import ProgressService from '../../../../../_shared/services/feedbacks/ProgressService';
import TheAutocomplete from '../../../../../_shared/components/form-fields/TheAutocomplete';
import { GET_JOB_POSITIONS } from '../../../../../_shared/graphql/queries/JobPositionQueries';
import TheDesktopDatePicker from '../../../../../_shared/components/form-fields/TheDesktopDatePicker';
import RatingField from '../../../../../_shared/components/form-fields/RatingField';
import { GET_DATAS_JOB } from '../../../../../_shared/graphql/queries/DataQueries';
import TextEditorField from '../../../../../_shared/components/form-fields/TextEditorField';
import { Close } from '@mui/icons-material';

const Item = styled(Stack)(({ theme }) => ({
  backgroundColor: theme.palette.mode === 'dark' ? '#1A2027' : '#fff',
  ...theme.typography.body2,
  padding: theme.spacing(2),
  textAlign: 'center',
  color: theme.palette.text.secondary,
}));

export default function AddJobPostingForm({ idJobPosting, title }) {
  const { setNotifyAlert, setConfirmDialog } = useFeedBacks();
  const navigate = useNavigate();
  const validationSchema = yup.object({});
  const formik = useFormik({
    initialValues: {
      number: '',
      title: '',
      publicationDate:  null,
      expirationDate:  null,
      jobPosition: null,
      description: '',
      observation: '',
      jobPlatforms: []
    },
    validationSchema: validationSchema,
    onSubmit: (values) => {
      let jobPostingCopy = { ...values };
      jobPostingCopy.jobPosition = jobPostingCopy.jobPosition
        ? jobPostingCopy.jobPosition.id
        : null;
      if (!jobPostingCopy?.jobPlatforms) jobPostingCopy['jobPlatforms'] = [];
      let items = [];
      jobPostingCopy.jobPlatforms.forEach((item) => {
        let { __typename, ...itemCopy } = item;
        items.push(itemCopy);
      });
      jobPostingCopy.jobPlatforms = items;
      if (idJobPosting && idJobPosting != '') {
        onUpdateJobPosting({
          id: jobPostingCopy.id,
          jobPostingData: jobPostingCopy,
        });
      } else
        createJobPosting({
          variables: {
            jobPostingData: jobPostingCopy,
          },
        });
    },
  });
  const {
    loading: loadingJobPositions,
    data: jobPositionsData,
    error: jobPositionsError,
    fetchMore: fetchMoreJobPositions,
  } = useQuery(GET_JOB_POSITIONS, {
    fetchPolicy: 'network-only',
  });

  const [createJobPosting, { loading: loadingPost }] = useMutation(POST_JOB_POSTING, {
    onCompleted: (data) => {
      console.log(data);
      setNotifyAlert({
        isOpen: true,
        message: 'Ajouté avec succès',
        type: 'success',
      });
      let { __typename, ...jobPostingCopy } = data.createJobPosting.jobPosting;
      //   formik.setValues(jobPostingCopy);
      navigate('/online/ressources-humaines/recrutement/annonces/liste');
    },
    update(cache, { data: { createJobPosting } }) {
      const newJobPosting = createJobPosting.jobPosting;

      cache.modify({
        fields: {
          jobPostings(existingJobPostings = { totalCount: 0, nodes: [] }) {
            return {
              totalCount: existingJobPostings.totalCount + 1,
              nodes: [newJobPosting, ...existingJobPostings.nodes],
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
  const [updateJobPosting, { loading: loadingPut }] = useMutation(PUT_JOB_POSTING, {
    onCompleted: (data) => {
      console.log(data);
      setNotifyAlert({
        isOpen: true,
        message: 'Modifié avec succès',
        type: 'success',
      });
      let { __typename, ...jobPostingCopy } = data.updateJobPosting.jobPosting;
      //   formik.setValues(jobPostingCopy);
      navigate('/online/ressources-humaines/recrutement/annonces/liste');
    },
    update(cache, { data: { updateJobPosting } }) {
      const updatedJobPosting = updateJobPosting.jobPosting;

      cache.modify({
        fields: {
          jobPostings(
            existingJobPostings = { totalCount: 0, nodes: [] },
            { readField },
          ) {
            const updatedJobPostings = existingJobPostings.nodes.map((jobPosting) =>
              readField('id', jobPosting) === updatedJobPosting.id
                ? updatedJobPosting
                : jobPosting,
            );

            return {
              totalCount: existingJobPostings.totalCount,
              nodes: updatedJobPostings,
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
  const onUpdateJobPosting = (variables) => {
    setConfirmDialog({
      isOpen: true,
      title: 'ATTENTION',
      subTitle: 'Voulez vous vraiment modifier ?',
      onConfirm: () => {
        setConfirmDialog({ isOpen: false });
        updateJobPosting({ variables });
      },
    });
  };

   const {
      loading: loadingDatas,
      data: dataData,
      error: datsError,
      fetchMore: fetchMoreDatas,
    } = useQuery(GET_DATAS_JOB, { fetchPolicy: 'network-only' });

    const addJobPlatform = () => {
      formik.setValues({
        ...formik.values,
        jobPlatforms: [
          ...formik.values.jobPlatforms,
          { postLink: '',
            jobPlatform: null,
          },
        ],
      });
    };
    
    const removeJobPlatform = (index) => {
      const updatedJobPlatforms = [...formik.values.jobPlatforms];
      updatedJobPlatforms.splice(index, 1);
    
      formik.setValues({
        ...formik.values,
        jobPlatforms: updatedJobPlatforms,
      });
    };

  const [getJobPosting, { loading: loadingJobPosting }] = useLazyQuery(GET_JOB_POSTING, {
    fetchPolicy: 'network-only',
    onCompleted: (data) => {
      let { __typename, folder, employee, ...jobPostingCopy } =  data.jobPosting;
      jobPostingCopy.publicationDate = jobPostingCopy.publicationDate ? dayjs(jobPostingCopy.publicationDate) : null;
      jobPostingCopy.expirationDate = jobPostingCopy.expirationDate ? dayjs(jobPostingCopy.expirationDate) : null;
      if (!jobPostingCopy?.jobPlatforms) jobPostingCopy['jobPlatforms'] = [];
      let items = [];
      jobPostingCopy.jobPlatforms.forEach((item) => {
        let { __typename, ...itemCopy } = item;
        itemCopy.jobPlatform = itemCopy.jobPlatform
        ? Number(itemCopy.jobPlatform.id)
        : null;
        items.push(itemCopy);
      });
      jobPostingCopy.jobPlatforms = items;
      formik.setValues(jobPostingCopy);
    },
    onError: (err) => console.log(err),
  });

  React.useEffect(() => {
    if (idJobPosting) {
      getJobPosting({ variables: { id: idJobPosting } });
    }
  }, [idJobPosting]);
  return (
    <Box sx={{ flexGrow: 1 }}>
      <Typography component="div" variant="h5">
        {title}: <em><u>{formik.values.cardNumber}</u></em>
      </Typography>
      {loadingJobPosting && <ProgressService type="form" />}
      {!loadingJobPosting && (
        <form onSubmit={formik.handleSubmit}>
          <Grid container spacing={{ xs: 2, md: 3 }}>
            <Grid item xs={12} sm={6} md={3}>
              <Item>
                <TheAutocomplete
                  options={jobPositionsData?.jobPositions?.nodes}
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
            <Grid item xs={12} sm={6} md={3} >
              <Item>
                <TheDesktopDatePicker
                  label="Publiée le"
                  value={formik.values.publicationDate}
                  onChange={(date) =>
                    formik.setFieldValue('publicationDate', date)
                  }
                  disabled={loadingPost || loadingPut}
                />
              </Item>
            </Grid>
            <Grid item xs={12} sm={6} md={3} >
              <Item>
                <TheDesktopDatePicker
                  label="Expire le"
                  value={formik.values.expirationDate}
                  onChange={(date) =>
                    formik.setFieldValue('expirationDate', date)
                  }
                  disabled={loadingPost || loadingPut}
                />
              </Item>
            </Grid>
            <Grid item xs={12} sm={12} md={12}>
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
            <Grid item xs={12} sm={12} md={12}>
              <Item sx={{ minHeight: '400px', height: 'calc(100% - 190px);' }}>
                <TextEditorField
                  variant="outlined"
                  label="Description"
                  multiline
                  rows={8}
                  value={formik.values.description}
                  onChange={(value) =>
                    formik.setFieldValue('description', value)
                  }
                  disabled={loadingPost || loadingPut}
                />
              </Item>
            </Grid>
            <Grid item xs={12} sm={12} md={12}>
              <Divider variant="middle" />
            </Grid>
            <Grid item xs={12} sm={12} md={12}>
              <Grid
                container
                spacing={{ xs: 2, md: 3 }}
                columns={{ xs: 4, sm: 8, md: 12 }}
              >
                <Grid item xs={12} sm={12} md={12} >
                    {formik.values?.jobPlatforms?.map((item, index) => (
                      <Grid
                        container
                        spacing={{ xs: 2, md: 3 }}
                        columns={{ xs: 4, sm: 8, md: 12 }}
                        key={index}
                      >
                        
                        <Grid item xs={12} sm={4} md={4} >
                          <Item>
                            <FormControl fullWidth>
                              <InputLabel id="demo-simple-select-label">
                                Source
                              </InputLabel>
                              <Select
                                labelId="demo-simple-select-label"
                                id="jobPlatform"
                                label="Source"
                                value={item.jobPlatform}
                                onChange={(e) =>
                                  formik.setFieldValue(`jobPlatforms.${index}.jobPlatform`, e.target.value)
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
                        <Grid item xs={12} sm={8} md={8} >
                          <Item sx={{position: 'relative'}}>
                            <TheTextField
                              variant="outlined"
                              label="Lien"
                              value={item.postLink}
                              onChange={(e) => formik.setFieldValue(`jobPlatforms.${index}.postLink`, e.target.value)}
                              disabled={loadingPost || loadingPut}
                            />
                            <IconButton sx={{position: 'absolute', top: -3, right: -2}}
                              onClick={() => removeJobPlatform(index)}
                              edge="end"
                              color="error"
                            >
                              <Close />
                            </IconButton>
                          </Item>
                        </Grid>
                      </Grid>
                    ))}
                </Grid>
                <Grid
                  xs={12}
                  sm={12}
                  md={12}
                  item
                >
                  <Box sx={{ padding: 2, display: 'flex', justifyContent: 'flex-end', alignItems:'start' , borderStyle: 'dashed', borderWidth: 2, borderColor: '#f1f1f1', backgroundColor: '#fcfcfc'}}>
                    <Button
                      variant="outlined"
                      size="small"
                      onClick={addJobPlatform}
                      disabled={loadingPost || loadingPut}
                    >
                      Ajouter une plateforme
                    </Button>
                  </Box>
                </Grid>
              </Grid>
            </Grid>
            <Grid item xs={12} sm={12} md={12}>
              <Item sx={{ justifyContent: 'end', flexDirection: 'row' }}>
                <Link
                  to="/online/ressources-humaines/recrutement/annonces/liste"
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
