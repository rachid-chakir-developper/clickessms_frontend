import * as React from 'react';
import { experimentalStyled as styled } from '@mui/material/styles';
import Grid from '@mui/material/Unstable_Grid2';
import { Stack, Box,  Typography, InputAdornment, Button, Divider, FormControl, InputLabel, Select, MenuItem } from '@mui/material';
import dayjs from 'dayjs';

import { Link, useNavigate } from 'react-router-dom';
import { useLazyQuery, useMutation, useQuery } from '@apollo/client';
import { useFormik } from 'formik';
import * as yup from 'yup';

import TheTextField from '../../../../_shared/components/form-fields/TheTextField';
import ImageFileField from '../../../../_shared/components/form-fields/ImageFileField';
import TheDesktopDatePicker from '../../../../_shared/components/form-fields/TheDesktopDatePicker';
import { useFeedBacks } from '../../../../_shared/context/feedbacks/FeedBacksProvider';
import { GET_LETTER } from '../../../../_shared/graphql/queries/LetterQueries';
import { POST_LETTER, PUT_LETTER } from '../../../../_shared/graphql/mutations/LetterMutations';
import ProgressService from '../../../../_shared/services/feedbacks/ProgressService';
import TheSwitch from '../../../../_shared/components/form-fields/theSwitch';
import TheDateTimePicker from '../../../../_shared/components/form-fields/TheDateTimePicker';
import { GET_BENEFICIARIES } from '../../../../_shared/graphql/queries/BeneficiaryQueries';
import TheAutocomplete from '../../../../_shared/components/form-fields/TheAutocomplete';
import { GET_EMPLOYEES } from '../../../../_shared/graphql/queries/EmployeeQueries';

const Item = styled(Stack)(({ theme }) => ({
  backgroundColor: theme.palette.mode === 'dark' ? '#1A2027' : '#fff',
  ...theme.typography.body2,
  padding: theme.spacing(2),
  textAlign: 'center',
  color: theme.palette.text.secondary,
}));

