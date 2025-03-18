import { useLazyQuery } from '@apollo/client';
import * as React from 'react';
import { Link, useParams } from 'react-router-dom';
import { styled } from '@mui/material/styles';
import { Box, Grid, Paper, Typography, Divider, Chip, Button, Stack } from '@mui/material';

import { EMPLOYEE_ABSENCE_RECAP } from '../../../../_shared/graphql/queries/EmployeeAbsenceQueries';
import ProgressService from '../../../../_shared/services/feedbacks/ProgressService';
import { getFormatDateTime, getFormatDate, getLeaveTypeLabel } from '../../../../_shared/tools/functions';
import EmployeeItemCard from '../../human_ressources/employees/EmployeeItemCard';
import { Edit, ArrowBack, Description, Note, Event, Group, Category, Folder } from '@mui/icons-material';

const Item = styled(Paper)(({ theme }) => ({
  backgroundColor: theme.palette.mode === 'dark' ? '#1A2027' : '#fff',
  ...theme.typography.body2,
  padding: theme.spacing(1),
  textAlign: 'center',
  color: theme.palette.text.secondary,
}));

export default function EmployeeAbsenceDetails() {
  let { idEmployeeAbsence } = useParams();
  const [
    getEmployeeAbsence,
    {
      loading: loadingEmployeeAbsence,
      data: employeeAbsenceData,
      error: employeeAbsenceError,
    },
  ] = useLazyQuery(EMPLOYEE_ABSENCE_RECAP);
  React.useEffect(() => {
    if (idEmployeeAbsence) {
      getEmployeeAbsence({ variables: { id: idEmployeeAbsence } });
    }
  }, [idEmployeeAbsence]);

  if (loadingEmployeeAbsence) return <ProgressService type="form" />;
  return (
    <>
      <Box sx={{ display: 'flex', justifyContent: 'space-between', my: 1 }}>
        <Link
          to="/online/planning/absences-employes/liste"
          className="no_style"
        >
          <Button variant="outlined" startIcon={<ArrowBack />}>
            Retour à la liste
          </Button>
        </Link>
        <Link
          to={`/online/planning/absences-employes/modifier/${employeeAbsenceData?.employeeAbsence?.id}`}
          className="no_style"
        >
          <Button variant="outlined" endIcon={<Edit />}>
            Modifier
          </Button>
        </Link>
      </Box>
      <Box sx={{ width: '100%' }}>
        <Grid container rowSpacing={1} columnSpacing={{ xs: 1, sm: 2, md: 3 }}>
          <Grid item xs={7}>
            <EmployeeAbsenceMiniInfos
              employeeAbsence={employeeAbsenceData?.employeeAbsence}
            />
          </Grid>
          <Grid item xs={5}>
            <EmployeeAbsenceOtherInfos
              employeeAbsence={employeeAbsenceData?.employeeAbsence}
            />
          </Grid>
          <Grid item xs={12} sx={{ marginTop: 3, marginBottom: 3 }}>
            <Divider />
          </Grid>
          <Grid item xs={6}>
            <Paper sx={{ padding: 2 }} variant="outlined">
              <Typography gutterBottom variant="subtitle3" component="h3" sx={{ display: 'flex', alignItems: 'center' }}>
                <Description sx={{ marginRight: 1 }} /> Commentaire
              </Typography>
              <Typography gutterBottom variant="subtitle1" component="div">
                {employeeAbsenceData?.employeeAbsence?.comment || employeeAbsenceData?.employeeAbsence?.message || "Aucun commentaire"}
              </Typography>
            </Paper>
          </Grid>
          <Grid item xs={6}>
            <Paper sx={{ padding: 2 }} variant="outlined">
              <Typography gutterBottom variant="subtitle3" component="h3" sx={{ display: 'flex', alignItems: 'center' }}>
                <Note sx={{ marginRight: 1 }} /> Observation
              </Typography>
              <Typography gutterBottom variant="subtitle1" component="div">
                {employeeAbsenceData?.employeeAbsence?.observation || "Aucune observation"}
              </Typography>
            </Paper>
          </Grid>
          {employeeAbsenceData?.employeeAbsence?.document && (
            <Grid item xs={12} sx={{ marginTop: 2 }}>
              <Paper sx={{ padding: 2 }} variant="outlined">
                <Typography gutterBottom variant="subtitle3" component="h3" sx={{ display: 'flex', alignItems: 'center' }}>
                  <Folder sx={{ marginRight: 1 }} /> Justificatif
                </Typography>
                <Box sx={{ mt: 1 }}>
                  <Button
                    variant="outlined"
                    component="a"
                    href={employeeAbsenceData.employeeAbsence.document}
                    target="_blank"
                    rel="noopener noreferrer"
                  >
                    Consulter le justificatif
                  </Button>
                </Box>
              </Paper>
            </Grid>
          )}
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

function EmployeeAbsenceMiniInfos({ employeeAbsence }) {
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
                  Référence : <b>{employeeAbsence?.number}</b>
                </Typography>
                <Typography gutterBottom variant="subtitle1" component="div">
                  {employeeAbsence?.title}
                </Typography>
                <Divider sx={{ marginTop: 2, marginBottom: 2 }} />
                <Stack direction="row" spacing={1} alignItems="center" sx={{ mb: 1 }}>
                  <Category fontSize="small" />
                  <Typography variant="body2" color="text.secondary">
                    <b>Type d'absence:</b> {getLeaveTypeLabel(employeeAbsence?.leaveType)}
                  </Typography>
                </Stack>
                <Divider sx={{ marginTop: 2, marginBottom: 2 }} />
                <Stack direction="row" spacing={1} alignItems="center" sx={{ mb: 1 }}>
                  <Event fontSize="small" />
                  <Typography variant="body2" color="text.secondary">
                    <b>Date début:</b> {getFormatDate(employeeAbsence?.startingDateTime)}
                  </Typography>
                </Stack>
                <Stack direction="row" spacing={1} alignItems="center" sx={{ mb: 1 }}>
                  <Event fontSize="small" />
                  <Typography variant="body2" color="text.secondary">
                    <b>Date fin:</b> {getFormatDate(employeeAbsence?.endingDateTime)}
                  </Typography>
                </Stack>
                <Stack direction="row" spacing={1} alignItems="center" sx={{ mb: 1 }}>
                  <Event fontSize="small" />
                  <Typography variant="body2" color="text.secondary">
                    <b>Durée:</b> {employeeAbsence?.duration} {employeeAbsence?.duration > 1 ? 'jours' : 'jour'}
                  </Typography>
                </Stack>
                <Divider sx={{ marginTop: 2, marginBottom: 2 }} />
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
        <Typography gutterBottom variant="subtitle3" component="h3" sx={{ display: 'flex', alignItems: 'center' }}>
          <Category sx={{ marginRight: 1 }} /> Motifs
        </Typography>
        <Box>
          {employeeAbsence?.reasons?.map((reason, index) => (
            <Chip
              color="info"
              key={index}
              label={reason?.name}
              sx={{ marginRight: 1, marginBottom: 1 }}
            />
          ))}
          {employeeAbsence?.otherReasons && (
            <Chip 
              label={employeeAbsence?.otherReasons} 
              variant="filled" 
              color="primary"
              sx={{ marginRight: 1, marginBottom: 1 }} 
            />
          )}
          {(!employeeAbsence?.reasons || employeeAbsence?.reasons.length === 0) && !employeeAbsence?.otherReasons && (
            <Typography variant="body2" color="text.secondary">
              Aucun motif spécifié
            </Typography>
          )}
        </Box>
      </Paper>
    </>
  );
}

function EmployeeAbsenceOtherInfos({ employeeAbsence }) {
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
      <Typography gutterBottom variant="subtitle3" component="h3" sx={{ display: 'flex', alignItems: 'center' }}>
        <Group sx={{ marginRight: 1 }} /> Les Employés
      </Typography>
      <Grid container columns={{ xs: 12, sm: 12, md: 12 }}>
        {employeeAbsence?.employees?.map((employee, index) => (
          <Grid item xs={12} sm={12} md={12} key={index}>
            <Item>
              <EmployeeItemCard employee={employee?.employee} />
            </Item>
          </Grid>
        ))}
        {employeeAbsence?.employee && (
          <Grid item xs={12} sm={12} md={12} sx={{ mt: 2 }}>
            <Paper sx={{ padding: 2 }} variant="outlined">
              <Typography variant="subtitle3" gutterBottom>
                Déclaré par:
              </Typography>
              <EmployeeItemCard employee={employeeAbsence?.employee} />
            </Paper>
          </Grid>
        )}
      </Grid>
    </Paper>
  );
}
