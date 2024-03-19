import * as React from 'react';
import { experimentalStyled as styled } from '@mui/material/styles';
import Grid from '@mui/material/Unstable_Grid2';
import { Stack, Box,  Typography, InputAdornment, Button, Divider, FormControl, InputLabel, Select, MenuItem } from '@mui/material';
import dayjs from 'dayjs';

import { Link, useNavigate } from 'react-router-dom';
import { useLazyQuery, useMutation, useQuery } from '@apollo/client';
import { useFormik } from 'formik';
import * as yup from 'yup';

import TheTextField from '../../../../_shared/components/form-fields/TheTextField';
import ImageFileField from '../../../../_shared/components/form-fields/ImageFileField';
import TheDesktopDatePicker from '../../../../_shared/components/form-fields/TheDesktopDatePicker';
import { useFeedBacks } from '../../../../_shared/context/feedbacks/FeedBacksProvider';
import { GET_UDESIRABLE_EVENT } from '../../../../_shared/graphql/queries/UndesirableEventQueries';
import { POST_UDESIRABLE_EVENT, PUT_UDESIRABLE_EVENT } from '../../../../_shared/graphql/mutations/UndesirableEventMutations';
import ProgressService from '../../../../_shared/services/feedbacks/ProgressService';
import TheSwitch from '../../../../_shared/components/form-fields/theSwitch';
import TheDateTimePicker from '../../../../_shared/components/form-fields/TheDateTimePicker';
import { GET_BENEFICIARIES } from '../../../../_shared/graphql/queries/BeneficiaryQueries';
import TheAutocomplete from '../../../../_shared/components/form-fields/TheAutocomplete';
import { GET_EMPLOYEES } from '../../../../_shared/graphql/queries/EmployeeQueries';
import { UDESIRABLE_EVENT_SEVERITY, UDESIRABLE_EVENT_TYPES } from '../../../../_shared/tools/constants';
import { GET_DATAS_UDESIRABLE_EVENT } from '../../../../_shared/graphql/queries/DataQueries';
import SelectCheckmarks from '../../../../_shared/components/form-fields/SelectCheckmarks';

const Item = styled(Stack)(({ theme }) => ({
  backgroundColor: theme.palette.mode === 'dark' ? '#1A2027' : '#fff',
  ...theme.typography.body2,
  padding: theme.spacing(2),
  textAlign: 'center',
  color: theme.palette.text.secondary,
}));

