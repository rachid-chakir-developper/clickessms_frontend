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
import DialogAddCustomField from './DialogAddCustomField';
import DialogListCustomFields from './DialogListCustomFields';

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
    customFields: [],
  },
  {
    title: 'Etablissments',
    customFields: [],
  },
  {
    title: 'Activités',
    customFields: [],
  },
  {
    title: 'Qualités',
    customFields: [],
  },
  {
    title: 'Administratif',
    customFields: [
        { name: "Les contrats", description: '', formModel: 'EmployeeContract' },
      ],
  },
  {
    title: 'Services généraux',
    customFields: [],
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

export default function customFields() {
  const [value, setValue] = React.useState(0);

  const handleChange = (event, newValue) => {
    setValue(newValue);
  };
  const [openDialog, setOpenDialog] = React.useState(false);
  const [openDialogList, setOpenDialogList] = React.useState(false);
  const [customField, setCustomField] = React.useState({ name: '', type: '' });
  const handleClickAdd = (customField) => {
    setOpenDialog(true);
    setCustomField(customField);
  };
  const handleClickList = (customField) => {
    setOpenDialogList(true);
    setCustomField(customField);
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
              <Grid
                container
                spacing={{ xs: 2, md: 3 }}
                columns={{ xs: 4, sm: 8, md: 12 }}
              >
                {moduleToManage.customFields.map((customField, index) => (
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
                              {customField.name}
                            </Typography>
                            <Typography
                              variant="subtitle1"
                              color="text.secondary"
                              component="div"
                            >
                              {customField.description}
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
                                handleClickList(customField)
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
                                handleClickAdd(customField)
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
      <DialogAddCustomField open={openDialog} onClose={closeDialog} customField={customField} />
      <DialogListCustomFields
        open={openDialogList}
        onClose={closeDialogList}
        customField={customField}
      />
    </>
  );
}
