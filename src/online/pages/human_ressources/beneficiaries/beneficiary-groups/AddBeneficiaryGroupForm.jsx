import * as React from 'react';
import { experimentalStyled as styled } from '@mui/material/styles';
import Grid from '@mui/material/Grid';
import { Stack, Box, Typography, Button, Divider } from '@mui/material';

import { Link, useNavigate } from 'react-router-dom';
import { useLazyQuery, useMutation, useQuery } from '@apollo/client';
import { useFormik } from 'formik';
import * as yup from 'yup';

import TheTextField from '../../../../../_shared/components/form-fields/TheTextField';
import ImageFileField from '../../../../../_shared/components/form-fields/ImageFileField';
import { useFeedBacks } from '../../../../../_shared/context/feedbacks/FeedBacksProvider';
import { GET_BENEFICIARY_GROUP } from '../../../../../_shared/graphql/queries/BeneficiaryGroupQueries';
import {
  POST_BENEFICIARY_GROUP,
  PUT_BENEFICIARY_GROUP,
} from '../../../../../_shared/graphql/mutations/BeneficiaryGroupMutations';
import ProgressService from '../../../../../_shared/services/feedbacks/ProgressService';
import { GET_BENEFICIARIES } from '../../../../../_shared/graphql/queries/BeneficiaryQueries';
import TheAutocomplete from '../../../../../_shared/components/form-fields/TheAutocomplete';

const Item = styled(Stack)(({ theme }) => ({
  backgroundColor: theme.palette.mode === 'dark' ? '#1A2027' : '#fff',
  ...theme.typography.body2,
  padding: theme.spacing(2),
  textAlign: 'center',
  color: theme.palette.text.secondary,
}));

