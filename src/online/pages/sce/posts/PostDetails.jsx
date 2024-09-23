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

import { GET_POST_RECAP } from '../../../../_shared/graphql/queries/PostQueries';
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

export default function PostDetails() {
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
        <Grid container rowSpacing={1} columnSpacing={{ xs: 1, sm: 2, md: 3 }}>
          <Grid item xs={12}>
            <PostMiniInfos post={postData?.post} />
          </Grid>
          <Grid item xs={12}>
            <Paper sx={{ padding: 2 }} variant="outlined">
              <Typography
                  gutterBottom
                  component="div"
                  dangerouslySetInnerHTML={{ __html: postData?.post?.content }}
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

function PostMiniInfos({ post }) {
  return (
      <Grid container spacing={2}>
        {post?.image && post?.image != '' && (
          <Grid item>
            <ButtonBase sx={{ width: 128, height: 'auto' }}>
              <Img alt="complex" src={post?.image} />
            </ButtonBase>
          </Grid>
        )}
        <Grid item xs={12} sm container>
          <Grid item xs container direction="column" spacing={2}>
            <Grid item xs>
              <Typography gutterBottom variant="subtitle3" component="h2">
              {post?.title}
              </Typography>
            </Grid>
          </Grid>
        </Grid>
      </Grid>
  );
}

