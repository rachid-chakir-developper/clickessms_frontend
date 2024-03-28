import * as React from 'react';
import { experimentalStyled as styled } from '@mui/material/styles';
import Grid from '@mui/material/Unstable_Grid2';
import { Stack, Box,  Typography, InputAdornment, Button, Divider, IconButton } from '@mui/material';
import dayjs from 'dayjs';

import { useNavigate } from 'react-router-dom';
import { useLazyQuery, useMutation, useQuery } from '@apollo/client';
import { useFormik } from 'formik';
import * as yup from 'yup';

import TheTextField from '../../../../_shared/components/form-fields/TheTextField';
import { useFeedBacks } from '../../../../_shared/context/feedbacks/FeedBacksProvider';
import { GET_MEETING } from '../../../../_shared/graphql/queries/MeetingQueries';
import { POST_MEETING, PUT_MEETING } from '../../../../_shared/graphql/mutations/MeetingMutations';
import ProgressService from '../../../../_shared/services/feedbacks/ProgressService';
import { Close } from '@mui/icons-material';

const Item = styled(Stack)(({ theme }) => ({
  backgroundColor: theme.palette.mode === 'dark' ? '#1A2027' : '#fff',
  ...theme.typography.body2,
  padding: theme.spacing(2),
  textAlign: 'center',
  color: theme.palette.text.secondary,
}));

export default function AddMeetingReportForm({ idMeeting, title}) {
    const  { setNotifyAlert,  setConfirmDialog} = useFeedBacks();
    const validationSchema = yup.object({
        name: yup .string('Entrez le nom de véhicule').required('Le nom de véhicule est obligatoire'),
      });
    const formik = useFormik({
        initialValues: {
            meetingReportItems: [],
          },
        validationSchema: validationSchema,
        onSubmit: (values) => {
            let { image , ...meetingCopy } = values
            if(idMeeting && idMeeting != ''){
                onUpdateMeeting({ 
                    id : meetingCopy.id, 
                    meetingData : meetingCopy,
                    }
                )
            }
            else createMeeting({ 
                    variables: { 
                        meetingData : meetingCopy,
                        image : image,
                    }
                })
        },
    });
    const [createMeeting, { loading : loadingPost }] = useMutation(POST_MEETING, {
        onCompleted: (data) => {
            console.log(data);
            setNotifyAlert({
                isOpen: true,
                message: 'Ajouté avec succès',
                type: 'success'
            })
            let { __typename, ...meetingCopy } = data.createMeeting.meeting;
        },
        update(cache, { data: { createMeeting } }) {
            const newMeeting = createMeeting.meeting;
          
            cache.modify({
              fields: {
                meetings(existingMeetings = { totalCount: 0, nodes: [] }) {
                    return {
                        totalCount: existingMeetings.totalCount + 1,
                        nodes: [newMeeting, ...existingMeetings.nodes],
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
    const [updateMeeting, { loading : loadingPut }] = useMutation(PUT_MEETING, {
        onCompleted: (data) => {
            console.log(data);
            setNotifyAlert({
                isOpen: true,
                message: 'Modifié avec succès',
                type: 'success'
            })
            let { __typename, ...meetingCopy } = data.updateMeeting.meeting;
        },
        update(cache, { data: { updateMeeting } }) {
            const updatedMeeting = updateMeeting.meeting;
          
            cache.modify({
              fields: {
                meetings(existingMeetings = { totalCount: 0, nodes: [] }, { readField }) {
                    
                    const updatedMeetings = existingMeetings.nodes.map((meeting) =>
                        readField('id', meeting) === updatedMeeting.id ? updatedMeeting : meeting
                    );
            
                    return {
                        totalCount: existingMeetings.totalCount,
                        nodes: updatedMeetings,
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
    const onUpdateMeeting = (variables) => {
        setConfirmDialog({
          isOpen: true,
          title: 'ATTENTION',
          subTitle: "Voulez vous vraiment modifier ?",
          onConfirm: () => { setConfirmDialog({isOpen: false})
                updateMeeting({ variables })
            }
        })
      }
    const [getMeeting, { loading : loadingMeeting }] = useLazyQuery(GET_MEETING, {
        fetchPolicy: "network-only",
        onCompleted: (data) => {
            let { __typename, ...meetingCopy } = data.meeting;
            if(!meetingCopy?.meetingReportItems) meetingCopy['meetingReportItems'] = [];
            let items = []
            meetingCopy.meetingReportItems.forEach((item) =>{
                let { __typename, ...itemCopy } = item;
                items.push(itemCopy)
            })
            meetingCopy.meetingReportItems = items;
            formik.setValues(meetingCopy);
        },
        onError: (err) => console.log(err),
    })
    React.useEffect(()=>{
        if(idMeeting){
            getMeeting(({ variables: { id: idMeeting } }));
        }
    }, [idMeeting])
    const addChecklistItem = () => {
        formik.setValues({
          ...formik.values,
          meetingReportItems: [...formik.values.meetingReportItems, { localisation: '', comment: '', description: '' }]
        });
      };
    
      const removeChecklistItem = (index) => {
        const updatedReportItems = [...formik.values.meetingReportItems];
        updatedReportItems.splice(index, 1);
    
        formik.setValues({
          ...formik.values,
          meetingReportItems: updatedReportItems
        });
      };
    return (
        <Box sx={{ flexGrow: 1, paddingTop : 10 }}>
            {title && <Typography component="div" variant="h5">
                {title} {formik.values.number}
            </Typography>}
            { loadingMeeting && <ProgressService type="form" />}
            { !loadingMeeting &&
                <form onSubmit={formik.handleSubmit}>
                    <Grid container spacing={{ xs: 2, md: 3 }} columns={{ xs: 4, sm: 8, md: 12 }}>
                        <Grid xs={12} sm={12} md={12} item>
                            <Typography component="div" variant="h6">
                                Le compte rendu
                            </Typography>
                            {formik.values?.meetingReportItems?.map((item, index) => (
                                <Grid container spacing={{ xs: 2, md: 3 }} columns={{ xs: 4, sm: 8, md: 12 }} key={index}>
                                    <Grid xs={12} sm={4} md={4} item>
                                        <Item>
                                            <TheTextField variant="outlined" label="Localisation"
                                                value={item.localisation}
                                                onChange={(e) => formik.setFieldValue(`meetingReportItems.${index}.localisation`, e.target.value)}
                                                disabled={loadingPost || loadingPut}
                                                />
                                        </Item>
                                    </Grid>
                                    <Grid xs={12} sm={4} md={4} item>
                                        <Item>
                                            <TheTextField variant="outlined" label="Commentaire" multiline rows={4}
                                                value={item.comment}
                                                onChange={(e) => formik.setFieldValue(`meetingReportItems.${index}.comment`, e.target.value)}
                                                disabled={loadingPost || loadingPut}
                                                />
                                        </Item>
                                    </Grid>
                                    <Grid xs={12} sm={4} md={4} item>
                                        <Item>
                                            <TheTextField variant="outlined" label="Description" multiline rows={4}
                                                value={item.description}
                                                onChange={(e) => formik.setFieldValue(`meetingReportItems.${index}.description`, e.target.value)}
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
                    </Grid>
                </form>
            }
        </Box>
    );
}