export default function AddBeneficiaryGroupForm({ idBeneficiaryGroup, title }) {
  const { setNotifyAlert, setConfirmDialog } = useFeedBacks();
  const navigate = useNavigate();
  const validationSchema = yup.object({
    name: yup
      .string("Entrez le nom d'événement")
      .required("Le nom d'événement est obligatoire"),
  });
  const formik = useFormik({
    initialValues: {
      image: undefined,
      number: '',
      name: '',
      description: '',
      observation: '',
      isActive: true,
      beneficiaries: [],
    },
    validationSchema: validationSchema,
    onSubmit: (values) => {
      let { image, ...beneficiaryGroupCopy } = values;
      beneficiaryGroupCopy.beneficiaries =
        beneficiaryGroupCopy.beneficiaries.map((i) => i?.id);
      if (idBeneficiaryGroup && idBeneficiaryGroup != '') {
        onUpdateBeneficiaryGroup({
          id: beneficiaryGroupCopy.id,
          beneficiaryGroupData: beneficiaryGroupCopy,
          image: image,
        });
      } else
        createBeneficiaryGroup({
          variables: {
            beneficiaryGroupData: beneficiaryGroupCopy,
            image: image,
          },
        });
    },
  });
  const {
    loading: loadingBeneficiaries,
    data: beneficiariesData,
    error: beneficiariesError,
    fetchMore: fetchMoreBeneficiaries,
  } = useQuery(GET_BENEFICIARIES, {
    fetchPolicy: 'network-only',
  });

  const [createBeneficiaryGroup, { loading: loadingPost }] = useMutation(
    POST_BENEFICIARY_GROUP,
    {
      onCompleted: (data) => {
        console.log(data);
        setNotifyAlert({
          isOpen: true,
          message: 'Ajouté avec succès',
          type: 'success',
        });
        let { __typename, ...beneficiaryGroupCopy } =
          data.createBeneficiaryGroup.beneficiaryGroup;
        //   formik.setValues(beneficiaryGroupCopy);
        navigate('/online/ressources-humaines/beneficiaires/groupes/liste');
      },
      update(cache, { data: { createBeneficiaryGroup } }) {
        const newBeneficiaryGroup = createBeneficiaryGroup.beneficiaryGroup;

        cache.modify({
          fields: {
            beneficiaryGroups(
              existingBeneficiaryGroups = { totalCount: 0, nodes: [] },
            ) {
              return {
                totalCount: existingBeneficiaryGroups.totalCount + 1,
                nodes: [
                  newBeneficiaryGroup,
                  ...existingBeneficiaryGroups.nodes,
                ],
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
  const [updateBeneficiaryGroup, { loading: loadingPut }] = useMutation(
    PUT_BENEFICIARY_GROUP,
    {
      onCompleted: (data) => {
        console.log(data);
        setNotifyAlert({
          isOpen: true,
          message: 'Modifié avec succès',
          type: 'success',
        });
        let { __typename, ...beneficiaryGroupCopy } =
          data.updateBeneficiaryGroup.beneficiaryGroup;
        //   formik.setValues(beneficiaryGroupCopy);
        navigate('/online/ressources-humaines/beneficiaires/groupes/liste');
      },
      update(cache, { data: { updateBeneficiaryGroup } }) {
        const updatedBeneficiaryGroup = updateBeneficiaryGroup.beneficiaryGroup;

        cache.modify({
          fields: {
            beneficiaryGroups(
              existingBeneficiaryGroups = { totalCount: 0, nodes: [] },
              { readField },
            ) {
              const updatedBeneficiaryGroups =
                existingBeneficiaryGroups.nodes.map((beneficiaryGroup) =>
                  readField('id', beneficiaryGroup) ===
                  updatedBeneficiaryGroup.id
                    ? updatedBeneficiaryGroup
                    : beneficiaryGroup,
                );

              return {
                totalCount: existingBeneficiaryGroups.totalCount,
                nodes: updatedBeneficiaryGroups,
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
    },
  );
  const onUpdateBeneficiaryGroup = (variables) => {
    setConfirmDialog({
      isOpen: true,
      title: 'ATTENTION',
      subTitle: 'Voulez vous vraiment modifier ?',
      onConfirm: () => {
        setConfirmDialog({ isOpen: false });
        updateBeneficiaryGroup({ variables });
      },
    });
  };
  const [getBeneficiaryGroup, { loading: loadingBeneficiaryGroup }] =
    useLazyQuery(GET_BENEFICIARY_GROUP, {
      fetchPolicy: 'network-only',
      onCompleted: (data) => {
        let { __typename, ...beneficiaryGroupCopy } = data.beneficiaryGroup;
        beneficiaryGroupCopy.beneficiaries = beneficiaryGroupCopy.beneficiaries
          ? beneficiaryGroupCopy.beneficiaries.map((i) => i?.beneficiary)
          : [];
        formik.setValues(beneficiaryGroupCopy);
      },
      onError: (err) => console.log(err),
    });
  React.useEffect(() => {
    if (idBeneficiaryGroup) {
      getBeneficiaryGroup({ variables: { id: idBeneficiaryGroup } });
    }
  }, [idBeneficiaryGroup]);
  return (
    <Box sx={{ flexGrow: 1 }}>
      <Typography component="div" variant="h5">
        {title} {formik.values.number}
      </Typography>
      {loadingBeneficiaryGroup && <ProgressService type="form" />}
      {!loadingBeneficiaryGroup && (
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
                  label="Référence"
                  value={formik.values.number}
                  disabled
                />
              </Item>
            </Grid>
            <Grid item xs={2} sm={4} md={4}>
              <Item>
                <TheTextField
                  variant="outlined"
                  label="Nom"
                  id="name"
                  value={formik.values.name}
                  required
                  onChange={(e) => formik.setFieldValue('name', e.target.value)}
                  onBlur={formik.handleBlur}
                  error={formik.touched.name && Boolean(formik.errors.name)}
                  helperText={formik.touched.name && formik.errors.name}
                  disabled={loadingPost || loadingPut}
                />
              </Item>
            </Grid>
            <Grid item xs={2} sm={4} md={4}>
              <Item>
                <ImageFileField
                  variant="outlined"
                  label="Image"
                  imageValue={formik.values.image}
                  onChange={(imageFile) =>
                    formik.setFieldValue('image', imageFile)
                  }
                  disabled={loadingPost || loadingPut}
                />
              </Item>
            </Grid>
            <Grid item xs={12} sm={12} md={12} >
              <Item>
                <TheAutocomplete
                  options={beneficiariesData?.beneficiaries?.nodes}
                  label="Bénificiaires"
                  placeholder="Ajouter un bénificiaire"
                  limitTags={3}
                  value={formik.values.beneficiaries}
                  onChange={(e, newValue) =>
                    formik.setFieldValue('beneficiaries', newValue)
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
                <Link
                  to="/online/ressources-humaines/beneficiaires/groupes/liste"
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
