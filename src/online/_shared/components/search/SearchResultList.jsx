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
                <List sx={{ width: '100%', maxWidth: 360, bgcolor: 'background.paper' }}
                    subheader={<ListSubheader sx={{ fontSize: 20, fontWeight : 700}}>Les interventions</ListSubheader>}>
                    { loading && <ProgressService type="searchResults" /> }
                    { !loading && results?.tasks?.totalCount < 1 && <small>Aucune intervention trouvée avec <b>"<em>{keyword}</em>"</b></small>}
                    {results?.tasks?.nodes?.map((task, index) => (
                        <React.Fragment key={index}>
                            <Link to={`/online/travaux/interventions/details/${task?.id}`} className="no_style">
                                <ListItem alignItems="flex-start">
                                    <ListItemAvatar>
                                    <Avatar alt={`Avatar ${index + 1}`} src={ task?.image ? task?.image : "https://mui.com/static/images/cards/real-estate.png"} />
                                    </ListItemAvatar>
                                    <ListItemText
                                    primary={task?.name}
                                    secondary={
                                        <React.Fragment>
                                        <Typography
                                            sx={{ display: 'inline' }}
                                            component="span"
                                            variant="body2"
                                            color="text.primary"
                                        >
                                            {task?.address}
                                        </Typography>
                                        {` — ${task?.client?.name}`}
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
                <List sx={{ width: '100%', maxWidth: 360, bgcolor: 'background.paper' }}
                    subheader={<ListSubheader sx={{ fontSize: 20, fontWeight : 700}}>Les employés</ListSubheader>}>
                    { loading && <ProgressService type="searchResults" /> }
                    { !loading && results?.employees?.totalCount < 1 && <small>Aucun employé trouvé avec <b>"<em>{keyword}</em>"</b></small>}
                    {results?.employees?.nodes?.map((employee, index) => (
                        <React.Fragment key={index}>
                            <Link to={`/online/employes/modifier/${employee?.id}`} className="no_style">
                                <ListItem alignItems="flex-start">
                                    <ListItemAvatar>
                                    <Avatar alt={`Avatar ${index + 1}`} src={ employee?.photo ? employee?.photo : "https://mui.com/static/images/cards/real-estate.png"} />
                                    </ListItemAvatar>
                                    <ListItemText
                                    primary={`${employee?.firstName} ${employee?.lastName}`}
                                    secondary={
                                        <React.Fragment>
                                        <Typography
                                            sx={{ display: 'inline' }}
                                            component="span"
                                            variant="body2"
                                            color="text.primary"
                                        >
                                            {employee?.email}
                                        </Typography>
                                        {` — ${employee?.position}`}
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
                <List sx={{ width: '100%', maxWidth: 360, bgcolor: 'background.paper' }}
                    subheader={<ListSubheader sx={{ fontSize: 20, fontWeight : 700}}>Les clients</ListSubheader>}>
                    { loading && <ProgressService type="searchResults" /> }
                    { !loading && results?.clients?.totalCount < 1 && <small>Aucun client trouvé avec <b>"<em>{keyword}</em>"</b></small>}
                    {results?.clients?.nodes?.map((client, index) => (
                        <React.Fragment key={index}>
                            <Link to={`/online/ventes/clients/modifier/${client?.id}`} className="no_style">
                                <ListItem alignItems="flex-start">
                                    <ListItemAvatar>
                                    <Avatar alt={`Avatar ${index + 1}`} src={ client?.image ? client?.image : "https://mui.com/static/images/cards/real-estate.png"} />
                                    </ListItemAvatar>
                                    <ListItemText
                                    primary={client?.name}
                                    secondary={
                                        <React.Fragment>
                                        <Typography
                                            sx={{ display: 'inline' }}
                                            component="span"
                                            variant="body2"
                                            color="text.primary"
                                        >
                                            {client?.address}
                                        </Typography>
                                        {` — ${client?.email}`}
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
                <List sx={{ width: '100%', maxWidth: 360, bgcolor: 'background.paper' }}
                    subheader={<ListSubheader sx={{ fontSize: 20, fontWeight : 700}}>Les fournisseurs</ListSubheader>}>
                    { loading && <ProgressService type="searchResults" /> }
                    { !loading && results?.suppliers?.totalCount < 1 && <small>Aucun fournisseur trouvé avec <b>"<em>{keyword}</em>"</b></small>}
                    {results?.suppliers?.nodes?.map((supplier, index) => (
                        <React.Fragment key={index}>
                            <Link to={`/online/achats/fournisseurs/modifier/${supplier?.id}`} className="no_style">
                                <ListItem alignItems="flex-start">
                                    <ListItemAvatar>
                                    <Avatar alt={`Avatar ${index + 1}`} src={ supplier?.image ? supplier?.image : "https://mui.com/static/images/cards/real-estate.png"} />
                                    </ListItemAvatar>
                                    <ListItemText
                                    primary={supplier?.name}
                                    secondary={
                                        <React.Fragment>
                                        <Typography
                                            sx={{ display: 'inline' }}
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
