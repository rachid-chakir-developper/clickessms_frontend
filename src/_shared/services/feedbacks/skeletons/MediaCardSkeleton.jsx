import { styled } from '@mui/material/styles';
import Box from '@mui/material/Box';
import Typography from '@mui/material/Typography';
import Avatar from '@mui/material/Avatar';
import Grid from '@mui/material/Grid';
import Skeleton from '@mui/material/Skeleton';
import { Card, Stack } from '@mui/material';

const Image = styled('img')({
  width: '100%',
});

function SkeletonChildrenDemo({ loading = false }) {

  return (
      <Card variant="outlined" sx={{ p: 1, display: 'flex', alignItems: 'center', gap: 2, }}>
        <Skeleton variant="rectangular" width="100%">
          <div style={{ paddingTop: '57%' }} />
        </Skeleton>
      <Stack direction="column" spacing={2} alignItems="center">
        <Stack direction="column" style={{ width: "100%" }} spacing={0.2} alignItems="center">
          <Skeleton animation="wave" height={14} width="60%" style={{ marginBottom: 2 }} />
          <Skeleton animation="wave" height={10} width="80%" />
        </Stack>
        <Stack direction="row" alignItems="center" spacing={1.5}>
          <Skeleton animation="wave" variant="circular" width={40} height={40} />
          <Skeleton animation="wave" variant="circular" width={40} height={40} />
          <Skeleton animation="wave" variant="circular" width={40} height={40} />
          <Skeleton animation="wave" variant="circular" width={40} height={40} />
        </Stack>
      </Stack>
    </Card>
  );
}

export default function MediaCardSkeleton() {
  return (
    <Grid container spacing={8}>
      <Grid item xs>
        <SkeletonChildrenDemo loading />
      </Grid>
    </Grid>
  );
}
