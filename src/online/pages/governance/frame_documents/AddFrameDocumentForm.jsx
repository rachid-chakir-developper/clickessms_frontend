import * as React from 'react';
import { experimentalStyled as styled } from '@mui/material/styles';
import Grid from '@mui/material/Grid';
import { Stack, Box, Typography, Button, InputAdornment, FormControl, InputLabel, Select, MenuItem } from '@mui/material';
import dayjs from 'dayjs';

import { Link, useNavigate } from 'react-router-dom';
import { useLazyQuery, useMutation, useQuery } from '@apollo/client';
import { useFormik } from 'formik';
import * as yup from 'yup';

import TheTextField from '../../../../_shared/components/form-fields/TheTextField';
import TheFileField from '../../../../_shared/components/form-fields/TheFileField';
import { useFeedBacks } from '../../../../_shared/context/feedbacks/FeedBacksProvider';
import { GET_FRAME_DOCUMENT } from '../../../../_shared/graphql/queries/FrameDocumentQueries';
import {
  POST_FRAME_DOCUMENT,
  PUT_FRAME_DOCUMENT,
} from '../../../../_shared/graphql/mutations/FrameDocumentMutations';
import ProgressService from '../../../../_shared/services/feedbacks/ProgressService';
import TheAutocomplete from '../../../../_shared/components/form-fields/TheAutocomplete';
import { GET_BANK_ACCOUNTS } from '../../../../_shared/graphql/queries/BankAccountQueries';
import TheDesktopDatePicker from '../../../../_shared/components/form-fields/TheDesktopDatePicker';
import { GET_DATAS_FRAME_DOCUMENT_ } from '../../../../_shared/graphql/queries/DataQueries';
import { GET_ESTABLISHMENTS } from '../../../../_shared/graphql/queries/EstablishmentQueries';

const Item = styled(Stack)(({ theme }) => ({
  backgroundColor: theme.palette.mode === 'dark' ? '#1A2027' : '#fff',
  ...theme.typography.body2,
  padding: theme.spacing(2),
  textAlign: 'center',
  color: theme.palette.text.secondary,
}));

