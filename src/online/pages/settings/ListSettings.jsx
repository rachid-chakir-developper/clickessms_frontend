import * as React from 'react';
import { styled } from '@mui/material/styles';
import Box from '@mui/material/Box';
import Grid from '@mui/material/Grid';
import { Button, Card, CardMedia, Stack, Typography } from '@mui/material';
import { Link } from 'react-router-dom';

const Item = styled(Stack)(({ theme }) => ({
  backgroundColor: theme.palette.mode === 'dark' ? '#1A2027' : '#fff',
  ...theme.typography.body2,
  padding: theme.spacing(2),
  textAlign: 'center',
  color: theme.palette.text.secondary,
}));

export default function ListSettings() {
  return (
    <Box sx={{ flexGrow: 1 }}>
      <Grid container spacing={2}>
        <Grid item xs={4}>
          <Item>
            <Card
              variant="outlined"
              sx={{
                p: 1,
                boxShadow: '0 1px 3px rgba(0, 127, 255, 0.1)',
                display: 'flex',
                flexDirection: {
                  xs: 'column', // mobile
                  sm: 'row', // tablet and up
                },
              }}
            >
              <CardMedia
                component="img"
                width="100"
                height="100"
                alt="123 Main St, Phoenix, AZ cover"
                src="/default-placeholder.jpg"
                sx={{
                  borderRadius: 0.5,
                  width: { xs: '100%', sm: 100 },
                  mr: { sm: 1.5 },
                  mb: { xs: 1.5, sm: 0 },
                }}
              />
              <Stack sx={{ alignSelf: 'center', ml: 2, width: '100%' }}>
                <Typography
                  variant="h6"
                  color="text.secondary"
                  fontWeight="medium"
                  sx={{ mb: 1 }}
                >
                  Les informations de l'association
                </Typography>
                <Link to="/online/parametres/association" className="no_style">
                  <Button variant="outlined">Modifier</Button>
                </Link>
              </Stack>
            </Card>
          </Item>
        </Grid>
        <Grid item xs={4}>
          <Item>
            <Card
              variant="outlined"
              sx={{
                p: 1,
                boxShadow: '0 1px 3px rgba(0, 127, 255, 0.1)',
                display: 'flex',
                flexDirection: {
                  xs: 'column', // mobile
                  sm: 'row', // tablet and up
                },
              }}
            >
              <CardMedia
                component="img"
                width="100"
                height="100"
                alt="123 Main St, Phoenix, AZ cover"
                src="/default-placeholder.jpg"
                sx={{
                  borderRadius: 0.5,
                  width: { xs: '100%', sm: 100 },
                  mr: { sm: 1.5 },
                  mb: { xs: 1.5, sm: 0 },
                }}
              />
              <Stack sx={{ alignSelf: 'center', ml: 2, width: '100%' }}>
                <Typography
                  variant="h6"
                  color="text.secondary"
                  fontWeight="medium"
                  sx={{ mb: 1 }}
                >
                  Les liste déroulantes
                </Typography>
                <Link
                  to="/online/parametres/listes-deroulantes"
                  className="no_style"
                >
                  <Button variant="outlined">Modifier</Button>
                </Link>
              </Stack>
            </Card>
          </Item>
        </Grid>
      </Grid>
    </Box>
  );
}
