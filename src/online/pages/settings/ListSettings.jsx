import * as React from 'react';
import { styled } from '@mui/material/styles';
import {
  Box,
  Grid,
  Stack,
  Button,
  Card,
  CardMedia,
  Typography,
} from '@mui/material';
import { Link } from 'react-router-dom';

// Style personnalisé pour chaque item
const Item = styled(Stack)(({ theme }) => ({
  backgroundColor: theme.palette.mode === 'dark' ? '#1A2027' : '#fff',
  ...theme.typography.body2,
  padding: theme.spacing(2),
  textAlign: 'center',
  color: theme.palette.text.secondary,
}));

// Liste des paramètres à afficher
const settings = [
  {
    title: "Les informations de l'association",
    link: '/online/parametres/association',
    buttonLabel: 'Modifier',
  },
  {
    title: 'Gestion des modules',
    link: '/online/parametres/association/modules',
    buttonLabel: 'Modifier',
  },
  {
    title: "Les media et urls de l'association",
    link: '/online/parametres/association/medias',
    buttonLabel: 'Modifier',
  },
  {
    title: 'Les messages et notifications',
    link: '/online/parametres/message-notifications',
    buttonLabel: 'Gérer',
  },
  {
    title: 'Les liste déroulantes',
    link: '/online/parametres/listes-deroulantes',
    buttonLabel: 'Gérer',
  },
  {
    title: 'Les formulaires personnalisés',
    link: '/online/parametres/formulaires-personnalises',
    buttonLabel: 'Gérer',
  },
  {
    title: 'Les workflows',
    link: '/online/parametres/workflows',
    buttonLabel: 'Gérer',
  },
];

// Composant de carte
const SettingCard = ({ title, link, buttonLabel }) => (
  <Grid item xs={12} sm={6} md={4}>
    <Item>
      <Card
        variant="outlined"
        sx={{
          p: 1,
          boxShadow: '0 1px 3px rgba(0, 127, 255, 0.1)',
          display: 'flex',
          flexDirection: {
            xs: 'column',
            sm: 'row',
          },
        }}
      >
        <CardMedia
          component="img"
          width="100"
          height="100"
          alt={title}
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
            {title}
          </Typography>
          <Link to={link} className="no_style">
            <Button variant="outlined">{buttonLabel}</Button>
          </Link>
        </Stack>
      </Card>
    </Item>
  </Grid>
);

// Composant principal
export default function ListSettings() {
  return (
    <Box sx={{ flexGrow: 1 }}>
      <Grid container spacing={2}>
        {settings.map((setting, index) => (
          <SettingCard key={index} {...setting} />
        ))}
      </Grid>
    </Box>
  );
}
