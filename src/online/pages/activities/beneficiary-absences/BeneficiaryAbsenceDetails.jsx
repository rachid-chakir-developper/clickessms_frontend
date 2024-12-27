import { useLazyQuery } from '@apollo/client';
import * as React from 'react';
import { Link, useParams } from 'react-router-dom';
import { styled } from '@mui/material/styles';
import { Box, Grid, Paper, Typography, Divider, Chip, Button, Stack, List } from '@mui/material';

import { BENEFICIARY_ABSENCE_RECAP } from '../../../../_shared/graphql/queries/BeneficiaryAbsenceQueries';
import ProgressService from '../../../../_shared/services/feedbacks/ProgressService';
import { getFormatDate, getFormatDateTime } from '../../../../_shared/tools/functions';
import BeneficiaryItemCard from '../../human_ressources/beneficiaries/BeneficiaryItemCard';
import { Edit } from '@mui/icons-material';
import BeneficiaryChip from '../../human_ressources/beneficiaries/BeneficiaryChip';
import EmployeeChip from '../../human_ressources/employees/EmployeeChip';

const Item = styled(Paper)(({ theme }) => ({
  backgroundColor: theme.palette.mode === 'dark' ? '#1A2027' : '#fff',
  ...theme.typography.body2,
  padding: theme.spacing(1),
  textAlign: 'center',
  color: theme.palette.text.secondary,
}));

export default function BeneficiaryAbsenceDetails() {
  let { idBeneficiaryAbsence } = useParams();
  const [
    getBeneficiaryAbsence,
    {
      loading: loadingBeneficiaryAbsence,
      data: beneficiaryAbsenceData,
      error: beneficiaryAbsenceError,
    },
  ] = useLazyQuery(BENEFICIARY_ABSENCE_RECAP);
  React.useEffect(() => {
    if (idBeneficiaryAbsence) {
      getBeneficiaryAbsence({ variables: { id: idBeneficiaryAbsence } });
    }
  }, [idBeneficiaryAbsence]);

  if (loadingBeneficiaryAbsence) return <ProgressService type="form" />;
  return (
    <>
      <Box sx={{ display: 'flex', justifyContent: 'flex-end', my: 2 }}>
        <Box sx={{marginX: 2}}>
          <Link
            to={`/online/activites/absences-beneficiaires/liste`}
            className="no_style"
          >
            <Button variant="text" startIcon={<List />}  size="small">
              Retour à la Liste
            </Button>
          </Link>
        </Box>
        <Link to={`/online/activites/absences-beneficiaires/modifier/${beneficiaryAbsenceData?.beneficiaryAbsence?.id}`} className="no_style">
          <Button variant="outlined" startIcon={<Edit />} size="small">
            Modifier
          </Button>
        </Link>
      </Box>
      <Box sx={{ width: '100%' }}>
        <Grid container rowSpacing={1} columnSpacing={{ xs: 1, sm: 2, md: 3 }}>
          <Grid item xs={7}>
            <BeneficiaryAbsenceMiniInfos
              beneficiaryAbsence={beneficiaryAbsenceData?.beneficiaryAbsence}
            />
          </Grid>
          <Grid item xs={5}>
            <BeneficiaryAbsenceOtherInfos
              beneficiaryAbsence={beneficiaryAbsenceData?.beneficiaryAbsence}
            />
          </Grid>
          <Grid item xs={12} sx={{ marginTop: 3, marginBottom: 3 }}>
            <Divider />
          </Grid>
          <Grid item xs={6}>
            <Paper sx={{ padding: 2 }} variant="outlined">
              <Typography gutterBottom variant="subtitle3" component="h3">
                Commentaire
              </Typography>
              <Typography gutterBottom variant="subtitle1" component="div">
                {beneficiaryAbsenceData?.beneficiaryAbsence?.comment}
              </Typography>
            </Paper>
          </Grid>
          <Grid item xs={6}>
            <Paper sx={{ padding: 2 }} variant="outlined">
              <Typography gutterBottom variant="subtitle3" component="h3">
                Observation
              </Typography>
              <Typography gutterBottom variant="subtitle1" component="div">
                {beneficiaryAbsenceData?.beneficiaryAbsence?.observation}
              </Typography>
            </Paper>
          </Grid>
        </Grid>
      </Box>
    </>
  );
}

