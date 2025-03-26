import { useState } from "react";
import {
  Grid,
  IconButton,
  InputAdornment,
  Button,
  Alert,
  styled,
  Stack,
  Card,
  Typography,
} from "@mui/material";
import { Visibility, VisibilityOff } from "@mui/icons-material";
import { useFormik } from "formik";
import * as yup from "yup";
import { useMutation } from "@apollo/client";
import { PUT_MY_FIRST_PASSWORD } from "../../../_shared/graphql/mutations/AuthMutations";
import TheTextField from "../../../_shared/components/form-fields/TheTextField";
import { useFeedBacks } from "../../../_shared/context/feedbacks/FeedBacksProvider";


const Item = styled(Stack)(({ theme }) => ({
    backgroundColor: theme.palette.mode === 'dark' ? '#1A2027' : '#fff',
    ...theme.typography.body2,
    padding: theme.spacing(2),
    textAlign: 'center',
    color: theme.palette.text.secondary,
  }));

const ChangePassword = () => {
     const { setNotifyAlert, setConfirmDialog } = useFeedBacks();
    const [showPassword, setShowPassword] = useState(false);

    const handleClickShowPassword = () => setShowPassword((prev) => !prev);
    const handleMouseDownPassword = (event) => event.preventDefault();

    const validationSchema = yup.object({
        oldPassword: yup.string().required("Le mot de passe est obligatoire"),
        newPassword1: yup
        .string()
        .required("Le nouveau mot de passe est obligatoire")
        .min(6, "Le mot de passe doit contenir au moins 6 caractères"),
        newPassword2: yup
        .string()
        .oneOf([yup.ref("newPassword1")], "Les mots de passe ne correspondent pas")
        .required("Veuillez confirmer votre nouveau mot de passe"),
    });

    const formik = useFormik({
        initialValues: {
        oldPassword: "",
        newPassword1: "",
        newPassword2: "",
        },
        validationSchema,
        onSubmit: (values) => {
        firstPasswordChange({ variables: values });
        },
    });

    const [
        firstPasswordChange,
        { loading: loadingPut, data: firstPasswordChangeData, error: firstPasswordChangeError },
    ] = useMutation(PUT_MY_FIRST_PASSWORD, {
        onCompleted: (data) => {
        if (data.firstPasswordChange.success) {
            if (data.firstPasswordChange.token && data.firstPasswordChange.refreshToken) {
                localStorage.setItem('token', JSON.stringify(data.firstPasswordChange.token));
                localStorage.setItem('refreshToken', JSON.stringify(data.firstPasswordChange.refreshToken));
            }
            setNotifyAlert({
            isOpen: true,
            message: "Mot de passe changé avec succès",
            type: "success",
            });
            window.location.reload();
        } else {
            setNotifyAlert({
            isOpen: true,
            message: "Erreur lors du changement de mot de passe",
            type: "error",
            });
        }
        },
        onError: () => {
        setNotifyAlert({
            isOpen: true,
            message: "Une erreur s'est produite ! Veuillez réessayer.",
            type: "error",
        });
        },
    });

    return (<Card sx={{ maxWidth: 460, mx: 'auto', p: 3 }}>
            <Typography variant="h6" textAlign="center" gutterBottom>
                Votre mot de passe initial doit être changé pour sécuriser votre compte. Veuillez en choisir un nouveau.
            </Typography>
            <form onSubmit={formik.handleSubmit}>
                <Grid container>
                    <Grid item xs={12} sm={12} md={12}>
                    <Item>
                        <TheTextField
                        variant="outlined"
                        label="Votre ancien mot de passe"
                        id="oldPassword"
                        value={formik.values.position}
                        required
                        onChange={(e) =>
                            formik.setFieldValue('oldPassword', e.target.value)
                        }
                        onBlur={formik.handleBlur}
                        error={
                            formik.touched.oldPassword &&
                            Boolean(formik.errors.oldPassword)
                        }
                        helperText={
                            formik.touched.oldPassword &&
                            formik.errors.oldPassword
                        }
                        disabled={loadingPut}
                        type={showPassword ? 'text' : 'password'}
                        InputProps={{
                            endAdornment: (
                            <InputAdornment position="end">
                                <IconButton
                                aria-label="toggle password visibility"
                                onClick={handleClickShowPassword}
                                onMouseDown={handleMouseDownPassword}
                                edge="end"
                                >
                                {showPassword ? (
                                    <VisibilityOff />
                                ) : (
                                    <Visibility />
                                )}
                                </IconButton>
                            </InputAdornment>
                            ),
                        }}
                        />
                    </Item>
                    </Grid>
                    <Grid item xs={12} sm={12} md={12}>
                    <Item>
                        <TheTextField
                        variant="outlined"
                        label="Votre nouveau mot de passe"
                        id="newPassword1"
                        value={formik.values.position}
                        required
                        onChange={(e) =>
                            formik.setFieldValue('newPassword1', e.target.value)
                        }
                        onBlur={formik.handleBlur}
                        error={
                            formik.touched.newPassword1 &&
                            Boolean(formik.errors.newPassword1)
                        }
                        helperText={
                            formik.touched.newPassword1 &&
                            formik.errors.newPassword1
                        }
                        disabled={loadingPut}
                        type={showPassword ? 'text' : 'password'}
                        InputProps={{
                            endAdornment: (
                            <InputAdornment position="end">
                                <IconButton
                                aria-label="toggle password visibility"
                                onClick={handleClickShowPassword}
                                onMouseDown={handleMouseDownPassword}
                                edge="end"
                                >
                                {showPassword ? (
                                    <VisibilityOff />
                                ) : (
                                    <Visibility />
                                )}
                                </IconButton>
                            </InputAdornment>
                            ),
                        }}
                        />
                    </Item>
                    </Grid>
                    <Grid item xs={12} sm={12} md={12}>
                    <Item>
                        <TheTextField
                        variant="outlined"
                        label="Confirmer otre nouveau mot de passe"
                        id="newPassword2"
                        value={formik.values.position}
                        required
                        onChange={(e) =>
                            formik.setFieldValue('newPassword2', e.target.value)
                        }
                        onBlur={formik.handleBlur}
                        error={
                            formik.touched.newPassword2 &&
                            Boolean(formik.errors.newPassword2)
                        }
                        helperText={
                            formik.touched.newPassword2 &&
                            formik.errors.newPassword2
                        }
                        disabled={loadingPut}
                        type={showPassword ? 'text' : 'password'}
                        InputProps={{
                            endAdornment: (
                            <InputAdornment position="end">
                                <IconButton
                                aria-label="toggle password visibility"
                                onClick={handleClickShowPassword}
                                onMouseDown={handleMouseDownPassword}
                                edge="end"
                                >
                                {showPassword ? (
                                    <VisibilityOff />
                                ) : (
                                    <Visibility />
                                )}
                                </IconButton>
                            </InputAdornment>
                            ),
                        }}
                        />
                    </Item>
                    </Grid>
                    <Grid item xs={12} sm={12} md={12}>
                    {firstPasswordChangeData?.firstPasswordChange?.errors?.oldPassword?.map(
                        (error, index) => (
                        <Alert key={index} severity="error">
                            {error?.message}
                        </Alert>
                        ),
                    )}
                    {firstPasswordChangeData?.firstPasswordChange?.errors?.newPassword1?.map(
                        (error, index) => (
                        <Alert key={index} severity="error">
                            {error?.message}
                        </Alert>
                        ),
                    )}
                    {firstPasswordChangeData?.firstPasswordChange?.errors?.newPassword2?.map(
                        (error, index) => (
                        <Alert key={index} severity="error">
                            {error?.message}
                        </Alert>
                        ),
                    )}
                    {firstPasswordChangeData?.firstPasswordChange?.errors?.nonFieldErrors?.map(
                        (error, index) => (
                        <Alert key={index} severity="error">
                            {error?.message}
                        </Alert>
                        ),
                    )}
                    <Item sx={{ justifyContent: 'end', flexDirection: 'row' }}>
                        <Button
                        type="submit"
                        variant="contained"
                        disabled={!formik.isValid || loadingPut}
                        >
                        Valider
                        </Button>
                    </Item>
                    </Grid>
                </Grid>
            </form>
        </Card>
    );
};

export default ChangePassword;
