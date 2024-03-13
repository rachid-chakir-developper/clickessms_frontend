import * as React from 'react';
import { experimentalStyled as styled } from '@mui/material/styles';
import Grid from '@mui/material/Unstable_Grid2';
import { Stack, Box,  Typography, Button, Divider } from '@mui/material';
import dayjs from 'dayjs';

import { Link, useNavigate } from 'react-router-dom';
import { useLazyQuery, useMutation } from '@apollo/client';
import { useFormik } from 'formik';
import * as yup from 'yup';

import TheTextField from '../../../../_shared/components/form-fields/TheTextField';
import ImageFileField from '../../../../_shared/components/form-fields/ImageFileField';
import { useFeedBacks } from '../../../../_shared/context/feedbacks/FeedBacksProvider';
import { GET_UDESIRABLE_EVENT } from '../../../../_shared/graphql/queries/UndesirableEventQueries';
import { POST_UDESIRABLE_EVENT, PUT_UDESIRABLE_EVENT } from '../../../../_shared/graphql/mutations/UndesirableEventMutations';
import ProgressService from '../../../../_shared/services/feedbacks/ProgressService';
import TheDateTimePicker from '../../../../_shared/components/form-fields/TheDateTimePicker';

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
            startingDateTime : dayjs(new Date()), endingDateTime : dayjs(new Date()),
            description : '', observation : '', isActive : true,
          },
        validationSchema: validationSchema,
        onSubmit: (values) => {
            let { image , ...undesirableEventCopy } = values
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
            let { __typename, ...undesirableEventCopy } = data.undesirableEvent;
            undesirableEventCopy.startingDateTime = dayjs(undesirableEventCopy.startingDateTime)
            undesirableEventCopy.endingDateTime = dayjs(undesirableEventCopy.endingDateTime)
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
                                <TheTextField variant="outlined" label="Nom" id="title"
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
                                <ImageFileField variant="outlined" label="Image"
                                    imageValue={formik.values.image}
                                    onChange={(imageFile) => formik.setFieldValue('image', imageFile)}
                                    disabled={loadingPost || loadingPut}
                                    />
                            </Item>
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
                        </Grid>
                        <Grid xs={2} sm={4} md={4}>
                            <Item>
                                <TheDateTimePicker
                                    label="Date de fin"
                                    value={formik.values.endingDateTime}
                                    onChange={(date) => formik.setFieldValue('endingDateTime', date)}
                                    disabled={loadingPost || loadingPut}
                                />
                            </Item>
                        </Grid>
                        <Grid xs={12} sm={12} md={12}>
                            <Divider variant="middle" />
                        </Grid>
                        <Grid xs={12} sm={6} md={6}>
                            <Item>
                                <TheTextField variant="outlined" label="Description" multiline rows={4}
                                    value={formik.values.description}
                                    onChange={(e) => formik.setFieldValue('description', e.target.value)}
                                    disabled={loadingPost || loadingPut}
                                    />
                            </Item>
                        </Grid>
                        <Grid xs={12} sm={6} md={6}>
                            <Item>
                                <TheTextField variant="outlined" label="Observation" multiline rows={4}
                                    value={formik.values.observation}
                                    onChange={(e) => formik.setFieldValue('observation', e.target.value)}
                                    disabled={loadingPost || loadingPut}
                                    />
                            </Item>
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
