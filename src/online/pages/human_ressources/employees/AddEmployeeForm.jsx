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
import dayjs from 'dayjs';

import { Link, useNavigate } from 'react-router-dom';
import { useLazyQuery, useMutation, useQuery } from '@apollo/client';
import { useFormik } from 'formik';
import * as yup from 'yup';
import { ArrowBack } from '@mui/icons-material';

import TheTextField from '../../../../_shared/components/form-fields/TheTextField';
import ImageFileField from '../../../../_shared/components/form-fields/ImageFileField';
import TheDesktopDatePicker from '../../../../_shared/components/form-fields/TheDesktopDatePicker';
import { useFeedBacks } from '../../../../_shared/context/feedbacks/FeedBacksProvider';
import { GET_EMPLOYEE } from '../../../../_shared/graphql/queries/EmployeeQueries';
import {
  POST_EMPLOYEE,
  PUT_EMPLOYEE,
} from '../../../../_shared/graphql/mutations/EmployeeMutations';
import ProgressService from '../../../../_shared/services/feedbacks/ProgressService';
import { GET_ESTABLISHMENTS } from '../../../../_shared/graphql/queries/EstablishmentQueries';
import TheAutocomplete from '../../../../_shared/components/form-fields/TheAutocomplete';

const Item = styled(Stack)(({ theme }) => ({
  backgroundColor: theme.palette.mode === 'dark' ? '#1A2027' : '#fff',
  ...theme.typography.body2,
  padding: theme.spacing(2),
  textAlign: 'center',
  color: theme.palette.text.secondary,
}));

