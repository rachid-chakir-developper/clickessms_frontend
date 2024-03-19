import * as React from 'react';
import { experimentalStyled as styled } from '@mui/material/styles';
import Grid from '@mui/material/Unstable_Grid2';
import { Stack, Box,  Typography, InputAdornment, Button, Divider } from '@mui/material';
import dayjs from 'dayjs';

import { Link, useNavigate } from 'react-router-dom';
import { useLazyQuery, useMutation } from '@apollo/client';
import { useFormik } from 'formik';
import * as yup from 'yup';

import TheTextField from '../../../../_shared/components/form-fields/TheTextField';
import ImageFileField from '../../../../_shared/components/form-fields/ImageFileField';
import TheDesktopDatePicker from '../../../../_shared/components/form-fields/TheDesktopDatePicker';
import { useFeedBacks } from '../../../../_shared/context/feedbacks/FeedBacksProvider';
import { GET_BENEFICIARY } from '../../../../_shared/graphql/queries/BeneficiaryQueries';
import { POST_BENEFICIARY, PUT_BENEFICIARY } from '../../../../_shared/graphql/mutations/BeneficiaryMutations';
import ProgressService from '../../../../_shared/services/feedbacks/ProgressService';

const Item = styled(Stack)(({ theme }) => ({
  backgroundColor: theme.palette.mode === 'dark' ? '#1A2027' : '#fff',
  ...theme.typography.body2,
  padding: theme.spacing(2),
  textAlign: 'center',
  color: theme.palette.text.secondary,
}));

