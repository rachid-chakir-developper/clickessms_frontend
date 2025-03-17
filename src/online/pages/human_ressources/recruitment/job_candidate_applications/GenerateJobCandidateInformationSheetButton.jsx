import * as React from 'react';
import Button from '@mui/material/Button';
import { styled } from '@mui/material/styles';
import Dialog from '@mui/material/Dialog';
import DialogTitle from '@mui/material/DialogTitle';
import DialogContent from '@mui/material/DialogContent';
import DialogActions from '@mui/material/DialogActions';
import IconButton from '@mui/material/IconButton';
import CloseIcon from '@mui/icons-material/Close';
import { Grid, MenuItem, Stack, Tooltip, Typography } from '@mui/material';
import { useFormik } from 'formik';
import * as yup from 'yup';
import dayjs from 'dayjs';
import { useLazyQuery, useMutation } from '@apollo/client';
import { Add, AssignmentInd, ReceiptLong, Refresh } from '@mui/icons-material';
import { POST_JOB_CANDIDATE_INFORMATION_SHEET } from '../../../../../_shared/graphql/mutations/JobCandidateInformationSheetMutations';
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

function DialogGenerateJobCandidateInformationSheet({ open, onClose, onConfirm, jobCandidateApplication }) {
    const {jobCandidate, jobPosition } = jobCandidateApplication
    const navigate = useNavigate();
    const { setNotifyAlert, setConfirmDialog } = useFeedBacks();
    const validationSchema = yup.object({
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
            message: '',
        },
        validationSchema: validationSchema,
        onSubmit: (values) => {
        let valuesCopy = {...values};
        handleOk(valuesCopy);
        },
    });

    const [createJobCandidateInformationSheet, { loading: loadingPost }] = useMutation(POST_JOB_CANDIDATE_INFORMATION_SHEET, {
        onCompleted: (data) => {
            console.log(data);
            setNotifyAlert({
                isOpen: true,
                message: 'Ajouté avec succès',
                type: 'success',
            });
            let { __typename, ...jobCandidateInformationSheetCopy } = data.createJobCandidateInformationSheet.jobCandidateInformationSheet;
            //   formik.setValues(jobCandidateInformationSheetCopy);
            navigate(`/online/ressources-humaines/recrutement/fiches-renseignement/modifier/${jobCandidateInformationSheetCopy?.id}`)
        },
        update(cache, { data: { createJobCandidateInformationSheet } }) {
            const newJobCandidateInformationSheet = createJobCandidateInformationSheet.jobCandidateInformationSheet;
        
            cache.modify({
                fields: {
                    jobCandidateInformationSheets(existingJobCandidateInformationSheets = { totalCount: 0, nodes: [] }, { readField }) {
                        // Vérifier si l'élément existe déjà dans le cache
                        const existingIndex = existingJobCandidateInformationSheets.nodes.findIndex(
                            (sheet) => readField('id', sheet) === newJobCandidateInformationSheet.id
                        );
        
                        let updatedNodes;
                        if (existingIndex !== -1) {
                            // Si l'élément existe déjà, le mettre à jour
                            updatedNodes = existingJobCandidateInformationSheets.nodes.map((sheet, index) =>
                                index === existingIndex ? newJobCandidateInformationSheet : sheet
                            );
                        } else {
                            // Sinon, ajouter le nouvel élément
                            updatedNodes = [newJobCandidateInformationSheet, ...existingJobCandidateInformationSheets.nodes];
                        }
        
                        // Mettre à jour le totalCount en fonction de l'ajout
                        return {
                            totalCount: existingJobCandidateInformationSheets.totalCount + 1,
                            nodes: updatedNodes,
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
    const handleOk = (values) => {
        setConfirmDialog({
        isOpen: true,
        title: 'ATTENTION',
        subTitle: 'Voulez-vous vraiment générer cet fiche de renseignement ?',
        onConfirm: () => {
            setConfirmDialog({ isOpen: false });
            createJobCandidateInformationSheet({
                variables: { jobCandidateInformationSheetData: values},
            });
        },
        });
    };

    React.useEffect(() => {
        if (open) {
            formik.setValues({
                jobPosition: jobPosition?.id,
                jobCandidate: jobCandidate?.id,
                message: '',
            })
        }
    }, [open]);


    return (
        <BootstrapDialog onClose={onClose} aria-labelledby="customized-dialog-title" open={open}>
            <DialogTitle sx={{ m: 0, p: 2 }} id="customized-dialog-title">
                Générer la fiche de renseignement pour  <em>[{`${jobCandidate?.firstName} ${jobCandidate?.lastName}`}]</em>
            </DialogTitle>
            {/* Sous-titre ajouté ici */}
            <Typography variant="subtitle2" sx={{ px: 2, color: (theme) => theme.palette.text.secondary  }}>
                Un email sera envoyé au candidat avec un lien sécurisé pour compléter sa fiche de renseignement.
            </Typography>
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
                                    label="Message (facultatif)"
                                    multiline
                                    rows={8}
                                    value={formik.values.message}
                                    onChange={(e) =>
                                    formik.setFieldValue('message', e.target.value)
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


export default function GenerateJobCandidateInformationSheetButton({ jobCandidateApplication , buttonType="button", size="medium", label="Générer la fiche de renseignement" }) {
    
    const [isDialogGenerateJobCandidateInformationSheetOpen, setDialogGenerateJobCandidateInformationSheetOpen] = React.useState(false);

    const DialogGenerateJobCandidateInformationSheetOpen = () => {
        setDialogGenerateJobCandidateInformationSheetOpen(true);
    };

    const handleDialogGenerateJobCandidateInformationSheetConfirm = (value) => {
        console.log('value data:', value);
        setDialogGenerateJobCandidateInformationSheetOpen(false); // Fermer le dialogue après la confirmation
    };
    return (
        <>  
                {buttonType==="button" && 
                    <Button size={size} variant="outlined" onClick={DialogGenerateJobCandidateInformationSheetOpen} endIcon={<AssignmentInd />}>
                    {label}
                </Button>
                }
                {buttonType==="buttonIcon" && <Tooltip title={label}>
                    <IconButton size={size} onClick={DialogGenerateJobCandidateInformationSheetOpen}>
                        <AssignmentInd size={size} />
                    </IconButton>
                </Tooltip>
                }
                {buttonType==="menuItem" &&
                    <Tooltip title={label}>
                        <MenuItem onClick={DialogGenerateJobCandidateInformationSheetOpen}>
                            <AssignmentInd sx={{ mr: 2 }} />
                            {label}
                        </MenuItem>
                    </Tooltip>
                }
            <DialogGenerateJobCandidateInformationSheet
                open={isDialogGenerateJobCandidateInformationSheetOpen}
                onClose={() => setDialogGenerateJobCandidateInformationSheetOpen(false)}
                onConfirm={handleDialogGenerateJobCandidateInformationSheetConfirm}
                jobCandidateApplication={jobCandidateApplication}
            />
        </>
    );
}

