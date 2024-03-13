import * as React from 'react';
import { experimentalStyled as styled } from '@mui/material/styles';
import Grid from '@mui/material/Unstable_Grid2';
import { Stack, Box,  Typography, InputAdornment, Button, Divider, FormControl, InputLabel, Select, MenuItem, IconButton } from '@mui/material';
import dayjs from 'dayjs';

import { Link, useNavigate } from 'react-router-dom';
import { useLazyQuery, useMutation, useQuery } from '@apollo/client';
import { useFormik } from 'formik';
import * as yup from 'yup';

import TheTextField from '../../../../_shared/components/form-fields/TheTextField';
import ImageFileField from '../../../../_shared/components/form-fields/ImageFileField';
import TheDesktopDatePicker from '../../../../_shared/components/form-fields/TheDesktopDatePicker';
import { useFeedBacks } from '../../../../_shared/context/feedbacks/FeedBacksProvider';
import { GET_TASK } from '../../../../_shared/graphql/queries/TaskQueries';
import { POST_TASK, PUT_TASK } from '../../../../_shared/graphql/mutations/TaskMutations';
import ProgressService from '../../../../_shared/services/feedbacks/ProgressService';
import TheSwitch from '../../../../_shared/components/form-fields/theSwitch';
import TheAutocomplete from '../../../../_shared/components/form-fields/TheAutocomplete';
import { GET_EMPLOYEES } from '../../../../_shared/graphql/queries/EmployeeQueries';
import { GET_VEHICLES } from '../../../../_shared/graphql/queries/VehicleQueries';
import { GET_MATERIALS } from '../../../../_shared/graphql/queries/MaterialQueries';
import TheDateTimePicker from '../../../../_shared/components/form-fields/TheDateTimePicker';
import CardDisplayMap from '../../../../_shared/components/helpers/CardDisplayMap';
import { Close } from '@mui/icons-material';
import { GET_CLIENTS } from '../../../../_shared/graphql/queries/ClientQueries';

const Item = styled(Stack)(({ theme }) => ({
  backgroundColor: theme.palette.mode === 'dark' ? '#1A2027' : '#fff',
  ...theme.typography.body2,
  padding: theme.spacing(2),
  textAlign: 'center',
  color: theme.palette.text.secondary,
}));