export default function AddEmployeeForm({ idEmployee, title }) {
  const { setNotifyAlert, setConfirmDialog } = useFeedBacks();
  const navigate = useNavigate();
  const validationSchema = yup.object({
    firstName: yup
      .string('Entrez votre prénom')
      .required('Le prénom est obligatoire'),
    lastName: yup.string('Entrez votre nom').required('Le nom est obligatoire'),
  });
  const formik = useFormik({
    initialValues: {
      photo: undefined,
      coverImage: undefined,
      signature: undefined,
      number: '',
      registrationNumber: '',
      firstName: '',
      lastName: '',
      preferredName: '',
      establishments: [],
      birthDate: null,
      birthPlace: '',
      nationality: '',
      hiringDate: null,
      probationEndDate: null,
      workEndDate: null,
      startingSalary: 0,
      position: '',
      latitude: '',
      longitude: '',
      city: '',
      zipCode: '',
      address: '',
      mobile: '',
      fix: '',
      fax: '',
      email: '',
      socialSecurityNumber : '',
      webSite: '',
      otherContacts: '',
      iban: '',
      bic: '',
      bankName: '',
      description: '',
      observation: '',
      isActive: true,
    },
    validationSchema: validationSchema,
    onSubmit: (values) => {
      let { photo, coverImage, signature, ...employeeCopy } = values;
      employeeCopy.establishments = employeeCopy.establishments.map((i) => i?.id);
      if (idEmployee && idEmployee != '') {
        onUpdateEmployee({
          id: employeeCopy.id,
          employeeData: employeeCopy,
          photo: photo,
          coverImage: coverImage,
          signature: signature
        });
      } else
        createEmployee({
          variables: {
            employeeData: employeeCopy,
            photo: photo,
            coverImage: coverImage,
            signature: signature,
          },
        });
    },
  });
  const [createEmployee, { loading: loadingPost }] = useMutation(
    POST_EMPLOYEE,
    {
      onCompleted: (data) => {
        console.log(data);
        setNotifyAlert({
          isOpen: true,
          message: 'Ajouté avec succès',
          type: 'success',
        });
        let { __typename, ...employeeCopy } = data.createEmployee.employee;
        //   formik.setValues(employeeCopy);
        navigate('/online/ressources-humaines/employes/liste');
      },
      update(cache, { data: { createEmployee } }) {
        const newEmployee = createEmployee.employee;

        cache.modify({
          fields: {
            employees(existingEmployees = { totalCount: 0, nodes: [] }) {
              return {
                totalCount: existingEmployees.totalCount + 1,
                nodes: [newEmployee, ...existingEmployees.nodes],
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
  const [updateEmployee, { loading: loadingPut }] = useMutation(PUT_EMPLOYEE, {
    onCompleted: (data) => {
      console.log(data);
      setNotifyAlert({
        isOpen: true,
        message: 'Modifié avec succès',
        type: 'success',
      });
      let { __typename, ...employeeCopy } = data.updateEmployee.employee;
      //   formik.setValues(employeeCopy);
      navigate('/online/ressources-humaines/employes/liste');
    },
    update(cache, { data: { updateEmployee } }) {
      const updatedEmployee = updateEmployee.employee;

      cache.modify({
        fields: {
          employees(
            existingEmployees = { totalCount: 0, nodes: [] },
            { readField },
          ) {
            const updatedEmployees = existingEmployees.nodes.map((employee) =>
              readField('id', employee) === updatedEmployee.id
                ? updatedEmployee
                : employee,
            );

            return {
              totalCount: existingEmployees.totalCount,
              nodes: updatedEmployees,
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
  const onUpdateEmployee = (variables) => {
    setConfirmDialog({
      isOpen: true,
      title: 'ATTENTION',
      subTitle: 'Voulez vous vraiment modifier ?',
      onConfirm: () => {
        setConfirmDialog({ isOpen: false });
        updateEmployee({ variables });
      },
    });
  };

    const {
      loading: loadingEstablishments,
      data: establishmentsData,
      error: establishmentsError,
      fetchMore: fetchMoreEstablishments,
    } = useQuery(GET_ESTABLISHMENTS, {
      fetchPolicy: 'network-only',
    });
  const [getEmployee, { loading: loadingEmployee }] = useLazyQuery(
    GET_EMPLOYEE,
    {
      fetchPolicy: 'network-only',
      onCompleted: (data) => {
        let { __typename, folder, currentContract, sceRoles, ...employeeCopy } = data.employee;
        employeeCopy.birthDate = employeeCopy.birthDate ? dayjs(employeeCopy.birthDate) : null;
        employeeCopy.hiringDate = employeeCopy.hiringDate ? dayjs(employeeCopy.hiringDate) : null;
        employeeCopy.probationEndDate = employeeCopy.probationEndDate ? dayjs(employeeCopy.probationEndDate) : null;
        employeeCopy.workEndDate = employeeCopy.workEndDate  ? dayjs(employeeCopy.workEndDate) : null;
        formik.setValues(employeeCopy);
      },
      onError: (err) => console.log(err),
    },
  );
  React.useEffect(() => {
    if (idEmployee) {
      getEmployee({ variables: { id: idEmployee } });
    }
  }, [idEmployee]);
  return (
    <Box sx={{ flexGrow: 1 }}>
      <Box sx={{ display: 'flex', justifyContent: 'space-between', my: 1 }}>
        <Link
          to="/online/ressources-humaines/employes/liste"
          className="no_style"
        >
          <Button variant="outlined" startIcon={<ArrowBack />}>
            Retour à la liste
          </Button>
        </Link>
      </Box>
      <Typography component="div" variant="h5">
        {title} {formik.values.firstName} {formik.values.lastName}
      </Typography>
      {loadingEmployee && <ProgressService type="form" />}
      {!loadingEmployee && (
        <form onSubmit={formik.handleSubmit}>
          <Grid
            container
            spacing={{ xs: 2, md: 3 }}
            columns={{ xs: 4, sm: 8, md: 12 }}
          >
            <Grid item xs={2} sm={4} md={4}>
              <Item>
                <ImageFileField
                  variant="outlined"
                  label="Photo"
                  imageValue={formik.values.photo}
                  onChange={(imageFile) =>
                    formik.setFieldValue('photo', imageFile)
                  }
                  disabled={loadingPost || loadingPut}
                />
              </Item>
              <Item>
                <TheTextField
                  variant="outlined"
                  label="Matricule"
                  value={formik.values.registrationNumber}
                  onChange={(e) =>
                    formik.setFieldValue('registrationNumber', e.target.value)
                  }
                  disabled={loadingPost || loadingPut}
                />
              </Item>
            </Grid>
            <Grid item xs={2} sm={4} md={4}>
              <Item>
                <TheTextField
                  variant="outlined"
                  label="Prénom"
                  id="firstName"
                  value={formik.values.firstName}
                  required
                  onChange={(e) =>
                    formik.setFieldValue('firstName', e.target.value)
                  }
                  onBlur={formik.handleBlur}
                  error={
                    formik.touched.firstName && Boolean(formik.errors.firstName)
                  }
                  helperText={
                    formik.touched.firstName && formik.errors.firstName
                  }
                  disabled={loadingPost || loadingPut}
                />
              </Item>
              <Item>
                <TheTextField
                  variant="outlined"
                  label="Nom de naissance"
                  id="lastName"
                  value={formik.values.lastName}
                  required
                  onChange={(e) =>
                    formik.setFieldValue('lastName', e.target.value)
                  }
                  onBlur={formik.handleBlur}
                  error={
                    formik.touched.lastName && Boolean(formik.errors.lastName)
                  }
                  helperText={formik.touched.lastName && formik.errors.lastName}
                  disabled={loadingPost || loadingPut}
                />
              </Item>
              <Item>
                <TheTextField
                  variant="outlined"
                  label="Nom d'usage"
                  id="preferredName"
                  value={formik.values.preferredName}
                  onChange={(e) =>
                    formik.setFieldValue('preferredName', e.target.value)
                  }
                />
              </Item>
              <Item>
                <TheAutocomplete
                  options={establishmentsData?.establishments?.nodes}
                  label="Structures concernées"
                  placeholder="Ajouter une structure"
                  limitTags={3}
                  value={formik.values.establishments}
                  onChange={(e, newValue) =>
                    formik.setFieldValue('establishments', newValue)
                  }
                />
              </Item>
            </Grid>
            <Grid item xs={2} sm={4} md={4}>
              <Item>
                <TheTextField
                  variant="outlined"
                  label="Numéro de sécurité sociale (N°SS)"
                  value={formik.values.socialSecurityNumber}
                  onChange={(e) =>
                    formik.setFieldValue('socialSecurityNumber', e.target.value)
                  }
                  disabled={loadingPost || loadingPut}
                />
              </Item>
              <Item>
                <TheDesktopDatePicker
                  label="Date de naissance"
                  value={formik.values.birthDate}
                  onChange={(date) => formik.setFieldValue('birthDate', date)}
                  disabled={loadingPost || loadingPut}
                />
              </Item>
              <Item>
                <TheTextField
                  variant="outlined"
                  label="Lieu de naissance"
                  value={formik.values.birthPlace}
                  onChange={(e) =>
                    formik.setFieldValue('birthPlace', e.target.value)
                  }
                  disabled={loadingPost || loadingPut}
                />
              </Item>
              <Item>
                <TheTextField
                  variant="outlined"
                  label="Nationalité"
                  value={formik.values.nationality}
                  onChange={(e) =>
                    formik.setFieldValue('nationality', e.target.value)
                  }
                  disabled={loadingPost || loadingPut}
                />
              </Item>
            </Grid>
            <Grid item xs={12} sm={12} md={12}>
              <Divider variant="middle" />
            </Grid>
            <Grid item xs={2} sm={4} md={4}>
              <Grid container columns={{ xs: 12, sm: 12, md: 12 }}>
                <Grid item xs={12} sm={12} md={12}>
                  <Item>
                    <TheTextField
                      variant="outlined"
                      label="Adresse (Ligne 1)"
                      multiline
                      rows={2}
                      value={formik.values.address}
                      onChange={(e) =>
                        formik.setFieldValue('address', e.target.value)
                      }
                      disabled={loadingPost || loadingPut}
                    />
                  </Item>
                </Grid>
                <Grid item xs={12} sm={12} md={12}>
                  <Item>
                    <TheTextField
                      variant="outlined"
                      label="Complément"
                      value={formik.values.additionalAddress}
                      onChange={(e) =>
                        formik.setFieldValue(
                          'additionalAddress',
                          e.target.value,
                        )
                      }
                      disabled={loadingPost || loadingPut}
                    />
                  </Item>
                </Grid>
                <Grid item xs={5} sm={5} md={5}>
                  <Item>
                    <TheTextField
                      variant="outlined"
                      label="Code postal"
                      value={formik.values.zipCode}
                      onChange={(e) =>
                        formik.setFieldValue('zipCode', e.target.value)
                      }
                      disabled={loadingPost || loadingPut}
                    />
                  </Item>
                </Grid>
                <Grid item xs={7} sm={7} md={7}>
                  <Item>
                    <TheTextField
                      variant="outlined"
                      label="Ville"
                      value={formik.values.city}
                      onChange={(e) =>
                        formik.setFieldValue('city', e.target.value)
                      }
                      disabled={loadingPost || loadingPut}
                    />
                  </Item>
                </Grid>
              </Grid>
            </Grid>
            <Grid item xs={2} sm={4} md={4}>
              <Item>
                <TheTextField
                  variant="outlined"
                  label="Mobile"
                  value={formik.values.mobile}
                  onChange={(e) =>
                    formik.setFieldValue('mobile', e.target.value)
                  }
                  disabled={loadingPost || loadingPut}
                />
              </Item>
              <Item>
                <TheTextField
                  variant="outlined"
                  label="Fixe"
                  value={formik.values.fix}
                  onChange={(e) => formik.setFieldValue('fix', e.target.value)}
                  disabled={loadingPost || loadingPut}
                />
              </Item>
              <Item>
                <TheTextField
                  variant="outlined"
                  label="Fax"
                  value={formik.values.fax}
                  onChange={(e) => formik.setFieldValue('fax', e.target.value)}
                  disabled={loadingPost || loadingPut}
                />
              </Item>
            </Grid>
            <Grid item xs={2} sm={4} md={4}>
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
              <Item>
                <TheTextField
                  variant="outlined"
                  label="Site web"
                  value={formik.values.webSite}
                  onChange={(e) =>
                    formik.setFieldValue('webSite', e.target.value)
                  }
                  disabled={loadingPost || loadingPut}
                />
              </Item>
              <Item>
                <TheTextField
                  variant="outlined"
                  label="Autres contacts"
                  value={formik.values.otherContacts}
                  onChange={(e) =>
                    formik.setFieldValue('otherContacts', e.target.value)
                  }
                  disabled={loadingPost || loadingPut}
                />
              </Item>
            </Grid>
            <Grid item xs={12} sm={12} md={12}>
              <Divider variant="middle" />
            </Grid>
            <Grid item xs={2} sm={4} md={4}>
              <Item>
                <TheTextField
                  variant="outlined"
                  label="IBAN (RIB)"
                  value={formik.values.iban}
                  onChange={(e) => formik.setFieldValue('iban', e.target.value)}
                  disabled={loadingPost || loadingPut}
                />
              </Item>
            </Grid>
            <Grid item xs={2} sm={4} md={4}>
              <Item>
                <TheTextField
                  variant="outlined"
                  label="BIC"
                  value={formik.values.bic}
                  onChange={(e) => formik.setFieldValue('bic', e.target.value)}
                  disabled={loadingPost || loadingPut}
                />
              </Item>
            </Grid>
            <Grid item xs={2} sm={4} md={4}>
              <Item>
                <TheTextField
                  variant="outlined"
                  label="Nom de la banque"
                  value={formik.values.bankName}
                  onChange={(e) =>
                    formik.setFieldValue('bankName', e.target.value)
                  }
                  disabled={loadingPost || loadingPut}
                />
              </Item>
            </Grid>
            <Grid item xs={2} sm={4} md={4}>
              <Item>
                <ImageFileField
                  variant="outlined"
                  label="Signature"
                  imageValue={formik.values.signature}
                  onChange={(imageFile) =>
                    formik.setFieldValue('signature', imageFile)
                  }
                  disabled={loadingPost || loadingPut}
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
                <Link
                  to="/online/ressources-humaines/employes/liste"
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
