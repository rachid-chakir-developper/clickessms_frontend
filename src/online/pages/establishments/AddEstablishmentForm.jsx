import * as React from 'react';
import { experimentalStyled as styled } from '@mui/material/styles';
import Grid from '@mui/material/Unstable_Grid2';
import { Stack, Box,  Typography, InputAdornment, Button, Divider, FormControl, InputLabel, Select, MenuItem } from '@mui/material';
import dayjs from 'dayjs';

import { Link, useNavigate } from 'react-router-dom';
import { useLazyQuery, useMutation, useQuery } from '@apollo/client';
import { useFormik } from 'formik';
import * as yup from 'yup';

import TheTextField from '../../../_shared/components/form-fields/TheTextField';
import ImageFileField from '../../../_shared/components/form-fields/ImageFileField';
import TheDesktopDatePicker from '../../../_shared/components/form-fields/TheDesktopDatePicker';
import { useFeedBacks } from '../../../_shared/context/feedbacks/FeedBacksProvider';
import { GET_ESTABLISHMENT, GET_ESTABLISHMENTS } from '../../../_shared/graphql/queries/EstablishmentQueries';
import { POST_ESTABLISHMENT, PUT_ESTABLISHMENT } from '../../../_shared/graphql/mutations/EstablishmentMutations';
import ProgressService from '../../../_shared/services/feedbacks/ProgressService';
import TheAutocomplete from '../../../_shared/components/form-fields/TheAutocomplete';

const Item = styled(Stack)(({ theme }) => ({
  backgroundColor: theme.palette.mode === 'dark' ? '#1A2027' : '#fff',
  ...theme.typography.body2,
  padding: theme.spacing(2),
  textAlign: 'center',
  color: theme.palette.text.secondary,
}));

