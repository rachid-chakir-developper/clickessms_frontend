import * as React from 'react';
import { Alert, Box, Button, IconButton, InputAdornment, Paper, Stack, alpha } from '@mui/material';
import { Grid, Typography, Avatar } from '@mui/material';
import styled from '@emotion/styled';
import { useFormik } from 'formik';
import * as yup from 'yup';
import { getFormatDateTime } from '../../../_shared/tools/functions';
import { useSession } from '../../../_shared/context/SessionProvider';
import TheTextField from '../../../_shared/components/form-fields/TheTextField';
import { useFeedBacks } from '../../../_shared/context/feedbacks/FeedBacksProvider';
import { useMutation } from '@apollo/client';
import { PUT_MY_PASSWORD } from '../../../_shared/graphql/mutations/UserMutations';
import { Visibility, VisibilityOff } from '@mui/icons-material';

const Item = styled(Stack)(({ theme }) => ({
    backgroundColor: theme.palette.mode === 'dark' ? '#1A2027' : '#fff',
    ...theme.typography.body2,
    padding: theme.spacing(2),
    textAlign: 'center',
    color: theme.palette.text.secondary,
  }));

export default function Profile() {

    const { user } = useSession();

    return (
        <Stack>
            {user && <ProfileDetailsPage user={user} />}
        </Stack>
    );
}