export default function AddBeneficiaryForm({ idBeneficiary, title}) {
    const  { setNotifyAlert,  setConfirmDialog} = useFeedBacks();
    const navigate = useNavigate();
    const validationSchema = yup.object({
        firstName: yup .string('Entrez votre prénom').required('Le prénom est obligatoire'),
        lastName: yup .string('Entrez votre nom').required('Le nom est obligatoire')
      });
    const formik = useFormik({
        initialValues: {
            photo : undefined, coverImage : undefined, number : '', firstName : '', lastName : '',
            birthDate : dayjs(new Date()),
            latitude : '', longitude : '', city : '', zipCode : '', address : '',
            mobile : '' , fix : '' , fax : '' ,
            email : '' , webSite : '' , otherContacts : '',
            iban : '', bic : '', bankName : '',
            description : '', observation : '', isActive : true, 
          },
        validationSchema: validationSchema,
        onSubmit: (values) => {
            let { photo , ...beneficiaryFormCopy } = values
            let { coverImage , ...beneficiaryCopy } = beneficiaryFormCopy
            if(idBeneficiary && idBeneficiary != ''){
                onUpdateBeneficiary({ 
                    id : beneficiaryCopy.id, 
                    beneficiaryData : beneficiaryCopy,
                    photo : photo,
                    coverImage : coverImage
                    }
                )
            }
            else createBeneficiary({ 
                    variables: { 
                        beneficiaryData : beneficiaryCopy,
                        photo : photo,
                        coverImage : coverImage
                    } 
                })
        },
    });
    const [createBeneficiary, { loading : loadingPost }] = useMutation(POST_BENEFICIARY, {
        onCompleted: (data) => {
            console.log(data);
            setNotifyAlert({
                isOpen: true,
                message: 'Ajouté avec succès',
                type: 'success'
            })
            let { __typename, ...beneficiaryCopy } = data.createBeneficiary.beneficiary;
        //   formik.setValues(beneficiaryCopy);
            navigate('/online/ressources-humaines/beneficiaires/liste');
        },
        update(cache, { data: { createBeneficiary } }) {
            const newBeneficiary = createBeneficiary.beneficiary;
          
            cache.modify({
              fields: {
                beneficiaries(existingBeneficiaries = { totalCount: 0, nodes: [] }) {
                    return {
                        totalCount: existingBeneficiaries.totalCount + 1,
                        nodes: [newBeneficiary, ...existingBeneficiaries.nodes],
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
    const [updateBeneficiary, { loading : loadingPut }] = useMutation(PUT_BENEFICIARY, {
        onCompleted: (data) => {
            console.log(data);
            setNotifyAlert({
                isOpen: true,
                message: 'Modifié avec succès',
                type: 'success'
            })
            let { __typename, ...beneficiaryCopy } = data.updateBeneficiary.beneficiary;
        //   formik.setValues(beneficiaryCopy);
            navigate('/online/ressources-humaines/beneficiaires/liste');
        },
        update(cache, { data: { updateBeneficiary } }) {
            const updatedBeneficiary = updateBeneficiary.beneficiary;
          
            cache.modify({
              fields: {
                beneficiaries(existingBeneficiaries = { totalCount: 0, nodes: [] }, { readField }) {
                    
                    const updatedBeneficiaries = existingBeneficiaries.nodes.map((beneficiary) =>
                        readField('id', beneficiary) === updatedBeneficiary.id ? updatedBeneficiary : beneficiary
                    );
            
                    return {
                        totalCount: existingBeneficiaries.totalCount,
                        nodes: updatedBeneficiaries,
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
    const onUpdateBeneficiary = (variables) => {
        setConfirmDialog({
          isOpen: true,
          title: 'ATTENTION',
          subTitle: "Voulez vous vraiment modifier ?",
          onConfirm: () => { setConfirmDialog({isOpen: false})
                updateBeneficiary({ variables })
            }
        })
      }
    const [getBeneficiary, { loading : loadingBeneficiary }] = useLazyQuery(GET_BENEFICIARY, {
        fetchPolicy: "network-only",
        onCompleted: (data) => {
            let { __typename, ...beneficiaryCopy1 } = data.beneficiary;
            let { folder, ...beneficiaryCopy } = beneficiaryCopy1;
            beneficiaryCopy.birthDate = dayjs(beneficiaryCopy.birthDate)
            formik.setValues(beneficiaryCopy);
        },
        onError: (err) => console.log(err),
    })
    React.useEffect(()=>{
        if(idBeneficiary){
            getBeneficiary(({ variables: { id: idBeneficiary } }));
        }
    }, [idBeneficiary])
    return (
        <Box sx={{ flexGrow: 1 }}>
            <Typography component="div" variant="h5">
                {title} {formik.values.number}
            </Typography>
            { loadingBeneficiary && <ProgressService type="form" />}
            { !loadingBeneficiary &&
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
                                <TheTextField variant="outlined" label="Prénom" id="firstName"
                                    value={formik.values.firstName} required
                                    onChange={(e) => formik.setFieldValue('firstName', e.target.value)}
                                    onBlur={formik.handleBlur}
                                    error={formik.touched.firstName && Boolean(formik.errors.firstName)}
                                    helperText={formik.touched.firstName && formik.errors.firstName}
                                    disabled={loadingPost || loadingPut}
                                />
                            </Item>
                            <Item>
                                <TheTextField variant="outlined" label="Nom" id="lastName"
                                    value={formik.values.lastName} required
                                    onChange={(e) => formik.setFieldValue('lastName', e.target.value)}
                                    onBlur={formik.handleBlur}
                                    error={formik.touched.lastName && Boolean(formik.errors.lastName)}
                                    helperText={formik.touched.lastName && formik.errors.lastName}
                                    disabled={loadingPost || loadingPut}
                                />
                            </Item>
                            <Item>
                                <TheDesktopDatePicker
                                    label="Date de naissance"
                                    value={formik.values.birthDate}
                                    onChange={(date) => formik.setFieldValue('birthDate', date)}
                                    disabled={loadingPost || loadingPut}
                                />
                            </Item>
                        </Grid>
                        <Grid xs={2} sm={4} md={4}>
                            <Item>
                                <ImageFileField variant="outlined" label="Photo"
                                    imageValue={formik.values.photo}
                                    onChange={(imageFile) => formik.setFieldValue('photo', imageFile)}
                                    disabled={loadingPost || loadingPut}
                                    />
                            </Item>
                            {/* <Item>
                                <ImageFileField variant="outlined" label="Photo de couverture"
                                    imageValue={formik.values.coverImage}
                                    onChange={(imageFile) => formik.setFieldValue('coverImage', imageFile)}
                                    disabled={loadingPost || loadingPut}
                                    />
                            </Item> */}
                        </Grid>
                        <Grid xs={12} sm={12} md={12}>
                            <Divider variant="middle" />
                        </Grid>
                        <Grid xs={2} sm={4} md={4}>
                            <Item>
                                <TheTextField variant="outlined" label="Adresse" multiline rows={8}
                                    value={formik.values.address}
                                    onChange={(e) => formik.setFieldValue('address', e.target.value)}
                                    disabled={loadingPost || loadingPut}
                                    />
                            </Item>
                        </Grid>
                        <Grid xs={2} sm={4} md={4}>
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
                            </Item>
                            <Item>
                                <TheTextField variant="outlined" label="Fax"
                                    value={formik.values.fax}
                                    onChange={(e) => formik.setFieldValue('fax', e.target.value)}
                                    disabled={loadingPost || loadingPut}
                                    />
                            </Item>
                        </Grid>
                        <Grid xs={2} sm={4} md={4}>
                            <Item>
                                <TheTextField variant="outlined" label="E-mail"
                                    value={formik.values.email}
                                    onChange={(e) => formik.setFieldValue('email', e.target.value)}
                                    disabled={loadingPost || loadingPut}
                                    />
                            </Item>
                            <Item>
                                <TheTextField variant="outlined" label="Site web"
                                    value={formik.values.webSite}
                                    onChange={(e) => formik.setFieldValue('webSite', e.target.value)}
                                    disabled={loadingPost || loadingPut}
                                    />
                            </Item>
                            <Item>
                                <TheTextField variant="outlined" label="Autres contacts"
                                    value={formik.values.otherContacts}
                                    onChange={(e) => formik.setFieldValue('otherContacts', e.target.value)}
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
                                <Link to="/online/ressources-humaines/beneficiaires/liste" className="no_style">
                                    <Button variant="outlined" sx={{ marginRight : '10px' }}>Annuler</Button>
                                </Link>
                                <Button type="submit" variant="contained"
                                disabled={!formik.isValid || loadingPost || loadingPut}
                                >Valider</Button>
                            </Item>
                        </Grid>
                    </Grid>
                </form>
            }
        </Box>
    );
}