export default function AddUndesirableEventForm({ idUndesirableEvent, title}) {
    const  { setNotifyAlert,  setConfirmDialog} = useFeedBacks();
    const navigate = useNavigate();
    const validationSchema = yup.object({
        title: yup .string("Entrez le nom d'événement indésirable").required("Le nom d'événement indésirable est obligatoire")
      });
    const formik = useFormik({
        initialValues: {
            image : undefined,  number : '', title : '', 
            startingDateTime : dayjs(new Date()), endingDateTime : dayjs(new Date()), undesirableEventType : UDESIRABLE_EVENT_TYPES.NORMAL,
            normalTypes : [], seriousTypes : [], frequency : null, severity: UDESIRABLE_EVENT_SEVERITY.MEDIUM,
            actionsTakenText : '', courseFactsDateTime: dayjs(new Date()), courseFactsPlace: '', circumstanceEventText: '',
            isActive : true, employees: [], beneficiaries: [], notifiedPersons: [], otherNotifiedPersons: '', employee : null
          },
        validationSchema: validationSchema,
        onSubmit: (values) => {
            let { image , ...undesirableEventCopy } = values
            undesirableEventCopy.employees = undesirableEventCopy.employees.map(i => i?.id)
            undesirableEventCopy.beneficiaries = undesirableEventCopy.beneficiaries.map(i => i?.id)
            undesirableEventCopy.notifiedPersons = undesirableEventCopy.notifiedPersons.map(i => i?.id)
            undesirableEventCopy.normalTypes = undesirableEventCopy.normalTypes.map(i => i?.id)
            undesirableEventCopy.seriousTypes = undesirableEventCopy.seriousTypes.map(i => i?.id)
            undesirableEventCopy.employee = undesirableEventCopy.employee ? undesirableEventCopy.employee.id : null
            if(idUndesirableEvent && idUndesirableEvent != ''){
                onUpdateUndesirableEvent({ 
                    id : undesirableEventCopy.id, 
                    undesirableEventData : undesirableEventCopy,
                    image : image,
                    }
                )
            }
            else createUndesirableEvent({ 
                    variables: { 
                        undesirableEventData : undesirableEventCopy,
                        image : image,
                    } 
                })
        },
    });
    const { 
        loading: loadingBeneficiaries, 
        data: beneficiariesData, 
        error: beneficiariesError, 
        fetchMore:  fetchMoreBeneficiaries 
    } = useQuery(GET_BENEFICIARIES, { fetchPolicy: "network-only", variables: { page: 1, limit: 10 }})
    const { 
        loading: loadingEmployees, 
        data: employeesData, 
        error: employeesError, 
        fetchMore:  fetchMoreEmployees 
      } = useQuery(GET_EMPLOYEES, { fetchPolicy: "network-only", variables: { page: 1, limit: 10 }})
    const { 
        loading: loadingDatas, 
        data: dataData, 
        error: datsError, 
        fetchMore:  fetchMoreDatas  
    } = useQuery(GET_DATAS_UDESIRABLE_EVENT, { fetchPolicy: "network-only" })

    const [createUndesirableEvent, { loading : loadingPost }] = useMutation(POST_UDESIRABLE_EVENT, {
        onCompleted: (data) => {
            console.log(data);
            setNotifyAlert({
                isOpen: true,
                message: 'Ajouté avec succès',
                type: 'success'
            })
            let { __typename, ...undesirableEventCopy } = data.createUndesirableEvent.undesirableEvent;
        //   formik.setValues(undesirableEventCopy);
            navigate('/online/qualites/evenements-indesirables/liste');
        },
        update(cache, { data: { createUndesirableEvent } }) {
            const newUndesirableEvent = createUndesirableEvent.undesirableEvent;
          
            cache.modify({
              fields: {
                undesirableEvents(existingUndesirableEvents = { totalCount: 0, nodes: [] }) {
                    return {
                        totalCount: existingUndesirableEvents.totalCount + 1,
                        nodes: [newUndesirableEvent, ...existingUndesirableEvents.nodes],
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
    const [updateUndesirableEvent, { loading : loadingPut }] = useMutation(PUT_UDESIRABLE_EVENT, {
        onCompleted: (data) => {
            console.log(data);
            setNotifyAlert({
                isOpen: true,
                message: 'Modifié avec succès',
                type: 'success'
            })
            let { __typename, ...undesirableEventCopy } = data.updateUndesirableEvent.undesirableEvent;
        //   formik.setValues(undesirableEventCopy);
            navigate('/online/qualites/evenements-indesirables/liste');
        },
        update(cache, { data: { updateUndesirableEvent } }) {
            const updatedUndesirableEvent = updateUndesirableEvent.undesirableEvent;
          
            cache.modify({
              fields: {
                undesirableEvents(existingUndesirableEvents = { totalCount: 0, nodes: [] }, { readField }) {
                    
                    const updatedUndesirableEvents = existingUndesirableEvents.nodes.map((undesirableEvent) =>
                        readField('id', undesirableEvent) === updatedUndesirableEvent.id ? updatedUndesirableEvent : undesirableEvent
                    );
            
                    return {
                        totalCount: existingUndesirableEvents.totalCount,
                        nodes: updatedUndesirableEvents,
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
    const onUpdateUndesirableEvent = (variables) => {
        setConfirmDialog({
          isOpen: true,
          title: 'ATTENTION',
          subTitle: "Voulez vous vraiment modifier ?",
          onConfirm: () => { setConfirmDialog({isOpen: false})
                updateUndesirableEvent({ variables })
            }
        })
      }
    const [getUndesirableEvent, { loading : loadingUndesirableEvent }] = useLazyQuery(GET_UDESIRABLE_EVENT, {
        fetchPolicy: "network-only",
        onCompleted: (data) => {
            let { __typename, ...undesirableEventCopy1 } = data.undesirableEvent;
            let { folder, ...undesirableEventCopy } = undesirableEventCopy1;
            undesirableEventCopy.frequency = undesirableEventCopy.frequency ? Number(undesirableEventCopy.frequency.id) : null
            undesirableEventCopy.startingDateTime = dayjs(undesirableEventCopy.startingDateTime)
            undesirableEventCopy.courseFactsDateTime = dayjs(undesirableEventCopy.courseFactsDateTime)
            undesirableEventCopy.endingDateTime = dayjs(undesirableEventCopy.endingDateTime)
            undesirableEventCopy.beneficiaries = undesirableEventCopy.beneficiaries ? undesirableEventCopy.beneficiaries.map(i => i?.beneficiary) : []
            undesirableEventCopy.employees = undesirableEventCopy.employees ? undesirableEventCopy.employees.map(i => i?.employee) : []
            undesirableEventCopy.notifiedPersons = undesirableEventCopy.notifiedPersons ? undesirableEventCopy.notifiedPersons.map(i => i?.employee) : []
            formik.setValues(undesirableEventCopy);
        },
        onError: (err) => console.log(err),
    })
    React.useEffect(()=>{
        if(idUndesirableEvent){
            getUndesirableEvent(({ variables: { id: idUndesirableEvent } }));
        }
    }, [idUndesirableEvent])
    return (
        <Box sx={{ flexGrow: 1 }}>
            <Typography component="div" variant="h5">
                {title} {formik.values.number}
            </Typography>
            { loadingUndesirableEvent && <ProgressService type="form" />}
            { !loadingUndesirableEvent &&
                <form onSubmit={formik.handleSubmit}>
                    <Grid container spacing={{ xs: 2, md: 3 }} columns={{ xs: 4, sm: 8, md: 12 }}>
                        <Grid xs={2} sm={4} md={4}>
                            <Item>
                                <TheTextField variant="outlined" label="Référence"
                                    value={formik.values.number}
                                    disabled
                                />
                            </Item>
                        </Grid>
                        <Grid xs={2} sm={4} md={4}>
                            <Item>
                                <TheTextField variant="outlined" label="Titre" id="title"
                                    value={formik.values.title} required
                                    onChange={(e) => formik.setFieldValue('title', e.target.value)}
                                    onBlur={formik.handleBlur}
                                    error={formik.touched.title && Boolean(formik.errors.title)}
                                    helperText={formik.touched.title && formik.errors.title}
                                    disabled={loadingPost || loadingPut}
                                />
                            </Item>
                        </Grid>
                        <Grid xs={2} sm={4} md={4}>
                            <Item>
                                {/* <ImageFileField variant="outlined" label="Image"
                                    imageValue={formik.values.image}
                                    onChange={(imageFile) => formik.setFieldValue('image', imageFile)}
                                    disabled={loadingPost || loadingPut}
                                    /> */}
                                
                                <FormControl fullWidth>
                                    <InputLabel id="demo-simple-select-label">Type de l'événement indésirable</InputLabel>
                                    <Select
                                        labelId="demo-simple-select-label"
                                        id="demo-simple-select"
                                        label="Type de l'événement indésirable"
                                        value={formik.values.undesirableEventType} required
                                        onChange={(e) => formik.setFieldValue('undesirableEventType', e.target.value)}
                                    >
                                        {
                                            UDESIRABLE_EVENT_TYPES?.ALL?.map((type, index) =>
                                            {
                                                return <MenuItem key={index} value={type.value}>{type.label}</MenuItem>
                                            }
                                            )
                                        }
                                    </Select>
                                </FormControl>
                            </Item>
                            {formik.values.undesirableEventType === UDESIRABLE_EVENT_TYPES.NORMAL && <Item>
                                <SelectCheckmarks  options={dataData?.undesirableEventNormalTypes} label="Type (EI)"
                                    placeholder="Ajouter un type (EI)"
                                    limitTags={3}
                                    value={formik.values.normalTypes}
                                    onChange={(e, newValue) => formik.setFieldValue('normalTypes', newValue)}/>
                            </Item>}
                            {formik.values.undesirableEventType === UDESIRABLE_EVENT_TYPES.SERIOUS && <Item>
                                <SelectCheckmarks  options={dataData?.undesirableEventSeriousTypes} label="Type (EIG)"
                                    placeholder="Ajouter un type (EIG)"
                                    limitTags={3}
                                    value={formik.values.seriousTypes}
                                    onChange={(e, newValue) => formik.setFieldValue('seriousTypes', newValue)}/>
                            </Item>}
                        </Grid>
                        <Grid xs={2} sm={4} md={4}>
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
                        </Grid>
                        <Grid xs={2} sm={4} md={4}>
                            <Item>
                                <TheAutocomplete options={employeesData?.employees?.nodes} label="Pour quel employé ?"
                                    placeholder="Choisissez un employé ?"
                                    multiple={false}
                                    value={formik.values.employee}
                                    helperText="Si c'est pour vous. laissez ce champ vide."
                                    onChange={(e, newValue) => formik.setFieldValue('employee', newValue)}/>
                            </Item>
                        </Grid>
                        <Grid xs={2} sm={4} md={4} item>
                            <Item>
                                <TheAutocomplete options={employeesData?.employees?.nodes} label="Professionnels"
                                    placeholder="Ajouter un professionnel"
                                    limitTags={3}
                                    value={formik.values.employees}
                                    onChange={(e, newValue) => formik.setFieldValue('employees', newValue)}/>
                            </Item>
                            <Item>
                                <TheAutocomplete options={beneficiariesData?.beneficiaries?.nodes} label="Bénificiaires"
                                    placeholder="Ajouter un bénificiaire"
                                    limitTags={3}
                                    value={formik.values.beneficiaries}
                                    onChange={(e, newValue) => formik.setFieldValue('beneficiaries', newValue)}/>
                            </Item>
                        </Grid>
                        <Grid xs={12} sm={12} md={12}>
                            <Divider variant="middle" />
                        </Grid>
                        <Grid xs={12} sm={4} md={4}>
                            <Item>
                                <TheDateTimePicker
                                    label="Date et heure de déroulement des faits"
                                    value={formik.values.courseFactsDateTime}
                                    onChange={(date) => formik.setFieldValue('courseFactsDateTime', date)}
                                    disabled={loadingPost || loadingPut}
                                />
                            </Item>
                            <Item>
                                <TheTextField variant="outlined" label="Lieu de déroulement des faits"
                                    value={formik.values.courseFactsPlace}
                                    onChange={(e) => formik.setFieldValue('courseFactsPlace', e.target.value)}
                                    disabled={loadingPost || loadingPut}
                                />
                            </Item>
                        </Grid>
                        <Grid xs={12} sm={8} md={8}>
                            <Item>
                                <TheTextField variant="outlined" label="Circonstance de l’événement" multiline rows={5}
                                    value={formik.values.circumstanceEventText}
                                    onChange={(e) => formik.setFieldValue('circumstanceEventText', e.target.value)}
                                    disabled={loadingPost || loadingPut}
                                    />
                            </Item>
                        </Grid>
                        <Grid xs={12} sm={12} md={12}>
                            <Divider variant="middle" />
                        </Grid>
                        <Grid xs={2} sm={4} md={4}>
                            <Item>
                                <FormControl fullWidth>
                                    <InputLabel id="demo-simple-select-label">Fréquence de l’événement</InputLabel>
                                    <Select
                                        labelId="demo-simple-select-label"
                                        id="demo-simple-select"
                                        label="Fréquence de l’événement"
                                        value={formik.values.frequency}
                                        onChange={(e) => formik.setFieldValue('frequency', e.target.value)}
                                    >
                                        <MenuItem value="">
                                            <em>Choisissez une fréquence</em>
                                        </MenuItem>
                                        {
                                            dataData?.frequencies?.map((data, index) =>
                                            {
                                                return <MenuItem key={index} value={data.id}>{data.name}</MenuItem>
                                            }
                                            )
                                        }
                                    </Select>
                                </FormControl>
                            </Item>
                        </Grid>
                        <Grid xs={2} sm={4} md={4}>
                            <Item>                                
                                <FormControl fullWidth>
                                    <InputLabel id="demo-simple-select-label">Gravité de l’événement</InputLabel>
                                    <Select
                                        labelId="demo-simple-select-label"
                                        id="demo-simple-select"
                                        label="Gravité de l’événement"
                                        value={formik.values.severity} required
                                        onChange={(e) => formik.setFieldValue('severity', e.target.value)}
                                    >
                                        {
                                            UDESIRABLE_EVENT_SEVERITY?.ALL?.map((type, index) =>
                                            {
                                                return <MenuItem key={index} value={type.value}>{type.label}</MenuItem>
                                            }
                                            )
                                        }
                                    </Select>
                                </FormControl>
                            </Item>
                        </Grid>
                        <Grid xs={2} sm={4} md={4} item>
                            <Item>
                                <TheAutocomplete options={employeesData?.employees?.nodes} label="Personne(s) immédiatement prévenue(s)"
                                    placeholder="Ajouter une personne"
                                    limitTags={3}
                                    value={formik.values.notifiedPersons}
                                    onChange={(e, newValue) => formik.setFieldValue('notifiedPersons', newValue)}/>
                            </Item>
                            <Item>
                                <TheTextField variant="outlined" label="Autres Personnes"
                                    value={formik.values.otherNotifiedPersons}
                                    onChange={(e) => formik.setFieldValue('otherNotifiedPersons', e.target.value)}
                                    helperText="Si vous ne trouvez pas la personne dans la liste dessus."
                                    disabled={loadingPost || loadingPut}
                                />
                            </Item>
                        </Grid>
                        <Grid xs={12} sm={12} md={12}>
                            <Item>
                                <TheTextField variant="outlined" label="Mesure(s) prise(s) immédiatement" multiline rows={5}
                                    value={formik.values.actionsTakenText}
                                    onChange={(e) => formik.setFieldValue('actionsTakenText', e.target.value)}
                                    disabled={loadingPost || loadingPut}
                                    />
                            </Item>
                        </Grid>
                        <Grid xs={12} sm={12} md={12}>
                            <Divider variant="middle" />
                        </Grid>
                        <Grid xs={12} sm={12} md={12}>
                            <Item sx={{ justifyContent: 'end', flexDirection : 'row' }}>
                                <Link to="/online/qualites/evenements-indesirables/liste" className="no_style">
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
