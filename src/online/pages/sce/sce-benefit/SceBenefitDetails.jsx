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
} from '@mui/material';

import { GET_SCE_BENEFIT_RECAP } from '../../../../_shared/graphql/queries/SceBenefitQueries';
import ProgressService from '../../../../_shared/services/feedbacks/ProgressService';
import {
  getFormatDateTime,
  formatCurrencyAmount,
} from '../../../../_shared/tools/functions';
import EstablishmentItemCard from '../../companies/establishments/EstablishmentItemCard';

const Item = styled(Paper)(({ theme }) => ({
  backgroundColor: theme.palette.mode === 'dark' ? '#1A2027' : '#fff',
  ...theme.typography.body2,
  padding: theme.spacing(1),
  textAlign: 'center',
  color: theme.palette.text.secondary,
}));

export default function SceBenefitDetails() {
  let { idSceBenefit } = useParams();
  const [
    getSceBenefit,
    {
      loading: loadingSceBenefit,
      data: sceBenefitData,
      error: sceBenefitError,
    },
  ] = useLazyQuery(GET_SCE_BENEFIT_RECAP);
  React.useEffect(() => {
    if (idSceBenefit) {
      getSceBenefit({ variables: { id: idSceBenefit } });
    }
  }, [idSceBenefit]);

  if (loadingSceBenefit) return <ProgressService type="form" />;
  return (
    <>
      <Box sx={{ width: '100%' }}>
        <Grid container rowSpacing={1} columnSpacing={{ xs: 1, sm: 2, md: 3 }}>
          <Grid item xs={12}>
            <SceBenefitMiniInfos sceBenefit={sceBenefitData?.sceBenefit} />
          </Grid>
          <Grid item xs={12}>
            <Paper sx={{ padding: 2 }} variant="outlined">
              <Typography
                gutterBottom
                component="div"
                dangerouslySetInnerHTML={{ __html: sceBenefitData?.sceBenefit?.content }}
              />
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

function SceBenefitMiniInfos({ sceBenefit }) {
  return (
      <Grid container spacing={2}>
        {sceBenefit?.image && sceBenefit?.image != '' && (
          <Grid item>
            <ButtonBase sx={{ width: 128, height: 'auto' }}>
              <Img alt="complex" src={sceBenefit?.image} />
            </ButtonBase>
          </Grid>
        )}
        <Grid item xs={12} sm container>
          <Grid item xs container direction="column" spacing={2}>
            <Grid item xs>
              <Typography gutterBottom variant="subtitle3" component="h2">
              {sceBenefit?.title}
              </Typography>
            </Grid>
          </Grid>
        </Grid>
      </Grid>
  );
}

function SceBenefitOtherInfos({ sceBenefit }) {
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
      {sceBenefit?.establishment && (
        <>
          <Typography variant="h6" gutterBottom>
            Structure
          </Typography>
          <Paper sx={{ padding: 2 }} variant="outlined">
            <Item>
              <EstablishmentItemCard
                establishment={sceBenefit?.establishment}
              />
            </Item>
          </Paper>
        </>
      )}
    </Paper>
  );
}