export default function AddFrameDocumentForm({ idFrameDocument, title }) {
  const { setNotifyAlert, setConfirmDialog } = useFeedBacks();
  const navigate = useNavigate();
  const validationSchema = yup.object({});
  const formik = useFormik({
    initialValues: {
      document: undefined,
      documentScope: 'GOVERNANCE',
      number: '',
      name: '',
      description: '',
      establishments: [],
      documentType: null,
    },
    validationSchema: validationSchema,
    onSubmit: (values) => {
      let { document, ...frameDocumentCopy } = values;
      frameDocumentCopy.establishments = frameDocumentCopy.establishments.map((i) => i?.id);
      if (idFrameDocument && idFrameDocument != '') {
        onUpdateFrameDocument({
          id: frameDocumentCopy.id,
          frameDocumentData: frameDocumentCopy,
          document: document,
        });
      } else
        createFrameDocument({
          variables: {
            frameDocumentData: frameDocumentCopy,
            document: document,
          },
        });
    },
  });

  const {
    loading: loadingDatas,
    data: dataData,
    error: datsError,
    fetchMore: fetchMoreDatas,
  } = useQuery(GET_DATAS_FRAME_DOCUMENT_, { fetchPolicy: 'network-only' });
  
  const [createFrameDocument, { loading: loadingPost }] = useMutation(POST_FRAME_DOCUMENT, {
    onCompleted: (data) => {
      console.log(data);
      setNotifyAlert({
        isOpen: true,
        message: 'Ajouté avec succès',
        type: 'success',
      });
      let { __typename, ...frameDocumentCopy } = data.createFrameDocument.frameDocument;
      //   formik.setValues(frameDocumentCopy);
      navigate('/online/gouvernance/documents-trames/liste');
    },
    update(cache, { data: { createFrameDocument } }) {
      const newFrameDocument = createFrameDocument.frameDocument;

      cache.modify({
        fields: {
          frameDocuments(existingFrameDocuments = { totalCount: 0, nodes: [] }) {
            return {
              totalCount: existingFrameDocuments.totalCount + 1,
              nodes: [newFrameDocument, ...existingFrameDocuments.nodes],
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
  const [updateFrameDocument, { loading: loadingPut }] = useMutation(PUT_FRAME_DOCUMENT, {
    onCompleted: (data) => {
      console.log(data);
      setNotifyAlert({
        isOpen: true,
        message: 'Modifié avec succès',
        type: 'success',
      });
      let { __typename, ...frameDocumentCopy } = data.updateFrameDocument.frameDocument;
      //   formik.setValues(frameDocumentCopy);
      navigate('/online/gouvernance/documents-trames/liste');
    },
    update(cache, { data: { updateFrameDocument } }) {
      const updatedFrameDocument = updateFrameDocument.frameDocument;

      cache.modify({
        fields: {
          frameDocuments(
            existingFrameDocuments = { totalCount: 0, nodes: [] },
            { readField },
          ) {
            const updatedFrameDocuments = existingFrameDocuments.nodes.map((frameDocument) =>
              readField('id', frameDocument) === updatedFrameDocument.id
                ? updatedFrameDocument
                : frameDocument,
            );

            return {
              totalCount: existingFrameDocuments.totalCount,
              nodes: updatedFrameDocuments,
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
  const onUpdateFrameDocument = (variables) => {
    setConfirmDialog({
      isOpen: true,
      title: 'ATTENTION',
      subTitle: 'Voulez vous vraiment modifier ?',
      onConfirm: () => {
        setConfirmDialog({ isOpen: false });
        updateFrameDocument({ variables });
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
  const [getFrameDocument, { loading: loadingFrameDocument }] = useLazyQuery(GET_FRAME_DOCUMENT, {
    fetchPolicy: 'network-only',
    onCompleted: (data) => {
      let { __typename, folder, ...frameDocumentCopy } = data.frameDocument;
      frameDocumentCopy.documentType = frameDocumentCopy.documentType
          ? Number(frameDocumentCopy.documentType.id)
          : null;
      formik.setValues(frameDocumentCopy);
    },
    onError: (err) => console.log(err),
  });

  React.useEffect(() => {
    if (idFrameDocument) {
      getFrameDocument({ variables: { id: idFrameDocument } });
    }
  }, [idFrameDocument]);
  return (
    <Box sx={{ flexGrow: 1 }}>
      <Typography component="div" variant="h5">
        {title} {formik.values.number}
      </Typography>
      {loadingFrameDocument && <ProgressService type="form" />}
      {!loadingFrameDocument && (
        <form onSubmit={formik.handleSubmit}>
          <Grid container spacing={{ xs: 2, md: 3 }}>
            <Grid item xs={12} sm={6} md={4} >
              <Item>
                <TheFileField
                  variant="outlined"
                  label="Document"
                  fileValue={formik.values.document}
                  onChange={(file) => formik.setFieldValue('document', file)}
                  disabled={loadingPost || loadingPut}
                />
              </Item>
            </Grid>
            <Grid item xs={12} sm={6} md={4} >
              <Item>
                <TheTextField
                  variant="outlined"
                  label="Libellé"
                  value={formik.values.name}
                  onChange={(e) => formik.setFieldValue('name', e.target.value)}
                  disabled={loadingPost || loadingPut}
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
            <Grid item xs={12} sm={6} md={4} >
              <Item>
                <FormControl fullWidth>
                  <InputLabel id="demo-simple-select-label">
                    Type
                  </InputLabel>
                  <Select
                    labelId="demo-simple-select-label"
                    id="demo-simple-select"
                    label="Type"
                    value={formik.values.documentType}
                    onChange={(e) =>
                      formik.setFieldValue('documentType', e.target.value)
                    }
                  >
                    <MenuItem value={null}>
                      <em>Choisissez un type</em>
                    </MenuItem>
                    {dataData?.documentTypes?.map((data, index) => {
                      return (
                        <MenuItem key={index} value={data.id}>
                          {data.name}
                        </MenuItem>
                      );
                    })}
                  </Select>
                </FormControl>
              </Item>
            </Grid>
            <Grid item xs={12} sm={12} md={12} >
              <Item>
                <TheTextField
                  variant="outlined"
                  label="Description"
                  multiline
                  rows={4}
                  value={formik.values.description}
                  onChange={(e) => formik.setFieldValue('description', e.target.value)}
                  disabled={loadingPost || loadingPut}
                />
              </Item>
            </Grid>
            <Grid item xs={12} sm={12} md={12}>
              <Item sx={{ justifyContent: 'end', flexDirection: 'row' }}>
                <Link
                  to="/online/gouvernance/documents-trames/liste"
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
