import '@fontsource/roboto/300.css';
import '@fontsource/roboto/400.css';
import '@fontsource/roboto/500.css';
import '@fontsource/roboto/700.css';

import './App.css';

import ApolloProvider from './ApolloProvider';
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import { createTheme, ThemeProvider } from '@mui/material/styles';
import { LocalizationProvider } from '@mui/x-date-pickers';
import { AdapterDayjs } from '@mui/x-date-pickers/AdapterDayjs';
import 'dayjs/locale/fr'; // Importer le local français pour Day.js

import Offline from './offline/Offline';
import Online from './online/Online';
import { FeedBacksProvider } from './_shared/context/feedbacks/FeedBacksProvider';
import { SessionProvider } from './_shared/context/SessionProvider';
import AuthGuardRoute from './_shared/guards/AuthGuardRoute';
import { Box } from '@mui/material';
import Auth from './online/pages/auth/Auth';

// Configurer Day.js pour utiliser le local français
// dayjs.locale('fr');

function App() {
  const defaultTheme = createTheme();
  // Créer un objet de thème avec les couleurs personnalisées
  const theme = createTheme({
    palette: {
      primary: {
        main: '#432cf3', // Couleur principale
      },
      secondary: {
        main: '#003539', // Couleur secondaire
        contrastText: '#333333',
      },
      yellow: {
        main: '#FFda2a', // Jaune pur
      },
    },
  });

  return (
    <Box sx={{ flexGrow: 1, p: 3, width: '100%', minHeight: '100vh', boxSizing: 'border-box'}}>
      <ThemeProvider theme={theme}>
        <ApolloProvider>
          <SessionProvider>
            <FeedBacksProvider>
              <LocalizationProvider dateAdapter={AdapterDayjs} locale="fr">
                <BrowserRouter>
                  <Routes>
                    <Route
                      path="/offline/*"
                      element={
                          <Offline />
                      }
                    />
                    <Route
                      path="/online/*"
                      element={
                        <AuthGuardRoute authenticated>
                          <Online />
                        </AuthGuardRoute>
                      }
                    />
                    <Route
                      path="/connexion/*"
                      element={
                        <AuthGuardRoute mustChangePassword>
                          <Auth />
                        </AuthGuardRoute>
                      }
                    />
                    <Route
                      path="/"
                      element={<Navigate to="online" replace />}
                    />
                    <Route
                      path="login"
                      element={<Navigate to="/offline" replace />}
                    />
                  </Routes>
                </BrowserRouter>
              </LocalizationProvider>
            </FeedBacksProvider>
          </SessionProvider>
        </ApolloProvider>
      </ThemeProvider>
    </Box>
  );
}

export default App;
