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
import { GET_THE_BACKUP } from '../../../../_shared/graphql/queries/TheBackupQueries';
import {
  POST_THE_BACKUP,
  PUT_THE_BACKUP,
} from '../../../../_shared/graphql/mutations/TheBackupMutations';
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

export default function AddTheBackupForm({ idTheBackup, title }) {
  const { setNotifyAlert, setConfirmDialog } = useFeedBacks();
  const navigate = useNavigate();
  const validationSchema = yup.object({
    name: yup
      .string('Entrez le nom du sauvegarde')
      .required('Le nom du sauvegarde est obligatoire'),
  });
  const formik = useFormik({
    initialValues: {
      number: '',
      label: '',
      lastBackupDateTime: dayjs(new Date()),
      cycleInDays: 0,
      description: '',
      observation: '',
      isActive: true,
    },
    validationSchema: validationSchema,
    onSubmit: (values) => {
      let theBackupCopy= {...values};
      if (idTheBackup && idTheBackup != '') {
        onUpdateTheBackup({
          id: theBackupCopy.id,
          theBackupData: theBackupCopy,
        });
      } else
        createTheBackup({
          variables: {
            theBackupData: theBackupCopy,
          },
        });
    },
  });
  const [createTheBackup, { loading: loadingPost }] = useMutation(
    POST_THE_BACKUP,
    {
      onCompleted: (data) => {
        console.log(data);
        setNotifyAlert({
          isOpen: true,
          message: 'Ajouté avec succès',
          type: 'success',
        });
        let { __typename, ...theBackupCopy } = data.createTheBackup.theBackup;
        //   formik.setValues(theBackupCopy);
        navigate('/online/informatique/sauvegardes/liste');
      },
      update(cache, { data: { createTheBackup } }) {
        const newTheBackup = createTheBackup.theBackup;

        cache.modify({
          fields: {
            theBackups(existingTheBackups = { totalCount: 0, nodes: [] }) {
              return {
                totalCount: existingTheBackups.totalCount + 1,
                nodes: [newTheBackup, ...existingTheBackups.nodes],
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
  const [updateTheBackup, { loading: loadingPut }] = useMutation(PUT_THE_BACKUP, {
    onCompleted: (data) => {
      console.log(data);
      setNotifyAlert({
        isOpen: true,
        message: 'Modifié avec succès',
        type: 'success',
      });
      let { __typename, ...theBackupCopy } = data.updateTheBackup.theBackup;
      //   formik.setValues(theBackupCopy);
      navigate('/online/informatique/sauvegardes/liste');
    },
    update(cache, { data: { updateTheBackup } }) {
      const updatedTheBackup = updateTheBackup.theBackup;

      cache.modify({
        fields: {
          theBackups(
            existingTheBackups = { totalCount: 0, nodes: [] },
            { readField },
          ) {
            const updatedTheBackups = existingTheBackups.nodes.map((theBackup) =>
              readField('id', theBackup) === updatedTheBackup.id
                ? updatedTheBackup
                : theBackup,
            );

            return {
              totalCount: existingTheBackups.totalCount,
              nodes: updatedTheBackups,
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
  const onUpdateTheBackup = (variables) => {
    setConfirmDialog({
      isOpen: true,
      title: 'ATTENTION',
      subTitle: 'Voulez vous vraiment modifier ?',
      onConfirm: () => {
        setConfirmDialog({ isOpen: false });
        updateTheBackup({ variables });
      },
    });
  };
  const [getTheBackup, { loading: loadingTheBackup }] = useLazyQuery(
    GET_THE_BACKUP,
    {
      fetchPolicy: 'network-only',
      onCompleted: (data) => {
        let { __typename, folder, ...theBackupCopy } = data.theBackup;
        theBackupCopy.lastBackupDateTime = theBackupCopy.lastBackupDateTime ? dayjs(theBackupCopy.lastBackupDateTime) : null;
        formik.setValues(theBackupCopy);
      },
      onError: (err) => console.log(err),
    },
  );
  React.useEffect(() => {
    if (idTheBackup) {
      getTheBackup({ variables: { id: idTheBackup } });
    }
  }, [idTheBackup]);
  return (
    <Box sx={{ flexGrow: 1 }}>
      <Typography component="div" variant="h5">
        {title}: <u><em>{formik.values.label}</em></u>
      </Typography>
      {loadingTheBackup && <ProgressService type="form" />}
      {!loadingTheBackup && (
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
                <TheDesktopDatePicker
                  label="Date dernière sauvegarde"
                  value={formik.values.lastBackupDateTime}
                  onChange={(date) =>
                    formik.setFieldValue('lastBackupDateTime', date)
                  }
                  disabled={loadingPost || loadingPut}
                />
              </Item>
            </Grid>
            <Grid item xs={12} sm={6} md={4} >
              <Item>
                <TheTextField
                  variant="outlined"
                  label="Cycle en jours"
                  value={formik.values.cycleInDays}
                  type="number"
                  onChange={(e) =>
                    formik.setFieldValue('cycleInDays', e.target.value)
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
                <Link to="/online/informatique/sauvegardes/liste" className="no_style">
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
