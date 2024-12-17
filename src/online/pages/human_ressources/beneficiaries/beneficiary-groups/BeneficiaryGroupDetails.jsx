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

import { BENEFICIARY_GROUP_RECAP } from '../../../../../_shared/graphql/queries/BeneficiaryGroupQueries';
import ProgressService from '../../../../../_shared/services/feedbacks/ProgressService';
import { getFormatDateTime } from '../../../../../_shared/tools/functions';
import BeneficiaryItemCard from '../../../human_ressources/beneficiaries/BeneficiaryItemCard';

const Item = styled(Paper)(({ theme }) => ({
  backgroundColor: theme.palette.mode === 'dark' ? '#1A2027' : '#fff',
  ...theme.typography.body2,
  padding: theme.spacing(1),
  textAlign: 'center',
  color: theme.palette.text.secondary,
}));

export default function BeneficiaryGroupDetails() {
  let { idBeneficiaryGroup } = useParams();
  const [
    getBeneficiaryGroup,
    {
      loading: loadingBeneficiaryGroup,
      data: beneficiaryGroupData,
      error: beneficiaryGroupError,
    },
  ] = useLazyQuery(BENEFICIARY_GROUP_RECAP);
  React.useEffect(() => {
    if (idBeneficiaryGroup) {
      getBeneficiaryGroup({ variables: { id: idBeneficiaryGroup } });
    }
  }, [idBeneficiaryGroup]);

  if (loadingBeneficiaryGroup) return <ProgressService type="form" />;
  return (
    <>
      <Box sx={{ width: '100%' }}>
        <Grid container rowSpacing={1} columnSpacing={{ xs: 1, sm: 2, md: 3 }}>
          <Grid item xs={7}>
            <BeneficiaryGroupMiniInfos
              beneficiaryGroup={beneficiaryGroupData?.beneficiaryGroup}
            />
          </Grid>
          <Grid item xs={5}>
            <BeneficiaryGroupOtherInfos
              beneficiaryGroup={beneficiaryGroupData?.beneficiaryGroup}
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
                {beneficiaryGroupData?.beneficiaryGroup?.description}
              </Typography>
            </Paper>
          </Grid>
          <Grid item xs={6}>
            <Paper sx={{ padding: 2 }} variant="outlined">
              <Typography gutterBottom variant="subtitle3" component="h3">
                Observation
              </Typography>
              <Typography gutterBottom variant="subtitle1" component="div">
                {beneficiaryGroupData?.beneficiaryGroup?.observation}
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

function BeneficiaryGroupMiniInfos({ beneficiaryGroup }) {
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
        {beneficiaryGroup?.image && beneficiaryGroup?.image != '' && (
          <Grid item>
            <ButtonBase sx={{ width: 128, height: 'auto' }}>
              <Img alt="complex" src={beneficiaryGroup?.image} />
            </ButtonBase>
          </Grid>
        )}
        <Grid item xs={12} sm container>
          <Grid item xs container direction="column" spacing={2}>
            <Grid item xs>
              <Typography gutterBottom variant="subtitle1" component="div">
                Réference : <b>{beneficiaryGroup?.number}</b>
              </Typography>
              <Typography gutterBottom variant="subtitle1" component="div">
                {beneficiaryGroup?.name}
              </Typography>
              <Divider sx={{ marginTop: 2, marginBottom: 2 }} />
              <Typography variant="body2" color="text.secondary">
                <b>Crée le: </b>{' '}
                {`${getFormatDateTime(beneficiaryGroup?.createdAt)}`} <br />
                <b>Dernière modification: </b>
                {`${getFormatDateTime(beneficiaryGroup?.updatedAt)}`}
              </Typography>
              <Divider sx={{ marginTop: 2, marginBottom: 2 }} />
              <Typography variant="body2" color="text.secondary">
                <b>Date début prévue: </b>{' '}
                {`${getFormatDateTime(beneficiaryGroup?.startingDateTime)}`}{' '}
                <br />
                <b>Date fin prévue: </b>{' '}
                {`${getFormatDateTime(beneficiaryGroup?.endingDateTime)}`}
              </Typography>
            </Grid>
          </Grid>
        </Grid>
      </Grid>
    </Paper>
  );
}

function BeneficiaryGroupOtherInfos({ beneficiaryGroup }) {
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
        Les personnes accompagnées
      </Typography>
      <Grid container columns={{ xs: 12, sm: 12, md: 12 }}>
        {beneficiaryGroup?.beneficiaries?.map((beneficiary, index) => (
          <Grid item xs={12} sm={12} md={12} key={index}>
            <Item>
              <BeneficiaryItemCard beneficiary={beneficiary?.beneficiary} />
            </Item>
          </Grid>
        ))}
      </Grid>
    </Paper>
  );
}
