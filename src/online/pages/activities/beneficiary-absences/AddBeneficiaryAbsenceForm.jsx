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
import { useFeedBacks } from '../../../../_shared/context/feedbacks/FeedBacksProvider';
import { GET_BENEFICIARY_ABSENCE } from '../../../../_shared/graphql/queries/BeneficiaryAbsenceQueries';
import {
  POST_BENEFICIARY_ABSENCE,
  PUT_BENEFICIARY_ABSENCE,
} from '../../../../_shared/graphql/mutations/BeneficiaryAbsenceMutations';
import ProgressService from '../../../../_shared/services/feedbacks/ProgressService';
import TheDateTimePicker from '../../../../_shared/components/form-fields/TheDateTimePicker';
import { GET_BENEFICIARIES } from '../../../../_shared/graphql/queries/BeneficiaryQueries';
import TheAutocomplete from '../../../../_shared/components/form-fields/TheAutocomplete';
import { GET_EMPLOYEES } from '../../../../_shared/graphql/queries/EmployeeQueries';
import SelectCheckmarks from '../../../../_shared/components/form-fields/SelectCheckmarks';
import { GET_DATAS_BENEFICIARY_ABSENCE } from '../../../../_shared/graphql/queries/DataQueries';

const Item = styled(Stack)(({ theme }) => ({
  backgroundColor: theme.palette.mode === 'dark' ? '#1A2027' : '#fff',
  ...theme.typography.body2,
  padding: theme.spacing(2),
  textAlign: 'center',
  color: theme.palette.text.secondary,
}));

