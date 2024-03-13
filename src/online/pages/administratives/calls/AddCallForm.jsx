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
import { GET_CALL } from '../../../../_shared/graphql/queries/CallQueries';
import { POST_CALL, PUT_CALL } from '../../../../_shared/graphql/mutations/CallMutations';
import ProgressService from '../../../../_shared/services/feedbacks/ProgressService';
import TheSwitch from '../../../../_shared/components/form-fields/theSwitch';
import TheDateTimePicker from '../../../../_shared/components/form-fields/TheDateTimePicker';
import { GET_BENEFICIARIES } from '../../../../_shared/graphql/queries/BeneficiaryQueries';
import TheAutocomplete from '../../../../_shared/components/form-fields/TheAutocomplete';

const Item = styled(Stack)(({ theme }) => ({
  backgroundColor: theme.palette.mode === 'dark' ? '#1A2027' : '#fff',
  ...theme.typography.body2,
  padding: theme.spacing(2),
  textAlign: 'center',
  color: theme.palette.text.secondary,
}));

export default function AddCallForm({ idCall, title}) {
    const  { setNotifyAlert,  setConfirmDialog} = useFeedBacks();
    const navigate = useNavigate();
    const validationSchema = yup.object({
        title: yup .string("Entrez le nom d'appel").required("Le nom d'appel est obligatoire")
      });
    const formik = useFormik({
        initialValues: {
            image : undefined,  number : '', title : '', 
            startingDateTime : dayjs(new Date()), endingDateTime : dayjs(new Date()),
            description : '', observation : '', isActive : true, beneficiaries: []
          },
        validationSchema: validationSchema,
        onSubmit: (values) => {
            let { image , ...callCopy } = values
            callCopy.beneficiaries = callCopy.beneficiaries.map(i => i?.id)
            if(idCall && idCall != ''){
                onUpdateCall({ 
                    id : callCopy.id, 
                    callData : callCopy,
                    image : image,
                    }
                )
            }
            else createCall({ 
                    variables: { 
                        callData : callCopy,
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

    const [createCall, { loading : loadingPost }] = useMutation(POST_CALL, {
        onCompleted: (data) => {
            console.log(data);
            setNotifyAlert({
                isOpen: true,
                message: 'Ajouté avec succès',
                type: 'success'
            })
            let { __typename, ...callCopy } = data.createCall.call;
        //   formik.setValues(callCopy);
            navigate('/online/administratif/appels/liste');
        },
        update(cache, { data: { createCall } }) {
            const newCall = createCall.call;
          
            cache.modify({
              fields: {
                calls(existingCalls = { totalCount: 0, nodes: [] }) {
                    return {
                        totalCount: existingCalls.totalCount + 1,
                        nodes: [newCall, ...existingCalls.nodes],
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
    const [updateCall, { loading : loadingPut }] = useMutation(PUT_CALL, {
        onCompleted: (data) => {
            console.log(data);
            setNotifyAlert({
                isOpen: true,
                message: 'Modifié avec succès',
                type: 'success'
            })
            let { __typename, ...callCopy } = data.updateCall.call;
        //   formik.setValues(callCopy);
            navigate('/online/administratif/appels/liste');
        },
        update(cache, { data: { updateCall } }) {
            const updatedCall = updateCall.call;
          
            cache.modify({
              fields: {
                calls(existingCalls = { totalCount: 0, nodes: [] }, { readField }) {
                    
                    const updatedCalls = existingCalls.nodes.map((call) =>
                        readField('id', call) === updatedCall.id ? updatedCall : call
                    );
            
                    return {
                        totalCount: existingCalls.totalCount,
                        nodes: updatedCalls,
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
    const onUpdateCall = (variables) => {
        setConfirmDialog({
          isOpen: true,
          title: 'ATTENTION',
          subTitle: "Voulez vous vraiment modifier ?",
          onConfirm: () => { setConfirmDialog({isOpen: false})
                updateCall({ variables })
            }
        })
      }
    const [getCall, { loading : loadingCall }] = useLazyQuery(GET_CALL, {
        fetchPolicy: "network-only",
        onCompleted: (data) => {
            let { __typename, ...callCopy } = data.call;
            callCopy.startingDateTime = dayjs(callCopy.startingDateTime)
            callCopy.endingDateTime = dayjs(callCopy.endingDateTime)
            callCopy.beneficiaries = callCopy.beneficiaries ? callCopy.beneficiaries.map(i => i?.beneficiary) : []
            formik.setValues(callCopy);
        },
        onError: (err) => console.log(err),
    })
    React.useEffect(()=>{
        if(idCall){
            getCall(({ variables: { id: idCall } }));
        }
    }, [idCall])
    return (
        <Box sx={{ flexGrow: 1 }}>
            <Typography component="div" variant="h5">
                {title} {formik.values.number}
            </Typography>
            { loadingCall && <ProgressService type="form" />}
            { !loadingCall &&
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
                        <Grid xs={2} sm={4} md={4} item>
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
                                <Link to="/online/administratif/appels/liste" className="no_style">
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
