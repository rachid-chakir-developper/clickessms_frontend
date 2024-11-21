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
import { GET_MY_COMPANY_MEDIA } from '../../../../_shared/graphql/queries/CompanyQueries';
import { PUT_COMPANY_MEDIA } from '../../../../_shared/graphql/mutations/CompanyMutations';
import ProgressService from '../../../../_shared/services/feedbacks/ProgressService';
import TheFileField from '../../../../_shared/components/form-fields/TheFileField';
import { useSession } from '../../../../_shared/context/SessionProvider';

const Item = styled(Stack)(({ theme }) => ({
  backgroundColor: theme.palette.mode === 'dark' ? '#1A2027' : '#fff',
  ...theme.typography.body2,
  padding: theme.spacing(2),
  textAlign: 'center',
  color: theme.palette.text.secondary,
}));

export default function AddCompanyMediaForm({ idCompanyMedia = null, title = '' }) {
    const { user } = useSession();
  const { setNotifyAlert, setConfirmDialog } = useFeedBacks();
  const navigate = useNavigate();
  const validationSchema = yup.object({});
  const formik = useFormik({
    initialValues: {
      collectiveAgreement: undefined,
      companyAgreement: undefined,
      sceShopUrl: '',
    },
    validationSchema: validationSchema,
    onSubmit: (values) => {
      let { collectiveAgreement, ...companyMediaFormCopy } = values;
      let { companyAgreement, ...companyMediaCopy } = companyMediaFormCopy;
      onUpdateCompanyMedia({
        id: companyMediaCopy.id,
        companyMediaData: companyMediaCopy,
        collectiveAgreement: collectiveAgreement,
        companyAgreement: companyAgreement,
      });
    },
  });
  const [updateCompanyMedia, { loading: loadingPut }] = useMutation(PUT_COMPANY_MEDIA, {
    onCompleted: () => {
      setNotifyAlert({
        isOpen: true,
        message: 'Modifié avec succès',
        type: 'success',
      });
      navigate('/online/parametres/');
    },
    update(cache, { data: { updateCompanyMedia } }) {
      const updatedMedia = updateCompanyMedia.companyMedia;
  
      // Mettre à jour le cache Apollo
      cache.modify({
        id: cache.identify({ __typename: 'CompanyType', id: user.company.id }),
        fields: {
          companyMedia(existingMedia = {}) {
            return {
              ...existingMedia,
              ...updatedMedia,
            };
          },
        },
      });
    },
    onError: (err) => {
      console.error(err);
      setNotifyAlert({
        isOpen: true,
        message: 'Non modifié ! Veuillez réessayer.',
        type: 'error',
      });
    },
  });
  
  
  const onUpdateCompanyMedia = (variables) => {
    setConfirmDialog({
      isOpen: true,
      title: 'ATTENTION',
      subTitle: 'Voulez vous vraiment modifier ?',
      onConfirm: () => {
        setConfirmDialog({ isOpen: false });
        updateCompanyMedia({ variables });
      },
    });
  };
  const [getCompanyMedia, { loading: loadingCompanyMedia }] = useLazyQuery(GET_MY_COMPANY_MEDIA, {
    fetchPolicy: 'network-only',
    onCompleted: (data) => {
      let { __typename, companyMediaMedia, ...companyMediaCopy } = data.companyMedia;
      formik.setValues(companyMediaCopy);
    },
    onError: (err) => console.log(err),
  });
  React.useEffect(() => {
    getCompanyMedia();
  }, []);
  return (
    <Box sx={{ flexGrow: 1 }}>
      <Typography component="div" variant="h5" sx={{ mb: 3 }}>
        {title}
      </Typography>
      {loadingCompanyMedia && <ProgressService type="form" />}
      {!loadingCompanyMedia && (
        <form onSubmit={formik.handleSubmit}>
          <Grid
            container
            spacing={{ xs: 2, md: 3 }}
            columns={{ xs: 4, sm: 8, md: 12 }}
          >
            <Grid item xs={2} sm={4} md={4}>
              <Item>
                <TheFileField
                  variant="outlined"
                  label="Convention collective"
                  fileValue={formik.values.collectiveAgreement}
                  onChange={(file) =>
                    formik.setFieldValue('collectiveAgreement', file)
                  }
                  disabled={loadingPut}
                />
              </Item>
            </Grid>
            <Grid item xs={2} sm={4} md={4}>
              <Item>
                <TheFileField
                  variant="outlined"
                  label="Accord d’entreprise"
                  fileValue={formik.values.companyAgreement}
                  onChange={(file) =>
                    formik.setFieldValue('companyAgreement', file)
                  }
                  disabled={loadingPut}
                />
              </Item>
            </Grid>
            <Grid item xs={2} sm={4} md={4}>
              <Item>
                <TheTextField
                  variant="outlined"
                  label="Lien boutique cse"
                  value={formik.values.sceShopUrl}
                  onChange={(e) => formik.setFieldValue('sceShopUrl', e.target.value)}
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
