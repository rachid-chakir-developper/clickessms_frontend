import * as React from 'react';
import { experimentalStyled as styled } from '@mui/material/styles';
import Grid from '@mui/material/Grid';
import { Stack, Box, Typography, Button, Divider } from '@mui/material';
import dayjs from 'dayjs';

import { Link, useNavigate } from 'react-router-dom';
import { useLazyQuery, useMutation, useQuery } from '@apollo/client';
import { useFormik } from 'formik';
import * as yup from 'yup';

import TheTextField from '../../../../_shared/components/form-fields/TheTextField';
import ImageFileField from '../../../../_shared/components/form-fields/ImageFileField';
import { useFeedBacks } from '../../../../_shared/context/feedbacks/FeedBacksProvider';
import { GET_TRANSMISSION_EVENT } from '../../../../_shared/graphql/queries/TransmissionEventQueries';
import {
  POST_TRANSMISSION_EVENT,
  PUT_TRANSMISSION_EVENT,
} from '../../../../_shared/graphql/mutations/TransmissionEventMutations';
import ProgressService from '../../../../_shared/services/feedbacks/ProgressService';
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

export default function AddTransmissionEventForm({ idTransmissionEvent, title }) {
  const { setNotifyAlert, setConfirmDialog } = useFeedBacks();
  const navigate = useNavigate();
  const validationSchema = yup.object({});
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
      let { image, ...transmissionEventCopy } = values;
      transmissionEventCopy.beneficiaries = transmissionEventCopy.beneficiaries.map((i) => i?.id);
      transmissionEventCopy.employee = transmissionEventCopy.employee ? transmissionEventCopy.employee.id : null;
      if (idTransmissionEvent && idTransmissionEvent != '') {
        onUpdateTransmissionEvent({
          id: transmissionEventCopy.id,
          transmissionEventData: transmissionEventCopy,
          image: image,
        });
      } else
        createTransmissionEvent({
          variables: {
            transmissionEventData: transmissionEventCopy,
            image: image,
          },
        });
    },
  });
   const [getBeneficiaries, {
    loading: loadingBeneficiaries,
    data: beneficiariesData,
    error: beneficiariesError,
    fetchMore: fetchMoreBeneficiaries,
  }] = useLazyQuery(GET_BENEFICIARIES, { variables: { beneficiaryFilter : null, page: 1, limit: 10 } });

  const onGetBeneficiaries = (keyword)=>{
    getBeneficiaries({ variables: { beneficiaryFilter : keyword === '' ? null : {keyword}, page: 1, limit: 10 } })
  }
