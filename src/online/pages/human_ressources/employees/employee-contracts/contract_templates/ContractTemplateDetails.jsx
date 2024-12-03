import { useLazyQuery } from '@apollo/client';
import * as React from 'react';
import { Link, useParams } from 'react-router-dom';
import { styled } from '@mui/material/styles';
import {
  Box,
  Grid,
  Paper,
  ButtonBase,
  Typography,
  Divider,
  Stack,
  Button,
} from '@mui/material';

import { GET_CONTRACT_TEMPLATE_RECAP } from '../../../../../../_shared/graphql/queries/ContractTemplateQueries';
import ProgressService from '../../../../../../_shared/services/feedbacks/ProgressService';
import { Edit, FileCopy } from '@mui/icons-material';
import { useAuthorizationSystem } from '../../../../../../_shared/context/AuthorizationSystemProvider';

const Item = styled(Paper)(({ theme }) => ({
  backgroundColor: theme.palette.mode === 'dark' ? '#1A2027' : '#fff',
  ...theme.typography.body2,
  padding: theme.spacing(1),
  textAlign: 'center',
  color: theme.palette.text.secondary,
}));

const Img = styled('img')({
  margin: 'auto',
  display: 'block',
  maxWidth: '100%',
  maxHeight: '100%',
});

export default function ContractTemplateDetails() {
  const authorizationSystem = useAuthorizationSystem();
  const canManageSceModules = authorizationSystem.requestAuthorization({
    type: 'manageSceModules',
  }).authorized;
  let { idContractTemplate } = useParams();
  const [
    getContractTemplate,
    {
      loading: loadingContractTemplate,
      data: contractTemplateData,
      error: contractTemplateError,
    },
  ] = useLazyQuery(GET_CONTRACT_TEMPLATE_RECAP);
  React.useEffect(() => {
    if (idContractTemplate) {
      getContractTemplate({ variables: { id: idContractTemplate } });
    }
  }, [idContractTemplate]);

  if (loadingContractTemplate) return <ProgressService type="form" />;
  return (
    <>
      <Box sx={{ width: '100%' }}>
        {canManageSceModules && <Box sx={{ display: 'flex', justifyContent: 'flex-end', my: 1 }}>
          <Link
            to={`/online/ressources-humaines/contrats/templates/modifier/${contractTemplateData?.contractTemplate?.id}`}
            className="no_style"
          >
            <Button variant="outlined" endIcon={<Edit />}>
              Modifier
            </Button>
          </Link>
        </Box>}
        <Grid
            container
            spacing={{ xs: 2, md: 3 }}
            columns={{ xs: 4, sm: 8, md: 12 }}
          >
            <Grid item xs={12} sm={8} md={8}>
              <Typography gutterBottom variant="subtitle3" component="h2">
              {contractTemplateData?.contractTemplate?.title}
              </Typography>
              <Paper sx={{ padding: 4, marginTop: 5 }} variant="outlined">
                <Typography
                      gutterBottom
                      component="div"
                      dangerouslySetInnerHTML={{ __html: contractTemplateData?.contractTemplate?.content }}
                    />
              </Paper>
            </Grid>
            <Grid item xs={12} sm={4} md={4}>
              {contractTemplateData?.contractTemplate?.image && contractTemplateData?.contractTemplate?.image != '' && (
                <Box sx={{ paddingBottom: 3 }}>
                  <ButtonBase sx={{ width: 200, height: 'auto' }}>
                    <Img alt="complex" src={contractTemplateData?.contractTemplate?.image} />
                  </ButtonBase>
                </Box>
              )}
            </Grid>
          </Grid>
      </Box>
    </>
  );
}

