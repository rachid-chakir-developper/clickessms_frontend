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
import { useLazyQuery, useMutation, useQuery } from '@apollo/client';
import { useFormik } from 'formik';
import * as yup from 'yup';

import TheTextField from '../../../../_shared/components/form-fields/TheTextField';
import ImageFileField from '../../../../_shared/components/form-fields/ImageFileField';
import TheDesktopDatePicker from '../../../../_shared/components/form-fields/TheDesktopDatePicker';
import { useFeedBacks } from '../../../../_shared/context/feedbacks/FeedBacksProvider';
import { GET_EVENT } from '../../../../_shared/graphql/queries/EventQueries';
import {
  POST_EVENT,
  PUT_EVENT,
} from '../../../../_shared/graphql/mutations/EventMutations';
import ProgressService from '../../../../_shared/services/feedbacks/ProgressService';
import TheSwitch from '../../../../_shared/components/form-fields/theSwitch';
import TheDateTimePicker from '../../../../_shared/components/form-fields/TheDateTimePicker';
import { GET_BENEFICIARIES } from '../../../../_shared/graphql/queries/BeneficiaryQueries';
import TheAutocomplete from '../../../../_shared/components/form-fields/TheAutocomplete';
import { GET_EMPLOYEES } from '../../../../_shared/graphql/queries/EmployeeQueries';

const Item = styled(Stack)(({ theme }) => ({
  backgroundColor: theme.palette.mode === 'dark' ? '#1A2027' : '#fff',
  ...theme.typography.body2,
  padding: theme.spacing(2),
  textAlign: 'center',
  color: theme.palette.text.secondary,
}));

