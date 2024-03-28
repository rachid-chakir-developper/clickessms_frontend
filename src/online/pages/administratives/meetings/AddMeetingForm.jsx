import * as React from 'react';
import { experimentalStyled as styled } from '@mui/material/styles';
import Grid from '@mui/material/Unstable_Grid2';
import { Stack, Box,  Typography, InputAdornment, Button, Divider } from '@mui/material';
import dayjs from 'dayjs';

import { Link, useNavigate } from 'react-router-dom';
import { useLazyQuery, useMutation, useQuery } from '@apollo/client';
import { useFormik } from 'formik';
import * as yup from 'yup';

import TheTextField from '../../../../_shared/components/form-fields/TheTextField';
import ImageFileField from '../../../../_shared/components/form-fields/ImageFileField';
import TheDesktopDatePicker from '../../../../_shared/components/form-fields/TheDesktopDatePicker';
import { useFeedBacks } from '../../../../_shared/context/feedbacks/FeedBacksProvider';
import { GET_MEETING } from '../../../../_shared/graphql/queries/MeetingQueries';
import { POST_MEETING, PUT_MEETING } from '../../../../_shared/graphql/mutations/MeetingMutations';
import ProgressService from '../../../../_shared/services/feedbacks/ProgressService';
import TheSwitch from '../../../../_shared/components/form-fields/theSwitch';
import TheDateTimePicker from '../../../../_shared/components/form-fields/TheDateTimePicker';
import { GET_BENEFICIARIES } from '../../../../_shared/graphql/queries/BeneficiaryQueries';
import TheAutocomplete from '../../../../_shared/components/form-fields/TheAutocomplete';
import { GET_EMPLOYEES } from '../../../../_shared/graphql/queries/EmployeeQueries';
import SelectCheckmarks from '../../../../_shared/components/form-fields/SelectCheckmarks';
import { GET_DATAS_MEETING } from '../../../../_shared/graphql/queries/DataQueries';

const Item = styled(Stack)(({ theme }) => ({
  backgroundColor: theme.palette.mode === 'dark' ? '#1A2027' : '#fff',
  ...theme.typography.body2,
  padding: theme.spacing(2),
  textAlign: 'center',
  color: theme.palette.text.secondary,
}));

export default function AddMeetingForm({ idMeeting, title}) {
    const  { setNotifyAlert,  setConfirmDialog} = useFeedBacks();
    const navigate = useNavigate();
    const validationSchema = yup.object({
        title: yup .string("Entrez l'objet de la réunion").required("L'objet de la réunion est obligatoire")
      });
    const formik = useFormik({
        initialValues: {
            number : '', title : '', videoCallLink: '',
            startingDateTime : dayjs(new Date()), endingDateTime : dayjs(new Date()),
            description : '', observation : '', participants: [], beneficiaries: [], employee : null, reasons: [], otherReasons: ''
          },
        validationSchema: validationSchema,
        onSubmit: (values) => {
            let meetingCopy = {...values}
            meetingCopy.participants = meetingCopy.participants.map(i => i?.id)
            meetingCopy.beneficiaries = meetingCopy.beneficiaries.map(i => i?.id)
            meetingCopy.reasons = meetingCopy.reasons.map(i => i?.id)
            meetingCopy.employee = meetingCopy.employee ? meetingCopy.employee.id : null
            if(idMeeting && idMeeting != ''){
                onUpdateMeeting({ 
                    id : meetingCopy.id, 
                    meetingData : meetingCopy,
                    }
                )
            }
            else createMeeting({ 
                    variables: { 
                        meetingData : meetingCopy
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
        } = useQuery(GET_DATAS_MEETING, { fetchPolicy: "network-only" })

    const [createMeeting, { loading : loadingPost }] = useMutation(POST_MEETING, {
        onCompleted: (data) => {
            console.log(data);
            setNotifyAlert({
                isOpen: true,
                message: 'Ajouté avec succès',
                type: 'success'
            })
            let { __typename, ...meetingCopy } = data.createMeeting.meeting;
        //   formik.setValues(meetingCopy);
            navigate('/online/administratif/reunions/liste');
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
        //   formik.setValues(meetingCopy);
            navigate('/online/administratif/reunions/liste');
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
            let { __typename, ...meetingCopy1 } = data.meeting;
            let { folder, ...meetingCopy } = meetingCopy1;
            meetingCopy.startingDateTime = dayjs(meetingCopy.startingDateTime)
            meetingCopy.endingDateTime = dayjs(meetingCopy.endingDateTime)
            meetingCopy.participants = meetingCopy.participants ? meetingCopy.participants.map(i => i?.employee) : []
            meetingCopy.beneficiaries = meetingCopy.beneficiaries ? meetingCopy.beneficiaries.map(i => i?.beneficiary) : []
            formik.setValues(meetingCopy);
        },
        onError: (err) => console.log(err),
    })
    React.useEffect(()=>{
        if(idMeeting){
            getMeeting(({ variables: { id: idMeeting } }));
        }
    }, [idMeeting])
    return (
        <Box sx={{ flexGrow: 1 }}>
            <Typography component="div" variant="h5">
                {title} {formik.values.number}
            </Typography>
            { loadingMeeting && <ProgressService type="form" />}
            { !loadingMeeting &&
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
                                <TheTextField variant="outlined" label="Objet" id="title"
                                    value={formik.values.title} required
                                    onChange={(e) => formik.setFieldValue('title', e.target.value)}
                                    onBlur={formik.handleBlur}
                                    error={formik.touched.title && Boolean(formik.errors.title)}
                                    helperText={formik.touched.title && formik.errors.title}
                                    disabled={loadingPost || loadingPut}
                                />
                            </Item>
                            <Item>
                                <TheTextField variant="outlined" label="Lien de la visio"
                                    value={formik.values.videoCallLink}
                                    onChange={(e) => formik.setFieldValue('videoCallLink', e.target.value)}
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
                                <TheAutocomplete options={employeesData?.employees?.nodes} label="Participants"
                                    placeholder="Ajouter un participant"
                                    limitTags={3}
                                    value={formik.values.participants}
                                    onChange={(e, newValue) => formik.setFieldValue('participants', newValue)}/>
                            </Item>
                            <Item>
                                <TheAutocomplete options={beneficiariesData?.beneficiaries?.nodes} label="Bénificiaires"
                                    placeholder="Ajouter un bénificiaire"
                                    limitTags={3}
                                    value={formik.values.beneficiaries}
                                    onChange={(e, newValue) => formik.setFieldValue('beneficiaries', newValue)}/>
                            </Item>
                        </Grid>
                        <Grid xs={2} sm={4} md={4} item>
                            <Item>
                                <SelectCheckmarks  options={dataData?.meetingReasons} label="Motifs"
                                    placeholder="Ajouter un motif"
                                    limitTags={3}
                                    value={formik.values.reasons}
                                    onChange={(e, newValue) => formik.setFieldValue('reasons', newValue)}/>
                            </Item>
                            <Item>
                                <TheTextField variant="outlined" label="Autres motifs"
                                    value={formik.values.otherReasons}
                                    onChange={(e) => formik.setFieldValue('otherReasons', e.target.value)}
                                    helperText="Si vous ne trouvez pas le motif dans la liste dessus."
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
                                <Link to="/online/administratif/reunions/liste" className="no_style">
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
