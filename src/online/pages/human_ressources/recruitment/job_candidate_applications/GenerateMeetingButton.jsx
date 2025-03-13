import * as React from 'react';
import Button from '@mui/material/Button';
import { styled } from '@mui/material/styles';
import Dialog from '@mui/material/Dialog';
import DialogTitle from '@mui/material/DialogTitle';
import DialogContent from '@mui/material/DialogContent';
import DialogActions from '@mui/material/DialogActions';
import IconButton from '@mui/material/IconButton';
import CloseIcon from '@mui/icons-material/Close';
import { Grid, MenuItem, Stack, Tooltip } from '@mui/material';
import { useFormik } from 'formik';
import * as yup from 'yup';
import dayjs from 'dayjs';
import { useLazyQuery, useMutation } from '@apollo/client';
import { Add, Event, ReceiptLong, Refresh } from '@mui/icons-material';
import { GENERATE_MEETING } from '../../../../../_shared/graphql/mutations/MeetingMutations';
import { useFeedBacks } from '../../../../../_shared/context/feedbacks/FeedBacksProvider';
import TheAutocomplete from '../../../../../_shared/components/form-fields/TheAutocomplete';
import { useNavigate } from 'react-router-dom';
import TheTextField from '../../../../../_shared/components/form-fields/TheTextField';
import { GET_EMPLOYEES } from '../../../../../_shared/graphql/queries/EmployeeQueries';
import TheDateTimePicker from '../../../../../_shared/components/form-fields/TheDateTimePicker';

const Item = styled(Stack)(({ theme }) => ({
  backgroundColor: theme.palette.mode === 'dark' ? '#1A2027' : '#fff',
  ...theme.typography.body2,
  padding: theme.spacing(2),
  textAlign: 'center',
  color: theme.palette.text.secondary,
}));

const BootstrapDialog = styled(Dialog)(({ theme }) => ({
  '& .MuiDialogContent-root': {
    padding: theme.spacing(2),
  },
  '& .MuiDialogActions-root': {
    padding: theme.spacing(1),
  },
}));