export default function AddTaskForm({ idTask, title}) {
    const  { setNotifyAlert,  setConfirmDialog} = useFeedBacks();
    const navigate = useNavigate();
    const validationSchema = yup.object({
        name: yup .string('Entrez le nom de véhicule').required('Le nom de véhicule est obligatoire'),
      });
    const formik = useFormik({
        initialValues: {
            image : undefined,  number : '', name : '', estimatedBudget : 0,
            startingDateTime : dayjs(new Date()), endingDateTime : dayjs(new Date()),
            latitude : '', longitude : '', city : '', zipCode : '', address : '',
            mobile : '' , fix : '' , email : '', clientTaskNumber : '',
            clientName : '', billingAddress : '', contractorName : '',
            contractorTel : '', contractorEmail : '', receiverName : '',
            receiverTel : '', receiverEmail : '', siteOwnerName : '', siteTenantName : '',
            priority : 'LOW', workLevel : 'MEDIUM', status : 'NEW',
            comment : '', description : '', observation : '', 
            totalPriceHt : 0, tva : 0, discount : 0,
            totalPriceTtc :0, isDisplayPrice : '', isFromQuote : '',
            isActive : true, client : null ,
            workersInfos : '', vehiclesInfos : '', materialsInfos : '',
            workers : [],  vehicles : [],  materials : [], taskChecklist: []
          },
        validationSchema: validationSchema,
        onSubmit: (values) => {
            let { image , ...taskCopy } = values
            taskCopy.workers = taskCopy.workers.map(i => i?.id)
            taskCopy.vehicles = taskCopy.vehicles.map(i => i.id)
            taskCopy.materials = taskCopy.materials.map(i => i.id)
            taskCopy.client = taskCopy.client ? taskCopy.client.id : null
            if(idTask && idTask != ''){
                onUpdateTask({ 
                    id : taskCopy.id, 
                    taskData : taskCopy,
                    image : image,
                    }
                )
            }
            else createTask({ 
                    variables: { 
                        taskData : taskCopy,
                        image : image,
                    } 
                })
        },
    });
    const { 
        loading: loadingClients, 
        data: clientsData, 
        error: clientsError, 
        fetchMore:  fetchMoreClients 
      } = useQuery(GET_CLIENTS, { fetchPolicy: "network-only", variables: { page: 1, limit: 10 }})
    const { 
        loading: loadingEmployees, 
        data: employeesData, 
        error: employeesError, 
        fetchMore:  fetchMoreEmployees 
      } = useQuery(GET_EMPLOYEES, { fetchPolicy: "network-only", variables: { page: 1, limit: 10 }})
    const { 
        loading: loadingVehicles, 
        data: vehiclesData, 
        error: vehiclesError, 
        fetchMore:  fetchMoreVehicles 
      } = useQuery(GET_VEHICLES, { fetchPolicy: "network-only", variables: { page: 1, limit: 10 }}) 
    const { 
        loading: loadingMaterials, 
        data: materialsData, 
        error: materialsError, 
        fetchMore:  fetchMoreMaterials 
    } = useQuery(GET_MATERIALS, { fetchPolicy: "network-only", variables: { page: 1, limit: 10 }})
    const [createTask, { loading : loadingPost }] = useMutation(POST_TASK, {
        onCompleted: (data) => {
            console.log(data);
            setNotifyAlert({
                isOpen: true,
                message: 'Ajouté avec succès',
                type: 'success'
            })
            let { __typename, ...taskCopy } = data.createTask.task;
        //   formik.setValues(taskCopy);
            navigate('/online/travaux/interventions/liste');
        },
        update(cache, { data: { createTask } }) {
            const newTask = createTask.task;
          
            cache.modify({
              fields: {
                tasks(existingTasks = { totalCount: 0, nodes: [] }) {
                    return {
                        totalCount: existingTasks.totalCount + 1,
                        nodes: [newTask, ...existingTasks.nodes],
                    };
                },
              },
            });
        },
        onError: (err) => {
            console.log(err)
            setNotifyAlert({
                isOpen: true,
                message: 'Non ajouté ! Veuillez réessayer.',
                type: 'error'
            })
        },
    })
    const [updateTask, { loading : loadingPut }] = useMutation(PUT_TASK, {
        onCompleted: (data) => {
            console.log(data);
            setNotifyAlert({
                isOpen: true,
                message: 'Modifié avec succès',
                type: 'success'
            })
            let { __typename, ...taskCopy } = data.updateTask.task;
        //   formik.setValues(taskCopy);
            navigate('/online/travaux/interventions/liste');
        },
        update(cache, { data: { updateTask } }) {
            const updatedTask = updateTask.task;
          
            cache.modify({
              fields: {
                tasks(existingTasks = { totalCount: 0, nodes: [] }, { readField }) {
                    
                    const updatedTasks = existingTasks.nodes.map((task) =>
                        readField('id', task) === updatedTask.id ? updatedTask : task
                    );
            
                    return {
                        totalCount: existingTasks.totalCount,
                        nodes: updatedTasks,
                    };
                },
              },
            });
        },
        onError: (err) => {
            console.log(err)
            setNotifyAlert({
                isOpen: true,
                message: 'Non modifié ! Veuillez réessayer.',
                type: 'error'
            })
        },
    })
    const onUpdateTask = (variables) => {
        setConfirmDialog({
          isOpen: true,
          title: 'ATTENTION',
          subTitle: "Voulez vous vraiment modifier ?",
          onConfirm: () => { setConfirmDialog({isOpen: false})
                updateTask({ variables })
            }
        })
      }
    const [getTask, { loading : loadingTask }] = useLazyQuery(GET_TASK, {
        fetchPolicy: "network-only",
        onCompleted: (data) => {
            let { __typename, ...taskCopy1 } = data.task;
            let { folder, ...taskCopy } = taskCopy1;
            taskCopy.startingDateTime = dayjs(taskCopy.startingDateTime)
            taskCopy.endingDateTime = dayjs(taskCopy.endingDateTime)
            taskCopy.workers = taskCopy.workers ? taskCopy.workers.map(i => i?.employee) : []
            taskCopy.vehicles = taskCopy.vehicles ? taskCopy.vehicles.map(i => i?.vehicle) : []
            taskCopy.materials = taskCopy.materials ? taskCopy.materials.map(i => i?.material) : []
            if(!taskCopy?.taskChecklist) taskCopy['taskChecklist'] = [];
            let items = []
            taskCopy.taskChecklist.forEach((item) =>{
                let { __typename, ...itemCopy } = item;
                items.push(itemCopy)
            })
            taskCopy.taskChecklist = items;
            formik.setValues(taskCopy);
        },
        onError: (err) => console.log(err),
    })
    React.useEffect(()=>{
        if(idTask){
            getTask(({ variables: { id: idTask } }));
        }
    }, [idTask])
    const addChecklistItem = () => {
        formik.setValues({
          ...formik.values,
          taskChecklist: [...formik.values.taskChecklist, { localisation: '', comment: '', description: '' }]
        });
      };
    
      const removeChecklistItem = (index) => {
        const updatedChecklist = [...formik.values.taskChecklist];
        updatedChecklist.splice(index, 1);
    
        formik.setValues({
          ...formik.values,
          taskChecklist: updatedChecklist
        });
      };
    return (
        <Box sx={{ flexGrow: 1 }}>
            <Typography component="div" variant="h5">
                {title} {formik.values.number}
            </Typography>
            { loadingTask && <ProgressService type="form" />}
            { !loadingTask &&
                <form onSubmit={formik.handleSubmit}>
                    <Grid container spacing={{ xs: 2, md: 3 }} columns={{ xs: 4, sm: 8, md: 12 }}>
                        <Grid xs={2} sm={4} md={4} item>
                            <Item>
                                <TheTextField variant="outlined" label="Référence"
                                    value={formik.values.number}
                                    disabled
                                />
                            </Item>
                            <Item>
                                <ImageFileField variant="outlined" label="Image"
                                    imageValue={formik.values.image}
                                    onChange={(imageFile) => formik.setFieldValue('image', imageFile)}
                                    disabled={loadingPost || loadingPut}
                                    />
                            </Item>
                        </Grid>
                        <Grid xs={2} sm={4} md={4} item>
                            <Item>
                                <TheTextField variant="outlined" label="Titre" id="name"
                                    value={formik.values.name} required
                                    onChange={(e) => formik.setFieldValue('name', e.target.value)}
                                    onBlur={formik.handleBlur}
                                    error={formik.touched.name && Boolean(formik.errors.name)}
                                    helperText={formik.touched.name && formik.errors.name}
                                    disabled={loadingPost || loadingPut}
                                />
                            </Item>
                            <Item>
                                <TheDateTimePicker
                                    label="Date et heure de début"
                                    value={formik.values.startingDateTime}
                                    onChange={(date) => formik.setFieldValue('startingDateTime', date)}
                                    disabled={loadingPost || loadingPut}
                                />
                            </Item>
                            <Item>
                                <TheDateTimePicker
                                    label="Date de fin"
                                    value={formik.values.endingDateTime}
                                    onChange={(date) => formik.setFieldValue('endingDateTime', date)}
                                    disabled={loadingPost || loadingPut}
                                />
                            </Item>
                            {/* <Item>
                                <TheTextField variant="outlined" label="Budget éstimé"
                                    InputProps={{
                                        endAdornment: <InputAdornment position="start">€</InputAdornment>,
                                    }}
                                    value={formik.values.estimatedBudget}
                                    onChange={(e) => formik.setFieldValue('estimatedBudget', e.target.value)}
                                    disabled={loadingPost || loadingPut}
                                />
                            </Item> */}
                            {/* <Item>
                                <FormControl fullWidth>
                                    <InputLabel>Priorité</InputLabel>
                                    <Select
                                        value={formik.values.priority}
                                        onChange={(e) => formik.setFieldValue('priority', e.target.value)}
                                        disabled={loadingPost || loadingPut}
                                    >
                                        <MenuItem value="LOW">Faible</MenuItem>
                                        <MenuItem value="MEDIUM">Moyenne</MenuItem>
                                        <MenuItem value="HIGH">Haute</MenuItem>
                                    </Select>
                                </FormControl>
                            </Item> */}
                        </Grid>
                        <Grid xs={2} sm={4} md={4} item>
                            <Item>
                                <CardDisplayMap address={formik.values}/>
                            </Item>
                        </Grid>
                        <Grid xs={2} sm={4} md={4} item>
                            
                            {/* <Item>
                                <FormControl fullWidth>
                                    <InputLabel>Niveau des travaux</InputLabel>
                                    <Select
                                        value={formik.values.workLevel}
                                        onChange={(e) => formik.setFieldValue('workLevel', e.target.value)}
                                        disabled={loadingPost || loadingPut}
                                    >
                                        <MenuItem value="EASY">Facile</MenuItem>
                                        <MenuItem value="MEDIUM">Moyen</MenuItem>
                                        <MenuItem value="HALRD">Difficile</MenuItem>
                                    </Select>
                                </FormControl>
                            </Item> */}
                        </Grid>
                        <Grid xs={12} sm={12} md={12} item>
                            <Divider variant="middle" />
                        </Grid>
                        <Grid xs={2} sm={4} md={4} item>
                            <Typography gutterBottom variant="subtitle3" component="h3">
                                Le client
                            </Typography>
                            <Item>
                                <TheAutocomplete options={clientsData?.clients?.nodes} label="Client"
                                    placeholder="Choisissez un Client"
                                    multiple={false}
                                    value={formik.values.client}
                                    onChange={(e, newValue) => formik.setFieldValue('client', newValue)}/>
                            </Item>
                            <Item>
                                <TheTextField variant="outlined" label="Réference client de l'intervention"
                                    value={formik.values.clientTaskNumber}
                                    onChange={(e) => formik.setFieldValue('clientTaskNumber', e.target.value)}
                                    disabled={loadingPost || loadingPut}
                                />
                            </Item>
                            {/* <Item>
                                <TheTextField variant="outlined" label="Nom de client"
                                    value={formik.values.clientName}
                                    onChange={(e) => formik.setFieldValue('clientName', e.target.value)}
                                    disabled={loadingPost || loadingPut}
                                />
                            </Item>
                            <Item>
                                <TheTextField variant="outlined" label="Email de client"
                                    value={formik.values.email}
                                    onChange={(e) => formik.setFieldValue('email', e.target.value)}
                                    disabled={loadingPost || loadingPut}
                                />
                            </Item>
                            <Item>
                                <TheTextField variant="outlined" label="Mobile"
                                    value={formik.values.mobile}
                                    onChange={(e) => formik.setFieldValue('mobile', e.target.value)}
                                    disabled={loadingPost || loadingPut}
                                    />
                            </Item>
                            <Item>
                                <TheTextField variant="outlined" label="Fixe"
                                    value={formik.values.fix}
                                    onChange={(e) => formik.setFieldValue('fix', e.target.value)}
                                    disabled={loadingPost || loadingPut}
                                    />
                            </Item> */}
                            <Item>
                                <TheTextField variant="outlined" label="Adresse de facturation" multiline rows={8}
                                    value={formik.values.billingAddress}
                                    onChange={(e) => formik.setFieldValue('billingAddress', e.target.value)}
                                    disabled={loadingPost || loadingPut}
                                    />
                            </Item>
                        </Grid>
                        <Grid xs={2} sm={4} md={4} item>
                            <Typography gutterBottom variant="subtitle3" component="h3">
                                Le donneur d'ordre
                            </Typography>
                            <Item>
                                <TheTextField variant="outlined" label="Nom de donneur d'ordre"
                                    value={formik.values.contractorName}
                                    onChange={(e) => formik.setFieldValue('contractorName', e.target.value)}
                                    disabled={loadingPost || loadingPut}
                                    />
                            </Item>
                            <Item>
                                <TheTextField variant="outlined" label="Tél. de donneur d'ordre"
                                    value={formik.values.contractorTel}
                                    onChange={(e) => formik.setFieldValue('contractorTel', e.target.value)}
                                    disabled={loadingPost || loadingPut}
                                    />
                            </Item>
                            <Item>
                                <TheTextField variant="outlined" label="email de donneur d'ordre"
                                    value={formik.values.contractorEmail}
                                    onChange={(e) => formik.setFieldValue('contractorEmail', e.target.value)}
                                    disabled={loadingPost || loadingPut}
                                    />
                            </Item>
                        </Grid>
                        <Grid xs={2} sm={4} md={4} item>
                            <Typography gutterBottom variant="subtitle3" component="h3">
                                Les personnes sur place
                            </Typography>
                            <Item>
                                <TheTextField variant="outlined" label="Nom de la personne sur place"
                                    value={formik.values.receiverName}
                                    onChange={(e) => formik.setFieldValue('receiverName', e.target.value)}
                                    disabled={loadingPost || loadingPut}
                                    />
                            </Item>
                            <Item>
                                <TheTextField variant="outlined" label="Tél. de la personne sur place"
                                    value={formik.values.receiverTel}
                                    onChange={(e) => formik.setFieldValue('receiverTel', e.target.value)}
                                    disabled={loadingPost || loadingPut}
                                    />
                            </Item>
                            <Item>
                                <TheTextField variant="outlined" label="Email de la personne sur place"
                                    value={formik.values.receiverEmail}
                                    onChange={(e) => formik.setFieldValue('receiverEmail', e.target.value)}
                                    disabled={loadingPost || loadingPut}
                                    />
                            </Item>
                            <Item>
                                <TheTextField variant="outlined" label="Nom de propriétaire de chantier"
                                    value={formik.values.siteOwnerName}
                                    onChange={(e) => formik.setFieldValue('siteOwnerName', e.target.value)}
                                    disabled={loadingPost || loadingPut}
                                    />
                            </Item>
                            <Item>
                                <TheTextField variant="outlined" label="Nom de locataire de chantier"
                                    value={formik.values.siteTenantName}
                                    onChange={(e) => formik.setFieldValue('siteTenantName', e.target.value)}
                                    disabled={loadingPost || loadingPut}
                                    />
                            </Item>
                        </Grid>
                        <Grid xs={12} sm={12} md={12} item>
                            <Divider variant="middle" />
                        </Grid>
                        <Grid xs={2} sm={4} md={4} item>
                            <Typography gutterBottom variant="subtitle3" component="h3">
                                Les intérvenants
                            </Typography>
                            <Item>
                                <TheAutocomplete options={employeesData?.employees?.nodes} label="Intérvenants"
                                    placeholder="Ajouter un intérvenant"
                                    limitTags={2}
                                    value={formik.values.workers}
                                    onChange={(e, newValue) => formik.setFieldValue('workers', newValue)}/>
                            </Item>
                            <Item>
                                <TheTextField variant="outlined" label="Infos intérvenants" multiline rows={6}
                                    value={formik.values.workersInfos}
                                    onChange={(e) => formik.setFieldValue('workersInfos', e.target.value)}
                                    disabled={loadingPost || loadingPut}
                                    />
                            </Item>
                        </Grid>
                        <Grid xs={2} sm={4} md={4} item>
                            <Typography gutterBottom variant="subtitle3" component="h3">
                                Les véhicules
                            </Typography>
                            <Item>
                                <TheAutocomplete options={vehiclesData?.vehicles?.nodes} label="Véhicules"
                                    placeholder="Ajouter un véhicule"
                                    limitTags={2}
                                    value={formik.values.vehicles}
                                    onChange={(e, newValue) => formik.setFieldValue('vehicles', newValue)}/>
                            </Item>
                            <Item>
                                <TheTextField variant="outlined" label="Infos véhicules" multiline rows={6}
                                    value={formik.values.vehiclesInfos}
                                    onChange={(e) => formik.setFieldValue('vehiclesInfos', e.target.value)}
                                    disabled={loadingPost || loadingPut}
                                    />
                            </Item>
                        </Grid>
                        <Grid xs={2} sm={4} md={4} item>
                            <Typography gutterBottom variant="subtitle3" component="h3">
                                Les matérials
                            </Typography>
                            <Item>
                                <TheAutocomplete options={materialsData?.materials?.nodes} label="Matérials"
                                    placeholder="Ajouter un matérial"
                                    limitTags={2}
                                    value={formik.values.materials}
                                    onChange={(e, newValue) => formik.setFieldValue('materials', newValue)}/>
                            </Item>
                            <Item>
                                <TheTextField variant="outlined" label="Infos matérials" multiline rows={6}
                                    value={formik.values.materialsInfos}
                                    onChange={(e) => formik.setFieldValue('materialsInfos', e.target.value)}
                                    disabled={loadingPost || loadingPut}
                                    />
                            </Item>
                        </Grid>
                        <Grid xs={12} sm={12} md={12} item>
                            <Divider variant="middle"/>
                        </Grid>
                        <Grid xs={12} sm={12} md={12} item>
                            <Typography component="div" variant="h6">
                                Les tâches à traiter
                            </Typography>
                            <Item>
                                <TheSwitch variant="outlined" label="Utiliser le Devis"
                                    checked={formik.values.isFromQuote}
                                    value={formik.values.isFromQuote}
                                    onChange={(e) => formik.setFieldValue('isFromQuote', e.target.checked)}
                                    disabled={loadingPost || loadingPut}
                                />
                            </Item>
                            {formik.values?.taskChecklist?.map((item, index) => (
                                <Grid container spacing={{ xs: 2, md: 3 }} columns={{ xs: 4, sm: 8, md: 12 }} key={index}>
                                    <Grid xs={12} sm={4} md={4} item>
                                        <Item>
                                            <TheTextField variant="outlined" label="Localisation"
                                                value={item.localisation}
                                                onChange={(e) => formik.setFieldValue(`taskChecklist.${index}.localisation`, e.target.value)}
                                                disabled={loadingPost || loadingPut}
                                                />
                                        </Item>
                                    </Grid>
                                    <Grid xs={12} sm={4} md={4} item>
                                        <Item>
                                            <TheTextField variant="outlined" label="Commentaire" multiline rows={4}
                                                value={item.comment}
                                                onChange={(e) => formik.setFieldValue(`taskChecklist.${index}.comment`, e.target.value)}
                                                disabled={loadingPost || loadingPut}
                                                />
                                        </Item>
                                    </Grid>
                                    <Grid xs={12} sm={4} md={4} item>
                                        <Item>
                                            <TheTextField variant="outlined" label="Description" multiline rows={4}
                                                value={item.description}
                                                onChange={(e) => formik.setFieldValue(`taskChecklist.${index}.description`, e.target.value)}
                                                disabled={loadingPost || loadingPut}
                                                InputProps={{
                                                    endAdornment: <InputAdornment position="end">
                                                                    <IconButton onClick={() => removeChecklistItem(index)} edge="end"><Close /></IconButton>
                                                                </InputAdornment>
                                                }}
                                                />
                                        </Item>
                                    </Grid>
                                </Grid>
                            ))}
                        </Grid>
                        <Grid xs={12} sm={12} md={12} item sx={{ display: 'flex', justifyContent: 'flex-end' }}>
                            <Button variant="outlined" size="small"  onClick={addChecklistItem}
                            disabled={loadingPost || loadingPut}>Ajouter un élément</Button>
                        </Grid>
                        <Grid xs={12} sm={12} md={12} item>
                            <Divider variant="middle" />
                        </Grid>
                        <Grid xs={12} sm={6} md={6} item>
                            <Item>
                                <TheTextField variant="outlined" label="Petite déscription" multiline rows={6}
                                    value={formik.values.description}
                                    onChange={(e) => formik.setFieldValue('description', e.target.value)}
                                    disabled={loadingPost || loadingPut}
                                    />
                            </Item>
                        </Grid>
                        <Grid xs={12} sm={6} md={6} item>
                            <Item>
                                <TheTextField variant="outlined" label="Commentaire pour l'inérvention" multiline rows={6}
                                    value={formik.values.comment}
                                    onChange={(e) => formik.setFieldValue('comment', e.target.value)}
                                    disabled={loadingPost || loadingPut}
                                    />
                            </Item>
                        </Grid>
                        <Grid xs={12} sm={12} md={12} item>
                            <Divider variant="middle" />
                        </Grid>
                        <Grid xs={2} sm={3} md={3} item>
                            <Item>
                                <TheTextField variant="outlined" label="Total HT"
                                    type="number"
                                    InputProps={{
                                        endAdornment: <InputAdornment position="start">€</InputAdornment>,
                                    }}
                                    value={formik.values.totalPriceHt}
                                    onChange={(e) => formik.setFieldValue('totalPriceHt', e.target.value)}
                                    disabled={loadingPost || loadingPut}
                                />
                            </Item>
                        </Grid>
                        <Grid xs={2} sm={2} md={2} item>
                            <Item>
                                <TheTextField variant="outlined" label="Remise"
                                    type="number"
                                    InputProps={{
                                        endAdornment: <InputAdornment position="start">%</InputAdornment>,
                                    }}
                                    value={formik.values.discount}
                                    onChange={(e) => formik.setFieldValue('discount', e.target.value)}
                                    disabled={loadingPost || loadingPut}
                                />
                            </Item>
                        </Grid>
                        <Grid xs={2} sm={2} md={2} item>
                            <Item>
                                <TheTextField variant="outlined" label="Tva"
                                    type="number"
                                    InputProps={{
                                        endAdornment: <InputAdornment position="start">%</InputAdornment>,
                                    }}
                                    value={formik.values.tva}
                                    onChange={(e) => formik.setFieldValue('tva', e.target.value)}
                                    disabled={loadingPost || loadingPut}
                                />
                            </Item>
                        </Grid>
                        <Grid xs={2} sm={3} md={3} item>
                            <Item>
                                <TheTextField variant="outlined" label="Total TTC"
                                    type="number"
                                    InputProps={{
                                        endAdornment: <InputAdornment position="start">€</InputAdornment>,
                                    }}
                                    value={formik.values.totalPriceTtc}
                                    onChange={(e) => formik.setFieldValue('totalPriceTtc', e.target.value)}
                                    disabled={loadingPost || loadingPut}
                                />
                            </Item>
                        </Grid>
                        <Grid xs={2} sm={2} md={2} item>
                            <Item>
                                <TheSwitch variant="outlined" label="Afficher pour le client"
                                    checked={formik.values.isDisplayPrice}
                                    value={formik.values.isDisplayPrice}
                                    onChange={(e) => formik.setFieldValue('isDisplayPrice', e.target.checked)}
                                    disabled={loadingPost || loadingPut}
                                />
                            </Item>
                        </Grid>
                        <Grid xs={12} sm={12} md={12} item>
                            <Item sx={{ justifyContent: 'end', flexDirection : 'row' }}>
                                <Link to="/online/travaux/interventions/liste" className="no_style">
                                    <Button variant="outlined" sx={{ marginRight : '10px' }}>Annuler</Button>
                                </Link>
                                <Button type="submit" variant="contained"
                                disabled={!formik.isValid || loadingPost || loadingPut}>Valider</Button>
                            </Item>
                        </Grid>
                    </Grid>
                </form>
            }
        </Box>
    );
}