const ProfileDetailsPage = ({ user }) => {
    const {
        id,
        photo,
        coverImage,
        firstName,
        lastName,
        username,
        email,
        permissions,
        groups,
        description,
        observation,
        isActive,
        createdAt,
        updatedAt
    } = user;
    const [openPwd, setOpenPwd] = React.useState(null);
    const [showPassword, setShowPassword] = React.useState(null);
    const handleClickShowPassword = () => setShowPassword((show) => !show);
    const handleMouseDownPassword = (event) => {
        event.preventDefault();
      };

    const  { setNotifyAlert,  setConfirmDialog} = useFeedBacks();
    const validationSchema = yup.object({
        oldPassword: yup.string('Entrez votre mot de passe').required('Le mot de passe est obligatoire'),
        newPassword1: yup.string('Entrez votre mot de passe').required('Le mot de passe est obligatoire'),
        newPassword2: yup.string('Entrez votre mot de passe').required('Le mot de passe est obligatoire')
      });
    const formik = useFormik({
        initialValues: {
            oldPassword : '' , newPassword1 : '' , newPassword2 : '' ,
          },
        validationSchema: validationSchema,
        onSubmit: (values) => {
            if(openPwd) passwordChange({variables : values})
        },
    });

    const [passwordChange, { loading : loadingPut, data: passwordChangeData, error: passwordChangeError }] = useMutation(PUT_MY_PASSWORD, {
        onCompleted: (data) => {
            console.log(data);
            if(data.passwordChange.success){
                setNotifyAlert({
                    isOpen: true,
                    message: 'Changé avec succès',
                    type: 'success'
                })
            }else{ 
                setNotifyAlert({
                    isOpen: true,
                    message: 'Non Changé ! Veuillez réessayer.',
                    type: 'error'
                })
            }
        },
        onError: (err) => {
            console.log(err)
            setNotifyAlert({
                isOpen: true,
                message: "Une erreur s'est produite ! Veuillez réessayer.",
                type: 'error'
            })
        },
    })

    return (
        <Grid container spacing={3}>
        {/* Informations de l'employé */}
        <Grid item xs={12} sm={4}>
            <Paper
            sx={{
                height: '100%',
                display: 'flex',
                alignItems: 'center',
                backgroundImage: `url(${coverImage})`, // Ajoutez l'image d'arrière-plan ici
                backgroundRepeat: 'no-repeat',
                backgroundSize: 'cover',
                bgcolor: (theme) => alpha(theme.palette.primary.main, 1),
            }}
            >
            <Box
                sx={{
                py: 1.2,
                px: 2,
                width: '100%',
                height: '100%',
                display: 'flex',
                flexDirection: 'column',
                justifyContent: 'center',
                alignItems: 'center',
                bgcolor: (theme) => alpha(theme.palette.primary.main, 0.5),
                boxShadow: '0px 0px 30px rgba(0, 0, 0, 0.2) inset'
                }}
            >
                <Avatar
                    src={photo}
                    alt={firstName}
                    sx={{
                    width: 100, height: 100,
                    boxShadow: '0px 0px 4px rgba(0, 0, 0, 0.5)', // Ajoutez l'ombre extérieure ici
                    border: '2px solid white', // Ajoutez une bordure blanche autour de l'avatar si nécessaire
                    }}
                />
                <Box
                sx={{
                    mt: 1,
                    width: '100%',
                    display: 'flex',
                    borderRadius: 1.5,
                    flexDirection: 'column',
                    justifyContent: 'center',
                    alignItems: 'center',
                    color: (theme) => theme.palette.primary.contrastText,
                }}
                >
                <Typography variant="h5" gutterBottom>
                    {`${firstName} ${lastName}`}
                </Typography>
                <Typography variant="body2" sx={{ fontStyle: 'italic' }}>
                    {email}
                </Typography>
                <Typography variant="body2" sx={{ fontStyle: 'italic' }}>
                    {username}
                </Typography>
                </Box>
            </Box>
            </Paper>
        </Grid>
        {/* Autres informations de l'employé */}
        <Grid item xs={12} sm={8}>
            <Paper sx={{ padding : 2}}>
                <Typography variant="h6" gutterBottom>
                    Informations supplémentaires
                </Typography>
                <Paper sx={{ padding : 2}} variant="outlined">
                    <Typography variant="body1">
                        Ajouté le: {getFormatDateTime(createdAt)}
                    </Typography>
                    <Typography variant="body1">
                        Dernière modification: {getFormatDateTime(updatedAt)}
                    </Typography>
                </Paper>
                <Typography variant="h6" gutterBottom sx={{ mt:3 }}>
                    Sécurité
                </Typography>
                <Paper sx={{ padding : 2}} variant="outlined">
                    <Button variant="text" onClick={()=> setOpenPwd(!openPwd)} 
                    sx={{textTransform : "initial", textDecoration: "underline"}}>Changer mon mot de passe</Button>
                    {openPwd && <form onSubmit={formik.handleSubmit}>
                        <Grid container>
                            <Grid xs={12} sm={4} md={4}>
                                <Item>
                                    <TheTextField variant="outlined" label="Votre ancien mot de passe" id="oldPassword"
                                        value={formik.values.position} required
                                        onChange={(e) => formik.setFieldValue('oldPassword', e.target.value)}
                                        onBlur={formik.handleBlur}
                                        error={formik.touched.oldPassword && Boolean(formik.errors.oldPassword)}
                                        helperText={formik.touched.oldPassword && formik.errors.oldPassword}
                                        disabled={loadingPut}
                                        type={showPassword ? 'text' : 'password'}
                                        InputProps={{
                                            endAdornment: 
                                            <InputAdornment position="end">
                                                <IconButton
                                                aria-label="toggle password visibility"
                                                onClick={handleClickShowPassword}
                                                onMouseDown={handleMouseDownPassword}
                                                edge="end"
                                                >
                                                {showPassword ? <VisibilityOff /> : <Visibility />}
                                                </IconButton>
                                            </InputAdornment>
                                        }}
                                    />
                                </Item>
                            </Grid>
                            <Grid xs={12} sm={4} md={4}>
                                <Item>
                                    <TheTextField variant="outlined" label="Votre nouveau mot de passe"  id="newPassword1"
                                        value={formik.values.position} required
                                        onChange={(e) => formik.setFieldValue('newPassword1', e.target.value)}
                                        onBlur={formik.handleBlur}
                                        error={formik.touched.newPassword1 && Boolean(formik.errors.newPassword1)}
                                        helperText={formik.touched.newPassword1 && formik.errors.newPassword1}
                                        disabled={loadingPut}
                                        type={showPassword ? 'text' : 'password'}
                                        InputProps={{
                                            endAdornment: 
                                            <InputAdornment position="end">
                                                <IconButton
                                                aria-label="toggle password visibility"
                                                onClick={handleClickShowPassword}
                                                onMouseDown={handleMouseDownPassword}
                                                edge="end"
                                                >
                                                {showPassword ? <VisibilityOff /> : <Visibility />}
                                                </IconButton>
                                            </InputAdornment>
                                        }}
                                    />
                                </Item>
                            </Grid>
                            <Grid xs={12} sm={4} md={4}>
                                <Item>
                                    <TheTextField variant="outlined" label="Confirmer otre nouveau mot de passe"  id="newPassword2"
                                        value={formik.values.position} required
                                        onChange={(e) => formik.setFieldValue('newPassword2', e.target.value)}
                                        onBlur={formik.handleBlur}
                                        error={formik.touched.newPassword2 && Boolean(formik.errors.newPassword2)}
                                        helperText={formik.touched.newPassword2 && formik.errors.newPassword2}
                                        disabled={loadingPut}
                                        type={showPassword ? 'text' : 'password'}
                                        InputProps={{
                                            endAdornment: 
                                            <InputAdornment position="end">
                                                <IconButton
                                                aria-label="toggle password visibility"
                                                onClick={handleClickShowPassword}
                                                onMouseDown={handleMouseDownPassword}
                                                edge="end"
                                                >
                                                {showPassword ? <VisibilityOff /> : <Visibility />}
                                                </IconButton>
                                            </InputAdornment>
                                        }}
                                    />
                                </Item>
                            </Grid>
                            <Grid xs={12} sm={12} md={12}>
                                {passwordChangeData?.passwordChange?.errors?.oldPassword?.map((error, index) =>
                                    <Alert key={index} severity="error">{error?.message}</Alert>
                                    )
                                }
                                {passwordChangeData?.passwordChange?.errors?.newPassword1?.map((error, index) =>
                                    <Alert key={index} severity="error">{error?.message}</Alert>
                                    )
                                }
                                {passwordChangeData?.passwordChange?.errors?.newPassword2?.map((error, index) =>
                                    <Alert key={index} severity="error">{error?.message}</Alert>
                                    )
                                }
                                {passwordChangeData?.passwordChange?.errors?.nonFieldErrors?.map((error, index) =>
                                    <Alert key={index} severity="error">{error?.message}</Alert>
                                    )
                                }
                                <Item sx={{ justifyContent: 'end', flexDirection : 'row' }}>
                                    <Button variant="outlined" sx={{ marginRight : '10px' }} onClick={()=> setOpenPwd(false)}>Annuler</Button>
                                    <Button type="submit" variant="contained"
                                    disabled={!formik.isValid|| loadingPut}
                                    >Valider</Button>
                                </Item>
                            </Grid>
                        </Grid>
                    </form>}
                </Paper>
            </Paper>
        </Grid>
        <Grid item xs={12} sm={12}>
            <Paper sx={{ padding : 2}}>
            <Typography variant="h6" gutterBottom>
                Description
            </Typography>
            <Paper sx={{ padding : 2}} variant="outlined">
                <Typography variant="body1">
                {description ? description : "Aucune description pour l'instant"}
                </Typography>
            </Paper>
            </Paper>
        </Grid>
        <Grid item xs={12} sm={12}>
            <Paper sx={{ padding : 2}}>
            <Typography variant="h6" gutterBottom>
                Observation
            </Typography>
            <Paper sx={{ padding : 2}} variant="outlined">
                <Typography variant="body1">
                {observation ? observation : "Aucune observation pour l'instant"}
                </Typography>
            </Paper>
            </Paper>
        </Grid>
        </Grid>
    );
};
