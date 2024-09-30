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

import { GET_POST_RECAP } from '../../../../_shared/graphql/queries/PostQueries';
import ProgressService from '../../../../_shared/services/feedbacks/ProgressService';
import { Edit, FileCopy } from '@mui/icons-material';
import { useAuthorizationSystem } from '../../../../_shared/context/AuthorizationSystemProvider';

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

export default function PostDetails() {
  const authorizationSystem = useAuthorizationSystem();
  const canManageSceModules = authorizationSystem.requestAuthorization({
    type: 'manageSceModules',
  }).authorized;
  let { idPost } = useParams();
  const [
    getPost,
    {
      loading: loadingPost,
      data: postData,
      error: postError,
    },
  ] = useLazyQuery(GET_POST_RECAP);
  React.useEffect(() => {
    if (idPost) {
      getPost({ variables: { id: idPost } });
    }
  }, [idPost]);

  if (loadingPost) return <ProgressService type="form" />;
  return (
    <>
      <Box sx={{ width: '100%' }}>
        {canManageSceModules && <Box sx={{ display: 'flex', justifyContent: 'flex-end', my: 1 }}>
          <Link
            to={`/online/cse/articles/modifier/${postData?.post?.id}`}
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
              {postData?.post?.title}
              </Typography>
              <Paper sx={{ padding: 4, marginTop: 5 }} variant="outlined">
                <Typography
                      gutterBottom
                      component="div"
                      dangerouslySetInnerHTML={{ __html: postData?.post?.content }}
                    />
              </Paper>
            </Grid>
            <Grid item xs={12} sm={4} md={4}>
              {postData?.post?.image && postData?.post?.image != '' && (
                <Box sx={{ paddingBottom: 3 }}>
                  <ButtonBase sx={{ width: 200, height: 'auto' }}>
                    <Img alt="complex" src={postData?.post?.image} />
                  </ButtonBase>
                </Box>
              )}
              {postData?.post?.files && postData?.post?.files?.length > 0 && <Box>
                <Stack direction="column" spacing={1}>
                  <Typography gutterBottom variant="subtitle4" component="h4">
                    Pièces jointes
                  </Typography>
                    {postData?.post?.files?.map((file, index) => (
                      <FileCard key={index} file={file} />
                    ))}
                </Stack>
              </Box>}
            </Grid>
          </Grid>
      </Box>
    </>
  );
}


const FileCard = ({ file }) => {
  return (
      <Box 
      sx={{ 
          display: 'flex', 
          alignItems: 'center', 
          marginBottom: '10px', 
          border: '1px solid #ccc', 
          padding: '10px', 
          borderRadius: '4px' 
      }}
      >
      <a href={file?.file} target="_blank">
          <FileCopy sx={{ marginRight: '10px' }} />
      </a>
      <a href={file?.file} target="_blank"><Typography variant="body1" sx={{ flexGrow: 1 }}>
            {file.caption}
        </Typography>
      </a>
      </Box>
  );
};