export default function AddLetterForm({ idLetter, title}) {
    const  { setNotifyAlert,  setConfirmDialog} = useFeedBacks();
    const navigate = useNavigate();
    const validationSchema = yup.object({
        title: yup .string("Entrez le titre d'courrier").required("Le titre d'courrier est obligatoire")
      });
    const formik = useFormik({
        initialValues: {
            image : undefined,  number : '', title : '',  letterType: 'INCOMING',
            entryDateTime : dayjs(new Date()),
            description : '', observation : '', isActive : true, beneficiaries: [], employee : null
          },
        validationSchema: validationSchema,
        onSubmit: (values) => {
            let { image , ...letterCopy } = values
            letterCopy.beneficiaries = letterCopy.beneficiaries.map(i => i?.id)
            letterCopy.employee = letterCopy.employee ? letterCopy.employee.id : null
            if(idLetter && idLetter != ''){
                onUpdateLetter({ 
                    id : letterCopy.id, 
                    letterData : letterCopy,
                    image : image,
                    }
                )
            }
            else createLetter({ 
                    variables: { 
                        letterData : letterCopy,
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
    const { 
        loading: loadingEmployees, 
        data: employeesData, 
        error: employeesError, 
        fetchMore:  fetchMoreEmployees 
      } = useQuery(GET_EMPLOYEES, { fetchPolicy: "network-only", variables: { page: 1, limit: 10 }})

    const [createLetter, { loading : loadingPost }] = useMutation(POST_LETTER, {
        onCompleted: (data) => {
            console.log(data);
            setNotifyAlert({
                isOpen: true,
                message: 'Ajouté avec succès',
                type: 'success'
            })
            let { __typename, ...letterCopy } = data.createLetter.letter;
        //   formik.setValues(letterCopy);
            navigate('/online/administratif/courriers/liste');
        },
        update(cache, { data: { createLetter } }) {
            const newLetter = createLetter.letter;
          
            cache.modify({
              fields: {
                letters(existingLetters = { totalCount: 0, nodes: [] }) {
                    return {
                        totalCount: existingLetters.totalCount + 1,
                        nodes: [newLetter, ...existingLetters.nodes],
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
    const [updateLetter, { loading : loadingPut }] = useMutation(PUT_LETTER, {
        onCompleted: (data) => {
            console.log(data);
            setNotifyAlert({
                isOpen: true,
                message: 'Modifié avec succès',
                type: 'success'
            })
            let { __typename, ...letterCopy } = data.updateLetter.letter;
        //   formik.setValues(letterCopy);
            navigate('/online/administratif/courriers/liste');
        },
        update(cache, { data: { updateLetter } }) {
            const updatedLetter = updateLetter.letter;
          
            cache.modify({
              fields: {
                letters(existingLetters = { totalCount: 0, nodes: [] }, { readField }) {
                    
                    const updatedLetters = existingLetters.nodes.map((letter) =>
                        readField('id', letter) === updatedLetter.id ? updatedLetter : letter
                    );
            
                    return {
                        totalCount: existingLetters.totalCount,
                        nodes: updatedLetters,
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
    const onUpdateLetter = (variables) => {
        setConfirmDialog({
          isOpen: true,
          title: 'ATTENTION',
          subTitle: "Voulez vous vraiment modifier ?",
          onConfirm: () => { setConfirmDialog({isOpen: false})
                updateLetter({ variables })
            }
        })
      }
    const [getLetter, { loading : loadingLetter }] = useLazyQuery(GET_LETTER, {
        fetchPolicy: "network-only",
        onCompleted: (data) => {
            let { __typename, ...letterCopy1 } = data.letter;
            let { folder, ...letterCopy } = letterCopy1;
            letterCopy.entryDateTime = dayjs(letterCopy.entryDateTime)
            letterCopy.beneficiaries = letterCopy.beneficiaries ? letterCopy.beneficiaries.map(i => i?.beneficiary) : []
            formik.setValues(letterCopy);
        },
        onError: (err) => console.log(err),
    })
    React.useEffect(()=>{
        if(idLetter){
            getLetter(({ variables: { id: idLetter } }));
        }
    }, [idLetter])
    return (
        <Box sx={{ flexGrow: 1 }}>
            <Typography component="div" variant="h5">
                {title} {formik.values.number}
            </Typography>
            { loadingLetter && <ProgressService type="form" />}
            { !loadingLetter &&
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
                        <Grid xs={2} sm={6} md={6}>
                            <Item>
                                <TheTextField variant="outlined" label="Titre" id="title"
                                    value={formik.values.title} required
                                    onChange={(e) => formik.setFieldValue('title', e.target.value)}
                                    onBlur={formik.handleBlur}
                                    error={formik.touched.title && Boolean(formik.errors.title)}
                                    helperText={formik.touched.title && formik.errors.title}
                                    disabled={loadingPost || loadingPut}
                                />
                            </Item>
                        </Grid>
                        <Grid xs={2} sm={2} md={2}>
                            <Item>
                                <FormControl fullWidth>
                                    <InputLabel>Type d'courrier</InputLabel>
                                    <Select
                                        value={formik.values.letterType}
                                        onChange={(e) => formik.setFieldValue('letterType', e.target.value)}
                                        disabled={loadingPost || loadingPut}
                                    >
                                        <MenuItem value="INCOMING">Entrant</MenuItem>
                                        <MenuItem value="OUTGOING">Sortant</MenuItem>
                                    </Select>
                                </FormControl>
                            </Item>
                        </Grid>
                        <Grid xs={2} sm={4} md={4}>
                            <Item>
                                <TheDateTimePicker
                                    label="Date et heure"
                                    value={formik.values.entryDateTime}
                                    onChange={(date) => formik.setFieldValue('entryDateTime', date)}
                                    disabled={loadingPost || loadingPut}
                                />
                            </Item>
                            <Item>
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
                                <Link to="/online/administratif/courriers/liste" className="no_style">
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