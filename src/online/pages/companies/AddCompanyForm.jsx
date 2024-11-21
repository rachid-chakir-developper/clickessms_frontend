import * as React from 'react';
import { experimentalStyled as styled } from '@mui/material/styles';
import Grid from '@mui/material/Grid';
import { Stack, Box, Typography, Button, Divider, FormControl, InputLabel, OutlinedInput, InputAdornment, IconButton } from '@mui/material';

import { Link, useNavigate } from 'react-router-dom';
import { useLazyQuery, useMutation, useQuery } from '@apollo/client';
import { useFormik } from 'formik';
import * as yup from 'yup';

import TheTextField from '../../../_shared/components/form-fields/TheTextField';
import ImageFileField from '../../../_shared/components/form-fields/ImageFileField';
import { useFeedBacks } from '../../../_shared/context/feedbacks/FeedBacksProvider';
import {
  GET_COMPANY,
} from '../../../_shared/graphql/queries/CompanyQueries';
import {
  POST_COMPANY,
  PUT_COMPANY,
} from '../../../_shared/graphql/mutations/CompanyMutations';
import ProgressService from '../../../_shared/services/feedbacks/ProgressService';
import { Visibility, VisibilityOff } from '@mui/icons-material';

const Item = styled(Stack)(({ theme }) => ({
  backgroundColor: theme.palette.mode === 'dark' ? '#1A2027' : '#fff',
  ...theme.typography.body2,
  padding: theme.spacing(2),
  textAlign: 'center',
  color: theme.palette.text.secondary,
}));

