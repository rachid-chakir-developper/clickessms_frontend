import * as React from 'react';
import { experimentalStyled as styled } from '@mui/material/styles';
import Grid from '@mui/material/Grid';
import { Stack, Box, Typography, Button, Divider } from '@mui/material';

import { Link, useNavigate } from 'react-router-dom';
import { useLazyQuery, useMutation } from '@apollo/client';
import { useFormik } from 'formik';
import * as yup from 'yup';

import TheTextField from '../../../../_shared/components/form-fields/TheTextField';
import ImageFileField from '../../../../_shared/components/form-fields/ImageFileField';
import { useFeedBacks } from '../../../../_shared/context/feedbacks/FeedBacksProvider';
import { GET_MY_COMPANY } from '../../../../_shared/graphql/queries/CompanyQueries';
import { PUT_COMPANY } from '../../../../_shared/graphql/mutations/CompanyMutations';
import ProgressService from '../../../../_shared/services/feedbacks/ProgressService';

const Item = styled(Stack)(({ theme }) => ({
  backgroundColor: theme.palette.mode === 'dark' ? '#1A2027' : '#fff',
  ...theme.typography.body2,
  padding: theme.spacing(2),
  textAlign: 'center',
  color: theme.palette.text.secondary,
}));

export default function AddCompanyForm({ idCompany = null, title = '' }) {
  const { setNotifyAlert, setConfirmDialog } = useFeedBacks();
  const navigate = useNavigate();
  const validationSchema = yup.object({
    name: yup.string('Entrez la raison sociale').required('La raison sociale est obligatoire'),
  });
  const formik = useFormik({
    initialValues: {
      logo: undefined,
      coverImage: undefined,
      number: '',
      name: '',
      siret:'',
      finess:'',
      apeCode:'',
      approvalNumber:'',
      city: '',
      zipCode: '',
      address: '',
      additionalAddress: '',
      mobile: '',
      fix: '',
      fax: '',
      email: '',
      webSite: '',
      otherContacts: '',
      bankCode: '',
      branchCode: '',
      accountNumber: '',
      ribKey: '',
      iban: '',
      bic: '',
      bankName: '',
      isActive: true,
      description: '',
      observation: '',
    },
    validationSchema: validationSchema,
    onSubmit: (values) => {
      let { logo, ...companyFormCopy } = values;
      let { coverImage, ...companyCopy } = companyFormCopy;
      onUpdateCompany({
        id: companyCopy.id,
        companyData: companyCopy,
        logo: logo,
        coverImage: coverImage,
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
      navigate('/online/parametres/');
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
  const [getCompany, { loading: loadingCompany }] = useLazyQuery(GET_MY_COMPANY, {
    fetchPolicy: 'network-only',
    onCompleted: (data) => {
      let { __typename, companyMedia, hiddenModules, companyHiddenModules, ...companyCopy } = data.company;
      formik.setValues(companyCopy);
    },
    onError: (err) => console.log(err),
  });
  React.useEffect(() => {
    getCompany();
  }, []);
  return (
    <Box sx={{ flexGrow: 1 }}>
      <Typography component="div" variant="h5" sx={{ mb: 3 }}>
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
            <Grid item xs={12} sm={6} md={4}>
              <Item>
                <TheTextField
                  variant="outlined"
                  label="Raison sociale"
                  id="name"
                  value={formik.values.name}
                  required
                  onChange={(e) => formik.setFieldValue('name', e.target.value)}
                  onBlur={formik.handleBlur}
                  error={formik.touched.name && Boolean(formik.errors.name)}
                  helperText={formik.touched.name && formik.errors.name}
                  disabled={loadingPut}
                />
              </Item>
              <Item>
                <TheTextField
                  variant="outlined"
                  label="N° siret"
                  value={formik.values.siret}
                  onChange={(e) =>
                    formik.setFieldValue('siret', e.target.value)
                  }
                  disabled={loadingPut}
                />
              </Item>
            </Grid>
            <Grid item xs={12} sm={6} md={4}>
              <Item>
                <TheTextField
                  variant="outlined"
                  label="Code APE"
                  value={formik.values.apeCode}
                  onChange={(e) =>
                    formik.setFieldValue('apeCode', e.target.value)
                  }
                  disabled={loadingPut}
                />
              </Item>
              <Item>
                <TheTextField
                  variant="outlined"
                  label="Agrément N°"
                  value={formik.values.approvalNumber}
                  onChange={(e) =>
                    formik.setFieldValue('approvalNumber', e.target.value)
                  }
                  disabled={loadingPut}
                />
              </Item>
            </Grid>
            <Grid item xs={12} sm={6} md={4}>
              <Item>
                <ImageFileField
                  variant="outlined"
                  label="Logo"
                  imageValue={formik.values.logo}
                  onChange={(imageFile) =>
                    formik.setFieldValue('logo', imageFile)
                  }
                  disabled={loadingPut}
                />
              </Item>
            </Grid>
            <Grid item xs={12} sm={12} md={12}>
              <Divider variant="middle" />
            </Grid>
            <Grid item xs={12} sm={6} md={4}>
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
                      disabled={loadingPut}
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
                      disabled={loadingPut}
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
                      disabled={loadingPut}
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
                      disabled={loadingPut}
                    />
                  </Item>
                </Grid>
              </Grid>
            </Grid>
            <Grid item xs={12} sm={6} md={4}>
              <Item>
                <TheTextField
                  variant="outlined"
                  label="E-mail"
                  value={formik.values.email}
                  onChange={(e) =>
                    formik.setFieldValue('email', e.target.value)
                  }
                  disabled={loadingPut}
                />
              </Item>
              <Item>
                <TheTextField
                  variant="outlined"
                  label="Mobile"
                  value={formik.values.mobile}
                  onChange={(e) =>
                    formik.setFieldValue('mobile', e.target.value)
                  }
                  disabled={loadingPut}
                />
              </Item>
              <Item>
                <TheTextField
                  variant="outlined"
                  label="Fixe"
                  value={formik.values.fix}
                  onChange={(e) => formik.setFieldValue('fix', e.target.value)}
                  disabled={loadingPut}
                />
              </Item>
            </Grid>
            <Grid item xs={12} sm={6} md={4}>
              <Item>
                <TheTextField
                  variant="outlined"
                  label="Site web"
                  value={formik.values.webSite}
                  onChange={(e) =>
                    formik.setFieldValue('webSite', e.target.value)
                  }
                  disabled={loadingPut}
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
                  disabled={loadingPut}
                />
              </Item>
            </Grid>
            <Grid item xs={12} sm={12} md={12}>
              <Divider variant="middle" />
            </Grid>
            <Grid item xs={12} sm={6} md={2.5}>
              <Item>
                <TheTextField
                  variant="outlined"
                  label="Code banque"
                  value={formik.values.bankCode}
                  onChange={(e) => formik.setFieldValue('bankCode', e.target.value)}
                  disabled={loadingPut}
                />
              </Item>
            </Grid>
            <Grid item xs={12} sm={6} md={2.5}>
              <Item>
                <TheTextField
                  variant="outlined"
                  label="Code guichet"
                  value={formik.values.branchCode}
                  onChange={(e) => formik.setFieldValue('branchCode', e.target.value)}
                  disabled={loadingPut}
                />
              </Item>
            </Grid>
            <Grid item xs={12} sm={6} md={5}>
              <Item>
                <TheTextField
                  variant="outlined"
                  label="N° de compte"
                  value={formik.values.accountNumber}
                  onChange={(e) => formik.setFieldValue('accountNumber', e.target.value)}
                  disabled={loadingPut}
                />
              </Item>
            </Grid>
            <Grid item xs={12} sm={6} md={2}>
              <Item>
                <TheTextField
                  variant="outlined"
                  label="Clé RIB"
                  value={formik.values.ribKey}
                  onChange={(e) => formik.setFieldValue('ribKey', e.target.value)}
                  disabled={loadingPut}
                />
              </Item>
            </Grid>
            <Grid item xs={12} sm={6} md={4}>
              <Item>
                <TheTextField
                  variant="outlined"
                  label="IBAN (RIB)"
                  value={formik.values.iban}
                  onChange={(e) => formik.setFieldValue('iban', e.target.value)}
                  helperText={`
                    ${(
                      (formik.values.bankCode && formik.values.bankCode !='') ||
                      (formik.values.branchCode && formik.values.branchCode !='') ||
                      (formik.values.accountNumber && formik.values.accountNumber !='') ||
                      (formik.values.ribKey && formik.values.ribKey !='')) ? 'RIB: ' : ''}
                    ${formik.values.bankCode || ''} ${formik.values.branchCode || ''} ${formik.values.accountNumber || ''} ${formik.values.ribKey || ''}
                    `}
                  disabled={loadingPut}
                />
              </Item>
            </Grid>
            <Grid item xs={12} sm={6} md={4}>
              <Item>
                <TheTextField
                  variant="outlined"
                  label="BIC / SWIFT"
                  value={formik.values.bic}
                  onChange={(e) => formik.setFieldValue('bic', e.target.value)}
                  disabled={loadingPut}
                />
              </Item>
            </Grid>
            <Grid item xs={12} sm={6} md={4}>
              <Item>
                <TheTextField
                  variant="outlined"
                  label="Nom de la banque"
                  value={formik.values.bankName}
                  onChange={(e) =>
                    formik.setFieldValue('bankName', e.target.value)
                  }
                  disabled={loadingPut}
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
                  disabled={loadingPut}
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
                  disabled={loadingPut}
                />
              </Item>
            </Grid>
            <Grid item xs={12} sm={12} md={12}>
              <Item sx={{ justifyContent: 'end', flexDirection: 'row' }}>
                <Link to="/online/parametres/" className="no_style">
                  <Button variant="outlined" sx={{ marginRight: '10px' }}>
                    Annuler
                  </Button>
                </Link>
                <Button
                  type="submit"
                  variant="contained"
                  disabled={!formik.isValid || loadingPut}
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
