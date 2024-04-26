import * as React from 'react';
import Skeleton from '@mui/material/Skeleton';
import { Grid } from '@mui/material';

export default function FormSkeleton() {
  return (
    <Grid container spacing={3} style={{ marginTop: 4 }}>
      <Grid item xs={4}>
        <Skeleton animation="wave" variant="rounded" height={70} />
      </Grid>
      <Grid item xs={4}>
        <Skeleton
          animation="wave"
          variant="rounded"
          style={{ marginBottom: 10 }}
          height={30}
        />
        <Skeleton animation="wave" variant="rounded" height={30} />
      </Grid>
      <Grid item xs={4}>
        <Skeleton
          animation="wave"
          variant="rounded"
          style={{ marginBottom: 10 }}
          height={30}
        />
        <Skeleton animation="wave" variant="rounded" height={30} />
      </Grid>
      <Grid item xs={4}>
        <Skeleton animation="wave" variant="rounded" height={30} />
      </Grid>
      <Grid item xs={2}>
        <Skeleton animation="wave" variant="rounded" height={30} />
      </Grid>
      <Grid item xs={2}>
        <Skeleton animation="wave" variant="rounded" height={30} />
      </Grid>
      <Grid item xs={4}>
        <Skeleton animation="wave" variant="rounded" height={30} />
      </Grid>
      <Grid item xs={3}>
        <Skeleton animation="wave" variant="rounded" height={30} />
      </Grid>
      <Grid item xs={3}>
        <Skeleton animation="wave" variant="rounded" height={30} />
      </Grid>
      <Grid item xs={6}>
        <Skeleton animation="wave" variant="rounded" height={30} />
      </Grid>
      <Grid item xs={4}>
        <Skeleton animation="wave" variant="rounded" height={50} />
      </Grid>
      <Grid item xs={4}>
        <Skeleton animation="wave" variant="rounded" height={50} />
      </Grid>
      <Grid item xs={4}></Grid>
    </Grid>
  );
}
