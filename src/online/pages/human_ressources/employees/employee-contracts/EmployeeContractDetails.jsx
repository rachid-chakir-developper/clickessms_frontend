import { useLazyQuery } from '@apollo/client';
import * as React from 'react';
import { useParams, Link } from 'react-router-dom';
import { styled } from '@mui/material/styles';
import {
  Box,
  Grid,
  Paper,
  ButtonBase,
  Typography,
  Divider,
  Button,
} from '@mui/material';
import { ArrowBack } from '@mui/icons-material';

import { EMPLOYEE_CONTRACT_RECAP } from '../../../../../_shared/graphql/queries/EmployeeContractQueries';
import ProgressService from '../../../../../_shared/services/feedbacks/ProgressService';
import { getFormatDateTime, getFormatDate } from '../../../../../_shared/tools/functions';
import EmployeeItemCard from '../../../human_ressources/employees/EmployeeItemCard';

const Item = styled(Paper)(({ theme }) => ({
  backgroundColor: theme.palette.mode === 'dark' ? '#1A2027' : '#fff',
  ...theme.typography.body2,
  padding: theme.spacing(1),
  textAlign: 'center',
  color: theme.palette.text.secondary,
}));

export default function EmployeeContractDetails() {
  let { idEmployeeContract } = useParams();
  const [
    getEmployeeContract,
    {
      loading: loadingEmployeeContract,
      data: employeeContractData,
      error: employeeContractError,
    },
  ] = useLazyQuery(EMPLOYEE_CONTRACT_RECAP);
  React.useEffect(() => {
    if (idEmployeeContract) {
      getEmployeeContract({ variables: { id: idEmployeeContract } });
    }
  }, [idEmployeeContract]);

  if (loadingEmployeeContract) return <ProgressService type="form" />;
  return (
    <>
      <Box sx={{ display: 'flex', justifyContent: 'space-between', my: 1 }}>
        <Link
          to="/online/ressources-humaines/contrats/liste"
          className="no_style"
        >
          <Button variant="outlined" startIcon={<ArrowBack />}>
            Retour à la liste
          </Button>
        </Link>
        <Link
          to={`/online/ressources-humaines/contrats/modifier/${employeeContractData?.employeeContract?.id}`}
          className="no_style"
        >
          <Button variant="outlined">
            Modifier
          </Button>
        </Link>
      </Box>
      <Box sx={{ width: '100%' }}>
        <Grid container rowSpacing={1} columnSpacing={{ xs: 1, sm: 2, md: 3 }}>
          <Grid item xs={7}>
            <EmployeeContractMiniInfos
              employeeContract={employeeContractData?.employeeContract}
            />
          </Grid>
          <Grid item xs={5}>
            <EmployeeContractOtherInfos
              employeeContract={employeeContractData?.employeeContract}
            />
          </Grid>
          <Grid item xs={12} sx={{ marginTop: 3, marginBottom: 3 }}>
            <Divider />
          </Grid>
          <Grid item xs={6}>
            <Paper sx={{ padding: 2 }} variant="outlined">
              <Typography gutterBottom variant="subtitle3" component="h3">
                Description
              </Typography>
              <Typography gutterBottom variant="subtitle1" component="div">
                {employeeContractData?.employeeContract?.description}
              </Typography>
            </Paper>
          </Grid>
          <Grid item xs={6}>
            <Paper sx={{ padding: 2 }} variant="outlined">
              <Typography gutterBottom variant="subtitle3" component="h3">
                Observation
              </Typography>
              <Typography gutterBottom variant="subtitle1" component="div">
                {employeeContractData?.employeeContract?.observation}
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

function EmployeeContractMiniInfos({ employeeContract }) {
  return (
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
        {employeeContract?.image && employeeContract?.image != '' && (
          <Grid item>
            <ButtonBase sx={{ width: 128, height: 'auto' }}>
              <Img alt="complex" src={employeeContract?.image} />
            </ButtonBase>
          </Grid>
        )}
        <Grid item xs={12} sm container>
          <Grid item xs container direction="column" spacing={2}>
            <Grid item xs>
              <Typography gutterBottom variant="subtitle1" component="div">
                Référence : <b>{employeeContract?.number}</b>
              </Typography>
              <Typography gutterBottom variant="subtitle1" component="div">
                {employeeContract?.title}
              </Typography>
              <Divider sx={{ marginTop: 2, marginBottom: 2 }} />
              <Typography variant="body2" gutterBottom>
                <b>Type de contrat :</b> {employeeContract?.contractType || 'Non spécifié'}
              </Typography>
              <Typography variant="body2" gutterBottom>
                <b>Poste :</b> {employeeContract?.position || 'Non spécifié'}
              </Typography>
              <Typography variant="body2" gutterBottom>
                <b>Salaire mensuel brut :</b> {employeeContract?.monthlyGrossSalary || 0} €
              </Typography>
              <Typography variant="body2" gutterBottom>
                <b>Salaire :</b> {employeeContract?.salary || 0} €
              </Typography>
              <Divider sx={{ marginTop: 2, marginBottom: 2 }} />
              <Typography variant="body2" gutterBottom>
                <b>Jours de congés payés initiaux :</b> {employeeContract?.initialPaidLeaveDays || 0}
              </Typography>
              <Typography variant="body2" gutterBottom>
                <b>Jours de RTT initiaux :</b> {employeeContract?.initialRwtDays || 0}
              </Typography>
              <Typography variant="body2" gutterBottom>
                <b>Jours temporaires initiaux :</b> {employeeContract?.initialTemporaryDays || 0}
              </Typography>
              <Divider sx={{ marginTop: 2, marginBottom: 2 }} />
              <Divider sx={{ marginTop: 2, marginBottom: 2 }} />
              <Typography variant="body2" color="text.secondary">
                <b>Date début: </b>{' '}
                {`${getFormatDate(employeeContract?.startingDate)}`} <br />
                <b>Date fin: </b>{' '}
                {employeeContract?.endingDate ? `${getFormatDate(employeeContract?.endingDate)}` : 'Non définie'}
              </Typography>
            </Grid>
          </Grid>
        </Grid>
      </Grid>
    </Paper>
  );
}

function EmployeeContractOtherInfos({ employeeContract }) {
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
      <Typography gutterBottom variant="subtitle3" component="h3">
        Les employés
      </Typography>
      <Grid container columns={{ xs: 12, sm: 12, md: 12 }}>
        {employeeContract?.employees?.map((employee, index) => (
          <Grid item xs={12} sm={12} md={12} key={index}>
            <Item>
              <EmployeeItemCard employee={employee?.employee} />
            </Item>
          </Grid>
        ))}
      </Grid>
    </Paper>
  );
}
