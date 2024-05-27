import * as React from 'react';
import { experimentalStyled as styled } from '@mui/material/styles';
import Grid from '@mui/material/Unstable_Grid2';
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
import { useLazyQuery, useMutation } from '@apollo/client';
import { useFormik } from 'formik';
import * as yup from 'yup';

import TheTextField from '../../../../_shared/components/form-fields/TheTextField';
import ImageFileField from '../../../../_shared/components/form-fields/ImageFileField';
import TheDesktopDatePicker from '../../../../_shared/components/form-fields/TheDesktopDatePicker';
import { useFeedBacks } from '../../../../_shared/context/feedbacks/FeedBacksProvider';
import { GET_GOVERNANCE_MEMBER } from '../../../../_shared/graphql/queries/GovernanceMemberQueries';
import {
  POST_GOVERNANCE_MEMBER,
  PUT_GOVERNANCE_MEMBER,
} from '../../../../_shared/graphql/mutations/GovernanceMemberMutations';
import ProgressService from '../../../../_shared/services/feedbacks/ProgressService';

const Item = styled(Stack)(({ theme }) => ({
  backgroundColor: theme.palette.mode === 'dark' ? '#1A2027' : '#fff',
  ...theme.typography.body2,
  padding: theme.spacing(2),
  textAlign: 'center',
  color: theme.palette.text.secondary,
}));

