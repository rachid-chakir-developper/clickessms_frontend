import * as React from 'react';
import { experimentalStyled as styled } from '@mui/material/styles';
import Grid from '@mui/material/Grid';
import { Stack, Box, Typography, Button, Divider, FormControl, InputLabel, Select, MenuItem } from '@mui/material';
import dayjs from 'dayjs';

import { Link, useNavigate } from 'react-router-dom';
import { useLazyQuery, useMutation, useQuery } from '@apollo/client';
import { useFormik } from 'formik';
import * as yup from 'yup';

import TheTextField from '../../../../_shared/components/form-fields/TheTextField';
import ImageFileField from '../../../../_shared/components/form-fields/ImageFileField';
import { useFeedBacks } from '../../../../_shared/context/feedbacks/FeedBacksProvider';
import { GET_MSG_NOTIFICATION } from '../../../../_shared/graphql/queries/MessageNotificationQueries';
import {
  POST_MSG_NOTIFICATION,
  PUT_MSG_NOTIFICATION,
} from '../../../../_shared/graphql/mutations/MessageNotificationMutations';
import ProgressService from '../../../../_shared/services/feedbacks/ProgressService';
import { GET_ESTABLISHMENTS } from '../../../../_shared/graphql/queries/EstablishmentQueries';
import TheAutocomplete from '../../../../_shared/components/form-fields/TheAutocomplete';
import { MSG_NOTIF_TYPES } from '../../../../_shared/tools/constants';

const Item = styled(Stack)(({ theme }) => ({
  backgroundColor: theme.palette.mode === 'dark' ? '#1A2027' : '#fff',
  ...theme.typography.body2,
  padding: theme.spacing(2),
  textAlign: 'center',
  color: theme.palette.text.secondary,
}));