const [getEmployees, {
    loading: loadingEmployees,
    data: employeesData,
    error: employeesError,
    fetchMore: fetchMoreEmployees,
  }] = useLazyQuery(GET_EMPLOYEES, { variables: { employeeFilter : null, page: 1, limit: 10 } });
  
  const onGetEmployees = (keyword)=>{
    getEmployees({ variables: { employeeFilter : keyword === '' ? null : {keyword}, page: 1, limit: 10 } })
  }


  const [createTransmissionEvent, { loading: loadingPost }] = useMutation(POST_TRANSMISSION_EVENT, {
    onCompleted: (data) => {
      console.log(data);
      setNotifyAlert({
        isOpen: true,
        message: 'Ajouté avec succès',
        type: 'success',
      });
      let { __typename, ...transmissionEventCopy } = data.createTransmissionEvent.transmissionEvent;
      //   formik.setValues(transmissionEventCopy);
      navigate('/online/activites/evenements/liste');
    },
    update(cache, { data: { createTransmissionEvent } }) {
      const newTransmissionEvent = createTransmissionEvent.transmissionEvent;

      cache.modify({
        fields: {
          transmissionEvents(existingTransmissionEvents = { totalCount: 0, nodes: [] }) {
            return {
              totalCount: existingTransmissionEvents.totalCount + 1,
              nodes: [newTransmissionEvent, ...existingTransmissionEvents.nodes],
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
  const [updateTransmissionEvent, { loading: loadingPut }] = useMutation(PUT_TRANSMISSION_EVENT, {
    onCompleted: (data) => {
      console.log(data);
      setNotifyAlert({
        isOpen: true,
        message: 'Modifié avec succès',
        type: 'success',
      });
      let { __typename, ...transmissionEventCopy } = data.updateTransmissionEvent.transmissionEvent;
      //   formik.setValues(transmissionEventCopy);
      navigate('/online/activites/evenements/liste');
    },
    update(cache, { data: { updateTransmissionEvent } }) {
      const updatedTransmissionEvent = updateTransmissionEvent.transmissionEvent;

      cache.modify({
        fields: {
          transmissionEvents(existingTransmissionEvents = { totalCount: 0, nodes: [] }, { readField }) {
            const updatedTransmissionEvents = existingTransmissionEvents.nodes.map((transmissionEvent) =>
              readField('id', transmissionEvent) === updatedTransmissionEvent.id ? updatedTransmissionEvent : transmissionEvent,
            );

            return {
              totalCount: existingTransmissionEvents.totalCount,
              nodes: updatedTransmissionEvents,
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
  const onUpdateTransmissionEvent = (variables) => {
    setConfirmDialog({
      isOpen: true,
      title: 'ATTENTION',
      subTitle: 'Voulez vous vraiment modifier ?',
      onConfirm: () => {
        setConfirmDialog({ isOpen: false });
        updateTransmissionEvent({ variables });
      },
    });
  };
  const [getTransmissionEvent, { loading: loadingTransmissionEvent }] = useLazyQuery(GET_TRANSMISSION_EVENT, {
    fetchPolicy: 'network-only',
    onCompleted: (data) => {
      let { __typename, ...transmissionEventCopy1 } = data.transmissionEvent;
      let { folder, ...transmissionEventCopy } = transmissionEventCopy1;
      transmissionEventCopy.startingDateTime = dayjs(transmissionEventCopy.startingDateTime);
      transmissionEventCopy.endingDateTime = dayjs(transmissionEventCopy.endingDateTime);
      transmissionEventCopy.beneficiaries = transmissionEventCopy.beneficiaries
        ? transmissionEventCopy.beneficiaries.map((i) => i?.beneficiary)
        : [];
      formik.setValues(transmissionEventCopy);
    },
    onError: (err) => console.log(err),
  });
  React.useEffect(() => {
    if (idTransmissionEvent) {
      getTransmissionEvent({ variables: { id: idTransmissionEvent } });
    }
  }, [idTransmissionEvent]);
  return (
    <Box sx={{ flexGrow: 1 }}>
      <Typography component="div" variant="h5">
        {title} {formik.values.title}
      </Typography>
      {loadingTransmissionEvent && <ProgressService type="form" />}
      {!loadingTransmissionEvent && (
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
                  label="Titre"
                  value={formik.values.title}
                  required
                  onChange={(e) =>
                    formik.setFieldValue('title', e.target.value)
                  }
                  disabled={loadingPost || loadingPut}
                />
              </Item>
            </Grid>
            <Grid item xs={2} sm={4} md={4}>
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
            </Grid>
            <Grid item xs={2} sm={4} md={4}>
              <Item>
                <TheDateTimePicker
                  label="Date et heure de fin"
                  value={formik.values.endingDateTime}
                  onChange={(date) =>
                    formik.setFieldValue('endingDateTime', date)
                  }
                  disabled={loadingPost || loadingPut}
                />
              </Item>
            </Grid>
            <Grid item xs={2} sm={4} md={4}>
              <Item>
                <TheAutocomplete
                  options={employeesData?.employees?.nodes}
onInput={(e) => {
                          onGetEmployees(e.target.value)
                        }}

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
            <Grid item xs={2} sm={4} md={4} >
              <Item>
                <TheAutocomplete
                  options={beneficiariesData?.beneficiaries?.nodes}
                        onInput={(e) => {
                          onGetBeneficiaries(e.target.value)
                        }}
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
            <Grid item xs={12} sm={12} md={12}>
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
            <Grid item xs={12} sm={12} md={12}>
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
