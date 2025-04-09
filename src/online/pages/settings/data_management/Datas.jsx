import * as React from 'react';
import { experimentalStyled as styled } from '@mui/material/styles';
import {
  Grid,
  Box,
  Card,
  CardContent,
  IconButton,
  Stack,
  Typography,
  Tabs,
  Tab,
} from '@mui/material';
import { Add, List, Settings } from '@mui/icons-material';
import DialogAddData from './DialogAddData';
import DialogListDatas from './DialogListDatas';
import AccountingNatureTreeView from './accounting_natures/AccountingNatureTreeView';

const Item = styled(Stack)(({ theme }) => ({
  backgroundColor: theme.palette.mode === 'dark' ? '#1A2027' : '#fff',
  ...theme.typography.body2,
  padding: theme.spacing(2),
  textAlign: 'center',
  color: theme.palette.text.secondary,
  height: '100%',
}));

const modulesToManage = [
  {
    title: 'Ressources humaines',
    datas: [
      // { name: "Genre", description: '', type: 'HumanGender' },
      { name: "Statut professionnel", description: '', type: 'ProfessionalStatus' },
      { name: "Plateforme de travail", description: '', type: 'jobPlatform' },
      { name: 'Type de document des candidats', description: '', type: 'JobCandidateDocumentType' },
    ],
  },
  {
    title: 'Structures',
    datas: [
      {
        name: "Type de la structure",
        description: '',
        type: 'EstablishmentType',
      },
      {
        name: "Catégorie de la structure",
        description: '',
        type: 'EstablishmentCategory',
      },
    ],
  },
  {
    title: 'Activités',
    datas: [
      { name: "Status des personnes accompagnées", description: '', type: 'BeneficiaryStatus' },
      { name: "Motif de l'absence", description: '', type: 'AbsenceReason' },
      { name: 'Type de document personne accompagnée', description: '', type: 'BeneficiaryDocumentType' },
    ],
  },
  {
    title: 'Qualités',
    datas: [
      {
        name: "Types d'événement indésirable",
        description: '',
        type: 'UndesirableEventNormalType',
      },
      {
        name: "Types d'événement indésirable grave",
        description: '',
        type: 'UndesirableEventSeriousType',
      },
      {
        name: "Fréquences d'événement indésirable",
        description: '',
        type: 'UndesirableEventFrequency',
      },
    ],
  },
  {
    title: 'Administratif',
    datas: [
      { name: 'Mission d’employé dans un contrat', description: '', type: 'EmployeeMission' },
      { name: 'Type de document d’admission ', description: '', type: 'AdmissionDocumentType' },
      { name: 'Type de la réunion', description: '', type: 'TypeMeeting' },
      { name: 'Motif de la réunion', description: '', type: 'MeetingReason' },
      { name: 'Type de trame document', description: '', type: 'DocumentType' },
    ],
  },
  {
    title: 'Services généraux',
    datas: [
      { name: 'Les marques des véhicules', description: '', type: 'VehicleBrand' },
      { name: 'Les modèles des véhicules', description: '', type: 'VehicleModel' },
    ],
  },
  {
    title: 'Finance',
    datas: [
      { name: 'Type de dotation', description: '', type: 'TypeEndowment' },
    ],
  },
  {
    title: 'finance - Les natures comptables',
    type: 'AccountingNature',
  },
];

function CustomTabPanel(props) {
  const { children, value, index, ...other } = props;

  return (
    <div
      role="tabpanel"
      hidden={value !== index}
      id={`simple-tabpanel-${index}`}
      aria-labelledby={`simple-tab-${index}`}
      {...other}
    >
      {value === index && <Box sx={{ p: 3 }}>{children}</Box>}
    </div>
  );
}

export default function Datas() {
  const [value, setValue] = React.useState(0);

  const handleChange = (event, newValue) => {
    setValue(newValue);
  };
  const [openDialog, setOpenDialog] = React.useState(false);
  const [openDialogList, setOpenDialogList] = React.useState(false);
  const [data, setData] = React.useState({ name: '', type: '' });
  const handleClickAdd = (data) => {
    setOpenDialog(true);
    setData(data);
  };
  const handleClickList = (data) => {
    setOpenDialogList(true);
    setData(data);
  };
  const closeDialog = (value) => {
    setOpenDialog(false);
    if (value) {
      console.log('value', value);
    }
  };
  const closeDialogList = (value) => {
    setOpenDialogList(false);
    if (value) {
      console.log('value', value);
    }
  };
  return (
    <>
      <Box sx={{ flexGrow: 1 }}>
        <Box sx={{ width: '100%' }}>
          <Box sx={{ borderBottom: 1, borderColor: 'divider' }}>
            <Tabs
              value={value}
              onChange={handleChange}
              aria-label="basic tabs example"
            >
              {modulesToManage?.map((moduleToManage, index1) => (
                <Tab label={moduleToManage?.title} key={index1} />
              ))}
            </Tabs>
          </Box>
          {modulesToManage?.map((moduleToManage, index1) => (
            <CustomTabPanel value={value} index={index1} key={index1}>
              {moduleToManage?.type === 'AccountingNature' && <AccountingNatureTreeView />}
              <Grid
                container
                spacing={{ xs: 2, md: 3 }}
                columns={{ xs: 4, sm: 8, md: 12 }}
              >
                {moduleToManage?.datas?.map((data, index) => (
                  <Grid item xs={2} sm={4} md={4} key={index}>
                    <Item>
                      <Card sx={{ height: '100%' }}>
                        <Box
                          sx={{
                            display: 'flex',
                            flexDirection: 'row',
                            justifyContent: 'space-around',
                            height: '100%',
                          }}
                        >
                          <CardContent>
                            <Typography component="div" variant="h5">
                              {data.name}
                            </Typography>
                            <Typography
                              variant="subtitle1"
                              color="text.secondary"
                              component="div"
                            >
                              {data.description}
                            </Typography>
                          </CardContent>
                          <Box
                            sx={{
                              display: 'flex',
                              alignItems: 'center',
                              justifyContent: 'flex-end',
                              p: 1,
                              height: '100%',
                            }}
                          >
                            <IconButton
                              aria-label="previous"
                              onClick={() =>
                                handleClickList({
                                  name: data.name,
                                  type: data.type,
                                })
                              }
                            >
                              <List />
                            </IconButton>
                            <IconButton
                              aria-label="play/pause"
                              sx={{ opacity: 0.4 }}
                              disabled
                            >
                              <Settings />
                            </IconButton>
                            <IconButton
                              aria-label="next"
                              onClick={() =>
                                handleClickAdd({
                                  name: data.name,
                                  type: data.type,
                                })
                              }
                            >
                              <Add />
                            </IconButton>
                          </Box>
                        </Box>
                      </Card>
                    </Item>
                  </Grid>
                ))}
              </Grid>
            </CustomTabPanel>
          ))}
        </Box>
      </Box>
      <DialogAddData open={openDialog} onClose={closeDialog} data={data} />
      <DialogListDatas
        open={openDialogList}
        onClose={closeDialogList}
        data={data}
      />
    </>
  );
}
