import * as React from 'react';
import { experimentalStyled as styled } from '@mui/material/styles';
import Grid from '@mui/material/Unstable_Grid2';
import { Stack, Box,  Typography, InputAdornment, Button, Divider } from '@mui/material';
import dayjs from 'dayjs';

import { Link, useNavigate } from 'react-router-dom';
import { useLazyQuery, useMutation } from '@apollo/client';
import { useFormik } from 'formik';
import * as yup from 'yup';

import TheTextField from '../../../_shared/components/form-fields/TheTextField';
import ImageFileField from '../../../_shared/components/form-fields/ImageFileField';
import TheDesktopDatePicker from '../../../_shared/components/form-fields/TheDesktopDatePicker';
import { useFeedBacks } from '../../../_shared/context/feedbacks/FeedBacksProvider';
import { GET_VEHICLE } from '../../../_shared/graphql/queries/VehicleQueries';
import { POST_VEHICLE, PUT_VEHICLE } from '../../../_shared/graphql/mutations/VehicleMutations';
import ProgressService from '../../../_shared/services/feedbacks/ProgressService';
import TheSwitch from '../../../_shared/components/form-fields/theSwitch';

const Item = styled(Stack)(({ theme }) => ({
  backgroundColor: theme.palette.mode === 'dark' ? '#1A2027' : '#fff',
  ...theme.typography.body2,
  padding: theme.spacing(2),
  textAlign: 'center',
  color: theme.palette.text.secondary,
}));

