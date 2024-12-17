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
import { GET_PERSONALIZED_PROJECT } from '../../../../_shared/graphql/queries/PersonalizedProjectQueries';
import {
  POST_PERSONALIZED_PROJECT,
  PUT_PERSONALIZED_PROJECT,
} from '../../../../_shared/graphql/mutations/PersonalizedProjectMutations';
import ProgressService from '../../../../_shared/services/feedbacks/ProgressService';
import TheSwitch from '../../../../_shared/components/form-fields/theSwitch';
import dayjs from 'dayjs';
import TheDesktopDatePicker from '../../../../_shared/components/form-fields/TheDesktopDatePicker';
import { GET_BENEFICIARIES } from '../../../../_shared/graphql/queries/BeneficiaryQueries';
import { GET_EMPLOYEES } from '../../../../_shared/graphql/queries/EmployeeQueries';
import TheAutocomplete from '../../../../_shared/components/form-fields/TheAutocomplete';

const Item = styled(Stack)(({ theme }) => ({
  backgroundColor: theme.palette.mode === 'dark' ? '#1A2027' : '#fff',
  ...theme.typography.body2,
  padding: theme.spacing(2),
  textAlign: 'center',
  color: theme.palette.text.secondary,
}));

export default function AddPersonalizedProjectForm({ idPersonalizedProject, title }) {
  const { setNotifyAlert, setConfirmDialog } = useFeedBacks();
  const navigate = useNavigate();
  const validationSchema = yup.object({
    name: yup
      .string('Entrez le nom du projet personnalisé')
      .required('Le nom du projet personnalisé est obligatoire'),
  });
  const formik = useFormik({
    initialValues: {
      number: '',
      title: '',
      startingDateTime: dayjs(new Date()),
      endingDateTime: null,
      beneficiary: null,
      description: '',
      observation: '',
    },
    validationSchema: validationSchema,
    onSubmit: (values) => {
      let personalizedProjectCopy= {...values};
      personalizedProjectCopy.employee = personalizedProjectCopy.employee ? personalizedProjectCopy.employee.id : null;
      personalizedProjectCopy.beneficiary = personalizedProjectCopy.beneficiary ? personalizedProjectCopy.beneficiary.id : null;
      if (idPersonalizedProject && idPersonalizedProject != '') {
        onUpdatePersonalizedProject({
          id: personalizedProjectCopy.id,
          personalizedProjectData: personalizedProjectCopy,
        });
      } else
        createPersonalizedProject({
          variables: {
            personalizedProjectData: personalizedProjectCopy,
          },
        });
    },
  });
  const [createPersonalizedProject, { loading: loadingPost }] = useMutation(
    POST_PERSONALIZED_PROJECT,
    {
      onCompleted: (data) => {
        console.log(data);
        setNotifyAlert({
          isOpen: true,
          message: 'Ajouté avec succès',
          type: 'success',
        });
        let { __typename, ...personalizedProjectCopy } = data.createPersonalizedProject.personalizedProject;
        //   formik.setValues(personalizedProjectCopy);
        navigate('/online/activites/projets-personnalises/liste');
      },
      update(cache, { data: { createPersonalizedProject } }) {
        const newPersonalizedProject = createPersonalizedProject.personalizedProject;

        cache.modify({
          fields: {
            personalizedProjects(existingPersonalizedProjects = { totalCount: 0, nodes: [] }) {
              return {
                totalCount: existingPersonalizedProjects.totalCount + 1,
                nodes: [newPersonalizedProject, ...existingPersonalizedProjects.nodes],
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
  const [updatePersonalizedProject, { loading: loadingPut }] = useMutation(PUT_PERSONALIZED_PROJECT, {
    onCompleted: (data) => {
      console.log(data);
      setNotifyAlert({
        isOpen: true,
        message: 'Modifié avec succès',
        type: 'success',
      });
      let { __typename, ...personalizedProjectCopy } = data.updatePersonalizedProject.personalizedProject;
      //   formik.setValues(personalizedProjectCopy);
      navigate('/online/activites/projets-personnalises/liste');
    },
    update(cache, { data: { updatePersonalizedProject } }) {
      const updatedPersonalizedProject = updatePersonalizedProject.personalizedProject;

      cache.modify({
        fields: {
          personalizedProjects(
            existingPersonalizedProjects = { totalCount: 0, nodes: [] },
            { readField },
          ) {
            const updatedPersonalizedProjects = existingPersonalizedProjects.nodes.map((personalizedProject) =>
              readField('id', personalizedProject) === updatedPersonalizedProject.id
                ? updatedPersonalizedProject
                : personalizedProject,
            );

            return {
              totalCount: existingPersonalizedProjects.totalCount,
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
        message: 'Non modifié ! Veuillez réessayer.',
        type: 'error',
      });
    },
  });
  const onUpdatePersonalizedProject = (variables) => {
    setConfirmDialog({
      isOpen: true,
      title: 'ATTENTION',
      subTitle: 'Voulez vous vraiment modifier ?',
      onConfirm: () => {
        setConfirmDialog({ isOpen: false });
        updatePersonalizedProject({ variables });
      },
    });
  };

  
     const [getBeneficiaries, {
      loading: loadingBeneficiaries,
      data: beneficiariesData,
      error: beneficiariesError,
      fetchMore: fetchMoreBeneficiaries,
    }] = useLazyQuery(GET_BENEFICIARIES, { variables: { beneficiaryFilter : null, page: 1, limit: 10 } });
  
    const onGetBeneficiaries = (keyword)=>{
      getBeneficiaries({ variables: { beneficiaryFilter : keyword === '' ? null : {keyword}, page: 1, limit: 10 } })
    }
  const [getEmployees, {
      loading: loadingEmployees,
      data: employeesData,
      error: employeesError,
      fetchMore: fetchMoreEmployees,
    }] = useLazyQuery(GET_EMPLOYEES, { variables: { employeeFilter : null, page: 1, limit: 10 } });
    
    const onGetEmployees = (keyword)=>{
      getEmployees({ variables: { employeeFilter : keyword === '' ? null : {keyword}, page: 1, limit: 10 } })
    }

  const [getPersonalizedProject, { loading: loadingPersonalizedProject }] = useLazyQuery(
    GET_PERSONALIZED_PROJECT,
    {
      fetchPolicy: 'network-only',
      onCompleted: (data) => {
        let { __typename, folder, ...personalizedProjectCopy } = data.personalizedProject;
        personalizedProjectCopy.startingDateTime = personalizedProjectCopy.startingDateTime ? dayjs(personalizedProjectCopy.startingDateTime) : null;
        personalizedProjectCopy.endingDateTime = personalizedProjectCopy.endingDateTime ? dayjs(personalizedProjectCopy.endingDateTime) : null;
        formik.setValues(personalizedProjectCopy);
      },
      onError: (err) => console.log(err),
    },
  );
  React.useEffect(() => {
    if (idPersonalizedProject) {
      getPersonalizedProject({ variables: { id: idPersonalizedProject } });
    }
  }, [idPersonalizedProject]);
  return (
    <Box sx={{ flexGrow: 1 }}>
      <Typography component="div" variant="h5">
        {title}: <u><em>{formik.values.title}</em></u>
      </Typography>
      {loadingPersonalizedProject && <ProgressService type="form" />}
      {!loadingPersonalizedProject && (
        <form onSubmit={formik.handleSubmit}>
          <Grid
            container
            spacing={{ xs: 2, md: 3 }}
            columns={{ xs: 4, sm: 8, md: 12 }}
          >
            <Grid item xs={2} sm={4} md={3}>
              <Item>
                <TheTextField
                  variant="outlined"
                  label="Titre"
                  id="title"
                  value={formik.values.title}
                  required
                  onChange={(e) => formik.setFieldValue('title', e.target.value)}
                  onBlur={formik.handleBlur}
                  error={formik.touched.title && Boolean(formik.errors.title)}
                  helperText={formik.touched.title && formik.errors.title}
                  disabled={loadingPost || loadingPut}
                />
              </Item>
            </Grid>
            <Grid item xs={12} sm={6} md={3} >
              <Item>
                <TheDesktopDatePicker
                  label="Date de début"
                  value={formik.values.startingDateTime}
                  onChange={(date) =>
                    formik.setFieldValue('startingDateTime', date)
                  }
                  disabled={loadingPost || loadingPut}
                />
              </Item>
            </Grid>
            <Grid item xs={12} sm={6} md={3} >
              <Item>
                <TheDesktopDatePicker
                  label="Date de fin"
                  value={formik.values.endingDateTime}
                  onChange={(date) =>
                    formik.setFieldValue('endingDateTime', date)
                  }
                  disabled={loadingPost || loadingPut}
                />
              </Item>
            </Grid>
            <Grid item xs={2} sm={4} md={3} >
              <Item>
                <TheAutocomplete
                  options={beneficiariesData?.beneficiaries?.nodes}
                  onInput={(e) => {
                    onGetBeneficiaries(e.target.value)
                  }}
                  label="Personne accompagnée"
                  placeholder="Choisissez une personne accompagnée"
                  multiple={false}
                  value={formik.values.beneficiary}
                  onChange={(e, newValue) =>
                    formik.setFieldValue('beneficiary', newValue)
                  }
                />
              </Item>
            </Grid>
            <Grid item xs={12} sm={12} md={12}>
              <Divider variant="middle" />
            </Grid>
            <Grid item xs={12} sm={6} md={6}>
              <Item>
                <TheTextField
                  variant="outlined"
                  label="Description"
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
            <Grid item xs={12} sm={6} md={6}>
              <Item>
                <TheTextField
                  variant="outlined"
                  label="Observation"
                  multiline
                  rows={4}
                  value={formik.values.observation}
                  onChange={(e) =>
                    formik.setFieldValue('observation', e.target.value)
                  }
                  disabled={loadingPost || loadingPut}
                />
              </Item>
            </Grid>
            <Grid item xs={12} sm={12} md={12}>
              <Item sx={{ justifyContent: 'end', flexDirection: 'row' }}>
                <Link to="/online/activites/projets-personnalises/liste" className="no_style">
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
