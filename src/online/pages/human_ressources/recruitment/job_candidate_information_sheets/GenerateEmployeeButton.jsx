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
import { Add, Event, AccountBox, ReceiptLong, Refresh } from '@mui/icons-material';
import {  GENERATE_EMPLOYEE } from '../../../../../_shared/graphql/mutations/EmployeeMutations';
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

function DialogGenerateEmployee({ open, onClose, onConfirm, jobCandidateInformationSheet }) {
    const {jobCandidate, jobPosition } = jobCandidateInformationSheet
    const { setNotifyAlert, setConfirmDialog } = useFeedBacks();
    const validationSchema = yup.object({
        firstName: yup.string()
          .required('Le prénom est requis'),
        lastName: yup.string()
          .required('Le nom est requis'),
        email: yup.string()
          .email("L'email n'est pas valide")
          .required("L'email est requis"),
        jobCandidateEmail: yup.string()
          .email("L'email du candidat n'est pas valide")
          .required("L'email du candidat est requis"),
        mobile: yup.string()
          .matches(/^[0-9\s()+-]*$/, 'Le numéro de télémobile est invalide')
          .nullable(), // facultatif
      });

    const formik = useFormik({
        initialValues: {
            firstName: '',
            lastName: '',
            email: '',
            jobCandidateEmail: '',
            mobile: '',
        },
        validationSchema: validationSchema,
        onSubmit: (values) => {
        let valuesCopy = {...values};
        handleOk(valuesCopy);
        },
    });

    const [generateEmployee, { loading: loadingPost }] = useMutation(GENERATE_EMPLOYEE, {
        onCompleted: (data) => {
            console.log(data);
            setNotifyAlert({
                isOpen: true,
                message: 'Ajouté avec succès',
                type: 'success',
            });
            let { __typename, ...employeeCopy } = data.generateEmployee.employee;
            //   formik.setValues(employeeCopy);
            onClose(employeeCopy)
        },
        update(cache, { data: { generateEmployee } }) {
            const newEmployee = generateEmployee.employee;

            cache.modify({
            fields: {
                employees(existingEmployees = { totalCount: 0, nodes: [] }) {
                return {
                    totalCount: existingEmployees.totalCount + 1,
                    nodes: [newEmployee, ...existingEmployees.nodes],
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
        subTitle: 'Voulez-vous vraiment générer le compte de cet employé ?',
        onConfirm: () => {
            setConfirmDialog({ isOpen: false });
            generateEmployee({
                variables: { generateEmployeeData: values},
            });
        },
        });
    };

    React.useEffect(() => {
        if (open) {
            formik.setValues({
                firstName: jobCandidate?.firstName,
                lastName: jobCandidate?.lastName,
                email: '',
                jobCandidateEmail: jobCandidate?.email,
                mobile: jobCandidate?.phone,
                jobCandidateInformationSheet: jobCandidateInformationSheet?.id
            })
        }
    }, [open]);


    return (
        <BootstrapDialog onClose={onClose} aria-labelledby="customized-dialog-title" open={open} fullWidth maxWidth="md">
            <DialogTitle sx={{ m: 0, p: 2 }} id="customized-dialog-title">
                Créer la fiche employé pour <em>[{`${jobCandidate?.firstName} ${jobCandidate?.lastName}`}]</em>
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
                        <Grid item xs={12} sm={12} md={6}>
                            <Item>
                                <TheTextField
                                    id="firstName"
                                    variant="outlined"
                                    label="Prénom"
                                    value={formik.values.firstName}
                                    onChange={(e) => formik.setFieldValue('firstName', e.target.value)}
                                    onBlur={formik.handleBlur}
                                    error={formik.touched.firstName && Boolean(formik.errors.firstName)}
                                    helperText={formik.touched.firstName && formik.errors.firstName}
                                    disabled={loadingPost}
                                />
                            </Item>
                        </Grid>
                        <Grid item xs={12} sm={12} md={6}>
                            <Item>
                                <TheTextField
                                    id="lastName"
                                    variant="outlined"
                                    label="Nom"
                                    value={formik.values.lastName}
                                    onChange={(e) => formik.setFieldValue('lastName', e.target.value)}
                                    onBlur={formik.handleBlur}
                                    error={formik.touched.lastName && Boolean(formik.errors.lastName)}
                                    helperText={formik.touched.lastName && formik.errors.lastName}
                                    disabled={loadingPost}
                                />
                            </Item>
                        </Grid>
                        <Grid item xs={12} sm={12} md={12} >
                            <Item>
                            <TheTextField
                                id="email"
                                variant="outlined"
                                label="E-mail principale de la connexion"
                                value={formik.values.email}
                                onChange={(e) =>
                                    formik.setFieldValue('email', e.target.value)
                                }
                                onBlur={formik.handleBlur}
                                error={formik.touched.email && Boolean(formik.errors.email)}
                                helperText={formik.touched.email ? formik.errors.email : "E-mail de connexion de l'utilisateur"}
                                disabled={loadingPost}
                            />
                            </Item>
                        </Grid>
                        <Grid item xs={12} sm={12} md={6} >
                            <Item>
                            <TheTextField
                                id="jobCandidateEmail"
                                variant="outlined"
                                label="E-mail secondaire"
                                value={formik.values.jobCandidateEmail}
                                onChange={(e) =>
                                    formik.setFieldValue('jobCandidateEmail', e.target.value)
                                }
                                onBlur={formik.handleBlur}
                                error={formik.touched.jobCandidateEmail && Boolean(formik.errors.jobCandidateEmail)}
                                helperText={formik.touched.jobCandidateEmail ? formik.errors.jobCandidateEmail : "E-mail qui va recevoir les instructions de première connexion"}
                                disabled={loadingPost}
                            />
                            </Item>
                        </Grid>
                        <Grid item xs={12} sm={12} md={6} >
                            <Item>
                            <TheTextField
                                id="mobile"
                                variant="outlined"
                                label="Tél"
                                value={formik.values.mobile}
                                onChange={(e) =>
                                    formik.setFieldValue('mobile', e.target.value)
                                }
                                onBlur={formik.handleBlur}
                                error={formik.touched.mobile && Boolean(formik.errors.mobile)}
                                helperText={formik.touched.mobile && formik.errors.mobile}
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


export default function GenerateEmployeeButton({ onGenerated, jobCandidateInformationSheet , buttonType="button", size="medium", label="Générer la fiche employé" }) {
    const navigate = useNavigate();
    const [isDialogGenerateEmployeeOpen, setDialogGenerateEmployeeOpen] = React.useState(false);

    const DialogGenerateEmployeeOpen = () => {
        setDialogGenerateEmployeeOpen(true);
    };

    const handleDialogGenerateEmployeeConfirm = (value) => {
        console.log('value data:', value);
        setDialogGenerateEmployeeOpen(false); // Fermer le dialogue après la confirmation
    };
    const [emailUserInfos, setEmailUserInfos] = React.useState();
    const [openDialog, setOpenDialog] = React.useState(false);
    const handleCloseDialog = () => {
        setOpenDialog(false);
        if(emailUserInfos?.employee) navigate(`/online/ressources-humaines/employes/details/${emailUserInfos?.employee}`)
    };
    return (
        <>  
            {buttonType==="button" && 
                <Button size={size} variant="outlined" onClick={DialogGenerateEmployeeOpen} endIcon={<AccountBox />}>
                    {label}
                </Button>
            }
            {buttonType==="buttonIcon" && <Tooltip title={label}>
                    <IconButton size={size} onClick={DialogGenerateEmployeeOpen}>
                        <AccountBox size={size} />
                    </IconButton>
                </Tooltip>
            }
            {buttonType==="menuItem" &&
                <Tooltip title={label}>
                    <MenuItem onClick={DialogGenerateEmployeeOpen}>
                        <AccountBox sx={{ mr: 2 }} />
                        {label}
                    </MenuItem>
                </Tooltip>
            }
            <DialogGenerateEmployee
                open={isDialogGenerateEmployeeOpen}
                onClose={(employee) => {
                    setDialogGenerateEmployeeOpen(false)
                    if(employee && employee?.id) {
                        setEmailUserInfos(prev => ({
                            ...(prev || {}),
                            employee: employee.id
                        }));
                        setOpenDialog(true)
                    };
                    if(onGenerated && employee && employee?.id) onGenerated(employee)
                }}
                onConfirm={handleDialogGenerateEmployeeConfirm}
                jobCandidateInformationSheet={jobCandidateInformationSheet}
            />
            {/* Modal envoyer l'email */}
            <DialogSendMail open={openDialog} onClose={handleCloseDialog} emailUserInfos={emailUserInfos}
                onSend={(values) => console.log("Email envoyé avec :", values)} />
        </>
    );
}

