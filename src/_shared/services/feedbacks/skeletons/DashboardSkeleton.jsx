import * as React from 'react';
import Skeleton from '@mui/material/Skeleton';
import { Grid } from '@mui/material';

export default function DashboardSkeleton() {
  return (
    <Grid container spacing={3} style={{ marginTop: 4 }}>
      <Grid item xs={4}>
        <Skeleton animation="wave" variant="rounded" height={100} />
      </Grid>
      <Grid item xs={4}>
        <Skeleton animation="wave" variant="rounded" height={100} />
      </Grid>
      <Grid item xs={4}>
        <Skeleton animation="wave" variant="rounded" height={100} />
      </Grid>
      <Grid item xs={8}>
        <Skeleton animation="wave" variant="rounded" height={200} />
      </Grid>
      <Grid item xs={4}>
        <Skeleton animation="wave" variant="rounded" height={200} />
      </Grid>
      <Grid item xs={12}>
        <Skeleton animation="wave" variant="rounded" height={200} />
      </Grid>
      <Grid item xs={4}>
        <Skeleton animation="wave" variant="rounded" height={200} />
      </Grid>
      <Grid item xs={4}>
        <Skeleton animation="wave" variant="rounded" height={200} />
      </Grid>
      <Grid item xs={4}>
        <Skeleton animation="wave" variant="rounded" height={200} />
      </Grid>
    </Grid>
  );
}