const Img = styled('img')({
  margin: 'auto',
  display: 'block',
  maxWidth: '100%',
  maxHeight: '100%',
});

function BeneficiaryAbsenceMiniInfos({ beneficiaryAbsence }) {
  return (
    <>
      <Paper
        variant="outlined"
        sx={{
          p: 2,
          margin: 'auto',
          //maxWidth: 500,
          flexGrow: 1,
          backgroundColor: (theme) =>
            theme.palette.mode === 'dark' ? '#1A2027' : '#fff',
        }}
      >
        <Grid container spacing={2}>
          <Grid item xs={12} sm container>
            <Grid item xs container direction="column" spacing={2}>
              <Grid item xs>
                <Typography gutterBottom variant="subtitle1" component="div">
                  Réference : <b>{beneficiaryAbsence?.number}</b>
                </Typography>
                <Typography gutterBottom variant="subtitle1" component="div">
                  {beneficiaryAbsence?.title}
                </Typography>
                <Divider sx={{ marginTop: 2, marginBottom: 2 }} />
                <Typography variant="body2" color="text.secondary">
                  <b>Crée le: </b>{' '}
                  {`${getFormatDateTime(beneficiaryAbsence?.createdAt)}`} <br />
                  <b>Dernière modification: </b>
                  {`${getFormatDateTime(beneficiaryAbsence?.updatedAt)}`}
                </Typography>
                <Divider sx={{ marginTop: 2, marginBottom: 2 }} />
                <Typography variant="body2" color="text.secondary">
                  <b>Date début: </b>{' '}
                  {`${getFormatDate(beneficiaryAbsence?.startingDateTime)}`}{' '}
                  <br />
                  <b>Date fin: </b>{' '}
                  {`${getFormatDate(beneficiaryAbsence?.endingDateTime)}`}
                </Typography>
              </Grid>
            </Grid>
          </Grid>
        </Grid>
      </Paper>
      <Paper
        variant="outlined"
        sx={{
          p: 2,
          margin: 'auto',
          marginTop: 2,
          flexGrow: 1,
          backgroundColor: (theme) =>
            theme.palette.mode === 'dark' ? '#1A2027' : '#fff',
        }}
      >
        <Typography gutterBottom variant="subtitle3" component="h3">
          Motif
        </Typography>
        {beneficiaryAbsence?.reasons?.map((reason, index) => (
          <Chip
            color="info"
            key={index}
            label={reason?.name}
            sx={{ marginRight: 1 }}
          />
        ))}
        {beneficiaryAbsence?.otherReasons && beneficiaryAbsence?.otherReasons!=='' && <Chip label={beneficiaryAbsence?.otherReasons} />}
      </Paper>
    </>
  );
}

function BeneficiaryAbsenceOtherInfos({ beneficiaryAbsence }) {
  return (
    <Paper
      variant="outlined"
      sx={{
        p: 2,
        margin: 'auto',
        flexGrow: 1,
        backgroundColor: (theme) =>
          theme.palette.mode === 'dark' ? '#1A2027' : '#fff',
      }}
    >
      {beneficiaryAbsence?.employee && (
          <Paper sx={{ padding: 1, marginY:1 }} variant="outlined">
            <Typography variant="h6" gutterBottom>
              Déclaré par:
            </Typography>
            <Stack direction="row" flexWrap='wrap' spacing={1}>
            <EmployeeChip employee={beneficiaryAbsence?.employee} />
            </Stack>
          </Paper>
      )}
      {beneficiaryAbsence?.beneficiaries?.length > 0 && (
          <Paper sx={{ padding: 1, marginY:1 }} variant="outlined">
            <Typography variant="h6" gutterBottom>
              Personnes accompagnées
            </Typography>
            <Stack direction="row" flexWrap='wrap' spacing={1}>
              {beneficiaryAbsence?.beneficiaries?.map((beneficiary, index) => (
                <BeneficiaryChip key={index} beneficiary={beneficiary?.beneficiary} />
              ))}
            </Stack>
          </Paper>
      )}
    </Paper>
  );
}