export default function AddMessageNotificationForm({ idMessageNotification, title }) {
  const { setNotifyAlert, setConfirmDialog } = useFeedBacks();
  const navigate = useNavigate();
  const validationSchema = yup.object({});
  const formik = useFormik({
    initialValues: {
      image: undefined,
      title: '',
      messageNotificationType: MSG_NOTIF_TYPES.SYSTEM,
      message: '',
      establishments: []
    },
    validationSchema: validationSchema,
    onSubmit: (values) => {
      let { image, ...messageNotificationCopy } = values;
      
      messageNotificationCopy.establishments =
        messageNotificationCopy.establishments.map((i) => i?.id);
      if (idMessageNotification && idMessageNotification != '') {
        onUpdateMessageNotification({
          id: messageNotificationCopy.id,
          messageNotificationData: messageNotificationCopy,
          image: image,
        });
      } else
        createMessageNotification({
          variables: {
            messageNotificationData: messageNotificationCopy,
            image: image,
          },
        });
    },
  });
  
  const [createMessageNotification, { loading: loadingPost }] = useMutation(POST_MSG_NOTIFICATION, {
    onCompleted: (data) => {
      console.log(data);
      setNotifyAlert({
        isOpen: true,
        message: 'Ajouté avec succès',
        type: 'success',
      });
      let { __typename, ...messageNotificationCopy } = data.createMessageNotification.messageNotification;
      //   formik.setValues(messageNotificationCopy);
      navigate('/online/parametres/message-notifications/liste');
    },
    update(cache, { data: { createMessageNotification } }) {
      const newMessageNotification = createMessageNotification.messageNotification;

      cache.modify({
        fields: {
          messageNotifications(existingMessageNotifications = { totalCount: 0, nodes: [] }) {
            return {
              totalCount: existingMessageNotifications.totalCount + 1,
              nodes: [newMessageNotification, ...existingMessageNotifications.nodes],
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
  const [updateMessageNotification, { loading: loadingPut }] = useMutation(PUT_MSG_NOTIFICATION, {
    onCompleted: (data) => {
      console.log(data);
      setNotifyAlert({
        isOpen: true,
        message: 'Modifié avec succès',
        type: 'success',
      });
      let { __typename, ...messageNotificationCopy } = data.updateMessageNotification.messageNotification;
      //   formik.setValues(messageNotificationCopy);
      navigate('/online/parametres/message-notifications/liste');
    },
    update(cache, { data: { updateMessageNotification } }) {
      const updatedMessageNotification = updateMessageNotification.messageNotification;

      cache.modify({
        fields: {
          messageNotifications(
            existingMessageNotifications = { totalCount: 0, nodes: [] },
            { readField },
          ) {
            const updatedMessageNotifications = existingMessageNotifications.nodes.map((messageNotification) =>
              readField('id', messageNotification) === updatedMessageNotification.id
                ? updatedMessageNotification
                : messageNotification,
            );

            return {
              totalCount: existingMessageNotifications.totalCount,
              nodes: updatedMessageNotifications,
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
  const onUpdateMessageNotification = (variables) => {
    setConfirmDialog({
      isOpen: true,
      title: 'ATTENTION',
      subTitle: 'Voulez vous vraiment modifier ?',
      onConfirm: () => {
        setConfirmDialog({ isOpen: false });
        updateMessageNotification({ variables });
      },
    });
  };
  const [getMessageNotification, { loading: loadingMessageNotification }] = useLazyQuery(GET_MSG_NOTIFICATION, {
    fetchPolicy: 'network-only',
    onCompleted: (data) => {
      let { __typename, isRead, ...messageNotificationCopy } = data.messageNotification;
      messageNotificationCopy.establishments =
        messageNotificationCopy.establishments
          ? messageNotificationCopy.establishments.map((i) => i?.establishment)
          : [];
      formik.setValues(messageNotificationCopy);
    },
    onError: (err) => console.log(err),
  });

  const {
    loading: loadingEstablishments,
    data: establishmentsData,
    error: establishmentsError,
    fetchMore: fetchMoreEstablishments,
  } = useQuery(GET_ESTABLISHMENTS, {
    fetchPolicy: 'network-only',
  });


  React.useEffect(() => {
    if (idMessageNotification) {
      getMessageNotification({ variables: { id: idMessageNotification } });
    }
  }, [idMessageNotification]);
  return (
    <Box sx={{ flexGrow: 1 }}>
      <Typography component="div" variant="h5">
        {title} {formik.values.number}
      </Typography>
      {loadingMessageNotification && <ProgressService type="form" />}
      {!loadingMessageNotification && (
        <form onSubmit={formik.handleSubmit}>
          <Grid
            container
            spacing={{ xs: 2, md: 3 }}
            columns={{ xs: 4, sm: 8, md: 12 }}
          >
            <Grid item xs={12} sm={8} md={8}>
              <Item>
                <TheTextField
                  variant="outlined"
                  label="titre"
                  value={formik.values.title}
                  onChange={(e) => formik.setFieldValue('title', e.target.value)}
                  disabled={loadingPost || loadingPut}
                />
              </Item>
            </Grid>
            <Grid item xs={12} sm={4} md={4}>
              <Item>
                <TheAutocomplete
                  options={establishmentsData?.establishments?.nodes}
                  label="Structure(s) concernée(s)"
                  placeholder="Ajouter une structure"
                  limitTags={3}
                  value={formik.values.establishments}
                  onChange={(e, newValue) =>
                    formik.setFieldValue('establishments', newValue)
                  }
                />
              </Item>
            </Grid>
            <Grid item xs={12} sm={4} md={4}>
              <Item>
                <FormControl fullWidth>
                    <InputLabel>Type</InputLabel>
                    <Select
                        value={formik.values.messageNotificationType}
                        onChange={(e) => formik.setFieldValue('messageNotificationType', e.target.value)}
                        disabled={loadingPost || loadingPut}
                    >
                    {MSG_NOTIF_TYPES?.ALL?.map((type, index) => {
                      return (
                        <MenuItem key={index} value={type.value}>
                          {type.label}
                        </MenuItem>
                      );
                    })}
                    </Select>
                </FormControl>
              </Item>
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
            <Grid item xs={12} sm={8} md={8}>
              <Item>
                <TheTextField
                  variant="outlined"
                  label="Message"
                  multiline
                  rows={8}
                  value={formik.values.message}
                  onChange={(e) =>
                    formik.setFieldValue('message', e.target.value)
                  }
                  disabled={loadingPost || loadingPut}
                />
              </Item>
            </Grid>
            <Grid item xs={12} sm={12} md={12}>
              <Item sx={{ justifyContent: 'end', flexDirection: 'row' }}>
                <Link to="/online/parametres/message-notifications/liste" className="no_style">
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