function DialogGenerateMeeting({ open, onClose, onConfirm, jobCandidateApplication }) {
    const {jobCandidate, jobPosition } = jobCandidateApplication
    const navigate = useNavigate();
    const { setNotifyAlert, setConfirmDialog } = useFeedBacks();
    const validationSchema = yup.object({
        topics: yup
          .string("Entrez l'objet de l'entretien")
          .required("L'ordre du jour est obligatoire"),
        jobPosition: yup
        .string()
        .required('Le champ fiche est obligatoire.'),
        jobCandidate: yup
        .string()
        .required('Le champ candidat est obligatoire.'),
    });

    const formik = useFormik({
        initialValues: {
            jobPosition: jobPosition?.id,
            jobCandidate: jobCandidate?.id,
            availabilityDate:  jobCandidate?.availabilityDate ? dayjs(jobCandidate?.availabilityDate) : null,
            description: jobCandidate?.description,
        },
        validationSchema: validationSchema,
        onSubmit: (values) => {
        let valuesCopy = {...values};
        handleOk(valuesCopy);
        },
    });

    const [generateMeeting, { loading: loadingPost }] = useMutation(
        GENERATE_MEETING,
        {
            onCompleted: (data) => {
                console.log(data);
                if (data.generateMeeting.success) {
                    setNotifyAlert({
                        isOpen: true,
                        message: 'Ajouté avec succès',
                        type: 'success',
                    });
                    // Utiliser une copie des données pour éviter de muter directement l'objet
                    let { __typename, ...meetingsCopy } = data.generateMeeting.meetings;
                    onClose();
                    navigate(`/online/ressources-humaines/recrutement/vivier-candidats/details/${jobCandidate?.id}`);
                } else {
                    setNotifyAlert({
                        isOpen: true,
                        message: `Non ajouté ! Veuillez réessayer. ${data.generateMeeting.message}`,
                        type: 'error',
                    });
                }
            },
            update(cache, { data: { generateMeeting } }) {
                if (generateMeeting.success) {
                    const newMeetings = generateMeeting.meetings;
    
                    cache.modify({
                        fields: {
                            meetings(existingMeetings = { totalCount: 0, nodes: [] }, { readField }) {
                                // Ajouter ou mettre à jour chaque nouvelle candidature
                                let updatedMeetings = [...existingMeetings.nodes];
    
                                // Ajouter ou mettre à jour les candidatures dans le cache
                                newMeetings.forEach(newMeeting => {
                                    const existingMeetingIndex = existingMeetings.nodes.findIndex(
                                        (meeting) => readField('id', meeting) === newMeeting.id
                                    );
    
                                    if (existingMeetingIndex > -1) {
                                        // Mise à jour de l'élément existant
                                        updatedMeetings[existingMeetingIndex] = newMeeting;
                                    } else {
                                        // Ajouter une nouvelle candidature
                                        updatedMeetings = [newMeeting, ...updatedMeetings];
                                    }
                                });
    
                                return {
                                    totalCount: updatedMeetings.length,
                                    nodes: updatedMeetings,
                                };
                            },
                        },
                    });
                }
            },
            onError: (err) => {
                console.log(err);
                setNotifyAlert({
                    isOpen: true,
                    message: 'Non ajouté ! Veuillez réessayer.',
                    type: 'error',
                });
            },
        }
    );
    
const [getEmployees, {
    loading: loadingEmployees,
    data: employeesData,
    error: employeesError,
    fetchMore: fetchMoreEmployees,
  }] = useLazyQuery(GET_EMPLOYEES, { variables: { employeeFilter : null, page: 1, limit: 10 } });
  
  const onGetEmployees = (keyword)=>{
    getEmployees({ variables: { employeeFilter : keyword === '' ? null : {keyword}, page: 1, limit: 10 } })
  }
    const handleOk = (values) => {
        setConfirmDialog({
        isOpen: true,
        title: 'ATTENTION',
        subTitle: 'Voulez-vous vraiment générer la facture ?',
        onConfirm: () => {
            setConfirmDialog({ isOpen: false });
            generateMeeting({
            variables: { generateMeetingData: values},
            });
        },
        });
    };

    React.useEffect(() => {
        if (open) {
            formik.setValues({
                jobPositions: [],
                jobCandidate: jobCandidate?.id,
                email: jobCandidate?.email,
                phone: jobCandidate?.phone,
                jobTitle: jobCandidate?.jobTitle,
                rating: jobCandidate?.rating,
                availabilityDate:  jobCandidate?.availabilityDate ? dayjs(jobCandidate?.availabilityDate) : null,
                description: jobCandidate?.description,
            })
        }
    }, [open]);


    return (
        <BootstrapDialog onClose={onClose} aria-labelledby="customized-dialog-title" open={open}>
        <DialogTitle sx={{ m: 0, p: 2 }} id="customized-dialog-title">
            Programmer un entretien avec <em>[{`${jobCandidate?.firstName} ${jobCandidate?.lastName}`}]</em>
        </DialogTitle>
        <IconButton
            aria-label="close"
            onClick={onClose}
            sx={{
            position: 'absolute',
            right: 8,
            top: 8,
            color: (theme) => theme.palette.grey[500],
            }}
        >
            <CloseIcon />
        </IconButton>
        <form onSubmit={formik.handleSubmit}>
            <DialogContent dividers>
            <Grid container columns={{ xs: 4, sm: 8, md: 12 }}>
                <Grid item xs={12} sm={12} md={12}>
                    <Item>
                        <TheTextField
                            variant="outlined"
                            label="Ordre du jour"
                            id="topics"
                            multiline
                            minRows={6}
                            value={formik.values.topics}
                            required
                            onChange={(e) =>
                                formik.setFieldValue('topics', e.target.value)
                            }
                            onBlur={formik.handleBlur}
                            error={formik.touched.topics && Boolean(formik.errors.topics)}
                            helperText={formik.touched.topics && formik.errors.topics}
                            disabled={loadingPost}
                        />
                    </Item>
                </Grid>
                <Grid item xs={12} sm={12} md={6}>
                    <Item>
                        <TheDateTimePicker
                            label="Date et heure de début"
                            value={formik.values.startingDateTime}
                            onChange={(date) =>
                                formik.setFieldValue('startingDateTime', date)
                            }
                            disabled={loadingPost}
                        />
                    </Item>
                </Grid>
                <Grid item xs={12} sm={12} md={6}>
                    <Item>
                        <TheDateTimePicker
                            label="Date de fin"
                            value={formik.values.endingDateTime}
                            onChange={(date) =>
                                formik.setFieldValue('endingDateTime', date)
                            }
                            disabled={loadingPost}
                        />
                    </Item>
                </Grid>
                <Grid item xs={12} sm={12} md={12} >
                    <Item>
                        <TheAutocomplete
                            options={employeesData?.employees?.nodes}
                            onInput={(e) => {
                                onGetEmployees(e.target.value)
                            }}
                            onFocus={(e) => {
                                onGetEmployees(e.target.value)
                            }}
                            label="Recruteur(s)"
                            placeholder="Ajouter un recruteur"
                            limitTags={3}
                            value={formik.values.participants}
                            onChange={(e, newValue) =>
                                formik.setFieldValue('participants', newValue)
                            }
                            disabled={loadingPost}
                        />
                    </Item>
                </Grid>
                <Grid item xs={12} sm={12} md={12}>
                    <Item>
                        <TheTextField
                            variant="outlined"
                            label="Détail"
                            multiline
                            rows={8}
                            value={formik.values.description}
                            onChange={(e) =>
                            formik.setFieldValue('description', e.target.value)
                            }
                            disabled={loadingPost}
                        />
                    </Item>
                </Grid>
            </Grid>
            </DialogContent>
            <DialogActions>
            <Button type="submit" variant="contained" disabled={!formik.isValid}>
                Valider
            </Button>
            </DialogActions>
        </form>
        </BootstrapDialog>
    );
}