export default function AddEstablishmentForm({ idEstablishment, title}) {
    const  { setNotifyAlert,  setConfirmDialog} = useFeedBacks();
    const navigate = useNavigate();
    const validationSchema = yup.object({
        name: yup .string('Entrez votre nom').required('Le nom est obligatoire')
      });
    const formik = useFormik({
        initialValues: {
            logo : undefined, coverImage : undefined, number : '', name : '', siret:'',
            city : '' , zipCode : '' , address : '' , mobile : '' , fix : '' , fax : '' ,
            email : '' , webSite : '' , otherContacts : '' ,
            isActive : true , description : '' , observation : '' , establishmentType : 'PRIMARY',
            establishmentParent : null, establishmentChilds : []
          },
        validationSchema: validationSchema,
        onSubmit: (values) => {
            let { logo , ...establishmentFormCopy } = values
            let { coverImage , ...establishmentCopy } = establishmentFormCopy
            establishmentCopy.establishmentParent = establishmentCopy.establishmentParent ? establishmentCopy.establishmentParent.id : null
            establishmentCopy.establishmentChilds = establishmentCopy.establishmentChilds.map(i => i.id)
            if(idEstablishment && idEstablishment != ''){
                onUpdateEstablishment({ 
                    id : establishmentCopy.id, 
                    establishmentData : establishmentCopy,
                    logo : logo,
                    coverImage : coverImage
                    }
                )
            }
            else createEstablishment({ 
                    variables: { 
                        establishmentData : establishmentCopy,
                        logo : logo,
                        coverImage : coverImage
                    } 
                })
        },
    });
    const [createEstablishment, { loading : loadingPost }] = useMutation(POST_ESTABLISHMENT, {
        onCompleted: (data) => {
            console.log(data);
            setNotifyAlert({
                isOpen: true,
                message: 'Ajouté avec succès',
                type: 'success'
            })
            let { __typename, ...establishmentCopy } = data.createEstablishment.establishment;
        //   formik.setValues(establishmentCopy);
            navigate('/online/etablissements/liste');
        },
        update(cache, { data: { createEstablishment } }) {
            const newEstablishment = createEstablishment.establishment;
          
            cache.modify({
              fields: {
                establishments(existingEstablishments = { totalCount: 0, nodes: [] }) {
                    return {
                        totalCount: existingEstablishments.totalCount + 1,
                        nodes: [newEstablishment, ...existingEstablishments.nodes],
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
    const [updateEstablishment, { loading : loadingPut }] = useMutation(PUT_ESTABLISHMENT, {
        onCompleted: (data) => {
            console.log(data);
            setNotifyAlert({
                isOpen: true,
                message: 'Modifié avec succès',
                type: 'success'
            })
            let { __typename, ...establishmentCopy } = data.updateEstablishment.establishment;
        //   formik.setValues(establishmentCopy);
            navigate('/online/etablissements/liste');
        },
        update(cache, { data: { updateEstablishment } }) {
            const updatedEstablishment = updateEstablishment.establishment;
          
            cache.modify({
              fields: {
                establishments(existingEstablishments = { totalCount: 0, nodes: [] }, { readField }) {
                    
                    const updatedEstablishments = existingEstablishments.nodes.map((establishment) =>
                        readField('id', establishment) === updatedEstablishment.id ? updatedEstablishment : establishment
                    );
            
                    return {
                        totalCount: existingEstablishments.totalCount,
                        nodes: updatedEstablishments,
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
    const onUpdateEstablishment = (variables) => {
        setConfirmDialog({
          isOpen: true,
          title: 'ATTENTION',
          subTitle: "Voulez vous vraiment modifier ?",
          onConfirm: () => { setConfirmDialog({isOpen: false})
                updateEstablishment({ variables })
            }
        })
      }
    const [getEstablishment, { loading : loadingEstablishment }] = useLazyQuery(GET_ESTABLISHMENT, {
        fetchPolicy: "network-only",
        onCompleted: (data) => {
            let { __typename, ...establishmentCopy1 } = data.establishment;
            let { folder, ...establishmentCopy } = establishmentCopy1;
            formik.setValues(establishmentCopy);
        },
        onError: (err) => console.log(err),
    })
    React.useEffect(()=>{
        if(idEstablishment){
            getEstablishment(({ variables: { id: idEstablishment } }));
        }
    }, [idEstablishment])

    const { 
        loading: loadingEstablishments, 
        data: establishmentsData, 
        error: establishmentsError, 
        fetchMore:  fetchMoreEstablishments 
      } = useQuery(GET_ESTABLISHMENTS, { fetchPolicy: "network-only", variables: { page: 1, limit: 10 }})

    return (
        <Box sx={{ flexGrow: 1 }}>
            <Typography component="div" variant="h5">
                {title} {formik.values.number}
            </Typography>
            { loadingEstablishment && <ProgressService type="form" />}
            { !loadingEstablishment &&
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
                                <TheTextField variant="outlined" label="Raison sociale" id="name"
                                    value={formik.values.name} required
                                    onChange={(e) => formik.setFieldValue('name', e.target.value)}
                                    onBlur={formik.handleBlur}
                                    error={formik.touched.name && Boolean(formik.errors.name)}
                                    helperText={formik.touched.name && formik.errors.name}
                                    disabled={loadingPost || loadingPut}
                                />
                            </Item>
                        </Grid>
                        <Grid xs={2} sm={4} md={4}>
                            <Item>
                                <TheTextField variant="outlined" label="SIRET"
                                    value={formik.values.siret}
                                    onChange={(e) => formik.setFieldValue('siret', e.target.value)}
                                    disabled={loadingPost || loadingPut}
                                />
                            </Item>
                        </Grid>
                        <Grid xs={2} sm={4} md={4}>
                            <Item>
                                <ImageFileField variant="outlined" label="Logo"
                                    imageValue={formik.values.logo}
                                    onChange={(imageFile) => formik.setFieldValue('logo', imageFile)}
                                    disabled={loadingPost || loadingPut}
                                    />
                            </Item>
                        </Grid>
                        <Grid xs={2} sm={4} md={4}>
                            <Item>
                                <FormControl fullWidth>
                                    <InputLabel>Type d'établissement</InputLabel>
                                    <Select
                                        value={formik.values.establishmentType}
                                        onChange={(e) => formik.setFieldValue('establishmentType', e.target.value)}
                                        disabled={loadingPost || loadingPut}
                                    >
                                        <MenuItem value="PRIMARY">Primaire</MenuItem>
                                        <MenuItem value="SECONDARY">Sécondaire</MenuItem>
                                    </Select>
                                </FormControl>
                            </Item>
                        </Grid>
                        <Grid xs={2} sm={4} md={4}>
                            {/* <Item>
                                <ImageFileField variant="outlined" label="Logo de couverture"
                                    imageValue={formik.values.coverImage}
                                    onChange={(imageFile) => formik.setFieldValue('coverImage', imageFile)}
                                    disabled={loadingPost || loadingPut}
                                    />
                            </Item> */}
                            {formik.values.establishmentType === 'SECONDARY' && <Item>
                                <TheAutocomplete options={establishmentsData?.establishments?.nodes?.filter(e => e?.id != idEstablishment)} label="Etablissement parent"
                                    placeholder="Choisissez un établissement"
                                    multiple={false}
                                    value={formik.values.establishmentParent}
                                    onChange={(e, newValue) => formik.setFieldValue('establishmentParent', newValue)}/>
                            </Item>}
                            {formik.values.establishmentType === 'PRIMARY' && <Item>
                                <TheAutocomplete options={establishmentsData?.establishments?.nodes?.filter(e => e?.id != idEstablishment)} label="Etablissements fils"
                                    placeholder="Choisissez des établissements"
                                    limitTags={3}
                                    value={formik.values.establishmentChilds}
                                    onChange={(e, newValue) => formik.setFieldValue('establishmentChilds', newValue)}/>
                            </Item>}
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
                                <Link to="/online/etablissements/liste" className="no_style">
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