export default function AddEventForm({ idEvent, title }) {
  const { setNotifyAlert, setConfirmDialog } = useFeedBacks();
  const navigate = useNavigate();
  const validationSchema = yup.object({
    title: yup
      .string("Entrez le titre d'événement")
      .required("Le titre d'événement est obligatoire"),
  });
  const formik = useFormik({
    initialValues: {
      image: undefined,
      number: '',
      title: '',
      startingDateTime: dayjs(new Date()),
      endingDateTime: dayjs(new Date()),
      description: '',
      observation: '',
      isActive: true,
      beneficiaries: [],
      employee: null,
    },
    validationSchema: validationSchema,
    onSubmit: (values) => {
      let { image, ...eventCopy } = values;
      eventCopy.beneficiaries = eventCopy.beneficiaries.map((i) => i?.id);
      eventCopy.employee = eventCopy.employee ? eventCopy.employee.id : null;
      if (idEvent && idEvent != '') {
        onUpdateEvent({
          id: eventCopy.id,
          eventData: eventCopy,
          image: image,
        });
      } else
        createEvent({
          variables: {
            eventData: eventCopy,
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
    variables: { page: 1, limit: 10 },
  });
  const {
    loading: loadingEmployees,
    data: employeesData,
    error: employeesError,
    fetchMore: fetchMoreEmployees,
  } = useQuery(GET_EMPLOYEES, {
    fetchPolicy: 'network-only',
    variables: { page: 1, limit: 10 },
  });

  const [createEvent, { loading: loadingPost }] = useMutation(POST_EVENT, {
    onCompleted: (data) => {
      console.log(data);
      setNotifyAlert({
        isOpen: true,
        message: 'Ajouté avec succès',
        type: 'success',
      });
      let { __typename, ...eventCopy } = data.createEvent.event;
      //   formik.setValues(eventCopy);
      navigate('/online/activites/evenements/liste');
    },
    update(cache, { data: { createEvent } }) {
      const newEvent = createEvent.event;

      cache.modify({
        fields: {
          events(existingEvents = { totalCount: 0, nodes: [] }) {
            return {
              totalCount: existingEvents.totalCount + 1,
              nodes: [newEvent, ...existingEvents.nodes],
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
  const [updateEvent, { loading: loadingPut }] = useMutation(PUT_EVENT, {
    onCompleted: (data) => {
      console.log(data);
      setNotifyAlert({
        isOpen: true,
        message: 'Modifié avec succès',
        type: 'success',
      });
      let { __typename, ...eventCopy } = data.updateEvent.event;
      //   formik.setValues(eventCopy);
      navigate('/online/activites/evenements/liste');
    },
    update(cache, { data: { updateEvent } }) {
      const updatedEvent = updateEvent.event;

      cache.modify({
        fields: {
          events(existingEvents = { totalCount: 0, nodes: [] }, { readField }) {
            const updatedEvents = existingEvents.nodes.map((event) =>
              readField('id', event) === updatedEvent.id ? updatedEvent : event,
            );

            return {
              totalCount: existingEvents.totalCount,
              nodes: updatedEvents,
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
  const onUpdateEvent = (variables) => {
    setConfirmDialog({
      isOpen: true,
      title: 'ATTENTION',
      subTitle: 'Voulez vous vraiment modifier ?',
      onConfirm: () => {
        setConfirmDialog({ isOpen: false });
        updateEvent({ variables });
      },
    });
  };
  const [getEvent, { loading: loadingEvent }] = useLazyQuery(GET_EVENT, {
    fetchPolicy: 'network-only',
    onCompleted: (data) => {
      let { __typename, ...eventCopy1 } = data.event;
      let { folder, ...eventCopy } = eventCopy1;
      eventCopy.startingDateTime = dayjs(eventCopy.startingDateTime);
      eventCopy.endingDateTime = dayjs(eventCopy.endingDateTime);
      eventCopy.beneficiaries = eventCopy.beneficiaries
        ? eventCopy.beneficiaries.map((i) => i?.beneficiary)
        : [];
      formik.setValues(eventCopy);
    },
    onError: (err) => console.log(err),
  });
  React.useEffect(() => {
    if (idEvent) {
      getEvent({ variables: { id: idEvent } });
    }
  }, [idEvent]);
  return (
    <Box sx={{ flexGrow: 1 }}>
      <Typography component="div" variant="h5">
        {title} {formik.values.number}
      </Typography>
      {loadingEvent && <ProgressService type="form" />}
      {!loadingEvent && (
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
            </Grid>
            <Grid xs={2} sm={4} md={4}>
              <Item>
                <TheTextField
                  variant="outlined"
                  label="Titre"
                  id="title"
                  value={formik.values.title}
                  required
                  onChange={(e) =>
                    formik.setFieldValue('title', e.target.value)
                  }
                  onBlur={formik.handleBlur}
                  error={formik.touched.title && Boolean(formik.errors.title)}
                  helperText={formik.touched.title && formik.errors.title}
                  disabled={loadingPost || loadingPut}
                />
              </Item>
            </Grid>
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
                <TheDateTimePicker
                  label="Date et heure de début"
                  value={formik.values.startingDateTime}
                  onChange={(date) =>
                    formik.setFieldValue('startingDateTime', date)
                  }
                  disabled={loadingPost || loadingPut}
                />
              </Item>
              <Item>
                <TheDateTimePicker
                  label="Date de fin"
                  value={formik.values.endingDateTime}
                  onChange={(date) =>
                    formik.setFieldValue('endingDateTime', date)
                  }
                  disabled={loadingPost || loadingPut}
                />
              </Item>
            </Grid>
            <Grid xs={2} sm={4} md={4}>
              <Item>
                <TheAutocomplete
                  options={employeesData?.employees?.nodes}
                  label="Pour quel employé ?"
                  placeholder="Choisissez un employé ?"
                  multiple={false}
                  value={formik.values.employee}
                  helperText="Si c'est pour vous. laissez ce champ vide."
                  onChange={(e, newValue) =>
                    formik.setFieldValue('employee', newValue)
                  }
                />
              </Item>
            </Grid>
            <Grid xs={2} sm={4} md={4} item>
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
                  to="/online/activites/evenements/liste"
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
