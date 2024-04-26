import * as React from 'react';
import { experimentalStyled as styled } from '@mui/material/styles';
import Grid from '@mui/material/Unstable_Grid2';
import {
  Stack,
  Box,
  Typography,
  InputAdornment,
  Button,
  IconButton,
} from '@mui/material';

import { useLazyQuery, useMutation } from '@apollo/client';
import { useFormik } from 'formik';
import * as yup from 'yup';

import TheTextField from '../../../../_shared/components/form-fields/TheTextField';
import { useFeedBacks } from '../../../../_shared/context/feedbacks/FeedBacksProvider';
import { GET_MEETING } from '../../../../_shared/graphql/queries/MeetingQueries';
import {
  POST_MEETING,
  PUT_MEETING,
} from '../../../../_shared/graphql/mutations/MeetingMutations';
import ProgressService from '../../../../_shared/services/feedbacks/ProgressService';
import { Close } from '@mui/icons-material';

const Item = styled(Stack)(({ theme }) => ({
  backgroundColor: theme.palette.mode === 'dark' ? '#1A2027' : '#fff',
  ...theme.typography.body2,
  padding: theme.spacing(2),
  textAlign: 'center',
  color: theme.palette.text.secondary,
}));

export default function AddMeetingReportForm({ idMeeting, title }) {
  const { setNotifyAlert, setConfirmDialog } = useFeedBacks();
  const validationSchema = yup.object({
    name: yup
      .string('Entrez le nom de la réunion')
      .required('Le nom de la réunion est obligatoire'),
  });
  const formik = useFormik({
    initialValues: {
      meetingReportItems: [],
    },
    validationSchema: validationSchema,
    onSubmit: (values) => {
      let { image, ...meetingReportItemCopy } = values;
      if (idMeeting && idMeeting != '') {
        onUpdateMeetingReportItem({
          id: meetingReportItemCopy.id,
          meetingReportItemData: meetingReportItemCopy,
        });
      } else
        createMeetingReportItem({
          variables: {
            meetingReportItemData: meetingReportItemCopy,
            image: image,
          },
        });
    },
  });
  const [createMeetingReportItem, { loading: loadingPost }] = useMutation(
    POST_MEETING,
    {
      onCompleted: (data) => {
        console.log(data);
        setNotifyAlert({
          isOpen: true,
          message: 'Ajouté avec succès',
          type: 'success',
        });
        let { __typename, ...meetingReportItemCopy } =
          data.createMeetingReportItem.meetingReportItem;
      },
      update(cache, { data: { createMeetingReportItem } }) {
        const newMeetingReportItem = createMeetingReportItem.meetingReportItem;

        cache.modify({
          fields: {
            meetings(
              existingMeetingReportItems = { totalCount: 0, nodes: [] },
            ) {
              return {
                totalCount: existingMeetingReportItems.totalCount + 1,
                nodes: [
                  newMeetingReportItem,
                  ...existingMeetingReportItems.nodes,
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
  const [updateMeetingReportItem, { loading: loadingPut }] = useMutation(
    PUT_MEETING,
    {
      onCompleted: (data) => {
        console.log(data);
        setNotifyAlert({
          isOpen: true,
          message: 'Modifié avec succès',
          type: 'success',
        });
        let { __typename, ...meetingReportItemCopy } =
          data.updateMeetingReportItem.meetingReportItem;
      },
      update(cache, { data: { updateMeeting } }) {
        const updatedMeetingReportItem =
          updateMeetingReportItem.meetingReportItem;

        cache.modify({
          fields: {
            meetings(
              existingMeetingReportItems = { totalCount: 0, nodes: [] },
              { readField },
            ) {
              const updatedMeetingReportItems =
                existingMeetingReportItems.nodes.map((meetingReportItem) =>
                  readField('id', meetingReportItem) ===
                  updatedMeetingReportItem.id
                    ? updatedMeetingReportItem
                    : meetingReportItem,
                );

              return {
                totalCount: existingMeetingReportItems.totalCount,
                nodes: updatedMeetingReportItems,
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
  const onUpdateMeetingReportItem = (variables) => {
    setConfirmDialog({
      isOpen: true,
      title: 'ATTENTION',
      subTitle: 'Voulez vous vraiment modifier ?',
      onConfirm: () => {
        setConfirmDialog({ isOpen: false });
        updateMeetingReportItem({ variables });
      },
    });
  };
  const [getMeetingReport, { loading: loadingMeetingReport }] = useLazyQuery(
    GET_MEETING,
    {
      fetchPolicy: 'network-only',
      onCompleted: (data) => {
        let { __typename, ...meetingReportCopy } = data.meetingReport;
        if (!meetingReportCopy?.meetingReportItems)
          meetingReportCopy['meetingReportItems'] = [];
        let items = [];
        meetingReportCopy.meetingReportItems.forEach((item) => {
          let { __typename, ...itemCopy } = item;
          items.push(itemCopy);
        });
        meetingReportCopy.meetingReportItems = items;
        formik.setValues(meetingReportCopy);
      },
      onError: (err) => console.log(err),
    },
  );
  React.useEffect(() => {
    if (idMeeting) {
      getMeetingReport({ variables: { id: idMeeting } });
    }
  }, [idMeeting]);
  const addChecklistItem = () => {
    formik.setValues({
      ...formik.values,
      meetingReportItems: [
        ...formik.values.meetingReportItems,
        { report: '', decision: '', pointsToReview: '' },
      ],
    });
  };

  const removeChecklistItem = (index) => {
    const updatedReportItems = [...formik.values.meetingReportItems];
    updatedReportItems.splice(index, 1);

    formik.setValues({
      ...formik.values,
      meetingReportItems: updatedReportItems,
    });
  };
  return (
    <Box sx={{ flexGrow: 1, paddingTop: 10 }}>
      {title && (
        <Typography component="div" variant="h5">
          {title} {formik.values.number}
        </Typography>
      )}
      {loadingMeetingReport && <ProgressService type="form" />}
      {!loadingMeetingReport && (
        <form onSubmit={formik.handleSubmit}>
          <Grid
            container
            spacing={{ xs: 2, md: 3 }}
            columns={{ xs: 4, sm: 8, md: 12 }}
          >
            <Grid xs={12} sm={12} md={12} item>
              <Typography component="div" variant="h6">
                Le compte rendu
              </Typography>
              {formik.values?.meetingReportItems?.map((item, index) => (
                <Grid
                  container
                  spacing={{ xs: 2, md: 3 }}
                  columns={{ xs: 4, sm: 8, md: 12 }}
                  key={index}
                >
                  <Grid xs={12} sm={4} md={4} item>
                    <Item>
                      <TheTextField
                        variant="outlined"
                        label="Raport"
                        value={item.report}
                        onChange={(e) =>
                          formik.setFieldValue(
                            `meetingReportItems.${index}.report`,
                            e.target.value,
                          )
                        }
                        disabled={loadingPost || loadingPut}
                      />
                    </Item>
                  </Grid>
                  <Grid xs={12} sm={4} md={4} item>
                    <Item>
                      <TheTextField
                        variant="outlined"
                        label="Décision"
                        multiline
                        rows={4}
                        value={item.decision}
                        onChange={(e) =>
                          formik.setFieldValue(
                            `meetingReportItems.${index}.decision`,
                            e.target.value,
                          )
                        }
                        disabled={loadingPost || loadingPut}
                      />
                    </Item>
                  </Grid>
                  <Grid xs={12} sm={4} md={4} item>
                    <Item>
                      <TheTextField
                        variant="outlined"
                        label="Point à revoir"
                        multiline
                        rows={4}
                        value={item.pointsToReview}
                        onChange={(e) =>
                          formik.setFieldValue(
                            `meetingReportItems.${index}.pointsToReview`,
                            e.target.value,
                          )
                        }
                        disabled={loadingPost || loadingPut}
                        InputProps={{
                          endAdornment: (
                            <InputAdornment position="end">
                              <IconButton
                                onClick={() => removeChecklistItem(index)}
                                edge="end"
                              >
                                <Close />
                              </IconButton>
                            </InputAdornment>
                          ),
                        }}
                      />
                    </Item>
                  </Grid>
                </Grid>
              ))}
            </Grid>
            <Grid
              xs={12}
              sm={12}
              md={12}
              item
              sx={{ display: 'flex', justifyContent: 'flex-end' }}
            >
              <Button
                variant="outlined"
                size="small"
                onClick={addChecklistItem}
                disabled={loadingPost || loadingPut}
              >
                Ajouter un élément
              </Button>
            </Grid>
          </Grid>
        </form>
      )}
    </Box>
  );
}