export default function GenerateMeetingButton({ jobCandidateApplication , buttonType="button", size="medium", label="Programmer un entretien" }) {
    
    const [isDialogGenerateMeetingOpen, setDialogGenerateMeetingOpen] = React.useState(false);

    const DialogGenerateMeetingOpen = () => {
        setDialogGenerateMeetingOpen(true);
    };

    const handleDialogGenerateMeetingConfirm = (value) => {
        console.log('value data:', value);
        setDialogGenerateMeetingOpen(false); // Fermer le dialogue après la confirmation
    };
    return (
        <>  
                {buttonType==="button" && 
                    <Button size={size} variant="outlined" onClick={DialogGenerateMeetingOpen} endIcon={<Event />}>
                    {label}
                </Button>
                }
                {buttonType==="buttonIcon" && <Tooltip title={label}>
                    <IconButton size={size} onClick={DialogGenerateMeetingOpen}>
                        <Event size={size} />
                    </IconButton>
                </Tooltip>
                }
                {buttonType==="menuItem" &&
                    <Tooltip title={label}>
                        <MenuItem onClick={DialogGenerateMeetingOpen}>
                            <Event sx={{ mr: 2 }} />
                            {label}
                        </MenuItem>
                    </Tooltip>
                }
            <DialogGenerateMeeting
                open={isDialogGenerateMeetingOpen}
                onClose={() => setDialogGenerateMeetingOpen(false)}
                onConfirm={handleDialogGenerateMeetingConfirm}
                jobCandidateApplication={jobCandidateApplication}
            />
        </>
    );
}