export default function AddGovernanceMemberForm({ idGovernanceMember, title }) {
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
      number: '',
      firstName: '',
      lastName: '',
      birthDate: dayjs(new Date()),
      hiringDate: dayjs(new Date()),
      probationEndDate: dayjs(new Date()),
      workEndDate: dayjs(new Date()),
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
      let { photo, ...governanceMemberFormCopy } = values;
      let { coverImage, ...governanceMemberCopy } = governanceMemberFormCopy;
      if (idGovernanceMember && idGovernanceMember != '') {
        onUpdateGovernanceMember({
          id: governanceMemberCopy.id,
          governanceMemberData: governanceMemberCopy,
          photo: photo,
          coverImage: coverImage,
        });
      } else
        createGovernanceMember({
          variables: {
            governanceMemberData: governanceMemberCopy,
            photo: photo,
            coverImage: coverImage,
          },
        });
    },
  });
  const [createGovernanceMember, { loading: loadingPost }] = useMutation(
    POST_GOVERNANCE_MEMBER,
    {
      onCompleted: (data) => {
        console.log(data);
        setNotifyAlert({
          isOpen: true,
          message: 'Ajouté avec succès',
          type: 'success',
        });
        let { __typename, ...governanceMemberCopy } = data.createGovernanceMember.governanceMember;
        //   formik.setValues(governanceMemberCopy);
        navigate('/online/gouvernance/membres/liste');
      },
      update(cache, { data: { createGovernanceMember } }) {
        const newGovernanceMember = createGovernanceMember.governanceMember;

        cache.modify({
          fields: {
            governanceMembers(existingGovernanceMembers = { totalCount: 0, nodes: [] }) {
              return {
                totalCount: existingGovernanceMembers.totalCount + 1,
                nodes: [newGovernanceMember, ...existingGovernanceMembers.nodes],
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
  const [updateGovernanceMember, { loading: loadingPut }] = useMutation(PUT_GOVERNANCE_MEMBER, {
    onCompleted: (data) => {
      console.log(data);
      setNotifyAlert({
        isOpen: true,
        message: 'Modifié avec succès',
        type: 'success',
      });
      let { __typename, ...governanceMemberCopy } = data.updateGovernanceMember.governanceMember;
      //   formik.setValues(governanceMemberCopy);
      navigate('/online/gouvernance/membres/liste');
    },
    update(cache, { data: { updateGovernanceMember } }) {
      const updatedGovernanceMember = updateGovernanceMember.governanceMember;

      cache.modify({
        fields: {
          governanceMembers(
            existingGovernanceMembers = { totalCount: 0, nodes: [] },
            { readField },
          ) {
            const updatedGovernanceMembers = existingGovernanceMembers.nodes.map((governanceMember) =>
              readField('id', governanceMember) === updatedGovernanceMember.id
                ? updatedGovernanceMember
                : governanceMember,
            );

            return {
              totalCount: existingGovernanceMembers.totalCount,
              nodes: updatedGovernanceMembers,
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
  const onUpdateGovernanceMember = (variables) => {
    setConfirmDialog({
      isOpen: true,
      title: 'ATTENTION',
      subTitle: 'Voulez vous vraiment modifier ?',
      onConfirm: () => {
        setConfirmDialog({ isOpen: false });
        updateGovernanceMember({ variables });
      },
    });
  };
  const [getGovernanceMember, { loading: loadingGovernanceMember }] = useLazyQuery(
    GET_GOVERNANCE_MEMBER,
    {
      fetchPolicy: 'network-only',
      onCompleted: (data) => {
        let { __typename, ...governanceMemberCopy1 } = data.governanceMember;
        let { folder, ...governanceMemberCopy } = governanceMemberCopy1;
        governanceMemberCopy.birthDate = dayjs(governanceMemberCopy.birthDate);
        governanceMemberCopy.hiringDate = dayjs(governanceMemberCopy.hiringDate);
        governanceMemberCopy.probationEndDate = dayjs(governanceMemberCopy.probationEndDate);
        governanceMemberCopy.workEndDate = dayjs(governanceMemberCopy.workEndDate);
        formik.setValues(governanceMemberCopy);
      },
      onError: (err) => console.log(err),
    },
  );
  React.useEffect(() => {
    if (idGovernanceMember) {
      getGovernanceMember({ variables: { id: idGovernanceMember } });
    }
  }, [idGovernanceMember]);
  return (
    <Box sx={{ flexGrow: 1 }}>
      <Typography component="div" variant="h5">
        {title} {formik.values.number}
      </Typography>
      {loadingGovernanceMember && <ProgressService type="form" />}
      {!loadingGovernanceMember && (
        <form onSubmit={formik.handleSubmit}>
          <Grid
            container
            spacing={{ xs: 2, md: 3 }}
            columns={{ xs: 4, sm: 8, md: 12 }}
          >
            <Grid xs={2} sm={4} md={4}>
              <Item>
                <TheTextField
                  variant="outlined"
                  label="Référence"
                  value={formik.values.number}
                  disabled
                />
              </Item>
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
            </Grid>
            <Grid xs={2} sm={4} md={4}>
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
                  label="Nom"
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
            </Grid>
            <Grid xs={2} sm={4} md={4}>
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
                  label="Poste occupé"
                  value={formik.values.position}
                  onChange={(e) =>
                    formik.setFieldValue('position', e.target.value)
                  }
                  disabled={loadingPost || loadingPut}
                />
              </Item>
            </Grid>
            <Grid xs={12} sm={12} md={12}>
              <Divider variant="middle" />
            </Grid>
            <Grid xs={2} sm={4} md={4}>
              <Grid container columns={{ xs: 12, sm: 12, md: 12 }}>
                <Grid xs={12} sm={12} md={12}>
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
                <Grid xs={12} sm={12} md={12}>
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
                <Grid xs={5} sm={5} md={5}>
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
                <Grid xs={7} sm={7} md={7}>
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
            <Grid xs={2} sm={4} md={4}>
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
            <Grid xs={2} sm={4} md={4}>
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
            <Grid xs={12} sm={12} md={12}>
              <Divider variant="middle" />
            </Grid>
            <Grid xs={2} sm={4} md={4}>
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
            <Grid xs={2} sm={4} md={4}>
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
            <Grid xs={2} sm={4} md={4}>
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
            <Grid xs={12} sm={12} md={12}>
              <Divider variant="middle" />
            </Grid>
            <Grid xs={12} sm={6} md={6}>
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
            <Grid xs={12} sm={6} md={6}>
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
            <Grid xs={12} sm={12} md={12}>
              <Item sx={{ justifyContent: 'end', flexDirection: 'row' }}>
                <Link
                  to="/online/gouvernance/membres/liste"
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
