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
import TheDesktopDatePicker from '../../../../../_shared/components/form-fields/TheDesktopDatePicker';
import dayjs from 'dayjs';
import { useLazyQuery, useMutation } from '@apollo/client';
import { Add, ReceiptLong, Refresh } from '@mui/icons-material';
import { GENERATE_JOB_CANDIDATE_APPLICATION } from '../../../../../_shared/graphql/mutations/JobCandidateApplicationMutations';
import { useFeedBacks } from '../../../../../_shared/context/feedbacks/FeedBacksProvider';
import TheAutocomplete from '../../../../../_shared/components/form-fields/TheAutocomplete';
import { useNavigate } from 'react-router-dom';
import RatingField from '../../../../../_shared/components/form-fields/RatingField';
import TheTextField from '../../../../../_shared/components/form-fields/TheTextField';
import { GET_JOB_POSITIONS } from '../../../../../_shared/graphql/queries/JobPositionQueries';

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

function DialogGenerateJobCandidateApplication({ open, onClose, onConfirm, jobCandidate }) {
    const navigate = useNavigate();
    const { setNotifyAlert, setConfirmDialog } = useFeedBacks();
    const validationSchema = yup.object({
        jobPositions: yup
        .array()
        .of(yup.mixed().required()) // Chaque élément doit être défini
        .min(1, 'Vous devez sélectionner au moins une fiche.'),
        jobCandidate: yup
        .string()
        .required('Le champ candidat est obligatoire.'),
    });

    const formik = useFormik({
        initialValues: {
            jobPositions: [],
            jobCandidate: jobCandidate?.id,
            email: jobCandidate?.email,
            phone: jobCandidate?.phone,
            jobTitle: jobCandidate?.jobTitle,
            rating: jobCandidate?.rating,
            availabilityDate:  jobCandidate?.availabilityDate ? dayjs(jobCandidate?.availabilityDate) : null,
            description: jobCandidate?.description,
        },
        validationSchema: validationSchema,
        onSubmit: (values) => {
        let valuesCopy = {...values};
        valuesCopy.jobPositions = valuesCopy.jobPositions.map((jobPosition) => jobPosition.id)
        handleOk(valuesCopy);
        },
    });

    const [generateJobCandidateApplication, { loading: loadingPost }] = useMutation(
        GENERATE_JOB_CANDIDATE_APPLICATION,
        {
            onCompleted: (data) => {
                console.log(data);
                if (data.generateJobCandidateApplication.success) {
                    setNotifyAlert({
                        isOpen: true,
                        message: 'Ajouté avec succès',
                        type: 'success',
                    });
                    // Utiliser une copie des données pour éviter de muter directement l'objet
                    let { __typename, ...jobCandidateApplicationsCopy } = data.generateJobCandidateApplication.jobCandidateApplications;
                    onClose();
                    navigate(`/online/ressources-humaines/recrutement/vivier-candidats/details/${jobCandidate?.id}`);
                } else {
                    setNotifyAlert({
                        isOpen: true,
                        message: `Non ajouté ! Veuillez réessayer. ${data.generateJobCandidateApplication.message}`,
                        type: 'error',
                    });
                }
            },
            update(cache, { data: { generateJobCandidateApplication } }) {
                if (generateJobCandidateApplication.success) {
                    const newJobCandidateApplications = generateJobCandidateApplication.jobCandidateApplications;
    
                    cache.modify({
                        fields: {
                            jobCandidateApplications(existingJobCandidateApplications = { totalCount: 0, nodes: [] }, { readField }) {
                                // Ajouter ou mettre à jour chaque nouvelle candidature
                                let updatedJobCandidateApplications = [...existingJobCandidateApplications.nodes];
    
                                // Ajouter ou mettre à jour les candidatures dans le cache
                                newJobCandidateApplications.forEach(newJobCandidateApplication => {
                                    const existingJobCandidateApplicationIndex = existingJobCandidateApplications.nodes.findIndex(
                                        (jobCandidateApplication) => readField('id', jobCandidateApplication) === newJobCandidateApplication.id
                                    );
    
                                    if (existingJobCandidateApplicationIndex > -1) {
                                        // Mise à jour de l'élément existant
                                        updatedJobCandidateApplications[existingJobCandidateApplicationIndex] = newJobCandidateApplication;
                                    } else {
                                        // Ajouter une nouvelle candidature
                                        updatedJobCandidateApplications = [newJobCandidateApplication, ...updatedJobCandidateApplications];
                                    }
                                });
    
                                return {
                                    totalCount: updatedJobCandidateApplications.length,
                                    nodes: updatedJobCandidateApplications,
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
    

    const handleOk = (values) => {
        setConfirmDialog({
        isOpen: true,
        title: 'ATTENTION',
        subTitle: 'Voulez-vous vraiment générer la facture ?',
        onConfirm: () => {
            setConfirmDialog({ isOpen: false });
            generateJobCandidateApplication({
            variables: { generateJobCandidateApplicationData: values},
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


    const [getJobPositions, {
        loading: loadingJobPositions,
        data: jobPositionsData,
        error: jobPositionsError,
        fetchMore: fetchMoreJobPositions,
    }] = useLazyQuery(GET_JOB_POSITIONS, { variables: { jobPositionFilter : null, page: 1, limit: 10 } });
    
    const onGetJobPositions = (keyword)=>{
        getJobPositions({ variables: { jobPositionFilter : keyword === '' ? null : {keyword}, page: 1, limit: 10 } })
    }

    return (
        <BootstrapDialog onClose={onClose} aria-labelledby="customized-dialog-title" open={open}>
        <DialogTitle sx={{ m: 0, p: 2 }} id="customized-dialog-title">
            Candidater et associer <em>[{`${jobCandidate?.firstName} ${jobCandidate?.lastName}`}]</em>
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
                <Grid item xs={12} sm={12} md={12} >
                    <Item>
                        <TheAutocomplete
                            options={jobPositionsData?.jobPositions?.nodes}
                            onInput={(e) => {
                                onGetJobPositions(e.target.value)
                            }}
                            onFocus={(e) => {
                                onGetJobPositions(e.target.value)
                            }}
                            id="jobPositions"
                            label="Fiches besoin"
                            placeholder="Ajouter une fiche ?"
                            limitTags={3}
                            value={formik.values.jobPositions}
                            onChange={(e, newValue) =>
                                formik.setFieldValue('jobPositions', newValue)
                            }
                            onBlur={formik.handleBlur}
                            error={formik.touched.jobPositions && Boolean(formik.errors.jobPositions)}
                            helperText={formik.touched.jobPositions && formik.errors.jobPositions}
                            disabled={loadingPost}
                        />
                    </Item>
                </Grid>
                <Grid item xs={12} sm={12} md={6} >
                    <Item>
                        <TheTextField
                        variant="outlined"
                        label="E-mail"
                        value={formik.values.email}
                        onChange={(e) =>
                            formik.setFieldValue('email', e.target.value)
                        }
                        disabled={loadingPost}
                        />
                    </Item>
                </Grid>
                <Grid item xs={12} sm={12} md={6} >
                    <Item>
                        <TheTextField
                            variant="outlined"
                            label="Tél"
                            value={formik.values.phone}
                            onChange={(e) =>
                            formik.setFieldValue('phone', e.target.value)
                            }
                            disabled={loadingPost}
                        />
                    </Item>
                </Grid>
                <Grid item xs={12} sm={12} md={6} >
                    <Item>
                        <TheDesktopDatePicker
                            label="Disponible le"
                            value={formik.values.availabilityDate}
                            onChange={(date) =>
                            formik.setFieldValue('availabilityDate', date)
                            }
                            disabled={loadingPost}
                        />
                    </Item>
                </Grid>
                <Grid item xs={12} sm={12} md={6}>
                    <Item>
                        <RatingField
                            size="large"
                            variant="outlined"
                            label="Note"
                            value={formik.values.rating}
                            onChange={(e) => formik.setFieldValue('rating', e)}
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


export default function GenerateJobCandidateApplicationButton({ jobCandidate , buttonType="button", size="medium", label="Candidater et associer" }) {
    const [isDialogGenerateJobCandidateApplicationOpen, setDialogGenerateJobCandidateApplicationOpen] = React.useState(false);

    const DialogGenerateJobCandidateApplicationOpen = () => {
        setDialogGenerateJobCandidateApplicationOpen(true);
    };

    const handleDialogGenerateJobCandidateApplicationConfirm = (value) => {
        console.log('value data:', value);
        setDialogGenerateJobCandidateApplicationOpen(false); // Fermer le dialogue après la confirmation
    };
    return (
        <>  
                {buttonType==="button" && 
                    <Button size={size} variant="outlined" onClick={DialogGenerateJobCandidateApplicationOpen} endIcon={<ReceiptLong />}>
                    {label}
                </Button>
                }
                {buttonType==="buttonIcon" && <Tooltip title={label}>
                    <IconButton size={size} onClick={DialogGenerateJobCandidateApplicationOpen}>
                        <ReceiptLong size={size} />
                    </IconButton>
                </Tooltip>
                }
                {buttonType==="menuItem" &&
                    <Tooltip title={label}>
                        <MenuItem onClick={DialogGenerateJobCandidateApplicationOpen}>
                            <ReceiptLong sx={{ mr: 2 }} />
                            {label}
                        </MenuItem>
                    </Tooltip>
                }
            <DialogGenerateJobCandidateApplication
                open={isDialogGenerateJobCandidateApplicationOpen}
                onClose={() => setDialogGenerateJobCandidateApplicationOpen(false)}
                onConfirm={handleDialogGenerateJobCandidateApplicationConfirm}
                jobCandidate={jobCandidate}
            />
        </>
    );
}