export default function AddCompanyForm({ idCompany, title }) {
  const { setNotifyAlert, setConfirmDialog } = useFeedBacks();
  const navigate = useNavigate();
  const [showPassword, setShowPassword] = React.useState(true);

  const handleClickShowPassword = () => setShowPassword((show) => !show);

  const handleMouseDownPassword = (event) => {
    event.preventDefault();
  };

  const handleMouseUpPassword = (event) => {
    event.preventDefault();
  };
  const validationSchema = yup.object({
    name: yup
      .string('Entrez votre username')
      .required(`L'username est obligatoire`),
  });
  const formik = useFormik({
    initialValues: {
      id: null,
      logo: undefined,
      coverImage: undefined,
      name: '',
      email:'',
      description: '',
      companyAdmin: {
          firstName: '',
          lastName: '',
          email: '',
          password1: '',
          password2: '',
        }
    },
    validationSchema: validationSchema,
    onSubmit: (values) => {
      let { logo, ...companyFormCopy } = values;
      let { coverImage, ...companyCopy } = companyFormCopy;
      if (idCompany && idCompany != '') {
        onUpdateCompany({
          id: companyCopy.id,
          companyData: companyCopy,
          logo: logo,
          coverImage: coverImage,
        });
      } else
        createCompany({
          variables: {
            companyData: companyCopy,
            logo: logo,
            coverImage: coverImage,
          },
        });
    },
  });


  const [createCompany, { loading: loadingPost }] = useMutation(POST_COMPANY, {
    onCompleted: (data) => {
      console.log(data);
      setNotifyAlert({
        isOpen: true,
        message: 'Ajouté avec succès',
        type: 'success',
      });
      let { __typename, ...companyCopy } = data.createCompany.company;
      //   formik.setValues(companyCopy);
      navigate('/online/associations/liste');
    },
    update(cache, { data: { createCompany } }) {
      const newCompany = createCompany.company;

      cache.modify({
        fields: {
          companies(existingCompanies = { totalCount: 0, nodes: [] }) {
            return {
              totalCount: existingCompanies.totalCount + 1,
              nodes: [newCompany, ...existingCompanies.nodes],
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
  const [updateCompany, { loading: loadingPut }] = useMutation(PUT_COMPANY, {
    onCompleted: (data) => {
      console.log(data);
      setNotifyAlert({
        isOpen: true,
        message: 'Modifié avec succès',
        type: 'success',
      });
      let { __typename, ...companyCopy } = data.updateCompany.company;
      //   formik.setValues(companyCopy);
      navigate('/online/associations/liste');
    },
    update(cache, { data: { updateCompany } }) {
      const updatedCompany = updateCompany.company;

      cache.modify({
        fields: {
          companies(existingCompanies = { totalCount: 0, nodes: [] }, { readField }) {
            const updatedCompanies = existingCompanies.nodes.map((company) =>
              readField('id', company) === updatedCompany.id ? updatedCompany : company,
            );

            return {
              totalCount: existingCompanies.totalCount,
              nodes: updatedCompanies,
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
  const onUpdateCompany = (variables) => {
    setConfirmDialog({
      isOpen: true,
      title: 'ATTENTION',
      subTitle: 'Voulez vous vraiment modifier ?',
      onConfirm: () => {
        setConfirmDialog({ isOpen: false });
        updateCompany({ variables });
      },
    });
  };
  const [getCompany, { loading: loadingCompany }] = useLazyQuery(GET_COMPANY, {
    fetchPolicy: 'network-only',
    onCompleted: (data) => {
      let { __typename, companyMedia, ...companyCopy } = data.company;
      if (companyCopy.companyAdmin) {
          const { __typename, ...companyAdminCopy } = companyCopy.companyAdmin;
          companyCopy.companyAdmin = companyAdminCopy;
      }else{
        companyCopy.companyAdmin = {
          firstName: '',
          lastName: '',
          email: '',
          password1: '',
          password2: '',
        }
      }
      console.log(companyCopy)
      formik.setValues(companyCopy);
    },
    onError: (err) => console.log(err),
  });
  React.useEffect(() => {
    if (idCompany) {
      getCompany({ variables: { id: idCompany } });
    }
  }, [idCompany]);

  return (
    <Box sx={{ flexGrow: 1 }}>
      <Typography component="div" variant="h5">
        {title} {formik.values.number}
      </Typography>
      {loadingCompany && <ProgressService type="form" />}
      {!loadingCompany && (
        <form onSubmit={formik.handleSubmit}>
          <Grid
            container
            spacing={{ xs: 2, md: 3 }}
            columns={{ xs: 4, sm: 8, md: 12 }}
          >
            <Grid item xs={2} sm={4} md={4}>
              <Item>
                <TheTextField
                  variant="outlined"
                  label="Nom"
                  id="name"
                  value={formik.values.name}
                  required
                  onChange={(e) =>
                    formik.setFieldValue('name', e.target.value)
                  }
                  onBlur={formik.handleBlur}
                  error={
                    formik.touched.name && Boolean(formik.errors.name)
                  }
                  helperText={
                    formik.touched.name && formik.errors.name
                  }
                  disabled={loadingPost || loadingPut}
                />
              </Item>
              <Item>
                <TheTextField
                  variant="outlined"
                  label="E-mail"
                  value={formik.values?.email}
                  onChange={(e) =>
                    formik.setFieldValue('email', e.target.value)
                  }
                  disabled={loadingPost || loadingPut}
                  autoComplete="off"
                />
              </Item>
            </Grid>
            <Grid item xs={2} sm={4} md={4}>
              <Item>
                <ImageFileField
                  variant="outlined"
                  label="Logo"
                  imageValue={formik.values.logo}
                  onChange={(imageFile) =>
                    formik.setFieldValue('logo', imageFile)
                  }
                  disabled={loadingPost || loadingPut}
                />
              </Item>
            </Grid>
            <Grid item xs={2} sm={4} md={4}>
              <Item>
                <ImageFileField
                  variant="outlined"
                  label="Photo de couverture"
                  imageValue={formik.values.coverImage}
                  onChange={(imageFile) =>
                    formik.setFieldValue('coverImage', imageFile)
                  }
                  disabled={loadingPost || loadingPut}
                />
              </Item>
            </Grid>
            <Grid item xs={12} sm={12} md={12}>
              <Divider variant="middle" sx={{marginY: 2}}/>
              <Typography component="div" variant="h6" sx={{marginLeft: 2, fontSize: 16, fontStyle: 'italic'}}>
                Informations du responsable :
              </Typography>
            </Grid>
            <Grid item xs={2} sm={4} md={4}>
              <Item>
                <TheTextField
                  variant="outlined"
                  label="Prénom"
                  value={formik.values?.companyAdmin?.firstName}
                  onChange={(e) =>
                    formik.setFieldValue('companyAdmin.firstName', e.target.value)
                  }
                  disabled={loadingPost || loadingPut}
                />
              </Item>
            </Grid>
            <Grid item xs={2} sm={4} md={4}>
              <Item>
                <TheTextField
                  variant="outlined"
                  label="Nom"
                  value={formik.values?.companyAdmin?.lastName}
                  onChange={(e) =>
                    formik.setFieldValue('companyAdmin.lastName', e.target.value)
                  }
                  disabled={loadingPost || loadingPut}
                />
              </Item>
            </Grid>
            <Grid item xs={2} sm={4} md={4}>
              <Item>
                <TheTextField
                  variant="outlined"
                  label="E-mail"
                  value={formik.values?.companyAdmin?.email}
                  onChange={(e) =>
                    formik.setFieldValue('companyAdmin.email', e.target.value)
                  }
                  disabled={loadingPost || loadingPut}
                  autoComplete="off"
                />
              </Item>
            </Grid>
            <Grid item xs={2} sm={4} md={4}>
              <Item>
                <FormControl variant="outlined">
                  <InputLabel htmlFor="outlined-adornment-password1">Mot de passe</InputLabel>
                  <OutlinedInput
                    id="outlined-adornment-password1"
                    type={showPassword ? 'text' : 'password'}
                    value={formik.values.companyAdmin.password1}
                    onChange={(e) =>
                      formik.setFieldValue('companyAdmin.password1', e.target.value)
                    }
                    onBlur={formik.handleBlur}
                    endAdornment={
                      <InputAdornment position="end">
                        <IconButton
                          aria-label={showPassword ? 'Cacher' : 'Afficher'}
                          onClick={handleClickShowPassword}
                          onMouseDown={handleMouseDownPassword}
                          edge="end"
                        >
                          {showPassword ? <VisibilityOff /> : <Visibility />}
                        </IconButton>
                      </InputAdornment>
                    }
                    label="Mot de passe"
                    autoComplete="new-password"
                  />
                </FormControl>
              </Item>
            </Grid>
            <Grid item xs={2} sm={4} md={4}>
              <Item>
                <FormControl variant="outlined">
                  <InputLabel htmlFor="outlined-adornment-password2">Confirmer le mot de passe</InputLabel>
                  <OutlinedInput
                    id="outlined-adornment-password2"
                    type={showPassword ? 'text' : 'password'}
                    value={formik.values.companyAdmin.password2}
                    onChange={(e) =>
                      formik.setFieldValue('companyAdmin.password2', e.target.value)
                    }
                    onBlur={formik.handleBlur}
                    endAdornment={
                      <InputAdornment position="end">
                        <IconButton
                          aria-label={showPassword ? 'Cacher' : 'Afficher'}
                          onClick={handleClickShowPassword}
                          onMouseDown={handleMouseDownPassword}
                          edge="end"
                        >
                          {showPassword ? <VisibilityOff /> : <Visibility />}
                        </IconButton>
                      </InputAdornment>
                    }
                    label="Confirmer le mot de passe"
                    autoComplete="new-password"
                  />
                </FormControl>
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
              <Divider variant="middle" />
            </Grid>
            <Grid item xs={12} sm={12} md={12}>
              <Item sx={{ justifyContent: 'end', flexDirection: 'row' }}>
                <Link to="/online/associations/liste" className="no_style">
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