export default function AddBeneficiaryAbsenceForm({
  idBeneficiaryAbsence,
  title,
}) {
  const { setNotifyAlert, setConfirmDialog } = useFeedBacks();
  const navigate = useNavigate();
  const validationSchema = yup.object({});
  const formik = useFormik({
    initialValues: {
      number: '',
      title: '',
      startingDateTime: dayjs(new Date()),
      endingDateTime: dayjs(new Date()),
      comment: '',
      observation: '',
      beneficiaries: [],
      employee: null,
      reasons: [],
      otherReasons: '',
    },
    validationSchema: validationSchema,
    onSubmit: (values) => {
      let beneficiaryAbsenceCopy = { ...values };
      beneficiaryAbsenceCopy.beneficiaries =
        beneficiaryAbsenceCopy.beneficiaries.map((i) => i?.id);
      beneficiaryAbsenceCopy.reasons = beneficiaryAbsenceCopy.reasons.map(
        (i) => i?.id,
      );
      beneficiaryAbsenceCopy.employee = beneficiaryAbsenceCopy.employee
        ? beneficiaryAbsenceCopy.employee.id
        : null;
      if (idBeneficiaryAbsence && idBeneficiaryAbsence != '') {
        onUpdateBeneficiaryAbsence({
          id: beneficiaryAbsenceCopy.id,
          beneficiaryAbsenceData: beneficiaryAbsenceCopy,
        });
      } else
        createBeneficiaryAbsence({
          variables: {
            beneficiaryAbsenceData: beneficiaryAbsenceCopy,
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

  const {
    loading: loadingDatas,
    data: dataData,
    error: datsError,
    fetchMore: fetchMoreDatas,
  } = useQuery(GET_DATAS_BENEFICIARY_ABSENCE, { fetchPolicy: 'network-only' });

  const [createBeneficiaryAbsence, { loading: loadingPost }] = useMutation(
    POST_BENEFICIARY_ABSENCE,
    {
      onCompleted: (data) => {
        console.log(data);
        setNotifyAlert({
          isOpen: true,
          message: 'Ajouté avec succès',
          type: 'success',
        });
        let { __typename, ...beneficiaryAbsenceCopy } =
          data.createBeneficiaryAbsence.beneficiaryAbsence;
        //   formik.setValues(beneficiaryAbsenceCopy);
        navigate('/online/activites/absences-beneficiaires/liste');
      },
      update(cache, { data: { createBeneficiaryAbsence } }) {
        const newBeneficiaryAbsence =
          createBeneficiaryAbsence.beneficiaryAbsence;

        cache.modify({
          fields: {
            beneficiaryAbsences(
              existingBeneficiaryAbsences = { totalCount: 0, nodes: [] },
            ) {
              return {
                totalCount: existingBeneficiaryAbsences.totalCount + 1,
                nodes: [
                  newBeneficiaryAbsence,
                  ...existingBeneficiaryAbsences.nodes,
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
  const [updateBeneficiaryAbsence, { loading: loadingPut }] = useMutation(
    PUT_BENEFICIARY_ABSENCE,
    {
      onCompleted: (data) => {
        console.log(data);
        setNotifyAlert({
          isOpen: true,
          message: 'Modifié avec succès',
          type: 'success',
        });
        let { __typename, ...beneficiaryAbsenceCopy } =
          data.updateBeneficiaryAbsence.beneficiaryAbsence;
        //   formik.setValues(beneficiaryAbsenceCopy);
        navigate('/online/activites/absences-beneficiaires/liste');
      },
      update(cache, { data: { updateBeneficiaryAbsence } }) {
        const updatedBeneficiaryAbsence =
          updateBeneficiaryAbsence.beneficiaryAbsence;

        cache.modify({
          fields: {
            beneficiaryAbsences(
              existingBeneficiaryAbsences = { totalCount: 0, nodes: [] },
              { readField },
            ) {
              const updatedBeneficiaryAbsences =
                existingBeneficiaryAbsences.nodes.map((beneficiaryAbsence) =>
                  readField('id', beneficiaryAbsence) ===
                  updatedBeneficiaryAbsence.id
                    ? updatedBeneficiaryAbsence
                    : beneficiaryAbsence,
                );

              return {
                totalCount: existingBeneficiaryAbsences.totalCount,
                nodes: updatedBeneficiaryAbsences,
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
  const onUpdateBeneficiaryAbsence = (variables) => {
    setConfirmDialog({
      isOpen: true,
      title: 'ATTENTION',
      subTitle: 'Voulez vous vraiment modifier ?',
      onConfirm: () => {
        setConfirmDialog({ isOpen: false });
        updateBeneficiaryAbsence({ variables });
      },
    });
  };
  const [getBeneficiaryAbsence, { loading: loadingBeneficiaryAbsence }] =
    useLazyQuery(GET_BENEFICIARY_ABSENCE, {
      fetchPolicy: 'network-only',
      onCompleted: (data) => {
        let { __typename, ...beneficiaryAbsenceCopy1 } =
          data.beneficiaryAbsence;
        let { folder, ...beneficiaryAbsenceCopy } = beneficiaryAbsenceCopy1;
        beneficiaryAbsenceCopy.startingDateTime = dayjs(
          beneficiaryAbsenceCopy.startingDateTime,
        );
        beneficiaryAbsenceCopy.endingDateTime = dayjs(
          beneficiaryAbsenceCopy.endingDateTime,
        );
        beneficiaryAbsenceCopy.beneficiaries =
          beneficiaryAbsenceCopy.beneficiaries
            ? beneficiaryAbsenceCopy.beneficiaries.map((i) => i?.beneficiary)
            : [];
        formik.setValues(beneficiaryAbsenceCopy);
      },
      onError: (err) => console.log(err),
    });
  React.useEffect(() => {
    if (idBeneficiaryAbsence) {
      getBeneficiaryAbsence({ variables: { id: idBeneficiaryAbsence } });
    }
  }, [idBeneficiaryAbsence]);
  return (
    <Box sx={{ flexGrow: 1 }}>
      <Typography component="div" variant="h5">
        {title} {formik.values.title}
      </Typography>
      {loadingBeneficiaryAbsence && <ProgressService type="form" />}
      {!loadingBeneficiaryAbsence && (
        <form onSubmit={formik.handleSubmit}>
          <Grid
            container
            spacing={{ xs: 2, md: 3 }}
            columns={{ xs: 4, sm: 8, md: 12 }}
          >
            <Grid item xs={12} sm={6} md={4}>
              <Item>
                <TheTextField
                  variant="outlined"
                  label="Libellé"
                  value={formik.values.title}
                  onChange={(e) =>
                    formik.setFieldValue('title', e.target.value)
                  }
                  disabled={loadingPost || loadingPut}
                />
              </Item>
            </Grid>
            <Grid item xs={12} sm={6} md={4}>
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
            <Grid item xs={12} sm={6} md={4}>
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
            <Grid item xs={12} sm={6} md={4}>
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
                  helperText="Laissez ce champ vide si c'est pour vous."
                  onChange={(e, newValue) =>
                    formik.setFieldValue('employee', newValue)
                  }
                />
              </Item>
            </Grid>
            <Grid item xs={12} sm={6} md={4} >
              <Item>
                <TheAutocomplete
                  options={beneficiariesData?.beneficiaries?.nodes}
                        onInput={(e) => {
                          onGetBeneficiaries(e.target.value)
                        }}
                  label="Personnes accompagnées"
                  placeholder="Ajouter une personne accompagnée"
                  limitTags={3}
                  value={formik.values.beneficiaries}
                  onChange={(e, newValue) =>
                    formik.setFieldValue('beneficiaries', newValue)
                  }
                />
              </Item>
            </Grid>
            <Grid item xs={12} sm={6} md={4} >
              <Item>
                <SelectCheckmarks
                  options={dataData?.absenceReasons}
                  label="Motifs"
                  placeholder="Ajouter un motif"
                  limitTags={3}
                  value={formik.values.reasons}
                  onChange={(e, newValue) =>
                    formik.setFieldValue('reasons', newValue)
                  }
                />
              </Item>
              <Item>
                <TheTextField
                  variant="outlined"
                  label="Autres motifs"
                  value={formik.values.otherReasons}
                  onChange={(e) =>
                    formik.setFieldValue('otherReasons', e.target.value)
                  }
                  helperText="Si vous ne trouvez pas le motif dans la liste dessus."
                  disabled={loadingPost || loadingPut}
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
                  label="Commentaire"
                  multiline
                  rows={4}
                  value={formik.values.comment}
                  onChange={(e) =>
                    formik.setFieldValue('comment', e.target.value)
                  }
                  disabled={loadingPost || loadingPut}
                />
              </Item>
            </Grid>
            <Grid item xs={12} sm={12} md={12}>
              <Item sx={{ justifyContent: 'end', flexDirection: 'row' }}>
                <Link
                  to="/online/activites/absences-beneficiaires/liste"
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
