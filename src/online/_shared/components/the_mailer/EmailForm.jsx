import React, { useEffect } from "react";
import { useFormik } from "formik";
import * as Yup from "yup";
import { Button, Box, Grid } from "@mui/material";
import TheTextField from "../../../../_shared/components/form-fields/TheTextField";

const EmailForm = ({ onChange, onSubmit, defaultEmail, loading=false }) => {
    const formik = useFormik({
        initialValues: {
            recipient: defaultEmail?.recipient || '',
            subject: defaultEmail?.subject || '',
            body: defaultEmail?.body || '',
        },
        validationSchema: Yup.object({
            recipient: Yup.string().email("Email invalide").required("Email requis"),
            subject: Yup.string().required("Sujet requis"),
            body: Yup.string().required("Message requis")
        }),
        onSubmit: (values) => {
            if (onSubmit) onSubmit(values);
        }
    });

    const handleChange = (e) => {
        formik.handleChange(e);
        if (onChange) onChange(formik.values);
    };

    useEffect(()=>{
        formik.setValues({
            recipient: defaultEmail?.recipient || '',
            subject: defaultEmail?.subject || '',
            body: defaultEmail?.body || '',
        })
        onChange({
            recipient: defaultEmail?.recipient || '',
            subject: defaultEmail?.subject || '',
            body: defaultEmail?.body || '',
        })
    }, [defaultEmail])

    return (
        <Box component="form" onSubmit={formik.handleSubmit}>
            <Grid container spacing={3}>
                <Grid item xs={12} sm={12} md={12}>
                    <TheTextField
                        label="Destinataire"
                        name="recipient"
                        type="email"
                        value={formik.values.recipient}
                        onChange={handleChange}
                        onBlur={formik.handleBlur}
                        error={formik.touched.recipient && Boolean(formik.errors.recipient)}
                        helperText={formik.touched.recipient && formik.errors.recipient}
                        fullWidth
                        disabled={loading}
                    />
                </Grid>
                <Grid item xs={12} sm={12} md={12}>
                    <TheTextField
                        label="Sujet"
                        name="subject"
                        value={formik.values.subject}
                        onChange={handleChange}
                        onBlur={formik.handleBlur}
                        error={formik.touched.subject && Boolean(formik.errors.subject)}
                        helperText={formik.touched.subject && formik.errors.subject}
                        fullWidth
                        disabled={loading}
                    />
                </Grid>
                <Grid item xs={12} sm={12} md={12}>
                    <TheTextField
                        label="Message"
                        name="body"
                        multiline
                        rows={8}
                        value={formik.values.body}
                        onChange={handleChange}
                        onBlur={formik.handleBlur}
                        error={formik.touched.body && Boolean(formik.errors.body)}
                        helperText={formik.touched.body && formik.errors.body}
                        fullWidth
                        disabled={loading}
                    />
                </Grid>
                {onSubmit && <Grid item xs={12} sm={12} md={12}>
                                <Button type="submit" variant="contained" color="primary" disabled={loading}>Envoyer</Button>
                            </Grid>
                }
            </Grid>
        </Box>
    );
};

export default EmailForm;
