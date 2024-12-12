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
import { GET_THE_PASSWORD } from '../../../../_shared/graphql/queries/ThePasswordQueries';
import {
  POST_THE_PASSWORD,
  PUT_THE_PASSWORD,
} from '../../../../_shared/graphql/mutations/ThePasswordMutations';
import ProgressService from '../../../../_shared/services/feedbacks/ProgressService';
import TheSwitch from '../../../../_shared/components/form-fields/theSwitch';
import dayjs from 'dayjs';
import TheDesktopDatePicker from '../../../../_shared/components/form-fields/TheDesktopDatePicker';

const Item = styled(Stack)(({ theme }) => ({
  backgroundColor: theme.palette.mode === 'dark' ? '#1A2027' : '#fff',
  ...theme.typography.body2,
  padding: theme.spacing(2),
  textAlign: 'center',
  color: theme.palette.text.secondary,
}));

export default function AddThePasswordForm({ idThePassword, title }) {
  const { setNotifyAlert, setConfirmDialog } = useFeedBacks();
  const navigate = useNavigate();
  const validationSchema = yup.object({
    name: yup
      .string('Entrez le nom du mots de passe')
      .required('Le nom du mots de passe est obligatoire'),
  });
  const formik = useFormik({
    initialValues: {
      number: '',
      label: '',
      identifier: '',
      passwordText: '',
      link: '',
      description: '',
      observation: '',
      isActive: true,
    },
    validationSchema: validationSchema,
    onSubmit: (values) => {
      let thePasswordCopy= {...values};
      if (idThePassword && idThePassword != '') {
        onUpdateThePassword({
          id: thePasswordCopy.id,
          thePasswordData: thePasswordCopy,
        });
      } else
        createThePassword({
          variables: {
            thePasswordData: thePasswordCopy,
          },
        });
    },
  });
  const [createThePassword, { loading: loadingPost }] = useMutation(
    POST_THE_PASSWORD,
    {
      onCompleted: (data) => {
        console.log(data);
        setNotifyAlert({
          isOpen: true,
          message: 'Ajouté avec succès',
          type: 'success',
        });
        let { __typename, ...thePasswordCopy } = data.createThePassword.thePassword;
        //   formik.setValues(thePasswordCopy);
        navigate('/online/informatique/mots-de-passe/liste');
      },
      update(cache, { data: { createThePassword } }) {
        const newThePassword = createThePassword.thePassword;

        cache.modify({
          fields: {
            thePasswords(existingThePasswords = { totalCount: 0, nodes: [] }) {
              return {
                totalCount: existingThePasswords.totalCount + 1,
                nodes: [newThePassword, ...existingThePasswords.nodes],
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
  const [updateThePassword, { loading: loadingPut }] = useMutation(PUT_THE_PASSWORD, {
    onCompleted: (data) => {
      console.log(data);
      setNotifyAlert({
        isOpen: true,
        message: 'Modifié avec succès',
        type: 'success',
      });
      let { __typename, ...thePasswordCopy } = data.updateThePassword.thePassword;
      //   formik.setValues(thePasswordCopy);
      navigate('/online/informatique/mots-de-passe/liste');
    },
    update(cache, { data: { updateThePassword } }) {
      const updatedThePassword = updateThePassword.thePassword;

      cache.modify({
        fields: {
          thePasswords(
            existingThePasswords = { totalCount: 0, nodes: [] },
            { readField },
          ) {
            const updatedThePasswords = existingThePasswords.nodes.map((thePassword) =>
              readField('id', thePassword) === updatedThePassword.id
                ? updatedThePassword
                : thePassword,
            );

            return {
              totalCount: existingThePasswords.totalCount,
              nodes: updatedThePasswords,
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
  const onUpdateThePassword = (variables) => {
    setConfirmDialog({
      isOpen: true,
      title: 'ATTENTION',
      subTitle: 'Voulez vous vraiment modifier ?',
      onConfirm: () => {
        setConfirmDialog({ isOpen: false });
        updateThePassword({ variables });
      },
    });
  };
  const [getThePassword, { loading: loadingThePassword }] = useLazyQuery(
    GET_THE_PASSWORD,
    {
      fetchPolicy: 'network-only',
      onCompleted: (data) => {
        let { __typename, folder, ...thePasswordCopy } = data.thePassword;
        formik.setValues(thePasswordCopy);
      },
      onError: (err) => console.log(err),
    },
  );
  React.useEffect(() => {
    if (idThePassword) {
      getThePassword({ variables: { id: idThePassword } });
    }
  }, [idThePassword]);
  return (
    <Box sx={{ flexGrow: 1 }}>
      <Typography component="div" variant="h5">
        {title}: <u><em>{formik.values.label}</em></u>
      </Typography>
      {loadingThePassword && <ProgressService type="form" />}
      {!loadingThePassword && (
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
                  label="Libellé"
                  id="label"
                  value={formik.values.label}
                  required
                  onChange={(e) => formik.setFieldValue('label', e.target.value)}
                  onBlur={formik.handleBlur}
                  error={formik.touched.label && Boolean(formik.errors.label)}
                  helperText={formik.touched.label && formik.errors.label}
                  disabled={loadingPost || loadingPut}
                />
              </Item>
            </Grid>
            <Grid item xs={12} sm={6} md={4} >
              <Item>
                <TheTextField
                  variant="outlined"
                  label="Identifiant"
                  value={formik.values.identifier}
                  onChange={(e) =>
                    formik.setFieldValue('identifier', e.target.value)
                  }
                  disabled={loadingPost || loadingPut}
                />
              </Item>
            </Grid>
            <Grid item xs={12} sm={6} md={4} >
              <Item>
                <TheTextField
                  variant="outlined"
                  label="Mot de passe"
                  value={formik.values.passwordText}
                  onChange={(e) =>
                    formik.setFieldValue('passwordText', e.target.value)
                  }
                  disabled={loadingPost || loadingPut}
                />
              </Item>
            </Grid>
            <Grid item xs={12} sm={12} md={8} >
              <Item>
                <TheTextField
                  variant="outlined"
                  label="Lien"
                  value={formik.values.link}
                  onChange={(e) =>
                    formik.setFieldValue('link', e.target.value)
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
                <Link to="/online/informatique/mots-de-passe/liste" className="no_style">
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
