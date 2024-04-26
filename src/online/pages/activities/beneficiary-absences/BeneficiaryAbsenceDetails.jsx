import { useLazyQuery } from '@apollo/client';
import * as React from 'react';
import { useParams } from 'react-router-dom';
import { styled } from '@mui/material/styles';
import {
  Box,
  Grid,
  Paper,
  ButtonBase,
  Typography,
  Divider,
  Chip,
} from '@mui/material';

import { BENEFICIARY_ABSENCE_RECAP } from '../../../../_shared/graphql/queries/BeneficiaryAbsenceQueries';
import ProgressService from '../../../../_shared/services/feedbacks/ProgressService';
import TitlebarImageList from '../../../_shared/components/media/TitlebarImageList';
import { getFormatDateTime } from '../../../../_shared/tools/functions';
import PersonCard from '../../../_shared/components/persons/PersonCard';
import BeneficiaryItemCard from '../../human_ressources/beneficiaries/BeneficiaryItemCard';

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
                  <b>Date début prévue: </b>{' '}
                  {`${getFormatDateTime(beneficiaryAbsence?.startingDateTime)}`}{' '}
                  <br />
                  <b>Date fin prévue: </b>{' '}
                  {`${getFormatDateTime(beneficiaryAbsence?.endingDateTime)}`}
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
        <Chip label={beneficiaryAbsence?.otherReasons} />
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
      <Typography gutterBottom variant="subtitle3" component="h3">
        Les Bénificiaires
      </Typography>
      <Grid container columns={{ xs: 12, sm: 12, md: 12 }}>
        {beneficiaryAbsence?.beneficiaries?.map((beneficiary, index) => (
          <Grid xs={12} sm={12} md={12} key={index}>
            <Item>
              <BeneficiaryItemCard beneficiary={beneficiary?.beneficiary} />
            </Item>
          </Grid>
        ))}
      </Grid>
    </Paper>
  );
}
