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
import { GENERATE_MEETING, POST_MEETING } from '../../../../../_shared/graphql/mutations/MeetingMutations';
import { useFeedBacks } from '../../../../../_shared/context/feedbacks/FeedBacksProvider';
import TheAutocomplete from '../../../../../_shared/components/form-fields/TheAutocomplete';
import { useNavigate } from 'react-router-dom';
import TheTextField from '../../../../../_shared/components/form-fields/TheTextField';
import { GET_EMPLOYEES } from '../../../../../_shared/graphql/queries/EmployeeQueries';
import TheDateTimePicker from '../../../../../_shared/components/form-fields/TheDateTimePicker';
import DialogSendMail from '../../../../_shared/components/the_mailer/DialogSendMail';

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
            topics: '',
            meetingMode: 'CANDIDATE_INTERVIEW',
            jobPosition: jobPosition?.id,
            jobCandidate: jobCandidate?.id,
            startingDateTime: null,
            endingDateTime: null,
            description: '',
            participants: []
        },
        validationSchema: validationSchema,
        onSubmit: (values) => {
        let valuesCopy = {...values};
        valuesCopy.participants = valuesCopy.participants.map((i) => i?.id);
        handleOk(valuesCopy);
        },
    });

      const [createMeeting, { loading: loadingPost }] = useMutation(POST_MEETING, {
        onCompleted: (data) => {
            console.log(data);
            setNotifyAlert({
                isOpen: true,
                message: 'Ajouté avec succès',
                type: 'success',
            });
            let { __typename, ...meetingCopy } = data.createMeeting.meeting;
            //   formik.setValues(meetingCopy);
            onClose(meetingCopy)
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
          console.log(err);
          setNotifyAlert({
            isOpen: true,
            message: 'Non ajouté ! Veuillez réessayer.',
            type: 'error',
          });
        },
      });
    
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
        subTitle: 'Voulez-vous vraiment créer cet entretien ?',
        onConfirm: () => {
            setConfirmDialog({ isOpen: false });
            createMeeting({
                variables: { meetingData: values},
            });
        },
        });
    };

    React.useEffect(() => {
        if (open) {
            formik.setValues({
                topics: '',
                meetingMode: 'CANDIDATE_INTERVIEW',
                jobPosition: jobPosition?.id,
                jobCandidate: jobCandidate?.id,
                startingDateTime: null,
                endingDateTime: null,
                description: '',
                participants: []
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
                            label="Date de et heure fin"
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
                            options={employeesData?.employees?.nodes || []}
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


export default function GenerateMeetingButton({ onGenerated, jobCandidateApplication , buttonType="button", size="medium", label="Programmer un entretien" }) {
    
    const [isDialogGenerateMeetingOpen, setDialogGenerateMeetingOpen] = React.useState(false);

    const DialogGenerateMeetingOpen = () => {
        setDialogGenerateMeetingOpen(true);
    };

    const handleDialogGenerateMeetingConfirm = (value) => {
        console.log('value data:', value);
        setDialogGenerateMeetingOpen(false); // Fermer le dialogue après la confirmation
    };
    const [openDialog, setOpenDialog] = React.useState(false);
      const handleCloseDialog = () => {
        setOpenDialog(false);
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
                onClose={(meeting) => {
                    setDialogGenerateMeetingOpen(false)
                    if(meeting && meeting?.id) setOpenDialog(true);
                    if(onGenerated && meeting && meeting?.id) onGenerated(meeting)
                }}
                onConfirm={handleDialogGenerateMeetingConfirm}
                jobCandidateApplication={jobCandidateApplication}
            />
            {/* Modal pour demander le commentaire */}
            <DialogSendMail open={openDialog} onClose={handleCloseDialog} jobCandidateApplication={jobCandidateApplication}
                onSend={(values) => console.log("Email envoyé avec :", values)} />
        </>
    );
}

