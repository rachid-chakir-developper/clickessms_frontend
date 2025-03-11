import React from 'react';
import List from '@mui/material/List';
import ListItem from '@mui/material/ListItem';
import ListItemText from '@mui/material/ListItemText';
import ListItemAvatar from '@mui/material/ListItemAvatar';
import Avatar from '@mui/material/Avatar';
import Divider from '@mui/material/Divider';
import Typography from '@mui/material/Typography';
import { Grid, ListSubheader, Stack } from '@mui/material';
import styled from '@emotion/styled';
import ProgressService from '../../../../_shared/services/feedbacks/ProgressService';
import { Link } from 'react-router-dom';

const Item = styled(Stack)(({ theme }) => ({
  backgroundColor: theme.palette.mode === 'dark' ? '#1A2027' : '#fff',
  ...theme.typography.body2,
  padding: theme.spacing(2),
  color: theme.palette.text.secondary,
}));

const SearchResultList = ({ results, loading, keyword }) => {
  return (
    <Grid container spacing={2}>
      <Grid item xs={12} md={6}>
        <Item>
          <List
            sx={{ width: '100%', maxWidth: 360, bgcolor: 'background.paper' }}
            subheader={
              <ListSubheader sx={{ fontSize: 20, fontWeight: 700 }}>
                Les structures
              </ListSubheader>
            }
          >
            {loading && <ProgressService type="searchResults" />}
            {!loading && results?.establishments?.totalCount < 1 && (
              <small>
                Aucune structure trouvée avec{' '}
                <b>
                  "<em>{keyword}</em>"
                </b>
              </small>
            )}
            {results?.establishments?.nodes?.map((establishment, index) => (
              <React.Fragment key={index}>
                <Link
                  to={`/online/associations/structures/details/${establishment?.id}`}
                  className="no_style"
                >
                  <ListItem alignItems="flex-start">
                    <ListItemAvatar>
                      <Avatar
                        alt={`Avatar ${index + 1}`}
                        src={
                          establishment?.logo ? establishment?.logo : '/default-placeholder.jpg'
                        }
                      />
                    </ListItemAvatar>
                    <ListItemText
                      primary={establishment?.name}
                      secondary={
                        <React.Fragment>
                          {establishment?.address && <Typography
                            sx={{ display: 'block' }}
                            component="span"
                            variant="body2"
                            color="text.primary"
                          >
                            {establishment?.address}
                          </Typography>}
                          {establishment?.siret && <Typography
                            sx={{ display: 'block' }}
                            component="span"
                            variant="body2"
                            color="text.primary"
                          >
                            {establishment?.siret}
                          </Typography>}
                        </React.Fragment>
                      }
                    />
                  </ListItem>
                </Link>
                <Divider variant="inset" component="li" />
              </React.Fragment>
            ))}
          </List>
        </Item>
      </Grid>
      <Grid item xs={12} md={6}>
        <Item>
          <List
            sx={{ width: '100%', maxWidth: 360, bgcolor: 'background.paper' }}
            subheader={
              <ListSubheader sx={{ fontSize: 20, fontWeight: 700 }}>
                Les employés
              </ListSubheader>
            }
          >
            {loading && <ProgressService type="searchResults" />}
            {!loading && results?.employees?.totalCount < 1 && (
              <small>
                Aucun employé trouvé avec{' '}
                <b>
                  "<em>{keyword}</em>"
                </b>
              </small>
            )}
            {results?.employees?.nodes?.map((employee, index) => (
              <React.Fragment key={index}>
                <Link
                  to={`/online/ressources-humaines/employes/details/${employee?.id}`}
                  className="no_style"
                >
                  <ListItem alignItems="flex-start">
                    <ListItemAvatar>
                      <Avatar
                        alt={`Avatar ${index + 1}`}
                        src={
                          employee?.photo
                            ? employee?.photo
                            : '/default-placeholder.jpg'
                        }
                      />
                    </ListItemAvatar>
                    <ListItemText
                      primary={`${employee?.firstName} ${employee?.lastName}`}
                      secondary={
                        <React.Fragment>
                          {employee?.email && <Typography
                            sx={{ display: 'block' }}
                            component="span"
                            variant="body2"
                            color="text.primary"
                          >
                            {employee?.position}
                          </Typography>}
                          {employee?.email && <Typography
                            sx={{ display: 'block' }}
                            variant="body2"
                            color="text.primary"
                          >
                            {employee?.email}
                          </Typography>}
                        </React.Fragment>
                      }
                    />
                  </ListItem>
                </Link>
                <Divider variant="inset" component="li" />
              </React.Fragment>
            ))}
          </List>
        </Item>
      </Grid>
      <Grid item xs={12} md={6}>
        <Item>
          <List
            sx={{ width: '100%', maxWidth: 360, bgcolor: 'background.paper' }}
            subheader={
              <ListSubheader sx={{ fontSize: 20, fontWeight: 700 }}>
                Les personnes accompagnées
              </ListSubheader>
            }
          >
            {loading && <ProgressService type="searchResults" />}
            {!loading && results?.beneficiaries?.totalCount < 1 && (
              <small>
                Aucune personne accompagnée trouvé avec{' '}
                <b>
                  "<em>{keyword}</em>"
                </b>
              </small>
            )}
            {results?.beneficiaries?.nodes?.map((beneficiary, index) => (
              <React.Fragment key={index}>
                <Link
                  to={`/online/ressources-humaines/beneficiaires/details/${beneficiary?.id}`}
                  className="no_style"
                >
                  <ListItem alignItems="flex-start">
                    <ListItemAvatar>
                      <Avatar
                        alt={`Avatar ${index + 1}`}
                        src={
                          beneficiary?.photo
                            ? beneficiary?.photo
                            : '/default-placeholder.jpg'
                        }
                      />
                    </ListItemAvatar>
                    <ListItemText
                      primary={`${beneficiary?.firstName} ${beneficiary?.lastName}`}
                      secondary={
                        <React.Fragment>
                          {beneficiary?.address && <Typography
                            sx={{ display: 'block' }}
                            component="span"
                            variant="body2"
                            color="text.primary"
                          >
                            {beneficiary?.address}
                          </Typography>}
                        </React.Fragment>
                      }
                    />
                  </ListItem>
                </Link>
                <Divider variant="inset" component="li" />
              </React.Fragment>
            ))}
          </List>
        </Item>
      </Grid>
      <Grid item xs={12} md={6}>
        <Item>
          <List
            sx={{ width: '100%', maxWidth: 360, bgcolor: 'background.paper' }}
            subheader={
              <ListSubheader sx={{ fontSize: 20, fontWeight: 700 }}>
                Les fournisseurs
              </ListSubheader>
            }
          >
            {loading && <ProgressService type="searchResults" />}
            {!loading && results?.suppliers?.totalCount < 1 && (
              <small>
                Aucun fournisseur trouvé avec{' '}
                <b>
                  "<em>{keyword}</em>"
                </b>
              </small>
            )}
            {results?.suppliers?.nodes?.map((supplier, index) => (
              <React.Fragment key={index}>
                <Link
                  to={`/online/achats/fournisseurs/details/${supplier?.id}`}
                  className="no_style"
                >
                  <ListItem alignItems="flex-start">
                    <ListItemAvatar>
                      <Avatar
                        alt={`Avatar ${index + 1}`}
                        src={
                          supplier?.image
                            ? supplier?.image
                            : '/default-placeholder.jpg'
                        }
                      />
                    </ListItemAvatar>
                    <ListItemText
                      primary={supplier?.name}
                      secondary={
                        <React.Fragment>
                          <Typography
                            sx={{ display: 'block' }}
                            component="span"
                            variant="body2"
                            color="text.primary"
                          >
                            {supplier?.address}
                          </Typography>
                          {` — ${supplier?.email}`}
                        </React.Fragment>
                      }
                    />
                  </ListItem>
                </Link>
                <Divider variant="inset" component="li" />
              </React.Fragment>
            ))}
          </List>
        </Item>
      </Grid>
    </Grid>
  );
};

export default SearchResultList;