export default function AddVehicleForm({ idVehicle, title}) {
    const  { setNotifyAlert,  setConfirmDialog} = useFeedBacks();
    const navigate = useNavigate();
    const validationSchema = yup.object({
        name: yup .string('Entrez le nom de véhicule').required('Le nom de véhicule est obligatoire'),
        registrationNumber: yup .string('Entrez le matricule de véhicule').required('Le matricule de véhicule est obligatoire'),
      });
    const formik = useFormik({
        initialValues: {
            image : undefined,  number : '', name : '', registrationNumber : '',
            isInService : false, isOutOfOrder : false, designation : '',
            isRented : false, isBought : false, driverName : '',  driverNumber : '',
            buyingPrice : 0, rentalPrice : 0, advancePaid : 0,
            purchaseDate : dayjs(new Date()), rentalDate : dayjs(new Date()),
            description : '', observation : '', isActive : true, driver : null
          },
        validationSchema: validationSchema,
        onSubmit: (values) => {
            let { image , ...vehicleCopy } = values
            if(idVehicle && idVehicle != ''){
                onUpdateVehicle({ 
                    id : vehicleCopy.id, 
                    vehicleData : vehicleCopy,
                    image : image,
                    }
                )
            }
            else createVehicle({ 
                    variables: { 
                        vehicleData : vehicleCopy,
                        image : image,
                    } 
                })
        },
    });
    const [createVehicle, { loading : loadingPost }] = useMutation(POST_VEHICLE, {
        onCompleted: (data) => {
            console.log(data);
            setNotifyAlert({
                isOpen: true,
                message: 'Ajouté avec succès',
                type: 'success'
            })
            let { __typename, ...vehicleCopy } = data.createVehicle.vehicle;
        //   formik.setValues(vehicleCopy);
            navigate('/online/vehicules/liste');
        },
        update(cache, { data: { createVehicle } }) {
            const newVehicle = createVehicle.vehicle;
          
            cache.modify({
              fields: {
                vehicles(existingVehicles = { totalCount: 0, nodes: [] }) {
                    return {
                        totalCount: existingVehicles.totalCount + 1,
                        nodes: [newVehicle, ...existingVehicles.nodes],
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
    const [updateVehicle, { loading : loadingPut }] = useMutation(PUT_VEHICLE, {
        onCompleted: (data) => {
            console.log(data);
            setNotifyAlert({
                isOpen: true,
                message: 'Modifié avec succès',
                type: 'success'
            })
            let { __typename, ...vehicleCopy } = data.updateVehicle.vehicle;
        //   formik.setValues(vehicleCopy);
            navigate('/online/vehicules/liste');
        },
        update(cache, { data: { updateVehicle } }) {
            const updatedVehicle = updateVehicle.vehicle;
          
            cache.modify({
              fields: {
                vehicles(existingVehicles = { totalCount: 0, nodes: [] }, { readField }) {
                    
                    const updatedVehicles = existingVehicles.nodes.map((vehicle) =>
                        readField('id', vehicle) === updatedVehicle.id ? updatedVehicle : vehicle
                    );
            
                    return {
                        totalCount: existingVehicles.totalCount,
                        nodes: updatedVehicles,
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
    const onUpdateVehicle = (variables) => {
        setConfirmDialog({
          isOpen: true,
          title: 'ATTENTION',
          subTitle: "Voulez vous vraiment modifier ?",
          onConfirm: () => { setConfirmDialog({isOpen: false})
                updateVehicle({ variables })
            }
        })
      }
    const [getVehicle, { loading : loadingVehicle }] = useLazyQuery(GET_VEHICLE, {
        fetchPolicy: "network-only",
        onCompleted: (data) => {
            let { __typename, ...vehicleCopy1 } = data.vehicle;
            let { folder, ...vehicleCopy } = vehicleCopy1;
            formik.setValues(vehicleCopy);
        },
        onError: (err) => console.log(err),
    })
    React.useEffect(()=>{
        if(idVehicle){
            getVehicle(({ variables: { id: idVehicle } }));
        }
    }, [idVehicle])
    return (
        <Box sx={{ flexGrow: 1 }}>
            <Typography component="div" variant="h5">
                {title} {formik.values.number}
            </Typography>
            { loadingVehicle && <ProgressService type="form" />}
            { !loadingVehicle &&
                <form onSubmit={formik.handleSubmit}>
                    <Grid container spacing={{ xs: 2, md: 3 }} columns={{ xs: 4, sm: 8, md: 12 }}>
                        <Grid xs={2} sm={4} md={4}>
                            <Item>
                                <TheTextField variant="outlined" label="Référence"
                                    value={formik.values.number}
                                    disabled
                                />
                            </Item>
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
                                <TheTextField variant="outlined" label="Nom" id="name"
                                    value={formik.values.name} required
                                    onChange={(e) => formik.setFieldValue('name', e.target.value)}
                                    onBlur={formik.handleBlur}
                                    error={formik.touched.name && Boolean(formik.errors.name)}
                                    helperText={formik.touched.name && formik.errors.name}
                                    disabled={loadingPost || loadingPut}
                                />
                            </Item>
                            <Item>
                                <TheTextField variant="outlined" label="Matricule" id="registrationNumber"
                                    value={formik.values.registrationNumber} required
                                    onChange={(e) => formik.setFieldValue('registrationNumber', e.target.value)}
                                    onBlur={formik.handleBlur}
                                    error={formik.touched.registrationNumber && Boolean(formik.errors.registrationNumber)}
                                    helperText={formik.touched.registrationNumber && formik.errors.registrationNumber}
                                    disabled={loadingPost || loadingPut}
                                />
                            </Item>
                        </Grid>
                        <Grid xs={2} sm={4} md={4}>
                            <Item>
                                <TheTextField variant="outlined" label="Nom de chauffeur"
                                    value={formik.values.driverName}
                                    onChange={(e) => formik.setFieldValue('driverName', e.target.value)}
                                    disabled={loadingPost || loadingPut}
                                />
                            </Item>
                            <Item>
                                <TheTextField variant="outlined" label="Numéro de chauffeur"
                                    value={formik.values.driverNumber}
                                    onChange={(e) => formik.setFieldValue('driverNumber', e.target.value)}
                                    disabled={loadingPost || loadingPut}
                                />
                            </Item>
                        </Grid>
                        <Grid xs={12} sm={12} md={12}>
                            <Divider variant="middle" />
                        </Grid>
                        <Grid xs={2} sm={2} md={2}>
                            <Item>
                                <TheSwitch variant="outlined" label="En service"
                                    checked={formik.values.isInService}
                                    value={formik.values.isInService}
                                    onChange={(e) => formik.setFieldValue('isInService', e.target.checked)}
                                    disabled={loadingPost || loadingPut}
                                />
                            </Item>
                        </Grid>
                        <Grid xs={2} sm={2} md={2}>
                            <Item>
                                <TheSwitch variant="outlined" label="En panne"
                                    checked={formik.values.isOutOfOrder}
                                    value={formik.values.isOutOfOrder}
                                    onChange={(e) => formik.setFieldValue('isOutOfOrder', e.target.checked)}
                                    disabled={loadingPost || loadingPut}
                                />
                            </Item>
                        </Grid>
                        <Grid xs={2} sm={4} md={4}>
                            <Item>
                                <TheTextField variant="outlined" label="Désignation"
                                    value={formik.values.designation}
                                    onChange={(e) => formik.setFieldValue('designation', e.target.value)}
                                    disabled={loadingPost || loadingPut}
                                />
                            </Item>
                        </Grid>
                        <Grid xs={2} sm={2} md={2}>
                            <Item>
                                <TheSwitch variant="outlined" label="Loué"
                                    checked={formik.values.isRented}
                                    value={formik.values.isRented}
                                    onChange={(e) => formik.setFieldValue('isRented', e.target.checked)}
                                    disabled={loadingPost || loadingPut}
                                />
                            </Item>
                        </Grid>
                        <Grid xs={2} sm={2} md={2}>
                            <Item>
                                <TheSwitch variant="outlined" label="Acheté"
                                    checked={formik.values.isBought}
                                    value={formik.values.isBought}
                                    onChange={(e) => formik.setFieldValue('isBought', e.target.checked)}
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
                                <Link to="/online/vehicules/liste" className="no_style">
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
