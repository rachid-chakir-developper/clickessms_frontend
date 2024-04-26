import * as React from 'react';
import { experimentalStyled as styled } from '@mui/material/styles';
import Grid from '@mui/material/Unstable_Grid2';
import { Stack, Box, Typography, Button, Divider } from '@mui/material';

import { Link, useNavigate } from 'react-router-dom';
import { useLazyQuery, useMutation } from '@apollo/client';
import { useFormik } from 'formik';
import * as yup from 'yup';

import TheTextField from '../../../../_shared/components/form-fields/TheTextField';
import ImageFileField from '../../../../_shared/components/form-fields/ImageFileField';
import { useFeedBacks } from '../../../../_shared/context/feedbacks/FeedBacksProvider';
import { GET_THE_OBJECT } from '../../../../_shared/graphql/queries/TheObjectQueries';
import {
  POST_THE_OBJECT,
  PUT_THE_OBJECT,
} from '../../../../_shared/graphql/mutations/TheObjectMutations';
import ProgressService from '../../../../_shared/services/feedbacks/ProgressService';

const Item = styled(Stack)(({ theme }) => ({
  backgroundColor: theme.palette.mode === 'dark' ? '#1A2027' : '#fff',
  ...theme.typography.body2,
  padding: theme.spacing(2),
  textAlign: 'center',
  color: theme.palette.text.secondary,
}));

export default function AddTheObjectForm({ idTheObject, title }) {
  const { setNotifyAlert, setConfirmDialog } = useFeedBacks();
  const navigate = useNavigate();
  const validationSchema = yup.object({
    name: yup
      .string('Entrez le nom de objet')
      .required('Le nom de objet est obligatoire'),
  });
  const formik = useFormik({
    initialValues: {
      image: undefined,
      number: '',
      name: '',
      description: '',
      observation: '',
      isActive: true,
    },
    validationSchema: validationSchema,
    onSubmit: (values) => {
      let { image, ...theObjectCopy } = values;
      theObjectCopy.client = theObjectCopy.client
        ? theObjectCopy.client.id
        : null;
      if (idTheObject && idTheObject != '') {
        onUpdateTheObject({
          id: theObjectCopy.id,
          theObjectData: theObjectCopy,
          image: image,
        });
      } else
        createTheObject({
          variables: {
            theObjectData: theObjectCopy,
            image: image,
          },
        });
    },
  });
  const [createTheObject, { loading: loadingPost }] = useMutation(
    POST_THE_OBJECT,
    {
      onCompleted: (data) => {
        console.log(data);
        setNotifyAlert({
          isOpen: true,
          message: 'Ajouté avec succès',
          type: 'success',
        });
        let { __typename, ...theObjectCopy } = data.createTheObject.theObject;
        //   formik.setValues(theObjectCopy);
        navigate('/online/recuperations/objets/liste');
      },
      update(cache, { data: { createTheObject } }) {
        const newTheObject = createTheObject.theObject;

        cache.modify({
          fields: {
            theObjects(existingTheObjects = { totalCount: 0, nodes: [] }) {
              return {
                totalCount: existingTheObjects.totalCount + 1,
                nodes: [newTheObject, ...existingTheObjects.nodes],
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
  const [updateTheObject, { loading: loadingPut }] = useMutation(
    PUT_THE_OBJECT,
    {
      onCompleted: (data) => {
        console.log(data);
        setNotifyAlert({
          isOpen: true,
          message: 'Modifié avec succès',
          type: 'success',
        });
        let { __typename, ...theObjectCopy } = data.updateTheObject.theObject;
        //   formik.setValues(theObjectCopy);
        navigate('/online/recuperations/objets/liste');
      },
      update(cache, { data: { updateTheObject } }) {
        const updatedTheObject = updateTheObject.theObject;

        cache.modify({
          fields: {
            theObjects(
              existingTheObjects = { totalCount: 0, nodes: [] },
              { readField },
            ) {
              const updatedTheObjects = existingTheObjects.nodes.map(
                (theObject) =>
                  readField('id', theObject) === updatedTheObject.id
                    ? updatedTheObject
                    : theObject,
              );

              return {
                totalCount: existingTheObjects.totalCount,
                nodes: updatedTheObjects,
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
  const onUpdateTheObject = (variables) => {
    setConfirmDialog({
      isOpen: true,
      title: 'ATTENTION',
      subTitle: 'Voulez vous vraiment modifier ?',
      onConfirm: () => {
        setConfirmDialog({ isOpen: false });
        updateTheObject({ variables });
      },
    });
  };
  const [getTheObject, { loading: loadingTheObject }] = useLazyQuery(
    GET_THE_OBJECT,
    {
      fetchPolicy: 'network-only',
      onCompleted: (data) => {
        let { __typename, ...theObjectCopy } = data.theObject;
        formik.setValues(theObjectCopy);
      },
      onError: (err) => console.log(err),
    },
  );
  React.useEffect(() => {
    if (idTheObject) {
      getTheObject({ variables: { id: idTheObject } });
    }
  }, [idTheObject]);
  return (
    <Box sx={{ flexGrow: 1 }}>
      <Typography component="div" variant="h5">
        {title} {formik.values.number}
      </Typography>
      {loadingTheObject && <ProgressService type="form" />}
      {!loadingTheObject && (
        <form onSubmit={formik.handleSubmit}>
          <Grid
            container
            spacing={{ xs: 2, md: 3 }}
            columns={{ xs: 4, sm: 8, md: 12 }}
          >
            <Grid xs={2} sm={4} md={4}>
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
            <Grid xs={2} sm={4} md={4}>
              <Item>
                <TheTextField
                  variant="outlined"
                  label="Référence"
                  value={formik.values.number}
                  disabled
                />
              </Item>
            </Grid>
            <Grid xs={2} sm={4} md={4}>
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
                  to="/online/recuperations/objets/liste"
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
