import * as React from 'react';
import { experimentalStyled as styled } from '@mui/material/styles';
import Grid from '@mui/material/Unstable_Grid2';
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
  const validationSchema = yup.object({
    title: yup
      .string("Entrez le nom d'absence")
      .required("Le nom d'absence est obligatoire"),
  });
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
        {title} {formik.values.number}
      </Typography>
      {loadingBeneficiaryAbsence && <ProgressService type="form" />}
      {!loadingBeneficiaryAbsence && (
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
            <Grid xs={2} sm={4} md={4} item>
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
            <Grid xs={12} sm={12} md={12}>
              <Divider variant="middle" />
            </Grid>
            <Grid xs={12} sm={6} md={6}>
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
